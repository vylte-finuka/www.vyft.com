import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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

type ModalMarkdownProps = {
  visible: boolean;
  onClose: () => void;
  markdown: string;
};
const ModalMarkdown: React.FC<ModalMarkdownProps> = ({ visible, onClose, markdown }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (visible && scrollRef.current) {
      (scrollRef.current as HTMLDivElement).scrollTop = 0;
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        ref={scrollRef}
        style={{
          background: "#fff",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: 32,
          maxWidth: 600,
          width: "100%",
          maxHeight: "70vh",
          overflowY: "auto",
          boxShadow: "0 -3px 16px rgba(0,0,0,0.15)",
          position: "relative",
          animation: "slideUp 0.3s",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                style={{
                  fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                  color: "#1a7f6b",
                  fontSize: 28,
                  marginBottom: 16,
                }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                style={{
                  fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                  color: "#1a7f6b",
                  fontSize: 22,
                  marginBottom: 12,
                }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                style={{
                  fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                  color: "#222",
                  fontSize: 18,
                  marginBottom: 8,
                }}
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                style={{
                  fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                  color: "#222",
                  fontSize: 15,
                  marginBottom: 8,
                }}
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li
                style={{
                  fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                  color: "#222",
                  fontSize: 15,
                }}
                {...props}
              />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
        <button
          onClick={onClose}
          style={{
            background: "#1a7f6b",
            color: "#fff",
            border: "none",
            borderRadius: 18,
            padding: "10px 32px",
            fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
            fontSize: 16,
            margin: "24px auto 0 auto",
            display: "block",
            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const CGVU_MARKDOWN = `
# Conditions Générales de Vente et d’Utilisation

## Définitions à connaître
- **Vyft Program** : plateforme SaaS de gestion de la relation client (CRM) et d’analyse d’activité physique.
- **Utilisateur** : toute personne physique ou morale utilisant Vyft Program.
- **Prestataire sécurisé** : service tiers spécialisé et certifié pour la gestion des comptes, abonnements et paiements (ex : Stripe).
- **Dénomination** : la société éditrice du service, à savoir Vylte-finuka SARL, SIRET 92978865100016, 60 rue François 1er, 75008 Paris, France.

## À propos de Vyft Program
Vyft Program est un outil conçu pour l’application Vyft, une solution de suivi et d’analyse des pas et de l’activité physique de vos clients.  
Il permet aux entreprises de suivre les pas réalisés dans leurs établissements, d’analyser la fréquentation, de générer des statistiques de performance et d’automatiser la gestion de la relation client.  
Il permet aussi aux services de la commune d’organiser des marchés ou événements dans des lieux spécifiques et de suivre la fréquentation grâce à l’application.

## Fonctionnalités principales
- Suivi en temps réel du nombre de pas effectués par les clients dans votre enseigne.
- Analyse des données de fréquentation et de l’engagement client.
- Tableau de bord pour visualiser les réclamations et les statistiques d’activité.
- Gestion des abonnements via un **prestataire sécurisé** (Stripe) en mode "pay as you go".
- Génération et impression de QR codes pour le suivi d’entrée et de sortie (Vyft tag™).
- Export et impression des statistiques et des tags pour vos opérations marketing.
- Support technique dédié et gestion des accès utilisateurs.
- Outils pour les services de la commune afin de suivre la fréquentation lors d’événements ou marchés dans des lieux spécifiques.

## 1. Objet
Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société **Vylte-finuka SARL** (SIRET 92978865100016), 60 rue François 1er, 75008 Paris, France, conforme à la réglementation de l’Union Européenne.

## 2. Accès au service
L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné à la souscription d’un abonnement géré par un **prestataire sécurisé**.

## 3. Description du service
Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment.

## 4. Commande et abonnement
L’abonnement fonctionne aujourd’hui en mode "pay as you go" via un **prestataire sécurisé** (Stripe). Nous manipulons les données uniquement dans les cas nécessaires. L’abonnement peut être révoqué à tout moment en contactant le support à l’adresse support@vylte-finuka.com.

## 5. Prix et paiement
Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email.

## 6. Résiliation
L’utilisateur peut demander la révocation de son abonnement à tout moment en contactant le support à support@vylte-finuka.com. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU.

## 7. Propriété intellectuelle
Tous les éléments du service (logiciel, interface, contenus, marques) sont la propriété exclusive de Vylte-finuka. Toute reproduction ou utilisation non autorisée est interdite.

## 8. Données personnelles
Les données personnelles sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.

## 9. Confidentialité et sécurité
Vylte-finuka met en œuvre les mesures techniques et organisationnelles pour assurer la sécurité des données. L’utilisateur s’engage à préserver la confidentialité de ses identifiants.

## 10. Responsabilité
Vylte-finuka ne saurait être tenue responsable des dommages indirects, pertes de données ou interruption de service. L’utilisateur est responsable de l’usage qu’il fait du service.

## 11. Support et maintenance
Un support technique est accessible par email à support@vylte-finuka.com. Vylte-finuka s’efforce d’assurer la disponibilité du service, sans garantie d’absence d’interruption.

## 12. Modifications des CGVU
Vylte-finuka se réserve le droit de modifier les présentes CGVU à tout moment. Les utilisateurs seront informés par email ou notification sur la plateforme.

## 13. Droit applicable et juridiction
Les présentes CGVU sont soumises au droit français et à la réglementation de l’Union Européenne. Tout litige sera porté devant les tribunaux compétents de Paris.

## 14. Contact
Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris.

## À propos du rapport PDF et de la grille d'influence

Le rapport PDF généré par Vyft Program contient un tableau de suivi de l’influence et de la fréquentation sur 800 jours :

- **Ligne supérieure (1 à 32)** : chaque colonne correspond à un jour du mois (du 1<sup>er</sup> au 32<sup>e</sup> jour, pour couvrir tous les cas de mois).
- **Légende inférieure (M1, M2, ...)** : chaque “M” indique le numéro du mois affiché (M1 = premier mois, M2 = deuxième mois, etc.).
- Chaque case du tableau représente l’activité d’un jour donné, la couleur indiquant le niveau d’influence ou de fréquentation.

Ce format permet de visualiser rapidement l’évolution de l’activité jour par jour et mois par mois.

## 15. Utilisation de l’Intelligence Artificielle (IA)

Vyft Program propose une fonctionnalité d’assistance par intelligence artificielle (IA) nommée **Vyft Nérethense**, permettant de répondre à vos questions, d’analyser vos données et de vous conseiller sur l’utilisation de la plateforme.

- Les réponses fournies par l’IA Vyft Nérethense sont générées automatiquement à partir de vos données et des informations disponibles sur la plateforme. Elles sont données à titre indicatif et ne sauraient se substituer à un conseil professionnel personnalisé.
- L’utilisateur s’engage à ne pas soumettre de données sensibles, confidentielles ou à caractère personnel non nécessaires lors de l’utilisation de l’IA.
- Vylte-finuka ne pourra être tenue responsable des décisions prises sur la base des réponses de l’IA.
- L’utilisation de l’IA Vyft Nérethense est soumise au respect des présentes CGVU et à la politique de confidentialité de Vyft Program.
`;

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
  const [acceptCGVU, setAcceptCGVU] = useState(false); // État pour accepter les CGVU
  const [showCGVU, setShowCGVU] = useState(false);

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

      if (!acceptCGVU) {
        setError("Vous devez accepter les CGVU pour continuer.");
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

  // Composant Checkbox personnalisé
  type CustomCheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
  };
  const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 24,
        height: 24,
        borderRadius: 8,
        border: "2px solid #1a7f6b",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        cursor: "pointer",
        transition: "background 0.2s",
        boxSizing: "border-box",
      }}
      tabIndex={0}
      role="checkbox"
      aria-checked={checked}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") onChange(!checked);
      }}
    >
      {checked && (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: "#1a7f6b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
    </div>
  );

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 30,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <CustomCheckbox
              checked={acceptCGVU}
              onChange={setAcceptCGVU}
            />
            <span
              style={{
                fontSize: 15,
                color: "#222",
                fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                flex: 1,
                flexWrap: "wrap",
                userSelect: "none",
              }}
            >
              J&apos;accepte les{" "}
              <span
                style={{
                  color: "#1a7f6b",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                }}
                onClick={() => setShowCGVU(true)}
              >
                Conditions Générales de Vente et d&apos;Utilisation
              </span>
              .
            </span>
          </div>
          {error && (
            <pre style={{ color: "red", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {error}
            </pre>
          )}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button
            type="submit"
            className={styles.button}
            disabled={!acceptCGVU}
            style={{
              opacity: acceptCGVU ? 1 : 0.5,
              cursor: acceptCGVU ? "pointer" : "not-allowed",
              transition: "opacity 0.2s",
            }}
          >
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
      <ModalMarkdown
        visible={showCGVU}
        onClose={() => setShowCGVU(false)}
        markdown={CGVU_MARKDOWN}
      />
    </>
  );
};

export default Register;