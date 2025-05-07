import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import clientPromise from "./lib/mongodb"; // Import pour accéder à MongoDB

// Remplacez par votre clé Stripe de production et assurez-vous d'utiliser une version d'API valide.
const stripe = new Stripe("sk_test_51OlpeQDrg8ui7gWs1DDcKWe98MhDQaHoZwCEAzFQwumnXm5BL2MicQD2eN3UC4h9iDn0dca9VMxF4eVfvKfmvSnp00oaEldISy", { apiVersion: "2022-11-15" });

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

// Stocker les métriques précédentes pour éviter les envois redondants
let previousMetrics = {
  totalSteps: 0,
  totalDistance: 0,
  dailyRevenue: 0,
};

/**
 * Envoie les métriques calculées à Stripe via un événement de facturation.
 *
 * @param stripeCustomerId - Identifiant du client Stripe
 * @param totalSteps - Nombre total de pas
 * @param totalDistance - Distance totale parcourue
 * @param dailyRevenue - Revenu journalier calculé
 */
async function sendMetricsToStripe(
  stripeCustomerId: string,
  totalSteps: number,
  totalDistance: number,
  dailyRevenue: number
) {
  try {
    // Vérifier si les métriques ont changé
    if (
      totalSteps === previousMetrics.totalSteps &&
      totalDistance === previousMetrics.totalDistance &&
      dailyRevenue === previousMetrics.dailyRevenue
    ) {
      console.log("Les métriques n'ont pas changé. Aucun événement envoyé à Stripe.");
      return; // Ne rien faire si les métriques n'ont pas changé
    }

    // Mettre à jour les métriques précédentes
    previousMetrics = { totalSteps, totalDistance, dailyRevenue };

    const timestamp = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes

    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: "meterstep",
      timestamp,
      payload: {
        stripe_customer_id: stripeCustomerId,
        value: dailyRevenue.toString(),
        total_steps: totalSteps.toString(),
        total_distance: totalDistance.toString(),
      },
    });

    console.log("Meter Event envoyé à Stripe :", meterEvent);
    return meterEvent;
  } catch (error: any) {
    console.error("Erreur lors de l'envoi des métriques à Stripe :", error.message);
    throw error;
  }
}

/**
 * API handler Next.js.
 * - GET : Récupère les métriques cumulées et les envoie à Stripe.
 */
export default async function Vyfthealth_proc(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  if (req.method === "GET") {
    try {
      // Récupérer le paramètre `enseigne` depuis la requête
      const { enseigne: enseigneFilter, stripeCustomerId } = req.query;

      if (!enseigneFilter || typeof enseigneFilter !== "string") {
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'enseigne' est requis pour accéder aux données.",
        });
      }

      if (!stripeCustomerId || typeof stripeCustomerId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'stripeCustomerId' est requis pour envoyer les métriques à Stripe.",
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

      // Envoyer les métriques calculées à Stripe uniquement si elles ont changé
      await sendMetricsToStripe(stripeCustomerId, totalSteps, totalDistance, dailyRevenue);

      res.status(200).json({
        success: true,
        message: "Données calculées et envoyées à Stripe avec succès.",
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