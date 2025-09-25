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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Fonction pour télécharger le PDF généré côté serveur via l'API reportgen
async function downloadServerPDF(report, companyName) {
    const API_KEY = ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO");
    const res = await fetch("/api/reportgen", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-vyftprogram-api-key": API_KEY || ""
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
    _s();
    const [companyName, setCompanyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportsList.useEffect": ()=>{
            const fetchCompany = {
                "ReportsList.useEffect.fetchCompany": async ()=>{
                    try {
                        const userToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("userToken");
                        if (!userToken) return;
                        // Récupérer les infos utilisateur depuis Auth0
                        const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const userId = userInfoResponse.data.sub;
                        // Récupérer les métadonnées utilisateur (enseigne)
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/api/v2/users/${userId}`, {
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
                }
            }["ReportsList.useEffect.fetchCompany"];
            fetchCompany();
        }
    }["ReportsList.useEffect"], []);
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
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                style: {
                    listStyle: "none",
                    padding: 0
                },
                children: reports.map((report, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
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
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
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
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                        style: {
                                            fontSize: 14,
                                            margin: "4px 0 0 0",
                                            color: "#222"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "Entreprise :"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/reportsList.tsx",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            report.companyName || companyName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/administration/reportsList.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>downloadServerPDF(report, companyName),
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
                                title: "Télécharger le rapport",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/nav_down.png",
                                    alt: "Télécharger PDF",
                                    style: {
                                        width: 28,
                                        height: 28
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/administration/reportsList.tsx",
                                    lineNumber: 185,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/administration/reportsList.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/pages/administration/reportsList.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/administration/reportsList.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/reportsList.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_s(ReportsList, "FNIUdpvZR6kPCvZNmeAopgLq8Dc=");
_c = ReportsList;
var _c;
__turbopack_context__.k.register(_c, "ReportsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/administration/reportsList.tsx [client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/pages/administration/reportsList.tsx [client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=pages_administration_reportsList_tsx_64b6057f._.js.map