import React from "react";
import dynamic from "next/dynamic";
import styles from "../../app/page.module.css";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer"; // <-- Utilise import ESM

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#DBDFE0",
    padding: 32,
    fontFamily: "Helvetica",
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 24,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    color: "#1a7f6b",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  section: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
  },
  subtitle: {
    fontSize: 18,
    color: "#444444",
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#222",
    marginBottom: 6,
  },
});

const CustomReportPDF = ({
  reportType,
  period,
  data,
}: {
  reportType: string;
  period: string;
  data: {
    totalSteps: number;
    totalDistance: number;
    totalRevenue: number;
    growth: string;
    daily: { date: string; steps: number; distance: number; revenue: number }[];
  };
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Image src="/Vyft_program.png" style={pdfStyles.logo} />
      <Text style={pdfStyles.title}>
        Rapport {reportType === "weekly" ? "hebdomadaire" : reportType === "monthly" ? "mensuel" : "fiscal"}
      </Text>
      <Text style={{ ...pdfStyles.text, textAlign: "center", marginBottom: 12 }}>
        Période : {period}
      </Text>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Synthèse</Text>
        <Text style={pdfStyles.text}>• Total des pas : {data.totalSteps.toLocaleString()}</Text>
        <Text style={pdfStyles.text}>• Distance totale : {data.totalDistance.toLocaleString()} m</Text>
        <Text style={pdfStyles.text}>• Recette totale : {data.totalRevenue.toLocaleString()} €</Text>
        <Text style={pdfStyles.text}>• Croissance : {data.growth}</Text>
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Détail journalier</Text>
        {data.daily.map((d) => (
          <Text key={d.date} style={pdfStyles.text}>
            {d.date} : {d.steps} pas, {d.distance} m, {d.revenue} €
          </Text>
        ))}
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Commentaires</Text>
        <Text style={pdfStyles.text}>Rapport généré automatiquement par Vyft Program.</Text>
      </View>
    </Page>
  </Document>
);

export default function ReportsList({
  reportType = "weekly",
  period = "",
  data = {
    totalSteps: 0,
    totalDistance: 0,
    totalRevenue: 0,
    growth: "0 %",
    daily: [],
  },
}: {
  reportType?: string;
  period?: string;
  data?: {
    totalSteps: number;
    totalDistance: number;
    totalRevenue: number;
    growth: string;
    daily: { date: string; steps: number; distance: number; revenue: number }[];
  };
}) {
  return (
    <section
      className={styles.bodyonwhite}
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 32,
        marginBottom: 32,
        width: "100%",
        maxWidth: 700,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
    >
      <h2 className={styles.headeronwhite} style={{ fontSize: 22, marginBottom: 18 }}>
        Liste des rapports générés
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li
          style={{
            marginBottom: 18,
            background: "#DBDFE0",
            borderRadius: 18,
            padding: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 className={styles.headeronwhite} style={{ fontSize: 18, margin: 0 }}>
              Rapport {reportType === "weekly" ? "hebdomadaire" : reportType === "monthly" ? "mensuel" : "fiscal"}
            </h3>
            <p className={styles.bodyonwhite} style={{ margin: 0 }}>
              Période : {period}
            </p>
          </div>
          <PDFDownloadLink
            document={<CustomReportPDF reportType={reportType} period={period} data={data} />}
            fileName={`vyft-rapport-${reportType}.pdf`}
            style={{
              background: "#1a7f6b",
              color: "#fff",
              borderRadius: 18,
              padding: "12px 28px",
              fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
              fontSize: 16,
              textDecoration: "none",
              marginLeft: 24,
            }}
          >
            {({ loading }) => (loading ? "Génération..." : "Télécharger PDF")}
          </PDFDownloadLink>
        </li>
      </ul>
    </section>
  );
}