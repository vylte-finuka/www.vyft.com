// app/layout.tsx
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
  }
};

// Fonction SEO dynamique reconnue par Next.js
export async function generateMetadata({ params }: { params: { lang?: string } }): Promise<Metadata> {
  const locale = params.lang === "en-EN" ? "en-EN" : "fr-FR";
  return metadataContent[locale];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang?: string };
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams?.lang === "fr-FR" ? "fr-FR" : "en-EN";

  return (
    <html lang={locale}>
      <GoogleAnalytics gaId="G-TRM37NPSXN" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
