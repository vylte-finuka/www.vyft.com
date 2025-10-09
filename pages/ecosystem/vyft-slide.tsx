// pages.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "../../app/components/Navbar";
import styles from "../../app/page.module.css";
import Footer1 from '../../app/components/Footer1';

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);

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
              Unique au monde.
            </h1>
            <h2 className={styles.body}>
              Une carte métal recyclée de manière éco-responsable et prêt et compagnon de voyage, bientôt sur le marché.
            </h2>
            <div className={styles.bodyattract}></div>
          </main>  <Footer1 />
        </div>
       
      </div>
    </div>
  );
}