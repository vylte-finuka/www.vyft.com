"use client";

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti"; // Bibliothèque pour les confettis
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage"; // Pour le stockage sécurisé
import styles from "./../app/page.module.css";

export default function Success() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [confettiPieces, setConfettiPieces] = useState(200); // Nombre initial de confettis

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

  useEffect(() => {
    // Mettre à jour la taille de la fenêtre pour les confettis
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Appel initial
    window.addEventListener("resize", handleResize);

    // Réduire progressivement le nombre de confettis
    const confettiInterval = setInterval(() => {
      setConfettiPieces((prev) => Math.max(prev - 10, 0)); // Réduire de 10 à chaque intervalle, minimum 0
    }, 300); // Réduction toutes les 300 ms

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(confettiInterval); // Nettoyage de l'intervalle
    };
  }, []);

  const handleGoBack = () => {
    router.push("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className={styles.container3}>
    <title>Succès</title>
      {/* Afficher les confettis avec un nombre de pièces dynamique */}
      {confettiPieces > 0 && (
        <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={confettiPieces} />
      )}

      <div className={styles.center}>
        <div className={styles.form}>
          <h1 className={`${styles.headeronwhiteX2} ${styles.singleLine}`}>
            Félicitations<span className={styles.emoji}>🎉</span>!
          </h1>
          <p className={styles.bodyonwhite}>
            Votre abonnement a été activé avec succès. Merci de nous faire confiance !
          </p>
          <button className={styles.ActionEbuttonoveron} onClick={handleGoBack}>
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}