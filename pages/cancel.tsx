"use client";

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti"; // Bibliothèque pour les confettis
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage"; // Pour le stockage sécurisé
import styles from "./../app/page.module.css";

export default function Cancel() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur a été redirigé depuis "/"
    const redirectedFromHome = secureLocalStorage.getItem("redirectedFromHome") === "true";

    if (!redirectedFromHome) {
      router.push("/"); // Redirige vers la page d'accueil si l'accès est direct
    } else {
      // Nettoyer l'état de redirection après vérification
      secureLocalStorage.removeItem("redirectedFromHome");
    }
  }, [router]);

  const handleGoBack = () => {
    router.push("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className={styles.container3}>
    <title>Succès - Vyft program: Manage your own market.</title>

      <div className={styles.center}>
        <div className={styles.form}>
          <h1 className={`${styles.headeronwhiteX2} ${styles.singleLine}`}>
            Éspérons que vous faisiez le bon choix !
          </h1>
          <p className={styles.bodyonwhite}>
            Votre paiement d&apos;abonnement a été annul avec succès. Nous serions heureux de vous revoir !
          </p>
          <button className={styles.ActionEbuttonoveron} onClick={handleGoBack}>
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}