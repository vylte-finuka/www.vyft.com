import { NextApiRequest, NextApiResponse } from "next";
import { SquareClient, SquareEnvironment, SquareError } from "square";

const client = new SquareClient({
  environment: SquareEnvironment.Production,
  token: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function checkSubscriptionStatus(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const { auth0UserId, userToken } = req.body;
  if (!auth0UserId || !userToken) {
    return res.status(400).json({ error: "auth0UserId ou userToken manquant" });
  }

  // Récupère le customerId depuis Auth0 user_metadata.subid
  const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const userInfoResponse = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  });
  if (!userInfoResponse.ok) {
    return res.status(400).json({ error: "Impossible de récupérer le subid Auth0." });
  }
  const userInfo = await userInfoResponse.json();
  const squareCustomerId = userInfo.user_metadata?.subid ?? null;
  const subobjid = userInfo.user_metadata?.subobjid ?? null;
  if (!squareCustomerId) {
    return res.status(404).json({ error: "Aucun customerId Square trouvé dans Auth0." });
  }

  try {
    let hasActiveSubscription = false;

    // Si subobjid existe, considère l'abonnement comme actif
    if (subobjid) {
      hasActiveSubscription = true;
    } else {
      // Vérifier les abonnements actifs Square pour ce customerId
      const subscriptionsResponse = await client.subscriptions.search({
        query: {
          filter: {
            customerIds: [squareCustomerId],
          },
        },
      });

      if (subscriptionsResponse.subscriptions && subscriptionsResponse.subscriptions.length > 0) {
        hasActiveSubscription = true;
      }
    }

    return res.status(200).json({ hasActiveSubscription });
  } catch (error) {
    if (error instanceof SquareError) {
      console.error("Erreur Square :", error.message);
    } else {
      console.error("Erreur inattendue :", error);
    }
    return res.status(500).json({ error: "Erreur lors de la vérification de l'abonnement" });
  }
}