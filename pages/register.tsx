import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/page.module.css";
import Image from "next/image";
import axios from "axios";
import Login from "./login"; // Importer le composant Login
import Footer from "../app/components/Footer1";

const capitalizeWords = (value: string) => {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Register = () => {
  const router = useRouter();
  const [denomination, setDenomination] = useState(""); // Champ pour la dénomination sociale
  const [companyName, setCompanyName] = useState(""); // Champ pour le nom de la société
  const [siret, setSiret] = useState(""); // Champ pour le numéro de SIRET
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // Champ pour le prénom
  const [lastName, setLastName] = useState(""); // Champ pour le nom
  const [password, setPassword] = useState(""); // Champ pour le mot de passe
  const [address, setAddress] = useState(""); // Champ pour l'adresse postale professionnelle
  const [error, setError] = useState(""); // Pour afficher les erreurs
  const [success, setSuccess] = useState("");
  const [showLogin, setShowLogin] = useState(false); // État pour basculer vers Login

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const minLength = 10; // Longueur minimale du mot de passe
      if (!password || password.length < minLength) {
        setError(`Votre mot de passe doit comporter au moins ${minLength} caractères.`);
        return;
      }

      if (!denomination || !companyName || !siret || !email || !firstName || !lastName || !address) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          email: email,
          nickname: firstName,
          family_name: lastName,
          password: password,
          connection: "Vyftbase", // Nom de la connexion configurée dans Auth0
          user_metadata: {
            denomination: denomination,
            companyName: companyName,
            siret: siret,
            address: address,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Inscription réussie !");
        setError("");
        setTimeout(() => {
          setShowLogin(true); // Basculer vers Login
        }, 2000);
      }
    } catch (err: any) {
      console.error("Erreur lors de l'inscription :", err);

      // Capturer et afficher les détails de l'erreur API
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data, null, 2)); // Afficher les détails de l'erreur en JSON
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  if (showLogin) {
    return <Login />;
  }

  return (
    <>
      <title>Vyft - Inscription - Vyft program: Manage your own market.</title>
      <div className={`${styles.container3} ${styles.center}`}>
      <Image
        src="/Vyft_program.png"
        alt="Vyft Program"
        width={400}
        height={180}
        className={styles.logo}
      />
      <form className={styles.form} onSubmit={handleRegister}>
        <div className={styles.formGroup}>
          <label htmlFor="denomination" className={styles.label}>
            Dénomination sociale* :
          </label>
          <input
            type="text"
            id="denomination"
            name="denomination"
            className={styles.input}
            placeholder="Entrez la dénomination sociale de votre société"
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Nom de la société :
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className={styles.input}
            placeholder="Entrez le nom de votre société"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="siret" className={styles.label}>
            Numéro de SIRET** :
          </label>
          <input
            type="text"
            id="siret"
            name="siret"
            className={styles.input}
            placeholder="Entrez votre numéro de SIRET"
            value={siret}
            onChange={(e) => setSiret(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>
            Adresse postale professionnelle :
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={styles.input}
            placeholder="Entrez l'adresse postale de votre société"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
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
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            Prénom :
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={styles.input}
            placeholder="Entrez votre prénom"
            value={firstName}
            onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Nom :
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={styles.input}
            placeholder="Entrez votre nom"
            value={lastName}
            onChange={(e) => setLastName(capitalizeWords(e.target.value))}
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
        {error && (
          <pre style={{ color: "red", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {error}
          </pre>
        )}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit" className={styles.button}>
          S&apos;inscrire
        </button>
        <p
          className={styles.signupText}
          onClick={() => setShowLogin(true)} // Basculer vers Login
        >
          Vous avez déjà un compte ?{" "}
          <span className={styles.signupLink}>Connectez-vous ici</span>
        </p>
      </form>
      <p className={styles.bodymessage}>
        * La dénomination sociale est utilisée uniquement à des fins informatives.
        <br />
        ** Le numéro de SIRET est requis pour identifier votre société.
      </p>
      <Footer />
      </div>
    </>
  );
};

export default Register;