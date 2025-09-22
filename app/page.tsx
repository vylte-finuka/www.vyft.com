"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import styles from "./page.module.css";
import Navbar from "./components/Navbar";
import Footer1 from "./components/Footer";
import Login from "../pages/login";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51OlpeQDrg8ui7gWsxtoc9bVcIDCCSm0CD5gRKP1GJW6Dt917sBHbmGPt9cQnz0SRBthZ15JF1md3IkiGDzdjFkPO00TbFIA05L");

type Transaction = {
  name: string;
  steps: number;
  distance: string;
  date: string;
  time: string;
};

export default function Home() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subid, setSubid] = useState<string | null>(null);
  const [auth0UserId, setAuth0UserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // État pour la fenêtre modale
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>("acct_123456789"); // Ajouter l'ID du compte connecté

  // Récupérer les informations utilisateur depuis Auth0
  const fetchAuth0UserId = useCallback(async () => {
    const userToken = secureLocalStorage.getItem("userToken");

    if (!userToken) {
      console.error("userToken manquant");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur lors de l'appel à l'API /userinfo :", errorText);
        throw new Error("Erreur lors de l'appel à l'API /userinfo.");
      }

      const userInfo = await response.json();
      console.log("Données utilisateur récupérées :", userInfo);

      if (userInfo.sub) {
        setAuth0UserId(userInfo.sub);
        secureLocalStorage.setItem("auth0UserId", userInfo.sub);
      } else {
        console.error("sub manquant dans la réponse de l'API /userinfo");
      }

      if (userInfo.user_metadata?.subid) {
        console.log("SubID trouvé :", userInfo.user_metadata.subid);
        setSubid(userInfo.user_metadata.subid);
      } else {
        console.warn("SubID manquant dans user_metadata");
        setSubid(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur depuis Auth0 :", error);
    }
  }, []);

  const checkLoginStatus = useCallback(() => {
    const loggedIn = secureLocalStorage.getItem("isLoggedIn") === "1";
    setIsLoggedIn(loggedIn);
  }, []);

  const cancelSubscription = () => {
    setShowModal(true); // Afficher la fenêtre modale
  };

  const checkActiveSubscription = useCallback(async () => {
    try {
      const userToken = secureLocalStorage.getItem("userToken");

      if (!userToken || !subid || !connectedAccountId) {
        console.error("Paramètres manquants pour vérifier l'abonnement :", { userToken, subid, connectedAccountId });
        return;
      }

      console.log("Appel à l'API pour vérifier l'état actif de l'abonnement avec :", { userToken, customerId: subid, connectedAccountId });

      const response = await fetch("/api/create-or-retrieve-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userToken,
          auth0UserId,
          action: "check-active",
          customerId: subid,
          connectedAccountId,
        }),
      });

      const result = await response.json();

      if (result.hasActiveSubscription) {
        console.log("Abonnement actif détecté :", result.subscription);
      } else {
        console.log("Aucun abonnement actif détecté.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état actif de l'abonnement :", error);
    }
  }, [auth0UserId, subid, connectedAccountId]);

  const startStripeSession = useCallback(async () => {
    const stripe = await stripePromise;
    const userToken = secureLocalStorage.getItem("userToken");
    const storedAuth0UserId = secureLocalStorage.getItem("auth0UserId");

    if (!userToken || !storedAuth0UserId || !connectedAccountId) {
      console.error("Paramètres manquants :", { userToken, storedAuth0UserId, connectedAccountId });
      return;
    }

    try {
      const response = await fetch("/api/create-or-retrieve-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userToken,
          auth0UserId: storedAuth0UserId,
          action: "create",
          connectedAccountId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur lors de l'appel à l'API create-or-retrieve-customer :", errorText);
        throw new Error("Erreur lors de l'appel à l'API create-or-retrieve-customer.");
      }

      const session = await response.json();

      if (!session.sessionId) {
        console.error("sessionId manquant dans la réponse de l'API");
        return;
      }

// Remplacez l'appel Stripe SDK par une redirection directe
if (session.url) {
  window.location.href = session.url;
} else {
  console.error("URL de session Stripe manquante dans la réponse");
}
    } catch (error) {
      console.error("Erreur lors du démarrage de la session Stripe :", error);
    }
  }, [connectedAccountId, router]);

  useEffect(() => {
    fetchAuth0UserId();
    checkLoginStatus();
    setIsBrowser(true);
  }, [fetchAuth0UserId, checkLoginStatus]);

  useEffect(() => {
    if (subid) {
      checkActiveSubscription();
    }
  }, [subid, checkActiveSubscription]);

  useEffect(() => {
    const fetchVisitorsAndCompare = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
  
        if (!userToken) {
          console.error("Token utilisateur manquant.");
          return;
        }
  
        // Récupérer les informations utilisateur depuis l'API /userinfo d'Auth0
        const userInfoResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const userId = userInfoResponse.data.sub; // Récupérer l'ID utilisateur depuis la réponse
        console.log("User ID récupéré :", userId);
  
        // Effectuer une requête pour récupérer les métadonnées utilisateur depuis Auth0
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        // Toujours récupérer la valeur, même si les métadonnées utilisateur sont absentes
        const denomination = response.data?.user_metadata?.denomination?.trim();
        if (!denomination) {
          console.error("Denomination manquante dans les métadonnées utilisateur.");
          return;
        }
        console.log("Denomination récupérée :", denomination);
  
        // Récupérer les visiteurs depuis l'API /api/vyfthealth_receive
        const visitorsResponse = await fetch("/api/vyfthealth_receive", {
          method: "GET",
        });
  
        if (!visitorsResponse.ok) {
          const errorText = await visitorsResponse.text();
          console.error("Erreur lors de la récupération des visiteurs :", errorText);
          throw new Error("Erreur lors de la récupération des visiteurs.");
        }
  
        const visitorsData = await visitorsResponse.json();
        console.log("Données des visiteurs récupérées :", visitorsData);
  
        // Comparer enseigne avec denomination
        const filteredTransactions = visitorsData.filter((transaction: { enseigne: string }) => {
          const enseigneNormalized = transaction.enseigne?.trim().toLowerCase();
          const denominationNormalized = denomination.toLowerCase();
          console.log(`Comparaison : "${enseigneNormalized}" === "${denominationNormalized}"`);
          return enseigneNormalized === denominationNormalized;
        });
  
        if (filteredTransactions.length === 0) {
          console.error(
            `Erreur : Aucune correspondance trouvée entre les transactions et la denomination "${denomination}"`
          );
          throw new Error(
            `Aucune correspondance trouvée entre les transactions et la denomination "${denomination}"`
          );
        }
  
        setTransactions(filteredTransactions); // Mettre à jour l'état avec les données filtrées
      } catch (error) {
        console.error("Erreur lors de la récupération des visiteurs ou de la comparaison :", error);
      }
    };
  
    fetchVisitorsAndCompare(); // Appel initial
  
    const interval = setInterval(fetchVisitorsAndCompare, 10000); // Actualisation toutes les 10 secondes
  
    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, []);

  useEffect(() => {
    // Vérifier l'état de l'abonnement
    const fetchSubscriptionStatus = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken");
        const storedAuth0UserId = secureLocalStorage.getItem("auth0UserId");

        if (!userToken || !storedAuth0UserId) {
          console.error("userToken ou auth0UserId manquant");
          return;
        }

        console.log("Appel à l'API check-subscription-status avec :", { userToken, storedAuth0UserId });

        const response = await fetch("/api/check-subscription-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userToken,
            auth0UserId: storedAuth0UserId,
          }),
        });

        const result = await response.json();
        console.log("Résultat de l'API check-subscription-status :", result);

        if (result.hasActiveSubscription) {
          console.log("Abonnement actif détecté");
          setSubid("active"); // Utilisez une valeur arbitraire pour indiquer un abonnement actif
        } else {
          console.log("Aucun abonnement actif détecté");
          setSubid(null); // Aucun abonnement actif
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'état de l'abonnement :", error);
      }
    };

    fetchSubscriptionStatus();
    const interval = setInterval(fetchSubscriptionStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <div>
              <h1 className={styles.header}>Tableau de bord</h1>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}></div>
              <h2 className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}>
                Dernières réclamations :
              </h2>
              {transactions.length > 0 ? (
                // Trier les transactions par date décroissante avant de les afficher
                [...transactions]
                  .sort((a, b) => {
                    const dateA = new Date(a.time).getTime();
                    const dateB = new Date(b.time).getTime();
                    return dateB - dateA; // Plus récent en premier
                  })
                  .map((transaction, index) => {
                    let formattedDate = "Date invalide";
                    let formattedTime = "Heure invalide";

                    if (transaction.time) {
                      try {
                        const rawDate = new Date(transaction.time);
                        if (!isNaN(rawDate.getTime())) {
                          formattedDate = rawDate.toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          formattedTime = rawDate.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        }
                      } catch {
                        // Les valeurs par défaut restent "Date invalide" et "Heure invalide"
                      }
                    }

                    return (
                      <div key={index}>
                        <p className={styles.date}>{formattedDate}</p>
                        <div className={styles.ActionEbutton}>
                          <p className={styles.ActionE}>
                            <p className={styles.time}>{formattedTime}</p>
                            <span className={styles.personName}>{transaction.name}</span>
                            <span className={styles.personDetails}>
                              {transaction.steps} pas • {transaction.distance} mètres
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className={styles.date}>Pas de visiteurs pour l&apos;instant.</p>
              )}
              <button
                className={styles.ActionEbutton}
                onClick={subid ? cancelSubscription : startStripeSession}
                style={{
                  fontFamily: "BR Sonoma, sans-serif",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {subid ? "Arrêter l'abonnement" : "Se lancer avec Vyft Program"}
              </button>
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalHeader}>Contactez le support</h2>
            <p className={styles.modalBody}>
              Pour annuler votre abonnement, veuillez contacter notre support à l&apos;adresse suivante :{" "}
              <a href="mailto:support@vylte-finuka.com" className={styles.modalLink}>
                support@vylte-finuka.com
              </a>.
            </p>
            <button onClick={() => setShowModal(false)} className={styles.modalButton}>
              Fermer
            </button>
          </div>
        </div>
      )}
      <div className={styles.container1}>
        <main className={styles.main}></main>
        <Footer1 />
      </div>
    </div>
  );
}
