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
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[project]/app/components/DynamicReport.tsx [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>DynamicReport)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
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
    const pages = design.pages && Array.isArray(design.pages) ? design.pages : props.pages && props.pages.length ? props.pages : [
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
    function resolveImage(src) {
        // Si pas de src, retourne le chemin absolu du fallback
        if (!src) return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "tmp", "default.jpg");
        // Si chemin local (commence par /tmp/)
        if (src.startsWith("/tmp/")) {
            if ("TURBOPACK compile-time truthy", 1) {
                const absPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", src);
                try {
                    __turbopack_context__.r("[externals]/fs [external] (fs, cjs)").accessSync(absPath);
                    return absPath;
                } catch  {
                    // Fallback si le fichier n'existe pas
                    return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "tmp", "default.jpg");
                }
            }
            // Côté client, retourne le chemin relatif
            return src;
        }
        // Si chemin relatif
        return src.startsWith("/") ? src : "/" + src;
    }
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
                        lineNumber: 126,
                        columnNumber: 13
                    }, this),
                    page.watermarkImg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                        src: resolveImage(page.watermarkImg),
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
                        lineNumber: 143,
                        columnNumber: 13
                    }, this),
                    page.logo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                        src: resolveImage(page.logo),
                        style: {
                            width: 120,
                            height: 48,
                            marginBottom: 18,
                            alignSelf: "center"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/DynamicReport.tsx",
                        lineNumber: 159,
                        columnNumber: 13
                    }, this),
                    page.sections && page.sections.map((sec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                            style: {
                                ...styles.section,
                                ...sec.style || {}
                            },
                            children: [
                                sec.icon?.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                                    src: resolveImage(sec.icon.url),
                                    style: {
                                        width: sec.icon.size?.split("x")[0] || 24,
                                        height: sec.icon.size?.split("x")[1] || 24,
                                        marginBottom: 8,
                                        marginRight: sec.icon.position === "left" ? 8 : 0,
                                        alignSelf: sec.icon.position === "top" ? "center" : "flex-start"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 174,
                                    columnNumber: 17
                                }, this),
                                sec.watermarkImg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                                    src: resolveImage(sec.watermarkImg),
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
                                    lineNumber: 187,
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
                                    lineNumber: 201,
                                    columnNumber: 29
                                }, this),
                                Array.isArray(sec.content) ? sec.content.map((item, idx)=>{
                                    if (item.type === "image" && item.url) {
                                        // Correction du borderRadius pour @react-pdf/renderer
                                        let borderRadius = 0;
                                        if (item.style?.borderRadius) {
                                            if (typeof item.style.borderRadius === "string") {
                                                // Si "50%" ou "30px", on convertit en nombre
                                                if (item.style.borderRadius.endsWith("%")) {
                                                    borderRadius = 30; // valeur arbitraire, à ajuster selon la taille de l'image
                                                } else if (item.style.borderRadius.endsWith("px")) {
                                                    borderRadius = parseInt(item.style.borderRadius, 10);
                                                }
                                            } else if (typeof item.style.borderRadius === "number") {
                                                borderRadius = item.style.borderRadius;
                                            }
                                        }
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                                            src: resolveImage(item.url),
                                            style: {
                                                width: item.style?.width || 60,
                                                height: item.style?.height || 60,
                                                borderRadius,
                                                border: item.style?.border || undefined,
                                                marginRight: item.style?.marginRight || 0,
                                                marginTop: item.style?.marginTop || 0,
                                                marginBottom: item.style?.marginBottom || 0,
                                                float: item.style?.float || undefined
                                            }
                                        }, idx, false, {
                                            fileName: "[project]/app/components/DynamicReport.tsx",
                                            lineNumber: 221,
                                            columnNumber: 25
                                        }, this);
                                    }
                                    if (item.type === "text") {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                            style: {
                                                color: sec.style?.color || "#222",
                                                fontSize: sec.style?.fontSize
                                            },
                                            children: item.value
                                        }, idx, false, {
                                            fileName: "[project]/app/components/DynamicReport.tsx",
                                            lineNumber: 239,
                                            columnNumber: 25
                                        }, this);
                                    }
                                    if (item.type === "list" && Array.isArray(item.items)) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                                            style: {
                                                marginLeft: 12,
                                                marginBottom: 6
                                            },
                                            children: item.items.map((li, liIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                                    style: {
                                                        color: sec.style?.color || "#222",
                                                        fontSize: sec.style?.fontSize
                                                    },
                                                    children: [
                                                        "• ",
                                                        li
                                                    ]
                                                }, liIdx, true, {
                                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 29
                                                }, this))
                                        }, idx, false, {
                                            fileName: "[project]/app/components/DynamicReport.tsx",
                                            lineNumber: 246,
                                            columnNumber: 25
                                        }, this);
                                    }
                                    if (item.type === "signature") {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                            style: {
                                                ...styles.signature,
                                                color: sec.style?.color || "#222"
                                            },
                                            children: item.placeholder || "Signature"
                                        }, idx, false, {
                                            fileName: "[project]/app/components/DynamicReport.tsx",
                                            lineNumber: 257,
                                            columnNumber: 25
                                        }, this);
                                    }
                                    return null;
                                }) : sec.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                    style: {
                                        color: sec.style?.color || "#222",
                                        fontSize: sec.style?.fontSize
                                    },
                                    children: sec.content
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 265,
                                    columnNumber: 21
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
                                                    lineNumber: 274,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/DynamicReport.tsx",
                                            lineNumber: 272,
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
                                                        lineNumber: 280,
                                                        columnNumber: 25
                                                    }, this))
                                            }, k, false, {
                                                fileName: "[project]/app/components/DynamicReport.tsx",
                                                lineNumber: 278,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 271,
                                    columnNumber: 17
                                }, this),
                                sec.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                                    src: resolveImage(sec.image),
                                    style: {
                                        width: 180,
                                        height: 80,
                                        margin: 12
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/DynamicReport.tsx",
                                    lineNumber: 288,
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
                                    lineNumber: 291,
                                    columnNumber: 17
                                }, this),
                                sec.custom
                            ]
                        }, i, true, {
                            fileName: "[project]/app/components/DynamicReport.tsx",
                            lineNumber: 171,
                            columnNumber: 13
                        }, this))
                ]
            }, idx, true, {
                fileName: "[project]/app/components/DynamicReport.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/DynamicReport.tsx",
        lineNumber: 113,
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
"[project]/app/components/reportvyft.tsx [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
const fontPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), "public", "font", "brsonomasemibold.ttf");
// Enregistrement de la police personnalisée (local)
__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Font"].register({
    family: "BR Sonoma",
    src: fontPath,
    fontStyle: "normal",
    fontWeight: "normal"
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
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 94,
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
                    fileName: "[project]/app/components/reportvyft.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                style: {
                    fontSize: 10,
                    marginLeft: 8
                },
                children: "Forte influence"
            }, void 0, false, {
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/reportvyft.tsx",
        lineNumber: 88,
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
                                    fileName: "[project]/app/components/reportvyft.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, this)
                            }, col, false, {
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 147,
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
                                    fileName: "[project]/app/components/reportvyft.tsx",
                                    lineNumber: 175,
                                    columnNumber: 17
                                }, this);
                            })
                        }, row, false, {
                            fileName: "[project]/app/components/reportvyft.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 142,
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
                            fileName: "[project]/app/components/reportvyft.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this)
                    }, col, false, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/reportvyft.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
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
            fileName: "[project]/app/components/reportvyft.tsx",
            lineNumber: 226,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/reportvyft.tsx",
        lineNumber: 215,
        columnNumber: 3
    }, this);
const ReportVyft = ({ reportType, period, data, influenceHistory = [], chartImage = "", influenceChartImage = "", topUsersChartImage = "", companyName = "Vyft" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Document"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Page"], {
                size: "A4",
                style: pdfStyles.page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Image"], {
                        src: "public/vyft_program.png",
                        style: pdfStyles.logo
                    }, void 0, false, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 259,
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
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 260,
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
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 268,
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
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 278,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["View"], {
                        style: pdfStyles.section,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["Text"], {
                                style: pdfStyles.subtitle,
                                children: "Influence & bénéfice estimé (800 derniers jours)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 286,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InfluenceLegend, {}, void 0, false, {
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 289,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InfluenceGrid, {
                                influenceData: influenceHistory,
                                dailyData: data.daily
                            }, void 0, false, {
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 290,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 285,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFPageFooter, {
                        pageNumber: 1,
                        totalPages: topUsersChartImage ? 3 : 2
                    }, void 0, false, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 295,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 258,
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
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 300,
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
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 299,
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
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 315,
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
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 316,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFPageFooter, {
                        pageNumber: 2,
                        totalPages: topUsersChartImage ? 3 : 2
                    }, void 0, false, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 328,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 297,
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
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 333,
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
                                fileName: "[project]/app/components/reportvyft.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PDFPageFooter, {
                        pageNumber: 3,
                        totalPages: 3
                    }, void 0, false, {
                        fileName: "[project]/app/components/reportvyft.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/reportvyft.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/reportvyft.tsx",
        lineNumber: 257,
        columnNumber: 3
    }, this);
const __TURBOPACK__default__export__ = ReportVyft;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/axios [external] (axios, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/pages/api/reportgen.tsx [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>vyftreport),
    "fetchAndSaveImage": (()=>fetchAndSaveImage)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-pdf/renderer [external] (@react-pdf/renderer, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/DynamicReport.tsx [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reportvyft$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reportvyft.tsx [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reportvyft$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reportvyft$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
;
async function fetchAndSaveImage(url, filename) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(url, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
            }
        });
        const ext = /\.(png|jpg|jpeg|webp)$/i.test(url) ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].extname(url) : ".jpg";
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "tmp", filename + ext);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(filePath), {
            recursive: true
        });
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(filePath, response.data);
        return "/tmp/" + filename + ext;
    } catch (err) {
        console.error("Erreur téléchargement image :", url, err?.message || err);
        // Retourne le chemin relatif pour react-pdf
        return "/tmp/default.jpg";
    }
}
async function processImages(obj) {
    if (!obj) return obj;
    if (typeof obj === "object") {
        for(const key in obj){
            if (typeof obj[key] === "string" && /^https?:\/\//.test(obj[key])) {
                const urlWithoutParams = obj[key].split("?")[0];
                if (!/\.(png|jpg|jpeg|webp)$/i.test(urlWithoutParams)) {
                    // Télécharge et remplace par le chemin local
                    const filename = "img_" + Buffer.from(obj[key]).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
                    obj[key] = await fetchAndSaveImage(obj[key], filename);
                } else {
                    // Pour les images avec extension, télécharge aussi localement
                    const filename = "img_" + Buffer.from(obj[key]).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
                    obj[key] = await fetchAndSaveImage(obj[key], filename);
                }
            } else if (typeof obj[key] === "object") {
                obj[key] = await processImages(obj[key]);
            }
        }
    }
    return obj;
}
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
        let props = req.body;
        props = await processImages(props); // <--- Ajout ici
        const useVyft = props.type === "vyft" || !props.design;
        const pdfBlob = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$pdf$2f$renderer__$5b$external$5d$__$2840$react$2d$pdf$2f$renderer$2c$__esm_import$29$__["pdf"])(useVyft ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reportvyft$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__["default"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/pages/api/reportgen.tsx",
            lineNumber: 70,
            columnNumber: 17
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$DynamicReport$2e$tsx__$5b$api$5d$__$28$ecmascript$29$__["default"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/pages/api/reportgen.tsx",
            lineNumber: 70,
            columnNumber: 45
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c09490d6._.js.map