import type { NextApiRequest, NextApiResponse } from "next";
import { pdf } from "@react-pdf/renderer";
import DynamicReport from "../../app/components/DynamicReport";
import ReportVyft from "../../app/components/reportvyft";

export default async function vyftreport(req: NextApiRequest, res: NextApiResponse) {
  // Sécurité par clé API
  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ error: "Clé API invalide ou manquante." });
  }

  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const props = req.body;
    // Choix du composant selon le type/design IA
    const useVyft = props.type === "vyft" || !props.design;
    const pdfBlob = await pdf(
      useVyft ? <ReportVyft {...props} /> : <DynamicReport {...props} />
    ).toBlob();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${props.title ? props.title.replace(/\s/g, "_") : "document"}.pdf`
    );
    res.end(Buffer.from(await pdfBlob.arrayBuffer()));
  } catch (error: any) {
    console.error("Erreur reportgen :", error);
    res.status(500).json({
      error: "Erreur interne lors de la génération du PDF",
      details: error?.message || error?.toString() || error
    });
    
  }
}