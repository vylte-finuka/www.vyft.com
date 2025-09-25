/* eslint-disable @next/next/no-head-element */
"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../app/page.module.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import secureLocalStorage from "react-secure-storage";

type LoginHistoryItem = {
  date: string;
  ip: string;
  device: string;
  status: string;
};

export default function ConnectHist() {
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);

  useEffect(() => {
    const loginHistoryRaw = secureLocalStorage.getItem("loginHistory");
    const localHistory = JSON.parse(typeof loginHistoryRaw === "string" ? loginHistoryRaw : "[]");
    setHistory(localHistory);
  }, []);

  return (
    <div className={styles.container2}>
      <head>
        <title>Historique de connexions - Vyft program</title>
      </head>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.headeronwhiteX2}>Historique de connexions</h1>
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
            Dernières connexions
          </h2>
          {history.length === 0 ? (
            <p className={styles.bodyonwhite}>Aucune connexion trouvée.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {history.map((item, idx) => {
                const dateObj = new Date(item.date);
                const formattedDate = dateObj.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
                return (
                  <li
                    key={idx}
                    className={styles.bodyonwhite}
                    style={{
                      marginBottom: 18,
                      background: "#DBDFE0",
                      borderRadius: 18,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div>
                      <h3 className={styles.headeronwhite} style={{ fontSize: 18, margin: 0, color: "#1a7f6b" }}>
                        {item.device}
                      </h3>
                      <p className={styles.headeronwhite} style={{ fontSize: 15, margin: "4px 0 0 0", color: "#444444" }}>
                        {formattedDate} à {formattedTime}
                      </p>
                      <p className={styles.bodyonwhite} style={{ fontSize: 14, margin: "4px 0 0 0", color: "#222" }}>
                        <b>IP :</b> {item.ip} — <b>Statut :</b>{" "}
                        <span style={{ color: item.status === "Succès" ? "#1a7f6b" : "#d32f2f", fontWeight: "bold" }}>
                          {item.status}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}