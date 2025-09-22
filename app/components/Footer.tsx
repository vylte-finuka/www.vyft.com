"use client";

import React from 'react';
import Link from "next/link";
import styles from "./Navbar.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href="/conditions-generales-de-vente" className={styles.fontstyle1}>Conditions Générales de Vente et d&apos;Utilisation</Link>        
      </div>
      <div className={styles.copyright}>
        <p className={styles.fontstyle1}>© 2025 - Vylte-finuka SARL, Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
