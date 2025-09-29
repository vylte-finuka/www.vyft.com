import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";

// Register fallback font
Font.register({
  family: "Arial",
  src: "https://github.com/adrienverge/copr-some-nice-fonts/raw/refs/heads/master/Arial.ttf",
});

// Register additional fonts
Font.register({
  family: "Lato",
  src: "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf",
});
Font.register({
  family: "Roboto",
  src: "https://github.com/googlefonts/roboto-2/raw/refs/heads/main/src/hinted/Roboto-Regular.ttf",
});

export type DynamicSection = {
  title?: string;
  content?: string | any[];
  table?: { headers: string[]; rows: string[][] };
  image?: string;
  signature?: string;
  custom?: React.ReactNode;
  style?: any;
  watermarkImg?: string;
  subContent?: any[];
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
  design?: any;
  watermark?: string;
  watermarkImg?: string;
  logo?: string;
  font?: string;
  sections?: DynamicSection[];
  table?: { headers: string[]; rows: string[][] };
  signature?: string;
  colors?: { [key: string]: string };
}) {
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

  function resolveStyle(style: any) {
    return style ? { ...style, fontFamily: style.fontFamily || "Arial" } : { fontFamily: "Arial" };
  }

  function resolveImage(src?: string) {
    if (!src) return "";
    if (src.startsWith("data:image")) return src;
    return src;
  }

  function renderSvg(item: any) {
    return (
      <Svg viewBox={item.viewBox || "0 0 210 96"} style={resolveStyle(item.style || {})}>
        {item.children && item.children.map((child: any, idx: number) => (
          <Path key={idx} d={child.d} fill={child.fill} stroke={child.stroke} strokeWidth={child.strokeWidth || 1} />
        ))}
      </Svg>
    );
  }

  function renderListItem(li: string, bulletStyle: any, style: any) {
    const [mainText, progress] = li.trim().split(/\s+(●|○)+$/);
    return (
      <View style={resolveStyle(style)}>
        {bulletStyle && bulletStyle.type === "circle" && (
          <View style={resolveStyle(bulletStyle.style)} />
        )}
        <Text style={resolveStyle(style)}>{mainText.trim()}</Text>
        {progress && <Text style={resolveStyle(style)}>{progress}</Text>}
      </View>
    );
  }

  function renderContent(item: any) {
    if (item.type === "image" && item.url) {
      return <Image key={item.url} src={resolveImage(item.url)} style={resolveStyle(item.style || {})} />;
    }
    if (item.type === "text") {
      return (
        <Text key={item.value} style={resolveStyle(item.style || {})}>
          {item.value.split("\n").map((line: string, lineIdx: number) => (
            <Text key={lineIdx} style={resolveStyle({ display: "block" })}>{line}</Text>
          ))}
        </Text>
      );
    }
    if (item.type === "list" && Array.isArray(item.items)) {
      return (
        <View key={item.items.join("-")} style={resolveStyle(item.style || {})}>
          {item.items.map((li: string, liIdx: any) => renderListItem(li, item.bulletStyle, item.style))}
        </View>
      );
    }
    if (item.type === "svg") {
      return renderSvg(item);
    }
    if (item.type === "view" && Array.isArray(item.subContent)) {
      return (
        <View key={`view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`} style={resolveStyle(item.style || {})}>
          {item.subContent.map((subItem: any, subIdx: any) => renderContent(subItem))}
        </View>
      );
    }
    return null;
  }

  return (
    <Document>
      {pages.map((page, idx) => (
        <Page key={idx} style={resolveStyle(page.style)}>
          {page.sections && page.sections.map((sec, i) => (
            <View key={i} style={resolveStyle(sec.style)}>
              {sec.watermarkImg && (
                <Image
                  src={resolveImage(sec.watermarkImg)}
                  style={resolveStyle({ position: "absolute", ...sec.style?.watermarkImgStyle })}
                  fixed
                />
              )}
              {sec.title && <Text style={resolveStyle(sec.style)}>{sec.title}</Text>}
              {Array.isArray(sec.content) && sec.content.map((item, idx) => renderContent(item))}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}

const styles = StyleSheet.create({});