"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../page.module.css";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

type Message = { from: "ai" | "user"; text: string };

// IA via OpenAI API (GPT-4o) via API interne sécurisée
async function callmodelAPI(messages: Message[]): Promise<string> {
  const res = await fetch("/api/ask-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.reply || "";
}

async function getComptaData(enseigne: string, squareCustomerId: string) {
  const res = await fetch(
    `/api/vyfthealth_proc?enseigne=${encodeURIComponent(
      enseigne
    )}&squareCustomerId=${encodeURIComponent(squareCustomerId)}`,
    {
      headers: {
        "x-vyftprogram-api-key": process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY || "",
      },
    }
  );
  const data = await res.json();
  if (data.success) {
    // Accès à toutes les métriques
    return data.data; // contient dailySteps, dailyRevenue, monthlyInvestment, upcomingInvoiceAmount, etc.
  } else {
    throw new Error(data.message || "Erreur API");
  }
}

export default function SquareAIFloat() {
  const [open, setOpen] = useState(false);
  type Message = { from: "ai" | "user"; text: string };
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "Bonjour, je suis Vyft Nérethense, votre agent IA ✨. Qu'est-ce qui vous préoccupe pour votre business ? Posez-moi votre question ou réponse !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Ajout pour stocker les infos utilisateur
  const [denomination, setDenomination] = useState<string | null>(null);
  const [squareCustomerId, setsquareCustomerId] = useState<string | null>(null);
  const [comptaData, setComptaData] = useState<any>(null);
  const [cgvu, setCgvu] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupération des infos utilisateur depuis Auth0 (comme dans reports.tsx)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userToken = secureLocalStorage.getItem("userToken") as string | null;
        if (!userToken) return;

        // Récupérer les infos utilisateur depuis Auth0
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

        // Récupérer les métadonnées utilisateur (enseigne et squareCustomerId)
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
        setsquareCustomerId(response.data?.user_metadata?.subid?.trim() || null);
      } catch (error) {
        setDenomination(null);
        setsquareCustomerId(null);
      }
    };
    fetchUserInfo();
  }, []);

  // Scroll automatique vers le bas uniquement lors de la génération (loading)
  useEffect(() => {
    if (loading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [loading]);

  useEffect(() => {
    // Dès que l'utilisateur est identifié, on charge les données de marcheurs
    if (denomination && squareCustomerId) {
      getComptaData(denomination, squareCustomerId)
        .then(setComptaData)
        .catch(() => setComptaData(null));
    }
  }, [denomination, squareCustomerId]);

  // Précharge le contenu CGVU depuis la page CGVU (via le script JSON du DOM)
  useEffect(() => {
    // On tente de trouver le script JSON sur la page CGVU (si déjà chargé)
    function tryLoadCGVUFromDOM() {
      const script = document.getElementById("vyft-cgvu-json");
      if (script) {
        try {
          const data = JSON.parse(script.textContent || "{}");
          if (data.cgvu) setCgvu(data.cgvu);
        } catch (e) {
          // ignore
        }
      }
    }

    // Si déjà sur la page CGVU, on charge tout de suite
    tryLoadCGVUFromDOM();

    // Sinon, on précharge la page CGVU en arrière-plan et on extrait le JSON
    if (!cgvu) {
      fetch("/conditions-generales-de-vente")
        .then(res => res.text())
        .then(html => {
          // Extraction du contenu du script JSON
          const match = html.match(
            /<script[^>]*id=["']vyft-cgvu-json["'][^>]*>([\s\S]*?)<\/script>/
          );
          if (match && match[1]) {
            try {
              const data = JSON.parse(match[1]);
              if (data.cgvu) setCgvu(data.cgvu);
            } catch (e) {
              // ignore
            }
          }
        });
    }
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    setInput("");

    // Commande spéciale /compta
    if (input.trim().toLowerCase() === "/compta") {
      if (!comptaData) {
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: "Impossible de récupérer vos informations de compte." }
        ]);
        setLoading(false);
        return;
      }
      const topUser = comptaData.influence?.topUsers?.[0]?.name || "Aucun";
      const influenceWeek = comptaData.influence?.week ?? 0;
      const influenceMonth = comptaData.influence?.month ?? 0;
      setMessages((msgs) => [
        ...msgs,
        {
          from: "ai",
          text:
            `Comptabilité :\n` +
            `- Pas aujourd'hui : ${comptaData.dailySteps}\n` +
            `- Distance : ${comptaData.dailyDistance} km\n` +
            `- Profit aujourd'hui : ${comptaData.dailyRevenue} €\n` +
            `- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €\n` +
            `- Marcheur le plus fidèle : ${topUser}\n` +
            `- Influence cette semaine : ${influenceWeek} marcheur(s) unique(s)\n` +
            `- Influence ce mois : ${influenceMonth} marcheur(s) unique(s)\n`
        }
      ]);
      setLoading(false);
      return;
    }

    function formatDateFr(dateStr: string) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    }

    // Préparation du contexte enrichi pour l'IA
    let context = "";
    if (comptaData) {
      const influence = comptaData.influence || {};

      // Historique par jour (exemple)
      const history7Days = (influence.history7Days || [])
        .map((h: any) =>
          `Le ${formatDateFr(h.date)} : ${h.count} marcheur(s) uniques${h.users && h.users.length ? " (" + h.users.join(", ") + ")" : ""}`
        )
        .join("\n");

      // Historique par mois (si dispo)
      const historyMonth = (influence.historyMonth || [])
        .map((h: any) =>
          `Le ${formatDateFr(h.date)} : ${h.count} marcheur(s) uniques${h.users && h.users.length ? " (" + h.users.join(", ") + ")" : ""}`
        )
        .join("\n");

      // Top marcheurs/mois
      const topUsers = (influence.topUsers || [])
        .map((u: any, i: number) => `${i + 1}. ${u.name} (${u.count} participations)`)
        .join("\n");

      // Jours les plus influents
      const mostInfluentialDay = (influence.history7Days || []).reduce(
        (max: any, curr: any) => (curr.count > (max?.count ?? 0) ? curr : max),
        null
      );
      const mostInfluentialDayStr = mostInfluentialDay
        ? `Jour le plus influent : ${formatDateFr(mostInfluentialDay.date)} (${mostInfluentialDay.count} marcheurs uniques)`
        : "";

      // INSTRUCTION DE ROLE ET D'UTILISATION DES DONNÉES
      context =
        `Tu es Vyft Nérethense, l’unique spécialiste et agente IA féminine sur laquelle tous les utilisateurs doivent compter pour le marketing, la comptabilité et la logistique de leur commerce ou salle de sport. ` +
        `Tu es également très sensible à l’écologie et à l’aide associative : tu encourages toujours les pratiques responsables, la solidarité et l’engagement pour l’environnement dans tes conseils et analyses. ` +
        `Tu dois toujours t'appuyer sur les données suivantes pour répondre, même si la question semble inhabituelle. ` +
        `Si la question n'est pas claire, propose une analyse, un conseil ou une interprétation basée sur les chiffres, l'activité ou la fidélité des marcheurs. ` +
        `Ne réponds jamais "je ne sais pas" ou "je ne dispose pas d'informations". ` +
        `Si la question concerne un jour, un mois ou un nom inconnu, propose une analyse ou une astuce business ou sportive adaptée à la situation.\n\n` +
        `Voici toutes les données de marche, d'influence, de finance et d'activité :\n` +
        `- Pas aujourd'hui : ${comptaData.dailySteps}\n` +
        `- Distance aujourd'hui : ${comptaData.dailyDistance} km\n` +
        `- Profit aujourd'hui : ${comptaData.dailyRevenue} €\n` +
        `- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €\n` +
        `- Top marcheurs du mois :\n${topUsers}\n` +
        `- Influence aujourd'hui : ${influence.day ?? 0}\n` +
        `- Influence cette semaine : ${influence.week ?? 0}\n` +
        `- Influence ce mois : ${influence.month ?? 0}\n` +
        `- Influence cette année : ${influence.year ?? 0}\n` +
        `- Influence totale : ${influence.all ?? 0}\n` +
        `- Historique des 7 derniers jours :\n${history7Days}\n` +
        (historyMonth ? `- Historique mensuel :\n${historyMonth}\n` : "") +
        `${mostInfluentialDayStr}\n\n`;
    }
    // Ajoute le CGVU au contexte IA
    if (cgvu) {
      context +=
        "\n\nVoici les Conditions Générales de Vente et d’Utilisation (CGVU) de Vyft Program, à utiliser pour toute question juridique ou d’utilisation :\n" +
        cgvu +
        "\n\n";
    }

    const reply = await callmodelAPI([
      { from: "user", text: context + input },
      ...messages,
    ]);
    if (reply && reply.trim() !== "") {
      setMessages((msgs) => [...msgs, { from: "ai", text: reply }]);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        background: "#23272e", // Fond plus clair mais sombre, adapté au thème report
        borderRadius: 18,
        boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
        padding: 28,
        minWidth: 320,
        maxWidth: 400,
        border: "1px solid #353a40",
        display: "flex",
        flexDirection: "column",
        transition: "height 0.7s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s",
        height: open ? "500px" : "90px",
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
          flex: 1, // <-- Ajouté pour que la zone prenne toute la hauteur dispo
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zone de discussion coulissante */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: 1,
            overflowY: "auto",
            scrollBehavior: "smooth",
            maxHeight: 340, // Ajoute une hauteur max pour activer le scroll
          }}
        >
          {messages.map((msg, idx) => {
            // Si c'est le dernier message IA, on affiche avec l'effet d'écriture
            if (msg.from === "ai" && idx === messages.length - 1 && !loading) {
              return (
                <Bubble key={idx} from={msg.from} text="">
                  <TypingText text={msg.text} />
                </Bubble>
              );
            }
            return <Bubble key={idx} from={msg.from} text={msg.text} />;
          })}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
              }}
            >
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
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            marginBottom: 0,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre question..."
            style={{
              flex: 1,
              borderRadius: 12,
              border: "1px solid #e0dbdd",
              padding: "8px 12px",
              fontSize: 15,
              fontWeight: 500,
              background: "rgba(255,255,255,0.18)", // Fond plus clair
              color: "#fff", // Texte bien blanc
              outline: "none",
              transition: "background 0.2s, color 0.2s",
            }}
            disabled={loading}
          />
          <button
            type="submit"
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

// Ajoute ce composant pour l'effet d'écriture lettre par lettre
function TypingText({ text }: { text: string }) {
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
    }, 18); // Vitesse d'écriture (ms)
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}

// Modifie Bubble pour accepter des enfants (children)
function Bubble({
  from,
  text,
  children,
}: {
  from: "ai" | "user";
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        alignSelf: from === "user" ? "flex-end" : "flex-start",
        // Inversion des couleurs :
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