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
"[project]/app/[lang]/components/Navbar.module.css [client] (css module)": ((__turbopack_context__) => {

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
"[project]/app/[lang]/components/Navbar.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* eslint-disable @next/next/no-sync-scripts */ __turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Navbar.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const Navbar = ()=>{
    _s();
    const [isSubMenuOpen, setIsSubMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSubSubMenuOpen, setIsSubSubMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useParams"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].Navbar,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    legacyBehavior: true,
                    href: `/${locale}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/vyft.png",
                            alt: "Vyftprogram",
                            width: 166,
                            height: 112,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navLinks,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                children: t.ecosystem
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/ecosystem/vyft-slide`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/ecosystem/vyft-slura`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/ecosystem/luzia`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                children: t.offers
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/offer/cashbacks`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/offer/partenaires`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle,
                                children: t.story
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/Navbar.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subMenu} ${isSubMenuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].open : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/story/vyft`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/story/vyft-program`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle1,
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
_s(Navbar, "HYlOHdcJlSyTishdAjq10P9M6nA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
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
"[project]/app/[lang]/components/CGU_Vyft_content_fr.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/[lang]/components/SquareAIFloat.tsx [client] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$CGU_Vyft_content_fr$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/CGU_Vyft_content_fr.ts [client] (ecmascript)"); // Assure-toi que ce fichier existe et est exporté
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [client] (ecmascript) <export Markdown as default>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            from: "ai",
            text: "Bonjour, je suis Vyft Nérethense, votre agent IA ✨. Comment pourrais-je vous aider avec Vyft ? Posez-moi votre question ou réponse !"
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Ajout pour stocker les infos utilisateur
    const [userInfo, setUserInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [denomination, setDenomination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [squareCustomerId, setsquareCustomerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
                        const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const userId = userInfoResponse.data.sub;
                        // Récupérer les métadonnées utilisateur (enseigne et squareCustomerId)
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
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
            if (denomination && squareCustomerId) {
                getComptaData(denomination, squareCustomerId).then(setComptaData).catch({
                    "SquareAIFloat.useEffect": ()=>setComptaData(null)
                }["SquareAIFloat.useEffect"]);
            }
        }
    }["SquareAIFloat.useEffect"], [
        denomination,
        squareCustomerId
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
                fetch("/conditions-generales-d-utilisation").then({
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
        context = `Tu es Vyft Nérethense, l’unique agente IA de support pour Vyft. ` + `Ta mission est d'aider, d'accompagner et de répondre à toutes les questions des utilisateurs concernant l'utilisation de Vyft, les problèmes techniques, la FAQ, la sécurité, la gestion de compte, l'accès aux services, et toute demande d'assistance. ` + `Tu es empathique, claire, pédagogique et toujours orientée solution. ` + `Ne donne jamais de conseils business ou marketing, concentre-toi sur le support et l'aide utilisateur. ` + `Si la question concerne une fonctionnalité, un bug, une procédure, une sécurité, une inscription, une connexion, une facture, une CGU ou une FAQ, réponds précisément et propose des solutions ou des étapes à suivre. ` + `Si tu n'as pas la réponse exacte, propose une démarche ou invite à contacter le support humain. ` + `Ne réponds jamais "je ne sais pas", propose toujours une aide ou une orientation.\n\n`;
        if (cgvu) {
            context += "\n\nVoici les Conditions Générales de Vente et d’Utilisation (CGVU) de Vyft Program, à utiliser pour toute question juridique ou d’utilisation :\n" + cgvu + "\n\n";
        }
        context += "\n\nVoici les Conditions Générales d'Utilisation (CGU) officielles de Vyft :\n" + __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$CGU_Vyft_content_fr$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["default"] + "\n\n";
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
        className: "jsx-1c380e0a5c273610" + " " + (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite || ""),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                },
                className: "jsx-1c380e0a5c273610",
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
                        className: "jsx-1c380e0a5c273610",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                className: "jsx-1c380e0a5c273610",
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
                        className: "jsx-1c380e0a5c273610",
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
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bubble, {
                                    from: msg.from,
                                    text: msg.text
                                }, idx, false, {
                                    fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                    lineNumber: 357,
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
                                className: "jsx-1c380e0a5c273610",
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
                                        className: "jsx-1c380e0a5c273610",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingBubble, {}, void 0, false, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        className: "jsx-1c380e0a5c273610",
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
                                className: "jsx-1c380e0a5c273610"
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                                lineNumber: 403,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(SquareAIFloat, "HLHY4ueXgmP23VWXn5tCqlDY7hI=");
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
    // Utilise un div pour appliquer la classe vyft-markdown pendant la génération
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "vyft-markdown",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
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
_s1(TypingText, "vX7roFhzDmTMSRT2IyLXRVK/bXA=");
_c1 = TypingText;
// Modifie Bubble pour accepter des enfants (children)
function Bubble({ from, text, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        children: children ? children : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
            components: {
                strong: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 590,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingDots, {}, void 0, false, {
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
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 599,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                delay: 0.2
            }, void 0, false, {
                fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
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
        fileName: "[project]/app/[lang]/components/SquareAIFloat.tsx",
        lineNumber: 608,
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
"[project]/app/[lang]/components/Footer1.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Navbar.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$SquareAIFloat$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/SquareAIFloat.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const Footer = ()=>{
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useParams"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].links,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/${locale}/conditions-generales-d-utilisation`,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle3,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].copyright,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle2,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$SquareAIFloat$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
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
_s(Footer, "+jVsTcECDRo3yq2d7EQxlN9Ixog=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/[lang]/ecosystem/vyft-slura.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Vyftslide)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Navbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Footer1$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[lang]/components/Footer1.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
// Import selon ton setup – on assume wagmi + viem ou ethers pour simplicité
// Si tu utilises déjà Reown/AppKit, adapte avec createAppKit + connectors
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$providers$2f$provider$2d$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ethers/lib.esm/providers/provider-browser.js [client] (ecmascript)"); // ou viem si tu préfères
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function Vyftslide() {
    _s();
    const [showBackground, setShowBackground] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [account, setAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [provider, setProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const lang = router.query.lang;
    const locale = lang === "fr-FR" ? "fr-FR" : "en-EN";
    const t = {
        "fr-FR": {
            title: "Vyft: La néobanque à la vertu de la finance. - Vyft slura",
            h1: "La première couche de niveau 1 (layer 1) au monde à s'ouvrir à de nouvelle infrastructure.",
            h2a: "Spécialisée pour le cloud computing à la téléphonie et RWA et partage des traits caractéristiques de Solana comme eBPF, parallélisme et s'apparente aux zkEVM pour le moteur d'exécution de contrat, il utilise le VEZ (Vyft Enhancing ZER(ZETA Erion)) comme jeton de frais et gouvernance en tant que stablecoin et tout ça en Europe.",
            h2b: "Le testnet de Slura: Charène est disponible en cliquant pour ajouter le réseau sur le widget!",
            connect: "Connecter le portefeuille",
            connecting: "Connexion en cours...",
            disconnect: "Déconnecter"
        },
        "en-EN": {
            title: "Vyft: The neobank with the virtue of finance. - Vyft slura",
            h1: "First world layer 1 for open to the news infrastructures.",
            h2a: "Specialized in **cloud computing** for **telephony** and **RWA** (Real World Assets), this project leverages technologies similar to **Solana**—such as **eBPF**, high parallelism, and a design akin to **zkEVM** for its smart contract execution engine. It uses the **VEZ** (Vyft Enhancing ZER / ZETA Erion) as its utility token for transaction fees and governance, functioning as a **stablecoin**, and operates entirely in **Europe**.",
            h2b: "The Slura testnet, named Charène, is now live!",
            connect: "Connect Wallet",
            connecting: "Connecting...",
            disconnect: "Disconnect"
        }
    }[locale];
    // Détection injected provider (MetaMask, etc.)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Vyftslide.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            const checkInjected = {
                "Vyftslide.useEffect.checkInjected": async ()=>{
                    if (window.ethereum) {
                        try {
                            // Demande les comptes → one-click si déjà autorisé
                            const accounts = await window.ethereum.request({
                                method: 'eth_requestAccounts'
                            });
                            if (accounts?.[0]) {
                                setAccount(accounts[0]);
                                setProvider(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$providers$2f$provider$2d$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BrowserProvider"](window.ethereum));
                            }
                        } catch (err) {
                            console.log("User denied auto-connect or no injected wallet ready");
                        }
                    }
                }
            }["Vyftslide.useEffect.checkInjected"];
            checkInjected();
            // Écoute les changements (compte changé, déconnexion, etc.)
            if (window.ethereum) {
                window.ethereum.on('accountsChanged', {
                    "Vyftslide.useEffect": (accounts)=>{
                        setAccount(accounts[0] || null);
                    }
                }["Vyftslide.useEffect"]);
                window.ethereum.on('disconnect', {
                    "Vyftslide.useEffect": ()=>{
                        setAccount(null);
                        setProvider(null);
                    }
                }["Vyftslide.useEffect"]);
            }
            return ({
                "Vyftslide.useEffect": ()=>{
                    if (window.ethereum) {
                        window.ethereum.removeAllListeners('accountsChanged');
                        window.ethereum.removeAllListeners('disconnect');
                    }
                }
            })["Vyftslide.useEffect"];
        }
    }["Vyftslide.useEffect"], []);
    const handleConnect = async ()=>{
        if (isConnecting) return;
        setIsConnecting(true);
        try {
            if (window.ethereum) {
                // Priorité : injected (MetaMask, etc.) → one-click
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                if (accounts?.[0]) {
                    setAccount(accounts[0]);
                    setProvider(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$providers$2f$provider$2d$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BrowserProvider"](window.ethereum));
                    setIsConnecting(false);
                    return;
                }
            }
            // Fallback si pas d'injected : ton UniversalConnector (WalletConnect → QR/modal)
            if (universalConnector) {
                const { session: providerSession } = await universalConnector.connect();
                // Adapte selon ce que retourne ton connector (ex: setSession)
                setAccount(providerSession?.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || null);
            }
        } catch (err) {
            console.error("Connection failed:", err);
        } finally{
            setIsConnecting(false);
        }
    };
    const handleDisconnect = async ()=>{
        if (provider) {
            // Pour injected → pas de vraie déconnexion, on reset local state
            setAccount(null);
            setProvider(null);
        }
        if (universalConnector) {
            await universalConnector.disconnect();
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Vyftslide.useEffect": ()=>{
            const timer = setTimeout({
                "Vyftslide.useEffect.timer": ()=>setShowBackground(true)
            }["Vyftslide.useEffect.timer"], 2000);
            return ({
                "Vyftslide.useEffect": ()=>clearTimeout(timer)
            })["Vyftslide.useEffect"];
        }
    }["Vyftslide.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Vyftslide.useEffect": ()=>{
            document.title = t.title;
        }
    }["Vyftslide.useEffect"], [
        t.title
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container3,
            children: [
                showBackground && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
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
                    lineNumber: 136,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: "relative",
                        zIndex: 1,
                        width: "100%"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerX2,
                                    children: t.h1
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                    children: t.h2a
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                    children: t.h2b
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        margin: "32px 0",
                                        textAlign: "center"
                                    },
                                    children: account ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "Connecté : ",
                                                    account.slice(0, 6),
                                                    "...",
                                                    account.slice(-4)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                                lineNumber: 168,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleDisconnect,
                                                style: {
                                                    padding: "12px 32px",
                                                    fontSize: "16px",
                                                    cursor: "pointer"
                                                },
                                                children: t.disconnect
                                            }, void 0, false, {
                                                fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                                lineNumber: 169,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleConnect,
                                        disabled: isConnecting,
                                        style: {
                                            padding: "16px 40px",
                                            fontSize: "18px",
                                            background: "#000",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: isConnecting ? "not-allowed" : "pointer",
                                            opacity: isConnecting ? 0.7 : 1
                                        },
                                        children: isConnecting ? t.connecting : t.connect
                                    }, void 0, false, {
                                        fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyattract
                                }, void 0, false, {
                                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$lang$5d2f$components$2f$Footer1$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
            lineNumber: 134,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/[lang]/ecosystem/vyft-slura.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(Vyftslide, "dHWOdtRON5KKqLqwx2z5Fu8YI0A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Vyftslide;
var _c;
__turbopack_context__.k.register(_c, "Vyftslide");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/[lang]/ecosystem/vyft-slura.tsx [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/[lang]/ecosystem/vyft-slura";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/[lang]/ecosystem/vyft-slura.tsx [client] (ecmascript)");
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
"[project]/pages/[lang]/ecosystem/vyft-slura.tsx (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/[lang]/ecosystem/vyft-slura.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__73f26dba._.js.map