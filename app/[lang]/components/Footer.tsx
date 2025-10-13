"use client";

import React from 'react';
import Link from "next/link";
import styles from "./Navbar.module.css";
import SquareAIFloat from './SquareAIFloat';
import { useParams } from "next/navigation";

export default function Footer() {
 const params = useParams() as { lang?: string } | undefined;
  const locale = params?.lang === "fr-FR" ? "fr-FR" : "en-EN";

  const t = {
    "fr-FR": {
      cgu: "Conditions Générales d'Utilisation",
      copyright: "© 2025 - Vylte-finuka SARL, Tous droits réservés."
    },
    "en-EN": {
      cgu: "Terms of Use",
      copyright: "© 2025 - Vylte-finuka SARL, All rights reserved."
    }
  }[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href={`/${locale}/conditions-generales-d-utilisation`} className={styles.fontstyle3}>{t.cgu}</Link>
      </div>
      <div className={styles.copyright}>
        <p className={styles.fontstyle1}>{t.copyright}</p>
      </div>
      <SquareAIFloat />
    </footer>
  );
}