/* eslint-disable @next/next/no-head-element */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import styles from "../../app/page.module.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ReportsList = dynamic(() => import("./reportsList"), { ssr: false });

type MetricsHistory = {
  date: string;
  dailyRevenue: number;
  dailySteps: number;
  dailyDistance: number;
}[];

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalSteps: 0,
    totalDistance: 0,
    totalRevenue: 0,
    growth: "0 %",
    daily: [] as { date: string; steps: number; distance: number; revenue: number }[],
  });
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [metricsHistory, setMetricsHistory] = useState<MetricsHistory>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
        if (!userToken) {
          setLoading(false);
          return;
        }

        // Récupérer les infos utilisateur depuis Auth0
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

        // Récupérer les métadonnées utilisateur (enseigne et stripeCustomerId)
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
        const stripeCustomerId = response.data?.user_metadata?.subid?.trim();

        if (!denomination || !stripeCustomerId) {
          setLoading(false);
          return;
        }

        // Récupérer les vraies données depuis l'API
        const apiResponse = await fetch(
          `/api/vyfthealth_proc?enseigne=${encodeURIComponent(denomination)}&stripeCustomerId=${encodeURIComponent(stripeCustomerId)}`
        );
        const data = await apiResponse.json();

        if (data.success && data.data) {
          // Générer la période dynamique sur 7 jours glissants avec format JJ/MM/AAAA
          const formatDate = (date: Date) =>
            date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

          // Générer les 7 derniers jours (du plus ancien au plus récent)
          const days: string[] = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(formatDate(d));
          }

          // Associer les données metricsHistory aux bons jours (sinon 0)
          let history = Array.isArray(data.data.metricsHistory) ? [...data.data.metricsHistory] : [];
          const dailyHistory = days.map((dateStr) => {
            const found = history.find((h: any) => formatDate(new Date(h.date)) === dateStr);
            return {
              date: dateStr,
              steps: found ? found.dailySteps : 0,
              distance: found ? found.dailyDistance : 0,
              revenue: found ? found.dailyRevenue : 0,
            };
          });

          // Période affichée
          setPeriod(`${days[0]} au ${days[6]}`);

          setReportData({
            totalSteps: data.data.yearlySteps,
            totalDistance: data.data.totalDistance,
            totalRevenue: data.data.estimatedRevenue,
            growth: data.data.growth,
            daily: dailyHistory,
          });

          setMetricsHistory(
            dailyHistory.map((h) => ({
              date: h.date,
              dailyRevenue: h.revenue,
              dailySteps: h.steps,
              dailyDistance: h.distance,
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000); // 20 secondes
    return () => clearInterval(interval);
  }, []);

  // Graphique basé sur les vraies données
  const chartData = {
    labels: metricsHistory.map((h) => h.date),
    datasets: [
      {
        label: "Bénéfice estimé (€)",
        data: metricsHistory.map((h) => h.dailyRevenue),
        backgroundColor: "#1a7f6b",
        borderRadius: 8,
      },
      {
        label: "Pas (k)",
        data: metricsHistory.map((h) => Math.round(h.dailySteps / 1000)),
        backgroundColor: "#444444",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className={styles.container2} style={{ fontFamily: "BR Sonoma, BRSonoma, sans-serif" }}>
      <head>
        <title>Rapports - Vyft program: Manage your own market.</title>
      </head>
      <Navbar />
      <main className={styles.main} style={{ fontFamily: "BR Sonoma, BRSonoma, sans-serif" }}>
        <h1 className={styles.header} style={{ fontFamily: "BR Sonoma, BRSonoma, sans-serif" }}>
          Rapports automatiques
        </h1>
        {!loading && (
          <ReportsList reportType="weekly" period={period} data={reportData} />
        )}
        <section
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 32,
            width: "100%",
            maxWidth: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <h2 className={styles.headeronwhite}>Aperçu graphique</h2>
          <div style={{ background: "#DBDFE0", borderRadius: 18, padding: 18 }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      color: "#222",
                      font: { family: "BR Sonoma Semibold", size: 14 },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#444444", font: { family: "BR Sonoma Semibold" } },
                    grid: { color: "#e0dbdd" },
                  },
                  y: {
                    ticks: { color: "#1a7f6b", font: { family: "BR Sonoma Semibold" } },
                    grid: { color: "#e0dbdd" },
                  },
                },
              }}
              height={120}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}