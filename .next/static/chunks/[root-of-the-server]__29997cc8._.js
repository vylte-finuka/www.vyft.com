(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/app/components/Navbar.module.css [client] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "ActionEbutton": "Navbar-module__pSp8Ga__ActionEbutton",
  "copyright": "Navbar-module__pSp8Ga__copyright",
  "fontstyle": "Navbar-module__pSp8Ga__fontstyle",
  "fontstyle1": "Navbar-module__pSp8Ga__fontstyle1",
  "fontstyle2": "Navbar-module__pSp8Ga__fontstyle2",
  "fontstyle3": "Navbar-module__pSp8Ga__fontstyle3",
  "footer": "Navbar-module__pSp8Ga__footer",
  "links": "Navbar-module__pSp8Ga__links",
  "logo": "Navbar-module__pSp8Ga__logo",
  "navLinks": "Navbar-module__pSp8Ga__navLinks",
  "navbar": "Navbar-module__pSp8Ga__navbar",
  "open": "Navbar-module__pSp8Ga__open",
  "subMenu": "Navbar-module__pSp8Ga__subMenu",
  "subSubMenu": "Navbar-module__pSp8Ga__subSubMenu",
});
}}),
"[project]/app/components/AuthGuard.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)"); // Importer usePathname pour obtenir la route actuelle
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthGuard = ({ children })=>{
    _s();
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true); // État pour bloquer le rendu pendant la vérification
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])(); // Obtenir la route actuelle
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthGuard.useEffect": ()=>{
            const checkAuthentication = {
                "AuthGuard.useEffect.checkAuthentication": ()=>{
                    // Exclure la route /conditions-generals-de-vente de la vérification
                    if (pathname === "/conditions-generales-de-vente") {
                        setIsLoading(false); // Ne pas bloquer le rendu pour cette route
                        return;
                    }
                    const userToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("userToken");
                    const isLoggedIn = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("isLoggedIn");
                    if (!userToken || !isLoggedIn) {
                        console.error("Utilisateur non authentifié. Redirection vers /login.");
                        setTimeout({
                            "AuthGuard.useEffect.checkAuthentication": ()=>{
                                if (pathname !== "/conditions-generals-de-vente") {
                                    router.push("/login"); // Rediriger vers /login après 4 millisecondes
                                }
                            }
                        }["AuthGuard.useEffect.checkAuthentication"], 4);
                    } else {
                        setIsAuthenticated(true); // L'utilisateur est authentifié
                    }
                    setIsLoading(false); // La vérification est terminée
                }
            }["AuthGuard.useEffect.checkAuthentication"];
            checkAuthentication();
        }
    }["AuthGuard.useEffect"], [
        router,
        pathname
    ]);
    if (isLoading) {
        return null; // Bloquer le rendu tant que la vérification n'est pas terminée
    }
    if (!isAuthenticated && pathname !== "/conditions-generals-de-vente") {
        return null; // Ne rien rendre si l'utilisateur n'est pas authentifié et que ce n'est pas une route exclue
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
};
_s(AuthGuard, "Qrx71DZmC5IY+44Ed9wnRa+5k5s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthGuard;
const __TURBOPACK__default__export__ = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/Navbar.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* eslint-disable @next/next/no-sync-scripts */ __turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/Navbar.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$AuthGuard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/AuthGuard.tsx [client] (ecmascript)"); // Importer AuthGuard
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const Navbar = ()=>{
    _s();
    const [isSubMenuOpen, setIsSubMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSubSubMenuOpen, setIsSubSubMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profilePicture, setProfilePicture] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null); // État pour stocker la photo de profil
    const [userSub, setUserSub] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null); // État pour stocker le sub (identifiant utilisateur)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false); // État pour le sous-menu du profil
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const fetchUserInfo = {
                "Navbar.useEffect.fetchUserInfo": async ()=>{
                    try {
                        // Récupérer le jeton utilisateur depuis secureLocalStorage
                        const userToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("userToken");
                        if (!userToken) {
                            console.error("User token not found in secureLocalStorage");
                            return;
                        }
                        // Appeler /userinfo pour obtenir les informations utilisateur
                        const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        });
                        const userInfo = userInfoResponse.data;
                        // Extraire le sub et la photo de profil
                        setUserSub(userInfo.sub);
                        setProfilePicture(userInfo.picture);
                    } catch (err) {
                        console.error("Erreur lors de la récupération des informations utilisateur :", err);
                    }
                }
            }["Navbar.useEffect.fetchUserInfo"];
            fetchUserInfo();
        }
    }["Navbar.useEffect"], []);
    const handleLogout = ()=>{
        try {
            // Supprimer toutes les données utilisateur de secureLocalStorage
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].clear(); // Efface toutes les clés stockées dans secureLocalStorage
            // Supprimer également les données de localStorage si elles y sont stockées
            localStorage.removeItem("userToken");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("picture");
            // Rediriger vers le lien de déconnexion Auth0
            window.location.href = `${"TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com"}/v2/logout?client_id=${"TURBOPACK compile-time value", "gnSYOUhQHV9hCZdKfNqIS7AoCgyRqv5C"}&returnTo=${window.location.origin}`;
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$AuthGuard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].Navbar,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            legacyBehavior: true,
                            href: "/",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/vyft_program.png",
                                    alt: "Vyftprogram",
                                    width: 166,
                                    height: 74,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo,
                                    onContextMenu: (e)=>e.preventDefault(),
                                    onDragStart: (e)=>e.preventDefault()
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Navbar.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                            src: "https://raw.githubusercontent.com/SjomaNikitin/image-download-blocker/main/ImageBlocker.js"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 88,
                            columnNumber: 18
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Navbar.tsx",
                    lineNumber: 75,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navLinks,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                    children: "Administration"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/administration/main-management",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Gestion principale"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 95,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/administration/reports",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Rapports"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 96,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/administration/settings",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Paramètres"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 97,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                    children: "Évènements"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/events/statistics",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Statistiques"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/events/management",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Management"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 106,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                    children: "Gestion des risques"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/risk-management/accounting",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Comptabilité"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 114,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/risk-management/cashback",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Cashback"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 115,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                    children: "Règlementations"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/regulations/aml",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "AML"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 123,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/regulations/kyc",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "KYC"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/regulations/pci-dss",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "PCI-DSS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 125,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].profileContainer,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ActionEbutton,
                                    style: {
                                        backgroundImage: profilePicture ? `url(${profilePicture})` : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    },
                                    onClick: ()=>setIsProfileMenuOpen(!isProfileMenuOpen)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isProfileMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ""}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                                children: "Mon Profil"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Navbar.tsx",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 141,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            onClick: handleLogout,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                                            children: "Déconnexion"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Navbar.tsx",
                                            lineNumber: 144,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Navbar.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Navbar.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Navbar.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Navbar.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Navbar.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
};
_s(Navbar, "IxyQ+Czw7MZh2KkpDGOy+Erdmu0=");
_c = Navbar;
const __TURBOPACK__default__export__ = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/page.module.css [client] (css module)": ((__turbopack_context__) => {

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
  "content": "page-module__E0kJGG__content",
  "date": "page-module__E0kJGG__date",
  "description": "page-module__E0kJGG__description",
  "emoji": "page-module__E0kJGG__emoji",
  "form": "page-module__E0kJGG__form",
  "formGroup": "page-module__E0kJGG__formGroup",
  "grid": "page-module__E0kJGG__grid",
  "header": "page-module__E0kJGG__header",
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
"[project]/app/components/SquareAIFloat.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SquareAIFloat)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
async function getComptaData(enseigne, stripeCustomerId) {
    const res = await fetch(`/api/vyfthealth_proc?enseigne=${encodeURIComponent(enseigne)}&stripeCustomerId=${encodeURIComponent(stripeCustomerId)}`, {
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
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            from: "ai",
            text: "Bonjour, je suis Vyft Nérethense, votre agent IA ✨. Qu'est-ce qui vous préoccupe pour votre business ? Posez-moi votre question ou réponse !"
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Ajout pour stocker les infos utilisateur
    const [denomination, setDenomination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stripeCustomerId, setStripeCustomerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [comptaData, setComptaData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cgvu, setCgvu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Récupération des infos utilisateur depuis Auth0 (comme dans reports.tsx)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
            const fetchUserInfo = {
                "SquareAIFloat.useEffect.fetchUserInfo": async ()=>{
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
                        // Récupérer les métadonnées utilisateur (enseigne et stripeCustomerId)
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/api/v2/users/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        setDenomination(response.data?.user_metadata?.denomination?.trim() || null);
                        setStripeCustomerId(response.data?.user_metadata?.subid?.trim() || null);
                    } catch (error) {
                        setDenomination(null);
                        setStripeCustomerId(null);
                    }
                }
            }["SquareAIFloat.useEffect.fetchUserInfo"];
            fetchUserInfo();
        }
    }["SquareAIFloat.useEffect"], []);
    // Scroll automatique vers le bas uniquement lors de la génération (loading)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
            if (loading && messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: "auto",
                    block: "end"
                });
            }
        }
    }["SquareAIFloat.useEffect"], [
        loading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
            // Dès que l'utilisateur est identifié, on charge les données de marcheurs
            if (denomination && stripeCustomerId) {
                getComptaData(denomination, stripeCustomerId).then(setComptaData).catch({
                    "SquareAIFloat.useEffect": ()=>setComptaData(null)
                }["SquareAIFloat.useEffect"]);
            }
        }
    }["SquareAIFloat.useEffect"], [
        denomination,
        stripeCustomerId
    ]);
    // Précharge le contenu CGVU depuis la page CGVU (via le script JSON du DOM)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
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
                fetch("/conditions-generales-de-vente").then({
                    "SquareAIFloat.useEffect": (res)=>res.text()
                }["SquareAIFloat.useEffect"]).then({
                    "SquareAIFloat.useEffect": (html)=>{
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
                    }
                }["SquareAIFloat.useEffect"]);
            }
        }
    }["SquareAIFloat.useEffect"], []);
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
        if (comptaData) {
            const influence = comptaData.influence || {};
            // Historique par jour (exemple)
            const history7Days = (influence.history7Days || []).map((h)=>`Le ${formatDateFr(h.date)} : ${h.count} marcheur(s) uniques${h.users && h.users.length ? " (" + h.users.join(", ") + ")" : ""}`).join("\n");
            // Historique par mois (si dispo)
            const historyMonth = (influence.historyMonth || []).map((h)=>`Le ${formatDateFr(h.date)} : ${h.count} marcheur(s) uniques${h.users && h.users.length ? " (" + h.users.join(", ") + ")" : ""}`).join("\n");
            // Top marcheurs/mois
            const topUsers = (influence.topUsers || []).map((u, i)=>`${i + 1}. ${u.name} (${u.count} participations)`).join("\n");
            // Jours les plus influents
            const mostInfluentialDay = (influence.history7Days || []).reduce((max, curr)=>curr.count > (max?.count ?? 0) ? curr : max, null);
            const mostInfluentialDayStr = mostInfluentialDay ? `Jour le plus influent : ${formatDateFr(mostInfluentialDay.date)} (${mostInfluentialDay.count} marcheurs uniques)` : "";
            // INSTRUCTION DE ROLE ET D'UTILISATION DES DONNÉES
            context = `Tu es Vyft Nérethense, un assistant IA expert en coaching sportif, marketing et finance bancaire pour les commerces et salles de sport. ` + `Tu dois toujours t'appuyer sur les données suivantes pour répondre, même si la question semble inhabituelle. ` + `Si la question n'est pas claire, propose une analyse, un conseil ou une interprétation basée sur les chiffres, l'activité ou la fidélité des marcheurs. ` + `Ne réponds jamais "je ne sais pas" ou "je ne dispose pas d'informations". ` + `Si la question concerne un jour, un mois ou un nom inconnu, propose une analyse ou une astuce business ou sportive adaptée à la situation.\n\n` + `Voici toutes les données de marche, d'influence, de finance et d'activité :\n` + `- Pas aujourd'hui : ${comptaData.dailySteps}\n` + `- Distance aujourd'hui : ${comptaData.dailyDistance} km\n` + `- Profit aujourd'hui : ${comptaData.dailyRevenue} €\n` + `- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €\n` + `- Top marcheurs du mois :\n${topUsers}\n` + `- Influence aujourd'hui : ${influence.day ?? 0}\n` + `- Influence cette semaine : ${influence.week ?? 0}\n` + `- Influence ce mois : ${influence.month ?? 0}\n` + `- Influence cette année : ${influence.year ?? 0}\n` + `- Influence totale : ${influence.all ?? 0}\n` + `- Historique des 7 derniers jours :\n${history7Days}\n` + (historyMonth ? `- Historique mensuel :\n${historyMonth}\n` : "") + `${mostInfluentialDayStr}\n\n`;
        }
        // Ajoute le CGVU au contexte IA
        if (cgvu) {
            context += "\n\nVoici les Conditions Générales de Vente et d’Utilisation (CGVU) de Vyft Program, à utiliser pour toute question juridique ou d’utilisation :\n" + cgvu + "\n\n";
        }
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        className: "jsx-7d37b0088d58e5a9" + " " + (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite || ""),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                },
                className: "jsx-7d37b0088d58e5a9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        className: "jsx-7d37b0088d58e5a9",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 18,
                                color: "#1a7f6b"
                            },
                            className: "jsx-7d37b0088d58e5a9",
                            children: "NE"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SquareAIFloat.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            color: "#1a7f6b",
                            fontSize: 20,
                            margin: 0,
                            fontWeight: 600,
                            letterSpacing: 0.5
                        },
                        className: "jsx-7d37b0088d58e5a9",
                        children: "Vyft Nérethense (Beta) ✨"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            marginLeft: "auto",
                            color: "#444",
                            fontSize: 18,
                            fontWeight: 500,
                            transition: "transform 0.3s",
                            transform: open ? "rotate(90deg)" : "rotate(0deg)"
                        },
                        className: "jsx-7d37b0088d58e5a9",
                        children: "▸"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                className: "jsx-7d37b0088d58e5a9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            flex: 1,
                            overflowY: "auto",
                            scrollBehavior: "smooth",
                            maxHeight: 340
                        },
                        className: "jsx-7d37b0088d58e5a9",
                        children: [
                            messages.map((msg, idx)=>{
                                // Si c'est le dernier message IA, on affiche avec l'effet d'écriture
                                if (msg.from === "ai" && idx === messages.length - 1 && !loading) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bubble, {
                                        from: msg.from,
                                        text: "",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingText, {
                                            text: msg.text
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/SquareAIFloat.tsx",
                                            lineNumber: 370,
                                            columnNumber: 19
                                        }, this)
                                    }, idx, false, {
                                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bubble, {
                                    from: msg.from,
                                    text: msg.text
                                }, idx, false, {
                                    fileName: "[project]/app/components/SquareAIFloat.tsx",
                                    lineNumber: 374,
                                    columnNumber: 20
                                }, this);
                            }),
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginTop: 12
                                },
                                className: "jsx-7d37b0088d58e5a9",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        className: "jsx-7d37b0088d58e5a9",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 13,
                                                color: "#1a7f6b"
                                            },
                                            className: "jsx-7d37b0088d58e5a9",
                                            children: "NE"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/SquareAIFloat.tsx",
                                            lineNumber: 401,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingBubble, {}, void 0, false, {
                                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                                        lineNumber: 403,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SquareAIFloat.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: messagesEndRef,
                                className: "jsx-7d37b0088d58e5a9"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SquareAIFloat.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 354,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
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
                        className: "jsx-7d37b0088d58e5a9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                className: "jsx-7d37b0088d58e5a9"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SquareAIFloat.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                className: "jsx-7d37b0088d58e5a9",
                                children: "Envoyer"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SquareAIFloat.tsx",
                                lineNumber: 439,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 408,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "7d37b0088d58e5a9",
                children: "@keyframes dotBounce{0%,80%,to{transform:translateY(0)}40%{transform:translateY(-8px)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 273,
        columnNumber: 5
    }, this);
}
_s(SquareAIFloat, "aNd0AuKr0S+KAMBGHRz4gnpoGSs=");
_c = SquareAIFloat;
// Ajoute ce composant pour l'effet d'écriture lettre par lettre
function TypingText({ text }) {
    _s1();
    const [displayed, setDisplayed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TypingText.useEffect": ()=>{
            setDisplayed("");
            index.current = 0;
            if (!text) return;
            const interval = setInterval({
                "TypingText.useEffect.interval": ()=>{
                    setDisplayed({
                        "TypingText.useEffect.interval": (prev)=>prev + text[index.current]
                    }["TypingText.useEffect.interval"]);
                    index.current++;
                    if (index.current >= text.length) clearInterval(interval);
                }
            }["TypingText.useEffect.interval"], 18); // Vitesse d'écriture (ms)
            return ({
                "TypingText.useEffect": ()=>clearInterval(interval)
            })["TypingText.useEffect"];
        }
    }["TypingText.useEffect"], [
        text
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        children: displayed
    }, void 0, false, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 492,
        columnNumber: 10
    }, this);
}
_s1(TypingText, "vX7roFhzDmTMSRT2IyLXRVK/bXA=");
_c1 = TypingText;
// Modifie Bubble pour accepter des enfants (children)
function Bubble({ from, text, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            alignSelf: from === "user" ? "flex-end" : "flex-start",
            // Inversion des couleurs :
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
            border: from === "ai" ? "none" : "1px solid #353a40"
        },
        children: children ? children : text
    }, void 0, false, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 506,
        columnNumber: 5
    }, this);
}
_c2 = Bubble;
function TypingBubble() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    marginRight: 6
                },
                children: "Écrit..."
            }, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 546,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingDots, {}, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 530,
        columnNumber: 5
    }, this);
}
_c3 = TypingBubble;
function TypingDots() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: "inline-block",
            minWidth: 24
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                delay: 0
            }, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 555,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                delay: 0.2
            }, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                delay: 0.4
            }, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 557,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 554,
        columnNumber: 5
    }, this);
}
_c4 = TypingDots;
function Dot({ delay }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 564,
        columnNumber: 5
    }, this);
}
_c5 = Dot;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "SquareAIFloat");
__turbopack_context__.k.register(_c1, "TypingText");
__turbopack_context__.k.register(_c2, "Bubble");
__turbopack_context__.k.register(_c3, "TypingBubble");
__turbopack_context__.k.register(_c4, "TypingDots");
__turbopack_context__.k.register(_c5, "Dot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/Footer.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/Navbar.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SquareAIFloat$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SquareAIFloat.tsx [client] (ecmascript)"); // Ajout de l'import
"use client";
;
;
;
;
const Footer = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].links,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/conditions-generales-de-vente",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                            children: "Conditions Générales de Vente et d'Utilisation"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Footer.tsx",
                        lineNumber: 12,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].copyright,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
                            children: "© 2025 - Vylte-finuka SARL, Tous droits réservés."
                        }, void 0, false, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Footer.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Footer.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SquareAIFloat$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/components/Footer.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            " "
        ]
    }, void 0, true);
};
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/conditions-generales-de-vente.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CGVU)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Navbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Footer.tsx [client] (ecmascript)");
"use client";
;
;
;
;
function CGVU() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Conditions Générales de Vente et d’Utilisation - Vyft Program"
            }, void 0, false, {
                fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                lineNumber: 11,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container2,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                            lineNumber: 14,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhiteX2,
                                    children: "Conditions Générales de Vente et d’Utilisation"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 16,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                                    children: "Dernière mise à jour : 25 septembre 2025"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 17,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "Définitions à connaître"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    style: {
                                        marginBottom: 24
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Vyft Program"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 25,
                                                    columnNumber: 33
                                                }, this),
                                                " : plateforme SaaS de gestion de la relation client (CRM) et d’analyse d’activité physique."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 24,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Utilisateur"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 28,
                                                    columnNumber: 33
                                                }, this),
                                                " : toute personne physique ou morale utilisant Vyft Program."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 27,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Prestataire sécurisé"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 31,
                                                    columnNumber: 33
                                                }, this),
                                                " : service tiers spécialisé et certifié pour la gestion des comptes, abonnements et paiements (ex : Stripe)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 30,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Dénomination"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 34,
                                                    columnNumber: 33
                                                }, this),
                                                " : la société éditrice du service, à savoir Vylte-finuka SARL, SIRET 92978865100016, 60 rue François 1er, 75008 Paris, France."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 33,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 23,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "À propos de Vyft Program"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 38,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: [
                                        "Vyft Program est un outil conçu pour l’application Vyft, une solution de suivi et d’analyse des pas et de l’activité physique de vos clients.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 40,
                                            columnNumber: 170
                                        }, this),
                                        "Il permet aux entreprises de suivre les pas réalisés dans leurs établissements, d’analyser la fréquentation, de générer des statistiques de performance et d’automatiser la gestion de la relation client.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 41,
                                            columnNumber: 231
                                        }, this),
                                        "Il permet aussi aux services de la commune d’organiser des marchés ou événements dans des lieux spécifiques et de suivre la fréquentation grâce à l’application."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 39,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "Fonctionnalités principales"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 44,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    style: {
                                        marginBottom: 24
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Suivi en temps réel du nombre de pas effectués par les clients dans votre enseigne."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 46,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Analyse des données de fréquentation et de l’engagement client."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 47,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Tableau de bord pour visualiser les réclamations et les statistiques d’activité."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 48,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                "Gestion des abonnements via un ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "prestataire sécurisé"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 64
                                                }, this),
                                                ' (Stripe) en mode "pay as you go".'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 49,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Génération et impression de QR codes pour le suivi d’entrée et de sortie (Vyft tag™)."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 50,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Export et impression des statistiques et des tags pour vos opérations marketing."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 51,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Support technique dédié et gestion des accès utilisateurs."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 52,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Outils pour les services de la commune afin de suivre la fréquentation lors d’événements ou marchés dans des lieux spécifiques."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 53,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 45,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "1. Objet"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 55,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: [
                                        "Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "Vylte-finuka SARL"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 57,
                                            columnNumber: 235
                                        }, this),
                                        " (SIRET 92978865100016), 60 rue François 1er, 75008 Paris, France, conforme à la réglementation de l’Union Européenne."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 56,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "2. Accès au service"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 59,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: [
                                        "L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné à la souscription d’un abonnement géré par un ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "prestataire sécurisé"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 61,
                                            columnNumber: 262
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 60,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "3. Description du service"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 63,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 64,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "4. Commande et abonnement"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 67,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: [
                                        'L’abonnement fonctionne aujourd’hui en mode "pay as you go" via un ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "prestataire sécurisé"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 69,
                                            columnNumber: 106
                                        }, this),
                                        " (Stripe). Nous manipulons les données uniquement dans les cas nécessaires. L’abonnement peut être révoqué à tout moment en contactant le support à l’adresse support@vylte-finuka.com."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 68,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "5. Prix et paiement"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 71,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 72,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "6. Résiliation"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 75,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "L’utilisateur peut demander la révocation de son abonnement à tout moment en contactant le support à support@vylte-finuka.com. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 76,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "7. Propriété intellectuelle"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 79,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Tous les éléments du service (logiciel, interface, contenus, marques) sont la propriété exclusive de Vylte-finuka. Toute reproduction ou utilisation non autorisée est interdite."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "8. Données personnelles"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 83,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Les données personnelles sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 84,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "9. Confidentialité et sécurité"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 87,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Vylte-finuka met en œuvre les mesures techniques et organisationnelles pour assurer la sécurité des données. L’utilisateur s’engage à préserver la confidentialité de ses identifiants."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 88,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "10. Responsabilité"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 91,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Vylte-finuka ne saurait être tenue responsable des dommages indirects, pertes de données ou interruption de service. L’utilisateur est responsable de l’usage qu’il fait du service."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 92,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "11. Support et maintenance"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 95,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Un support technique est accessible par email à support@vylte-finuka.com. Vylte-finuka s’efforce d’assurer la disponibilité du service, sans garantie d’absence d’interruption."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 96,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "12. Modifications des CGVU"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 99,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Vylte-finuka se réserve le droit de modifier les présentes CGVU à tout moment. Les utilisateurs seront informés par email ou notification sur la plateforme."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 100,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "13. Droit applicable et juridiction"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 103,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Les présentes CGVU sont soumises au droit français et à la réglementation de l’Union Européenne. Tout litige sera porté devant les tribunaux compétents de Paris."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 104,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "14. Contact"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 107,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: "Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris."
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 108,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "À propos du rapport PDF et de la grille d'influence"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 111,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: [
                                        "Le rapport PDF généré par Vyft Program contient un tableau de suivi de l’influence et de la fréquentation sur 800 jours :",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Ligne supérieure (1 à 32)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                            lineNumber: 116,
                                                            columnNumber: 37
                                                        }, this),
                                                        " : chaque colonne correspond à un jour du mois (du 1",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sup", {
                                                            children: "er"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                            lineNumber: 116,
                                                            columnNumber: 121
                                                        }, this),
                                                        " au 32",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sup", {
                                                            children: "e"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                            lineNumber: 116,
                                                            columnNumber: 140
                                                        }, this),
                                                        " jour, pour couvrir tous les cas de mois)."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Légende inférieure (M1, M2, ...)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                            lineNumber: 119,
                                                            columnNumber: 37
                                                        }, this),
                                                        " : chaque “M” indique le numéro du mois affiché (M1 = premier mois, M2 = deuxième mois, etc.)."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Chaque case du tableau représente l’activité d’un jour donné, la couleur indiquant le niveau d’influence ou de fréquentation."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 114,
                                            columnNumber: 29
                                        }, this),
                                        "Ce format permet de visualiser rapidement l’évolution de l’activité jour par jour et mois par mois."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 112,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhite,
                                    children: "15. Utilisation de l’Intelligence Artificielle (IA)"
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 127,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    children: [
                                        "Vyft Program propose une fonctionnalité d’assistance par intelligence artificielle (IA) nommée ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "Vyft Nérethense"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 129,
                                            columnNumber: 124
                                        }, this),
                                        ", permettant de répondre à vos questions, d’analyser vos données et de vous conseiller sur l’utilisation de la plateforme.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 129,
                                            columnNumber: 268
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Les réponses fournies par l’IA Vyft Nérethense sont générées automatiquement à partir de vos données et des informations disponibles sur la plateforme. Elles sont données à titre indicatif et ne sauraient se substituer à un conseil professionnel personnalisé."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "L’utilisateur s’engage à ne pas soumettre de données sensibles, confidentielles ou à caractère personnel non nécessaires lors de l’utilisation de l’IA."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Vylte-finuka ne pourra être tenue responsable des décisions prises sur la base des réponses de l’IA."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "L’utilisation de l’IA Vyft Nérethense est soumise au respect des présentes CGVU et à la politique de confidentialité de Vyft Program."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                                    lineNumber: 140,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                            lineNumber: 130,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 128,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                                    type: "application/json",
                                    id: "vyft-cgvu-json",
                                    dangerouslySetInnerHTML: {
                                        __html: JSON.stringify({
                                            cgvu: `
Conditions Générales de Vente et d’Utilisation

Définitions à connaître
- "Vyft Program" : plateforme SaaS de gestion de la relation client (CRM) et d’analyse d’activité physique.
- "Utilisateur" : toute personne physique ou morale utilisant Vyft Program.
- "Prestataire sécurisé" : service tiers spécialisé et certifié pour la gestion des comptes, abonnements et paiements (ex : Stripe).
- "Dénomination" : la société éditrice du service, à savoir Vylte-finuka SARL, SIRET 92978865100016, 60 rue François 1er, 75008 Paris, France.

À propos de Vyft Program
Vyft Program est un outil conçu pour l’application Vyft, une solution de suivi et d’analyse des pas et de l’activité physique de vos clients.
Il permet aux entreprises de suivre les pas réalisés dans leurs établissements, d’analyser la fréquentation, de générer des statistiques de performance et d’automatiser la gestion de la relation client.
Il permet aussi aux services de la commune d’organiser des marchés ou événements dans des lieux spécifiques et de suivre la fréquentation grâce à l’application.

Fonctionnalités principales
- Suivi en temps réel du nombre de pas effectués par les clients dans votre enseigne.
- Analyse des données de fréquentation et de l’engagement client.
- Tableau de bord pour visualiser les réclamations et les statistiques d’activité.
- Gestion des abonnements via un prestataire sécurisé (Stripe) en mode "pay as you go".
- Génération et impression de QR codes pour le suivi d’entrée et de sortie (Vyft tag™).
- Export et impression des statistiques et des tags pour vos opérations marketing.
- Support technique dédié et gestion des accès utilisateurs.
- Outils pour les services de la commune afin de suivre la fréquentation lors d’événements ou marchés dans des lieux spécifiques.

1. Objet
Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société Vylte-finuka SARL (SIRET 92978865100016), 60 rue François 1er, 75008 Paris, France, conforme à la réglementation de l’Union Européenne.

2. Accès au service
L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné à la souscription d’un abonnement géré par un prestataire sécurisé.

3. Description du service
Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment.

4. Commande et abonnement
L’abonnement fonctionne aujourd’hui en mode "pay as you go" via un prestataire sécurisé (Stripe). Nous manipulons les données uniquement dans les cas nécessaires. L’abonnement peut être révoqué à tout moment en contactant le support à l’adresse support@vylte-finuka.com.

5. Prix et paiement
Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email.

6. Résiliation
L’utilisateur peut demander la révocation de son abonnement à tout moment en contactant le support à support@vylte-finuka.com. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU.

7. Propriété intellectuelle
Tous les éléments du service (logiciel, interface, contenus, marques) sont la propriété exclusive de Vylte-finuka. Toute reproduction ou utilisation non autorisée est interdite.

8. Données personnelles
Les données personnelles sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.

9. Confidentialité et sécurité
Vylte-finuka met en œuvre les mesures techniques et organisationnelles pour assurer la sécurité des données. L’utilisateur s’engage à préserver la confidentialité de ses identifiants.

10. Responsabilité
Vylte-finuka ne saurait être tenue responsable des dommages indirects, pertes de données ou interruption de service. L’utilisateur est responsable de l’usage qu’il fait du service.

11. Support et maintenance
Un support technique est accessible par email à support@vylte-finuka.com. Vylte-finuka s’efforce d’assurer la disponibilité du service, sans garantie d’absence d’interruption.

12. Modifications des CGVU
Vylte-finuka se réserve le droit de modifier les présentes CGVU à tout moment. Les utilisateurs seront informés par email ou notification sur la plateforme.

13. Droit applicable et juridiction
Les présentes CGVU sont soumises au droit français et à la réglementation de l’Union Européenne. Tout litige sera porté devant les tribunaux compétents de Paris.

14. Contact
Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris.

À propos du rapport PDF et de la grille d'influence
Le rapport PDF généré par Vyft Program contient un tableau de suivi de l’influence et de la fréquentation sur 800 jours :
- Ligne supérieure (1 à 32) : chaque colonne correspond à un jour du mois (du 1er au 32e jour, pour couvrir tous les cas de mois).
- Légende inférieure (M1, M2, ...) : chaque “M” indique le numéro du mois affiché (M1 = premier mois, M2 = deuxième mois, etc.).
- Chaque case du tableau représente l’activité d’un jour donné, la couleur indiquant le niveau d’influence ou de fréquentation.
Ce format permet de visualiser rapidement l’évolution de l’activité jour par jour et mois par mois.

15. Utilisation de l’Intelligence Artificielle (IA)
Vyft Program propose une fonctionnalité d’assistance par intelligence artificielle (IA) nommée Vyft Nérethense, permettant de répondre à vos questions, d’analyser vos données et de vous conseiller sur l’utilisation de la plateforme.
- Les réponses fournies par l’IA Vyft Nérethense sont générées automatiquement à partir de vos données et des informations disponibles sur la plateforme. Elles sont données à titre indicatif et ne sauraient se substituer à un conseil professionnel personnalisé.
- L’utilisateur s’engage à ne pas soumettre de données sensibles, confidentielles ou à caractère personnel non nécessaires lors de l’utilisation de l’IA.
- Vylte-finuka ne pourra être tenue responsable des décisions prises sur la base des réponses de l’IA.
- L’utilisation de l’IA Vyft Nérethense est soumise au respect des présentes CGVU et à la politique de confidentialité de Vyft Program.

Dernière mise à jour : 25 septembre 2025
                                    `
                                        })
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                                    lineNumber: 147,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                            lineNumber: 15,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                            lineNumber: 238,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                    lineNumber: 13,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/conditions-generales-de-vente.tsx",
                lineNumber: 12,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_c = CGVU;
var _c;
__turbopack_context__.k.register(_c, "CGVU");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/conditions-generales-de-vente.tsx [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/conditions-generales-de-vente";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/conditions-generales-de-vente.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/pages/conditions-generales-de-vente (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/conditions-generales-de-vente.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__29997cc8._.js.map