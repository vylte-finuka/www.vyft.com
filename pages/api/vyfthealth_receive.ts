import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "./lib/mongodb";

type ResponseData = {
  name: string;
  steps: number;
  distance: string; // Distance arrondie à 5 décimales
  time: string; // Heure au format ISO
}[];

export default async function vyfthealth_receive(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  try {
    if (req.method === "GET") {
      // Désactiver la mise en cache
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");

        // Vérification de la clé API
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ error: "Clé API invalide ou manquante." });
  }

      // Connexion à MongoDB
      const client = await clientPromise;
      const db = client.db("vyfbase"); // Nom de la base de données
      const collection = db.collection("vyfthealth"); // Nom de la collection

      // Récupérer les données depuis la collection
      const data = await collection.find({}).toArray();

      // Vérifier si des données existent
      if (data.length === 0) {
        return res.status(404).json({ error: "Aucune donnée trouvée." });
      }

      // Formater les données pour correspondre à la structure attendue
      const formattedData = data.map((item) => ({
        name: item.name,
        steps: item.steps,
        distance: parseFloat(item.distance).toFixed(2), // Arrondi à 5 décimales
        time: item.time, // Heure au format ISO
        enseigne: item.enseigne,
      }));

      res.status(200).json(formattedData);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: "Méthode non autorisée." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données MongoDB :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}