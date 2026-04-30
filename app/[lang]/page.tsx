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
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!params.lang) {
      const browserLang = navigator.language || navigator.languages[0] || "fr";
      if (browserLang.startsWith("fr")) {
        router.replace("/fr-FR");
      } else {
        router.replace("/en-EN");
      }
      return;
    }
    const timer = setTimeout(() => setShowVideo(true), 2000);
    return () => clearTimeout(timer);
  }, [params.lang, router]);

  type Locale = "fr-FR" | "en-EN";
  type ContentType = {
    main0: string;
    title: string;
    subtitle: string;
    download: string;
    main: string;
    note: string;
    modalTitle: string;
    modalAndroid: string;
    modalIos: string;
    modalClose: string;
  };
  const content: Record<Locale, ContentType> = {
    "fr-FR": {
      title: "Un choix de simplicité.",
      subtitle: "Une appli pouvant faire ça, vous tenez la finance et la fitness au bout des doigts.",
      download: "Télécharger l'appli",
      main: "Écrivez votre histoire avec Vyft. Nous reconnaissons lien personnel, voyage, écologie et investissement¹ comme un tout. Bientôt communiquez entre proches optionnellement par abréviation via notre IA Vyft Nérethense pour éviter les frais de réseau et problème de confidentialité, n'importe où.",
      note: "1. L'investissement étant un cas de perte foncière, cela s'applique à la néobanque.",
      main0: "Faites les transactions avec votre carte avec des conversions en temps réel idéales pour le voyage à des taux meilleurs que la concurrence et de plus sans frais partout.",
      modalTitle: "Choisissez votre plateforme",
      modalAndroid: "Android",
      modalIos: "iOS",
      modalClose: "Fermer"
    },
    "en-EN": {
      title: "A choice of simplicity.",
      subtitle: "An app that can do this, you hold finance and fitness at your fingertips.",
      download: "Download the app",
      main: " Write your story with Vyft. We recognize personal connection, travel, ecology and investment¹ as a whole. Soon communicate between relatives optionally by abbreviation via our Vyft Nérethense AI to avoid network fees and privacy issues, anywhere.",
      note: "1. Investment being a case of land loss, this applies to the neobank.",
      main0: "Make transactions with your card with real-time conversions ideal for travel at rates better than the competition and no fees anywhere.",
      modalTitle: "Choose your platform",
      modalAndroid: "Android",
      modalIos: "iOS",
      modalClose: "Close"
    }
  };

  const t = content[locale as Locale] || content["fr-FR"];

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
              width: "100%",
              height: "100%",
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
                                href="#"
                onClick={e => { e.preventDefault(); setShowModal(true); }}
                className={styles.button}
                style={{
                  background: "#e0dbdd",
                  color: "linear-gradient(90deg, #e0dbdd 0%, #bdbdbd 100%)",
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
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                aria-disabled="false"
                tabIndex={0}
              >
                {t.download}
              </a>
            </div>
            {/* Modal */}
            {showModal && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>{t.modalTitle}</div>
                  <div className={styles.modalBody}>
                    <a
                      href="https://app.appsonair.com/install/mjnPIzsj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalLink}
                      style={{ display: "block", marginBottom: 18, fontSize: 18 }}
                    >
                      {t.modalAndroid}
                    </a>
                    <a
                      href="https://app.appsonair.com/install/oKrFdRwf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalLink}
                      style={{ display: "block", marginBottom: 18, fontSize: 18 }}
                    >
                      {t.modalIos}
                    </a>
                  </div>
                  <button
                    className={styles.modalButton}
                    onClick={() => setShowModal(false)}
                  >
                    {t.modalClose}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <div className={styles.container3}>
        <main className={styles.main}>
          <h1 className={styles.header}>
            {t.main0}
          </h1>
          <Image
            src="/txband.png"
            alt="Vyft tx"
            width={255}
            height={80}
            style={{ top: 56 }}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
          />
        </main>
      </div>
      <div className={styles.container5}>
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
