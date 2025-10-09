"use client";

import React from 'react';
import Link from "next/link";
import styles from "./Navbar.module.css";
import SquareAIFloat from './SquareAIFloat';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
      <Link href="/conditions-generales-d-utilisation" className={styles.fontstyle3}>Conditions Générales d&apos;Utilisation</Link>
      </div>
      <div className={styles.copyright}>
        <p className={styles.fontstyle2}>© 2025 - Vylte-finuka SARL, Tous droits réservés.</p>
      </div>
      <SquareAIFloat />
    </footer>
  );
};

export default Footer;