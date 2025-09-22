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
"[project]/pages/api/create-or-retrieve-customer.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>createOrRetriveCustomer)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/stripe [external] (stripe, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
const stripe = new __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__["default"]("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", {
    apiVersion: "2025-04-30.basil"
});
async function createOrRetriveCustomer(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", [
            "POST"
        ]);
        return res.status(405).json({
            error: "Méthode non autorisée"
        });
    }
    const { auth0UserId, userToken, action, customerId } = req.body;
    if (!auth0UserId || !userToken || !action) {
        console.error("Paramètres manquants :", {
            auth0UserId,
            userToken,
            action
        });
        return res.status(400).json({
            error: "Tous les champs requis (auth0UserId, userToken, action) doivent être fournis."
        });
    }
    try {
        if (action === "create") {
            console.log("Création ou récupération d'un client Stripe...");
            // Vérifier si le client Stripe existe déjà via les métadonnées
            const customers = await stripe.customers.list({
                limit: 100
            });
            let customer = customers.data.find((c)=>c.metadata?.auth0UserId === auth0UserId);
            if (customer) {
                console.log("Client Stripe existant trouvé :", customer.id);
            } else {
                // Créer un nouveau client Stripe si aucun n'existe
                customer = await stripe.customers.create({
                    metadata: {
                        auth0UserId
                    }
                });
                console.log("Nouveau client Stripe créé :", customer.id);
            }
            // Mettre à jour les métadonnées utilisateur dans Auth0 avec le customerId
            const auth0Domain = ("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com");
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            const auth0Response = await fetch(`${auth0Domain}/api/v2/users/${auth0UserId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    user_metadata: {
                        subid: customer.id
                    }
                })
            });
            if (!auth0Response.ok) {
                console.error("Erreur lors de la mise à jour des métadonnées utilisateur dans Auth0 :", await auth0Response.text());
                throw new Error("Erreur lors de la mise à jour des métadonnées utilisateur dans Auth0.");
            }
            console.log("Mise à jour des métadonnées utilisateur dans Auth0 réussie.");
            // Créer une session Stripe Checkout
            const session = await stripe.checkout.sessions.create({
                payment_method_types: [
                    "card"
                ],
                mode: "subscription",
                customer: customer.id,
                line_items: [
                    {
                        price: "price_1RhCTRGdfgLieo7O9P3P0Fx4"
                    }
                ],
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cancel`
            });
            if (!session || !session.id) {
                console.error("Erreur : session Stripe Checkout non créée.");
                return res.status(500).json({
                    error: "Erreur lors de la création de la session Stripe Checkout."
                });
            }
            console.log("Session Stripe Checkout créée :", session.id);
            // Après la création de la session Stripe Checkout
            return res.status(200).json({
                sessionId: session.id,
                customerId: customer.id,
                url: session.url
            });
        } else if (action === "unsubscribe") {
            console.log("Annulation d'un abonnement Stripe...");
            try {
                // Récupérer les abonnements actifs du client
                const subscriptions = await stripe.subscriptions.list({
                    customer: customerId,
                    status: "active",
                    limit: 1
                });
                if (subscriptions.data.length === 0) {
                    console.error("Aucun abonnement actif trouvé pour ce client.");
                    return res.status(404).json({
                        error: "Aucun abonnement actif trouvé pour ce client."
                    });
                }
                const subscriptionId = subscriptions.data[0].id;
                // Annuler l'abonnement
                const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);
                console.log("Abonnement annulé :", deletedSubscription.id);
                return res.status(200).json({
                    success: true,
                    message: "Abonnement annulé avec succès.",
                    deletedSubscription
                });
            } catch (error) {
                console.error("Erreur lors de l'annulation de l'abonnement :", error.message || error);
                return res.status(500).json({
                    error: "Erreur lors de l'annulation de l'abonnement Stripe."
                });
            }
        } else {
            console.error("Action non valide :", action);
            return res.status(400).json({
                error: "Action non valide. Utilisez 'create' ou 'unsubscribe'."
            });
        }
    } catch (error) {
        console.error("Erreur Stripe ou Auth0 :", error.message || error);
        return res.status(500).json({
            error: "Erreur lors de la gestion de l'abonnement ou des métadonnées Auth0."
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
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/create-or-retrieve-customer.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$create$2d$or$2d$retrieve$2d$customer$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/create-or-retrieve-customer.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$create$2d$or$2d$retrieve$2d$customer$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$create$2d$or$2d$retrieve$2d$customer$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$create$2d$or$2d$retrieve$2d$customer$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$create$2d$or$2d$retrieve$2d$customer$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/create-or-retrieve-customer",
        pathname: "/api/create-or-retrieve-customer",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$create$2d$or$2d$retrieve$2d$customer$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__43693dbf._.js.map