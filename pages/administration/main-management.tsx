/* eslint-disable @next/next/no-head-element */
"use client";

import React, { useEffect, useState } from "react";
import styles from "../../app/page.module.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { TransakConfig, Transak } from "@transak/transak-sdk"; // Importer le SDK Transak
import { useQRCode } from "next-qrcode"; // Importer la bibliothèque next-qrcode
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

type MetricsData = {
  totalSteps: number;
  totalDistance: number;
  estimatedRevenue: number;
  dailySteps: number;
  dailyDistance: number;
  dailyRevenue: number;
};

export default function Funds_management() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState<string>(); // Nom de l'enseigne par défaut
  const { Canvas } = useQRCode(); // Utilisation de next-qrcode
  const [storeNamefact, setStoreNamefact] = useState<string>(); // Nom de l'enseigne par défaut

  useEffect(() => {
    // Simuler la récupération du nom de l'enseigne
    const denomination = storeNamefact;
    setStoreName(denomination); // Mettre à jour l'état avec le nom de l'enseigne
  }, []); // Exécuté une seule fois après le premier rendu

useEffect(() => {
  const fetchStoreNameAndMetrics = async () => {
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
      setStoreName(denomination); // Mettre à jour l'état avec le nom de l'enseigne
      console.log("Nom de l'enseigne récupéré :", denomination);

      if (!denomination) {
        console.error("Denomination manquante dans les métadonnées utilisateur.");
        return;
      }

      // Récupérer les données filtrées depuis l'API /api/vyfthealth_proc
      const apiResponse = await fetch(`/api/vyfthealth_proc?enseigne=${encodeURIComponent(denomination)}`, {
        method: "GET",
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("Erreur lors de la récupération des données filtrées :", errorText);
        throw new Error("Erreur lors de la récupération des données filtrées.");
      }

      const apiData = await apiResponse.json();
      console.log("Données filtrées récupérées :", apiData);

      if (apiData.success) {
        setMetrics(apiData.data); // Mettre à jour l'état avec les données filtrées
      } else {
        console.error("Erreur lors de la récupération des données :", apiData.message);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nom de l'enseigne ou des données :", error);
      setStoreNamefact("Erreur lors de la récupération");
    }
  };

  fetchStoreNameAndMetrics(); // Appel initial
}, []); // Exécuté une seule fois après le premier rendu

  const openTransak = () => {
    // Configuration du widget Transak
    const transakConfig: TransakConfig = {
      apiKey: "fb8ece67-0355-42be-926e-4e82e392e491", // Remplacez par votre clé API
      environment: Transak.ENVIRONMENTS.STAGING, // STAGING ou PRODUCTION
      defaultCryptoCurrency: "USDC",
      fiatCurrency: "EUR",
      walletAddress: "0x2DE81737589163266Ff70F89CCb12D0655C35853", // Adresse du portefeuille
      themeColor: "1461db", // Couleur du thème
      fiatAmount: 300, // Montant en fiat
      network: "avaxcchain", // Réseau
      disableWalletAddressForm: true, // Désactiver le formulaire d'adresse de portefeuille
      defaultPaymentMethod: "credit_debit_card", // Méthode de paiement par défaut
      paymentMethod: "credit_debit_card", // Méthode de paiement
      productsAvailed: "BUY", // Produit disponible
      email: "vylte-finuka@vylte-finuka.com",
    };

    const transak = new Transak(transakConfig);

    // Initialiser le widget
    transak.init();

    // Écouter tous les événements
    Transak.on("*", (data) => {
      console.log("Événement Transak :", data);
    });

    // Déclenché lorsque l'utilisateur ferme le widget
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log("Widget Transak fermé !");
    });

    // Déclenché lorsque l'utilisateur crée une commande
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      console.log("Commande créée :", orderData);
    });

    // Déclenché lorsque l'utilisateur marque le paiement comme effectué
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log("Paiement réussi :", orderData);
      transak.close();
    });
  };

  useEffect(() => {
    const fetchMetricsAndCompare = async () => {
      try {
        if (!storeName) {
          console.error("Denomination non disponible pour la comparaison.");
          return;
        }
  
        const apiResponse = await fetch("/api/vyfthealth_proc", {
          method: "GET",
        });
  
        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error("Erreur lors de la récupération des données :", errorText);
          throw new Error("Erreur lors de la récupération des données.");
        }
  
        const apiData = await apiResponse.json();
        console.log("Données de l'API récupérées :", apiData);
  
        if (apiData.success) {
          // Comparer enseigne avec denomination
          const enseigneNormalized = apiData.data.enseigne?.trim().toLowerCase();
          const denominationNormalized = storeName.toLowerCase();
          console.log(`Comparaison : "${enseigneNormalized}" === "${denominationNormalized}"`);
  
          if (enseigneNormalized === denominationNormalized) {
            setMetrics(apiData.data); // Mettre à jour l'état avec les données correspondantes
          } else {
            console.error(
              `Erreur : Aucune correspondance trouvée entre l'enseigne "${apiData.data.enseigne}" et la denomination "${storeName}"`
            );
          }
        } else {
          console.error("Erreur lors de la récupération des données :", apiData.message);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données ou de la comparaison :", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (storeName) {
      fetchMetricsAndCompare(); // Appel initial si `denomination` est disponible
      const interval = setInterval(fetchMetricsAndCompare, 10000); // Actualisation toutes les 10 secondes
      return () => clearInterval(interval); // Nettoyage de l'intervalle
    }
  }, [storeName]);
  return (
    <>
      <div className={styles.container2}>
        <head>
          <title>Gestion principale</title>
        </head>
        <Navbar />
        <main className={styles.main}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Left Section */}
            <div>
              <h1 className={styles.header}>Gestion principale</h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              ></div>
              <h2
                className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}
              >
                Informations de consommations additionnelles :
              </h2>
              <div className={styles.statviewers}>
                <div className={styles.left}>
                  <h2 className={styles.bodycar}>Recette</h2>
                  <h3 className={styles.body}>Total perçu de la devise actuelle :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.estimatedRevenue} €` : "N/A"}
                  </p>
                  <h3 className={styles.body}>Moyenne possible de recette en une journée :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.dailyRevenue} €` : "N/A"}
                  </p>
                  <h3 className={styles.body}>Pourcentage de croissance :</h3>
                  <p className={metrics && metrics.dailyRevenue > 0 ? styles.bodyposit : styles.bodyposit}>
                    {metrics ? "+ 0%" : "N/A"}
                  </p>
                </div>
                <div className={styles.right}>
                  <h2 className={styles.bodycar1}>Usage de Vyft™</h2>
                  <h3 className={styles.body}>Total des pas de tout les utilisateurs en 24 heures :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.dailySteps} pas` : "N/A"}
                  </p>
                  <h3 className={styles.body}>Total parcourus de tout ces utilisateurs :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.dailyDistance} mètres` : "N/A"}
                  </p>
                  <h3 className={styles.body}>Total de nombre de pas depuis un an de tout ces utilisateurs :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.totalSteps} pas` : "N/A"}
                  </p>
                </div>
              </div>
              <button
                className={styles.ActionEbuttonoveron} // Bouton pour ouvrir le widget
                onClick={openTransak}
              >
                Acheter des cryptos
              </button>
            </div>

            {/* Right Section */}
            <div>
              <h2
                className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}
              >
                Vyft tag™ :
              </h2>
              <div>
                <h2
                  className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}
                >
                  QR Code de départ :
                </h2>
                {storeName && (
                  <div className={styles.qrCodeContainer}>
                    <Canvas
                      text={JSON.stringify({
                        message: "Vyft Tag on",
                        enseigne: storeName,
                      })}
                      options={{
                        errorCorrectionLevel: "M",
                        margin: 3,
                        scale: 4,
                        width: 200,
                        color: {
                          dark: "#e0dbdd", // Couleur sombre (noir pour le texte du QR code)
                          light: "#a5a3a3", // Couleur claire (fond gris clair pour correspondre à .container2)
                        },
                      }}
                    />
                    <p className={styles.qrCodeLabel}>Scannez pour activer le Vyft Tag</p>
                  </div>
                )}

                <h2
                  className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}
                  style={{ marginTop: "2rem" }}
                >
                  QR Code d&apos;arrivée :
                </h2>
                {storeName && (
                  <div className={styles.qrCodeContainer}>
                    <Canvas
                      text={JSON.stringify({
                        message: "Vyft Tag off",
                        enseigne: storeName,
                      })}
                      options={{
                        errorCorrectionLevel: "M",
                        margin: 3,
                        scale: 4,
                        width: 200,
                        color: {
                          dark: "#e0dbdd", // Couleur sombre (noir pour le texte du QR code)
                          light: "#a5a3a3", // Couleur claire (fond gris clair pour correspondre à .container2)
                        },
                      }}
                    />
                    <p className={styles.qrCodeLabel}>Scannez pour désactiver le Vyft Tag</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.bodyattract}></div>
        </main>
        <Footer />
      </div>
    </>
  );
}