/* eslint-disable @next/next/no-sync-scripts */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { useParams } from "next/navigation";

const Navbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isSubSubMenuOpen, setIsSubSubMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const params = useParams() as { lang?: string } | undefined;
  const locale = params?.lang === "fr-FR" ? "fr-FR" : "en-EN";

  const t = {
    "fr-FR": {
      ecosystem: "Écosystème",
      slide: "Vyft slide",
      slura: "Vyft slura",
      luzia: "LUZIA",
      offers: "Offres",
      cashbacks: "Cashbacks",
      partners: "Promotions",
      story: "Story time",
      vyft: "Vyft",
      vyftProgram: "Vyft program",
    },
    "en-EN": {
      ecosystem: "Ecosystem",
      slide: "Vyft slide",
      slura: "Vyft slura",
      luzia: "LUZIA",
      offers: "Offers",
      cashbacks: "Cashbacks",
      partners: "Promotions",
      story: "Story time",
      vyft: "Vyft",
      vyftProgram: "Vyft program",
    }
  }[locale];

  return (
    <nav className={styles.Navbar}>
      <div className={styles.logo}>
        <Link legacyBehavior href={`/${locale}`}>
          <a>
            <Image 
              src="/vyft.png" 
              alt="Vyftprogram" 
              width={166} 
              height={112} 
              className={styles.logo} 
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </a>
        </Link>
      </div>
      <ul className={styles.navLinks}>
        {/* Section Écosystème */}
        <li>
          <span className={styles.fontstyle}>{t.ecosystem}</span>
          <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
            <li><Link href={`/${locale}/ecosystem/vyft-slide`} className={styles.fontstyle1}>{t.slide}</Link></li>
            <li><Link href={`/${locale}/ecosystem/vyft-slura`} className={styles.fontstyle1}>{t.slura}</Link></li>
            <li><Link href={`/${locale}/ecosystem/luzia`} className={styles.fontstyle1}>{t.luzia}</Link></li>
          </ul>
        </li>

        {/* Section Offres */}
        <li>
          <span className={styles.fontstyle}>{t.offers}</span>
          <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
            <li><Link href={`/${locale}/offer/cashbacks`} className={styles.fontstyle1}>{t.cashbacks}</Link></li>
            <li><Link href={`/${locale}/offer/partenaires`} className={styles.fontstyle1}>{t.partners}</Link></li>
          </ul>
        </li>

        {/* Section Story time */}
        <li>
          <span className={styles.fontstyle}>{t.story}</span>
          <ul className={`${styles.subMenu} ${isSubMenuOpen ? styles.open : ''}`}>
            <li><Link href={`/${locale}/story/vyft`} className={styles.fontstyle1}>{t.vyft}</Link></li>
            <li><Link href={`/${locale}/story/vyft-program`} className={styles.fontstyle1}>{t.vyftProgram}</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;