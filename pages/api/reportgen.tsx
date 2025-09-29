import type { NextApiRequest, NextApiResponse } from "next";
import { pdf } from "@react-pdf/renderer";
import DynamicReport from "../../app/components/DynamicReport";
import ReportVyft from "../../app/components/reportvyft";
import fs from "fs";
import path from "path";
import axios from "axios";

// Télécharge une image distante et la sauvegarde localement
export async function fetchAndSaveImage(url: string, filename: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const ext = /\.(png|jpg|jpeg|webp)$/i.test(url) ? path.extname(url) : ".jpg";
    const base64 = Buffer.from(response.data).toString("base64");
    const mime = ext === ".png" ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${base64}`;
  } catch (err: any) {
    // Charge l'image par défaut en base64
    const defaultPath = path.join(process.cwd(), "public", "tmp", "default.jpg");
    try {
      const defaultBuffer = fs.readFileSync(defaultPath);
      const base64 = Buffer.from(defaultBuffer).toString("base64");
      return `data:image/jpeg;base64,${base64}`;
    } catch {
      return ""; // Aucun fallback possible
    }
  }
}

async function processImages(obj: any): Promise<any> {
  if (!obj) return obj;
  if (typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "string" && /^https?:\/\//.test(obj[key])) {
        const urlWithoutParams = obj[key].split("?")[0];
        if (!/\.(png|jpg|jpeg|webp)$/i.test(urlWithoutParams)) {
          // Télécharge et remplace par le chemin local
          const filename = "img_" + Buffer.from(obj[key]).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
          obj[key] = await fetchAndSaveImage(obj[key], filename);
        } else {
          // Pour les images avec extension, télécharge aussi localement
          const filename = "img_" + Buffer.from(obj[key]).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
          obj[key] = await fetchAndSaveImage(obj[key], filename);
        }
      } else if (typeof obj[key] === "object") {
        obj[key] = await processImages(obj[key]);
      }
    }
  }
  return obj;
}

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
    let props = req.body;
    props = await processImages(props); // <--- Ajout ici
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

    // Nettoyage des fichiers images dans public/tmp (sauf default.jpg)
    const tmpDir = path.join(process.cwd(), "public", "tmp");
    fs.readdirSync(tmpDir).forEach(file => {
      if (file !== "default.jpg") {
        try {
          fs.unlinkSync(path.join(tmpDir, file));
        } catch (e) {
          // Ignore les erreurs de suppression
        }
      }
    });
  } catch (error: any) {
    console.error("Erreur reportgen :", error);
    res.status(500).json({
      error: "Erreur interne lors de la génération du PDF",
      details: error?.message || error?.toString() || error
    });
    
  }
}