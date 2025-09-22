module.exports = {

"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[project]/pages/administration/reportsList.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ReportsList)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [ssr] (css module)");
;
;
;
;
const { Document, Page, Text, View, Image, StyleSheet } = __turbopack_context__.r("[project]/node_modules/@react-pdf/renderer/lib/react-pdf.js [ssr] (ecmascript)");
const PDFDownloadLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import, async loader)")(__turbopack_context__.i).then((mod)=>mod.PDFDownloadLink), {
    loadableGenerated: {
        modules: [
            "[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)"
        ]
    },
    ssr: false
});
const pdfStyles = StyleSheet.create({
    page: {
        backgroundColor: "#DBDFE0",
        padding: 32,
        fontFamily: "Helvetica"
    },
    logo: {
        width: 180,
        height: 80,
        marginBottom: 24,
        alignSelf: "center"
    },
    title: {
        fontSize: 28,
        color: "#1a7f6b",
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center"
    },
    section: {
        marginBottom: 18,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 18
    },
    subtitle: {
        fontSize: 18,
        color: "#444444",
        fontWeight: "bold",
        marginBottom: 8
    },
    text: {
        fontSize: 14,
        color: "#222",
        marginBottom: 6
    }
});
const CustomReportPDF = ({ reportType, period, data })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Document, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Page, {
            size: "A4",
            style: pdfStyles.page,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Image, {
                    src: "/Vyft_program.png",
                    style: pdfStyles.logo
                }, void 0, false, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 65,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                    style: pdfStyles.title,
                    children: [
                        "Rapport ",
                        reportType === "weekly" ? "hebdomadaire" : reportType === "monthly" ? "mensuel" : "fiscal"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 66,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                    style: {
                        ...pdfStyles.text,
                        textAlign: "center",
                        marginBottom: 12
                    },
                    children: [
                        "Période : ",
                        period
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 69,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(View, {
                    style: pdfStyles.section,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.subtitle,
                            children: "Synthèse"
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 73,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.text,
                            children: [
                                "• Total des pas : ",
                                data.totalSteps.toLocaleString()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 74,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.text,
                            children: [
                                "• Distance totale : ",
                                data.totalDistance.toLocaleString(),
                                " m"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 75,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.text,
                            children: [
                                "• Recette totale : ",
                                data.totalRevenue.toLocaleString(),
                                " €"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 76,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.text,
                            children: [
                                "• Croissance : ",
                                data.growth
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 77,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 72,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(View, {
                    style: pdfStyles.section,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.subtitle,
                            children: "Détail journalier"
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 80,
                            columnNumber: 9
                        }, this),
                        data.daily.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                                style: pdfStyles.text,
                                children: [
                                    d.date,
                                    " : ",
                                    d.steps,
                                    " pas, ",
                                    d.distance,
                                    " m, ",
                                    d.revenue,
                                    " €"
                                ]
                            }, d.date, true, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 79,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(View, {
                    style: pdfStyles.section,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.subtitle,
                            children: "Commentaires"
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 88,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Text, {
                            style: pdfStyles.text,
                            children: "Rapport généré automatiquement par Vyft Program."
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 89,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/administration/reportsList.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, this);
function ReportsList({ reportType = "weekly", period = "", data = {
    totalSteps: 0,
    totalDistance: 0,
    totalRevenue: 0,
    growth: "0 %",
    daily: []
} }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bodyonwhite,
        style: {
            background: "#fff",
            borderRadius: 24,
            padding: 32,
            marginBottom: 32,
            width: "100%",
            maxWidth: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headeronwhite,
                style: {
                    fontSize: 22,
                    marginBottom: 18
                },
                children: "Liste des rapports générés"
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                style: {
                    listStyle: "none",
                    padding: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                    style: {
                        marginBottom: 18,
                        background: "#DBDFE0",
                        borderRadius: 18,
                        padding: 18,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    style: {
                                        fontSize: 18,
                                        margin: 0
                                    },
                                    children: [
                                        "Rapport ",
                                        reportType === "weekly" ? "hebdomadaire" : reportType === "monthly" ? "mensuel" : "fiscal"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    style: {
                                        margin: 0
                                    },
                                    children: [
                                        "Période : ",
                                        period
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFDownloadLink, {
                            document: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CustomReportPDF, {
                                reportType: reportType,
                                period: period,
                                data: data
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 153,
                                columnNumber: 23
                            }, void 0),
                            fileName: `vyft-rapport-${reportType}.pdf`,
                            style: {
                                background: "#1a7f6b",
                                color: "#fff",
                                borderRadius: 18,
                                padding: "12px 28px",
                                fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                fontSize: 16,
                                textDecoration: "none",
                                marginLeft: 24
                            },
                            children: ({ loading })=>loading ? "Génération..." : "Télécharger PDF"
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
}}),
"[project]/pages/administration/reportsList.tsx [ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/pages/administration/reportsList.tsx [ssr] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__f55d6eb8._.js.map