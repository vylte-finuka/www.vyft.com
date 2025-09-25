module.exports = {

"[project]/pages/administration/reportsList.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>ReportsList)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$secure$2d$storage__$5b$external$5d$__$28$react$2d$secure$2d$storage$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react-secure-storage [external] (react-secure-storage, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
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
                lineNumber: 113,
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
                                        lineNumber: 133,
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
                                        lineNumber: 145,
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/administration/reportsList.tsx [ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/pages/administration/reportsList.tsx [ssr] (ecmascript)"));
}}),

};

//# sourceMappingURL=pages_administration_reportsList_tsx_c6785901._.js.map