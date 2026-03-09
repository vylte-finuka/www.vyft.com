// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadataContent = {
  "fr-FR": {
    title: "Vyft: La néobanque à la vertu de la finance.",
    description: "La néobanque à la vertu de la finance.",
  },
  "en-EN": {
    title: "Vyft: The neobank with the virtue of finance.",
    description: "The neobank with the virtue of finance.",
  },
} as const;

// Metadata dynamique avec await params (syntaxe Next.js 16)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === "en-EN" ? "en-EN" : "fr-FR";
  return metadataContent[locale];
}

// Layout avec await params (syntaxe officielle Next.js 16)
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const { lang } = await params;
  const locale = lang === "en-EN" ? "en-EN" : "fr-FR";

  return (
    <html lang={locale}>
      <GoogleAnalytics gaId="G-TRM37NPSXN" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
