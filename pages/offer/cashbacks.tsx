/* eslint-disable @next/next/no-head-element */
"use client";

import React from 'react';
import styles from "../../app/page.module.css";
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar'; // Assurez-vous que l'importation de Navbar est correcte

export default function Cashback() {
    return (
        <>
            <div className={styles.container2}>
                <head>
                    <title>En construction - Vyft program:  La néobanque à la vertu de la finance..</title>
                </head>
                <Navbar />
                <main className={styles.main}>
                    <p className={styles.bodyonwhitemessage}>
                        Cette fonctionnalité n&apos;est pas encore disponible.
                    </p>
                </main>
                <Footer />
            </div>
        </>
    );
}