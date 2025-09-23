/* eslint-disable @next/next/no-head-element */
"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import styles from "../../app/page.module.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { Bar, Doughnut } from "react-chartjs-2";
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
  const [influence, setInfluence] = useState<{day:number, week:number, month:number, year:number, all:number}>({day:0, week:0, month:0, year:0, all:0});
  const [influencePeriod, setInfluencePeriod] = useState<"7days"|"day"|"week"|"month"|"year"|"all">("7days");
  const [influenceHistory, setInfluenceHistory] = useState<{date:string, count:number}[]>([]);
  const [influenceDayHours, setInfluenceDayHours] = useState<number[]>([]);
  const [influenceWeekDays, setInfluenceWeekDays] = useState<{date:string, count:number}[]>([]);
  const [influenceMonthDays, setInfluenceMonthDays] = useState<{date:string, count:number}[]>([]);
  const [influenceYearMonths, setInfluenceYearMonths] = useState<{month:string, count:number}[]>([]);
  const [topUsers, setTopUsers] = useState<{ name: string; count: number }[]>([]);
  const barChartRef = useRef<any>(null);
  const influenceChartRef = useRef<any>(null);
  const topUsersChartRef = useRef<any>(null);

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

          if (data.data.influence) {
            setInfluence(data.data.influence);
            setInfluenceHistory(data.data.influence.history7Days || []);
            setTopUsers(data.data.influence.topUsers || []);

            // --- HISTOGRAMME PAR HEURE POUR AUJOURD'HUI ---
            const today = new Date();
            today.setHours(0,0,0,0);
            const hours = [];
            for (let h = 0; h < 24; h++) {
              const start = new Date(today);
              start.setHours(h, 0, 0, 0);
              const end = new Date(today);
              end.setHours(h+1, 0, 0, 0);
              const count = data.data.influence.byHour?.[h] ?? 0;
              hours.push(count);
            }
            setInfluenceDayHours(hours);

            // --- HISTOGRAMME PAR JOUR POUR LA SEMAINE ---
            setInfluenceWeekDays(data.data.influence.history7Days || []);

            // --- HISTOGRAMME PAR JOUR POUR LE MOIS ---
            setInfluenceMonthDays(data.data.influence.historyMonth || []);

            // --- HISTOGRAMME PAR MOIS POUR L'ANNÉE ---
            setInfluenceYearMonths(data.data.influence.historyYear || []);
          }
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

  // Composant Dropdown web
  function Dropdown({ options, value, onChange, placeholder }: {
    options: { value: string, label: string }[],
    value: string,
    onChange: (val: string) => void,
    placeholder?: string
  }) {
    return (
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
        width: "100%",
        justifyContent: "center"
      }}>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              background: value === opt.value ? "#DBDFE0" : "#bfc4c5ff",
              color: "#222",
              border: "none",
              borderRadius: 18,
              height: 48,
              fontSize: 16,
              fontFamily: "BR Sonoma, BRSonoma, sans-serif",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              boxShadow: value === opt.value ? "0 2px 8px rgba(0,0,0,0.07)" : "none"
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  // Après le rendu
  const getBarChartImage = () => barChartRef.current?.toBase64Image() || "";
  const getInfluenceChartImage = () => influenceChartRef.current?.toBase64Image() || "";
  const getTopUsersChartImage = () => topUsersChartRef.current?.toBase64Image() || "";

  // Exemple de structure pour chaque rapport historique
  const reportPeriods = [
    { type: "weekly", label: "hebdomadaire", period: period, data: reportData, influenceHistory, chartImage: getBarChartImage(), influenceChartImage: getInfluenceChartImage(), topUsersChartImage: getTopUsersChartImage() },
    // Ajoute ici les autres périodes (mensuel, fiscal, etc.) avec leurs propres données
    // { type: "monthly", label: "mensuel", period: ..., data: ..., influenceHistory: ..., ... }
  ];

  return (
    <div className={styles.container2}>
      <head>
        <title>Rapports - Vyft program: Manage your own market.</title>
      </head>
      <Navbar />
      <main className={styles.main} style={{ alignItems: "flex-start" }}>
        {/* Section horizontale : Liste des rapports à gauche, historique à droite */}
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
          {/* Liste des rapports générés */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className={styles.header}>Rapports</h1>
            {/* Partie principale avec les graphiques */}
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
              <h2 className={styles.headeronwhite}>Profit de marché</h2>
              <div style={{ background: "#DBDFE0", borderRadius: 18, padding: 18 }}>
                <Bar
                  ref={barChartRef}
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
            <section
              className={styles.bodyonwhite}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 32,
                width: "100%",
                maxWidth: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                marginTop: 24,
              }}
            >
              <h2 className={styles.headeronwhite}>Influence</h2>
              {/* Sélecteur coulissant */}
              <Dropdown
                options={[
                  { value: "day", label: "Jour (heures)" },
                  { value: "week", label: "Semaine (jours)" },
                  { value: "month", label: "Mois (jours)" },
                  { value: "year", label: "Année (mois)" },
                  { value: "all", label: "Tout" },
                ]}
                value={influencePeriod}
                onChange={(val) =>
                  setInfluencePeriod(
                    val as "7days" | "day" | "week" | "month" | "year" | "all"
                  )
                }
                placeholder="Sélectionner une période"
              />
              <div style={{ background: "#DBDFE0", borderRadius: 18, padding: 18 }}>
                <Bar
                  ref={influenceChartRef}
                  data={{
                    labels:
                      influencePeriod === "day"
                        ? Array.from({ length: 24 }, (_, h) => `${h}h`)
                        : influencePeriod === "week"
                        ? influenceWeekDays.map((h) =>
                            new Date(h.date).toLocaleDateString("fr-FR", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                            })
                          )
                        : influencePeriod === "month"
                        ? influenceMonthDays.map((h) =>
                            new Date(h.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                            })
                          )
                        : influencePeriod === "year"
                        ? influenceYearMonths.map((m) => m.month)
                        : influenceHistory.map((h) =>
                            new Date(h.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                            })
                          ),
                    datasets: [
                      {
                        label: "Marcheurs uniques",
                        data:
                          influencePeriod === "day"
                            ? influenceDayHours
                            : influencePeriod === "week"
                            ? influenceWeekDays.map((h) => h.count)
                            : influencePeriod === "month"
                            ? influenceMonthDays.map((h) => h.count)
                            : influencePeriod === "year"
                            ? influenceYearMonths.map((m) => m.count)
                            : influenceHistory.map((h) => h.count),
                        backgroundColor: "#1a7f6b",
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        ticks: {
                          color: "#444444",
                          font: { family: "BR Sonoma Semibold" },
                        },
                        grid: { color: "#e0dbdd" },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: "#1a7f6b",
                          font: { family: "BR Sonoma Semibold" },
                        },
                        grid: { color: "#e0dbdd" },
                      },
                    },
                  }}
                  height={120}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  marginTop: 16,
                }}
              >
                <div>
                  Jour : <b className={styles.bodyonwhite}>{influence.day}</b>
                </div>
                <div>
                  Semaine : <b className={styles.bodyonwhite}>{influence.week}</b>
                </div>
                <div>
                  Mois : <b className={styles.bodyonwhite}>{influence.month}</b>
                </div>
                <div>
                  An : <b className={styles.bodyonwhite}>{influence.year}</b>
                </div>
                <div>
                  Total : <b className={styles.bodyonwhite}>{influence.all}</b>
                </div>
              </div>
              {topUsers.length > 0 && (
                <div
                  style={{
                    background: "#DBDFE0",
                    borderRadius: 18,
                    marginTop: 32,
                    padding: 24,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    maxWidth: 4010,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <h3 className={styles.headeronwhite}>Top clients du mois</h3>
                  <Doughnut
                    ref={topUsersChartRef}
                    data={{
                      labels: topUsers.map((u) => u.name),
                      datasets: [
                        {
                          data: topUsers.map((u) => u.count),
                          backgroundColor: [
                            "#1a7f6b",
                            "#444444",
                            "#DBDFE0",
                            "#bfc4c5ff",
                            "#e0dbdd",
                          ],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: {
                            color: "#222",
                            font: { family: "BR Sonoma Semibold", size: 14 },
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </section>
          </div>
          {/* Historique à droite, bien au niveau de la section "Profit de marché" */}
          <div style={{ minWidth: 420, maxWidth: 420, alignSelf: "flex-start" }}>
            <ReportsList reports={reportPeriods} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}