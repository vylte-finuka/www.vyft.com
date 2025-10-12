// pages.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import styles from "../page.module.css";
import Footer1 from './components/Footer1';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

export default function Home() {
  const params = useParams() as { lang?: string };
  const locale = params.lang === "en-EN" ? "en-EN" : "fr-FR";

  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();

  type Locale = "fr-FR" | "en-EN";
  type ContentType = {
    title: string;
    subtitle: string;
    download: string;
    main: string;
    note: string;
  };
  const content: Record<Locale, ContentType> = {
    "fr-FR": {
      title: "Un choix de simplicité.",
      subtitle: "Une appli pouvant faire ça, vous tenez la finance et la fitness au bout des doigts.",
      download: "Télécharger l'appli",
      main: "Nous reconnaissons lien personnel, voyage, écologie et investissement¹ comme un tout. Bientôt communiquez entre proches optionnellement par abréviation via notre IA Vyft Nérethense pour éviter les frais de réseau et problème de confidentialité, n'importe où.",
      note: "1. L'investissement étant un cas de perte foncière, cela s'applique à la néobanque."
    },
    "en-EN": {
      title: "A choice of simplicity.",
      subtitle: "An app that can do this, you hold finance and fitness at your fingertips.",
      download: "Download the app",
      main: "We recognize personal connection, travel, ecology and investment¹ as a whole. Soon communicate between relatives optionally by abbreviation via our Vyft Nérethense AI to avoid network fees and privacy issues, anywhere.",
      note: "1. Investment being a case of land loss, this applies to the neobank."
    }
  };

  const t = content[locale as Locale] || content["fr-FR"];

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className={styles.container1}>
        {/* Image en background au début */}
        {!showVideo}
        {/* Vidéo en background après 2s */}
        {showVideo && (
          <video
            className="bgvideo"
            src="/vyftadvertising.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "110%",
              height: "110%",
              objectFit: "cover",
              zIndex: 0,
              pointerEvents: "none"
            }}
          />
        )}
        {/* Tous les éléments sont au-dessus du background */}
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Navbar />
          <main className={styles.main}>
            <h1 className={styles.headerX2}>
              {t.title}
            </h1>
            <h2 className={styles.body}>
              {t.subtitle}
            </h2>
            <div className={styles.bodyattract}></div>
            {/* Bouton d'installation app */}
            <div style={{ marginTop: 40 }}>
              <a
                className={styles.button}
                style={{
                  background: "linear-gradient(90deg, #e0dbdd 0%, #bdbdbd 100%)",
                  color: "#cccccc",
                  fontWeight: "bold",
                  fontSize: 18,
                  border: "none",
                  width: 242,
                  borderRadius: 25,
                  padding: "18px 40px",
                  boxShadow: "0px 4px 12px rgba(82, 132, 120, 0.10)",
                  transition: "background 0.3s",
                  display: "inline-block",
                  textDecoration: "none",
                  marginTop: "20px",
                  cursor: "not-allowed",
                  pointerEvents: "none",
                }}
                aria-disabled="true"
                tabIndex={-1}
              >
                {t.download}
              </a>
            </div>
          </main>
        </div>
      </div>
      <div className={styles.container3}>
        <main className={styles.main}>
          <h1 className={styles.header}>
            {t.main}
          </h1>
          <h2 className={styles.bodymessage}>
            {t.note}
          </h2>
        </main>
        <Footer1 />
      </div>
    </div>
  );
}