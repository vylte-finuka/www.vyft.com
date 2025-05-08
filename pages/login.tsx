"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import secureLocalStorage from "react-secure-storage";
import styles from "../app/page.module.css";
import Image from "next/image";
import axios from "axios";
import Footer from "../app/components/Footer1";
import Register from "./register"; // Importer le composant Register
import Home from "../app/page"; // Importer le composant Home

const Login = () => {
  const { user, isLoading } = useUser(); // Récupère l'utilisateur connecté via Auth0
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false); // État pour basculer entre Login et Register
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour vérifier si l'utilisateur est connecté
  const [token, setToken] = useState(""); // État pour stocker le token utilisateur

  useEffect(() => {
    // Si l'utilisateur est connecté via Auth0, mettre à jour l'état
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }
  
      // Appeler Auth0 avec password-realm
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
        {
          grant_type: "http://auth0.com/oauth/grant-type/password-realm",
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          username: email,
          password: password,
          realm: "Vyftbase", // Nom du realm configuré dans Auth0
          scope: "openid profile email",
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Vérifiez si le jeton d'accès est présent dans la réponse
      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("Jeton d'accès non retourné par Auth0.");
      }
  

  
      // Récupérer les informations utilisateur
      const userInfoResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      const userInfo = userInfoResponse.data;
  
      // Stocker les informations utilisateur dans secureLocalStorage
      secureLocalStorage.setItem("isLoggedIn", "1");
      secureLocalStorage.setItem("username", userInfo.name || "");
      secureLocalStorage.setItem("email", userInfo.email || "");
      secureLocalStorage.setItem("picture", userInfo.picture || "");
      secureLocalStorage.setItem("auth0UserId", userInfo.sub || ""); // Stocker l'auth0UserId
        // Stocker le jeton utilisateur dans secureLocalStorage
      secureLocalStorage.setItem("userToken", access_token);
      setToken(access_token);
      // Mettre à jour l'état pour rediriger vers Home
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Erreur lors de la connexion :", err);
  
      // Capturer et afficher les détails de l'erreur
      if (err.response && err.response.data) {
        setError(err.response.data.error_description || "Nom de société ou mot de passe incorrect.");
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  if (isLoading) {
    // Afficher un état de chargement pendant que les données utilisateur sont récupérées
    return <div>Chargement...</div>;
  }

  if (isLoggedIn) {
    // Si l'utilisateur est connecté, afficher le composant Home
    return <Home />;
  }

  if (showRegister) {
    // Retourner le composant Register si l'utilisateur clique sur le lien
    return <Register />;
  }

  return (
    <><title>Connexion - Vyft program: Manage your own market.</title>
      <div className={`${styles.container3} ${styles.center}`}>
        <Image
          src="/Vyft_program.png"
          alt="Vyft Program"
          width={400}
          height={180}
          className={styles.logo}
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
            onClick={() => setShowRegister(true)} // Basculer vers Register
          >
            <span className={styles.signupLink}>Vous n&apos;avez pas de compte ?</span>
          </p>
        </form>

        <Footer />
      </div>
    </>
  );
};

export default Login;