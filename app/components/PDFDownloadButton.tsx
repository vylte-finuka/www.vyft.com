// filepath: d:\Downloads\Vyft_product\Vyft program\app\components\PDFDownloadButton.tsx
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";

export default function PDFDownloadButton({ document, fileName, style, children }: any) {
  return (
    <PDFDownloadLink document={document} fileName={fileName} style={style}>
      {children}
    </PDFDownloadLink>
  );
}