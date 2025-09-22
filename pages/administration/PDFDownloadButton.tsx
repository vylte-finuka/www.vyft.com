"use client";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function PDFDownloadButton({ document, fileName, style }: any) {
  return (
    <PDFDownloadLink document={document} fileName={fileName} style={style}>
      {({ loading }: { loading: boolean }) => (loading ? "Génération..." : "Télécharger PDF")}
    </PDFDownloadLink>
  );
}