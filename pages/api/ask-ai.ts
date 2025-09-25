import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || "", // Mets ta clé OpenRouter dans .env.local
});

type Message = { from: "ai" | "user"; text: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

      // Vérification de la clé API
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const { messages } = req.body as { messages: Message[] };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Messages manquants ou invalides" });
    return;
  }

  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.from === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    const completion = await openai.chat.completions.create({
      model: "x-ai/grok-3",
      messages: formattedMessages as any,
      max_tokens: 300,
      temperature: 0.7,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || "";
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Erreur OpenRouter:", error);
    res.status(500).json({ error: "Erreur serveur IA", details: error?.message || error?.toString() });
  }
}