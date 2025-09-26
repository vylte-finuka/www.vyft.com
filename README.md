# Vyft Program

![Vyft Program](public/vyft_program.png)

Vyft Program est une plateforme SaaS de gestion de la relation client (CRM) moderne, pensée pour les entreprises souhaitant centraliser et optimiser le marché à l'intermédiare de l'application Vyft.

## Fonctionnalités principales

- Gestion des contacts et des réclamations
- Tableau de bord en temps réel
- Analyse des données clients
- Abonnement mensuel ou annuel via Stripe
- Sécurité et confidentialité des données (RGPD)
- Support technique dédié

## Démarrage rapide

Installez les dépendances puis lancez le serveur de développement :

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour accéder à l’application.

## Structure du projet

- `app/` : Pages et composants principaux (Next.js)
- `pages/api/` : API backend (Node.js/Next.js)
- `public/` : Fichiers statiques (dont le logo)
- `styles/` : Feuilles de style CSS

## Personnalisation

Modifiez `app/page.tsx` pour adapter le tableau de bord à vos besoins.  
Les CGVU sont disponibles dans `pages/condition-generale-de-vente.tsx`.

## Documentation

- [Documentation Next.js](https://nextjs.org/docs)
- [Déploiement sur Netlify](https://app.netlify.com)

## Support

Pour toute question ou demande