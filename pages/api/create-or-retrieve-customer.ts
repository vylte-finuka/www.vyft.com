import { NextApiRequest, NextApiResponse } from "next";
import { Checkout } from "checkout-sdk-node";

const checkout = new Checkout(process.env.CKO_SECRET_KEY as string);

export default async function createOrRetrieveCustomer(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { auth0UserId, userToken, action, customerId } = req.body;

  if (!auth0UserId || !userToken || !action) {
    return res.status(400).json({ error: "Tous les champs requis (auth0UserId, userToken, action) doivent être fournis." });
  }

  try {
    // Récupérer les infos utilisateur depuis Auth0
    const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const userInfoResponse = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!userInfoResponse.ok) {
      console.error("Erreur Auth0 userInfoResponse:", await userInfoResponse.text());
      throw new Error("Impossible de récupérer les infos utilisateur Auth0.");
    }
    const userInfo = await userInfoResponse.json();
    const userName = userInfo.name || userInfo.nickname || "";
    const userEmail = userInfo.email || "";

    if (action === "create") {
      let ckoCustomerId: string | undefined;

      // Vérifie si l'ID client existe déjà dans Auth0
      ckoCustomerId = userInfo.user_metadata?.subid;
      console.log("subid récupéré depuis Auth0 :", ckoCustomerId);

      if (!ckoCustomerId) {
        // Si pas d'ID, tente de créer le client Checkout.com
        try {
          const customerResponse = await checkout.customers.create({
            email: userEmail,
            name: userName
          }) as { id: string };
          ckoCustomerId = customerResponse.id;
          console.log("Client créé Checkout.com:", customerResponse);

          // Met à jour Auth0 avec l'id client Checkout.com
          const updateResponse = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              user_metadata: {
                subscription_start: new Date().toISOString(),
                subid: ckoCustomerId, // ou stripeCustomerId selon ton système
              },
            }),
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error("Erreur PATCH Auth0:", errorText);
            throw new Error("Erreur lors de la mise à jour du subid dans Auth0: " + errorText);
          }
        } catch (err: any) {
          console.error("Erreur création client Checkout.com:", err);
          // Si l'email existe déjà, retourne une erreur explicite
          if (err.body && err.body.error_codes && err.body.error_codes.includes("customer_email_already_exists")) {
            return res.status(500).json({ error: "L'utilisateur existe déjà, mais aucun subid n'est enregistré dans Auth0." });
          } else {
            return res.status(500).json({ error: "Erreur Checkout.com: " + (err.message || err) });
          }
        }
      }

      // Ici, on ne recrée jamais le client si ckoCustomerId existe déjà !
      // Création du lien de paiement avec l'ID client existant ou nouvellement créé
      try {
        console.log("Payload PaymentLink:", {
          amount: 300,
          currency: "EUR",
          reference: "Vyft program lite",
          customer: { id: ckoCustomerId },
          billing: { address: { country: "FR" } },
          description: "Vyft program allow manage all your business in time.",
        });

        const paymentLinkResponse = await checkout.paymentLinks.create({
          amount: 30000,
          currency: "EUR",
          reference: "Vyft program lite",
          processing_channel_id: process.env.CKO_CHANNEL_ID,
          customer: {
            id: ckoCustomerId
          },
          billing: {
            address: {
              country: "FR"
            }
          },
          description: "Vyft program allow manage all your business in time.",
        }) as { _links: { redirect: { href: string } } };

        console.log("Lien de paiement généré :", paymentLinkResponse);

        const paymentUrl = paymentLinkResponse._links.redirect.href;

        return res.status(200).json({ customerId: ckoCustomerId, paymentUrl });
      } catch (err: any) {
        console.error("Erreur création PaymentLink Checkout.com:", err);
        if (err.body) {
          console.error("Détail erreur Checkout.com:", JSON.stringify(err.body, null, 2));
        }
        return res.status(500).json({ error: "Erreur lors de la création du lien de paiement.", details: err.body });
      }
    } else if (action === "unsubscribe") {
      // À compléter selon ta logique Checkout.com
      return res.status(200).json({ success: true, message: "Annulation de l'abonnement (implémentation à compléter)." });
    } else {
      return res.status(400).json({ error: "Action non valide. Utilisez 'create' ou 'unsubscribe'." });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Erreur lors de la gestion de l'abonnement." });
  }
}
