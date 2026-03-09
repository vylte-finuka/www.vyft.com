"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "../../../app/[lang]/components/Navbar";
import styles from "@/app/page.module.css";
import Footer1 from '../../../app/[lang]/components/Footer1';
import { useRouter } from "next/router";
import { UniversalConnector } from '@reown/appkit-universal-connector';
import { getUniversalConnector, sluraCharene } from '@/app/[lang]/components/config/walletconnect';

export default function Vyftslide() {
  const [showBackground, setShowBackground] = useState(false);
  const [universalConnector, setUniversalConnector] = useState<UniversalConnector | null>(null);
  const [session, setSession] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAddingToken, setIsAddingToken] = useState(false);

  const router = useRouter();
  const lang = router.query.lang as string | undefined;
  const locale = lang === "fr-FR" ? "fr-FR" : "en-EN";

  const t = {
    "fr-FR": {
      title: "Vyft: La néobanque à la vertu de la finance. - Vyft slura",
      h1: "La première couche de niveau 1 (layer 1) au monde à s'ouvrir à de nouvelle infrastructure jamais faite jusqu'à là.",
      h2a: "Spécialisée pour le cloud computing à la téléphonie et RWA et partage des traits caractéristiques de Solana comme eBPF, parallélisme et s'apparente aux zkEVM pour le moteur d'exécution de contrat, il utilise le VEZ (Vyft Enhancing ZER(ZETA Erion)) comme jeton de frais et gouvernance en tant que stablecoin et tout ça en Europe.",
      h2b: "Le testnet de Slura: Charène est disponible en cliquant pour ajouter le réseau sur le widget !",
      connect: "Connecter le portefeuille",
      connecting: "Connexion en cours...",
      disconnect: "Déconnecter",
      addToken: "Ajouter le token VEZ",
      adding: "Ajout du token..."
    },
    "en-EN": {
      title: "Vyft: The neobank with the virtue of finance. - Vyft slura",
      h1: "First world layer 1 for open to the news infrastructures.",
      h2a: "Specialized in **cloud computing** for **telephony** and **RWA** (Real World Assets), this project leverages technologies similar to **Solana**—such as **eBPF**, high parallelism, and a design akin to **zkEVM** for its smart contract execution engine. It uses the **VEZ** (Vyft Enhancing ZER / ZETA Erion) as its utility token for transaction fees and governance, functioning as a **stablecoin**, and operates entirely in **Europe**.",
      h2b: "The Slura testnet, named Charène, is now live! Click to add the network via the widget.",
      connect: "Connect Wallet",
      connecting: "Connecting...",
      disconnect: "Disconnect",
      addToken: "Add VEZ Token",
      adding: "Adding token..."
    }
  }[locale];

  // ====================== UNIVERSAL CONNECTOR ======================
  useEffect(() => {
    getUniversalConnector().then(connector => {
      setUniversalConnector(connector);
      if (connector?.provider?.session) {
        setSession(connector.provider.session);
        const wcAccount = connector.provider.session.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || null;
        if (wcAccount) setAccount(wcAccount);
      }
    });
  }, []);

  // ====================== AUTO-CONNECT (CORRIGÉ) ======================
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (typeof window === "undefined" || !(window as any).ethereum) return;

      try {
        const eth = (window as any).ethereum;
        const accounts = await eth.request({ method: 'eth_accounts' });
        if (accounts?.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.log("Auto-connexion impossible", err);
      }
    };

    tryAutoConnect();
  }, []);

  // ====================== CONNECT / DISCONNECT ======================
  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts?.[0]) {
          setAccount(accounts[0]);
          setIsConnecting(false);
          return;
        }
      }

      if (universalConnector) {
        const { session: newSession } = await universalConnector.connect();
        setSession(newSession);
        const wcAccount = newSession?.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || null;
        setAccount(wcAccount);
      }
    } catch (err) {
      console.error("Échec connexion :", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (universalConnector && session) {
        await universalConnector.disconnect();
        setSession(null);
      }
      setAccount(null);
    } catch (err) {
      console.error("Erreur déconnexion :", err);
    }
  };

  // ====================== ADD VEZ TOKEN ======================
  const addVezToken = async () => {
    if (isAddingToken) return;
    setIsAddingToken(true);

    try {
      const watchParams = {
        type: 'ERC20',
        options: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          symbol: sluraCharene.nativeCurrency.symbol,
          decimals: sluraCharene.nativeCurrency.decimals,
          name: sluraCharene.nativeCurrency.name,
          image: 'https://raw.githubusercontent.com/vylte-finuka/Slura/refs/heads/master/crates/vuc-platform/src/asset/Slura.png'
        }
      };

      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await (window as any).ethereum.request({ method: 'wallet_watchAsset', params: watchParams });
        alert("Token VEZ ajouté avec succès !");
        return;
      }

      if (universalConnector) {
        const provider = universalConnector.provider;
        await provider.request({ method: 'wallet_watchAsset', params: watchParams });
        alert("Token VEZ ajouté avec succès !");
      }
    } catch (error: any) {
      console.error("Erreur ajout token VEZ :", error);
      alert(`Erreur : ${error.message || "Vérifiez la console"}`);
    } finally {
      setIsAddingToken(false);
    }
  };

  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className={styles.container3}>
        {showBackground && (
          <video
            className="bgvideo"
            src="/Sluracover.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: -80,
              left: -730,
              width: "180%",
              height: "180%",
              objectFit: "cover",
              zIndex: 0,
              pointerEvents: "none"
            }}
          />
        )}

        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Navbar />

          <main className={styles.main}>
            <h1 className={styles.headerX2}>{t.h1}</h1>
            <h2 className={styles.body}>{t.h2a}</h2>
            <h2 className={styles.body}>{t.h2b}</h2>

            <div style={{ margin: "32px 0", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              {account || session ? (
                <>
                  <div style={{ fontSize: "16px", color: "#ddd" }}>
                    Connecté : {account 
                      ? `${account.slice(0,6)}...${account.slice(-4)}` 
                      : "via WalletConnect"}
                  </div>

                  <button onClick={handleDisconnect} style={{ padding: "12px 32px", fontSize: "16px", background: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    {t.disconnect}
                  </button>

                  <button onClick={addVezToken} disabled={isAddingToken} style={{ padding: "12px 32px", fontSize: "16px", background: "#00cc66", color: "white", border: "none", borderRadius: "8px", cursor: isAddingToken ? "not-allowed" : "pointer" }}>
                    {isAddingToken ? t.adding : t.addToken}
                  </button>
                </>
              ) : (
                <button onClick={handleConnect} disabled={isConnecting} style={{ padding: "16px 48px", fontSize: "18px", background: "#000", color: "#fff", border: "none", borderRadius: "12px", cursor: isConnecting ? "not-allowed" : "pointer" }}>
                  {isConnecting ? t.connecting : t.connect}
                </button>
              )}
            </div>

            <div className={styles.bodyattract}></div>
          </main>

          <Footer1 />
        </div>
      </div>
    </div>
  );
}
