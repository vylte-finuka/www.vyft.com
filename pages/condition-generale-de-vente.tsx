"use client";

import React from 'react';
import Navbar from "../app/components/Navbar";
import styles from "../app/page.module.css";
import Footer from '@/app/components/Footer';

export default function CGVU() {
    return (
        <>
            <title>Conditions Générales de Vente et d’Utilisation - Vyft Program</title>
            <div>
                <div className={styles.container2}>
                    <Navbar />
                    <main className={styles.main}>
                        <h1 className={styles.headeronwhiteX2}>Conditions Générales de Vente et d’Utilisation</h1>
                        <h2 className={styles.headeronwhite}>1. Objet</h2>
                        <h3 className={styles.bodyonwhite}>
                            Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société Vylte-finuka SARL.
                        </h3>
                        <h2 className={styles.headeronwhite}>2. Accès au service</h2>
                        <h3 className={styles.bodyonwhite}>
                            L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné au paiement de l’abonnement souscrit.
                        </h3>
                        <h2 className={styles.headeronwhite}>3. Description du service</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment.
                        </h3>
                        <h2 className={styles.headeronwhite}>4. Commande et abonnement</h2>
                        <h3 className={styles.bodyonwhite}>
                            L’abonnement est souscrit en ligne pour la durée choisie (mensuelle ou annuelle). Le paiement s’effectue par carte bancaire via Stripe. L’abonnement est renouvelé automatiquement sauf résiliation par l’utilisateur avant l’échéance.
                        </h3>
                        <h2 className={styles.headeronwhite}>5. Prix et paiement</h2>
                        <h3 className={styles.bodyonwhite}>
                            Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email.
                        </h3>
                        <h2 className={styles.headeronwhite}>6. Résiliation</h2>
                        <h3 className={styles.bodyonwhite}>
                            L’utilisateur peut résilier son abonnement à tout moment depuis son espace client ou en contactant le support. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU.
                        </h3>
                        <h2 className={styles.headeronwhite}>7. Propriété intellectuelle</h2>
                        <h3 className={styles.bodyonwhite}>
                            Tous les éléments du service (logiciel, interface, contenus, marques) sont la propriété exclusive de Vylte-finuka. Toute reproduction ou utilisation non autorisée est interdite.
                        </h3>
                        <h2 className={styles.headeronwhite}>8. Données personnelles</h2>
                        <h3 className={styles.bodyonwhite}>
                            Les données personnelles sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.
                        </h3>
                        <h2 className={styles.headeronwhite}>9. Confidentialité et sécurité</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vylte-finuka met en œuvre les mesures techniques et organisationnelles pour assurer la sécurité des données. L’utilisateur s’engage à préserver la confidentialité de ses identifiants.
                        </h3>
                        <h2 className={styles.headeronwhite}>10. Responsabilité</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vylte-finuka ne saurait être tenue responsable des dommages indirects, pertes de données ou interruption de service. L’utilisateur est responsable de l’usage qu’il fait du service.
                        </h3>
                        <h2 className={styles.headeronwhite}>11. Support et maintenance</h2>
                        <h3 className={styles.bodyonwhite}>
                            Un support technique est accessible par email à support@vylte-finuka.com. Vylte-finuka s’efforce d’assurer la disponibilité du service, sans garantie d’absence d’interruption.
                        </h3>
                        <h2 className={styles.headeronwhite}>12. Modifications des CGVU</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vylte-finuka se réserve le droit de modifier les présentes CGVU à tout moment. Les utilisateurs seront informés par email ou notification sur la plateforme.
                        </h3>
                        <h2 className={styles.headeronwhite}>13. Droit applicable et juridiction</h2>
                        <h3 className={styles.bodyonwhite}>
                            Les présentes CGVU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents de Paris.
                        </h3>
                        <h2 className={styles.headeronwhite}>14. Contact</h2>
                        <h3 className={styles.bodyonwhite}>
                            Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris.
                        </h3>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}







