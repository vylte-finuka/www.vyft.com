(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/pages/administration/reportsList.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ReportsList)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$renderer$2f$lib$2f$react$2d$pdf$2e$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-pdf/renderer/lib/react-pdf.browser.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-pdf/primitives/lib/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$renderer$2f$lib$2f$react$2d$pdf$2e$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-pdf/renderer/lib/react-pdf.browser.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
// Enregistrement de la police personnalisée (BRSonomaSemibold.ttf)
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$renderer$2f$lib$2f$react$2d$pdf$2e$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Font"].register({
    family: "BR Sonoma",
    src: "/font/BRSonomaSemibold.ttf",
    fontStyle: "normal",
    fontWeight: "normal"
});
const PDFDownloadButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/app/components/PDFDownloadButton.tsx [client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/app/components/PDFDownloadButton.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = PDFDownloadButton;
const themeColors = [
    "#e0e0e0",
    "#bfc4c5",
    "#444444",
    "#1a7f6b",
    "#000000"
];
function getInfluenceColor(val, max) {
    if (max === 0) return themeColors[0];
    const ratio = val / max;
    if (ratio > 0.8) return themeColors[4];
    if (ratio > 0.6) return themeColors[3];
    if (ratio > 0.3) return themeColors[2];
    if (ratio > 0) return themeColors[1];
    return themeColors[0];
}
const pdfStyles = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$renderer$2f$lib$2f$react$2d$pdf$2e$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["StyleSheet"].create({
    page: {
        backgroundColor: "#DBDFE0",
        padding: 32,
        fontFamily: "BR Sonoma"
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
        marginBottom: 12,
        textAlign: "center",
        fontFamily: "BR Sonoma",
        fontWeight: "bold"
    },
    section: {
        marginBottom: 18,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 18,
        fontFamily: "BR Sonoma",
        breakInside: "avoid",
        pageBreakInside: "avoid"
    },
    subtitle: {
        fontSize: 18,
        color: "#444444",
        marginBottom: 8,
        fontFamily: "BR Sonoma"
    },
    text: {
        fontSize: 14,
        color: "#222",
        marginBottom: 6,
        fontFamily: "BR Sonoma"
    },
    chartImage: {
        width: "100%",
        height: 180,
        borderRadius: 12,
        marginBottom: 12
    }
});
function InfluenceLegend() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
        style: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
            marginTop: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                style: {
                    fontSize: 10,
                    marginRight: 8
                },
                children: "Faible"
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            themeColors.map((color, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                    style: {
                        width: 18,
                        height: 10,
                        backgroundColor: color,
                        borderRadius: 2,
                        marginHorizontal: 2,
                        border: "1px solid #fff",
                        marginRight: idx === themeColors.length - 1 ? 8 : 2
                    }
                }, color, false, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                style: {
                    fontSize: 10,
                    marginLeft: 8
                },
                children: "Forte influence"
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_c1 = InfluenceLegend;
function InfluenceGrid({ influenceData, dailyData }) {
    const gridData = Array(800).fill(0).map((_, i)=>{
        const date = influenceData[i]?.date || "";
        const count = influenceData[i]?.count || 0;
        return {
            count,
            date
        };
    });
    const max = Math.max(...gridData.map((g)=>g.count), 1);
    const nbCols = 32;
    const nbRows = 25;
    const gridWidth = 520;
    const cellSize = gridWidth / nbCols;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
        style: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                style: {
                    width: gridWidth,
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                        style: {
                            flexDirection: "row"
                        },
                        children: Array.from({
                            length: nbCols
                        }).map((_, col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                                style: {
                                    width: cellSize,
                                    height: 18,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                    style: {
                                        fontSize: 8,
                                        color: "#444",
                                        fontFamily: "BR Sonoma"
                                    },
                                    children: col + 1
                                }, void 0, false, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            }, col, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    Array.from({
                        length: nbRows
                    }).map((_, row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                            style: {
                                flexDirection: "row"
                            },
                            children: Array.from({
                                length: nbCols
                            }).map((_, col)=>{
                                const idx = row * nbCols + col;
                                const cell = gridData[idx];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                                    style: {
                                        width: cellSize,
                                        height: cellSize,
                                        borderRadius: 4,
                                        backgroundColor: getInfluenceColor(cell.count, max),
                                        border: "1px solid #fff",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        display: "flex"
                                    }
                                }, col, false, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 195,
                                    columnNumber: 17
                                }, this);
                            })
                        }, row, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                style: {
                    flexDirection: "row",
                    marginTop: 6
                },
                children: Array.from({
                    length: nbCols
                }).map((_, col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                        style: {
                            width: cellSize,
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                            style: {
                                fontSize: 7,
                                color: "#888"
                            },
                            children: col % 4 === 0 ? "M" + (col / 4 + 1) : ""
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this)
                    }, col, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_c2 = InfluenceGrid;
// Pied de page pour la pagination PDF
const PDFPageFooter = ({ pageNumber, totalPages })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
        fixed: true,
        style: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 18,
            textAlign: "center",
            width: "100%"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
            style: {
                fontSize: 12,
                color: "#888",
                fontFamily: "BR Sonoma"
            },
            children: [
                "Page ",
                pageNumber,
                " / ",
                totalPages
            ]
        }, void 0, true, {
            fileName: "[project]/pages/administration/reportsList.tsx",
            lineNumber: 251,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 240,
        columnNumber: 3
    }, this);
_c3 = PDFPageFooter;
const CustomReportPDF = ({ reportType, period, data, influenceHistory = [], chartImage = "", influenceChartImage = "", topUsersChartImage = "", companyName = "Vyft" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Document"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Image"], {
                        src: "/Vyft_program.png",
                        style: pdfStyles.logo
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 285,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                        style: pdfStyles.title,
                        children: [
                            "Rapport",
                            " ",
                            reportType === "weekly" ? "hebdomadaire" : reportType === "monthly" ? "mensuel" : "fiscal"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 286,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                        style: {
                            fontSize: 18,
                            color: "#1a7f6b",
                            textAlign: "center",
                            marginBottom: 8,
                            fontFamily: "BR Sonoma",
                            fontWeight: "bold"
                        },
                        children: companyName
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 295,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
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
                        lineNumber: 307,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                        style: pdfStyles.section,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Influence & bénéfice estimé (800 derniers jours)"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 317,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfluenceLegend, {}, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 320,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfluenceGrid, {
                                influenceData: influenceHistory,
                                dailyData: data.daily
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 321,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 316,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PDFPageFooter, {
                        pageNumber: 1,
                        totalPages: topUsersChartImage ? 3 : 2
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 326,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 284,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    chartImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                        style: {
                            ...pdfStyles.section,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 24,
                            height: 320
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Profit de marché"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Image"], {
                                src: chartImage,
                                style: {
                                    width: "95%",
                                    height: 260,
                                    objectFit: "contain",
                                    alignSelf: "center",
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    influenceChartImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                        style: {
                            ...pdfStyles.section,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 320
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Influence"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Image"], {
                                src: influenceChartImage,
                                style: {
                                    width: "95%",
                                    height: 260,
                                    objectFit: "contain",
                                    alignSelf: "center",
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PDFPageFooter, {
                        pageNumber: 2,
                        totalPages: topUsersChartImage ? 3 : 2
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 360,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 329,
                columnNumber: 5
            }, this),
            topUsersChartImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["View"], {
                        style: {
                            ...pdfStyles.section,
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Clients fréquents"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$pdf$2f$primitives$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Image"], {
                                src: topUsersChartImage,
                                style: {
                                    width: "95%",
                                    height: 340,
                                    objectFit: "contain",
                                    alignSelf: "center",
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PDFPageFooter, {
                        pageNumber: 3,
                        totalPages: 3
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 378,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 364,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 282,
        columnNumber: 3
    }, this);
_c4 = CustomReportPDF;
function ReportsList({ reportType = "weekly", period = "", data = {
    totalSteps: 0,
    totalDistance: 0,
    totalRevenue: 0,
    growth: "0 %",
    daily: []
}, influenceHistory = [], chartImage = "", influenceChartImage = "", topUsersChartImage = "", enseigne = "" }) {
    _s();
    // Ajout de la récupération dynamique du nom de l'enseigne comme dans main-management
    const [storeName, setStoreName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportsList.useEffect": ()=>{
            const fetchStoreName = {
                "ReportsList.useEffect.fetchStoreName": async ()=>{
                    try {
                        const userToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("userToken");
                        if (!userToken) {
                            setStoreName("");
                            return;
                        }
                        const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const userId = userInfoResponse.data.sub;
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/api/v2/users/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const denomination = response.data?.user_metadata?.denomination?.trim();
                        setStoreName(denomination || "");
                    } catch (error) {
                        setStoreName("");
                    }
                }
            }["ReportsList.useEffect.fetchStoreName"];
            fetchStoreName();
        }
    }["ReportsList.useEffect"], []);
    // On priorise le nom dynamique, sinon la prop, sinon "Non renseignée"
    const companyName = storeName || enseigne || "Non renseignée";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                style: {
                    fontSize: 22,
                    marginBottom: 18
                },
                children: "Liste des rapports générés"
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 470,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                style: {
                    listStyle: "none",
                    padding: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    style: {
                        marginBottom: 18,
                        background: "#DBDFE0",
                        borderRadius: 18,
                        padding: 18,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "BR Sonoma"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    style: {
                                        fontSize: 18,
                                        margin: 0,
                                        fontFamily: "BR Sonoma"
                                    },
                                    children: [
                                        "Rapport",
                                        " ",
                                        reportType === "weekly" ? "hebdomadaire" : reportType === "monthly" ? "mensuel" : "fiscal"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    style: {
                                        margin: 0,
                                        fontFamily: "BR Sonoma"
                                    },
                                    children: [
                                        "Période : ",
                                        period
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 501,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    style: {
                                        margin: 0,
                                        fontFamily: "BR Sonoma"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "Entreprise :"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/administration/reportsList.tsx",
                                            lineNumber: 505,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        companyName
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 504,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 489,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PDFDownloadButton, {
                            document: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomReportPDF, {
                                reportType: reportType,
                                period: period,
                                data: data,
                                influenceHistory: influenceHistory,
                                chartImage: chartImage,
                                influenceChartImage: influenceChartImage,
                                topUsersChartImage: topUsersChartImage,
                                companyName: companyName
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 510,
                                columnNumber: 15
                            }, void 0),
                            fileName: `vyft-program-report-${reportType}.pdf`,
                            style: {
                                background: "#1a7f6b",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                marginLeft: 12,
                                borderRadius: 8,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/nav_down.png",
                                alt: "Télécharger PDF",
                                style: {
                                    width: 28,
                                    height: 28
                                }
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 537,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/reportsList.tsx",
                            lineNumber: 508,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/reportsList.tsx",
                    lineNumber: 477,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 476,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 458,
        columnNumber: 5
    }, this);
}
_s(ReportsList, "kTzCxY5lywgfsi7AWGG+RmvjP7Q=");
_c5 = ReportsList;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "PDFDownloadButton");
__turbopack_context__.k.register(_c1, "InfluenceLegend");
__turbopack_context__.k.register(_c2, "InfluenceGrid");
__turbopack_context__.k.register(_c3, "PDFPageFooter");
__turbopack_context__.k.register(_c4, "CustomReportPDF");
__turbopack_context__.k.register(_c5, "ReportsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=pages_administration_reportsList_tsx_594e483a._.js.map