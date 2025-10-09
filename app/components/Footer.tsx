"use client";

import React from 'react';
import Link from "next/link";
import styles from "./Navbar.module.css";
import SquareAIFloat from "./SquareAIFloat"; // Ajout de l'import

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.links}>
          <Link href="/conditions-generales-d-utilisation" className={styles.fontstyle1}>Conditions Générales d&apos;Utilisation</Link>        
        </div>
        <div className={styles.copyright}>
          <p className={styles.fontstyle1}>© 2025 - Vylte-finuka SARL, Tous droits réservés.</p>
        </div>
      </footer>
      <SquareAIFloat /> {/* Ajout du chat IA */}
    </>
  );
};

export default Footer;
