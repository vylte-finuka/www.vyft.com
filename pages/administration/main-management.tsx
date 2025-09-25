/* eslint-disable @next/next/no-head-element */
"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "../../app/page.module.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useQRCode } from "next-qrcode";
import secureLocalStorage from "react-secure-storage";
import { useReactToPrint } from "react-to-print";
import SubscribeModal from "@/app/components/SubscribeModal"; // Assure-toi que ce chemin est correct

type MetricsData = {
  growth: MetricsData | null;
  monthlyInvestment: any;
  yearlySteps: number;
  totalDistance: number;
  estimatedRevenue: number;
  dailySteps: number;
  dailyDistance: number;
  dailyRevenue: number;
};

type MetricsHistory = {
  date: string;
  dailyRevenue: number;
  dailySteps: number;
  dailyDistance: number;
}[];

const SUPPORTED_CURRENCIES = ["€", "Ar", "$", "£"] as const;
type Currency = typeof SUPPORTED_CURRENCIES[number];

export default function Funds_management() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState<string>();
  const { Canvas } = useQRCode();
  const [storeNamefact, setStoreNamefact] = useState<string>();
  const qr1 = useRef<HTMLDivElement>(null);
  const QrT1 = useReactToPrint({
    contentRef: qr1,
    documentTitle: "QR Code de départ",
  });
  const qr2 = useRef<HTMLDivElement>(null);
  const QrT2 = useReactToPrint({
    contentRef: qr2,
    documentTitle: "QR Code d'arrivée",
  });
  const API_KEY = process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY;
  const [metricsHistory, setMetricsHistory] = useState<MetricsHistory>([]);
  const [currency, setCurrency] = useState<Currency>("€");
  const [rates, setRates] = useState<Record<Currency, number>>({
    "€": 1,
    "Ar": 0,
    "$": 0,
    "£": 0,
  });
  const [hasExplored, setHasExplored] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vyft_hasExplored") === "1";
    }
    return false;
  });
  const [stripeCustomerId, setStripeCustomerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setStoreName(storeNamefact);
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(
          "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
        );
        setRates({
          "€": 1,
          "Ar": res.data.eur.mga,
          "$": res.data.eur.usd,
          "£": res.data.eur.gbp,
        });
      } catch (e) {
        console.error("Erreur lors de la récupération des taux de change :", e);
      }
    };
    fetchRates();
  }, []);

  const convert = (amount: number | string | undefined) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return "0.00";
    const rate = rates[currency] || 1;
    return (Number(amount) * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchStoreNameAndMetrics = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
        if (!userToken) return;

        const userInfoResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const userId = userInfoResponse.data.sub;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const denomination = response.data?.user_metadata?.denomination?.trim();
        let stripeCustomerIdValue = response.data?.user_metadata?.subid?.trim();

        // Si subid absent, essayer de le retrouver/créer côté Stripe
        if (!stripeCustomerIdValue && userId) {
          try {
            const stripeRes = await axios.post(
              "/api/create-or-retrieve-customer",
              {
                auth0UserId: userId,
                userToken,
                action: "create",
              },
              {
                headers: {
                  "x-vyftprogram-api-key": API_KEY || "",
                  "Content-Type": "application/json",
                },
              }
            );
            stripeCustomerIdValue = stripeRes.data.customerId;
          } catch (err) {
            console.error("Impossible de retrouver/créer le client Stripe :", err);
          }
        }

        setStoreName(denomination);
        setStripeCustomerId(stripeCustomerIdValue);

        if (!denomination || !stripeCustomerIdValue) return;

        const apiResponse = await fetch(
          `/api/vyfthealth_proc?enseigne=${encodeURIComponent(denomination)}&stripeCustomerId=${encodeURIComponent(
            stripeCustomerIdValue
          )}`,
          {
            method: "GET",
            headers: {
              "x-vyftprogram-api-key": API_KEY || "",
            },
          }
        );
        if (!apiResponse.ok) return;
        const apiData = await apiResponse.json();
        if (apiData.success) {
          setMetrics(apiData.data);
          setMetricsHistory((prev) => {
            const today = new Date().toISOString().slice(0, 10);
            const filtered = prev.filter((h) => h.date !== today);
            return [
              ...filtered,
              {
                date: today,
                dailyRevenue: apiData.data.dailyRevenue,
                dailySteps: apiData.data.dailySteps,
                dailyDistance: apiData.data.dailyDistance,
              },
            ].slice(-7);
          });
        }
      } catch (error) {
        setStoreNamefact("Erreur lors de la récupération");
      }
    };

    fetchStoreNameAndMetrics();
    const interval = setInterval(fetchStoreNameAndMetrics, 4000);
    return () => clearInterval(interval);
  }, []);

  // Design & charte graphique harmonisés
  return (
    <div className={styles.container2}>
      <head>
        <title>Gestion principale - Vyft program: Manage your own market.</title>
      </head>
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
          {/* Partie principale à gauche */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className={styles.headeronwhiteX2}>Gestion principale</h1>
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
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="currency" className={styles.body}>Devise : </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className={styles.selectCurrency}
                >
                  <option value="€">EUR (€)</option>
                  <option value="$">USD ($)</option>
                  <option value="£">GBP (£)</option>
                  <option value="Ar">MGA (Ar)</option>
                </select>
              </div>
              <h2 className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}>
                Informations de consommations additionnelles :
              </h2>
              <div className={styles.statviewers}>
                <div className={styles.left}>
                  <h2 className={styles.bodycar}>Recette</h2>
                  <h3 className={styles.body}>Investissement dans le mois :</h3>
                  <p className={styles.body}>
                    {metrics && metrics.monthlyInvestment !== undefined && metrics.monthlyInvestment !== null
                      ? `${convert(metrics.monthlyInvestment)} ${currency}`
                      : "0.00 " + currency}
                  </p>
                  <h3 className={styles.body}>Moyenne estimée de bénéfice en une journée :</h3>
                  <p className={styles.body}>
                    {metrics && metrics.dailyRevenue !== undefined && metrics.dailyRevenue !== null
                      ? `${convert(metrics.dailyRevenue)} ${currency}`
                      : "0.00 " + currency}
                  </p>
                  <h3 className={styles.body}>Pourcentage de croissance dans la semaine :</h3>
                  <p className={styles.body}>
                    {metrics && metrics.growth !== undefined && metrics.growth !== null
                      ? String(metrics.growth).replace(".", ",")
                      : "0 %"}
                  </p>
                </div>
                <div className={styles.right}>
                  <h2 className={styles.bodycar}>Usage de Vyft™</h2>
                  <h3 className={styles.body}>Total des pas de tout clients en 24 heures :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.dailySteps} pas` : "N/A"}
                  </p>
                  <h3 className={styles.body}>Total parcourus de tout ces clients en 24 heures :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.dailyDistance} mètres` : "N/A"}
                  </p>
                  <h3 className={styles.body}>Total de nombre de pas depuis un an de tout clients :</h3>
                  <p className={styles.body}>
                    {metrics ? `${metrics.yearlySteps} pas` : "N/A"}
                  </p>
                </div>
              </div>
            </section>
          </div>
          {/* Partie QR Codes à droite */}
          <div style={{ minWidth: 420, maxWidth: 420, alignSelf: "flex-start" }}>
            <section
              className={styles.bodyonwhite}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 32,
                width: "100%",
                maxWidth: 420,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                marginBottom: 24,
                position: "relative",
                minHeight: 420,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Si pas d'abonnement, on masque les QR codes et affiche le modal centré */}
              {(!stripeCustomerId && !hasExplored) && (
                <SubscribeModal
                  onClose={() => {
                    setHasExplored(true);
                    localStorage.setItem("vyft_hasExplored", "1");
                  }}
                  onSubscribe={() => window.location.href = "/"}

                />
              )}
              {(!stripeCustomerId && hasExplored) ? (
                <div
                  style={{
                    background: "#23272e",
                    borderRadius: 24,
                    padding: 36,
                    minWidth: 340,
                    width: "90%",
                    maxWidth: 420,
                    boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
                    color: "#fff",
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  <h2 style={{ color: "#1a7f6b", fontWeight: 700, fontSize: 26, marginBottom: 14 }}>
                    Abonnement requis
                  </h2>
                  <p style={{ fontSize: 17, color: "#e0dbdd", marginBottom: 28 }}>
                    Vous devez être abonné pour accéder aux QR codes Vyft.
                  </p>
                  <button
                    style={{
                      background: "#1a7f6b",
                      color: "#fff",
                      border: "none",
                      borderRadius: 16,
                      padding: "14px 38px",
                      fontWeight: 700,
                      fontSize: 17,
                      cursor: "pointer",
                      fontFamily: "BR Sonoma, sans-serif",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                      transition: "background 0.2s",
                      letterSpacing: 0.2,
                    }}
                    onClick={() => window.location.href = "/"}
                  >
                    S&apos;abonner
                  </button>
                </div>
              ) : null}
              {/* QR codes visibles seulement si abonnement trouvé */}
              {stripeCustomerId && (
                <>
                  <h2 className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}>
                    Vyft tag™ :
                  </h2>
                  <div>
                    <h2 className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`}>
                      QR Code de départ :
                    </h2>
                    {storeName && (
                      <div ref={qr1} className={styles.qrCodeContainer}>
                        <Canvas
                          text={JSON.stringify({
                            message: "Vyft Tag on",
                            enseigne: storeName,
                          })}
                          logo={{ src: "https://avatars.githubusercontent.com/u/123649969?v=4", options: { width: 88 } }}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 3,
                            scale: 4,
                            width: 200,
                            color: {
                              dark: "#e0dbdd",
                              light: "#a5a3a3",
                            },
                          }}
                        />
                      </div>
                    )}
                    <button onClick={QrT1} className={styles.ActionEbuttonoveron}>Imprimer ce tag</button>
                    <h2 className={`${styles.body} ${styles.subtitle} ${styles.subtitleAligned}`} style={{ marginTop: "2rem" }}>
                      QR Code d&apos;arrivée :
                    </h2>
                    {storeName && (
                      <div ref={qr2} className={styles.qrCodeContainer}>
                        <Canvas
                          text={JSON.stringify({
                            message: "Vyft Tag off",
                            enseigne: storeName,
                          })}
                          logo={{ src: "https://avatars.githubusercontent.com/u/123649969?v=4", options: { width: 88 } }}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 3,
                            scale: 4,
                            width: 200,
                            color: {
                              dark: "#e0dbdd",
                              light: "#a5a3a3",
                            },
                          }}
                        />
                      </div>
                    )}
                    <button onClick={QrT2} className={styles.ActionEbuttonoveron}>Imprimer ce tag</button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}