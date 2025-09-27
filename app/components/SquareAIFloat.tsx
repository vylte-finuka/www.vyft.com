"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../page.module.css";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

type Message = { from: "ai" | "user"; text: string };

interface DocumentFormData {
  type: string;
  title: string;
  params: { [key: string]: string };
}

// Call Grok-3 via /api/ask-ai (OpenRouter with x-ai/grok-3)
async function callmodelAPI(messages: Message[]): Promise<{
  reply: string;
  isDocument?: boolean;
  docData?: { title: string; content: string; props?: any; type?: string; design?: any };
}> {
  const res = await fetch("/api/ask-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error(`Erreur API: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error || "Erreur serveur IA");
  }

  let reply = data.reply || "";
  let isDocument = false;
  let docData: { title: string; content: string; props?: any; type?: string; design?: any } | undefined;

  try {
    const parsed = JSON.parse(reply);

    // Cas spécial : payload racine avec "DynamicReport" ou "title"
    if (parsed.DynamicReport && parsed.DynamicReport.pages) {
      // Extraction du format custom
      const dr = parsed.DynamicReport;
      isDocument = true;
      docData = {
        title: dr.reportType || dr.title || "Document",
        type: dr.reportType || dr.type || "business_plan",
        content: dr.content || "",
        design: {
          pages: (dr.pages || []).map((p: any) => ({
            font: "Arial",
            style: { backgroundColor: "#fff", padding: 32 },
            sections: [
              {
                title: p.title || p.pageTitle || "",
                content: p.content || "",
                style: { color: "#222", fontSize: 14 }
              }
            ]
          })),
          colors: { background: "#fff" }
        }
      };
      reply = `Document "${docData.title}" prêt à être généré.`;
    }
    // Cas racine "title" + "pages"
    else if (parsed.title && parsed.pages) {
      isDocument = true;
      docData = {
        title: parsed.title,
        type: parsed.type || "business_plan",
        content: parsed.content || "",
        design: {
          pages: (parsed.pages || []).map((p: any) => ({
            font: "Arial",
            style: { backgroundColor: "#fff", padding: 32 },
            sections: [
              {
                title: p.title || "",
                content: p.content || "",
                style: { color: "#222", fontSize: 14 }
              }
            ]
          })),
          colors: { background: "#fff" }
        }
      };
      reply = `Document "${docData.title}" prêt à être généré.`;
    }
    // Si racine "report", tente d'extraire le vrai document
    else if (parsed.report && parsed.report.title && parsed.report.type && parsed.report.design) {
      isDocument = true;
      docData = parsed.report;
      reply = `Document "${parsed.report.title}" prêt à être généré.`;
    }
    else if (parsed.report && parsed.report.title && parsed.report.pages) {
      // Conversion flexible du format "report" en DynamicReport
      const r = parsed.report;
      isDocument = true;
      docData = {
        title: r.title,
        type: r.type || "business_plan",
        content: r.content || "", // Ajout de la propriété 'content'
        design: {
          pages: (r.pages || []).map((p: any) => ({
            font: p.font || "Arial",
            style: p.style || { backgroundColor: "#fff", padding: 32 },
            sections: [
              {
                title: p.title || p.section || "",
                content: p.content || "",
                style: p.sectionStyle || { color: "#222", fontSize: 14 }
              }
            ]
          })),
          colors: r.colors || { background: "#fff" }
        }
      };
      reply = `Document "${docData?.title ?? ""}" prêt à être généré.`;
    }
    else if (parsed.report && parsed.report.metadata && parsed.report.pages) {
      // Conversion du format "report" avec "metadata" et "pages" en DynamicReport
      const r = parsed.report;
      isDocument = true;
      docData = {
        title: r.metadata.title || "Document",
        type: r.metadata.format || "business_plan",
        content: r.metadata.content || "", // Ajout systématique de 'content'
        design: {
          pages: (r.pages || []).map((p: any) => ({
            font: p.layout?.font || "Arial",
            style: p.layout?.style || { backgroundColor: "#fff", padding: 32 },
            sections: [
              {
                title: p.section || p.title || "",
                content: typeof p.content === "object"
                  ? Object.entries(p.content)
                      .map(([k, v]) => Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`)
                      .join("\n")
                  : p.content || "",
                style: p.layout?.sectionStyle || { color: "#222", fontSize: 14 }
              }
            ]
          })),
          colors: r.metadata.colors || { background: "#fff" }
        }
      };
      reply = `Document "${docData.title}" prêt à être généré.`;
    }
    else if (parsed.report && parsed.report.format === "DynamicReport" && parsed.report.pages) {
      // Conversion du format "report" avec "format": "DynamicReport" en DynamicReport
      const r = parsed.report;
      isDocument = true;
      docData = {
        title: r.title || "Document",
        type: r.format || "business_plan",
        content: r.content || "",
        design: {
          pages: (r.pages || []).map((p: any) => ({
            font: p.font || "Arial",
            style: p.style || { backgroundColor: "#fff", padding: 32 },
            sections: [
              {
                title: p.section || p.title || "",
                content: p.content || "",
                style: p.sectionStyle || { color: "#222", fontSize: 14 }
              }
            ]
          })),
          colors: r.colors || { background: "#fff" }
        }
      };
      reply = `Document "${docData.title}" prêt à être généré.`;
    }
    else if (parsed.report) {
      // Extraction générique du payload même si le format n'est pas strictement reconnu
      const r = parsed.report;
      docData = {
        title: r.title || r.metadata?.title || "Document",
        type: r.type || r.format || r.metadata?.format || "business_plan",
        content: r.content || r.metadata?.content || "",
        design: r.design || {
          pages: (r.pages || []).map((p: any) => ({
            font: p.font || p.layout?.font || "Arial",
            style: p.style || p.layout?.style || { backgroundColor: "#fff", padding: 32 },
            sections: [
              {
                title: p.section || p.title || "",
                content: p.content || "",
                style: p.sectionStyle || p.layout?.sectionStyle || { color: "#222", fontSize: 14 }
              }
            ]
          })),
          colors: r.colors || r.metadata?.colors || { background: "#fff" }
        }
      };
      isDocument = true; // Force la génération
      reply = `Document "${docData.title}" prêt à être généré.`;
    }
  } catch (e) {
    // Not JSON, treat as regular text response
  }

  return { reply, isDocument, docData };
}

// Fetch business data (expanded for product management)
async function getComptaData(enseigne: string, stripeCustomerId: string) {
  const res = await fetch(
    `/api/vyfthealth_proc?enseigne=${encodeURIComponent(enseigne)}&stripeCustomerId=${encodeURIComponent(stripeCustomerId)}`,
    {
      headers: {
        "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
      },
    }
  );
  const data = await res.json();
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || "Erreur API");
  }
}

// Génération PDF universelle selon le design IA
async function generatePDF(docData: { title: string; content: string; props?: any; type?: string; design?: any }) {
  try {
    // Ajoute le type et toutes les props pour le design IA
    const userId = secureLocalStorage.getItem("auth0UserId");
    const payload = {
      ...docData.props,
      title: docData.title,
      content: docData.content,
      type: docData.type || "report",
      userId,
      design: docData.design || undefined, // si l'IA fournit un design spécifique
    };

    const res = await fetch("/api/reportgen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Échec de la génération du PDF: ${res.statusText}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docData.title.replace(/\s/g, "_")}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    throw error;
  }
}

export default function SquareAIFloat() {
  const [open, setOpen] = useState(false);
  const [docStudioOpen, setDocStudioOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text:
                "Bienvenue sur Vyft Nérethense, assistant IA professionnel alimenté par Nérethense Z.S soit l'équivalent de Z.Setneshi. Je suis conçu pour les entreprises multinationales et d'autres entreprises comme les PME et TPE, avec création automatisée de documents professionnels, gestion de produits de grand marché. Posez votre question ou utilisez /compta, /manage-product, ou /generate-report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [denomination, setDenomination] = useState<string | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [comptaData, setComptaData] = useState<any>(null);
  const [cgvu, setCgvu] = useState<string>("");
  const [docFormData, setDocFormData] = useState<DocumentFormData>({
    type: "report",
    title: "",
    params: {},
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user info from Auth0
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
        if (!userToken) return;

        const userInfoResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const userId = userInfoResponse.data.sub;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setDenomination(response.data?.user_metadata?.denomination?.trim() || null);
        setStripeCustomerId(response.data?.user_metadata?.subid?.trim() || null);
      } catch (error) {
        setDenomination(null);
        setStripeCustomerId(null);
      }
    };
    fetchUserInfo();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  // Fetch business data
  useEffect(() => {
    if (denomination && stripeCustomerId) {
      getComptaData(denomination, stripeCustomerId)
        .then(setComptaData)
        .catch(() => setComptaData(null));
    }
  }, [denomination, stripeCustomerId]);

  // Preload CGVU
  useEffect(() => {
    async function fetchCGVU() {
      try {
        const res = await fetch("/api/cgvu");
        const data = await res.json();
        setCgvu(data.cgvu || "");
      } catch (e) {
        console.error("Failed to load CGVU:", e);
      }
    }
    if (!cgvu) fetchCGVU();
  }, [cgvu]);

  function cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .map(cleanObject)
        .filter((v) => v !== undefined && v !== null && v !== "undefined");
    } else if (typeof obj === "object" && obj !== null) {
      const newObj: any = {};
      for (const k in obj) {
        // Supprime les clés d'image non supportées
        if (
          k === "image" ||
          k === "watermarkImg" ||
          (k === "logo" && typeof obj[k] === "string" && !obj[k].match(/\.(png|jpg|jpeg|svg)$/i)) ||
          (k === "qrCode" && typeof obj[k] === "string" && !obj[k].match(/\.(png|jpg|jpeg|svg)$/i))
        ) {
          continue;
        }
        const v = obj[k];
        if (v !== undefined && v !== null && v !== "undefined") {
          newObj[k] = cleanObject(v);
        }
      }
      return newObj;
    }
    if (typeof obj === "string") {
      return obj.replace(/undefined/gi, "").trim();
    }
    return obj;
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    setInput("");

    // Détection et envoi direct du payload DynamicReport saisi par l'utilisateur
    try {
      const parsed = JSON.parse(input);
      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.title &&
        parsed.type &&
        parsed.design &&
        Array.isArray(parsed.design.pages)
      ) {
        const cleaned = cleanObject(parsed);
        // ENVOI DIRECT À L'API /reportgen
        await generatePDF(cleaned);
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: `Document "${cleaned.title}" généré avec succès.` },
        ]);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Si ce n'est pas un JSON, on continue le flow normal
    }

    try {
      // Suggestion automatique du design, couleurs et style
      let context = `
Tu es Nérethense Z.Sethneshi, assistant IA professionnel pour entreprises. 
Dès qu'on te demande de générer un document (business plan, rapport, contrat, etc.), tu dois proposer un design complet : 
- couleurs adaptées au contexte (ex : business plan = bleu/gris, contrat = gris/noir, etc.)
- polices professionnelles (Lato, Roboto, Arial)
- structure DynamicReport : title, type, design (pages, sections, style, couleurs)
- inclure CGVU comme section si pertinent
- jamais de faute, jamais de clé "report" à la racine
- chaque page et section doit avoir une clé "style"
- le JSON doit être complet et prêt pour PDF, sans texte libre ni explication
`;

      if (comptaData) {
        context += `
Données disponibles :
- Pas aujourd'hui : ${comptaData.dailySteps}
- Distance aujourd'hui : ${comptaData.dailyDistance} km
- Profit aujourd'hui : ${comptaData.dailyRevenue} €
- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €
- Produits : ${comptaData.products ? `Produits gérés : ${comptaData.products.length}` : "Aucun produit"}
`;
      }
      if (cgvu) {
        context += `\nCGVU : ${cgvu}\n`;
      }

      // Envoi à l'IA avec contexte enrichi
      const { reply, isDocument, docData } = await callmodelAPI([
        { from: "user", text: context + input },
        ...messages,
      ]);

      let cleanReply = reply;
      if (cleanReply) {
        cleanReply = cleanReply.replace(/undefined/gi, " ");
        cleanReply = cleanReply.replace(/benvenue|iinvenue|binvenue|invenue|Benvenue/gi, "Bienvenue");
        cleanReply = cleanReply.replace(/Vyft Nérethhnse|Vyft Nérethense|Nérethhnse/gi, "Vyft Nérethense");
        cleanReply = cleanReply.replace(/pprfessionnel|prfessionnel|professionnel/gi, "professionnel");
        cleanReply = cleanReply.replace(/poor|poour|pour/gi, "pour");
        cleanReply = cleanReply.replace(/certifii|certifé|certiféé|certifiéé/gi, "certifié");
        cleanReply = cleanReply.replace(/activitt|activittt|activitée|activitée/gi, "activité");
        cleanReply = cleanReply.replace(/ssistanttIA|ssistant IA|assistanttIA|assistantt IA/gi, "assistant IA");
        cleanReply = cleanReply.replace(/vouu/gi, "vous");
        cleanReply = cleanReply.replace(/ee/gi, "et");
        cleanReply = cleanReply.replace(/([a-zA-Z])\1{1,}/g, "$1");
        cleanReply = cleanReply.replace(/[\s\n\r]{2,}/g, " ");
        cleanReply = cleanReply.replace(/\s+([.,;:!?])/g, "$1");
        cleanReply = cleanReply.trim();
      }

      if (cleanReply && cleanReply !== "") {
        setMessages((msgs) => [...msgs, { from: "ai", text: cleanReply }]);
      }

      // Si l'IA retourne un JSON DynamicReport valide, on génère le PDF automatiquement
      if (
        isDocument &&
        docData &&
        docData.title &&
        docData.type &&
        docData.design &&
        Array.isArray(docData.design.pages)
      ) {
        await generatePDF(docData);
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: `Document "${docData.title}" généré avec succès.` },
        ]);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: "ai", text: "Une erreur est survenue. Veuillez réessayer." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDocSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docFormData.title || !docFormData.type) return;

    setDocLoading(true);
    try {
      const { reply, isDocument, docData } = await callmodelAPI([
        { from: "user", text: context + prompt },
      ]);

      if (isDocument && docData) {
        await generatePDF(docData);
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: `Document "${docData.title}" généré avec succès.` },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: reply || "Erreur : Impossible de générer le document. Veuillez vérifier les paramètres." },
        ]);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: "ai", text: "Erreur lors de la génération du document. Veuillez réessayer." },
      ]);
    } finally {
      setDocLoading(false);
    }
  }

  const context = comptaData
    ? `Données disponibles :
- Pas aujourd'hui : ${comptaData.dailySteps}
- Distance aujourd'hui : ${comptaData.dailyDistance} km
- Profit aujourd'hui : ${comptaData.dailyRevenue} €
- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €
- Produits : ${comptaData.products ? `Produits gérés : ${comptaData.products.length}` : "Aucun produit"}`
    : "";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        background: "#23272e",
        borderRadius: 18,
        boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
        padding: 28,
        minWidth: 320,
        maxWidth: 400,
        border: "1px solid #353a40",
        display: "flex",
        flexDirection: "column",
        transition: "height 0.7s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s",
        height: open ? (docStudioOpen ? "700px" : "500px") : "90px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      className={styles.bodyonwhite}
      onClick={() => setOpen((v) => !v)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#1a7f6b",
            fontSize: 18,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            letterSpacing: 1,
          }}
        >
          <span style={{ fontSize: 18, color: "#1a7f6b" }}>NE</span>
        </div>
        <h3
          style={{
            color: "#1a7f6b",
            fontSize: 20,
            margin: 0,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          Vyft Nérethense (Beta) ✨
        </h3>
        <span
          style={{
            marginLeft: "auto",
            color: "#444",
            fontSize: 18,
            fontWeight: 500,
            transition: "transform 0.3s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▸
        </span>
      </div>
      <div
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity 0.5s",
          marginTop: open ? 18 : 0,
          height: open ? "auto" : 0,
          pointerEvents: open ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: 1,
            overflowY: "auto",
            scrollBehavior: "smooth",
            maxHeight: 340,
          }}
        >
          {messages.map((msg, idx) => (
            <Bubble key={idx} from={msg.from} text={msg.text}>
              {msg.from === "ai" && idx === messages.length - 1 && !loading ? (
                <TypingText text={msg.text} />
              ) : (
                msg.text
              )}
            </Bubble>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#1a7f6b",
                  fontSize: 15,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  letterSpacing: 1,
                }}
              >
                <span style={{ fontSize: 13, color: "#1a7f6b" }}>NE</span>
              </div>
              <TypingBubble />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre demande..."
            aria-label="Saisir votre demande pour Vyft Nérethense"
            style={{
              flex: 1,
              borderRadius: 12,
              border: "1px solid #e0dbdd",
              padding: "8px 12px",
              fontSize: 15,
              fontWeight: 500,
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              outline: "none",
              transition: "background 0.2s, color 0.2s",
            }}
            disabled={loading}
          />
          <button
            type="submit"
            aria-label="Envoyer la question"
            style={{
              borderRadius: 12,
              border: "none",
              background: "#1a7f6b",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              padding: "8px 18px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
            disabled={loading}
          >
            Envoyer
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes dotBounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}

const TypingText = React.memo(({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  const index = useRef(0);

  useEffect(() => {
    setDisplayed("");
    index.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[index.current]);
      index.current++;
      if (index.current >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
});

function Bubble({ from, text, children }: { from: "ai" | "user"; text: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        alignSelf: from === "user" ? "flex-end" : "flex-start",
        background: from === "ai" ? "#e0dbdd" : "rgba(255,255,255,0.10)",
        color: from === "ai" ? "#222" : "#f5f6fa",
        borderRadius: 12,
        padding: "10px 16px",
        maxWidth: "80%",
        fontSize: 15,
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        transition: "transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)",
        transform: "translateY(0)",
        border: from === "ai" ? "none" : "1px solid #353a40",
      }}
    >
      {children ? children : text}
    </div>
  );
}

function TypingBubble() {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.07)",
        borderRadius: 12,
        padding: "6px 14px",
        minWidth: 60,
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 15,
        color: "#444",
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        letterSpacing: 0.5,
      }}
    >
      <span style={{ marginRight: 6 }}>Écrit...</span>
      <TypingDots />
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-block", minWidth: 24 }}>
      <Dot delay={0} />
      <Dot delay={0.2} />
      <Dot delay={0.4} />
    </span>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#1a7f6b",
        margin: "0 2px",
        animation: `dotBounce 1s infinite`,
        animationDelay: `${delay}s`,
        verticalAlign: "middle",
      }}
    />
  );
}