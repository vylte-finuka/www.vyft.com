import { NextApiRequest, NextApiResponse } from "next";
import { Checkout } from "checkout-sdk-node";

const checkout = new Checkout(process.env.CKO_SECRET_KEY as string);

export default async function checkSubscriptionStatus(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const { userToken, auth0UserId } = req.body;

  if (!auth0UserId) {
    // Correction : retourne 200 avec abonnement inactif et date nulle
    return res.status(200).json({ hasActiveSubscription: false, expired: true, subscriptionStart: null });
  }

  try {
    // Récupérer les métadonnées utilisateur depuis Auth0
    const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const userInfoResponse = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    const userInfo = await userInfoResponse.json();
    console.log("userInfo.user_metadata.subscription_start =", userInfo.user_metadata?.subscription_start);

    // On récupère la date d'abonnement
    const subscriptionStart =
      userInfo.app_metadata?.subscription_start ||
      userInfo.user_metadata?.subscription_start ||
      null;
    let expired = true;
    if (subscriptionStart) {
      const startDate = new Date(subscriptionStart);
      const now = new Date();
      const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.floor((nowDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24));
      expired = diffDays >= 30;
    }

    // Correction : la réponse ne dépend plus de subid
    return res.status(200).json({
      hasActiveSubscription: !expired && !!subscriptionStart,
      expired,
      subscriptionStart,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la vérification de l'abonnement" });
  }
}
