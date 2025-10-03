import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "./lib/mongodb";

export default async function receive_tokpushnot(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const { userId, firstName, lastName, country } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Paramètre userId manquant." });
  }

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("vyfbase");
    await db.collection("tokpushnot").updateOne(
      { userId },
      {
        $set: {
          firstName: firstName || "",
          lastName: lastName || "",
          country: country || "",
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    return res.status(200).json({ success: true, message: "Infos enregistrées." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
}