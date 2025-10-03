import { NextApiRequest, NextApiResponse } from "next";
import { Square, SquareClient, SquareEnvironment, SquareError } from "square";
import { randomUUID } from "crypto";
import axios from "axios";

const client = new SquareClient({
  environment: SquareEnvironment.Production,
  token: process.env.SQUARE_ACCESS_TOKEN,
});

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
  console.log("[create-or-retrieve-customer] req.body:", { auth0UserId: !!auth0UserId, action, providedCustomerId: customerId ? true : false });

  // Récupère le customerId depuis Auth0 user_metadata.subid
  let squareCustomerId = customerId;
  if (!squareCustomerId) {
    try {
      const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
      console.log("[create-or-retrieve-customer] fetching Auth0 user metadata from:", `${auth0Domain}/api/v2/users/${auth0UserId}`);
      const userInfoResponse = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("[create-or-retrieve-customer] Auth0 userinfo status:", userInfoResponse.status);
      if (!userInfoResponse.ok) {
        const text = await userInfoResponse.text().catch(() => "<no-body>");
        console.error("[create-or-retrieve-customer] Auth0 userinfo error body:", text);
        return res.status(400).json({ error: "Impossible de récupérer le subid Auth0." });
      }
      const userInfo = await userInfoResponse.json();
      console.log("[create-or-retrieve-customer] Auth0 userinfo:", JSON.stringify({
        sub: userInfo.sub,
        family_name: userInfo.family_name,
        nickname: userInfo.nickname,
        user_metadata: userInfo.user_metadata ? Object.keys(userInfo.user_metadata) : null
      }));
      squareCustomerId = userInfo.user_metadata?.subid ?? null;
      console.log("[create-or-retrieve-customer] squareCustomerId from Auth0:", squareCustomerId);
    } catch (err) {
      console.error("[create-or-retrieve-customer] erreur lors de la récupération du subid Auth0:", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des métadonnées Auth0." });
    }
  } else {
    console.log("[create-or-retrieve-customer] customerId fourni dans le body:", squareCustomerId);
  }

  try {
    if (action === "create") {
      // Récupérer les infos utilisateur depuis Auth0 pour le nom
      const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
      if (!auth0Domain) {
        throw new Error("Le domaine Auth0 (NEXT_PUBLIC_AUTH0_DOMAIN) n'est pas configuré.");
      }

      const userInfoResponse = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("[create-or-retrieve-customer] second Auth0 userinfo status:", userInfoResponse.status);
      if (!userInfoResponse.ok) {
        const body = await userInfoResponse.text().catch(() => "<no-body>");
        console.error("[create-or-retrieve-customer] Auth0 userinfo fetch failed:", body);
        throw new Error("Impossible de récupérer les données utilisateur Auth0.");
      }

      const userInfo = await userInfoResponse.json();
 
      const givenName = `${userInfo.family_name || ""} ${userInfo.given_name || userInfo.nickname || ""}`.trim();
      console.log("[create-or-retrieve-customer] resolved givenName:", givenName);

      // Création ou récupération du client Square
      let customer;
      console.log("[create-or-retrieve-customer] Listing customers (pagination) to find referenceId:", auth0UserId);
      // collecte les clients renvoyés (log limité)
      const customersList: any[] = [];
      try {
        // la méthode list peut retourner un pager (selon version du SDK)
        const pager = await client.customers.list({ limit: 100 });
        if (pager) {
          // si pager est un objet contenant customers
          if (Array.isArray((pager as any).customers)) {
            (pager as any).customers.forEach((c: any) => customersList.push({ id: c.id, referenceId: c.referenceId }));
          } else {
            // sinon essayer d'itérer
            try {
              for await (const c of pager as any) {
                customersList.push({ id: c.id, referenceId: c.referenceId });
              }
            } catch (iterErr) {
              console.warn("[create-or-retrieve-customer] impossible d'itérer le pager customers:", iterErr);
            }
          }
        }
      } catch (listErr) {
        console.warn("[create-or-retrieve-customer] client.customers.list erreur:", listErr);
      }
      console.log("[create-or-retrieve-customer] customers sample:", customersList.slice(0, 10));

      for await (const c of (customersList.length ? customersList : [])) {
        if (c.referenceId === auth0UserId) {
          customer = c;
          break;
        }
      }

      if (!customer) {
        console.log("[create-or-retrieve-customer] aucun customer trouvé, création d'un nouveau client Square");
        const createCustomerResponse = await client.customers.create({
          idempotencyKey: randomUUID(),
          givenName: givenName,
          emailAddress: userInfo.email || "",
          referenceId: auth0UserId,
        } as any);
        console.log("[create-or-retrieve-customer] createCustomerResponse:", JSON.stringify({
          customer: createCustomerResponse?.customer ? { id: createCustomerResponse.customer.id } : null
        }));
        customer = createCustomerResponse.customer;
      } else {
        console.log("[create-or-retrieve-customer] customer trouvé:", customer);
      }

      // Mettre à jour Auth0 avec l'ID client Square
      const auth0Response = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          user_metadata: {
            subid: customer?.id ?? null,
          },
          appdata: {
            ownerlevel: "standard", // Ajout du rôle par défaut
          },
        }),
      });

      console.log("[create-or-retrieve-customer] Auth0 patch status:", auth0Response.status);
      if (!auth0Response.ok) {
        const text = await auth0Response.text().catch(() => "<no-body>");
        console.error("[create-or-retrieve-customer] erreur patch Auth0:", text);
        throw new Error("Erreur lors de la mise à jour des métadonnées utilisateur dans Auth0.");
      }

      console.log("[create-or-retrieve-customer] Mise à jour des métadonnées utilisateur dans Auth0 réussie.");
            const locationId = process.env.SQUARE_LOCATION_ID;
      if (!locationId) {
        throw new Error("L'identifiant de localisation Square (SQUARE_LOCATION_ID) n'est pas configuré.");
      }

      // ajoute la création du lien de paiement avec souscription via le SDK Square...
      const paymentLinkResponse = await client.checkout.paymentLinks.create({
        idempotencyKey: randomUUID(),
        quickPay: {
          locationId: locationId,
          name: "Vyft program Market starter",
          priceMoney: {
            amount: BigInt(30000),
            currency: "EUR",
          },
        },
        checkoutOptions: {
          subscriptionPlanId: process.env.SQUARE_PLAN_ID,
        },
        description: "Manage your business in time.",
      });

      console.log("[create-or-retrieve-customer] paymentLink response:", paymentLinkResponse);

      // Ajoute le champ subobjid dans Auth0 pour suivre l'abonnement
      const patchAuth0Subobjid = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          user_metadata: {
            subid: customer?.id ?? null,
            subobjid: paymentLinkResponse.paymentLink?.checkoutOptions?.subscriptionPlanId ?? null,
          },
          appdata: {
            ownerlevel: "standard", // Ajout du rôle par défaut
          },
        }),
      });

      console.log("[create-or-retrieve-customer] Auth0 patch subobjid status:", patchAuth0Subobjid.status);

      return res.status(200).json({
        paymentLink: paymentLinkResponse.paymentLink?.url,
        customerId: customer?.id,
        subscriptionPlanId: paymentLinkResponse.paymentLink?.checkoutOptions?.subscriptionPlanId,
      });
    } else {
      console.error("Action non valide :", action);
      return res.status(400).json({ error: "Action non valide. Utilisez uniquement 'create'." });
    }
  } catch (error: any) {
    // Log détaillé pour debug
    console.error("[create-or-retrieve-customer] Erreur complète:", error);
    if ((error as any)?.statusCode) console.error("[create-or-retrieve-customer] statusCode:", (error as any).statusCode);
    if ((error as any)?.errors) console.error("[create-or-retrieve-customer] errors:", JSON.stringify((error as any).errors, null, 2));
    return res.status(500).json({ error: "Erreur lors de la gestion de l'abonnement ou des métadonnées Auth0.", details: (error && (error.message || error.toString())) });
  }
}