import React from "react";

export default function SubscribeModal({
  onClose,
  onSubscribe,
}: {
  onClose: () => void;
  onSubscribe: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 99999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(34, 39, 46, 0.98)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#23272e",
          borderRadius: 24,
          padding: 36,
          minWidth: 340,
          width: "90vw",
          maxWidth: 540,
          boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1.5px solid #353a40",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          style={{
            color: "#1a7f6b",
            fontWeight: 700,
            fontSize: 26,
            marginBottom: 14,
            letterSpacing: 0.5,
          }}
        >
          Abonnement requis
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "#e0dbdd",
            marginBottom: 28,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Pour accéder à toutes les fonctionnalités (dont les QR codes), vous devez souscrire à Vyft Program.
        </p>
        <div style={{ display: "flex", gap: 18, width: "100%", justifyContent: "center", marginBottom: 8 }}>
          <button
            style={{
              flex: 1,
              background: "#1a7f6b",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "BR Sonoma, sans-serif",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              transition: "background 0.2s",
              letterSpacing: 0.2,
            }}
            onClick={onSubscribe}
          >
            Se lancer
          </button>
          <button
            style={{
              flex: 1,
              background: "#fff",
              color: "#1a7f6b",
              border: "1.5px solid #1a7f6b",
              borderRadius: 16,
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "BR Sonoma, sans-serif",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              transition: "background 0.2s, color 0.2s",
              letterSpacing: 0.2,
            }}
            onClick={onClose}
          >
            Explorer d'abord
          </button>
        </div>
        <div style={{ marginTop: 10, color: "#bfc4c5", fontSize: 14, textAlign: "center" }}>
          <span>
            Vous pourrez gérer ou résilier votre abonnement à tout moment dans <b>Paramètres</b>.
          </span>
        </div>
      </div>
    </div>
  );
}