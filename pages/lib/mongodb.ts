import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Assurez-vous que l'URI est défini dans .env
const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI');
}

// Créez une connexion MongoDB pour la production
const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;