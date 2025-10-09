/* eslint-disable @next/next/no-sync-scripts */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isSubSubMenuOpen, setIsSubSubMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // État pour le sous-menu du profil

  return (
      <nav className={styles.Navbar}>
      <div className={styles.logo}>
          <Link legacyBehavior href="/">
            <a>
              <Image 
              src="/vyft.png" 
              alt="Vyftprogram" 
              width={166} 
              height={112} 
              className={styles.logo} 
              onContextMenu={(e) => e.preventDefault()} // Empêche le clic droit
              onDragStart={(e) => e.preventDefault()} // Empêche le glisser-déposer
              />
            </a>
          </Link><script src="https://raw.githubusercontent.com/SjomaNikitin/image-download-blocker/main/ImageBlocker.js"></script>
        </div>
        <ul className={styles.navLinks}>
          {/* Section Écosystème */}
          <li>
            <span className={styles.fontstyle}>Écosystème</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/ecosystem/vyft-slide" className={styles.fontstyle1}>Vyft slide</Link></li>
              <li><Link href="/ecosystem/vyft-program" className={styles.fontstyle1}>Vyft program</Link></li>
              <li><Link href="/ecosystem/luzia" className={styles.fontstyle1}>LUZIA</Link></li>
            </ul>
          </li>

          {/* Section Offres */}
          <li>
            <span className={styles.fontstyle}>Offres</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/offer/cashbacks" className={styles.fontstyle1}>Cashbacks</Link></li>
              <li><Link href="/offer/partenaires" className={styles.fontstyle1}>Promotions</Link></li>
            </ul>
          </li>

          {/* Section Gestion des risques */}
          <li>
            <span className={styles.fontstyle}>Story time</span>
            <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
              <li><Link href="/story/vyft" className={styles.fontstyle1}>Vyft</Link></li>
              <li><Link href="/story/vyft-program" className={styles.fontstyle1}>Vyft program</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
  );
};

export default Navbar;