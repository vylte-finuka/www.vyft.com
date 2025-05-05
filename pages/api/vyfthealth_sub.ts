import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './lib/mongodb';

type ResponseData = {
  message: string;
} | { error: string };

export default async function vyfthealth_sub(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method === 'POST') {
      // Connexion à MongoDB
      const client = await clientPromise;
      const db = client.db('vyfbase'); // Nom de la base de données
      const collection = db.collection('vyfthealth'); // Nom de la collection

      // Récupérer les données envoyées dans le corps de la requête
      const { name, steps, time, enseigne, distance = 0, date = new Date().toISOString() } = req.body;

      // Vérifier que les champs obligatoires sont présents
      if (!name || !time || !enseigne) {
        return res.status(400).json({ error: 'Les champs name, time et enseigne sont requis.' });
      }

      // Insérer les données dans MongoDB
      const result = await collection.insertOne({
        name,
        steps: steps || 0, // Par défaut, 0 si steps est null ou undefined
        distance: parseFloat(distance).toFixed(5), // Par défaut, 0 si distance est null ou undefined
        date,
        time,
        enseigne,
      });

      console.log('Données insérées dans MongoDB :', result);

      res.status(201).json({ message: 'Données insérées avec succès.' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ error: 'Méthode non autorisée.' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données dans MongoDB :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}