module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}}),
"[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("@react-pdf/renderer");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/app/components/DynamicReport.tsx [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>DynamicReport)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
// Polices Google officielles : liens directs vers les sources TTF
__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Font"].register({
    family: "Lato",
    src: "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf"
});
__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Font"].register({
    family: "Roboto",
    src: "https://github.com/googlefonts/roboto-2/raw/refs/heads/main/src/hinted/Roboto-Regular.ttf"
});
__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Font"].register({
    family: "Arial",
    src: "https://github.com/adrienverge/copr-some-nice-fonts/raw/refs/heads/master/Arial.ttf"
});
function DynamicReport(props) {
    // Fusionne design IA et props classiques
    const design = props.design || {};
    const pages = props.pages && props.pages.length ? props.pages : [
        {
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
                    custom: design.custom
                }
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Document"], {
        children: pages.map((page, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Page"], {
                style: {
                    ...styles.body,
                    ...page.style || {},
                    fontFamily: page.font || "Arial",
                    backgroundColor: props.colors?.background || "#fff"
                },
                children: [
                    page.watermark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                        style: {
                            position: "absolute",
                            top: "45%",
                            left: "10%",
                            opacity: 0.12,
                            fontSize: 80,
                            color: props.colors?.watermark || "#1a7f6b",
                            transform: "rotate(-30deg)",
                            zIndex: 0
                        },
                        render: ()=>page.watermark,
                        fixed: true
                    }, void 0, false, {
                        fileName: "[project]/app/components/DynamicReport.tsx",
                        lineNumber: 100,
                        columnNumber: 13
                    }, this),
                    page.watermarkImg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                        src: page.watermarkImg,
                        style: {
                            position: "absolute",
                            top: "30%",
                            left: "25%",
                            width: 300,
                            height: 300,
                            opacity: 0.09,
                            zIndex: 0
                        },
                        fixed: true
                    }, void 0, false, {
                        fileName: "[project]/app/components/DynamicReport.tsx",
                        lineNumber: 117,
                        columnNumber: 13
                    }, this),
                    page.logo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                        src: page.logo,
                        style: {
                            width: 120,
                            height: 48,
                            marginBottom: 18,
                            alignSelf: "center"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/DynamicReport.tsx",
                        lineNumber: 133,
                        columnNumber: 13
                    }, this),
                    page.sections && page.sections.map((sec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                            style: {
                                ...styles.section,
                                ...sec.style || {}
                            },
                            children: [
                                sec.watermarkImg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                                    src: sec.watermarkImg,
                                    style: {
                                        position: "absolute",
                                        top: "35%",
                                        left: "30%",
                                        width: 200,
                                        height: 200,
                                        opacity: 0.08,
                                        zIndex: 0
                                    },
                                    fixed: true
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 147,
                                    columnNumber: 17
                                }, this),
                                sec.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                    style: {
                                        ...styles.sectionTitle,
                                        color: props.colors?.sectionTitle || "#444"
                                    },
                                    children: sec.title
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 161,
                                    columnNumber: 29
                                }, this),
                                sec.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                    style: {
                                        color: props.colors?.content || "#222"
                                    },
                                    children: sec.content
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 162,
                                    columnNumber: 31
                                }, this),
                                sec.table && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                                    style: styles.table,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                                            style: styles.tableRow,
                                            children: sec.table.headers.map((h, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                                    style: {
                                                        ...styles.tableHeader,
                                                        color: props.colors?.tableHeader || "#1a7f6b"
                                                    },
                                                    children: h
                                                }, j, false, {
                                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/DynamicReport.tsx",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this),
                                        sec.table.rows.map((row, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                                                style: styles.tableRow,
                                                children: row.map((cell, l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                                        style: {
                                                            ...styles.tableCell,
                                                            color: props.colors?.tableCell || "#222"
                                                        },
                                                        children: cell
                                                    }, l, false, {
                                                        fileName: "[project]/app/components/DynamicReport.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 25
                                                    }, this))
                                            }, k, false, {
                                                fileName: "[project]/app/components/DynamicReport.tsx",
                                                lineNumber: 171,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 164,
                                    columnNumber: 17
                                }, this),
                                sec.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                                    src: sec.image,
                                    style: {
                                        width: 180,
                                        height: 80,
                                        margin: 12
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 180,
                                    columnNumber: 17
                                }, this),
                                sec.signature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                    style: {
                                        ...styles.signature,
                                        color: props.colors?.signature || "#222"
                                    },
                                    children: [
                                        "Signature : ",
                                        sec.signature
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 183,
                                    columnNumber: 17
                                }, this),
                                sec.custom
                            ]
                        }, i, true, {
                            fileName: "[project]/app/components/DynamicReport.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this))
                ]
            }, idx, true, {
                fileName: "[project]/app/components/DynamicReport.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/DynamicReport.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
const styles = __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["StyleSheet"].create({
    body: {
        padding: 32,
        fontSize: 13,
        fontFamily: "Arial",
        position: "relative"
    },
    section: {
        marginBottom: 14
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 4
    },
    table: {
        display: "flex",
        width: "auto",
        marginBottom: 12
    },
    tableRow: {
        flexDirection: "row"
    },
    tableHeader: {
        fontWeight: "bold",
        fontSize: 13,
        color: "#1a7f6b",
        padding: 4,
        borderBottom: "1px solid #e0dbdd",
        minWidth: 60
    },
    tableCell: {
        fontSize: 13,
        padding: 4,
        minWidth: 60
    },
    signature: {
        fontSize: 14,
        color: "#222",
        marginTop: 18,
        fontStyle: "italic",
        textAlign: "right"
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/reportgen.tsx [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>vyftreport)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/DynamicReport.tsx [api] (ecmascript)"); // Un composant qui adapte le design
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
async function vyftreport(req, res) {
    // Sécurité par clé API
    const apiKey = req.headers["x-vyftprogram-api-key"];
    if (apiKey !== ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO")) {
        return res.status(401).json({
            error: "Clé API invalide ou manquante."
        });
    }
    if (req.method !== "POST") {
        res.status(405).end("Method Not Allowed");
        return;
    }
    try {
        const props = req.body;
        // Utilise le composant dynamique selon le type/design IA
        const pdfBlob = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["pdf"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__["default"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/pages/api/reportgen.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)).toBlob();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${props.title ? props.title.replace(/\s/g, "_") : "document"}.pdf`);
        res.end(Buffer.from(await pdfBlob.arrayBuffer()));
    } catch (error) {
        console.error("Erreur reportgen :", error);
        res.status(500).json({
            error: "Erreur interne lors de la génération du PDF",
            details: error?.message || error?.toString() || error
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/reportgen.tsx [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$reportgen$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/reportgen.tsx [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$reportgen$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$reportgen$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$reportgen$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$reportgen$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/reportgen",
        pathname: "/api/reportgen",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$reportgen$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e63e74fd._.js.map