
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import AuthGuard from "./components/AuthGuard"; // Importer AuthGuard

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vyft program - Manage your own market.",
  description: "Vyft program - Manage your own market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <GoogleAnalytics gaId="G-TRM37NPSXN" />
      <body className={inter.className}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}