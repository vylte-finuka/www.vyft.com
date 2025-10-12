// pages.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "../../../app/[lang]/components/Navbar";
import styles from "../../../app/page.module.css";
import Footer1 from '../../../app/[lang]/components/Footer1';
import { useRouter } from "next/router";

export default function Vyftslide() {
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();
  const lang = router.query.lang as string | undefined;
  const locale = lang === "fr-FR" ? "fr-FR" : "en-EN";

  const t = {
    "fr-FR": {
      title: "Vyft: La néobanque à la vertu de la finance. - Vyft slide",
      h1: "Concept unique au monde.",
      h2a: "Une carte métal recyclée de manière éco-responsable et compagnon de voyage, bientôt sur le marché.",
      h2b: "Elle sera conçue via le recyclage par mission de redonner de la valeur aux matériaux usagés."
    },
    "en-EN": {
      title: "Vyft: The neobank with the virtue of finance. - Vyft slide",
      h1: "Unique concept in the world.",
      h2a: "An eco-responsibly recycled metal card and travel companion, coming soon to market.",
      h2b: "It will be designed through recycling missions to restore value to used materials."
    }
  }[locale];

  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  useEffect(() => {
    // Affiche l'image 2s puis lance la vidéo en background
    const timer = setTimeout(() => setShowVideo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className={styles.container3}>
        {/* Vidéo en background après 2s */}
        {showVideo && (
          <video
            className="bgvideo"
            src="/Vyftslidemetalcard.mp4"
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
              {t.h1}
            </h1>
            <h2 className={styles.body}>
              {t.h2a}
            </h2>
            <h2 className={styles.body}>{t.h2b}</h2>
            <div className={styles.bodyattract}></div>
          </main>
          <Footer1 />
        </div>
      </div>
    </div>
  );
}