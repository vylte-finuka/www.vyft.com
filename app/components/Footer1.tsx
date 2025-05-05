"use client";

import React from 'react';
import Link from "next/link";
import styles from "./Navbar.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
      <Link href="/conditions-generals-de-vente" className={styles.fontstyle3}>Conditions générals d&apos;utilisation</Link>
      </div>
      <div className={styles.copyright}>
        <p className={styles.fontstyle2}>© 2025 - Vylte-finuka SARL, Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;