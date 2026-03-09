// app/[lang]/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
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

export async function generateMetadata({
  params,
}: {
  params: { lang?: string };
}): Promise<Metadata> {
  const locale = params.lang === "en-EN" ? "en-EN" : "fr-FR";
  return metadataContent[locale];
}

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang?: string };
}) {
  const locale = params.lang ?? "fr-FR"; // valeur par défaut si lang absent

  return (
    <html lang={locale}>
      <GoogleAnalytics gaId="G-TRM37NPSXN" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
