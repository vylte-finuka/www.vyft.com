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
"[project]/app/components/SquareAIFloat.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* eslint-disable react/display-name */ __turbopack_context__.s({
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
// Call Grok-3 via /api/ask-ai (OpenRouter with x-ai/grok-3)
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
    if (!res.ok) {
        throw new Error(`Erreur API: ${res.statusText}`);
    }
    const data = await res.json();
    if (data.error) {
        throw new Error(data.error || "Erreur serveur IA");
    }
    let reply = data.reply || "";
    let isDocument = false;
    let docData;
    try {
        const parsed = JSON.parse(reply);
        // Cas spécial : payload racine avec "DynamicReport" ou "title"
        if (parsed.DynamicReport && parsed.DynamicReport.pages) {
            // Extraction du format custom
            const dr = parsed.DynamicReport;
            isDocument = true;
            docData = {
                title: dr.reportType || dr.title || "Document",
                type: dr.reportType || dr.type || "business_plan",
                content: dr.content || "",
                design: {
                    pages: (dr.pages || []).map((p)=>({
                            font: "Arial",
                            style: {
                                backgroundColor: "#fff",
                                padding: 32
                            },
                            sections: [
                                {
                                    title: p.title || p.pageTitle || "",
                                    content: p.content || "",
                                    style: {
                                        color: "#222",
                                        fontSize: 14
                                    }
                                }
                            ]
                        })),
                    colors: {
                        background: "#fff"
                    }
                }
            };
            reply = `Document "${docData.title}" prêt à être généré.`;
        } else if (parsed.title && parsed.pages) {
            isDocument = true;
            docData = {
                title: parsed.title,
                type: parsed.type || "business_plan",
                content: parsed.content || "",
                design: {
                    pages: (parsed.pages || []).map((p)=>({
                            font: "Arial",
                            style: {
                                backgroundColor: "#fff",
                                padding: 32
                            },
                            sections: [
                                {
                                    title: p.title || "",
                                    content: p.content || "",
                                    style: {
                                        color: "#222",
                                        fontSize: 14
                                    }
                                }
                            ]
                        })),
                    colors: {
                        background: "#fff"
                    }
                }
            };
            reply = `Document "${docData.title}" prêt à être généré.`;
        } else if (parsed.report && parsed.report.title && parsed.report.type && parsed.report.design) {
            isDocument = true;
            docData = parsed.report;
            reply = `Document "${parsed.report.title}" prêt à être généré.`;
        } else if (parsed.report && parsed.report.title && parsed.report.pages) {
            // Conversion flexible du format "report" en DynamicReport
            const r = parsed.report;
            isDocument = true;
            docData = {
                title: r.title,
                type: r.type || "business_plan",
                content: r.content || "",
                design: {
                    pages: (r.pages || []).map((p)=>({
                            font: p.font || "Arial",
                            style: p.style || {
                                backgroundColor: "#fff",
                                padding: 32
                            },
                            sections: [
                                {
                                    title: p.title || p.section || "",
                                    content: p.content || "",
                                    style: p.sectionStyle || {
                                        color: "#222",
                                        fontSize: 14
                                    }
                                }
                            ]
                        })),
                    colors: r.colors || {
                        background: "#fff"
                    }
                }
            };
            reply = `Document "${docData?.title ?? ""}" prêt à être généré.`;
        } else if (parsed.report && parsed.report.metadata && parsed.report.pages) {
            // Conversion du format "report" avec "metadata" et "pages" en DynamicReport
            const r = parsed.report;
            isDocument = true;
            docData = {
                title: r.metadata.title || "Document",
                type: r.metadata.format || "business_plan",
                content: r.metadata.content || "",
                design: {
                    pages: (r.pages || []).map((p)=>({
                            font: p.layout?.font || "Arial",
                            style: p.layout?.style || {
                                backgroundColor: "#fff",
                                padding: 32
                            },
                            sections: [
                                {
                                    title: p.section || p.title || "",
                                    content: typeof p.content === "object" ? Object.entries(p.content).map(([k, v])=>Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`).join("\n") : p.content || "",
                                    style: p.layout?.sectionStyle || {
                                        color: "#222",
                                        fontSize: 14
                                    }
                                }
                            ]
                        })),
                    colors: r.metadata.colors || {
                        background: "#fff"
                    }
                }
            };
            reply = `Document "${docData.title}" prêt à être généré.`;
        } else if (parsed.report && parsed.report.format === "DynamicReport" && parsed.report.pages) {
            // Conversion du format "report" avec "format": "DynamicReport" en DynamicReport
            const r = parsed.report;
            isDocument = true;
            docData = {
                title: r.title || "Document",
                type: r.format || "business_plan",
                content: r.content || "",
                design: {
                    pages: (r.pages || []).map((p)=>({
                            font: p.font || "Arial",
                            style: p.style || {
                                backgroundColor: "#fff",
                                padding: 32
                            },
                            sections: [
                                {
                                    title: p.section || p.title || "",
                                    content: p.content || "",
                                    style: p.sectionStyle || {
                                        color: "#222",
                                        fontSize: 14
                                    }
                                }
                            ]
                        })),
                    colors: r.colors || {
                        background: "#fff"
                    }
                }
            };
            reply = `Document "${docData.title}" prêt à être généré.`;
        } else if (parsed.report) {
            // Extraction générique du payload même si le format n'est pas strictement reconnu
            const r = parsed.report;
            docData = {
                title: r.title || r.metadata?.title || "Document",
                type: r.type || r.format || r.metadata?.format || "business_plan",
                content: r.content || r.metadata?.content || "",
                design: r.design || {
                    pages: (r.pages || []).map((p)=>({
                            font: p.font || p.layout?.font || "Arial",
                            style: p.style || p.layout?.style || {
                                backgroundColor: "#fff",
                                padding: 32
                            },
                            sections: [
                                {
                                    title: p.section || p.title || "",
                                    content: p.content || "",
                                    style: p.sectionStyle || p.layout?.sectionStyle || {
                                        color: "#222",
                                        fontSize: 14
                                    }
                                }
                            ]
                        })),
                    colors: r.colors || r.metadata?.colors || {
                        background: "#fff"
                    }
                }
            };
            isDocument = true; // Force la génération
            reply = `Document "${docData.title}" prêt à être généré.`;
        }
    } catch (e) {
    // Not JSON, treat as regular text response
    }
    return {
        reply,
        isDocument,
        docData
    };
}
// Fetch business data (expanded for product management)
async function getComptaData(enseigne, stripeCustomerId) {
    const res = await fetch(`/api/vyfthealth_proc?enseigne=${encodeURIComponent(enseigne)}&stripeCustomerId=${encodeURIComponent(stripeCustomerId)}`, {
        headers: {
            "x-vyftprogram-api-key": ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO") || ""
        }
    });
    const data = await res.json();
    if (data.success) {
        return data.data;
    } else {
        throw new Error(data.message || "Erreur API");
    }
}
// Génération PDF universelle selon le design IA
async function generatePDF(docData) {
    try {
        // Ajoute le type et toutes les props pour le design IA
        const userId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("auth0UserId");
        const payload = {
            ...docData.props,
            title: docData.title,
            content: docData.content,
            type: docData.type || "report",
            userId,
            design: docData.design || undefined
        };
        const res = await fetch("/api/reportgen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-vyftprogram-api-key": ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO") || ""
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            throw new Error(`Échec de la génération du PDF: ${res.statusText}`);
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${docData.title.replace(/\s/g, "_")}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erreur génération PDF:", error);
        throw error;
    }
}
function SquareAIFloat() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [docStudioOpen, setDocStudioOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            from: "ai",
            text: "Bienvenue sur Vyft Nérethense, assistant IA professionnel alimenté par Nérethense Z.S soit l'équivalent de Z.Setneshi. Je suis conçu pour les entreprises multinationales et d'autres entreprises comme les PME et TPE, avec création automatisée de documents professionnels, gestion de produits de grand marché. Posez votre question ou utilisez /compta, /manage-product, ou /generate-report."
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [docLoading, setDocLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [denomination, setDenomination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stripeCustomerId, setStripeCustomerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [comptaData, setComptaData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cgvu, setCgvu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [docFormData, setDocFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        type: "report",
        title: "",
        params: {}
    });
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Fetch user info from Auth0
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
            const fetchUserInfo = {
                "SquareAIFloat.useEffect.fetchUserInfo": async ()=>{
                    try {
                        const userToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("userToken");
                        if (!userToken) return;
                        const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const userId = userInfoResponse.data.sub;
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
    // Auto-scroll to bottom
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            }
        }
    }["SquareAIFloat.useEffect"], [
        messages,
        loading
    ]);
    // Fetch business data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
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
    // Preload CGVU
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SquareAIFloat.useEffect": ()=>{
            async function fetchCGVU() {
                try {
                    const res = await fetch("/api/cgvu");
                    const data = await res.json();
                    setCgvu(data.cgvu || "");
                } catch (e) {
                    console.error("Failed to load CGVU:", e);
                }
            }
            if (!cgvu) fetchCGVU();
        }
    }["SquareAIFloat.useEffect"], [
        cgvu
    ]);
    function cleanObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map(cleanObject).filter((v)=>v !== undefined && v !== null && v !== "undefined");
        } else if (typeof obj === "object" && obj !== null) {
            const newObj = {};
            for(const k in obj){
                // Supprime les clés d'image non supportées
                if (k === "image" || k === "watermarkImg" || k === "logo" && typeof obj[k] === "string" && !obj[k].match(/\.(png|jpg|jpeg|svg)$/i) || k === "qrCode" && typeof obj[k] === "string" && !obj[k].match(/\.(png|jpg|jpeg|svg)$/i)) {
                    continue;
                }
                const v = obj[k];
                if (v !== undefined && v !== null && v !== "undefined") {
                    newObj[k] = cleanObject(v);
                }
            }
            return newObj;
        }
        if (typeof obj === "string") {
            return obj.replace(/undefined/gi, "").trim();
        }
        return obj;
    }
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
        // Détection et envoi direct du payload DynamicReport saisi par l'utilisateur
        try {
            const parsed = JSON.parse(input);
            if (parsed && typeof parsed === "object" && parsed.title && parsed.type && parsed.design && Array.isArray(parsed.design.pages)) {
                const cleaned = cleanObject(parsed);
                // ENVOI DIRECT À L'API /reportgen
                await generatePDF(cleaned);
                setMessages((msgs)=>[
                        ...msgs,
                        {
                            from: "ai",
                            text: `Document "${cleaned.title}" généré avec succès.`
                        }
                    ]);
                setLoading(false);
                return;
            }
        } catch (e) {
        // Si ce n'est pas un JSON, on continue le flow normal
        }
        try {
            // Suggestion automatique du design, couleurs et style
            let context = `
Tu es Nérethense Z.Sethneshi, assistant IA professionnel pour entreprises.
Quand tu dois générer un document PDF, tu dois répondre uniquement par un JSON strictement valide, sans texte libre ni explication, au format suivant :

{
  "title": "Titre du document",
  "type": "TypeDuDocument",
  "design": {
    "colors": {
      "primary": "#00796B",
      "secondary": "#FFFFFF",
      "highlight": "#4DB6AC",
      "background": "#FFFFFF",
      "text": "#212121",
      "lightText": "#757575"
    },
    "fonts": {
      "title": "Lato",
      "body": "Roboto"
    }
  },
  "pages": [
    {
      "style": {
        "pageSize": "A4",
        "margin": "20mm",
        "backgroundColor": "#FFFFFF"
      },
      "sections": [
        {
          "style": { "fontSize": 14, "color": "#00796B", "fontFamily": "Lato" },
          "content": [
            { "type": "text", "value": "Texte parfaitement orthographié.", "style": { "fontSize": 14, "color": "#212121", "fontFamily": "Roboto" } },
            { "type": "view", "subContent": [ /* ... */ ], "style": { "flexDirection": "row" } }
          ]
        }
      ]
    }
  ]
}

Règles strictes :
- Toutes les couleurs doivent être au format hexadécimal 6 caractères (#FFFFFF).
- Jamais de valeurs comme #F ou #FFF, toujours #FFFFFF ou #000000.
- Toutes les clés "style" sont obligatoires pour chaque section et chaque page.
- Les sections doivent avoir "content" sous forme de tableau d’objets {type, value} ou {type: "view", subContent: [...]}, jamais d’objet complexe ou de clé manquante.
- Jamais de texte explicatif, jamais de clé "report" à la racine.
- Le JSON doit être testable dans un validateur et prêt à l’usage sans correction humaine.
- Tous les textes doivent être sans faute d’orthographe ni de grammaire.

IMPORTANT : Si tu ne respectes pas exactement ce format, la génération du PDF échouera. Tu dois valider ton JSON dans un validateur avant de répondre. Ne réponds jamais par du texte libre ou des clés non demandées.
`;
            if (comptaData) {
                context += `
Données disponibles :
- Pas aujourd'hui : ${comptaData.dailySteps}
- Distance aujourd'hui : ${comptaData.dailyDistance} km
- Profit aujourd'hui : ${comptaData.dailyRevenue} €
- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €
- Produits : ${comptaData.products ? `Produits gérés : ${comptaData.products.length}` : "Aucun produit"}
`;
            }
            if (cgvu) {
                context += `\nCGVU : ${cgvu}\n`;
            }
            // Envoi à l'IA avec contexte enrichi
            const { reply, isDocument, docData } = await callmodelAPI([
                {
                    from: "user",
                    text: context + input
                },
                ...messages
            ]);
            let cleanReply = reply;
            if (cleanReply) {
                cleanReply = cleanReply.replace(/undefined/gi, " ");
                cleanReply = cleanReply.replace(/benvenue|iinvenue|binvenue|invenue|Benvenue/gi, "Bienvenue");
                cleanReply = cleanReply.replace(/Vyft Nérethhnse|Vyft Nérethense|Nérethhnse/gi, "Vyft Nérethense");
                cleanReply = cleanReply.replace(/pprfessionnel|prfessionnel|professionnel/gi, "professionnel");
                cleanReply = cleanReply.replace(/poor|poour|pour/gi, "pour");
                cleanReply = cleanReply.replace(/certifii|certifé|certiféé|certifiéé/gi, "certifié");
                cleanReply = cleanReply.replace(/activitt|activittt|activitée|activitée/gi, "activité");
                cleanReply = cleanReply.replace(/ssistanttIA|ssistant IA|assistanttIA|assistantt IA/gi, "assistant IA");
                cleanReply = cleanReply.replace(/vouu/gi, "vous");
                cleanReply = cleanReply.replace(/ee/gi, "et");
                cleanReply = cleanReply.replace(/([a-zA-Z])\1{1,}/g, "$1");
                cleanReply = cleanReply.replace(/[\s\n\r]{2,}/g, " ");
                cleanReply = cleanReply.replace(/\s+([.,;:!?])/g, "$1");
                cleanReply = cleanReply.trim();
            }
            if (cleanReply && cleanReply !== "") {
                setMessages((msgs)=>[
                        ...msgs,
                        {
                            from: "ai",
                            text: cleanReply
                        }
                    ]);
            }
            // Si l'IA retourne un JSON DynamicReport valide, on génère le PDF automatiquement
            if (isDocument && docData && docData.title && docData.type && docData.design && Array.isArray(docData.design.pages)) {
                await generatePDF(docData);
                setMessages((msgs)=>[
                        ...msgs,
                        {
                            from: "ai",
                            text: `Document "${docData.title}" généré avec succès.`
                        }
                    ]);
            }
        } catch (error) {
            setMessages((msgs)=>[
                    ...msgs,
                    {
                        from: "ai",
                        text: "Une erreur est survenue. Veuillez réessayer."
                    }
                ]);
        } finally{
            setLoading(false);
        }
    }
    async function handleDocSubmit(e) {
        e.preventDefault();
        if (!docFormData.title || !docFormData.type) return;
        setDocLoading(true);
        try {
            const { reply, isDocument, docData } = await callmodelAPI([
                {
                    from: "user",
                    text: context + prompt
                }
            ]);
            if (isDocument && docData) {
                await generatePDF(docData);
                setMessages((msgs)=>[
                        ...msgs,
                        {
                            from: "ai",
                            text: `Document "${docData.title}" généré avec succès.`
                        }
                    ]);
            } else {
                setMessages((msgs)=>[
                        ...msgs,
                        {
                            from: "ai",
                            text: reply || "Erreur : Impossible de générer le document. Veuillez vérifier les paramètres."
                        }
                    ]);
            }
        } catch (error) {
            setMessages((msgs)=>[
                    ...msgs,
                    {
                        from: "ai",
                        text: "Erreur lors de la génération du document. Veuillez réessayer."
                    }
                ]);
        } finally{
            setDocLoading(false);
        }
    }
    const context = comptaData ? `Données disponibles :
- Pas aujourd'hui : ${comptaData.dailySteps}
- Distance aujourd'hui : ${comptaData.dailyDistance} km
- Profit aujourd'hui : ${comptaData.dailyRevenue} €
- Prochaine facture : ${comptaData.upcomingInvoiceAmount} €
- Produits : ${comptaData.products ? `Produits gérés : ${comptaData.products.length}` : "Aucun produit"}` : "";
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
            height: open ? docStudioOpen ? "700px" : "500px" : "90px",
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
                            lineNumber: 632,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 616,
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
                        lineNumber: 634,
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
                        lineNumber: 645,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 615,
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
                            messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bubble, {
                                    from: msg.from,
                                    text: msg.text,
                                    children: msg.from === "ai" && idx === messages.length - 1 && !loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingText, {
                                        text: msg.text
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                                        lineNumber: 686,
                                        columnNumber: 17
                                    }, this) : msg.text
                                }, idx, false, {
                                    fileName: "[project]/app/components/SquareAIFloat.tsx",
                                    lineNumber: 684,
                                    columnNumber: 13
                                }, this)),
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
                                            lineNumber: 710,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                                        lineNumber: 694,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingBubble, {}, void 0, false, {
                                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                                        lineNumber: 712,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SquareAIFloat.tsx",
                                lineNumber: 693,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: messagesEndRef,
                                className: "jsx-7d37b0088d58e5a9"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SquareAIFloat.tsx",
                                lineNumber: 715,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 672,
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
                                placeholder: "Votre demande...",
                                "aria-label": "Saisir votre demande pour Vyft Nérethense",
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
                                lineNumber: 724,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                "aria-label": "Envoyer la question",
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
                                lineNumber: 744,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SquareAIFloat.tsx",
                        lineNumber: 717,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 658,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "7d37b0088d58e5a9",
                children: "@keyframes dotBounce{0%,80%,to{transform:translateY(0)}40%{transform:translateY(-8px)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 592,
        columnNumber: 5
    }, this);
}
_s(SquareAIFloat, "/hSWkZ++gj6+h+oUPB/ZT3UcaLY=");
_c = SquareAIFloat;
const TypingText = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_s1(({ text })=>{
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
            }["TypingText.useEffect.interval"], 18);
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
        lineNumber: 797,
        columnNumber: 10
    }, this);
}, "vX7roFhzDmTMSRT2IyLXRVK/bXA="));
_c1 = TypingText;
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
            border: from === "ai" ? "none" : "1px solid #353a40"
        },
        children: children ? children : text
    }, void 0, false, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 802,
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
                lineNumber: 841,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingDots, {}, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 842,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 825,
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
                lineNumber: 850,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                delay: 0.2
            }, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 851,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                delay: 0.4
            }, void 0, false, {
                fileName: "[project]/app/components/SquareAIFloat.tsx",
                lineNumber: 852,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SquareAIFloat.tsx",
        lineNumber: 849,
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
        lineNumber: 859,
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
"[project]/pages/administration/main-management.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* eslint-disable @next/next/no-head-element */ __turbopack_context__.s({
    "default": (()=>Funds_management)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Footer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Navbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$qrcode$2f$dist$2f$next$2d$qrcode$2e$es$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-qrcode/dist/next-qrcode.es.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-secure-storage/dist/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-to-print/lib/index.js [client] (ecmascript)");
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
const SUPPORTED_CURRENCIES = [
    "€",
    "Ar",
    "$",
    "£"
];
function Funds_management() {
    _s();
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [storeName, setStoreName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])();
    const { Canvas } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$qrcode$2f$dist$2f$next$2d$qrcode$2e$es$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQRCode"])();
    const [storeNamefact, setStoreNamefact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])();
    const qr1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const QrT1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReactToPrint"])({
        contentRef: qr1,
        documentTitle: "QR Code de départ"
    });
    const qr2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const QrT2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReactToPrint"])({
        contentRef: qr2,
        documentTitle: "QR Code d'arrivée"
    });
    const API_KEY = ("TURBOPACK compile-time value", "vyftprogramwQvNtGG69p5olaIFWe4n6CBCnCVGu1m1jZvOaFi95laYqUx2xyBq68IEF2eKQXFS9ZoCTZFzYW6vmuGKe2bJLdmRpBr5Hqk456K5Z3noysX6ZlzYuclOqDWp4ZioCiYl5JyBDvA3p1pwCtbTadv9reB65haBGMeNCygcj36pYUPArQDOgP5tniS5h5604dQ4dB4ylxX2LpaDlYZMSdjpU7Zg9xekWm3pablpJ9FehT8vJfVBiuWyjlRcMSBAJHLLOJl31aVsTJjWix7UXRq7xAtDeWAnAM2ALnSWVEvlr5b2wfjawVYOJtXpNi8CO04qbskHmRw8cQc58L42X0WwqQQRgVLu3qT6lQwVuqZJgCNaZNyGc8HQa0thVu7FNOhO2sfeN7vujSK1wwpSkYBXpELSrCnkuo0dmHRz23DrgY1s5JWC7rthQBiRXCdbmHbIUoYafcgjUMLDJXvzLcMMSjWFs85kWDe0pmPn77YC3gjELkvDxVrRO");
    const [metricsHistory, setMetricsHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currency, setCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("€");
    const [rates, setRates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "€": 1,
        "Ar": 0,
        "$": 0,
        "£": 0
    });
    const [hasExplored, setHasExplored] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "Funds_management.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                return localStorage.getItem("vyft_hasExplored") === "1";
            }
            "TURBOPACK unreachable";
        }
    }["Funds_management.useState"]);
    const [stripeCustomerId, setStripeCustomerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Funds_management.useEffect": ()=>{
            setStoreName(storeNamefact);
        }
    }["Funds_management.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Funds_management.useEffect": ()=>{
            const fetchRates = {
                "Funds_management.useEffect.fetchRates": async ()=>{
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json");
                        setRates({
                            "€": 1,
                            "Ar": res.data.eur.mga,
                            "$": res.data.eur.usd,
                            "£": res.data.eur.gbp
                        });
                    } catch (e) {
                        console.error("Erreur lors de la récupération des taux de change :", e);
                    }
                }
            }["Funds_management.useEffect.fetchRates"];
            fetchRates();
        }
    }["Funds_management.useEffect"], []);
    const convert = (amount)=>{
        if (amount === null || amount === undefined || isNaN(Number(amount))) return "0.00";
        const rate = rates[currency] || 1;
        return (Number(amount) * rate).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Funds_management.useEffect": ()=>{
            const fetchStoreNameAndMetrics = {
                "Funds_management.useEffect.fetchStoreNameAndMetrics": async ()=>{
                    try {
                        const userToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$secure$2d$storage$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getItem("userToken");
                        if (!userToken) return;
                        const userInfoResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/userinfo`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const userId = userInfoResponse.data.sub;
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://vylte-finuka.eu.auth0.com")}/api/v2/users/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const denomination = response.data?.user_metadata?.denomination?.trim();
                        let stripeCustomerIdValue = response.data?.user_metadata?.subid?.trim();
                        // Si subid absent, essayer de le retrouver/créer côté Stripe
                        if (!stripeCustomerIdValue && userId) {
                            try {
                                const stripeRes = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("/api/create-or-retrieve-customer", {
                                    auth0UserId: userId,
                                    userToken,
                                    action: "create"
                                }, {
                                    headers: {
                                        "x-vyftprogram-api-key": API_KEY || "",
                                        "Content-Type": "application/json"
                                    }
                                });
                                stripeCustomerIdValue = stripeRes.data.customerId;
                            } catch (err) {
                                console.error("Impossible de retrouver/créer le client Stripe :", err);
                            }
                        }
                        setStoreName(denomination);
                        setStripeCustomerId(stripeCustomerIdValue);
                        if (!denomination || !stripeCustomerIdValue) return;
                        const apiResponse = await fetch(`/api/vyfthealth_proc?enseigne=${encodeURIComponent(denomination)}&stripeCustomerId=${encodeURIComponent(stripeCustomerIdValue)}`, {
                            method: "GET",
                            headers: {
                                "x-vyftprogram-api-key": API_KEY || ""
                            }
                        });
                        if (!apiResponse.ok) return;
                        const apiData = await apiResponse.json();
                        if (apiData.success) {
                            setMetrics(apiData.data);
                            setMetricsHistory({
                                "Funds_management.useEffect.fetchStoreNameAndMetrics": (prev)=>{
                                    const today = new Date().toISOString().slice(0, 10);
                                    const filtered = prev.filter({
                                        "Funds_management.useEffect.fetchStoreNameAndMetrics.filtered": (h)=>h.date !== today
                                    }["Funds_management.useEffect.fetchStoreNameAndMetrics.filtered"]);
                                    return [
                                        ...filtered,
                                        {
                                            date: today,
                                            dailyRevenue: apiData.data.dailyRevenue,
                                            dailySteps: apiData.data.dailySteps,
                                            dailyDistance: apiData.data.dailyDistance
                                        }
                                    ].slice(-7);
                                }
                            }["Funds_management.useEffect.fetchStoreNameAndMetrics"]);
                        }
                    } catch (error) {
                        setStoreNamefact("Erreur lors de la récupération");
                    }
                }
            }["Funds_management.useEffect.fetchStoreNameAndMetrics"];
            fetchStoreNameAndMetrics();
            const interval = setInterval(fetchStoreNameAndMetrics, 4000);
            return ({
                "Funds_management.useEffect": ()=>clearInterval(interval)
            })["Funds_management.useEffect"];
        }
    }["Funds_management.useEffect"], []);
    // Design & charte graphique harmonisés
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container2,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Gestion principale - Vyft program: Manage your own market."
                }, void 0, false, {
                    fileName: "[project]/pages/administration/main-management.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/administration/main-management.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/administration/main-management.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                style: {
                    alignItems: "flex-start"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexDirection: "row",
                        gap: 32,
                        width: "100%",
                        alignItems: "flex-start",
                        marginBottom: 32
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                minWidth: 0
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headeronwhiteX2,
                                    children: "Gestion principale"
                                }, void 0, false, {
                                    fileName: "[project]/pages/administration/main-management.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                    style: {
                                        background: "#fff",
                                        borderRadius: 24,
                                        padding: 32,
                                        width: "100%",
                                        maxWidth: 700,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                        marginBottom: 24
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginBottom: "1rem"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "currency",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                    children: "Devise : "
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/administration/main-management.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    id: "currency",
                                                    value: currency,
                                                    onChange: (e)=>setCurrency(e.target.value),
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectCurrency,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "€",
                                                            children: "EUR (€)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "$",
                                                            children: "USD ($)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "£",
                                                            children: "GBP (£)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "Ar",
                                                            children: "MGA (Ar)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 240,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/administration/main-management.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/administration/main-management.tsx",
                                            lineNumber: 229,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitleAligned}`,
                                            children: "Informations de consommations additionnelles :"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/administration/main-management.tsx",
                                            lineNumber: 243,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statviewers,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].left,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodycar,
                                                            children: "Recette"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 248,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: "Investissement dans le mois :"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: metrics && metrics.monthlyInvestment !== undefined && metrics.monthlyInvestment !== null ? `${convert(metrics.monthlyInvestment)} ${currency}` : "0.00 " + currency
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: "Moyenne estimée de bénéfice en une journée :"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: metrics && metrics.dailyRevenue !== undefined && metrics.dailyRevenue !== null ? `${convert(metrics.dailyRevenue)} ${currency}` : "0.00 " + currency
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: "Pourcentage de croissance dans la semaine :"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: metrics && metrics.growth !== undefined && metrics.growth !== null ? String(metrics.growth).replace(".", ",") : "0 %"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/administration/main-management.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].right,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodycar,
                                                            children: "Usage de Vyft™"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: "Total des pas de tout clients en 24 heures :"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 270,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: metrics ? `${metrics.dailySteps} pas` : "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 271,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: "Total parcourus de tout ces clients en 24 heures :"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: metrics ? `${metrics.dailyDistance} mètres` : "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 275,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: "Total de nombre de pas depuis un an de tout clients :"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body,
                                                            children: metrics ? `${metrics.yearlySteps} pas` : "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 279,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/administration/main-management.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/administration/main-management.tsx",
                                            lineNumber: 246,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/administration/main-management.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/administration/main-management.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                minWidth: 420,
                                maxWidth: 420,
                                alignSelf: "flex-start"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bodyonwhite,
                                style: {
                                    background: "#fff",
                                    borderRadius: 24,
                                    padding: 32,
                                    width: "100%",
                                    maxWidth: 420,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                    marginBottom: 24,
                                    position: "relative",
                                    minHeight: 420,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center"
                                },
                                children: [
                                    !stripeCustomerId && !hasExplored && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#23272e",
                                            borderRadius: 24,
                                            padding: 36,
                                            minWidth: 340,
                                            width: "90%",
                                            maxWidth: 420,
                                            boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
                                            color: "#fff",
                                            textAlign: "center",
                                            margin: "0 auto"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    color: "#1a7f6b",
                                                    fontWeight: 700,
                                                    fontSize: 26,
                                                    marginBottom: 14
                                                },
                                                children: "Abonnement requis"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 322,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: 17,
                                                    color: "#e0dbdd",
                                                    marginBottom: 28
                                                },
                                                children: "Vous devez être abonné pour accéder aux QR codes Vyft."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 325,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    background: "#1a7f6b",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 16,
                                                    padding: "14px 38px",
                                                    fontWeight: 700,
                                                    fontSize: 17,
                                                    cursor: "pointer",
                                                    fontFamily: "BR Sonoma, sans-serif",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                                    transition: "background 0.2s",
                                                    letterSpacing: 0.2
                                                },
                                                onClick: ()=>{
                                                    setHasExplored(true);
                                                    localStorage.setItem("vyft_hasExplored", "1");
                                                },
                                                children: "Explorer d'abord"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 328,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/administration/main-management.tsx",
                                        lineNumber: 308,
                                        columnNumber: 17
                                    }, this),
                                    !stripeCustomerId && hasExplored ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#23272e",
                                            borderRadius: 24,
                                            padding: 36,
                                            minWidth: 340,
                                            width: "90%",
                                            maxWidth: 420,
                                            boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
                                            color: "#fff",
                                            textAlign: "center",
                                            margin: "0 auto"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    color: "#1a7f6b",
                                                    fontWeight: 700,
                                                    fontSize: 26,
                                                    marginBottom: 14
                                                },
                                                children: "Abonnement requis"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 368,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: 17,
                                                    color: "#e0dbdd",
                                                    marginBottom: 28
                                                },
                                                children: "Vous devez être abonné pour accéder aux QR codes Vyft."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 371,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    background: "#1a7f6b",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 16,
                                                    padding: "14px 38px",
                                                    fontWeight: 700,
                                                    fontSize: 17,
                                                    cursor: "pointer",
                                                    fontFamily: "BR Sonoma, sans-serif",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                                    transition: "background 0.2s",
                                                    letterSpacing: 0.2
                                                },
                                                onClick: ()=>window.location.href = "/",
                                                children: "S'abonner"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 374,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/administration/main-management.tsx",
                                        lineNumber: 354,
                                        columnNumber: 17
                                    }, this) : null,
                                    stripeCustomerId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitleAligned}`,
                                                children: "Vyft tag™ :"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 398,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitleAligned}`,
                                                        children: "QR Code de départ :"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/administration/main-management.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 21
                                                    }, this),
                                                    storeName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        ref: qr1,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].qrCodeContainer,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Canvas, {
                                                            text: JSON.stringify({
                                                                message: "Vyft Tag on",
                                                                enseigne: storeName
                                                            }),
                                                            logo: {
                                                                src: "https://avatars.githubusercontent.com/u/123649969?v=4",
                                                                options: {
                                                                    width: 88
                                                                }
                                                            },
                                                            options: {
                                                                errorCorrectionLevel: "M",
                                                                margin: 3,
                                                                scale: 4,
                                                                width: 200,
                                                                color: {
                                                                    dark: "#e0dbdd",
                                                                    light: "#a5a3a3"
                                                                }
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/administration/main-management.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: QrT1,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ActionEbuttonoveron,
                                                        children: "Imprimer ce tag"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/administration/main-management.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].body} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitleAligned}`,
                                                        style: {
                                                            marginTop: "2rem"
                                                        },
                                                        children: "QR Code d'arrivée :"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/administration/main-management.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 21
                                                    }, this),
                                                    storeName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        ref: qr2,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].qrCodeContainer,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Canvas, {
                                                            text: JSON.stringify({
                                                                message: "Vyft Tag off",
                                                                enseigne: storeName
                                                            }),
                                                            logo: {
                                                                src: "https://avatars.githubusercontent.com/u/123649969?v=4",
                                                                options: {
                                                                    width: 88
                                                                }
                                                            },
                                                            options: {
                                                                errorCorrectionLevel: "M",
                                                                margin: 3,
                                                                scale: 4,
                                                                width: 200,
                                                                color: {
                                                                    dark: "#e0dbdd",
                                                                    light: "#a5a3a3"
                                                                }
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/administration/main-management.tsx",
                                                            lineNumber: 432,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/administration/main-management.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: QrT2,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ActionEbuttonoveron,
                                                        children: "Imprimer ce tag"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/administration/main-management.tsx",
                                                        lineNumber: 451,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/administration/main-management.tsx",
                                                lineNumber: 401,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/administration/main-management.tsx",
                                lineNumber: 288,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/administration/main-management.tsx",
                            lineNumber: 287,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/administration/main-management.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/administration/main-management.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/administration/main-management.tsx",
                lineNumber: 459,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/administration/main-management.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(Funds_management, "tMdvNRAKRBql5scZwSJLVT6EBqI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$qrcode$2f$dist$2f$next$2d$qrcode$2e$es$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQRCode"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReactToPrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReactToPrint"]
    ];
});
_c = Funds_management;
var _c;
__turbopack_context__.k.register(_c, "Funds_management");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/administration/main-management.tsx [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/administration/main-management";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/administration/main-management.tsx [client] (ecmascript)");
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
"[project]/pages/administration/main-management.tsx (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/administration/main-management.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__456290cd._.js.map