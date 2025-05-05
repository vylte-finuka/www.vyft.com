import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import clientPromise from "../lib/mongodb"; // Import pour accéder à MongoDB

// Remplacez par votre clé Stripe de production et assurez-vous d'utiliser une version d'API valide.
const stripe = new Stripe("sk_test_51OlpeQDrg8ui7gWs1DDcKWe98MhDQaHoZwCEAzFQwumnXm5BL2MicQD2eN3UC4h9iDn0dca9VMxF4eVfvKfmvSnp00oaEldISy", { apiVersion: "2025-04-30.basil" });

type ResponseData = {
  success: boolean;
  message: string;
  data?: {
    enseigne?: string;
    totalSteps: number;
    totalDistance: number;
    estimatedRevenue: number;
    dailySteps: number;
    dailyDistance: number;
    dailyRevenue: number;
  };
};

/**
 * Récupère le subid (customerId Stripe) depuis les métadonnées utilisateur Auth0.
 *
 * @param auth0UserId - ID utilisateur Auth0
 * @param userToken - Token d'accès Auth0
 */
async function getSubidFromAuth0(auth0UserId: string, userToken: string): Promise<string | null> {
  try {
    const auth0Domain = process.env.AUTH0_DOMAIN; // Domaine Auth0

    const response = await fetch(`https://${auth0Domain}/api/v2/users/${auth0UserId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des métadonnées utilisateur dans Auth0.");
    }

    const userData = await response.json();
    return userData.user_metadata?.subid || null; // Retourner le subid si disponible
  } catch (error) {
    console.error("Erreur lors de la récupération du subid :", error);
    return null;
  }
}

/**
 * Calcule la consommation et crée un meter event Stripe pour la facturation à la consommation.
 *
 * @param distanceMeters - Distance parcourue (en mètres)
 * @param visitors - Nombre de visiteurs uniques
 * @param pricePerStep - Tarif par pas
 * @param pricePerVisitor - Tarif par visiteur
 * @param stripeCustomerId - Identifiant du client Stripe associé
 */
async function processMetrics(
  distanceMeters: number,
  visitors: number,
  pricePerStep: number,
  pricePerVisitor: number,
  stripeCustomerId: string
) {
  try {
    const stepLength = 0.7; // Longueur moyenne d'un pas en mètres
    const computedSteps = Math.floor(distanceMeters / stepLength);
    const stepsRevenue = computedSteps * pricePerStep;
    const visitorsRevenue = visitors * pricePerVisitor;
    const totalRevenue = Math.round(stepsRevenue + visitorsRevenue);

    console.log(`Revenu calculé : ${totalRevenue} €`);

    // Création d'un meter event via l'API Stripe Billing
    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: "daily_consumption",
      payload: {
        value: totalRevenue.toString(),
        stripe_customer_id: stripeCustomerId,
        total_steps: computedSteps.toString(),
        total_distance: distanceMeters.toString(),
        visitors: visitors.toString(),
      },
    });

    console.log("Meter Event enregistré avec succès :", meterEvent);
    return meterEvent;
  } catch (error: any) {
    console.error("Erreur lors de la facturation :", error.message);
    throw error;
  }
}

/**
 * API handler Next.js.
 * - POST : Récupère les données de capteur depuis MongoDB, met à jour les métriques et envoie un meter event à Stripe.
 * - GET : Récupère les métriques cumulées.
 */
export default async function Vyfthealth_proc(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  if (req.method === "GET") {
    try {
      // Récupérer le paramètre `enseigne` depuis la requête
      const { enseigne: enseigneFilter } = req.query;

      if (!enseigneFilter || typeof enseigneFilter !== "string") {
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'enseigne' est requis pour accéder aux données.",
        });
      }

      // Connexion à MongoDB
      const client = await clientPromise;
      const db = client.db("vyfbase");
      const collection = db.collection("vyfthealth");

      // Filtrer les données directement dans MongoDB
      const sensorData = await collection
        .find({ enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } }) // Filtrage insensible à la casse
        .toArray();

      if (sensorData.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Aucune donnée trouvée pour l'enseigne "${enseigneFilter}".`,
        });
      }

      // Réinitialiser les métriques journalières
      let dailySteps = 0;
      let dailyDistance = 0;

      // Calculer les métriques globales
      let totalSteps = 0;
      let totalDistance = 0;

      // Ajouter le champ enseigne
      let enseigne = "";

      sensorData.forEach((item) => {
        const steps = item.steps || 0;
        const distance = parseFloat(item.distance) || 0;

        dailySteps += steps;
        dailyDistance += distance;

        totalSteps += steps;
        totalDistance += distance;

        // Récupérer l'enseigne si elle est présente
        if (item.enseigne) {
          enseigne = item.enseigne;
        }
      });

      // Récupérer les paiements Stripe pour calculer le revenu total
      const charges = await stripe.charges.list({
        limit: 100, // Limite des transactions à récupérer
      });

      const totalRevenue = charges.data.reduce((sum, charge) => {
        if (charge.paid && !charge.refunded) {
          return sum + charge.amount / 100; // Convertir les centimes en euros
        }
        return sum;
      }, 0);

      // Calcul du revenu journalier basé sur les paiements récents
      const today = new Date().toISOString().split("T")[0];
      const dailyRevenue = charges.data.reduce((sum, charge) => {
        const chargeDate = new Date(charge.created * 1000).toISOString().split("T")[0];
        if (charge.paid && !charge.refunded && chargeDate === today) {
          return sum + charge.amount / 100; // Convertir les centimes en euros
        }
        return sum;
      }, 0);

      res.status(200).json({
        success: true,
        message: "Données calculées avec succès.",
        data: {
          enseigne, // Inclure l'enseigne dans la réponse
          totalSteps,
          totalDistance,
          estimatedRevenue: totalRevenue,
          dailySteps,
          dailyDistance,
          dailyRevenue,
        },
      });
    } catch (error) {
      console.error("Erreur lors du calcul des données :", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors du calcul des données.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({
      success: false,
      message: "Méthode non autorisée.",
    });
  }
}