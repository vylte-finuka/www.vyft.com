"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import secureLocalStorage from "react-secure-storage";
import styles from "../app/page.module.css";
import Image from "next/image";
import axios from "axios";
import Footer from "../app/components/Footer1";
import Register from "./register";
import { useRouter } from "next/navigation";
import Resetpassword  from "./Resetpassword"; // Ajoute cet import

// Ajout du composant ForgotPassword
const ForgotPassword = ({
  onBack,
  onReset,
}: {
  onBack: () => void;
  onReset: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }
    try {
      // Appel Auth0 pour demander la réinitialisation du mot de passe
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
      <title>Mot de passe oublié - Vyft program</title>
      <div className={`${styles.container3} ${styles.center}`}>
        <Image
          src="/vyft_program.png"
          alt="Vyft Program"
          width={400}
          height={180}
        />
        <form className={styles.form} onSubmit={handleForgot}>
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
            onClick={onBack}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.signupLink}>Retour à la connexion</span>
          </p>
          <p
            className={styles.signupText}
            onClick={onReset}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.signupLink}>
              Accéder à la page de réinitialisation avancée
            </span>
          </p>
        </form>
        <Footer />
      </div>
    </>
  );
};

const Login = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // Ajout pour l'écran mot de passe oublié
  const [showReset, setShowReset] = useState(false); // Ajoute cet état
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (user) {
      secureLocalStorage.setItem("isLoggedIn", "1");
      secureLocalStorage.setItem("username", user.name || "");
      secureLocalStorage.setItem("email", user.email || "");
      secureLocalStorage.setItem("picture", user.picture || "");
      secureLocalStorage.setItem("userToken", token);
      secureLocalStorage.setItem("auth0UserId", user.sub || "");
      setIsLoggedIn(true);
    }
  }, [user]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
        {
          grant_type: "http://auth0.com/oauth/grant-type/password-realm",
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          username: email,
          password: password,
          realm: "Vyftbase",
          scope: "openid profile email",
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("Jeton d'accès non retourné par Auth0.");
      }

      const userInfoResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const userInfo = userInfoResponse.data;

      secureLocalStorage.setItem("isLoggedIn", "1");
      secureLocalStorage.setItem("username", userInfo.name || "");
      secureLocalStorage.setItem("email", userInfo.email || "");
      secureLocalStorage.setItem("picture", userInfo.picture || "");
      secureLocalStorage.setItem("auth0UserId", userInfo.sub || "");
      secureLocalStorage.setItem("userToken", access_token);
      setToken(access_token);

      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ip = ipRes.data.ip;
      const userAgent = window.navigator.userAgent;
      const loginDate = new Date().toISOString();
      const loginHistoryRaw = secureLocalStorage.getItem("loginHistory");
      const prevHistory = JSON.parse(
        typeof loginHistoryRaw === "string" ? loginHistoryRaw : "[]"
      );
      prevHistory.unshift({
        date: loginDate,
        ip,
        device: userAgent,
        status: "Succès",
      });
      secureLocalStorage.setItem("loginHistory", JSON.stringify(prevHistory));

      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Erreur lors de la connexion :", err);

      if (err.response && err.response.data) {
        setError(
          err.response.data.error_description ||
            "Nom de société ou mot de passe incorrect."
        );
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (showRegister) {
    return <Register />;
  }

  if (showForgot) {
    return (
      <ForgotPassword
        onBack={() => setShowForgot(false)}
        onReset={() => {
          setShowForgot(false);
          setShowReset(true);
        }}
      />
    );
  }

  if (showReset) {
    return <Resetpassword />;
  }

  return (
    <>
      <title>Connexion - Vyft program: Manage your own market.</title>
      <div className={`${styles.container3} ${styles.center}`}>
        <Image
          src="/vyft_program.png"
          alt="Vyft Program"
          width={400}
          height={180}
        />
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Adresse email :
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Entrez votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Mot de passe :
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className={styles.button}>
            Se connecter
          </button>
          <p
            className={styles.signupText}
            onClick={() => setShowRegister(true)}
          >
            <span className={styles.signupLink}>Vous n&apos;avez pas de compte ?</span>
          </p>
          <p
            className={styles.signupText}
            onClick={() => setShowForgot(true)}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.signupLink}>Mot de passe oublié&nbsp;?</span>
          </p>
        </form>
        <Footer />
      </div>
    </>
  );
};

export default Login;