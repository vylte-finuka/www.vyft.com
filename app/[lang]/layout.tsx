// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Métadonnées dynamiques selon langue du navigateur
export async function generateMetadata(): Promise<Metadata> {
  const lang = headers().get("accept-language") || "fr-FR";
  const isEN = lang.startsWith("en");

  return {
    title: isEN 
      ? "Vyft: The neobank with the virtue of finance."
      : "Vyft: La néobanque à la vertu de la finance.",
    description: isEN 
      ? "The neobank with the virtue of finance."
      : "La néobanque à la vertu de la finance.",
  };
}

// Layout minimal – AUCUN params
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = headers().get("accept-language")?.startsWith("en") ? "en-EN" : "fr-FR";

  return (
    <html lang={lang}>
      <GoogleAnalytics gaId="G-TRM37NPSXN" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
