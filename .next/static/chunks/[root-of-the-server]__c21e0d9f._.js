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
"[project]/app/components/Footer1.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/Navbar.module.css [client] (css module)");
"use client";
;
;
;
const Footer = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].links,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/conditions-generales-de-vente",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle3,
                    children: "Conditions Générales de Vente et d'Utilisation"
                }, void 0, false, {
                    fileName: "[project]/app/components/Footer1.tsx",
                    lineNumber: 11,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Footer1.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].copyright,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fontstyle2,
                    children: "© 2025 - Vylte-finuka SARL, Tous droits réservés."
                }, void 0, false, {
                    fileName: "[project]/app/components/Footer1.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Footer1.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Footer1.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
};
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/register.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$login$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/login.tsx [client] (ecmascript)"); // Importer le composant Login
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer1$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Footer1.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const capitalizeWords = (value)=>{
    return value.split(" ").map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};
const ModalMarkdown = ({ visible, onClose, markdown })=>{
    _s();
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModalMarkdown.useEffect": ()=>{
            if (visible && scrollRef.current) {
                scrollRef.current.scrollTop = 0;
            }
        }
    }["ModalMarkdown.useEffect"], [
        visible
    ]);
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center"
        },
        onClick: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollRef,
                style: {
                    background: "#fff",
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    padding: 32,
                    maxWidth: 600,
                    width: "100%",
                    maxHeight: "70vh",
                    overflowY: "auto",
                    boxShadow: "0 -3px 16px rgba(0,0,0,0.15)",
                    position: "relative",
                    animation: "slideUp 0.3s"
                },
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                        components: {
                            h1: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                        color: "#1a7f6b",
                                        fontSize: 28,
                                        marginBottom: 16
                                    },
                                    ...props
                                }, void 0, false, {
                                    fileName: "[project]/pages/register.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, void 0),
                            h2: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                        color: "#1a7f6b",
                                        fontSize: 22,
                                        marginBottom: 12
                                    },
                                    ...props
                                }, void 0, false, {
                                    fileName: "[project]/pages/register.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, void 0),
                            h3: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                        color: "#222",
                                        fontSize: 18,
                                        marginBottom: 8
                                    },
                                    ...props
                                }, void 0, false, {
                                    fileName: "[project]/pages/register.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, void 0),
                            p: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                        color: "#222",
                                        fontSize: 15,
                                        marginBottom: 8
                                    },
                                    ...props
                                }, void 0, false, {
                                    fileName: "[project]/pages/register.tsx",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, void 0),
                            li: ({ node, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    style: {
                                        fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                        color: "#222",
                                        fontSize: 15
                                    },
                                    ...props
                                }, void 0, false, {
                                    fileName: "[project]/pages/register.tsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, void 0)
                        },
                        children: markdown
                    }, void 0, false, {
                        fileName: "[project]/pages/register.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        style: {
                            background: "#1a7f6b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 18,
                            padding: "10px 32px",
                            fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                            fontSize: 16,
                            margin: "24px auto 0 auto",
                            display: "block",
                            cursor: "pointer"
                        },
                        children: "Fermer"
                    }, void 0, false, {
                        fileName: "[project]/pages/register.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/register.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/pages/register.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/register.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
};
_s(ModalMarkdown, "P14GFulhWAl/Oec4Pk4QeBwKyr0=");
_c = ModalMarkdown;
const CGVU_MARKDOWN = `
# Conditions Générales de Vente et d’Utilisation

## Définitions à connaître
- **Vyft Program** : plateforme SaaS de gestion de la relation client (CRM) et d’analyse d’activité physique.
- **Utilisateur** : toute personne physique ou morale utilisant Vyft Program.
- **Prestataire sécurisé** : service tiers spécialisé et certifié pour la gestion des comptes, abonnements et paiements (ex : Stripe).
- **Dénomination** : la société éditrice du service, à savoir Vylte-finuka SARL, SIRET 92978865100016, 60 rue François 1er, 75008 Paris, France.

## À propos de Vyft Program
Vyft Program est un outil conçu pour l’application Vyft, une solution de suivi et d’analyse des pas et de l’activité physique de vos clients.  
Il permet aux entreprises de suivre les pas réalisés dans leurs établissements, d’analyser la fréquentation, de générer des statistiques de performance et d’automatiser la gestion de la relation client.  
Il permet aussi aux services de la commune d’organiser des marchés ou événements dans des lieux spécifiques et de suivre la fréquentation grâce à l’application.

## Fonctionnalités principales
- Suivi en temps réel du nombre de pas effectués par les clients dans votre enseigne.
- Analyse des données de fréquentation et de l’engagement client.
- Tableau de bord pour visualiser les réclamations et les statistiques d’activité.
- Gestion des abonnements via un **prestataire sécurisé** (Stripe) en mode "pay as you go".
- Génération et impression de QR codes pour le suivi d’entrée et de sortie (Vyft tag™).
- Export et impression des statistiques et des tags pour vos opérations marketing.
- Support technique dédié et gestion des accès utilisateurs.
- Outils pour les services de la commune afin de suivre la fréquentation lors d’événements ou marchés dans des lieux spécifiques.

## 1. Objet
Les présentes Conditions Générales de Vente et d’Utilisation (CGVU) régissent l’accès et l’utilisation du service Vyft Program, plateforme SaaS de gestion de la relation client (CRM), éditée par la société **Vylte-finuka SARL** (SIRET 92978865100016), 60 rue François 1er, 75008 Paris, France, conforme à la réglementation de l’Union Européenne.

## 2. Accès au service
L’accès à Vyft Program nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes et à les mettre à jour. L’accès au service est conditionné à la souscription d’un abonnement géré par un **prestataire sécurisé**.

## 3. Description du service
Vyft Program permet la gestion des contacts, des réclamations, des interactions commerciales et l’analyse de données clients. Les fonctionnalités peuvent évoluer à tout moment.

## 4. Commande et abonnement
L’abonnement fonctionne aujourd’hui en mode "pay as you go" via un **prestataire sécurisé** (Stripe). Nous manipulons les données uniquement dans les cas nécessaires. L’abonnement peut être révoqué à tout moment en contactant le support à l’adresse support@vylte-finuka.com.

## 5. Prix et paiement
Les tarifs sont indiqués en euros hors taxes sur le site. Vylte-finuka se réserve le droit de modifier les prix à tout moment, les abonnés en seront informés par email.

## 6. Résiliation
L’utilisateur peut demander la révocation de son abonnement à tout moment en contactant le support à support@vylte-finuka.com. Toute période entamée reste due. Vylte-finuka peut suspendre ou résilier l’accès en cas de non-respect des CGVU.

## 7. Propriété intellectuelle
Tous les éléments du service (logiciel, interface, contenus, marques) sont la propriété exclusive de Vylte-finuka. Toute reproduction ou utilisation non autorisée est interdite.

## 8. Données personnelles
Les données personnelles sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.

## 9. Confidentialité et sécurité
Vylte-finuka met en œuvre les mesures techniques et organisationnelles pour assurer la sécurité des données. L’utilisateur s’engage à préserver la confidentialité de ses identifiants.

## 10. Responsabilité
Vylte-finuka ne saurait être tenue responsable des dommages indirects, pertes de données ou interruption de service. L’utilisateur est responsable de l’usage qu’il fait du service.

## 11. Support et maintenance
Un support technique est accessible par email à support@vylte-finuka.com. Vylte-finuka s’efforce d’assurer la disponibilité du service, sans garantie d’absence d’interruption.

## 12. Modifications des CGVU
Vylte-finuka se réserve le droit de modifier les présentes CGVU à tout moment. Les utilisateurs seront informés par email ou notification sur la plateforme.

## 13. Droit applicable et juridiction
Les présentes CGVU sont soumises au droit français et à la réglementation de l’Union Européenne. Tout litige sera porté devant les tribunaux compétents de Paris.

## 14. Contact
Pour toute question, contactez-nous à support@vylte-finuka.com ou à l’adresse du siège social : 60 rue François 1er, 75008 Paris.

## À propos du rapport PDF et de la grille d'influence

Le rapport PDF généré par Vyft Program contient un tableau de suivi de l’influence et de la fréquentation sur 800 jours :

- **Ligne supérieure (1 à 32)** : chaque colonne correspond à un jour du mois (du 1<sup>er</sup> au 32<sup>e</sup> jour, pour couvrir tous les cas de mois).
- **Légende inférieure (M1, M2, ...)** : chaque “M” indique le numéro du mois affiché (M1 = premier mois, M2 = deuxième mois, etc.).
- Chaque case du tableau représente l’activité d’un jour donné, la couleur indiquant le niveau d’influence ou de fréquentation.

Ce format permet de visualiser rapidement l’évolution de l’activité jour par jour et mois par mois.

## 15. Utilisation de l’Intelligence Artificielle (IA)

Vyft Program propose une fonctionnalité d’assistance par intelligence artificielle (IA) nommée **Vyft Nérethense**, permettant de répondre à vos questions, d’analyser vos données et de vous conseiller sur l’utilisation de la plateforme.

- Les réponses fournies par l’IA Vyft Nérethense sont générées automatiquement à partir de vos données et des informations disponibles sur la plateforme. Elles sont données à titre indicatif et ne sauraient se substituer à un conseil professionnel personnalisé.
- L’utilisateur s’engage à ne pas soumettre de données sensibles, confidentielles ou à caractère personnel non nécessaires lors de l’utilisation de l’IA.
- Vylte-finuka ne pourra être tenue responsable des décisions prises sur la base des réponses de l’IA.
- L’utilisation de l’IA Vyft Nérethense est soumise au respect des présentes CGVU et à la politique de confidentialité de Vyft Program.
`;
const Register = ()=>{
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [denomination, setDenomination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour la dénomination sociale
    const [companyName, setCompanyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour le nom de la société
    const [siret, setSiret] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour le numéro de SIRET
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [firstName, setFirstName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour le prénom
    const [lastName, setLastName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour le nom
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour le mot de passe
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Champ pour l'adresse postale professionnelle
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // Pour afficher les erreurs
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showLogin, setShowLogin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false); // État pour basculer vers Login
    const [acceptCGVU, setAcceptCGVU] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false); // État pour accepter les CGVU
    const [showCGVU, setShowCGVU] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleRegister = async (e)=>{
        e.preventDefault();
        try {
            const minLength = 10; // Longueur minimale du mot de passe
            if (!password || password.length < minLength) {
                setError(`Votre mot de passe doit comporter au moins ${minLength} caractères.`);
                return;
            }
            if (!denomination || !companyName || !siret || !email || !firstName || !lastName || !address) {
                setError("Veuillez remplir tous les champs.");
                return;
            }
            if (!acceptCGVU) {
                setError("Vous devez accepter les CGVU pour continuer.");
                return;
            }
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/dbconnections/signup`, {
                client_id: ("TURBOPACK compile-time value", "gnSYOUhQHV9hCZdKfNqIS7AoCgyRqv5C"),
                email: email,
                nickname: firstName,
                family_name: lastName,
                password: password,
                connection: "Vyftbase",
                user_metadata: {
                    denomination: denomination,
                    companyName: companyName,
                    siret: siret,
                    address: address
                }
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                setSuccess("Inscription réussie !");
                setError("");
                setTimeout(()=>{
                    setShowLogin(true); // Basculer vers Login
                }, 2000);
            }
        } catch (err) {
            console.error("Erreur lors de l'inscription :", err);
            // Capturer et afficher les détails de l'erreur API
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data, null, 2)); // Afficher les détails de l'erreur en JSON
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        }
    };
    const CustomCheckbox = ({ checked, onChange })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: ()=>onChange(!checked),
            style: {
                width: 24,
                height: 24,
                borderRadius: 8,
                border: "2px solid #1a7f6b",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
                cursor: "pointer",
                transition: "background 0.2s",
                boxSizing: "border-box"
            },
            tabIndex: 0,
            role: "checkbox",
            "aria-checked": checked,
            onKeyDown: (e)=>{
                if (e.key === " " || e.key === "Enter") onChange(!checked);
            },
            children: checked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: "#1a7f6b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }
            }, void 0, false, {
                fileName: "[project]/pages/register.tsx",
                lineNumber: 347,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/register.tsx",
            lineNumber: 323,
            columnNumber: 5
        }, this);
    if (showLogin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$login$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/pages/register.tsx",
            lineNumber: 363,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Vyft - Inscription - Vyft program: Manage your own market."
            }, void 0, false, {
                fileName: "[project]/pages/register.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container3} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].center}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/vyft_program.png",
                        alt: "Vyft Program",
                        width: 400,
                        height: 180
                    }, void 0, false, {
                        fileName: "[project]/pages/register.tsx",
                        lineNumber: 370,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].form,
                        onSubmit: handleRegister,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "denomination",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Dénomination sociale* :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "denomination",
                                        name: "denomination",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez la dénomination sociale de votre société",
                                        value: denomination,
                                        onChange: (e)=>setDenomination(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "companyName",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Nom de la société :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 392,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "companyName",
                                        name: "companyName",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez le nom de votre société",
                                        value: companyName,
                                        onChange: (e)=>setCompanyName(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 395,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "siret",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Numéro de SIRET** :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "siret",
                                        name: "siret",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre numéro de SIRET",
                                        value: siret,
                                        onChange: (e)=>setSiret(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 405,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "address",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Adresse postale professionnelle :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 420,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "address",
                                        name: "address",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez l'adresse postale de votre société",
                                        value: address,
                                        onChange: (e)=>setAddress(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 423,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 419,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "email",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Adresse email :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        id: "email",
                                        name: "email",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre adresse email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "firstName",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Prénom :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 448,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "firstName",
                                        name: "firstName",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre prénom",
                                        value: firstName,
                                        onChange: (e)=>setFirstName(capitalizeWords(e.target.value))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 451,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "lastName",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Nom :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 462,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "lastName",
                                        name: "lastName",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre nom",
                                        value: lastName,
                                        onChange: (e)=>setLastName(capitalizeWords(e.target.value))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 465,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 461,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "password",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Mot de passe :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 476,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        id: "password",
                                        name: "password",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre mot de passe",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 479,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: 30,
                                    marginBottom: 10,
                                    marginLeft: 20,
                                    marginRight: 20
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomCheckbox, {
                                        checked: acceptCGVU,
                                        onChange: setAcceptCGVU
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 499,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 15,
                                            color: "#222",
                                            fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif",
                                            flex: 1,
                                            flexWrap: "wrap",
                                            userSelect: "none"
                                        },
                                        children: [
                                            "J'accepte les",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "#1a7f6b",
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                    fontFamily: "BR Sonoma Semibold, BRSonoma Semibold, sans-serif"
                                                },
                                                onClick: ()=>setShowCGVU(true),
                                                children: "Conditions Générales de Vente et d'Utilisation"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/register.tsx",
                                                lineNumber: 514,
                                                columnNumber: 15
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 503,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 489,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    color: "red",
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word"
                                },
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 529,
                                columnNumber: 13
                            }, this),
                            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "green"
                                },
                                children: success
                            }, void 0, false, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 533,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button,
                                disabled: !acceptCGVU,
                                style: {
                                    opacity: acceptCGVU ? 1 : 0.5,
                                    cursor: acceptCGVU ? "pointer" : "not-allowed",
                                    transition: "opacity 0.2s"
                                },
                                children: "S'inscrire"
                            }, void 0, false, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].signupText,
                                onClick: ()=>setShowLogin(true),
                                children: [
                                    "Vous avez déjà un compte ?",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].signupLink,
                                        children: "Connectez-vous ici"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/register.tsx",
                                        lineNumber: 551,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/register.tsx",
                        lineNumber: 376,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodymessage,
                        children: [
                            "* La dénomination sociale est utilisée uniquement à des fins informatives.",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/pages/register.tsx",
                                lineNumber: 556,
                                columnNumber: 11
                            }, this),
                            "** Le numéro de SIRET est requis pour identifier votre société."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/register.tsx",
                        lineNumber: 554,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer1$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/pages/register.tsx",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/register.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalMarkdown, {
                visible: showCGVU,
                onClose: ()=>setShowCGVU(false),
                markdown: CGVU_MARKDOWN
            }, void 0, false, {
                fileName: "[project]/pages/register.tsx",
                lineNumber: 561,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s1(Register, "0meggDY4eiIfveVA1CnVLXBCw3k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = Register;
const __TURBOPACK__default__export__ = Register;
var _c, _c1;
__turbopack_context__.k.register(_c, "ModalMarkdown");
__turbopack_context__.k.register(_c1, "Register");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/login.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer1$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Footer1.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$register$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/register.tsx [client] (ecmascript)"); // Importer le composant Register
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)"); // Ajoutez ceci en haut
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
;
;
const Login = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])(); // Ajoutez ceci dans le composant
    const { user, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useUser"])(); // Récupère l'utilisateur connecté via Auth0
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showRegister, setShowRegister] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false); // État pour basculer entre Login et Register
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false); // État pour vérifier si l'utilisateur est connecté
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(""); // État pour stocker le token utilisateur
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Login.useEffect": ()=>{
            // Si l'utilisateur est connecté via Auth0, mettre à jour l'état
            if (user) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("isLoggedIn", "1");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("username", user.name || "");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("email", user.email || "");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("picture", user.picture || "");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("userToken", token);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("auth0UserId", user.sub || "");
                setIsLoggedIn(true);
            }
        }
    }["Login.useEffect"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Login.useEffect": ()=>{
            if (isLoggedIn) {
                router.push("/"); // Redirige vers la page d'accueil
            }
        }
    }["Login.useEffect"], [
        isLoggedIn,
        router
    ]);
    const handleLogin = async (e)=>{
        e.preventDefault();
        try {
            if (!email || !password) {
                setError("Veuillez remplir tous les champs.");
                return;
            }
            // Appeler Auth0 avec password-realm
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/oauth/token`, {
                grant_type: "http://auth0.com/oauth/grant-type/password-realm",
                client_id: ("TURBOPACK compile-time value", "gnSYOUhQHV9hCZdKfNqIS7AoCgyRqv5C"),
                username: email,
                password: password,
                realm: "Vyftbase",
                scope: "openid profile email",
                audience: ("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com/api/v2/")
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            // Vérifiez si le jeton d'accès est présent dans la réponse
            const { access_token } = response.data;
            if (!access_token) {
                throw new Error("Jeton d'accès non retourné par Auth0.");
            }
            // Récupérer les informations utilisateur
            const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            const userInfo = userInfoResponse.data;
            // Stocker les informations utilisateur dans secureLocalStorage
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("isLoggedIn", "1");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("username", userInfo.name || "");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("email", userInfo.email || "");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("picture", userInfo.picture || "");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("auth0UserId", userInfo.sub || ""); // Stocker l'auth0UserId
            // Stocker le jeton utilisateur dans secureLocalStorage
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("userToken", access_token);
            setToken(access_token);
            // Après login réussi :
            // Récupérer l'IP publique
            const ipRes = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("https://api.ipify.org?format=json");
            const ip = ipRes.data.ip;
            // Récupérer le navigateur et le système
            const userAgent = window.navigator.userAgent;
            // Date précise
            const loginDate = new Date().toISOString();
            // Historique local
            const loginHistoryRaw = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("loginHistory");
            const prevHistory = JSON.parse(typeof loginHistoryRaw === "string" ? loginHistoryRaw : "[]");
            prevHistory.unshift({
                date: loginDate,
                ip,
                device: userAgent,
                status: "Succès"
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].setItem("loginHistory", JSON.stringify(prevHistory));
            // Mettre à jour l'état pour rediriger vers Home
            setIsLoggedIn(true);
        } catch (err) {
            console.error("Erreur lors de la connexion :", err);
            // Capturer et afficher les détails de l'erreur
            if (err.response && err.response.data) {
                setError(err.response.data.error_description || "Nom de société ou mot de passe incorrect.");
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        }
    };
    if (isLoading) {
        // Afficher un état de chargement pendant que les données utilisateur sont récupérées
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Chargement..."
        }, void 0, false, {
            fileName: "[project]/pages/login.tsx",
            lineNumber: 139,
            columnNumber: 12
        }, this);
    }
    // Supprimez ce bloc :
    // if (isLoggedIn) {
    //   return <Home />;
    // }
    if (showRegister) {
        // Retourner le composant Register si l'utilisateur clique sur le lien
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$register$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/pages/login.tsx",
            lineNumber: 149,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Connexion - Vyft program: Manage your own market."
            }, void 0, false, {
                fileName: "[project]/pages/login.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container3} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].center}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/vyft_program.png",
                        alt: "Vyft Program",
                        width: 400,
                        height: 180
                    }, void 0, false, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].form,
                        onSubmit: handleLogin,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "email",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Adresse email :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/login.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "email",
                                        name: "email",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre adresse email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/login.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "password",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                                        children: "Mot de passe :"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/login.tsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        id: "password",
                                        name: "password",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                        placeholder: "Entrez votre mot de passe",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/login.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "red"
                                },
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 190,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button,
                                children: "Se connecter"
                            }, void 0, false, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].signupText,
                                onClick: ()=>setShowRegister(true),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].signupLink,
                                    children: "Vous n'avez pas de compte ?"
                                }, void 0, false, {
                                    fileName: "[project]/pages/login.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/login.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer1$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/pages/login.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/login.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(Login, "RRdKHIig43IwjtFI9qp9IasMbtQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = Login;
const __TURBOPACK__default__export__ = Login;
var _c;
__turbopack_context__.k.register(_c, "Login");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/login.tsx [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/login";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/login.tsx [client] (ecmascript)");
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
"[project]/pages/login (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/login.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c21e0d9f._.js.map