// pages.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import styles from "./page.module.css";
import Footer1 from './components/Footer1';
import Image from 'next/image';

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
              Un choix de simplicité.
            </h1>
            <h2 className={styles.body}>
              Une appli pouvant faire ça, vous tenez la finance et la fitness au bout des doigts.
            </h2>
            <div className={styles.bodyattract}></div>
          </main>
        </div>
      </div>
      <div className={styles.container1}>
        <main className={styles.main}>
          <h1 className={styles.header}>
            Nous reconnaissons lien personnel, voyage, écologie et investissement¹ comme un tout.
            Bientôt communiquez entre proches via notre IA Vyft Nérethense pour éviter les frais de messagerie et problème de confidentialité, n&apos;importe où.
          </h1>
          <h2 className={styles.bodymessage}>
            1. L&apos;investissement étant un cas de perte foncière, cela s&apos;applique à la néobanque.
          </h2>
        </main>
        <Footer1 />
      </div>
    </div>
  );
}