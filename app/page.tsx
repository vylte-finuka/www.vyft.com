"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import styles from "./page.module.css";
import Navbar from "./components/Navbar";
import Footer1 from "./components/Footer";
import Login from "../pages/login";
import { loadStripe } from "@stripe/stripe-js";
import SubscribeModal from "./components/SubscribeModal";
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
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [hasExplored, setHasExplored] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vyft_hasExplored") === "1";
    }
    return false;
  });

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

      const response = await fetch("/api/create-or-retrieve-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
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

  const API_KEY = process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY;

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
          "x-vyftprogram-api-key": API_KEY || "",
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
          headers: {
            "x-vyftprogram-api-key": API_KEY || "",
          },
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
            "x-vyftprogram-api-key": API_KEY || "",
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

  useEffect(() => {
    if (!subid) {
      setShowSubscribeModal(true);
    } else {
      setShowSubscribeModal(false);
    }
  }, [subid]);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div>
      <div className={styles.container2}>
        <Navbar />
        <main className={styles.main} style={{ alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 32,
              width: "100%",
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className={styles.headeronwhiteX2}>Tableau de bord</h1>
              <section
                className={styles.bodyonwhite}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 32,
                  width: "100%",
                  maxWidth: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  marginBottom: 24,
                }}
              >
                <h2 className={styles.headeronwhite} style={{ fontSize: 22, marginBottom: 18 }}>
                  Dernières réclamations
                </h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {transactions.length > 0 ? (
                    [...transactions]
                      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
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
                          } catch {}
                        }
                        return (
                          <li
                            key={index}
                            className={styles.bodyonwhite}
                            style={{
                              marginBottom: 18,
                              background: "#DBDFE0",
                              borderRadius: 18,
                              padding: 18,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <h3
                                className={styles.headeronwhite}
                                style={{
                                  fontSize: 20,
                                  margin: 0,
                                  fontWeight: "bold",
                                  color: "#1a7f6b",
                                }}
                              >
                                {transaction.name}
                              </h3>
                              <p
                                className={styles.headeronwhite}
                                style={{
                                  fontSize: 15,
                                  margin: "4px 0 0 0",
                                  fontWeight: 500,
                                  color: "#444444",
                                }}
                              >
                                {formattedDate} à {formattedTime}
                              </p>
                              <p
                                className={styles.bodyonwhite}
                                style={{
                                  fontSize: 14,
                                  margin: "4px 0 0 0",
                                  color: "#222",
                                }}
                              >
                                <b>Distance :</b> {transaction.distance} m — <b>Pas :</b> {transaction.steps}
                              </p>
                            </div>
                          </li>
                        );
                      })
                  ) : (
                    <li>
                      <p className={styles.date}>Pas de visiteurs pour l&apos;instant.</p>
                    </li>
                  )}
                </ul>
                {/* Plus de bouton d'abonnement, la modale s'affiche automatiquement si pas abonné */}
              </section>
            </div>
          </div>
        </main>
        <Footer1 />
      </div>
      {/* Modal support désabonnement */}
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
      {/* Modal abonnement */}
      {showSubscribeModal && (
        <SubscribeModal
          onClose={() => {}} // Empêche la fermeture
          onSubscribe={startStripeSession}
        />
      )}
    </div>
  );
}
