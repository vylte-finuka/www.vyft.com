import type { NextApiRequest, NextApiResponse } from "next";
import { pdf } from "@react-pdf/renderer";
import { createElement } from "react";
import ReportVyft from "../../app/components/reportvyft";

export default async function vyftreport(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const props = req.body;
    // Utilise createElement pour éviter les erreurs JSX côté Node
    const pdfBlob = await pdf(<ReportVyft {...props} />).toBlob();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vyft-program-report.pdf"
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