module.exports = {

"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}}),
"[externals]/react-dom [external] (react-dom, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}}),
"[project]/app/[lang]/components/Navbar.module.css [ssr] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "ActionEbutton": "Navbar-module__CMWTcW__ActionEbutton",
  "copyright": "Navbar-module__CMWTcW__copyright",
  "fontstyle": "Navbar-module__CMWTcW__fontstyle",
  "fontstyle1": "Navbar-module__CMWTcW__fontstyle1",
  "fontstyle2": "Navbar-module__CMWTcW__fontstyle2",
  "fontstyle3": "Navbar-module__CMWTcW__fontstyle3",
  "footer": "Navbar-module__CMWTcW__footer",
  "links": "Navbar-module__CMWTcW__links",
  "logo": "Navbar-module__CMWTcW__logo",
  "navLinks": "Navbar-module__CMWTcW__navLinks",
  "navbar": "Navbar-module__CMWTcW__navbar",
  "open": "Navbar-module__CMWTcW__open",
  "subMenu": "Navbar-module__CMWTcW__subMenu",
  "subSubMenu": "Navbar-module__CMWTcW__subSubMenu",
});
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/[lang]/components/Navbar.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* eslint-disable @next/next/no-sync-scripts */ __turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Navbar.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const Navbar = ()=>{
    const [isSubMenuOpen, setIsSubMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isSubSubMenuOpen, setIsSubSubMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params?.lang === "fr-FR" ? "fr-FR" : "en-EN";
    const t = {
        "fr-FR": {
            ecosystem: "Écosystème",
            slide: "Vyft slide",
            slura: "Vyft slura",
            luzia: "LUZIA",
            offers: "Offres",
            cashbacks: "Cashbacks",
            partners: "Promotions",
            story: "Story time",
            vyft: "Vyft",
            vyftProgram: "Vyft program"
        },
        "en-EN": {
            ecosystem: "Ecosystem",
            slide: "Vyft slide",
            slura: "Vyft slura",
            luzia: "LUZIA",
            offers: "Offers",
            cashbacks: "Cashbacks",
            partners: "Promotions",
            story: "Story time",
            vyft: "Vyft",
            vyftProgram: "Vyft program"
        }
    }[locale];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].Navbar,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].logo,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    legacyBehavior: true,
                    href: `/${locale}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: "/vyft.png",
                            alt: "Vyftprogram",
                            width: 166,
                            height: 112,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].logo,
                            onContextMenu: (e)=>e.preventDefault(),
                            onDragStart: (e)=>e.preventDefault()
                        }, void 0, false, {
                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/[lang]/components/Navbar.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navLinks,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle,
                                children: t.ecosystem
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].open : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/ecosystem/vyft-slide`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.slide
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/ecosystem/vyft-slura`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.slura
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 68,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/ecosystem/luzia`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.luzia
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 69,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle,
                                children: t.offers
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].open : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/offer/cashbacks`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.cashbacks
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/offer/partenaires`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.partners
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 78,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle,
                                children: t.story
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].open : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/story/vyft`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.vyft
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/story/vyft-program`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: t.vyftProgram
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                            lineNumber: 87,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[lang]/components/Navbar.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[lang]/components/Navbar.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Navbar;
}}),
"[project]/app/page.module.css [ssr] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "ActionE": "page-module__E0kJGG__ActionE",
  "ActionEbutton": "page-module__E0kJGG__ActionEbutton",
  "ActionEbuttonoveroff": "page-module__E0kJGG__ActionEbuttonoveroff",
  "ActionEbuttonoveron": "page-module__E0kJGG__ActionEbuttonoveron",
  "author": "page-module__E0kJGG__author",
  "authorphoto": "page-module__E0kJGG__authorphoto",
  "body": "page-module__E0kJGG__body",
  "bodyattract": "page-module__E0kJGG__bodyattract",
  "bodycar": "page-module__E0kJGG__bodycar",
  "bodymessage": "page-module__E0kJGG__bodymessage",
  "bodyonwhite": "page-module__E0kJGG__bodyonwhite",
  "bodyonwhitemessage": "page-module__E0kJGG__bodyonwhitemessage",
  "button": "page-module__E0kJGG__button",
  "card": "page-module__E0kJGG__card",
  "center": "page-module__E0kJGG__center",
  "container": "page-module__E0kJGG__container",
  "container1": "page-module__E0kJGG__container1",
  "container2": "page-module__E0kJGG__container2",
  "container3": "page-module__E0kJGG__container3",
  "container4": "page-module__E0kJGG__container4",
  "container5": "page-module__E0kJGG__container5",
  "content": "page-module__E0kJGG__content",
  "date": "page-module__E0kJGG__date",
  "description": "page-module__E0kJGG__description",
  "emoji": "page-module__E0kJGG__emoji",
  "form": "page-module__E0kJGG__form",
  "formGroup": "page-module__E0kJGG__formGroup",
  "grid": "page-module__E0kJGG__grid",
  "header": "page-module__E0kJGG__header",
  "headerX2": "page-module__E0kJGG__headerX2",
  "headeronwhite": "page-module__E0kJGG__headeronwhite",
  "headeronwhiteX2": "page-module__E0kJGG__headeronwhiteX2",
  "input": "page-module__E0kJGG__input",
  "label": "page-module__E0kJGG__label",
  "left": "page-module__E0kJGG__left",
  "logo": "page-module__E0kJGG__logo",
  "main": "page-module__E0kJGG__main",
  "modal": "page-module__E0kJGG__modal",
  "modalBody": "page-module__E0kJGG__modalBody",
  "modalButton": "page-module__E0kJGG__modalButton",
  "modalContent": "page-module__E0kJGG__modalContent",
  "modalHeader": "page-module__E0kJGG__modalHeader",
  "modalLink": "page-module__E0kJGG__modalLink",
  "next": "page-module__E0kJGG__next",
  "personDetails": "page-module__E0kJGG__personDetails",
  "personName": "page-module__E0kJGG__personName",
  "prev": "page-module__E0kJGG__prev",
  "right": "page-module__E0kJGG__right",
  "selectCurrency": "page-module__E0kJGG__selectCurrency",
  "signupLink": "page-module__E0kJGG__signupLink",
  "signupText": "page-module__E0kJGG__signupText",
  "singleLine": "page-module__E0kJGG__singleLine",
  "statviewers": "page-module__E0kJGG__statviewers",
  "subtitle": "page-module__E0kJGG__subtitle",
  "subtitleAligned": "page-module__E0kJGG__subtitleAligned",
  "time": "page-module__E0kJGG__time",
});
}}),
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}}),
"[externals]/axios [external] (axios, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/react-secure-storage [external] (react-secure-storage, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react-secure-storage", () => require("react-secure-storage"));

module.exports = mod;
}}),
"[project]/app/[lang]/components/CGU_Vyft_content_fr.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const CGU_Vyft_content_fr = `
# Conditions Générales d'Utilisation (CGU) - Vyft

**Dernière mise à jour : 08 août 2025**

Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation des services proposés par **Vyft**, une "néobanque" (terme utilisé à titre indicatif, Vyft n'étant pas encore agréé par l'Autorité de Contrôle Prudentiel et de Résolution - ACPR) exploitée par **Vylte-Finuka SARL**, une société enregistrée en France au 60 Rue François 1er, 75008 Paris, SIRET : 92978865100016. En utilisant nos services, vous acceptez sans réserve ces CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.

Vyft est une marque déposée de Vylte-Finuka SARL. La carte de débit Vyft slide est co-brandée avec **Visa**, une marque déposée de Visa Inc. Le design de la carte Vyft slide est protégé par les droits de propriété intellectuelle.

## 1. Définitions
- **Client** : Toute personne physique ayant souscrit à un compte Vyft.
- **Compte** : Portefeuille auto-géré basé sur l'actif EURC du réseau Avalanche, accessible via l'application Vyft.
- **Services** : Services financiers numériques proposés par Vyft, incluant la carte de débit Vyft slide, les virements SEPA via MetaMask, et les fonctionnalités futures (assurances, trading, cashback).
- **Application** : Application mobile Vyft, disponible sur iOS et Android.
- **EURC** : Actif numérique basé sur le réseau Avalanche, utilisé comme base pour le compte Vyft.
- **MetaMask** : Marque déposée de ConsenSys, utilisée pour effectuer des virements SEPA.

## 2. Objet
Les présentes CGU définissent les droits et obligations des parties dans le cadre de l'utilisation des services de Vyft, une plateforme en phase bêta proposant un portefeuille auto-géré basé sur l'actif EURC du réseau Avalanche, une carte de débit co-brandée Visa, et des services financiers numériques.

## 3. Éligibilité
Pour ouvrir un compte, le client doit :
- Être résident dans l'un des pays de la zone CEMEA (Communauté des États d'Afrique Centrale) et autres territoires africains, DOM-TOM français, Madagascar, ou l'Espace Économique Européen (EEE).
- Être âgé d'au moins 18 ans, ou d'au moins 16 ans avec une autorisation parentale écrite pour les mineurs.
- Disposer d'un smartphone compatible avec l'application Vyft.

**Note :** Seuls les clients résidant dans l'EEE peuvent recevoir une carte Vyft slide physique. Les résidents des autres zones éligibles ont accès uniquement à

En raison de la phase bêta de Vyft, **aucune vérification KYC (Know Your Customer)** n'est actuellement requise pour l'ouverture de compte ou la création de la carte Vyft slide. Cette politique peut être modifiée à l'avenir.

## 4. Ouverture de Compte
L'ouverture d'un compte se fait exclusivement via l'application mobile Vyft en suivant ces étapes :
1. Téléchargement de l'application et création d'un profil.
2. Acceptation des présentes CGU et de la politique de confidentialité.
3. Validation du compte dans un délai de 24 heures.

Le compte Vyft est un **portefeuille auto-géré** basé sur l'actif EURC du réseau Avalanche. Aucun IBAN intégré n'est fourni pour le moment, mais des IBANs intégrés seront proposés à l'avenir, sous réserve des conditions applicables.

## 5. Services Proposés
### 5.1 Compte Vyft
- Le compte est un portefeuille auto-géré basé sur l'actif EURC du réseau Avalanche.
- Les clients sont entièrement responsables de la gestion et de la sécurité de leurs fonds, Vyft n'étant pas un prestataire de services d'actifs numériques (PSAN) agréé en phase bêta.
- **Avertissement** : En raison de la nature auto-gérée du compte, Vyft n'est pas responsable des mouvements de fonds ou des pertes dues à une mauvaise gestion, des erreurs, ou des incidents techniques.

### 5.2 Carte Vyft slide
- Carte de débit co-brandée Visa, disponible en version virtuelle uniquement en phase bêta.
- Les cartes physiques ne sont pas livrées à domicile pour le moment.
- Les paiements sont effectués via l'actif EURC sur le réseau Avalanche.
- Aucun frais de transaction n'est appliqué en phase bêta.

### 5.3 Virements SEPA
- Les virements SEPA sont effectués via **MetaMask**, une marque déposée de ConsenSys.
- Aucun IBAN intégré n'est fourni en phase bêta. Les virements sont initiés via l'application Vyft et MetaMask.

### 5.4 Services Futurs
Vyft prévoit de proposer à l'avenir :
- Assurances (voyage, achat, etc.).
- Fonctionnalités de trading.
- Programmes de cashback.
Ces services seront soumis à des conditions spécifiques, communiquées ultérieurement.

## 6. Frais et Tarifs
En phase bêta, **aucun frais** n'est appliqué pour l'ouverture de compte, l'utilisation de la carte Vyft slide, ou les virements SEPA. Vyft s'engage à maintenir une transparence totale sur les frais. Une grille tarifaire sera communiquée en cas d'introduction de frais à l'avenir.

## 7. Obligations du Client
Le client s'engage à :
- Fournir des informations exactes lors de l'inscription.
- Sécuriser l'accès à son portefeuille auto-géré et à son application MetaMask.
- Signaler immédiatement tout problème ou suspicion de fraude à support@vylte-finuka.com.
- Respecter les lois européennes et françaises, notamment en matière de lutte contre le blanchiment d'argent.

## 8. Responsabilité de Vyft
En raison de la phase bêta et de l'absence de certification PSAN :
- Vyft n'est pas responsable des pertes de fonds dues à la nature auto-gérée des comptes ou à des incidents techniques.
- Vyft s'engage à garantir les fonds au Fonds de Garantie des Dépôts et de Résolution (FGDR) dans la limite de 100 000 €, conformément à la réglementation européenne, dès que la certification nécessaire sera obtenue.

Vyft n'est pas un courtier fonctionnel à part entière en phase bêta et ne garantit pas la disponibilité continue des services.

## 9. Fermeture de Compte
Le client peut fermer son compte à tout moment en contactant **support@vylte-finuka.com**, sous réserve de solde nul et d'absence de transactions en cours. Vyft se réserve le droit de fermer un compte en cas de :
- Non-respect des CGU.
- Suspicion de fraude ou d'activités illégales.
Un préavis de 30 jours sera envoyé, sauf en cas de fraude.

## 10. Protection des Données
Conformément au Règlement Général sur la Protection des Données (RGPD), les données personnelles des clients sont collectées uniquement pour personnaliser les services Vyft. Ces données sont partagées avec des partenaires de confiance et ne seront jamais vendues à des tiers. Pour plus d'informations, consultez notre **Politique de Confidentialité** sur www.vylte-finuka.com.

## 11. Service Client
Le service client est disponible exclusivement via **support@vylte-finuka.com**. Un délai de réponse peut survenir en raison du volume de demandes. En cas de litige, veuillez contacter le support à la même adresse. Si le litige n'est pas résolu, les clients peuvent saisir les autorités compétentes.

## 12. Modification des CGU
Vyft se réserve le droit de modifier les CGU en cas de nécessité, notamment pour se conformer aux lois européennes et françaises ou pour intégrer de nouvelles fonctionnalités. Les clients seront informés par e-mail ou notification in-app au moins 30 jours avant l'entrée en vigueur des modifications. En cas de désaccord, le client peut fermer son compte sans frais.

## 13. Non-Respect des CGU
En cas de non-respect des présentes CGU, Vyft se réserve le droit de prendre des mesures judiciaires, y compris la suspension ou la fermeture du compte.

## 14. Loi Applicable et Juridiction
Les présentes CGU sont régies par le droit français et les réglementations européennes applicables. Tout litige sera soumis aux tribunaux compétents de Paris, sauf disposition légale contraire.

## 15. Contact
**Vylte-Finuka SARL**  
Adresse : 60 Rue François 1er, 75008 Paris, France  
SIRET : 92978865100016  
E-mail : support@vylte-finuka.com  
Site : www.vylte-finuka.com

---

En utilisant les services de Vyft, le client reconnaît avoir lu, compris et accepté ces CGU.
`;
const __TURBOPACK__default__export__ = CGU_Vyft_content_fr;
}}),
"[externals]/react-markdown [external] (react-markdown, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("react-markdown");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/app/[lang]/components/SquareAIFloat.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>SquareAIFloat)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$secure$2d$storage__$5b$external$5d$__$28$react$2d$secure$2d$storage$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react-secure-storage [external] (react-secure-storage, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$CGU_Vyft_content_fr$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/CGU_Vyft_content_fr.ts [ssr] (ecmascript)"); // Assure-toi que ce fichier existe et est exporté
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$markdown__$5b$external$5d$__$28$react$2d$markdown$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-markdown [external] (react-markdown, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$markdown__$5b$external$5d$__$28$react$2d$markdown$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$markdown__$5b$external$5d$__$28$react$2d$markdown$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
"use client";
;
;
;
;
;
;
;
;
// IA via OpenAI API (GPT-4o) via API interne sécurisée
async function callmodelAPI(messages) {
    const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-vyftprogram-api-key": ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO") || ""
        },
        body: JSON.stringify({
            messages
        })
    });
    const data = await res.json();
    return data.reply || "";
}
async function getComptaData(enseigne, squareCustomerId) {
    const res = await fetch(`/api/vyfthealth_proc?enseigne=${encodeURIComponent(enseigne)}&squareCustomerId=${encodeURIComponent(squareCustomerId)}`, {
        headers: {
            "x-vyftprogram-api-key": ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO") || ""
        }
    });
    const data = await res.json();
    if (data.success) {
        // Accès à toutes les métriques
        return data.data; // contient dailySteps, dailyRevenue, monthlyInvestment, upcomingInvoiceAmount, etc.
    } else {
        throw new Error(data.message || "Erreur API");
    }
}
function SquareAIFloat() {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([
        {
            from: "ai",
            text: "Bonjour, je suis Vyft Nérethense, votre agent IA ✨. Comment pourrais-je vous aider avec Vyft ? Posez-moi votre question ou réponse !"
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Ajout pour stocker les infos utilisateur
    const [userInfo, setUserInfo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [denomination, setDenomination] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [squareCustomerId, setsquareCustomerId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [comptaData, setComptaData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [cgvu, setCgvu] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Récupération des infos utilisateur depuis Auth0 (comme dans reports.tsx)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchUserInfo = async ()=>{
            try {
                const userToken = __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$secure$2d$storage__$5b$external$5d$__$28$react$2d$secure$2d$storage$2c$__cjs$29$__["default"].getItem("userToken");
                if (!userToken) return;
                // Récupérer les infos utilisateur depuis Auth0
                const userInfoResponse = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const userId = userInfoResponse.data.sub;
                // Récupérer les métadonnées utilisateur (enseigne et squareCustomerId)
                const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json"
                    }
                });
                setDenomination(response.data?.user_metadata?.denomination?.trim() || null);
                setsquareCustomerId(response.data?.user_metadata?.subid?.trim() || null);
                // Fusionne app_metadata dans userInfo
                setUserInfo({
                    ...userInfoResponse.data,
                    app_metadata: response.data?.app_metadata || {}
                });
            } catch (error) {
                setDenomination(null);
                setsquareCustomerId(null);
                setUserInfo(null);
            }
        };
        fetchUserInfo();
    }, []);
    // Scroll automatique vers le bas uniquement lors de la génération (loading)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (loading && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "auto",
                block: "end"
            });
        }
    }, [
        loading
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Dès que l'utilisateur est identifié, on charge les données de marcheurs
        if (denomination && squareCustomerId) {
            getComptaData(denomination, squareCustomerId).then(setComptaData).catch(()=>setComptaData(null));
        }
    }, [
        denomination,
        squareCustomerId
    ]);
    // Précharge le contenu CGVU depuis la page CGVU (via le script JSON du DOM)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // On tente de trouver le script JSON sur la page CGVU (si déjà chargé)
        function tryLoadCGVUFromDOM() {
            const script = document.getElementById("vyft-cgvu-json");
            if (script) {
                try {
                    const data = JSON.parse(script.textContent || "{}");
                    if (data.cgvu) setCgvu(data.cgvu);
                } catch (e) {
                // ignore
                }
            }
        }
        // Si déjà sur la page CGVU, on charge tout de suite
        tryLoadCGVUFromDOM();
        // Sinon, on précharge la page CGVU en arrière-plan et on extrait le JSON
        if (!cgvu) {
            fetch("/conditions-generales-d-utilisation").then((res)=>res.text()).then((html)=>{
                // Extraction du contenu du script JSON
                const match = html.match(/<script[^>]*id=["']vyft-cgvu-json["'][^>]*>([\s\S]*?)<\/script>/);
                if (match && match[1]) {
                    try {
                        const data = JSON.parse(match[1]);
                        if (data.cgvu) setCgvu(data.cgvu);
                    } catch (e) {
                    // ignore
                    }
                }
            });
        }
    }, []);
    async function sendMessage() {
        if (!input.trim()) return;
        const userMessage = {
            from: "user",
            text: input
        };
        setMessages((msgs)=>[
                ...msgs,
                userMessage
            ]);
        setLoading(true);
        setInput("");
        // Commande spéciale /compta
        if (input.trim().toLowerCase() === "/compta") {
            if (!comptaData) {
                setMessages((msgs)=>[
                        ...msgs,
                        {
                            from: "ai",
                            text: "Impossible de récupérer vos informations de compte."
                        }
                    ]);
                setLoading(false);
                return;
            }
            const topUser = comptaData.influence?.topUsers?.[0]?.name || "Aucun";
            const influenceWeek = comptaData.influence?.week ?? 0;
            const influenceMonth = comptaData.influence?.month ?? 0;
            setMessages((msgs)=>[
                    ...msgs,
                    {
                        from: "ai",
                        text: `Comptabilité :\n` + `- Pas aujourd'hui : ${comptaData.dailySteps}\n` + `- Distance : ${comptaData.dailyDistance} km\n` + `- Profit aujourd'hui : ${comptaData.dailyRevenue} €\n` + `- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €\n` + `- Marcheur le plus fidèle : ${topUser}\n` + `- Influence cette semaine : ${influenceWeek} marcheur(s) unique(s)\n` + `- Influence ce mois : ${influenceMonth} marcheur(s) unique(s)\n`
                    }
                ]);
            setLoading(false);
            return;
        }
        function formatDateFr(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        }
        // Préparation du contexte enrichi pour l'IA
        let context = "";
        context = `Tu es Vyft Nérethense, l’unique agente IA de support pour Vyft. ` + `Ta mission est d'aider, d'accompagner et de répondre à toutes les questions des utilisateurs concernant l'utilisation de Vyft, les problèmes techniques, la FAQ, la sécurité, la gestion de compte, l'accès aux services, et toute demande d'assistance. ` + `Tu es empathique, claire, pédagogique et toujours orientée solution. ` + `Ne donne jamais de conseils business ou marketing, concentre-toi sur le support et l'aide utilisateur. ` + `Si la question concerne une fonctionnalité, un bug, une procédure, une sécurité, une inscription, une connexion, une facture, une CGU ou une FAQ, réponds précisément et propose des solutions ou des étapes à suivre. ` + `Si tu n'as pas la réponse exacte, propose une démarche ou invite à contacter le support humain. ` + `Ne réponds jamais "je ne sais pas", propose toujours une aide ou une orientation.\n\n`;
        if (cgvu) {
            context += "\n\nVoici les Conditions Générales de Vente et d’Utilisation (CGVU) de Vyft Program, à utiliser pour toute question juridique ou d’utilisation :\n" + cgvu + "\n\n";
        }
        context += "\n\nVoici les Conditions Générales d'Utilisation (CGU) officielles de Vyft :\n" + __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$CGU_Vyft_content_fr$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"] + "\n\n";
        if (userInfo) {
            context += `\n\nVoici les informations sur l'utilisateur actuel :\n` + `- Nom : ${userInfo.name || ""}\n` + `- Prénom : ${userInfo.given_name || ""}\n` + `- Nom de famille : ${userInfo.family_name || ""}\n` + `- Surnom : ${userInfo.nickname || ""}\n` + `- Email : ${userInfo.email || ""}\n`;
        }
        context += "\n\nInformation importante : Émmerick Tocny est le fondateur de Vylte-finuka et de l’écosystème Vyft.\n";
        const reply = await callmodelAPI([
            {
                from: "user",
                text: context + input
            },
            ...messages
        ]);
        if (reply && reply.trim() !== "") {
            setMessages((msgs)=>[
                    ...msgs,
                    {
                        from: "ai",
                        text: reply
                    }
                ]);
        }
        setLoading(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 9999,
            background: "#23272e",
            borderRadius: 18,
            boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
            padding: 28,
            minWidth: 320,
            maxWidth: 400,
            border: "1px solid #353a40",
            display: "flex",
            flexDirection: "column",
            transition: "height 0.7s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s",
            height: open ? "500px" : "90px",
            overflow: "hidden",
            cursor: "pointer"
        },
        onClick: ()=>setOpen((v)=>!v),
        className: "jsx-1c380e0a5c273610" + " " + (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bodyonwhite || ""),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                },
                className: "jsx-1c380e0a5c273610",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: "rgba(0,0,0,0.07)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            color: "#1a7f6b",
                            fontSize: 18,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                            letterSpacing: 1
                        },
                        className: "jsx-1c380e0a5c273610",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 18,
                                color: "#1a7f6b"
                            },
                            className: "jsx-1c380e0a5c273610",
                            children: "NE"
                        }, void 0, false, {
                            fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        style: {
                            color: "#1a7f6b",
                            fontSize: 20,
                            margin: 0,
                            fontWeight: 600,
                            letterSpacing: 0.5
                        },
                        className: "jsx-1c380e0a5c273610",
                        children: "Vyft Nérethense (Beta) ✨"
                    }, void 0, false, {
                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        style: {
                            marginLeft: "auto",
                            color: "#444",
                            fontSize: 18,
                            fontWeight: 500,
                            transition: "transform 0.3s",
                            transform: open ? "rotate(90deg)" : "rotate(0deg)"
                        },
                        className: "jsx-1c380e0a5c273610",
                        children: "▸"
                    }, void 0, false, {
                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.5s",
                    marginTop: open ? 18 : 0,
                    height: open ? "auto" : 0,
                    pointerEvents: open ? "auto" : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    flex: 1
                },
                onClick: (e)=>e.stopPropagation(),
                className: "jsx-1c380e0a5c273610",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            flex: 1,
                            overflowY: "auto",
                            scrollBehavior: "smooth",
                            maxHeight: 340
                        },
                        className: "jsx-1c380e0a5c273610",
                        children: [
                            messages.map((msg, idx)=>{
                                // Si c'est le dernier message IA, on affiche avec l'effet d'écriture
                                if (msg.from === "ai" && idx === messages.length - 1 && !loading) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Bubble, {
                                        from: msg.from,
                                        text: "",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(TypingText, {
                                            text: msg.text
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                            lineNumber: 353,
                                            columnNumber: 19
                                        }, this)
                                    }, idx, false, {
                                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                        lineNumber: 352,
                                        columnNumber: 17
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Bubble, {
                                    from: msg.from,
                                    text: msg.text
                                }, idx, false, {
                                    fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                    lineNumber: 357,
                                    columnNumber: 20
                                }, this);
                            }),
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginTop: 12
                                },
                                className: "jsx-1c380e0a5c273610",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            background: "rgba(0,0,0,0.07)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            color: "#1a7f6b",
                                            fontSize: 15,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                            letterSpacing: 1
                                        },
                                        className: "jsx-1c380e0a5c273610",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 13,
                                                color: "#1a7f6b"
                                            },
                                            className: "jsx-1c380e0a5c273610",
                                            children: "NE"
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                            lineNumber: 384,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                        lineNumber: 368,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(TypingBubble, {}, void 0, false, {
                                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                        lineNumber: 386,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                ref: messagesEndRef,
                                className: "jsx-1c380e0a5c273610"
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        style: {
                            display: "flex",
                            gap: 8,
                            marginTop: 8,
                            marginBottom: 0
                        },
                        onSubmit: (e)=>{
                            e.preventDefault();
                            sendMessage();
                        },
                        className: "jsx-1c380e0a5c273610",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                placeholder: "Votre question...",
                                style: {
                                    flex: 1,
                                    borderRadius: 12,
                                    border: "1px solid #e0dbdd",
                                    padding: "8px 12px",
                                    fontSize: 15,
                                    fontWeight: 500,
                                    background: "rgba(255,255,255,0.18)",
                                    color: "#fff",
                                    outline: "none",
                                    transition: "background 0.2s, color 0.2s"
                                },
                                disabled: loading,
                                className: "jsx-1c380e0a5c273610"
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "submit",
                                style: {
                                    borderRadius: 12,
                                    border: "none",
                                    background: "#1a7f6b",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    padding: "8px 18px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    transition: "opacity 0.2s"
                                },
                                disabled: loading,
                                className: "jsx-1c380e0a5c273610",
                                children: "Envoyer"
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "1c380e0a5c273610",
                children: "@keyframes dotBounce{0%,80%,to{transform:translateY(0)}40%{transform:translateY(-8px)}}.vyft-markdown h1,.vyft-markdown h2,.vyft-markdown h3{color:#1a7f6b;margin:10px 0 6px;font-weight:700}.vyft-markdown ul,.vyft-markdown ol{color:#222;margin-left:18px}.vyft-markdown code{color:#c7254e;background:#f5f5f5;border-radius:4px;padding:2px 6px;font-size:14px}.vyft-markdown pre{color:#fff;background:#23272e;border-radius:8px;padding:10px;font-size:13px;overflow-x:auto}.vyft-markdown a{color:#1a7f6b;text-decoration:underline}.vyft-markdown strong{color:#1a7f6b;font-weight:700}.vyft-markdown em{color:#1a7f6b;font-style:italic}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 256,
        columnNumber: 5
    }, this);
}
// Ajoute ce composant pour l'effet d'écriture lettre par lettre
function TypingText({ text }) {
    const [displayed, setDisplayed] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const index = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setDisplayed("");
        index.current = 0;
        if (!text) return;
        const interval = setInterval(()=>{
            setDisplayed((prev)=>prev + text[index.current]);
            index.current++;
            if (index.current >= text.length) clearInterval(interval);
        }, 18); // Vitesse d'écriture (ms)
        return ()=>clearInterval(interval);
    }, [
        text
    ]);
    // Utilise un div pour appliquer la classe vyft-markdown pendant la génération
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "vyft-markdown",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$markdown__$5b$external$5d$__$28$react$2d$markdown$2c$__esm_import$29$__["default"], {
            children: displayed
        }, void 0, false, {
            fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
            lineNumber: 515,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 514,
        columnNumber: 5
    }, this);
}
// Modifie Bubble pour accepter des enfants (children)
function Bubble({ from, text, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            alignSelf: from === "user" ? "flex-end" : "flex-start",
            background: from === "ai" ? "#e0dbdd" : "rgba(255,255,255,0.10)",
            color: from === "ai" ? "#222" : "#f5f6fa",
            borderRadius: 12,
            padding: "10px 16px",
            maxWidth: "80%",
            fontSize: 15,
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            transition: "transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)",
            transform: "translateY(0)",
            border: from === "ai" ? "none" : "1px solid #353a40",
            wordBreak: "break-word"
        },
        children: children ? children : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$markdown__$5b$external$5d$__$28$react$2d$markdown$2c$__esm_import$29$__["default"], {
            components: {
                strong: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                        style: {
                            color: "#1a7f6b",
                            fontWeight: 700,
                            background: "rgba(26,127,107,0.08)",
                            padding: "0 2px",
                            borderRadius: "3px"
                        },
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                        lineNumber: 552,
                        columnNumber: 15
                    }, void 0)
            },
            children: text
        }, void 0, false, {
            fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
            lineNumber: 549,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 531,
        columnNumber: 5
    }, this);
}
function TypingBubble() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            background: "rgba(0,0,0,0.07)",
            borderRadius: 12,
            padding: "6px 14px",
            minWidth: 60,
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 15,
            color: "#444",
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            letterSpacing: 0.5
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                style: {
                    marginRight: 6
                },
                children: "Écrit..."
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 590,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(TypingDots, {}, void 0, false, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 591,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 574,
        columnNumber: 5
    }, this);
}
function TypingDots() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        style: {
            display: "inline-block",
            minWidth: 24
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Dot, {
                delay: 0
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 599,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Dot, {
                delay: 0.2
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Dot, {
                delay: 0.4
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 601,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 598,
        columnNumber: 5
    }, this);
}
function Dot({ delay }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        style: {
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#1a7f6b",
            margin: "0 2px",
            animation: `dotBounce 1s infinite`,
            animationDelay: `${delay}s`,
            verticalAlign: "middle"
        }
    }, void 0, false, {
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 608,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/[lang]/components/Footer1.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Navbar.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$SquareAIFloat$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/SquareAIFloat.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$SquareAIFloat$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$SquareAIFloat$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
"use client";
;
;
;
;
;
const Footer = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params?.lang === "fr-FR" ? "fr-FR" : "en-EN";
    const t = {
        "fr-FR": {
            cgu: "Conditions Générales d'Utilisation",
            copyright: "© 2025 - Vylte-finuka SARL, Tous droits réservés."
        },
        "en-EN": {
            cgu: "Terms of Use",
            copyright: "© 2025 - Vylte-finuka SARL, All rights reserved."
        }
    }[locale];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].links,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: `/${locale}/conditions-generales-d-utilisation`,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle3,
                    children: t.cgu
                }, void 0, false, {
                    fileName: "[project]/app/[lang]/components/Footer1.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/Footer1.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].copyright,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fontstyle2,
                    children: t.copyright
                }, void 0, false, {
                    fileName: "[project]/app/[lang]/components/Footer1.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/Footer1.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$SquareAIFloat$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/[lang]/components/Footer1.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[lang]/components/Footer1.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Footer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

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
"[externals]/@reown/appkit-universal-connector [external] (@reown/appkit-universal-connector, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("@reown/appkit-universal-connector");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/app/[lang]/components/config/walletconnect.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// config.ts ou walletconfig.ts
__turbopack_context__.s({
    "getUniversalConnector": (()=>getUniversalConnector),
    "projectId": (()=>projectId),
    "sluraCharene": (()=>sluraCharene)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reown$2f$appkit$2d$universal$2d$connector__$5b$external$5d$__$2840$reown$2f$appkit$2d$universal$2d$connector$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@reown/appkit-universal-connector [external] (@reown/appkit-universal-connector, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reown$2f$appkit$2d$universal$2d$connector__$5b$external$5d$__$2840$reown$2f$appkit$2d$universal$2d$connector$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$reown$2f$appkit$2d$universal$2d$connector__$5b$external$5d$__$2840$reown$2f$appkit$2d$universal$2d$connector$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
const projectId = "3dc309f3ebac775983d3ff51213bea14";
const sluraCharene = {
    id: 45057,
    chainNamespace: 'eip155',
    caipNetworkId: 'eip155:45057',
    name: 'Slura devnet',
    nativeCurrency: {
        name: 'Vyft Enhancing ZER',
        symbol: 'VEZ',
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                'https://4ea9-168-253-182-87.ngrok-free.app'
            ]
        },
        public: {
            http: [
                'https://4ea9-168-253-182-87.ngrok-free.app'
            ]
        }
    },
    blockExplorers: {
        default: {
            name: 'SluraScan',
            url: 'https://explorer-testnet.slura.network'
        }
    },
    // Logo du réseau (affiché dans la liste des chaînes du wallet)
    iconUrls: [
        "https://raw.githubusercontent.com/vylte-finuka/Slura/refs/heads/master/crates/vuc-platform/src/asset/Slura.png"
    ],
    contracts: {}
};
async function getUniversalConnector() {
    const universalConnector = await __TURBOPACK__imported__module__$5b$externals$5d2f40$reown$2f$appkit$2d$universal$2d$connector__$5b$external$5d$__$2840$reown$2f$appkit$2d$universal$2d$connector$2c$__esm_import$29$__["UniversalConnector"].init({
        projectId,
        metadata: {
            name: 'Vyft Slura',
            description: 'Vyft: La néobanque à la vertu de la finance.',
            url: 'https://www.vylte-finuka.com/fr-FR/ecosystem/vyft-slura',
            // Icône de l'application (affichée dans le modal WalletConnect et signatures)
            icons: [
                '/Slura.png',
                "https://raw.githubusercontent.com/vylte-finuka/Slura/refs/heads/master/crates/vuc-platform/src/asset/Slura.png" // fallback GitHub
            ]
        },
        networks: [
            {
                methods: [
                    'eth_sendTransaction',
                    'personal_sign',
                    'eth_signTypedData_v4',
                    'wallet_switchEthereumChain',
                    'wallet_addEthereumChain',
                    'wallet_watchAsset' // ← obligatoire pour pouvoir ajouter VEZ après
                ],
                chains: [
                    sluraCharene
                ],
                events: [
                    'chainChanged',
                    'accountsChanged'
                ],
                namespace: 'eip155'
            }
        ]
    });
    return universalConnector;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/[lang]/ecosystem/vyft-slura.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>Vyftslide)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Navbar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Footer1$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Footer1.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/config/walletconnect.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Footer1$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Footer1$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
"use client";
;
;
;
;
;
;
;
function Vyftslide() {
    const [showBackground, setShowBackground] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [universalConnector, setUniversalConnector] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [account, setAccount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isAddingToken, setIsAddingToken] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const lang = router.query.lang;
    const locale = lang === "fr-FR" ? "fr-FR" : "en-EN";
    const t = {
        "fr-FR": {
            title: "Vyft: La néobanque à la vertu de la finance. - Vyft slura",
            h1: "La première couche de niveau 1 (layer 1) au monde à s'ouvrir à de nouvelle infrastructure jamais faite jusqu'à là.",
            h2a: "Spécialisée pour le cloud computing à la téléphonie et RWA et partage des traits caractéristiques de Solana comme eBPF, parallélisme et s'apparente aux zkEVM pour le moteur d'exécution de contrat, il utilise le VEZ (Vyft Enhancing ZER(ZETA Erion)) comme jeton de frais et gouvernance en tant que stablecoin et tout ça en Europe.",
            h2b: "Le testnet de Slura: Charène est disponible en cliquant pour ajouter le réseau sur le widget !",
            connect: "Connecter le portefeuille",
            connecting: "Connexion en cours...",
            disconnect: "Déconnecter",
            addToken: "Ajouter le token VEZ",
            adding: "Ajout du token..."
        },
        "en-EN": {
            title: "Vyft: The neobank with the virtue of finance. - Vyft slura",
            h1: "First world layer 1 for open to the news infrastructures.",
            h2a: "Specialized in **cloud computing** for **telephony** and **RWA** (Real World Assets), this project leverages technologies similar to **Solana**—such as **eBPF**, high parallelism, and a design akin to **zkEVM** for its smart contract execution engine. It uses the **VEZ** (Vyft Enhancing ZER / ZETA Erion) as its utility token for transaction fees and governance, functioning as a **stablecoin**, and operates entirely in **Europe**.",
            h2b: "The Slura testnet, named Charène, is now live! Click to add the network via the widget.",
            connect: "Connect Wallet",
            connecting: "Connecting...",
            disconnect: "Disconnect",
            addToken: "Add VEZ Token",
            adding: "Adding token..."
        }
    }[locale];
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getUniversalConnector"])().then((connector)=>{
            setUniversalConnector(connector);
            if (connector?.provider?.session) {
                setSession(connector.provider.session);
                const wcAccount = connector.provider.session.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || null;
                if (wcAccount) setAccount(wcAccount);
            }
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        "TURBOPACK unreachable";
        const tryAutoConnect = undefined;
        const handleAccountsChanged = undefined;
        const handleChainChanged = undefined;
    }, []);
    const handleConnect = async ()=>{
        if (isConnecting) return;
        setIsConnecting(true);
        try {
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            if (universalConnector) {
                const { session: newSession } = await universalConnector.connect();
                setSession(newSession);
                const wcAccount = newSession?.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || null;
                setAccount(wcAccount);
            }
        } catch (err) {
            console.error("Échec connexion :", err);
        } finally{
            setIsConnecting(false);
        }
    };
    const handleDisconnect = async ()=>{
        try {
            if (universalConnector && session && universalConnector.provider?.session) {
                await universalConnector.disconnect();
                setSession(null);
            }
            setAccount(null);
        } catch (err) {
            console.error("Erreur déconnexion :", err);
        }
    };
    const ensureWCConnected = async ()=>{
        if (!universalConnector) throw new Error("Connector non initialisé");
        if (!session || !universalConnector.provider?.session) {
            console.log("Pas de session active → appel connect()");
            const { session: newSession } = await universalConnector.connect();
            setSession(newSession);
            const wcAccount = newSession?.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || null;
            if (wcAccount) setAccount(wcAccount);
        }
        if (!universalConnector.provider) {
            throw new Error("Provider toujours non prêt après connect()");
        }
        return universalConnector.provider;
    };
    // Fonction dédiée : AJOUT UNIQUEMENT DU TOKEN VEZ (natif)
    const addVezToken = async ()=>{
        if (isAddingToken) return;
        setIsAddingToken(true);
        try {
            // Params pour watchAsset avec adresse officielle du natif
            const watchParams = {
                type: 'ERC20',
                options: {
                    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    symbol: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sluraCharene"].nativeCurrency.symbol,
                    decimals: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sluraCharene"].nativeCurrency.decimals,
                    name: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sluraCharene"].nativeCurrency.name,
                    image: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$config$2f$walletconnect$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sluraCharene"].iconUrls?.[0] // Logo du réseau (ou fallback)
                     || '/Slura.png' // Fichier local public/
                }
            };
            // Flux injected (MetaMask, Rabby, etc.)
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            // Flux WalletConnect
            if (!session && !account) {
                alert("Connectez-vous d'abord à un portefeuille.");
                return;
            }
            const provider = await ensureWCConnected();
            await provider.request({
                method: 'wallet_watchAsset',
                params: watchParams
            });
            alert("Token VEZ ajouté avec succès !");
        } catch (error) {
            if (error.code === 4001) {
                alert("Ajout du token annulé.");
            } else {
                console.error("Erreur ajout token VEZ :", error);
                alert(`Erreur : ${error.message || "Vérifiez la console"}`);
            }
        } finally{
            setIsAddingToken(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.title = t.title;
    }, [
        t.title
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>setShowBackground(true), 2000);
        return ()=>clearTimeout(timer);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container3,
            children: [
                showBackground && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("video", {
                    className: "bgvideo",
                    src: "/Sluracover.mp4",
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    playsInline: true,
                    style: {
                        position: "absolute",
                        top: -80,
                        left: -730,
                        width: "180%",
                        height: "180%",
                        objectFit: "cover",
                        zIndex: 0,
                        pointerEvents: "none"
                    }
                }, void 0, false, {
                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                    lineNumber: 207,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        position: "relative",
                        zIndex: 1,
                        width: "100%"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].main,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headerX2,
                                    children: t.h1
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].body,
                                    children: t.h2a
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 232,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].body,
                                    children: t.h2b
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        margin: "32px 0",
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px",
                                        alignItems: "center"
                                    },
                                    children: account || session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "16px",
                                                    color: "#ddd"
                                                },
                                                children: [
                                                    "Connecté : ",
                                                    account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "via WalletConnect"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                                lineNumber: 238,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleDisconnect,
                                                style: {
                                                    padding: "12px 32px",
                                                    fontSize: "16px",
                                                    background: "#333",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: "pointer"
                                                },
                                                children: t.disconnect
                                            }, void 0, false, {
                                                fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                                lineNumber: 244,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: addVezToken,
                                                disabled: isAddingToken,
                                                style: {
                                                    padding: "12px 32px",
                                                    fontSize: "16px",
                                                    background: "#00cc66",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: isAddingToken ? "not-allowed" : "pointer",
                                                    opacity: isAddingToken ? 0.7 : 1
                                                },
                                                children: isAddingToken ? t.adding : t.addToken
                                            }, void 0, false, {
                                                fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                                lineNumber: 259,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleConnect,
                                        disabled: isConnecting,
                                        style: {
                                            padding: "16px 48px",
                                            fontSize: "18px",
                                            background: "#000",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            cursor: isConnecting ? "not-allowed" : "pointer",
                                            opacity: isConnecting ? 0.7 : 1,
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
                                        },
                                        children: isConnecting ? t.connecting : t.connect
                                    }, void 0, false, {
                                        fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                        lineNumber: 277,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bodyattract
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Footer1$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                            lineNumber: 300,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
            lineNumber: 205,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__14abc21b._.js.map