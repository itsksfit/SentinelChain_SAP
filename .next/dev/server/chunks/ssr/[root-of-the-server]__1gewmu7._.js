module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/components/Navbar.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function Navbar() {
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([
        {
            id: 1,
            type: 'alert',
            title: 'Critical Disruption Detected',
            text: 'AI identified a high-probability impact to MCU-2201X from recent export restrictions.',
            time: '2 mins ago',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
            color: 'text-red-400'
        },
        {
            id: 2,
            type: 'success',
            title: 'SAP Ariba PR Approved',
            text: 'Recovery plan RP-8042 has been successfully submitted to Ariba.',
            time: '1 hr ago',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
            color: 'text-emerald-400'
        },
        {
            id: 3,
            type: 'info',
            title: 'Supply Network Updated',
            text: 'Distributor B has updated their standard lead times.',
            time: '3 hrs ago',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"],
            color: 'text-blue-400'
        }
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        className: "h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 lg:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            const sidebar = document.getElementById('mobile-sidebar');
                            if (sidebar) sidebar.classList.toggle('hidden');
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "w-6 h-6 text-gray-400 hover:text-white"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.jsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.jsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                className: "text-indigo-500 w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/components/Navbar.jsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "font-bold text-white",
                                children: "SentinelChain"
                            }, void 0, false, {
                                fileName: "[project]/components/Navbar.jsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Navbar.jsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Navbar.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden lg:flex items-center text-sm text-gray-400",
                children: "Mission Control / Dashboard"
            }, void 0, false, {
                fileName: "[project]/components/Navbar.jsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        ref: dropdownRef,
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowNotifications(!showNotifications),
                                className: `p-2 transition-colors relative rounded-full ${showNotifications ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Navbar.jsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, this),
                                    notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f1115] animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Navbar.jsx",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Navbar.jsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-950",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-bold text-white",
                                                children: "Notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Navbar.jsx",
                                                lineNumber: 57,
                                                columnNumber: 17
                                            }, this),
                                            notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] uppercase font-bold text-indigo-400 tracking-wider bg-indigo-900/30 px-2 py-0.5 rounded",
                                                children: [
                                                    notifications.length,
                                                    " New"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Navbar.jsx",
                                                lineNumber: 59,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Navbar.jsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "max-h-[300px] overflow-y-auto",
                                        children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "p-6 text-center text-gray-500 text-sm",
                                            children: "No new notifications. You're all caught up!"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Navbar.jsx",
                                            lineNumber: 64,
                                            columnNumber: 19
                                        }, this) : notifications.map((n)=>{
                                            const Icon = n.icon;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-3 border-b border-gray-800 hover:bg-white/5 transition-colors cursor-pointer flex gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "mt-0.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Icon, {
                                                            className: `w-4 h-4 ${n.color}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Navbar.jsx",
                                                            lineNumber: 72,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Navbar.jsx",
                                                        lineNumber: 72,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-bold text-white mb-0.5",
                                                                children: n.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Navbar.jsx",
                                                                lineNumber: 74,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] text-gray-400",
                                                                children: n.text
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Navbar.jsx",
                                                                lineNumber: 75,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-500 mt-1",
                                                                children: n.time
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Navbar.jsx",
                                                                lineNumber: 76,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/Navbar.jsx",
                                                        lineNumber: 73,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, n.id, true, {
                                                fileName: "[project]/components/Navbar.jsx",
                                                lineNumber: 71,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/Navbar.jsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, this),
                                    notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "p-2 border-t border-gray-800 bg-gray-950 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setNotifications([]),
                                            className: "text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors w-full py-1",
                                            children: "Mark all as read"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Navbar.jsx",
                                            lineNumber: 85,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Navbar.jsx",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Navbar.jsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Navbar.jsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden hover:border-gray-500 transition-colors cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "w-4 h-4 text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.jsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.jsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Navbar.jsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Navbar.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Sidebar.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.mjs [ssr] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs [ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.mjs [ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [ssr] (ecmascript) <export default as Activity>");
;
;
;
;
function Sidebar() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isActive = (path)=>router.pathname === path;
    const linkClass = (path)=>`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(path) ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`;
    const iconClass = (path, defaultColor)=>`w-4 h-4 ${isActive(path) ? defaultColor : 'text-gray-400'}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
        id: "mobile-sidebar",
        className: "hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#0f1115] h-screen fixed left-0 top-0 overflow-y-auto z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-6 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded bg-indigo-600 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                    className: "text-white w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-xl font-bold tracking-wide text-white",
                                children: "SentinelChain"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 27,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.jsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "lg:hidden p-2 text-gray-400 hover:text-white",
                        onClick: ()=>document.getElementById('mobile-sidebar').classList.add('hidden'),
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.jsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "px-4 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider",
                        children: "Command Center"
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.jsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        className: "space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                passHref: true,
                                legacyBehavior: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    className: linkClass('/'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                            className: iconClass('/', 'text-indigo-400')
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, this),
                                        " Dashboard"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/disruptions",
                                passHref: true,
                                legacyBehavior: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    className: linkClass('/disruptions'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                            className: iconClass('/disruptions', 'text-red-400')
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 44,
                                            columnNumber: 15
                                        }, this),
                                        " Active Disruptions"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/plans",
                                passHref: true,
                                legacyBehavior: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    className: linkClass('/plans'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                            className: iconClass('/plans', 'text-emerald-400')
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 49,
                                            columnNumber: 15
                                        }, this),
                                        " Recovery Plans"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.jsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.jsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "px-4 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider",
                        children: "Intelligence"
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.jsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        className: "space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/network",
                                passHref: true,
                                legacyBehavior: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    className: linkClass('/network'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                            className: iconClass('/network', 'text-blue-400')
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this),
                                        " Supply Network"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/risk",
                                passHref: true,
                                legacyBehavior: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    className: linkClass('/risk'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                            className: iconClass('/risk', 'text-orange-400')
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 65,
                                            columnNumber: 15
                                        }, this),
                                        " Risk Analysis"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.jsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.jsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.jsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-auto p-4 border-t border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 animate-[progress_2s_ease-in-out_infinite]"
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.jsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2",
                            children: "AI Sentinel Node"
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.jsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative flex items-center justify-center w-8 h-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-2 rounded-full bg-indigo-500/20"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-bold text-white",
                                            children: "Actively Scanning"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-indigo-400 font-mono mt-0.5",
                                            children: "32,491 Global Nodes"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.jsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.jsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.jsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Sidebar.jsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.jsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/data/events.json.[json].cjs [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "evt1",
        "text": "Part MCU-2201X export banned under new trade restrictions.",
        "affectedPart": "MCU-2201X"
    },
    {
        "id": "evt2",
        "text": "Factory fire at primary facility halts production of PWR-9942A.",
        "affectedPart": "PWR-9942A"
    },
    {
        "id": "evt3",
        "text": "Critical shortage of rare-earth metals delays MEM-64GB-NAND shipments globally.",
        "affectedPart": "MEM-64GB-NAND"
    }
];
}),
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.mjs [ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs [ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.mjs [ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$events$2e$json$2e5b$json$5d2e$cjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/events.json.[json].cjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Navbar.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const WorldMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/WorldMap.jsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/WorldMap.jsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function Dashboard() {
    const [selectedEvent, setSelectedEvent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$events$2e$json$2e5b$json$5d2e$cjs__$5b$ssr$5d$__$28$ecmascript$29$__["default"][0].text);
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [detectResult, setDetectResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [impactResult, setImpactResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [matchResult, setMatchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [negotiateResult, setNegotiateResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [chatRevealIndex, setChatRevealIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(-1);
    const [approved, setApproved] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // SAP Integration State
    const [sapStatus, setSapStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        s4hana: 'Offline',
        ariba: 'Offline',
        mode: 'DEMO MODE'
    });
    const [auditTrail, setAuditTrail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [aribaResponse, setAribaResponse] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Real-Time Intelligence State
    const [liveNews, setLiveNews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [activeNews, setActiveNews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetch('/api/sap/status').then((r)=>r.json()).then(setSapStatus);
        const fetchNews = ()=>{
            fetch('/api/news/latest').then((r)=>r.json()).then((news)=>{
                setLiveNews(news);
                // Only set activeNews on the very first load if it's empty
                setActiveNews((prev)=>prev || (news.length > 0 ? news[0] : null));
            });
        };
        fetchNews();
        // Auto-refresh the live disruption feed every 30 seconds
        const interval = setInterval(fetchNews, 30000);
        return ()=>clearInterval(interval);
    }, []);
    const addAudit = (source, message)=>{
        setAuditTrail((prev)=>[
                ...prev,
                {
                    time: new Date().toLocaleTimeString(),
                    source,
                    message
                }
            ]);
    };
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Auto-scroll chat
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [
        chatRevealIndex,
        negotiateResult
    ]);
    const simulatePipeline = async (newsArticle)=>{
        setLoading(true);
        setStage(1);
        setAuditTrail([]);
        setAribaResponse(null);
        setApproved(false);
        // 1. Detect
        const r1 = await fetch('/api/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                article: newsArticle
            })
        });
        const d1 = await r1.json();
        setDetectResult(d1);
        addAudit('Detection Agent', `${d1.reason || "No relevant disruption classified"}`);
        if (!d1.isDisruption) {
            addAudit('System', 'Event deemed non-critical to known supply chain. Pipeline halted.');
            setLoading(false);
            return;
        }
        await new Promise((r)=>setTimeout(r, 1000));
        setStage(2);
        // 2. Impact
        const r2 = await fetch('/api/impact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                partNumber: d1.partNumber,
                severity: d1.severity,
                confidence: d1.confidence
            })
        });
        const d2 = await r2.json();
        setImpactResult(d2);
        addAudit('SAP S/4HANA', `Material ${d1.partNumber} and BOM retrieved`);
        addAudit('Impact Agent', `${d2.affectedProducts.length} BOM dependencies identified`);
        await new Promise((r)=>setTimeout(r, 1200));
        setStage(3);
        // 3. Match
        const r3 = await fetch('/api/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                partNumber: d1.partNumber
            })
        });
        const d3 = await r3.json();
        setMatchResult(d3);
        addAudit('Cross-Reference', `${d3.length} compatible alternatives found`);
        await new Promise((r)=>setTimeout(r, 1500));
        setStage(4);
        // 4. Negotiate
        const r4 = await fetch('/api/negotiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                partNumber: d1.partNumber,
                options: d3
            })
        });
        const d4 = await r4.json();
        setNegotiateResult(d4);
        setLoading(false);
        let index = 0;
        setChatRevealIndex(0);
        const interval = setInterval(()=>{
            index++;
            setChatRevealIndex(index);
            if (index >= d4.chatLog.length) {
                clearInterval(interval);
                addAudit('Chase Agent', `Supplier quotes evaluated`);
                setTimeout(()=>setStage(5), 1500);
            }
        }, 1200);
    };
    const approvePlan = async ()=>{
        setApproved(true);
        addAudit('User', 'Recovery plan approved');
        const res = await fetch('/api/sap/recovery-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planDetails: negotiateResult.rankedPlan[0]
            })
        });
        const data = await res.json();
        setAribaResponse(data);
        addAudit('SAP Ariba', 'Procurement workflow submitted');
    };
    const getStageStatus = (currentStage, targetStage)=>{
        if (currentStage > targetStage) return 'COMPLETED';
        if (currentStage === targetStage) return loading ? 'PROCESSING' : 'ACTIVE';
        return 'PENDING';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-2e0f8612083557f1" + " " + "min-h-screen bg-[#0f1115] flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    className: "jsx-2e0f8612083557f1",
                    children: "SentinelChain | Supply Chain Command Center"
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "jsx-2e0f8612083557f1" + " " + "flex-1 lg:ml-64 flex flex-col min-h-screen relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-2e0f8612083557f1" + " " + "p-6 max-w-7xl mx-auto w-full space-y-6 pb-24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-2e0f8612083557f1" + " " + "flex flex-col md:flex-row gap-4 justify-between items-start mb-6 pb-6 border-b border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-2e0f8612083557f1" + " " + "flex gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel px-4 py-2 flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-500 uppercase font-bold tracking-wider",
                                                        children: "LIVE INTELLIGENCE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 187,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `text-xs font-semibold ${liveNews.length > 0 && liveNews[0].isLive ? 'text-emerald-400' : 'text-orange-400'}`,
                                                        children: [
                                                            "● ",
                                                            liveNews.length > 0 && liveNews[0].isLive ? 'CONNECTED' : 'DEMO MODE'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 188,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 186,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel px-4 py-2 flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-500 uppercase font-bold tracking-wider",
                                                        children: "SAP S/4HANA"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 191,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `text-xs font-semibold ${sapStatus.s4hana === 'Connected' ? 'text-emerald-400' : 'text-gray-400'}`,
                                                        children: [
                                                            "● ",
                                                            sapStatus.s4hana
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 192,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 190,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel px-4 py-2 flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-500 uppercase font-bold tracking-wider",
                                                        children: "SAP Ariba"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 195,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `text-xs font-semibold ${sapStatus.ariba === 'Connected' ? 'text-emerald-400' : 'text-gray-400'}`,
                                                        children: [
                                                            "● ",
                                                            sapStatus.ariba
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 196,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 194,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-2e0f8612083557f1" + " " + `px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${sapStatus.mode === 'LIVE SAP MODE' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-orange-500/50 bg-orange-500/10 text-orange-400'}`,
                                        children: sapStatus.mode
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 184,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-2e0f8612083557f1" + " " + "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-2e0f8612083557f1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                className: "jsx-2e0f8612083557f1" + " " + "text-3xl font-bold text-white tracking-tight",
                                                children: "Autonomous Supply Chain Recovery"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 206,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-2e0f8612083557f1" + " " + "text-gray-400 mt-1",
                                                children: "Real World → Enterprise Context → AI Decision → Procurement Action"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 207,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    (loading || stage > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setStage(0);
                                            setDetectResult(null);
                                            setImpactResult(null);
                                            setMatchResult(null);
                                            setNegotiateResult(null);
                                            setApproved(false);
                                            setAribaResponse(null);
                                            setAuditTrail([]);
                                            setActiveNews(null);
                                        },
                                        className: "jsx-2e0f8612083557f1" + " " + "px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10",
                                        children: "Reset System"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-2e0f8612083557f1" + " " + "grid grid-cols-1 lg:grid-cols-4 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-2e0f8612083557f1" + " " + "lg:col-span-1 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                                className: "w-4 h-4 text-emerald-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 225,
                                                                columnNumber: 19
                                                            }, this),
                                                            " Live Disruption Feed"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 224,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-500 tracking-wider",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 228,
                                                                columnNumber: 19
                                                            }, this),
                                                            " Auto-Sync"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 227,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 223,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "space-y-3",
                                                children: liveNews.map((news)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>{
                                                            if (!loading && stage === 0) {
                                                                setActiveNews(news);
                                                            }
                                                        },
                                                        className: "jsx-2e0f8612083557f1" + " " + `p-4 rounded-xl border transition-all cursor-pointer ${activeNews?.id === news.id ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'glass-panel hover:border-gray-500'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex justify-between items-start mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] font-bold text-gray-500 uppercase tracking-wider",
                                                                        children: news.source
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 247,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-500 flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                className: "w-3 h-3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 248,
                                                                                columnNumber: 91
                                                                            }, this),
                                                                            " ",
                                                                            new Date(news.publishedAt).toLocaleTimeString([], {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 248,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 246,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "text-sm font-bold text-white leading-tight mb-3",
                                                                children: news.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 250,
                                                                columnNumber: 21
                                                            }, this),
                                                            activeNews?.id === news.id && stage === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    simulatePipeline(news);
                                                                },
                                                                className: "jsx-2e0f8612083557f1" + " " + "w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(79,70,229,0.3)]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                        className: "w-3 h-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 256,
                                                                        columnNumber: 26
                                                                    }, this),
                                                                    " Analyze Impact"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 252,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, news.id, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 233,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-2e0f8612083557f1" + " " + "lg:col-span-3 space-y-6",
                                        children: [
                                            stage === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "animate-[fadeIn_0.5s_ease-out]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(WorldMap, {}, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 270,
                                                    columnNumber: 15
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 269,
                                                columnNumber: 13
                                            }, this),
                                            stage > 0 && detectResult && (detectResult.isDisruption ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel border-l-4 border-red-500 bg-red-950/20 p-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "bg-red-900/30 px-6 py-4 flex flex-wrap items-center justify-between border-b border-red-500/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/index.js",
                                                                            lineNumber: 281,
                                                                            columnNumber: 24
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 280,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-lg font-bold text-white tracking-wide",
                                                                        children: "CRITICAL DISRUPTION DETECTED"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 283,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 279,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "text-[10px] uppercase tracking-widest bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]",
                                                                children: [
                                                                    "Severity: ",
                                                                    detectResult.severity?.toUpperCase() || 'HIGH'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 285,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 278,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "p-6 grid grid-cols-1 md:grid-cols-3 gap-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "md:col-span-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2",
                                                                        children: "AI Diagnostic Assessment"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 292,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-gray-300 text-sm leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5 shadow-inner",
                                                                        children: detectResult.reason
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 293,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 291,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "space-y-4 md:border-l md:border-white/5 md:pl-6",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5",
                                                                                children: "Impacted Node"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 300,
                                                                                columnNumber: 24
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "font-mono text-base text-white font-bold bg-white/5 inline-block px-3 py-1 rounded border border-white/10",
                                                                                children: detectResult.partNumber
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 301,
                                                                                columnNumber: 24
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 299,
                                                                        columnNumber: 22
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1",
                                                                                children: "Disruption Classification"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 304,
                                                                                columnNumber: 24
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-sm text-red-400 font-semibold uppercase",
                                                                                children: detectResult.disruptionType || 'Supply Shock'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 305,
                                                                                columnNumber: 24
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 303,
                                                                        columnNumber: 22
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1",
                                                                                children: "AI Confidence Score"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 308,
                                                                                columnNumber: 24
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 mt-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            style: {
                                                                                                width: `${(detectResult.confidence || 0.9) * 100}%`
                                                                                            },
                                                                                            className: "jsx-2e0f8612083557f1" + " " + "bg-red-500 h-full rounded-full"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/index.js",
                                                                                            lineNumber: 311,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 310,
                                                                                        columnNumber: 26
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-white font-bold",
                                                                                        children: [
                                                                                            Math.round((detectResult.confidence || 0.9) * 100),
                                                                                            "%"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 313,
                                                                                        columnNumber: 26
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 309,
                                                                                columnNumber: 24
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 307,
                                                                        columnNumber: 22
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 298,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 290,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 277,
                                                columnNumber: 15
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel border-l-4 border-emerald-500 bg-emerald-950/10 p-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "bg-emerald-900/20 px-6 py-4 flex items-center gap-3 border-b border-emerald-500/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 323,
                                                                    columnNumber: 22
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 322,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "text-lg font-bold text-white tracking-wide",
                                                                children: "THREAT DISMISSED"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 325,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 321,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2",
                                                                children: "AI Diagnostic Assessment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 328,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "text-gray-300 text-sm leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5 shadow-inner",
                                                                children: detectResult.reason
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 329,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 327,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 320,
                                                columnNumber: 15
                                            }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "grid grid-cols-2 lg:grid-cols-5 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 1 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''}`,
                                                        children: [
                                                            stage === 1 && loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "absolute top-0 left-0 w-full h-1 bg-indigo-500/20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 341,
                                                                    columnNumber: 109
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 341,
                                                                columnNumber: 42
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center justify-between mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/30 text-indigo-400 border border-indigo-500/30",
                                                                    children: "AI LAYER"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 343,
                                                                    columnNumber: 17
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 342,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                        className: `w-4 h-4 ${stage >= 1 ? 'text-indigo-400' : 'text-gray-600'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 346,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + `font-semibold text-sm ${stage >= 1 ? 'text-white' : 'text-gray-500'}`,
                                                                        children: "Detection Agent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 347,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 345,
                                                                columnNumber: 15
                                                            }, this),
                                                            getStageStatus(stage, 1) === 'COMPLETED' && detectResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "mt-3 pt-3 border-t border-white/5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-400 uppercase tracking-wider",
                                                                        children: "Identified"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 351,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs font-mono text-indigo-300 mt-1 truncate",
                                                                        children: detectResult.partNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 352,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 350,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 340,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 2 ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-950/10' : ''} ${stage < 2 ? 'opacity-50' : ''}`,
                                                        children: [
                                                            stage === 2 && loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "absolute top-0 left-0 w-full h-1 bg-emerald-500/20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "h-full bg-emerald-500 animate-[progress_1.5s_ease-in-out_infinite]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 359,
                                                                    columnNumber: 110
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 359,
                                                                columnNumber: 42
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center justify-between mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-500/30",
                                                                    children: "ENTERPRISE"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 361,
                                                                    columnNumber: 17
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 360,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                                                        className: `w-4 h-4 ${stage >= 2 ? 'text-emerald-400' : 'text-gray-600'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 364,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + `font-semibold text-sm ${stage >= 2 ? 'text-white' : 'text-gray-500'}`,
                                                                        children: "SAP S/4HANA"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 365,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 363,
                                                                columnNumber: 15
                                                            }, this),
                                                            getStageStatus(stage, 2) === 'COMPLETED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "mt-3 pt-3 border-t border-white/5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-400 uppercase tracking-wider",
                                                                        children: "BOM Retrieved"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 369,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs font-mono text-emerald-300 mt-1 truncate",
                                                                        children: "Source of Truth"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 370,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 368,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 358,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 2 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''} ${stage < 2 ? 'opacity-50' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center justify-between mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/30 text-indigo-400 border border-indigo-500/30",
                                                                    children: "AI LAYER"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 378,
                                                                    columnNumber: 17
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 377,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                                        className: `w-4 h-4 ${stage >= 2 ? 'text-orange-400' : 'text-gray-600'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 381,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + `font-semibold text-sm ${stage >= 2 ? 'text-white' : 'text-gray-500'}`,
                                                                        children: "Impact Agent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 382,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 380,
                                                                columnNumber: 15
                                                            }, this),
                                                            getStageStatus(stage, 2) === 'COMPLETED' && impactResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "mt-3 pt-3 border-t border-white/5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-400 uppercase tracking-wider",
                                                                        children: "At Risk"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 386,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs font-mono text-orange-400 mt-1 truncate",
                                                                        children: [
                                                                            "$",
                                                                            impactResult.revenueAtRiskPerDay.toLocaleString(),
                                                                            "/day"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 387,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 385,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 376,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 3 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''} ${stage < 3 ? 'opacity-50' : ''}`,
                                                        children: [
                                                            stage === 3 && loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "absolute top-0 left-0 w-full h-1 bg-indigo-500/20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 394,
                                                                    columnNumber: 109
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 394,
                                                                columnNumber: 42
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center justify-between mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/30 text-indigo-400 border border-indigo-500/30",
                                                                    children: "AI LAYER"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 396,
                                                                    columnNumber: 17
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 395,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                                        className: `w-4 h-4 ${stage >= 3 ? 'text-blue-400' : 'text-gray-600'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 399,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + `font-semibold text-sm ${stage >= 3 ? 'text-white' : 'text-gray-500'}`,
                                                                        children: "Cross-Reference"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 400,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 398,
                                                                columnNumber: 15
                                                            }, this),
                                                            getStageStatus(stage, 3) === 'COMPLETED' && matchResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "mt-3 pt-3 border-t border-white/5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-400 uppercase tracking-wider",
                                                                        children: "Alternatives"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 404,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs font-mono text-blue-300 mt-1 truncate",
                                                                        children: [
                                                                            matchResult.length,
                                                                            " verified"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 405,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 403,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 393,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + `glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 4 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''} ${stage < 4 ? 'opacity-50' : ''}`,
                                                        children: [
                                                            stage === 4 && loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "absolute top-0 left-0 w-full h-1 bg-indigo-500/20",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 412,
                                                                    columnNumber: 109
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 412,
                                                                columnNumber: 42
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center justify-between mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/30 text-indigo-400 border border-indigo-500/30",
                                                                    children: "AI LAYER"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 414,
                                                                    columnNumber: 17
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 413,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                        className: `w-4 h-4 ${stage >= 4 ? 'text-purple-400' : 'text-gray-600'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 417,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + `font-semibold text-sm ${stage >= 4 ? 'text-white' : 'text-gray-500'}`,
                                                                        children: "Chase Agent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 418,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 416,
                                                                columnNumber: 15
                                                            }, this),
                                                            getStageStatus(stage, 4) === 'COMPLETED' && negotiateResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "mt-3 pt-3 border-t border-white/5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-[10px] text-gray-400 uppercase tracking-wider",
                                                                        children: "Evaluated"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 422,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs font-mono text-purple-300 mt-1 truncate",
                                                                        children: [
                                                                            negotiateResult.rankedPlan.length,
                                                                            " suppliers"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 423,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 421,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 411,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 338,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-2e0f8612083557f1" + " " + "grid grid-cols-1 lg:grid-cols-3 gap-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "lg:col-span-1 space-y-6",
                                                        children: [
                                                            stage >= 2 && impactResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel p-6 animate-[fadeInUp_0.4s_ease-out]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2",
                                                                        children: "Business Impact"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 435,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "space-y-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "bg-white/5 rounded-lg p-4 border border-white/5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 uppercase tracking-wider mb-1",
                                                                                        children: "Revenue at Risk"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 439,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-3xl font-bold text-orange-400",
                                                                                        children: [
                                                                                            "$",
                                                                                            impactResult.revenueAtRiskPerDay.toLocaleString(),
                                                                                            " ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-sm text-gray-500 font-normal",
                                                                                                children: "/ day"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 440,
                                                                                                columnNumber: 126
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 440,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 438,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 uppercase tracking-wider mb-2",
                                                                                        children: [
                                                                                            "Affected Products (",
                                                                                            impactResult.affectedProducts.length,
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 444,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex flex-wrap gap-2",
                                                                                        children: impactResult.affectedProducts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300",
                                                                                                children: p
                                                                                            }, p, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 447,
                                                                                                columnNumber: 27
                                                                                            }, this))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 445,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 443,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 437,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 434,
                                                                columnNumber: 17
                                                            }, this),
                                                            stage >= 3 && matchResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel p-6 animate-[fadeInUp_0.4s_ease-out]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2",
                                                                        children: "Compatible Alternatives"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 459,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "space-y-3",
                                                                        children: matchResult.map((alt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + `p-3 rounded-lg border ${i === 0 ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-white/5 border-white/5'}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex justify-between items-start mb-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "font-mono text-sm text-white font-bold",
                                                                                                children: alt.partNumber
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 464,
                                                                                                columnNumber: 27
                                                                                            }, this),
                                                                                            i === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-[9px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded",
                                                                                                children: "Top Match"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 465,
                                                                                                columnNumber: 39
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 463,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400",
                                                                                        children: alt.vendor
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 467,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-500 mt-2",
                                                                                        children: alt.note
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 468,
                                                                                        columnNumber: 25
                                                                                    }, this)
                                                                                ]
                                                                            }, i, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 462,
                                                                                columnNumber: 23
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 460,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 458,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 432,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2e0f8612083557f1" + " " + "lg:col-span-2 space-y-6",
                                                        children: [
                                                            stage >= 4 && negotiateResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel flex flex-col h-[400px] animate-[fadeInUp_0.4s_ease-out]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-xl",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-lg font-semibold text-white",
                                                                                        children: "Chase Agent"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 482,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400",
                                                                                        children: "Autonomous supplier negotiation"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 483,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 481,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            stage === 4 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 487,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-indigo-300 font-medium tracking-wide uppercase",
                                                                                        children: "Negotiating"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 488,
                                                                                        columnNumber: 25
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 486,
                                                                                columnNumber: 23
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 font-medium tracking-wide uppercase",
                                                                                    children: "Session Closed"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/index.js",
                                                                                    lineNumber: 492,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 491,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 480,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex-1 overflow-y-auto p-6 space-y-4",
                                                                        children: [
                                                                            negotiateResult.chatLog.slice(0, chatRevealIndex).map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-2e0f8612083557f1" + " " + `flex w-full ${msg.from === 'System' || msg.from === 'Chase Agent' ? 'justify-end' : 'justify-start'}`,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + `max-w-[80%] rounded-lg p-3 text-sm ${msg.from === 'System' || msg.from === 'Chase Agent' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'}`,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-[10px] uppercase tracking-wider mb-1 opacity-70 font-semibold",
                                                                                                children: msg.from
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 505,
                                                                                                columnNumber: 27
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1",
                                                                                                children: msg.text
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 506,
                                                                                                columnNumber: 27
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 500,
                                                                                        columnNumber: 25
                                                                                    }, this)
                                                                                }, i, false, {
                                                                                    fileName: "[project]/pages/index.js",
                                                                                    lineNumber: 499,
                                                                                    columnNumber: 23
                                                                                }, this)),
                                                                            stage === 4 && chatRevealIndex < negotiateResult.chatLog.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "flex justify-start",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-2e0f8612083557f1" + " " + "bg-gray-800 border border-gray-700 rounded-lg rounded-bl-none p-4 flex gap-1 items-center",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            style: {
                                                                                                animationDelay: '0ms'
                                                                                            },
                                                                                            className: "jsx-2e0f8612083557f1" + " " + "w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/index.js",
                                                                                            lineNumber: 513,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            style: {
                                                                                                animationDelay: '150ms'
                                                                                            },
                                                                                            className: "jsx-2e0f8612083557f1" + " " + "w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/index.js",
                                                                                            lineNumber: 514,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            style: {
                                                                                                animationDelay: '300ms'
                                                                                            },
                                                                                            className: "jsx-2e0f8612083557f1" + " " + "w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/index.js",
                                                                                            lineNumber: 515,
                                                                                            columnNumber: 27
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/index.js",
                                                                                    lineNumber: 512,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 511,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                ref: chatEndRef,
                                                                                className: "jsx-2e0f8612083557f1"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 519,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 497,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 479,
                                                                columnNumber: 17
                                                            }, this),
                                                            stage === 5 && negotiateResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel-success p-8 animate-[scaleIn_0.5s_ease-out]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-4 mb-6",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                    className: "w-6 h-6 text-emerald-400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/index.js",
                                                                                    lineNumber: 529,
                                                                                    columnNumber: 23
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 528,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-2xl font-bold text-white",
                                                                                        children: "Recovery Plan Ready"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 532,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-emerald-300/80",
                                                                                        children: "AI-ranked response to MCU-2201X disruption"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 533,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 531,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 527,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "bg-black/20 rounded-lg border border-emerald-500/20 p-5 mb-6",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "grid grid-cols-2 md:grid-cols-4 gap-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 uppercase tracking-wider mb-1",
                                                                                                children: "Supplier"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 540,
                                                                                                columnNumber: 25
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "font-semibold text-white",
                                                                                                children: negotiateResult.rankedPlan[0].vendor
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 541,
                                                                                                columnNumber: 25
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 539,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 uppercase tracking-wider mb-1",
                                                                                                children: "Replacement Part"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 544,
                                                                                                columnNumber: 25
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "font-mono font-semibold text-white",
                                                                                                children: negotiateResult.rankedPlan[0].part
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 545,
                                                                                                columnNumber: 25
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 543,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 uppercase tracking-wider mb-1",
                                                                                                children: "Quantity"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 548,
                                                                                                columnNumber: 25
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "font-semibold text-white",
                                                                                                children: [
                                                                                                    negotiateResult.rankedPlan[0].quantity.toLocaleString(),
                                                                                                    " units"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 549,
                                                                                                columnNumber: 25
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 547,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 uppercase tracking-wider mb-1",
                                                                                                children: "Lead Time"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 552,
                                                                                                columnNumber: 25
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "font-semibold text-emerald-400",
                                                                                                children: [
                                                                                                    negotiateResult.rankedPlan[0].days,
                                                                                                    " days"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 553,
                                                                                                columnNumber: 25
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 551,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 538,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "mt-4 pt-4 border-t border-white/10 flex justify-between items-center",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-sm text-gray-400",
                                                                                        children: [
                                                                                            "Score: ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-emerald-400 font-semibold",
                                                                                                children: negotiateResult.rankedPlan[0].score
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 557,
                                                                                                columnNumber: 67
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 557,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-sm text-gray-400",
                                                                                        children: [
                                                                                            "Risk Reduction: ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-2e0f8612083557f1" + " " + "text-emerald-400 font-semibold",
                                                                                                children: "94%"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 558,
                                                                                                columnNumber: 76
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 558,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 556,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 537,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex justify-end gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "px-6 py-3 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 cursor-not-allowed opacity-50",
                                                                                children: "View Details"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 563,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            approved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "flex flex-col items-end gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "flex items-center gap-2 px-6 py-3 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 font-semibold rounded-lg",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                                className: "w-5 h-5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/index.js",
                                                                                                lineNumber: 571,
                                                                                                columnNumber: 27
                                                                                            }, this),
                                                                                            " SAP Ariba Integration Queued"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 570,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    aribaResponse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "text-xs text-gray-400 font-mono",
                                                                                        children: [
                                                                                            "Doc ID: ",
                                                                                            aribaResponse.documentId,
                                                                                            " (",
                                                                                            aribaResponse.sapSource,
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 574,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 569,
                                                                                columnNumber: 23
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: approvePlan,
                                                                                className: "jsx-2e0f8612083557f1" + " " + "bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                        className: "w-5 h-5"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 582,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    " Approve & Send to SAP Ariba"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 578,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 562,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 526,
                                                                columnNumber: 17
                                                            }, this),
                                                            stage > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-2e0f8612083557f1" + " " + "glass-panel overflow-hidden animate-[fadeIn_0.5s_ease-out] border-gray-700 bg-gray-950/80",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-800",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "w-2.5 h-2.5 rounded-full bg-red-500/80"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 593,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "w-2.5 h-2.5 rounded-full bg-yellow-500/80"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 594,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "w-2.5 h-2.5 rounded-full bg-green-500/80"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 595,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "ml-2 text-[10px] font-mono text-gray-500",
                                                                                children: "root@sentinel-ai:~/audit"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 596,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 592,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-2e0f8612083557f1" + " " + "p-4 font-mono text-xs space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar",
                                                                        children: [
                                                                            auditTrail.map((log, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-2e0f8612083557f1" + " " + "flex flex-col gap-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-2e0f8612083557f1" + " " + "flex gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-emerald-500",
                                                                                                    children: [
                                                                                                        "[",
                                                                                                        log.time,
                                                                                                        "]"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/index.js",
                                                                                                    lineNumber: 602,
                                                                                                    columnNumber: 27
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-2e0f8612083557f1" + " " + "text-indigo-400 font-bold",
                                                                                                    children: [
                                                                                                        log.source,
                                                                                                        ":"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/index.js",
                                                                                                    lineNumber: 603,
                                                                                                    columnNumber: 27
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/index.js",
                                                                                            lineNumber: 601,
                                                                                            columnNumber: 25
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-2e0f8612083557f1" + " " + "text-gray-300 pl-4 border-l-2 border-gray-800 ml-2",
                                                                                            children: log.message
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/index.js",
                                                                                            lineNumber: 605,
                                                                                            columnNumber: 25
                                                                                        }, this)
                                                                                    ]
                                                                                }, i, true, {
                                                                                    fileName: "[project]/pages/index.js",
                                                                                    lineNumber: 600,
                                                                                    columnNumber: 23
                                                                                }, this)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-2e0f8612083557f1" + " " + "flex gap-2 items-center text-emerald-500 mt-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-2e0f8612083557f1",
                                                                                        children: "root@sentinel-ai:~$"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 611,
                                                                                        columnNumber: 23
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-2e0f8612083557f1" + " " + "w-2 h-4 bg-emerald-500 animate-[pulse_1s_step-end_infinite]"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/index.js",
                                                                                        lineNumber: 612,
                                                                                        columnNumber: 23
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/index.js",
                                                                                lineNumber: 610,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 598,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 591,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 477,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 430,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "2e0f8612083557f1",
                children: "@keyframes progress{0%{width:0%;transform:translate(0)}50%{width:50%;transform:translate(50%)}to{width:100%;transform:translate(100%)}}@keyframes fadeInUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes scaleIn{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1gewmu7._.js.map