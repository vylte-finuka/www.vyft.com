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
                        <div className={styles.header}>
                            Dernière mise à jour : 25 septembre 2025
                        </div>

                        {/* Définitions à connaître */}
                        <h2 className={styles.headeronwhite}>Définitions à connaître</h2>
                        <ul className={styles.bodyonwhite} style={{ marginBottom: 24 }}>
                            <li>
                                <b>Vyft Program</b> : plateforme SaaS de gestion de la relation client (CRM) et d’analyse d’activité physique.
                            </li>
                            <li>
                                <b>Utilisateur</b> : toute personne physique ou morale utilisant Vyft Program.
                            </li>
                            <li>
                                <b>Prestataire sécurisé</b> : service tiers spécialisé et certifié pour la gestion des comptes, abonnements et paiements (ex : Square).
                            </li>
                            <li>
                                <b>Dénomination</b> : la société éditrice du service, à savoir Vylte-finuka SARL, SIRET 92978865100016, 60 rue François 1er, 75008 Paris, France.
                            </li>
                        </ul>

                        <h2 className={styles.headeronwhite}>À propos de Vyft Program</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vyft Program est un outil conçu pour l’application Vyft, une solution de suivi et d’analyse des pas et de l’activité physique de vos clients.<br />
                            Il permet aux entreprises de suivre les pas réalisés dans leurs établissements, d’analyser la fréquentation, de générer des statistiques de performance et d’automatiser la gestion de la relation client.<br />
                            Il permet aussi aux services de la commune d’organiser des marchés ou événements dans des lieux spécifiques et de suivre la fréquentation grâce à l’application.
                        </h3>
                        <h2 className={styles.headeronwhite}>Fonctionnalités principales</h2>
                        <ul className={styles.bodyonwhite} style={{ marginBottom: 24 }}>
                            <li>Suivi en temps réel du nombre de pas effectués par les clients dans votre enseigne.</li>
                            <li>Analyse des données de fréquentation et de l’engagement client.</li>
                            <li>Tableau de bord pour visualiser les réclamations et les statistiques d’activité.</li>
                            <li>Gestion des abonnements via un <b>prestataire sécurisé</b> (Square) en mode &quot;pay as you go&quot;.</li>
                            <li>Génération et impression de QR codes pour le suivi d’entrée et de sortie (Vyft tag™).</li>
                            <li>Export et impression des statistiques et des tags pour vos opérations marketing.</li>
                            <li>Support technique dédié et gestion des accès utilisateurs.</li>
                            <li>Outils pour les services de la commune afin de suivre la fréquentation lors d’événements ou marchés dans des lieux spécifiques.</li>
                        </ul>
                        <h2 className={styles.headeronwhite}>1. Objet</h2>
                        <h3 className={styles.bodyonwhite}>
                            Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société <b>Vylte-finuka SARL</b> (SIRET 92978865100016), 60 rue François 1er, 75008 Paris, France, conforme à la réglementation de l’Union Européenne.
                        </h3>
                        <h2 className={styles.headeronwhite}>2. Accès au service</h2>
                        <h3 className={styles.bodyonwhite}>
                            L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné à la souscription d’un abonnement géré par un <b>prestataire sécurisé</b>.
                        </h3>
                        <h2 className={styles.headeronwhite}>3. Description du service</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment.
                        </h3>
                        <h2 className={styles.headeronwhite}>4. Commande et abonnement</h2>
                        <h3 className={styles.bodyonwhite}>
                            L’abonnement fonctionne aujourd’hui en mode &quot;pay as you go&quot; via un <b>prestataire sécurisé</b> (Square). Nous manipulons les données uniquement dans les cas nécessaires. L’abonnement peut être révoqué à tout moment en contactant le support à l’adresse support@vylte-finuka.com.
                        </h3>
                        <h2 className={styles.headeronwhite}>5. Prix et paiement</h2>
                        <h3 className={styles.bodyonwhite}>
                            Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email.
                        </h3>
                        <h2 className={styles.headeronwhite}>6. Résiliation</h2>
                        <h3 className={styles.bodyonwhite}>
                            L’utilisateur peut demander la révocation de son abonnement à tout moment en contactant le support à support@vylte-finuka.com. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU.
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
                            Les présentes CGVU sont soumises au droit français et à la réglementation de l’Union Européenne. Tout litige sera porté devant les tribunaux compétents de Paris.
                        </h3>
                        <h2 className={styles.headeronwhite}>14. Contact</h2>
                        <h3 className={styles.bodyonwhite}>
                            Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris.
                        </h3>
                        <h2 className={styles.headeronwhite}>À propos du rapport PDF et de la grille d&apos;influence</h2>
                        <h3 className={styles.bodyonwhite}>
                            Le rapport PDF généré par Vyft Program contient un tableau de suivi de l’influence et de la fréquentation sur 800 jours :
                            <ul>
                                <li>
                                    <b>Ligne supérieure (1 à 32)</b> : chaque colonne correspond à un jour du mois (du 1<sup>er</sup> au 32<sup>e</sup> jour, pour couvrir tous les cas de mois).
                                </li>
                                <li>
                                    <b>Légende inférieure (M1, M2, ...)</b> : chaque “M” indique le numéro du mois affiché (M1 = premier mois, M2 = deuxième mois, etc.).
                                </li>
                                <li>
                                    Chaque case du tableau représente l’activité d’un jour donné, la couleur indiquant le niveau d’influence ou de fréquentation.
                                </li>
                            </ul>
                            Ce format permet de visualiser rapidement l’évolution de l’activité jour par jour et mois par mois.
                        </h3>
                        <h2 className={styles.headeronwhite}>15. Utilisation de l’Intelligence Artificielle (IA)</h2>
                        <h3 className={styles.bodyonwhite}>
                            Vyft Program propose une fonctionnalité d’assistance par intelligence artificielle (IA) nommée <b>Vyft Nérethense</b>, permettant de répondre à vos questions, d’analyser vos données et de vous conseiller sur l’utilisation de la plateforme.<br />
                            <ul>
                                <li>
                                    Les réponses fournies par l’IA Vyft Nérethense sont générées automatiquement à partir de vos données et des informations disponibles sur la plateforme. Elles sont données à titre indicatif et ne sauraient se substituer à un conseil professionnel personnalisé.
                                </li>
                                <li>
                                    L’utilisateur s’engage à ne pas soumettre de données sensibles, confidentielles ou à caractère personnel non nécessaires lors de l’utilisation de l’IA.
                                </li>
                                <li>
                                    Vylte-finuka ne pourra être tenue responsable des décisions prises sur la base des réponses de l’IA.
                                </li>
                                <li>
                                    L’utilisation de l’IA Vyft Nérethense est soumise au respect des présentes CGVU et à la politique de confidentialité de Vyft Program.
                                </li>
                            </ul>
                        </h3>
                        
                        {/* RENDU JSON POUR L'IA */}
                        <script
                            type="application/json"
                            id="vyft-cgvu-json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    cgvu: `
Conditions Générales de Vente et d’Utilisation

Définitions à connaître
- "Vyft Program" : plateforme SaaS de gestion de la relation client (CRM) et d’analyse d’activité physique.
- "Utilisateur" : toute personne physique ou morale utilisant Vyft Program.
- "Prestataire sécurisé" : service tiers spécialisé et certifié pour la gestion des comptes, abonnements et paiements (ex : Square).
- "Dénomination" : la société éditrice du service, à savoir Vylte-finuka SARL, SIRET 92978865100016, 60 rue François 1er, 75008 Paris, France.

À propos de Vyft Program
Vyft Program est un outil conçu pour l’application Vyft, une solution de suivi et d’analyse des pas et de l’activité physique de vos clients.
Il permet aux entreprises de suivre les pas réalisés dans leurs établissements, d’analyser la fréquentation, de générer des statistiques de performance et d’automatiser la gestion de la relation client.
Il permet aussi aux services de la commune d’organiser des marchés ou événements dans des lieux spécifiques et de suivre la fréquentation grâce à l’application.

Fonctionnalités principales
- Suivi en temps réel du nombre de pas effectués par les clients dans votre enseigne.
- Analyse des données de fréquentation et de l’engagement client.
- Tableau de bord pour visualiser les réclamations et les statistiques d’activité.
- Gestion des abonnements via un prestataire sécurisé (Square) en mode "pay as you go".
- Génération et impression de QR codes pour le suivi d’entrée et de sortie (Vyft tag™).
- Export et impression des statistiques et des tags pour vos opérations marketing.
- Support technique dédié et gestion des accès utilisateurs.
- Outils pour les services de la commune afin de suivre la fréquentation lors d’événements ou marchés dans des lieux spécifiques.

1. Objet
Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société Vylte-finuka SARL (SIRET 92978865100016), 60 rue François 1er, 75008 Paris, France, conforme à la réglementation de l’Union Européenne.

2. Accès au service
L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné à la souscription d’un abonnement géré par un prestataire sécurisé.

3. Description du service
Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment.

4. Commande et abonnement
L’abonnement fonctionne aujourd’hui en mode "pay as you go" via un prestataire sécurisé (Square). Nous manipulons les données uniquement dans les cas nécessaires. L’abonnement peut être révoqué à tout moment en contactant le support à l’adresse support@vylte-finuka.com.

5. Prix et paiement
Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email.

6. Résiliation
L’utilisateur peut demander la révocation de son abonnement à tout moment en contactant le support à support@vylte-finuka.com. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU.

7. Propriété intellectuelle
Tous les éléments du service (logiciel, interface, contenus, marques) sont la propriété exclusive de Vylte-finuka. Toute reproduction ou utilisation non autorisée est interdite.

8. Données personnelles
Les données personnelles sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.

9. Confidentialité et sécurité
Vylte-finuka met en œuvre les mesures techniques et organisationnelles pour assurer la sécurité des données. L’utilisateur s’engage à préserver la confidentialité de ses identifiants.

10. Responsabilité
Vylte-finuka ne saurait être tenue responsable des dommages indirects, pertes de données ou interruption de service. L’utilisateur est responsable de l’usage qu’il fait du service.

11. Support et maintenance
Un support technique est accessible par email à support@vylte-finuka.com. Vylte-finuka s’efforce d’assurer la disponibilité du service, sans garantie d’absence d’interruption.

12. Modifications des CGVU
Vylte-finuka se réserve le droit de modifier les présentes CGVU à tout moment. Les utilisateurs seront informés par email ou notification sur la plateforme.

13. Droit applicable et juridiction
Les présentes CGVU sont soumises au droit français et à la réglementation de l’Union Européenne. Tout litige sera porté devant les tribunaux compétents de Paris.

14. Contact
Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris.

À propos du rapport PDF et de la grille d'influence
Le rapport PDF généré par Vyft Program contient un tableau de suivi de l’influence et de la fréquentation sur 800 jours :
- Ligne supérieure (1 à 32) : chaque colonne correspond à un jour du mois (du 1er au 32e jour, pour couvrir tous les cas de mois).
- Légende inférieure (M1, M2, ...) : chaque “M” indique le numéro du mois affiché (M1 = premier mois, M2 = deuxième mois, etc.).
- Chaque case du tableau représente l’activité d’un jour donné, la couleur indiquant le niveau d’influence ou de fréquentation.
Ce format permet de visualiser rapidement l’évolution de l’activité jour par jour et mois par mois.

15. Utilisation de l’Intelligence Artificielle (IA)
Vyft Program propose une fonctionnalité d’assistance par intelligence artificielle (IA) nommée Vyft Nérethense, permettant de répondre à vos questions, d’analyser vos données et de vous conseiller sur l’utilisation de la plateforme.
- Les réponses fournies par l’IA Vyft Nérethense sont générées automatiquement à partir de vos données et des informations disponibles sur la plateforme. Elles sont données à titre indicatif et ne sauraient se substituer à un conseil professionnel personnalisé.
- L’utilisateur s’engage à ne pas soumettre de données sensibles, confidentielles ou à caractère personnel non nécessaires lors de l’utilisation de l’IA.
- Vylte-finuka ne pourra être tenue responsable des décisions prises sur la base des réponses de l’IA.
- L’utilisation de l’IA Vyft Nérethense est soumise au respect des présentes CGVU et à la politique de confidentialité de Vyft Program.

Dernière mise à jour : 25 septembre 2025
                                    `
                                })
                            }}
                        />
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}