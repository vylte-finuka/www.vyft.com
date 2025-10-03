import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "./lib/mongodb";

export default async function pushnot(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    // Vérification de la clé API
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }

  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId manquant." });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("vyfbase");

    // Récupère les notifications où le user est destinataire
    const notifications = await db.collection("vyft_notifi")
      .find({ recipients: { $in: [userId] } })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return res.status(200).json({ success: true, notifications });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const { userToken, title, message } = req.body;
  if (!userToken || !title || !message) {
    return res.status(400).json({ success: false, message: "Paramètres manquants." });
  }

  // Récupère tous les utilisateurs avec un userId
  const mongoClient = await clientPromise;
  const db = mongoClient.db("vyfbase");
  const users = await db.collection("tokpushnot").find({ userId: { $exists: true } }).toArray();

  // Stocke la notification dans vyft_notifi pour tous les utilisateurs
  await db.collection("vyft_notifi").insertOne({
    title,
    message,
    createdAt: new Date(),
    sentBy: "admin",
    recipients: users.map(u => u.userId) // <-- Utilise le bon identifiant
  });

  return res.status(200).json({ success: true, message: "Notification enregistrée pour tous les utilisateurs." });
}