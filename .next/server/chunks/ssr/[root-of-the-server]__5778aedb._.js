module.exports = {

"[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("@react-pdf/renderer");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/pages/administration/reportsList.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>ReportsList)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$secure$2d$storage__$5b$external$5d$__$28$react$2d$secure$2d$storage$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react-secure-storage [external] (react-secure-storage, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
;
;
// Enregistrement de la police personnalisée (BRSonomaSemibold.ttf)
__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Font"].register({
    family: "BR Sonoma",
    src: "/font/BRSonomaSemibold.ttf",
    fontStyle: "normal",
    fontWeight: "normal"
});
const PDFDownloadButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/app/components/PDFDownloadButton.tsx [ssr] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/app/components/PDFDownloadButton.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
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
const pdfStyles = __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["StyleSheet"].create({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
        style: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
            marginTop: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
            themeColors.map((color, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
        style: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                style: {
                    width: gridWidth,
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: {
                            flexDirection: "row"
                        },
                        children: Array.from({
                            length: nbCols
                        }).map((_, col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                                style: {
                                    width: cellSize,
                                    height: 18,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
                    }).map((_, row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                            style: {
                                flexDirection: "row"
                            },
                            children: Array.from({
                                length: nbCols
                            }).map((_, col)=>{
                                const idx = row * nbCols + col;
                                const cell = gridData[idx];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                style: {
                    flexDirection: "row",
                    marginTop: 6
                },
                children: Array.from({
                    length: nbCols
                }).map((_, col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: {
                            width: cellSize,
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
// Pied de page pour la pagination PDF
const PDFPageFooter = ({ pageNumber, totalPages })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
        fixed: true,
        style: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 18,
            textAlign: "center",
            width: "100%"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
const CustomReportPDF = ({ reportType, period, data, influenceHistory = [], chartImage = "", influenceChartImage = "", topUsersChartImage = "", companyName = "Vyft" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Document"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                        src: "/Vyft_program.png",
                        style: pdfStyles.logo
                    }, void 0, false, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 285,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: pdfStyles.section,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Influence & bénéfice estimé (800 derniers jours)"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 317,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InfluenceLegend, {}, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 320,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InfluenceGrid, {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFPageFooter, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    chartImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: {
                            ...pdfStyles.section,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 24,
                            height: 320
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Profit de marché"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
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
                    influenceChartImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: {
                            ...pdfStyles.section,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 320
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Influence"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFPageFooter, {
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
            topUsersChartImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: {
                            ...pdfStyles.section,
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Clients fréquents"
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFPageFooter, {
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
// Fonction pour télécharger le PDF généré côté serveur via l'API reportgen
async function downloadServerPDF(report, companyName) {
    const res = await fetch("/api/reportgen", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            reportType: report.type,
            period: report.period,
            data: report.data,
            influenceHistory: report.influenceHistory,
            chartImage: report.chartImage,
            influenceChartImage: report.influenceChartImage,
            topUsersChartImage: report.topUsersChartImage,
            companyName: report.companyName || companyName
        })
    });
    if (!res.ok) {
        alert("Erreur lors de la génération du PDF serveur");
        return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vyft-program-report-${report.type}-${report.period}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}
function ReportsList({ reports = [] }) {
    const [companyName, setCompanyName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchCompany = async ()=>{
            try {
                const userToken = __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$secure$2d$storage__$5b$external$5d$__$28$react$2d$secure$2d$storage$2c$__cjs$29$__["default"].getItem("userToken");
                if (!userToken) return;
                // Récupérer les infos utilisateur depuis Auth0
                const userInfoResponse = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const userId = userInfoResponse.data.sub;
                // Récupérer les métadonnées utilisateur (enseigne)
                const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/api/v2/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const denomination = response.data?.user_metadata?.denomination?.trim();
                setCompanyName(denomination || "");
            } catch (error) {
                setCompanyName("");
            }
        };
        fetchCompany();
    }, []);
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
                lineNumber: 489,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                style: {
                    listStyle: "none",
                    padding: 0
                },
                children: reports.map((report, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bodyonwhite,
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
                                            fontSize: 20,
                                            margin: 0,
                                            fontWeight: "bold",
                                            color: "#1a7f6b"
                                        },
                                        children: [
                                            "Rapport ",
                                            report.label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/administration/reportsList.tsx",
                                        lineNumber: 509,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headeronwhite,
                                        style: {
                                            fontSize: 15,
                                            margin: "4px 0 0 0",
                                            fontWeight: 500,
                                            color: "#444444"
                                        },
                                        children: [
                                            "Période : ",
                                            report.period
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/administration/reportsList.tsx",
                                        lineNumber: 521,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                        style: {
                                            fontSize: 14,
                                            margin: "4px 0 0 0",
                                            color: "#222"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                                children: "Entreprise :"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/reportsList.tsx",
                                                lineNumber: 541,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            report.companyName || companyName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/administration/reportsList.tsx",
                                        lineNumber: 533,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 507,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFDownloadButton, {
                                        document: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CustomReportPDF, {
                                            reportType: report.type,
                                            period: report.period,
                                            data: report.data,
                                            influenceHistory: report.influenceHistory,
                                            chartImage: report.chartImage,
                                            influenceChartImage: report.influenceChartImage,
                                            topUsersChartImage: report.topUsersChartImage,
                                            companyName: report.companyName || companyName
                                        }, void 0, false, {
                                            fileName: "[project]/pages/administration/reportsList.tsx",
                                            lineNumber: 548,
                                            columnNumber: 19
                                        }, void 0),
                                        fileName: `vyft-program-report-${report.type}-${report.period}.pdf`,
                                        style: {
                                            background: "#1a7f6b",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            borderRadius: 8,
                                            width: 44,
                                            height: 44,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: "/nav_down.png",
                                            alt: "Télécharger PDF",
                                            style: {
                                                width: 28,
                                                height: 28
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/administration/reportsList.tsx",
                                            lineNumber: 574,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/administration/reportsList.tsx",
                                        lineNumber: 546,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>downloadServerPDF(report, companyName),
                                        style: {
                                            background: "#444444",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            borderRadius: 8,
                                            width: 44,
                                            height: 44,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                                        },
                                        title: "Télécharger PDF (serveur)",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: "/nav_down.png",
                                            alt: "PDF serveur",
                                            style: {
                                                width: 28,
                                                height: 28,
                                                filter: "grayscale(1)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/administration/reportsList.tsx",
                                            lineNumber: 594,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/administration/reportsList.tsx",
                                        lineNumber: 577,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 544,
                                columnNumber: 13
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 494,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 492,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 477,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/administration/reportsList.tsx [ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/pages/administration/reportsList.tsx [ssr] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5778aedb._.js.map