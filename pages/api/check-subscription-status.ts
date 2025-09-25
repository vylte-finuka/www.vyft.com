import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe("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", { apiVersion: "2025-04-30.basil" });

export default async function checkSubrcriptionStatus(req: NextApiRequest, res: NextApiResponse) {

    // Vérification de la clé API
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const { userToken, auth0UserId } = req.body;

  if (!auth0UserId) {
    return res.status(400).json({ error: "auth0UserId manquant" });
  }

  try {
    // Récupérer le client Stripe via auth0UserId
    const customers = await stripe.customers.list({
      expand: ["data.subscriptions"],
    });

    const customer = customers.data.find((c) => c.metadata?.auth0UserId === auth0UserId);

    if (!customer) {
      return res.status(200).json({ hasActiveSubscription: false });
    }

    // Vérifier si un abonnement actif existe
    const activeSubscription = customer.subscriptions?.data.find(
      (sub) => sub.status === "active"
    );

    if (activeSubscription) {
      return res.status(202).json({ hasActiveSubscription: true });
    }

    return res.status(201).json({ hasActiveSubscription: false });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'abonnement :", error);
    return res.status(500).json({ error: "Erreur lors de la vérification de l'abonnement" });
  }
}
