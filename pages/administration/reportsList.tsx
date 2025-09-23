import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../app/page.module.css";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

// Fonction pour télécharger le PDF généré côté serveur via l'API reportgen
async function downloadServerPDF(report: any, companyName: string) {
  const res = await fetch("/api/reportgen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reportType: report.type,
      period: report.period,
      data: report.data,
      influenceHistory: report.influenceHistory,
      chartImage: report.chartImage,
      influenceChartImage: report.influenceChartImage,
      topUsersChartImage: report.topUsersChartImage,
      companyName: report.companyName || companyName,
    }),
  });
  if (!res.ok) {
    alert("Erreur lors de la génération du PDF serveur");
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vyft-program-report-${report.type}-${report.period}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default function ReportsList({
  reports = [],
}: {
  reports: {
    type: string;
    label: string;
    period: string;
    data: {
      totalSteps: number;
      totalDistance: number;
      totalRevenue: number;
      growth: string;
      daily: { date: string; steps: number; distance: number; revenue: number }[];
    };
    influenceHistory?: { date: string; count: number }[];
    chartImage?: string;
    influenceChartImage?: string;
    topUsersChartImage?: string;
    companyName?: string;
  }[]
}) {
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
        if (!userToken) return;

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

        // Récupérer les métadonnées utilisateur (enseigne)
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
        setCompanyName(denomination || "");
      } catch (error) {
        setCompanyName("");
      }
    };

    fetchCompany();
  }, []);

  return (
    <section
      className={styles.bodyonwhite}
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 32,
        marginBottom: 32,
        width: "100%",
        maxWidth: 700,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
    >
      <h2 className={styles.headeronwhite} style={{ fontSize: 22, marginBottom: 18 }}>
        Liste des rapports générés
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {reports.map((report, idx) => (
          <li
            key={idx}
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
              {/* Titre */}
              <h3
                className={styles.headeronwhite}
                style={{
                  fontSize: 20,
                  margin: 0,
                  fontWeight: "bold",
                  color: "#1a7f6b",
                }}
              >
                Rapport {report.label}
              </h3>
              {/* Sous-titre */}
              <p
                className={styles.headeronwhite}
                style={{
                  fontSize: 15,
                  margin: "4px 0 0 0",
                  fontWeight: 500,
                  color: "#444444",
                }}
              >
                Période : {report.period}
              </p>
              {/* Corps */}
              <p
                className={styles.bodyonwhite}
                style={{
                  fontSize: 14,
                  margin: "4px 0 0 0",
                  color: "#222",
                }}
              >
                <b>Entreprise :</b> {report.companyName || companyName}
              </p>
            </div>
            <button
              onClick={() => downloadServerPDF(report, companyName)}
              style={{
                background: "#1a7f6b",
                border: "none",
                cursor: "pointer",
                padding: 0,
                borderRadius: 8,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
              title="Télécharger le rapport"
            >
              <img src="/nav_down.png" alt="Télécharger PDF" style={{ width: 28, height: 28 }} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}