/* eslint-disable @next/next/no-head-element */
"use client";

import React, { useState } from 'react';
import styles from "../../app/page.module.css";
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';

export default function Settings() {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handle2FAToggle = () => {
        setIs2FAEnabled((prev) => !prev);
        alert(is2FAEnabled
            ? "Double facteur désactivé."
            : "Double facteur activé. Veuillez suivre les instructions envoyées par email.");
    };

    // Ajoute la navigation vers la page d'historique de connexion
    const handleShowLoginHistory = () => {
        window.location.href = "/administration/settings/connecthist";
    };

    // Couleur unique pour tous les boutons secondaires (vert) et primaire (gris)
    const secondaryBtnColor = "#1a7f6b";
    const primaryBtnColor = "#444444";
    const disabledBtnColor = "#bfc4c5"; // gris clair pour désactivé

    return (
        <>
            <div className={styles.container2}>
                <head>
                    <title>Paramètres - Vyft program: Manage your own market.</title>
                </head>
                <Navbar />
                <main className={styles.main}>
                    <h1 className={styles.headeronwhiteX2}>Paramètres</h1>
                    {/* Section Sécurité */}
                    <section style={{
                        background: "#fff",
                        borderRadius: 24,
                        padding: 32,
                        marginBottom: 32,
                        width: "100%",
                        maxWidth: 600,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                    }}>
                        <h2 className={styles.headeronwhite}>Sécurité</h2>
                        <p className={styles.bodyonwhite}>
                            Protégez votre compte et auditez vos connexions.
                        </p>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 16,
                            marginTop: 16
                        }}>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                {is2FAEnabled ? "Désactiver le double facteur" : "Activer le double facteur 2FA"}
                            </button>
                            <button
                                onClick={handleShowLoginHistory}
                                className={styles.button}
                                style={{
                                    background: secondaryBtnColor,
                                    color: "#fff",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "pointer",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Historique de connexions
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Clé API
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Verrouillage du compte
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Créer des alertes de connexions
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Application tiers
                            </button>
                        </div>
                    </section>
                    {/* Section Fiscalité */}
                    <section style={{
                        background: "#fff",
                        borderRadius: 24,
                        padding: 32,
                        marginBottom: 32,
                        width: "100%",
                        maxWidth: 600,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                    }}>
                        <h2 className={styles.headeronwhite}>Fiscalité</h2>
                        <p className={styles.bodyonwhite}>
                            Gérez vos obligations fiscales et vos documents administratifs.
                        </p>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 16,
                            marginTop: 16
                        }}>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Suivi des documents fiscaux
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Ajouter ou modifier un numéro fiscal
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Télécharger les factures
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Paramètres de TVA
                            </button>
                            <button
                                disabled
                                className={styles.button}
                                style={{
                                    background: disabledBtnColor,
                                    color: "#888",
                                    borderRadius: 18,
                                    padding: "12px 32px",
                                    fontSize: 16,
                                    cursor: "not-allowed",
                                    width: 260,
                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                    border: "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                Exporter les données fiscales
                            </button>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}