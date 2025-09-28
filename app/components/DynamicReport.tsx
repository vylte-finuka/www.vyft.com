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

// Polices Google officielles : liens directs vers les sources TTF
Font.register({
  family: "Lato",
  src: "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf",
});
Font.register({
  family: "Roboto",
  src: "https://github.com/googlefonts/roboto-2/raw/refs/heads/main/src/hinted/Roboto-Regular.ttf",
});
Font.register({
  family: "Arial",
  src: "https://github.com/adrienverge/copr-some-nice-fonts/raw/refs/heads/master/Arial.ttf",
});

export type DynamicSection = {
  title?: string;
  content?: string;
  table?: { headers: string[]; rows: string[][] };
  image?: string;
  signature?: string;
  custom?: React.ReactNode;
  style?: any;
  watermarkImg?: string; // image filigrane possible
};

export type DynamicPage = {
  watermark?: string;
  watermarkImg?: string;
  logo?: string;
  font?: string;
  sections?: DynamicSection[];
  style?: any;
};

export default function DynamicReport(props: {
  pages?: DynamicPage[];
  title?: string;
  type?: string;
  content?: string;
  props?: any;
  design?: any; // instructions IA ou template complet
  watermark?: string;
  watermarkImg?: string;
  logo?: string;
  font?: string;
  sections?: DynamicSection[];
  table?: { headers: string[]; rows: string[][] };
  signature?: string;
  colors?: { [key: string]: string }; // couleurs personnalisées
}) {
  // Fusionne design IA et props classiques
  const design = props.design || {};
  const pages: DynamicPage[] =
    (design.pages && Array.isArray(design.pages))
      ? design.pages
      : props.pages && props.pages.length
        ? props.pages
        : [{
            watermark: props.watermark || design.watermark,
            watermarkImg: props.watermarkImg || design.watermarkImg,
            logo: props.logo || design.logo,
            font: props.font || design.font,
            style: design.pageStyle,
            sections: props.sections || design.sections || [
              {
                title: props.title || design.title,
                content: props.content || design.content,
                table: props.table || design.table,
                signature: props.signature || design.signature,
                image: design.image,
                style: design.sectionStyle,
                watermarkImg: props.watermarkImg || design.watermarkImg,
                custom: design.custom,
              }
            ]
          }];

  return (
    <Document>
      {pages.map((page, idx) => (
        <Page
          key={idx}
          style={{
            ...styles.body,
            ...(page.style || {}),
            fontFamily: page.font || "Arial", // <-- force Arial standard
            backgroundColor: props.colors?.background || "#fff",
          }}
        >
          {/* Filigrane texte */}
          {page.watermark && (
            <Text
              style={{
                position: "absolute",
                top: "45%",
                left: "10%",
                opacity: 0.12,
                fontSize: 80,
                color: props.colors?.watermark || "#1a7f6b",
                transform: "rotate(-30deg)",
                zIndex: 0,
              }}
              render={() => page.watermark}
              fixed
            />
          )}
          {/* Filigrane image */}
          {page.watermarkImg && (
            <Image
              src={page.watermarkImg}
              style={{
                position: "absolute",
                top: "30%",
                left: "25%",
                width: 300,
                height: 300,
                opacity: 0.09,
                zIndex: 0,
              }}
              fixed
            />
          )}
          {/* Logo entreprise */}
          {page.logo && (
            <Image
              src={page.logo}
              style={{
                width: 120,
                height: 48,
                marginBottom: 18,
                alignSelf: "center",
              }}
            />
          )}
          {/* Sections dynamiques */}
          {page.sections && page.sections.map((sec, i) => (
            <View key={i} style={{ ...styles.section, ...(sec.style || {}) }}>
              {sec.watermarkImg && (
                <Image
                  src={sec.watermarkImg}
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "30%",
                    width: 200,
                    height: 200,
                    opacity: 0.08,
                    zIndex: 0,
                  }}
                  fixed
                />
              )}
              {sec.title && <Text style={{ ...styles.sectionTitle, color: props.colors?.sectionTitle || "#444" }}>{sec.title}</Text>}
              {Array.isArray(sec.content)
                ? sec.content.map((item, idx) => {
                    if (item.type === "text") {
                      return (
                        <Text key={idx} style={{ color: sec.style?.color || "#222", fontSize: sec.style?.fontSize }}>
                          {item.value}
                        </Text>
                      );
                    }
                    if (item.type === "list" && Array.isArray(item.items)) {
                      return (
                        <View key={idx} style={{ marginLeft: 12, marginBottom: 6 }}>
                          {item.items.map((li: string, liIdx: number) => (
                            <Text key={liIdx} style={{ color: sec.style?.color || "#222", fontSize: sec.style?.fontSize }}>
                              • {li}
                            </Text>
                          ))}
                        </View>
                      );
                    }
                    if (item.type === "signature") {
                      return (
                        <Text key={idx} style={{ ...styles.signature, color: sec.style?.color || "#222" }}>
                          {item.placeholder || "Signature"}
                        </Text>
                      );
                    }
                    // Ajoute d'autres types si besoin
                    return null;
                  })
                : sec.content && (
                    <Text style={{ color: sec.style?.color || "#222", fontSize: sec.style?.fontSize }}>
                      {sec.content}
                    </Text>
                  )
              }
              {sec.table && (
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    {sec.table.headers.map((h, j) => (
                      <Text key={j} style={{ ...styles.tableHeader, color: props.colors?.tableHeader || "#1a7f6b" }}>{h}</Text>
                    ))}
                  </View>
                  {sec.table.rows.map((row, k) => (
                    <View key={k} style={styles.tableRow}>
                      {row.map((cell, l) => (
                        <Text key={l} style={{ ...styles.tableCell, color: props.colors?.tableCell || "#222" }}>{cell}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
              {sec.image && (
                <Image src={sec.image} style={{ width: 180, height: 80, margin: 12 }} />
              )}
              {sec.signature && (
                <Text style={{ ...styles.signature, color: props.colors?.signature || "#222" }}>Signature : {sec.signature}</Text>
              )}
              {sec.custom}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 32,
    fontSize: 13,
    fontFamily: "Arial",
    position: "relative",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#1a7f6b",
    padding: 4,
    borderBottom: "1px solid #e0dbdd",
    minWidth: 60,
  },
  tableCell: {
    fontSize: 13,
    padding: 4,
    minWidth: 60,
  },
  signature: {
    fontSize: 14,
    color: "#222",
    marginTop: 18,
    fontStyle: "italic",
    textAlign: "right",
  },
});