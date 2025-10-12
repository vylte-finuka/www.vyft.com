"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0] || "fr";
    if (browserLang.startsWith("fr")) {
      router.replace("/fr-FR");
    } else {
      router.replace("/en-EN");
    }
  }, [router]);

  return null;
}