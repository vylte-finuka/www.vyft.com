"use client";

import React, { useState } from "react";
import styles from "../app/page.module.css";
import Image from "next/image";
import axios from "axios";
import Footer from "../app/components/Footer1";
import { useRouter } from "next/navigation";

export const Resetpassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/dbconnections/change_password`,
        {
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          email,
          connection: "Vyftbase",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Un email de réinitialisation a été envoyé si l'adresse existe.");
    } catch (err: any) {
      setError("Erreur lors de la demande de réinitialisation.");
    }
  };

  return (
    <>
      <title>Réinitialisation du mot de passe - Vyft program</title>
      <div className={`${styles.container3} ${styles.center}`}>
        <Image
          src="/vyft_program.png"
          alt="Vyft Program"
          width={400}
          height={180}
        />
        <form className={styles.form} onSubmit={handleReset}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Adresse email :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Entrez votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit" className={styles.button}>
            Réinitialiser le mot de passe
          </button>
          <p
            className={styles.signupText}
            onClick={() => router.push("/login")}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.signupLink}>Retour à la connexion</span>
          </p>
        </form>
        <Footer />
      </div>
    </>
  );
};