"use client";

import React from 'react';
import Navbar from "@/app/[lang]/components/Navbar";
import styles from "@/app/page.module.css";
import Footer from '@/app/[lang]/components/Footer';
import ReactMarkdown from 'react-markdown';
import CGU_Vyft_content_fr from "@/app/[lang]/components/CGU_Vyft_content_fr";
import CGU_Vyft_content_en from "@/app/[lang]/components/CGU_Vyft_content_en";
import { useRouter } from "next/router";

export default function CGVU() {
    const router = useRouter();
    const lang = router.query.lang as string | undefined;
    const isFrench = lang === "fr-FR";
    const content = isFrench ? CGU_Vyft_content_fr : CGU_Vyft_content_en;

    return (
        <>
            <title>Conditions Générales d’Utilisation - Vyft</title>
            <div>
                <div className={styles.container2}>
                    <Navbar />
                    <main className={styles.main}>
                        {/* CGU stylisé en Markdown */}
                        <div className={styles.bodyonwhite} style={{ marginBottom: 24 }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h1 className={styles.headeronwhiteX2} {...props} />,
                                    h2: ({node, ...props}) => <h2 className={styles.headeronwhiteX2} style={{fontSize:22, marginTop:32}} {...props} />,
                                    h3: ({node, ...props}) => <h3 className={styles.headeronwhiteX2} style={{fontSize:18, marginTop:24}} {...props} />,
                                    p: ({node, ...props}) => <p className={styles.bodyonwhite} style={{marginBottom:12}} {...props} />,
                                    ul: ({node, ...props}) => <ul style={{marginLeft:24, marginBottom:12}} {...props} />,
                                    li: ({node, ...props}) => <li style={{marginBottom:6}} {...props} />,
                                    strong: ({node, ...props}) => <strong style={{color:"#1a7f6b"}} {...props} />,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}