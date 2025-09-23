module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/pdfkit [external] (pdfkit, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("pdfkit", () => require("pdfkit"));

module.exports = mod;
}}),
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
"[project]/pages/api/generateReport.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdfkit__$5b$external$5d$__$28$pdfkit$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/pdfkit [external] (pdfkit, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
const config = {
    api: {
        bodyParser: {
            sizeLimit: "2mb"
        }
    }
};
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
async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).end("Method Not Allowed");
        return;
    }
    const { label, companyName, period, data, influenceHistory = [], chartImage = "", influenceChartImage = "", topUsersChartImage = "" } = req.body;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=vyft-program-report-${label}-${period}.pdf`);
    const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$pdfkit__$5b$external$5d$__$28$pdfkit$2c$__cjs$29$__["default"]({
        size: "A4",
        margin: 32
    });
    doc.pipe(res);
    // --- PAGE 1 : Titre, entreprise, période, grille influence ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#DBDFE0");
    // Logo Vyft
    try {
        const logoPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "Vyft_program.png");
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 90, 32, {
                width: 180,
                height: 80
            });
        }
    } catch (e) {}
    doc.moveDown(3);
    doc.fillColor("#1a7f6b").fontSize(28).font("Helvetica-Bold").text(`Rapport ${label === "hebdomadaire" ? "hebdomadaire" : label === "mensuel" ? "mensuel" : label}`, {
        align: "center"
    });
    doc.moveDown(0.5);
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#1a7f6b").text(companyName || "Vyft", {
        align: "center"
    });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor("#222").font("Helvetica").text(`Période : ${period}`, {
        align: "center"
    });
    doc.moveDown(1);
    // Section Influence & bénéfice estimé
    doc.roundedRect(32, doc.y, doc.page.width - 64, 140, 18).fill("#fff");
    doc.fillColor("#444444").fontSize(18).font("Helvetica-Bold").text("Influence & bénéfice estimé (800 derniers jours)", 48, doc.y - 130);
    doc.moveDown(0.5);
    // Légende influence
    doc.fontSize(10).fillColor("#222").text("Faible", 48, doc.y);
    let x = 90;
    themeColors.forEach((color)=>{
        doc.rect(x, doc.y - 8, 18, 10).fill(color);
        x += 22;
    });
    doc.fontSize(10).fillColor("#222").text("Forte influence", x, doc.y - 2);
    // Grille influence
    doc.moveDown(2);
    doc.fontSize(12).fillColor("#222").text("Grille influence :");
    const gridData = Array(800).fill(0).map((_, i)=>{
        const date = influenceHistory[i]?.date || "";
        const count = influenceHistory[i]?.count || 0;
        return {
            count,
            date
        };
    });
    const max = Math.max(...gridData.map((g)=>g.count), 1);
    let gridX = 48;
    let gridY = doc.y;
    const nbCols = 32;
    const nbRows = 25;
    const cellSize = 10;
    for(let row = 0; row < nbRows; row++){
        for(let col = 0; col < nbCols; col++){
            const idx = row * nbCols + col;
            const cell = gridData[idx];
            doc.rect(gridX + col * cellSize, gridY + row * cellSize, cellSize - 1, cellSize - 1).fill(getInfluenceColor(cell.count, max));
        }
    }
    doc.moveDown(3);
    // Résumé des indicateurs
    doc.fontSize(16).fillColor("#222").font("Helvetica-Bold").text("Résumé des indicateurs :", {
        align: "left"
    });
    doc.fontSize(14).font("Helvetica").list([
        `Total des pas : ${data?.totalSteps ?? 0}`,
        `Distance totale : ${data?.totalDistance ?? 0} km`,
        `Revenu estimé : ${data?.totalRevenue ?? 0} €`,
        `Croissance : ${data?.growth ?? "0 %"}`
    ]);
    doc.text(`Page 1 / 3`, doc.page.width / 2 - 30, doc.page.height - 40, {
        align: "center"
    });
    doc.addPage();
    // --- PAGE 2 : Graphiques ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#DBDFE0");
    doc.fontSize(22).fillColor("#1a7f6b").font("Helvetica-Bold").text("Profit de marché", {
        align: "center"
    });
    doc.moveDown();
    doc.roundedRect(32, doc.y, doc.page.width - 64, 120, 18).fill("#fff");
    doc.fontSize(14).fillColor("#222").font("Helvetica").text(chartImage ? "Graphique inclus dans la version PDF React." : "Graphique non inclus dans ce PDF (API Next.js, pas d'image).", 48, doc.y - 110);
    doc.moveDown(2);
    doc.fontSize(22).fillColor("#1a7f6b").font("Helvetica-Bold").text("Influence", {
        align: "center"
    });
    doc.moveDown();
    doc.roundedRect(32, doc.y, doc.page.width - 64, 120, 18).fill("#fff");
    doc.fontSize(14).fillColor("#222").font("Helvetica").text(influenceChartImage ? "Graphique inclus dans la version PDF React." : "Graphique non inclus dans ce PDF (API Next.js, pas d'image).", 48, doc.y - 110);
    doc.text(`Page 2 / 3`, doc.page.width / 2 - 30, doc.page.height - 40, {
        align: "center"
    });
    doc.addPage();
    // --- PAGE 3 : Top clients ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#DBDFE0");
    doc.fontSize(22).fillColor("#1a7f6b").font("Helvetica-Bold").text("Clients fréquents", {
        align: "center"
    });
    doc.moveDown();
    doc.roundedRect(32, doc.y, doc.page.width - 64, 220, 18).fill("#fff");
    doc.fontSize(14).fillColor("#222").font("Helvetica").text(topUsersChartImage ? "Graphique inclus dans la version PDF React." : "Graphique non inclus dans ce PDF (API Next.js, pas d'image).", 48, doc.y - 210);
    doc.moveDown(2);
    doc.fontSize(14).fillColor("#222").font("Helvetica").text("Pour plus de détails, consultez l'application Vyft.", {
        align: "center"
    });
    doc.text(`Page 3 / 3`, doc.page.width / 2 - 30, doc.page.height - 40, {
        align: "center"
    });
    doc.end();
}
}}),
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
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/generateReport.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$generateReport$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/generateReport.ts [api] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$generateReport$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$generateReport$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/generateReport",
        pathname: "/api/generateReport",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$generateReport$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__f042dae3._.js.map