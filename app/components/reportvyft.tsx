import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Enregistrement de la police personnalisée (local)
Font.register({
  family: "BR Sonoma",
  src: "public/font/BRSonomaSemibold.ttf",
  fontStyle: "normal",
  fontWeight: "normal",
});

const themeColors = [
  "#e0e0e0", "#bfc4c5", "#444444", "#1a7f6b", "#000000"
];

function getInfluenceColor(val: number, max: number) {
  if (max === 0) return themeColors[0];
  const ratio = val / max;
  if (ratio > 0.8) return themeColors[4];
  if (ratio > 0.6) return themeColors[3];
  if (ratio > 0.3) return themeColors[2];
  if (ratio > 0) return themeColors[1];
  return themeColors[0];
}

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#DBDFE0",
    padding: 32,
    fontFamily: "BR Sonoma",
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
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "BR Sonoma",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    fontFamily: "BR Sonoma",
    breakInside: "avoid",
    pageBreakInside: "avoid",
  },
  subtitle: {
    fontSize: 18,
    color: "#444444",
    marginBottom: 8,
    fontFamily: "BR Sonoma",
  },
  text: {
    fontSize: 14,
    color: "#222",
    marginBottom: 6,
    fontFamily: "BR Sonoma",
  },
  chartImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
});

function InfluenceLegend() {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      marginTop: 8,
    }}>
      <Text style={{ fontSize: 10, marginRight: 8 }}>Faible</Text>
      {themeColors.map((color, idx) => (
        <View
          key={color}
          style={{
            width: 18,
            height: 10,
            backgroundColor: color,
            borderRadius: 2,
            marginHorizontal: 2,
            border: "1px solid #fff",
            marginRight: idx === themeColors.length - 1 ? 8 : 2,
          }}
        />
      ))}
      <Text style={{ fontSize: 10, marginLeft: 8 }}>Forte influence</Text>
    </View>
  );
}

function InfluenceGrid({
  influenceData,
  dailyData,
}: {
  influenceData: { date: string; count: number }[];
  dailyData: { date: string; revenue: number }[];
}) {
  const gridData = Array(800)
    .fill(0)
    .map((_, i) => {
      const date = influenceData[i]?.date || "";
      const count = influenceData[i]?.count || 0;
      return { count, date };
    });
  const max = Math.max(...gridData.map((g) => g.count), 1);
  const nbCols = 32;
  const nbRows = 25;
  const gridWidth = 520;
  const cellSize = gridWidth / nbCols;

  return (
    <View style={{
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 8,
    }}>
      <View style={{
        width: gridWidth,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <View style={{ flexDirection: "row" }}>
          {Array.from({ length: nbCols }).map((_, col) => (
            <View
              key={col}
              style={{
                width: cellSize,
                height: 18,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Text style={{
                fontSize: 8,
                color: "#444",
                fontFamily: "BR Sonoma",
              }}>
                {col + 1}
              </Text>
            </View>
          ))}
        </View>
        {Array.from({ length: nbRows }).map((_, row) => (
          <View key={row} style={{ flexDirection: "row" }}>
            {Array.from({ length: nbCols }).map((_, col) => {
              const idx = row * nbCols + col;
              const cell = gridData[idx];
              return (
                <View
                  key={col}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 4,
                    backgroundColor: getInfluenceColor(cell.count, max),
                    border: "1px solid #fff",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", marginTop: 6 }}>
        {Array.from({ length: nbCols }).map((_, col) => (
          <View
            key={col}
            style={{
              width: cellSize,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Text style={{ fontSize: 7, color: "#888" }}>
              {col % 4 === 0 ? "M" + ((col / 4) + 1) : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const PDFPageFooter = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
  <View
    fixed
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 18,
      textAlign: "center",
      width: "100%",
    }}
  >
    <Text style={{ fontSize: 12, color: "#888", fontFamily: "BR Sonoma" }}>
      Page {pageNumber} / {totalPages}
    </Text>
  </View>
);

const ReportVyft = ({
  reportType,
  period,
  data,
  influenceHistory = [],
  chartImage = "",
  influenceChartImage = "",
  topUsersChartImage = "",
  companyName = "Vyft",
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
  influenceHistory?: { date: string; count: number }[];
  chartImage?: string;
  influenceChartImage?: string;
  topUsersChartImage?: string;
  companyName?: string;
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Image src="public/Vyft_program.png" style={pdfStyles.logo} />
      <Text style={pdfStyles.title}>
        Rapport{" "}
        {reportType === "weekly"
          ? "hebdomadaire"
          : reportType === "monthly"
          ? "mensuel"
          : "fiscal"}
      </Text>
      <Text style={{
        fontSize: 18,
        color: "#1a7f6b",
        textAlign: "center",
        marginBottom: 8,
        fontFamily: "BR Sonoma",
        fontWeight: "bold",
      }}>
        {companyName}
      </Text>
      <Text style={{
        ...pdfStyles.text,
        textAlign: "center",
        marginBottom: 12,
      }}>
        Période : {period}
      </Text>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>
          Influence & bénéfice estimé (800 derniers jours)
        </Text>
        <InfluenceLegend />
        <InfluenceGrid
          influenceData={influenceHistory}
          dailyData={data.daily}
        />
      </View>
      <PDFPageFooter pageNumber={1} totalPages={topUsersChartImage ? 3 : 2} />
    </Page>
    <Page size="A4" style={pdfStyles.page}>
      {chartImage && (
        <View style={{ ...pdfStyles.section, alignItems: "center", justifyContent: "center", marginBottom: 24, height: 320 }}>
          <Text style={pdfStyles.subtitle}>Profit de marché</Text>
          <Image
            src={chartImage}
            style={{
              width: "95%",
              height: 260,
              objectFit: "contain",
              alignSelf: "center",
              borderRadius: 12,
            }}
          />
        </View>
      )}
      {influenceChartImage && (
        <View style={{ ...pdfStyles.section, alignItems: "center", justifyContent: "center", height: 320 }}>
          <Text style={pdfStyles.subtitle}>Influence</Text>
          <Image
            src={influenceChartImage}
            style={{
              width: "95%",
              height: 260,
              objectFit: "contain",
              alignSelf: "center",
              borderRadius: 12,
            }}
          />
        </View>
      )}
      <PDFPageFooter pageNumber={2} totalPages={topUsersChartImage ? 3 : 2} />
    </Page>
    {topUsersChartImage && (
      <Page size="A4" style={pdfStyles.page}>
        <View style={{ ...pdfStyles.section, alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Text style={pdfStyles.subtitle}>Clients fréquents</Text>
          <Image
            src={topUsersChartImage}
            style={{
              width: "95%",
              height: 340,
              objectFit: "contain",
              alignSelf: "center",
              borderRadius: 12,
            }}
          />
        </View>
        <PDFPageFooter pageNumber={3} totalPages={3} />
      </Page>
    )}
  </Document>
);

export default ReportVyft;