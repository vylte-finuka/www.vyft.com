import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vylte-finuka.com';

  // Langues supportées
  const langs = ['fr-FR', 'en-EN'];

  // Routes principales
  const mainRoutes = [
    '',
    'ecosystem/vyft-slide',
    'ecosystem/vyft-program',
    'ecosystem/luzia',
    'offer/cashbacks',
    'offer/partenaires',
    'story/vyft',
    'story/vyft-program',
    'conditions-generales-d-utilisation',
  ];

  // Génère toutes les URLs pour chaque langue
  const urls = langs.flatMap(lang =>
    mainRoutes.map(route => ({
      url: `${baseUrl}/${lang}${route ? '/' + route : ''}`,
      lastModified: new Date().toISOString(),
    }))
  );

  // Ajoute la racine sans langue (redirige automatiquement)
  urls.push({
    url: `${baseUrl}/`,
    lastModified: new Date().toISOString(),
  });

  return urls;
}