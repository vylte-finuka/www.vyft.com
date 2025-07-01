module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/stripe [external] (stripe, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("stripe");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/mongodb [external] (mongodb, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}}),
"[project]/pages/api/lib/mongodb.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
const uri = process.env.MONGODB_URI || ''; // Assurez-vous que l'URI est défini dans .env
const options = {};
if (!process.env.MONGODB_URI) {
    throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI');
}
// Créez une connexion MongoDB pour la production
const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
const clientPromise = client.connect();
const __TURBOPACK__default__export__ = clientPromise;
}}),
"[project]/pages/api/vyfthealth_proc.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>Vyfthealth_proc)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/stripe [external] (stripe, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/lib/mongodb.ts [api] (ecmascript)"); // Import pour accéder à MongoDB
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
const stripe = new __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__["default"]("sk_test_51OlpeQDrg8ui7gWs1DDcKWe98MhDQaHoZwCEAzFQwumnXm5BL2MicQD2eN3UC4h9iDn0dca9VMxF4eVfvKfmvSnp00oaEldISy", {
    apiVersion: "2025-04-30.basil"
});
// Stocker les métriques précédentes pour éviter les envois redondants
let previousMetrics = {
    totalDistance: 0,
    dailySteps: 0,
    dailyRevenue: 0,
    accumulatedValue: 0
};
/**
 * Envoie les métriques calculées à Stripe via un événement de facturation.
 *
 * @param stripeCustomerId - Identifiant du client Stripe
 * @param incrementalValue - Valeur incrémentale calculée
 */ async function sendMetricsToStripe(stripeCustomerId, incrementalValue) {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const meterEvent = await stripe.billing.meterEvents.create({
            event_name: "meterstep",
            timestamp,
            payload: {
                stripe_customer_id: stripeCustomerId,
                value: Math.round(incrementalValue).toString()
            }
        });
        console.log("Meter Event envoyé à Stripe :", meterEvent);
        return meterEvent;
    } catch (error) {
        console.error("Erreur lors de l'envoi des métriques à Stripe :", error.message);
        throw error;
    }
}
async function Vyfthealth_proc(req, res) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    if (req.method === "GET") {
        try {
            const { enseigne: enseigneFilter, stripeCustomerId } = req.query;
            if (!enseigneFilter || typeof enseigneFilter !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Le paramètre 'enseigne' est requis pour accéder aux données."
                });
            }
            if (!stripeCustomerId || typeof stripeCustomerId !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Le paramètre 'stripeCustomerId' est requis pour envoyer les métriques à Stripe."
                });
            }
            const client = await __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"];
            const db = client.db("vyfbase");
            const collection = db.collection("vyfthealth");
            const sensorData = await collection.find({
                enseigne: {
                    $regex: `^${enseigneFilter.trim()}$`,
                    $options: "i"
                }
            }).toArray();
            if (sensorData.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Aucune donnée trouvée pour l'enseigne "${enseigneFilter}".`
                });
            }
            let dailySteps = 0;
            let dailyDistance = 0;
            let yearlySteps = 0;
            let totalDistance = 0;
            let enseigne = "";
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            sensorData.forEach((item)=>{
                const steps = item.steps || 0;
                const distance = parseFloat(item.distance) || 0;
                const date = new Date(item.date); // Utilisation de "date" au lieu de "timestamp"
                if (date >= oneYearAgo) {
                    yearlySteps += steps;
                    totalDistance += distance;
                }
                if (date >= twentyFourHoursAgo) {
                    dailySteps += steps;
                    dailyDistance += distance;
                }
                if (item.enseigne) {
                    enseigne = item.enseigne;
                }
            });
            const charges = await stripe.charges.list({
                limit: 100
            });
            const totalRevenue = charges.data.reduce((sum, charge)=>{
                if (charge.paid && !charge.refunded) {
                    return sum + charge.amount / 100;
                }
                return sum;
            }, 0);
            const dailyRevenue = charges.data.reduce((sum, charge)=>{
                const chargeDate = new Date(charge.created * 1000);
                if (charge.paid && !charge.refunded && chargeDate >= twentyFourHoursAgo) {
                    return sum + charge.amount / 100;
                }
                return sum;
            }, 0);
            // Stocker l'identifiant de la dernière entrée traitée
            let lastProcessedId = null;
            // Récupérer dans MongoDB les dernières entrées pour l'enseigne
            const lastEntries = await collection.find({
                enseigne: {
                    $regex: `^${enseigneFilter.trim()}$`,
                    $options: "i"
                }
            }).sort({
                date: -1
            }).limit(1).toArray();
            const lastEntry = lastEntries[0];
            // Vérifier si une nouvelle entrée est détectée
            if (lastEntry) {
                const currentEntryId = lastEntry._id.toString();
                const entryDate = new Date(lastEntry.date); // Convertir la date de l'entrée en objet Date
                const now = new Date(); // Obtenir la date et l'heure actuelles
                // Vérifier si cette entrée est différente de la dernière traitée et non marquée comme traitée
                if ((!lastProcessedId || currentEntryId !== lastProcessedId) && !lastEntry.processed) {
                    const lastSteps = lastEntry.steps || 0;
                    const lastDistance = parseFloat(lastEntry.distance) || 0;
                    // Calculer les valeurs incrémentales basées sur les dernières entrées
                    const incrementalSteps = lastSteps * 0.3; // Ratio de 30 % sur les steps
                    const incrementalDistance = lastDistance * 0.3; // Ratio de 30 % sur la distance
                    // Calculer la valeur incrémentale totale
                    const incrementalValue = Math.round(incrementalSteps + incrementalDistance);
                    // Envoyer les métriques calculées à Stripe
                    await sendMetricsToStripe(stripeCustomerId, incrementalValue);
                    console.log("Nouvelle entrée détectée. Valeur incrémentale envoyée à Stripe :", incrementalValue);
                    // Mettre à jour l'identifiant de la dernière entrée traitée
                    lastProcessedId = currentEntryId;
                    // Marquer l'entrée comme traitée dans MongoDB
                    await collection.updateOne({
                        _id: lastEntry._id
                    }, {
                        $set: {
                            processed: true
                        }
                    });
                    console.log("Entrée marquée comme traitée dans MongoDB :", currentEntryId);
                } else {
                    // Si l'entrée est la même que la dernière traitée ou déjà marquée comme traitée
                    console.log("Aucune nouvelle entrée détectée ou entrée déjà traitée. Valeur reste à 0.");
                    await sendMetricsToStripe(stripeCustomerId, 0); // Envoyer 0 à Stripe
                }
            } else {
                // Si aucune entrée n'existe dans la base de données, envoyer 0 à Stripe
                console.log("Aucune entrée trouvée dans la base de données. Valeur réinitialisée à 0.");
                await sendMetricsToStripe(stripeCustomerId, 0); // Envoyer 0 à Stripe
            }
            res.status(200).json({
                success: true,
                message: "Données calculées et envoyées à Stripe avec succès.",
                data: {
                    enseigne,
                    yearlySteps,
                    totalDistance,
                    estimatedRevenue: totalRevenue,
                    dailySteps,
                    dailyDistance,
                    dailyRevenue
                }
            });
        } catch (error) {
            console.error("Erreur lors du calcul des données :", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors du calcul des données."
            });
        }
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
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/vyfthealth_proc.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/vyfthealth_proc.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/vyfthealth_proc",
        pathname: "/api/vyfthealth_proc",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5f5365cf._.js.map