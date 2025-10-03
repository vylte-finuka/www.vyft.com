module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/square [external] (square, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("square", () => require("square"));

module.exports = mod;
}}),
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
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/pages/api/vyfthealth_proc.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Vyfthealth_proc)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$square__$5b$external$5d$__$28$square$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/square [external] (square, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/lib/mongodb.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$square__$5b$external$5d$__$28$square$2c$__cjs$29$__["SquareClient"]({
    environment: __TURBOPACK__imported__module__$5b$externals$5d2f$square__$5b$external$5d$__$28$square$2c$__cjs$29$__["SquareEnvironment"].Production,
    token: process.env.SQUARE_ACCESS_TOKEN
});
/**
 * Envoie les métriques calculées à Square via une commande.
 *
 * @param squareCustomerId - Identifiant du client Square
 * @param incrementalValue - Valeur incrémentale calculée
 */ async function sendMetricsToSquare(squareCustomerId, incrementalValue) {
    try {
        const locationId = process.env.SQUARE_LOCATION_ID;
        if (!locationId) throw new Error("SQUARE_LOCATION_ID manquant");
        const order = await client.orders.create({
            idempotencyKey: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
            order: {
                locationId,
                customerId: squareCustomerId,
                lineItems: [
                    {
                        name: "Métrique Vyft",
                        quantity: "1",
                        basePriceMoney: {
                            amount: BigInt(Math.round(incrementalValue * 100)),
                            currency: "EUR"
                        }
                    }
                ]
            }
        });
        console.log("Commande Square créée :", order.order?.id);
        return order;
    } catch (error) {
        console.error("Erreur lors de l'envoi des métriques à Square :", error.message);
        throw error;
    }
}
async function Vyfthealth_proc(req, res) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    // Vérification de la clé API
    const apiKey = req.headers["x-vyftprogram-api-key"];
    if (apiKey !== ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO")) {
        return res.status(401).json({
            success: false,
            message: "Clé API invalide ou manquante."
        });
    }
    if (req.method === "GET") {
        try {
            const { enseigne: enseigneFilter, squareCustomerId } = req.query;
            if (!enseigneFilter || typeof enseigneFilter !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Le paramètre 'enseigne' est requis pour accéder aux données."
                });
            }
            if (!squareCustomerId || typeof squareCustomerId !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Le paramètre 'squareCustomerId' est requis pour envoyer les métriques à Square."
                });
            }
            const mongoClient = await __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"];
            const db = mongoClient.db("vyfbase");
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
                const date = new Date(item.date);
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
            // Récupérer les commandes Square pour le client
            let ordersPager = await client.orders.search({
                locationIds: [
                    process.env.SQUARE_LOCATION_ID ?? ""
                ],
                query: {
                    filter: {
                        customerFilter: {
                            customerIds: [
                                squareCustomerId
                            ]
                        },
                        stateFilter: {
                            states: [
                                "COMPLETED"
                            ]
                        }
                    }
                }
            });
            let orders = [];
            if (ordersPager.orders && Array.isArray(ordersPager.orders)) {
                orders = ordersPager.orders;
            }
            const totalRevenue = orders.reduce((sum, order)=>{
                if (order.state === "COMPLETED") {
                    const amount = order.lineItems?.reduce((acc, li)=>{
                        return acc + (li.basePriceMoney?.amount ? Number(li.basePriceMoney.amount) / 100 : 0);
                    }, 0) ?? 0;
                    return sum + amount;
                }
                return sum;
            }, 0);
            // Filtrer les commandes du mois en cours POUR LE CLIENT
            const nowDate = new Date();
            const startOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
            const monthlyInvestment = orders.reduce((sum, order)=>{
                const paidAt = order.createdAt ? new Date(order.createdAt) : null;
                if (order.state === "COMPLETED" && paidAt && paidAt >= startOfMonth && paidAt <= nowDate) {
                    const amount = order.lineItems?.reduce((acc, li)=>{
                        return acc + (li.basePriceMoney?.amount ? Number(li.basePriceMoney.amount) / 100 : 0);
                    }, 0) ?? 0;
                    return sum + amount;
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
                if ((!lastProcessedId || currentEntryId !== lastProcessedId) && !lastEntry.processed) {
                    const lastSteps = lastEntry.steps || 0;
                    const lastDistance = parseFloat(lastEntry.distance) || 0;
                    const incrementalSteps = lastSteps * 0.3;
                    const incrementalDistance = lastDistance * 0.3;
                    const incrementalValue = Math.round(incrementalSteps + incrementalDistance);
                    await sendMetricsToSquare(squareCustomerId, incrementalValue);
                    console.log("Nouvelle entrée détectée. Valeur incrémentale envoyée à Square :", incrementalValue);
                    lastProcessedId = currentEntryId;
                    await collection.updateOne({
                        _id: lastEntry._id
                    }, {
                        $set: {
                            processed: true
                        }
                    });
                    console.log("Entrée marquée comme traitée dans MongoDB :", currentEntryId);
                } else {
                    console.log("Aucune nouvelle entrée détectée ou entrée déjà traitée. Valeur reste à 0.");
                    await sendMetricsToSquare(squareCustomerId, 0);
                }
            } else {
                console.log("Aucune entrée trouvée dans la base de données. Valeur réinitialisée à 0.");
                await sendMetricsToSquare(squareCustomerId, 0);
            }
            // Calcul dynamique du prix du mètre selon la moyenne réelle
            const count = sensorData.length;
            const totalDistanceForAvg = sensorData.reduce((sum, item)=>sum + (parseFloat(item.distance) || 0), 0);
            const avgDistance = count > 0 ? totalDistanceForAvg / count : 0;
            const BASE_METER_PRICE = 0.10;
            const REFERENCE_AVG_DISTANCE = 1000;
            let GLOBAL_METER_PRICE = avgDistance > 0 ? BASE_METER_PRICE * (avgDistance / REFERENCE_AVG_DISTANCE) : BASE_METER_PRICE;
            // Prix du stepmeter (Square, à adapter selon votre logique produit)
            const GLOBAL_STEP_PRICE = 0.05; // exemple fixe
            // Historique des métriques pour le calcul de la moyenne et de la croissance
            const metricsHistory = await collection.aggregate([
                {
                    $match: {
                        enseigne: {
                            $regex: `^${enseigneFilter.trim()}$`,
                            $options: "i"
                        }
                    }
                },
                {
                    $addFields: {
                        dateObj: {
                            $cond: [
                                {
                                    $eq: [
                                        {
                                            $type: "$date"
                                        },
                                        "date"
                                    ]
                                },
                                "$date",
                                {
                                    $toDate: "$date"
                                }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$dateObj"
                            },
                            month: {
                                $month: "$dateObj"
                            },
                            day: {
                                $dayOfMonth: "$dateObj"
                            }
                        },
                        date: {
                            $first: "$dateObj"
                        },
                        dailySteps: {
                            $sum: "$steps"
                        },
                        dailyDistance: {
                            $sum: {
                                $toDouble: "$distance"
                            }
                        }
                    }
                },
                {
                    $sort: {
                        date: -1
                    }
                },
                {
                    $limit: 7
                }
            ]).toArray();
            const metricsHistoryWithRevenue = metricsHistory.map((h)=>{
                const steps = h.dailySteps || 0;
                const distance = h.dailyDistance || 0;
                const dailyRevenue = steps * GLOBAL_STEP_PRICE + distance * GLOBAL_METER_PRICE;
                return {
                    date: h.date,
                    dailySteps: h.dailySteps,
                    dailyDistance: h.dailyDistance,
                    dailyRevenue: Number(dailyRevenue.toFixed(2))
                };
            });
            // Récupérer les 14 derniers jours pour comparer 7 derniers jours vs 7 jours précédents
            const metrics14Days = await collection.find({
                enseigne: {
                    $regex: `^${enseigneFilter.trim()}$`,
                    $options: "i"
                }
            }).sort({
                date: -1
            }).limit(14).toArray();
            const dailyRevenues14 = metrics14Days.map((h)=>{
                const steps = h.steps || 0;
                const distance = parseFloat(h.distance) || 0;
                return steps * GLOBAL_STEP_PRICE + distance * GLOBAL_METER_PRICE;
            });
            const sumLast7 = dailyRevenues14.slice(0, 7).reduce((sum, v)=>sum + v, 0);
            const sumPrev7 = dailyRevenues14.slice(7, 14).reduce((sum, v)=>sum + v, 0);
            let growth = "0 %";
            if (sumPrev7 > 0) {
                const percent = (sumLast7 - sumPrev7) / sumPrev7 * 100;
                growth = (percent > 0 ? "+" : "") + percent.toFixed(2) + " %";
            } else if (sumLast7 > 0) {
                growth = "+∞ %";
            } else {
                growth = "0 %";
            }
            const avgRevenue = dailyRevenues14.slice(0, 7).length > 0 ? (dailyRevenues14.slice(0, 7).reduce((sum, v)=>sum + v, 0) / dailyRevenues14.slice(0, 7).length).toFixed(2) : "0";
            const dailyRevenue = dailyRevenues14.length > 0 ? dailyRevenues14[0].toFixed(2) : "0";
            // Influence : nombre de marcheurs uniques (par nom) pour différentes périodes
            const nowTime = new Date();
            const startOfDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
            const startOfWeek = new Date(nowTime);
            startOfWeek.setDate(nowTime.getDate() - 6);
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonthForInfluence = new Date(nowTime.getFullYear(), nowTime.getMonth(), 1);
            const startOfYear = new Date(nowTime.getFullYear(), 0, 1);
            async function countUnique(from) {
                if (!enseigneFilter || typeof enseigneFilter !== "string") {
                    return 0;
                }
                const match = {
                    enseigne: {
                        $regex: `^${enseigneFilter.trim()}$`,
                        $options: "i"
                    }
                };
                if (from) match.date = {
                    $gte: from.toISOString()
                };
                const result = await collection.aggregate([
                    {
                        $match: match
                    },
                    {
                        $group: {
                            _id: "$name"
                        }
                    },
                    {
                        $count: "count"
                    }
                ]).toArray();
                return result[0]?.count || 0;
            }
            const [influenceDay, influenceWeek, influenceMonth, influenceYear, influenceAll] = await Promise.all([
                countUnique(startOfDay),
                countUnique(startOfWeek),
                countUnique(startOfMonthForInfluence),
                countUnique(startOfYear),
                countUnique(null)
            ]);
            // Historique 7 derniers jours (jour par jour)
            const influenceHistory7Days = [];
            for(let i = 6; i >= 0; i--){
                const day = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - i);
                const nextDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - i + 1);
                const users = await collection.distinct("name", {
                    enseigne: {
                        $regex: `^${enseigneFilter.trim()}$`,
                        $options: "i"
                    },
                    date: {
                        $gte: day.toISOString(),
                        $lt: nextDay.toISOString()
                    }
                });
                influenceHistory7Days.push({
                    date: day.toISOString(),
                    count: users.length,
                    users
                });
            }
            // Historique du mois courant (jour par jour)
            const influenceHistoryMonth = [];
            const daysInMonth = new Date(nowTime.getFullYear(), nowTime.getMonth() + 1, 0).getDate();
            for(let i = 1; i <= daysInMonth; i++){
                const day = new Date(nowTime.getFullYear(), nowTime.getMonth(), i);
                const nextDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), i + 1);
                const users = await collection.distinct("name", {
                    enseigne: {
                        $regex: `^${enseigneFilter.trim()}$`,
                        $options: "i"
                    },
                    date: {
                        $gte: day.toISOString(),
                        $lt: nextDay.toISOString()
                    }
                });
                influenceHistoryMonth.push({
                    date: day.toISOString(),
                    count: users.length,
                    users
                });
            }
            // Historique de l'année courante (mois par mois)
            const influenceHistoryYear = [];
            for(let m = 0; m < 12; m++){
                const monthStart = new Date(nowTime.getFullYear(), m, 1);
                const monthEnd = new Date(nowTime.getFullYear(), m + 1, 1);
                const count = await collection.distinct("name", {
                    enseigne: {
                        $regex: `^${enseigneFilter.trim()}$`,
                        $options: "i"
                    },
                    date: {
                        $gte: monthStart.toISOString(),
                        $lt: monthEnd.toISOString()
                    }
                });
                influenceHistoryYear.push({
                    month: monthStart.toLocaleString("fr-FR", {
                        month: "short"
                    }),
                    count: count.length
                });
            }
            // Top users (par nombre de participations)
            const topUsersAgg = await collection.aggregate([
                {
                    $match: {
                        enseigne: {
                            $regex: `^${enseigneFilter.trim()}$`,
                            $options: "i"
                        }
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $limit: 5
                }
            ]).toArray();
            const topUsers = topUsersAgg.map((u)=>({
                    name: u._id,
                    count: u.count
                }));
            res.status(200).json({
                success: true,
                message: "Données calculées et envoyées à Square avec succès.",
                data: {
                    enseigne,
                    yearlySteps,
                    totalDistance,
                    estimatedRevenue: totalRevenue,
                    dailySteps,
                    dailyDistance,
                    dailyRevenue: Number(dailyRevenue),
                    avgRevenue,
                    growth,
                    monthlyInvestment,
                    metricsHistory: metricsHistoryWithRevenue,
                    upcomingInvoiceAmount: 0,
                    influence: {
                        day: influenceDay,
                        week: influenceWeek,
                        month: influenceMonth,
                        year: influenceYear,
                        all: influenceAll,
                        history7Days: influenceHistory7Days,
                        historyMonth: influenceHistoryMonth,
                        historyYear: influenceHistoryYear,
                        topUsers
                    }
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
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/vyfthealth_proc.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$vyfthealth_proc$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/vyfthealth_proc.ts [api] (ecmascript)");
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
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__86cf88f9._.js.map