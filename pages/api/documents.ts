import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "./lib/mongodb";

export default async function listDocuments(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ error: "Clé API invalide ou manquante." });
  }

  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: "userId requis." });
  }

  const client = await clientPromise;
  const db = client.db("vyfbase");
  const collection = db.collection("vyft_documents");
  const docs = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();

  res.status(200).json({ documents: docs });
}