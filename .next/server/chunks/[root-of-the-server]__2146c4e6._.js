module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

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
"[project]/pages/api/push-notification-sender.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>pushnot)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/lib/mongodb.ts [api] (ecmascript)");
;
async function pushnot(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    // Vérification de la clé API
    const apiKey = req.headers["x-vyftprogram-api-key"];
    if (apiKey !== ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO")) {
        return res.status(401).json({
            success: false,
            message: "Clé API invalide ou manquante."
        });
    }
    if (req.method === "GET") {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId manquant."
            });
        }
        const mongoClient = await __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"];
        const db = mongoClient.db("vyfbase");
        // Récupère les notifications où le user est destinataire
        const notifications = await db.collection("vyft_notifi").find({
            recipients: {
                $in: [
                    userId
                ]
            }
        }).sort({
            createdAt: -1
        }).limit(20).toArray();
        return res.status(200).json({
            success: true,
            notifications
        });
    }
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Méthode non autorisée"
        });
    }
    const { userToken, title, message } = req.body;
    if (!userToken || !title || !message) {
        return res.status(400).json({
            success: false,
            message: "Paramètres manquants."
        });
    }
    // Récupère tous les utilisateurs avec un userId
    const mongoClient = await __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"];
    const db = mongoClient.db("vyfbase");
    const users = await db.collection("tokpushnot").find({
        userId: {
            $exists: true
        }
    }).toArray();
    // Stocke la notification dans vyft_notifi pour tous les utilisateurs
    await db.collection("vyft_notifi").insertOne({
        title,
        message,
        createdAt: new Date(),
        sentBy: "admin",
        recipients: users.map((u)=>u.userId) // <-- Utilise le bon identifiant
    });
    return res.status(200).json({
        success: true,
        message: "Notification enregistrée pour tous les utilisateurs."
    });
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
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/push-notification-sender.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$push$2d$notification$2d$sender$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/push-notification-sender.ts [api] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$push$2d$notification$2d$sender$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$push$2d$notification$2d$sender$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/push-notification-sender",
        pathname: "/api/push-notification-sender",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$push$2d$notification$2d$sender$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__2146c4e6._.js.map