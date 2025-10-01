"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import styles from "./page.module.css";
import Navbar from "./components/Navbar";
import Footer1 from "./components/Footer";
import Login from "../pages/login";
import SubscribeModal from "./components/SubscribeModal";
import axios from "axios";

type Transaction = {
  name: string;
  steps: number;
  distance: string;
  date: string;
  time: string;
};

type Document = {
  _id: string;
  title: string;
  fileName: string;
  createdAt: string;
};

function autoFixJsonPayload(input: string): string {
  let fixed = input;
  fixed = fixed.replace(/#([A-Fa-f0-9]{1,5})([^A-Fa-f0-9])/g, (m, p1, p2) => {
    if (p1.length < 6) return "#" + p1.padEnd(6, "F") + p2;
    return "#" + p1 + p2;
  });
  fixed = fixed.replace(/"background"\s*:\s*"#F"/g, '"background": "#FFFFFF"');
  fixed = fixed.replace(/"backgroundColor"\s*:\s*"#F"/g, '"backgroundColor": "#FFFFFF"');
  fixed = fixed.replace(/"highlight"\s*:\s*"#00F7F"/g, '"highlight": "#00F7FF"');
  fixed = fixed.replace(/"secondary"\s*:\s*"#F"/g, '"secondary": "#FFFFFF"');
  fixed = fixed.replace(/"pading"/g, '"padding"');
  fixed = fixed.replace(/"marginBotom"/g, '"marginBottom"');
  fixed = fixed.replace(/"fontFammly"/g, '"fontFamily"');
  fixed = fixed.replace(/"styye"/g, '"style"');
  fixed = fixed.replace(/""ontFamily"/g, '"fontFamily"');
  fixed = fixed.replace(/"tttle"/g, '"title"');
  fixed = fixed.replace(/"textAlign"::"left"/g, '"textAlign":"left"');
  fixed = fixed.replace(/"height":\s*([0-9]+)px/g, '"height": "$1px"');
  fixed = fixed.replace(/"borderRadius":\s*([0-9]+)/g, '"borderRadius": $1');
  fixed = fixed.replace(/{{/g, '{').replace(/}}/g, '}');
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  fixed = fixed.replace(/undefined/g, '');
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  return fixed;
}

export default function Home() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subid, setSubid] = useState<string | null>(null);
  const [auth0UserId, setAuth0UserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // État pour la fenêtre modale
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>("acct_123456789"); // Ajouter l'ID du compte connecté
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasExplored, setHasExplored] = useState(false);
  const [subscriptionStart, setSubscriptionStart] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setHasExplored(localStorage.getItem("vyft_hasExplored") === "1");
    const handler = () => {
      setHasExplored(localStorage.getItem("vyft_hasExplored") === "1");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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

      if (userInfo.user_metadata?.subscription_start) {
        setSubscriptionStart(userInfo.user_metadata.subscription_start);
      } else {
        setSubscriptionStart(null);
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

  const startCheckoutSession = useCallback(async () => {
    const userToken = secureLocalStorage.getItem("userToken");
    const storedAuth0UserId = secureLocalStorage.getItem("auth0UserId");

    if (!userToken || !storedAuth0UserId) {
      console.error("Paramètres manquants :", { userToken, storedAuth0UserId });
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur lors de l'appel à l'API create-or-retrieve-customer :", errorText);
        throw new Error("Erreur lors de l'appel à l'API create-or-retrieve-customer.");
      }

      const result = await response.json();

      if (result.paymentLink) {
        window.location.href = result.paymentLink; // Redirige vers le lien de paiement Square
      } else {
        alert("Erreur lors de la création du lien de paiement Square.");
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de la session Checkout.com :", error);
    }
  }, []);

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
    // Vérifier l'état de l'abonnement et mettre à jour la date
    const fetchSubscriptionStatus = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken");
        const storedAuth0UserId = auth0UserId || secureLocalStorage.getItem("auth0UserId");

        if (!userToken || !storedAuth0UserId) {
          console.error("userToken ou auth0UserId manquant");
          return;
        }

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

        // Si abonnement actif, on masque le modal
        if (result.hasActiveSubscription) {
          setShowSubscribeModal(false);
        } else {
          setShowSubscribeModal(true);
        }

        // Met à jour la date d'abonnement depuis l'API si disponible
        setSubscriptionStart(result.subscriptionStart || null);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'état de l'abonnement :", error);
      }
    };

    fetchSubscriptionStatus();
    const interval = setInterval(fetchSubscriptionStatus, 10000);

    return () => clearInterval(interval);
  }, [auth0UserId, API_KEY]);

  useEffect(() => {
    console.log("subscriptionStart =", subscriptionStart);
    if (subscriptionStart) {
      const startDate = new Date(subscriptionStart);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      console.log("diffDays =", diffDays, "startDate =", startDate, "now =", now);
      if (diffDays >= 30) {
        setShowSubscribeModal(true);
      } else {
        setShowSubscribeModal(false);
      }
    } else {
      setShowSubscribeModal(true);
    }
  }, [subscriptionStart]);

  if (!isClient) {
    // Empêche le rendu SSR qui bloque le dashboard
    return null;
  }

  // Bloc d'accès
  if (!isLoggedIn) {
    return <Login />;
  }

  if (!hasExplored) {
    return (
      <div className={styles.container2}>
        <Navbar />
        <main className={styles.main}>
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <h2>Bienvenue sur Vyft !</h2>
            <p>Pour accéder au tableau de bord, cliquez sur le bouton ci-dessous.</p>
            <button
              className={styles.modalButton}
              onClick={() => {
                localStorage.setItem("vyft_hasExplored", "1");
                setHasExplored(true);
              }}
            >
              Explorer d&apos;abord !
            </button>
          </div>
        </main>
        <Footer1 />
      </div>
    );
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
            {/* Colonne réclamations */}
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
              </section>
            </div>
            {/* Colonne Documents pour vous */}
            <div style={{ flex: 1, minWidth: 0 }}>
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
                  Documents pour vous
                </h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {documents.length > 0 ? (
                    documents.map((doc, idx) => (
                      <li key={doc._id} className={styles.bodyonwhite} style={{
                        marginBottom: 18,
                        background: "#DBDFE0",
                        borderRadius: 18,
                        padding: 18,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                        <div>
                          <h3 className={styles.headeronwhite} style={{
                            fontSize: 20,
                            margin: 0,
                            fontWeight: "bold",
                            color: "#1a7f6b",
                          }}>
                            {doc.title || doc.fileName}
                          </h3>
                          <p className={styles.headeronwhite} style={{
                            fontSize: 15,
                            margin: "4px 0 0 0",
                            fontWeight: 500,
                            color: "#444444",
                          }}>
                            {doc.createdAt ? new Date(doc.createdAt).toLocaleString("fr-FR") : ""}
                          </p>
                        </div>
                        <a
                          href={`/api/reportgen?docId=${doc._id}`}
                          style={{
                            background: "#1a7f6b",
                            border: "none",
                            cursor: "pointer",
                            padding: "8px 18px",
                            borderRadius: 8,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 15,
                            textDecoration: "none",
                          }}
                          download={doc.fileName}
                        >
                          Télécharger
                        </a>                                                
                        <button
                          style={{
                            marginLeft: 12,
                            background: "#444",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 18px",
                            fontWeight: 600,
                            fontSize: 15,
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            const jsonInput = prompt(
                              "Collez le JSON DynamicReport complet (même non valide, il sera envoyé tel quel)."
                            );
                            if (!jsonInput) return;
                            // Envoie le JSON tel quel, aucune vérification, aucune clé ajoutée
                            const res = await fetch("/api/reportgen", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
                              },
                              body: jsonInput,
                            });
                            if (!res.ok) {
                              alert("Erreur lors de la génération du PDF.");
                              return;
                            }
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            // Nom du fichier selon le titre si possible
                            let filename = "document_personnalisé.pdf";
                            try {
                              const obj = JSON.parse(jsonInput);
                              if (obj.title) filename = obj.title.replace(/\s/g, "_") + ".pdf";
                            } catch {}
                            link.download = filename;
                            link.click();
                            window.URL.revokeObjectURL(url);
                          }}
                        >
                          Importer un document DynamicReport™
                        </button>
                      </li>
                    ))
                  ) : (
                    // Affiche le bouton même si aucun document
                    <li style={{
                      marginBottom: 18,
                      background: "#DBDFE0",
                      borderRadius: 18,
                      padding: 18,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <div>
                        <h3 className={styles.headeronwhite} style={{
                          fontSize: 20,
                          margin: 0,
                          fontWeight: "bold",
                          color: "#1a7f6b",
                        }}>
                          Aucun document généré pour l&apos;instant.
                        </h3>
                      </div>
                      <button
                        style={{
                          marginLeft: 12,
                          background: "#444",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 18px",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                        onClick={async () => {
                          const jsonInput = prompt(
                            "Collez le JSON DynamicReport complet (exemple dans la documentation, il sera corrigé automatiquement)."
                          );
                          if (!jsonInput) return;
                          const fixedInput = autoFixJsonPayload(jsonInput);
                          let sendBody: string;
                          try {
                            // On tente de parser pour ajouter l'userId
                            const payload = JSON.parse(fixedInput);
                            const userId = secureLocalStorage.getItem("auth0UserId");
                            payload.userId = userId;
                            sendBody = JSON.stringify(payload);
                          } catch (e) {
                            // Si le parsing échoue, on envoie le JSON corrigé brut
                            sendBody = fixedInput;
                          }
                          const res = await fetch("/api/reportgen", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
                            },
                            body: sendBody,
                          });
                          if (!res.ok) {
                            alert("Erreur lors de la génération du PDF.");
                            return;
                          }
                          const blob = await res.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          // Nom du fichier selon le titre si possible
                          let filename = "document_personnalisé.pdf";
                          try {
                            const obj = JSON.parse(fixedInput);
                            if (obj.title) filename = obj.title.replace(/\s/g, "_") + ".pdf";
                          } catch {}
                          link.href = url;
                          link.download = filename;
                          link.click();
                          window.URL.revokeObjectURL(url);
                        }}
                      >
                        Importer un document DynamicReport™
                      </button>
                    </li>
                  )}
                </ul>
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
          onSubscribe={startCheckoutSession}
        />
      )}
    </div>
  );
}
