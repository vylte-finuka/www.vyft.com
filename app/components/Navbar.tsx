"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import styles from "./Navbar.module.css";
import AuthGuard from "./AuthGuard"; // Importer AuthGuard

const Navbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isSubSubMenuOpen, setIsSubSubMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // État pour stocker la photo de profil
  const [userSub, setUserSub] = useState<string | null>(null); // État pour stocker le sub (identifiant utilisateur)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // État pour le sous-menu du profil


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Récupérer le jeton utilisateur depuis secureLocalStorage
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
        if (!userToken) {
          console.error("User token not found in secureLocalStorage");
          return;
        }

        // Appeler /userinfo pour obtenir les informations utilisateur
        const userInfoResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;

        // Extraire le sub et la photo de profil
        setUserSub(userInfo.sub);
        setProfilePicture(userInfo.picture);
      } catch (err) {
        console.error("Erreur lors de la récupération des informations utilisateur :", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    try {
      // Supprimer toutes les données utilisateur de secureLocalStorage
      secureLocalStorage.clear(); // Efface toutes les clés stockées dans secureLocalStorage
  
      // Supprimer également les données de localStorage si elles y sont stockées
      localStorage.removeItem("userToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("picture");
  
      // Rediriger vers le lien de déconnexion Auth0
      window.location.href = `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${window.location.origin}`;
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <AuthGuard>
      <nav className={styles.Navbar}>
        <div className={styles.logo}>
          <Link legacyBehavior href="/">
            <a>
              <Image 
              src="/Vyft_program.png" 
              alt="Vyftprogram" 
              width={166} 
              height={74} 
              className={styles.logo} 
              draggable={false} // Empêche le glisser-déposer
              onContextMenu={(e) => e.preventDefault()} // Empêche le clic droit
              />
            </a>
          </Link>
        </div>
        <ul className={styles.navLinks}>
          {/* Section Administration */}
          <li>
            <span className={styles.fontstyle}>Administration</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/administration/main-management" className={styles.fontstyle1}>Gestion principale</Link></li>
              <li><Link href="/administration/reports" className={styles.fontstyle1}>Rapports</Link></li>
              <li><Link href="/administration/settings" className={styles.fontstyle1}>Paramètres</Link></li>
            </ul>
          </li>

          {/* Section Évènements */}
          <li>
            <span className={styles.fontstyle}>Évènements</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/events/statistics" className={styles.fontstyle1}>Statistiques</Link></li>
              <li><Link href="/events/management" className={styles.fontstyle1}>Management</Link></li>
            </ul>
          </li>

          {/* Section Gestion des risques */}
          <li>
            <span className={styles.fontstyle}>Gestion des risques</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/risk-management/accounting" className={styles.fontstyle1}>Comptabilité</Link></li>
              <li><Link href="/risk-management/cashback" className={styles.fontstyle1}>Cashback</Link></li>
            </ul>
          </li>

          {/* Section Règlementations */}
          <li>
            <span className={styles.fontstyle}>Règlementations</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/regulations/aml" className={styles.fontstyle1}>AML</Link></li>
              <li><Link href="/regulations/kyc" className={styles.fontstyle1}>KYC</Link></li>
              <li><Link href="/regulations/pci-dss" className={styles.fontstyle1}>PCI-DSS</Link></li>
            </ul>
          </li>

          {/* Bouton carré avec la photo de profil */}
          <li className={styles.profileContainer}>
            <div
              className={styles.ActionEbutton}
              style={{
                backgroundImage: profilePicture ? `url(${profilePicture})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} // Ouvrir/fermer le sous-menu
            ></div>
            <ul className={`${styles.subMenu} ${isProfileMenuOpen ? styles.open : ""}`}>
              <li>
                <span className={styles.fontstyle1}>Mon Profil</span>
              </li>
              <li onClick={handleLogout} className={styles.fontstyle1}>
                Déconnexion
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </AuthGuard>
  );
};

export default Navbar;