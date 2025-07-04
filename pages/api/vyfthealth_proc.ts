import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import clientPromise from "./lib/mongodb"; // Import pour accéder à MongoDB

const stripe = new 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", {
  apiVersion: "2025-04-30.basil",
});

type ResponseData = {
  success: boolean;
  message: string;
  data?: {
    enseigne?: string;
    yearlySteps: number;
    totalDistance: number;
    estimatedRevenue: number;
    dailySteps: number;
    dailyDistance: number;
    dailyRevenue: number;
  };
};

// Stocker les métriques précédentes pour éviter les envois redondants
let previousMetrics = {
  totalDistance: 0,
  dailySteps: 0,
  dailyRevenue: 0,
  accumulatedValue: 0, // Valeur accumulée envoyée à Stripe
};

/**
 * Envoie les métriques calculées à Stripe via un événement de facturation.
 *
 * @param stripeCustomerId - Identifiant du client Stripe
 * @param incrementalValue - Valeur incrémentale calculée
 */
async function sendMetricsToStripe(stripeCustomerId: string, incrementalValue: number) {
  try {

    const timestamp = Math.floor(Date.now() / 1000);

    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: "meterstep",
      timestamp,
      payload: {
        stripe_customer_id: stripeCustomerId,
        value: Math.round(incrementalValue).toString(), // Envoyer la valeur accumulée arrondie
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

      const client = await clientPromise;
      const db = client.db("vyfbase");
      const collection = db.collection("vyfthealth");

      const sensorData = await collection
        .find({ enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } })
        .toArray();

      if (sensorData.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Aucune donnée trouvée pour l'enseigne "${enseigneFilter}".`,
        });
      }

      let dailySteps = 0;
      let dailyDistance = 0;

      let yearlySteps = 0;
      let totalDistance = 0;

      let enseigne = "";

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      sensorData.forEach((item) => {
        const steps = item.steps || 0;
        const distance = parseFloat(item.distance) || 0;
        const date = new Date(item.date); // Utilisation de "date" au lieu de "timestamp"

        if (date >= oneYearAgo) {
          yearlySteps += steps;
          totalDistance += distance;
        }

        if (date >= twentyFourHoursAgo) {
          dailySteps += steps;
          dailyDistance += distance;
        }

        if (item.enseigne) {
          enseigne = item.enseigne;
        }
      });

      const charges = await stripe.charges.list({
        limit: 100,
      });

      const totalRevenue = charges.data.reduce((sum, charge) => {
        if (charge.paid && !charge.refunded) {
          return sum + charge.amount / 100;
        }
        return sum;
      }, 0);

      const dailyRevenue = charges.data.reduce((sum, charge) => {
        const chargeDate = new Date(charge.created * 1000);
        if (charge.paid && !charge.refunded && chargeDate >= twentyFourHoursAgo) {
          return sum + charge.amount / 100;
        }
        return sum;
      }, 0);
// Stocker l'identifiant de la dernière entrée traitée
let lastProcessedId: string | null = null;

// Récupérer dans MongoDB les dernières entrées pour l'enseigne
const lastEntries = await collection
  .find({ enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } })
  .sort({ date: -1 })
    .limit(1)
    .toArray();
  
  const lastEntry = lastEntries[0];
  
  // Vérifier si une nouvelle entrée est détectée
  if (lastEntry) {
    const currentEntryId = lastEntry._id.toString();
    const entryDate = new Date(lastEntry.date); // Convertir la date de l'entrée en objet Date
    const now = new Date(); // Obtenir la date et l'heure actuelles
  
    // Vérifier si cette entrée est différente de la dernière traitée et non marquée comme traitée
    if ((!lastProcessedId || currentEntryId !== lastProcessedId) && !lastEntry.processed) {
      const lastSteps: number = lastEntry.steps || 0;
      const lastDistance: number = parseFloat(lastEntry.distance) || 0;
  
      // Calculer les valeurs incrémentales basées sur les dernières entrées
      const incrementalSteps = lastSteps * 0.3; // Ratio de 30 % sur les steps
      const incrementalDistance = lastDistance * 0.3; // Ratio de 30 % sur la distance
  
      // Calculer la valeur incrémentale totale
      const incrementalValue = Math.round(incrementalSteps + incrementalDistance);
  
      // Envoyer les métriques calculées à Stripe
      await sendMetricsToStripe(stripeCustomerId, incrementalValue);
  
      console.log("Nouvelle entrée détectée. Valeur incrémentale envoyée à Stripe :", incrementalValue);
  
      // Mettre à jour l'identifiant de la dernière entrée traitée
      lastProcessedId = currentEntryId;
  
      // Marquer l'entrée comme traitée dans MongoDB
      await collection.updateOne({ _id: lastEntry._id }, { $set: { processed: true } });
      console.log("Entrée marquée comme traitée dans MongoDB :", currentEntryId);
    } else {
      // Si l'entrée est la même que la dernière traitée ou déjà marquée comme traitée
      console.log("Aucune nouvelle entrée détectée ou entrée déjà traitée. Valeur reste à 0.");
      await sendMetricsToStripe(stripeCustomerId, 0); // Envoyer 0 à Stripe
    }
  } else {
    // Si aucune entrée n'existe dans la base de données, envoyer 0 à Stripe
    console.log("Aucune entrée trouvée dans la base de données. Valeur réinitialisée à 0.");
    await sendMetricsToStripe(stripeCustomerId, 0); // Envoyer 0 à Stripe
  }

res.status(200).json({
success: true,
message: "Données calculées et envoyées à Stripe avec succès.",
data: {
  enseigne,
  yearlySteps,
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
}}}
