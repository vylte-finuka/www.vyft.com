import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51OlpeQDrg8ui7gWs1DDcKWe98MhDQaHoZwCEAzFQwumnXm5BL2MicQD2eN3UC4h9iDn0dca9VMxF4eVfvKfmvSnp00oaEldISy", { apiVersion: "2025-04-30.basil" });

export default async function createOrRetriveCustomer(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { auth0UserId, userToken, action, customerId } = req.body;

  if (!auth0UserId || !userToken || !action) {
    console.error("Paramètres manquants :", { auth0UserId, userToken, action });
    return res.status(400).json({ error: "Tous les champs requis (auth0UserId, userToken, action) doivent être fournis." });
  }

  try {
    if (action === "create") {
      console.log("Création ou récupération d'un client Stripe...");

      // Vérifier si le client Stripe existe déjà via les métadonnées
      const customers = await stripe.customers.list({
        limit: 100, // Augmenter la limite si nécessaire
      });

      let customer = customers.data.find((c) => c.metadata?.auth0UserId === auth0UserId);

      if (customer) {
        console.log("Client Stripe existant trouvé :", customer.id);
      } else {
        // Créer un nouveau client Stripe si aucun n'existe
        customer = await stripe.customers.create({
          metadata: {
            auth0UserId, // Stocker l'ID utilisateur Auth0 dans les métadonnées
          },
        });
        console.log("Nouveau client Stripe créé :", customer.id);
      }

      // Mettre à jour les métadonnées utilisateur dans Auth0 avec le customerId
      const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
      if (!auth0Domain) {
        throw new Error("Le domaine Auth0 (NEXT_PUBLIC_AUTH0_DOMAIN) n'est pas configuré.");
      }

      const auth0Response = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // Utiliser le userToken pour l'autorisation
        },
        body: JSON.stringify({
          user_metadata: {
            subid: customer.id, // Ajouter le customerId Stripe comme subid
          },
        }),
      });

      if (!auth0Response.ok) {
        console.error("Erreur lors de la mise à jour des métadonnées utilisateur dans Auth0 :", await auth0Response.text());
        throw new Error("Erreur lors de la mise à jour des métadonnées utilisateur dans Auth0.");
      }

      console.log("Mise à jour des métadonnées utilisateur dans Auth0 réussie.");

      // Créer une session Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer: customer.id,
        line_items: [
          {
            price: "price_1RZTCsDrg8ui7gWsp9xLVr74", // Remplacez par l'ID de votre tarif Stripe
          },
        ],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      if (!session || !session.id) {
        console.error("Erreur : session Stripe Checkout non créée.");
        return res.status(500).json({ error: "Erreur lors de la création de la session Stripe Checkout." });
      }

      console.log("Session Stripe Checkout créée :", session.id);

      return res.status(200).json({ sessionId: session.id, customerId: customer.id });
    } else if (action === "unsubscribe") {
      console.log("Annulation d'un abonnement Stripe...");

      try {
        // Récupérer les abonnements actifs du client
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "active", // Filtrer uniquement les abonnements actifs
          limit: 1, // Récupérer uniquement le premier abonnement actif
        });

        if (subscriptions.data.length === 0) {
          console.error("Aucun abonnement actif trouvé pour ce client.");
          return res.status(404).json({ error: "Aucun abonnement actif trouvé pour ce client." });
        }

        const subscriptionId = subscriptions.data[0].id;

        // Annuler l'abonnement
        const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

        console.log("Abonnement annulé :", deletedSubscription.id);

        return res.status(200).json({
          success: true,
          message: "Abonnement annulé avec succès.",
          deletedSubscription,
        });
      } catch (error: any) {
        console.error("Erreur lors de l'annulation de l'abonnement :", error.message || error);
        return res.status(500).json({ error: "Erreur lors de l'annulation de l'abonnement Stripe." });
      }
    } else {
      console.error("Action non valide :", action);
      return res.status(400).json({ error: "Action non valide. Utilisez 'create' ou 'unsubscribe'." });
    }
  } catch (error: any) {
    console.error("Erreur Stripe ou Auth0 :", error.message || error);
    return res.status(500).json({ error: "Erreur lors de la gestion de l'abonnement ou des métadonnées Auth0." });
  }
}
