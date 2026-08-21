(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/WorldMap.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorldMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$globe$2e$gl$2f$dist$2f$react$2d$globe$2e$gl$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-globe.gl/dist/react-globe.gl.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function WorldMap() {
    _s();
    const globeEl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])();
    const [arcsData, setArcsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [places, setPlaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldMap.useEffect": ()=>{
            // Generate some mock supply chain routes
            const routes = [
                {
                    startLat: 31.23,
                    startLng: 121.47,
                    endLat: 1.35,
                    endLng: 103.81,
                    color: '#3b82f6'
                },
                {
                    startLat: 1.35,
                    startLng: 103.81,
                    endLat: 28.61,
                    endLng: 77.20,
                    color: '#ef4444'
                },
                {
                    startLat: 51.50,
                    startLng: -0.12,
                    endLat: 40.71,
                    endLng: -74.00,
                    color: '#10b981'
                },
                {
                    startLat: 35.67,
                    startLng: 139.65,
                    endLat: 37.77,
                    endLng: -122.41,
                    color: '#3b82f6'
                },
                {
                    startLat: -33.86,
                    startLng: 151.20,
                    endLat: 1.35,
                    endLng: 103.81,
                    color: '#f59e0b'
                } // Sydney to Singapore
            ];
            setArcsData(routes);
            const locations = [
                {
                    lat: 31.23,
                    lng: 121.47,
                    name: 'Shanghai (Supplier)',
                    size: 1.5,
                    color: 'white'
                },
                {
                    lat: 1.35,
                    lng: 103.81,
                    name: 'Singapore (Hub)',
                    size: 2,
                    color: 'red'
                },
                {
                    lat: 28.61,
                    lng: 77.20,
                    name: 'Delhi (Destination)',
                    size: 1.5,
                    color: 'white'
                },
                {
                    lat: 40.71,
                    lng: -74.00,
                    name: 'New York (Port)',
                    size: 1.5,
                    color: 'white'
                },
                {
                    lat: 51.50,
                    lng: -0.12,
                    name: 'London (HQ)',
                    size: 2,
                    color: 'white'
                }
            ];
            setPlaces(locations);
        }
    }["WorldMap.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldMap.useEffect": ()=>{
            // Auto-rotate
            if (globeEl.current) {
                globeEl.current.controls().autoRotate = true;
                globeEl.current.controls().autoRotateSpeed = 1.0;
                globeEl.current.controls().enableZoom = false;
            }
        }
    }["WorldMap.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-[350px] overflow-hidden flex items-center justify-center bg-[#0a0a0a] rounded-xl border border-white/10 relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-lg border border-white/5 bg-black/50 backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[10px] uppercase font-bold text-gray-400 tracking-wider",
                    children: "3D Global Supply Network"
                }, void 0, false, {
                    fileName: "[project]/components/WorldMap.jsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/WorldMap.jsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$globe$2e$gl$2f$dist$2f$react$2d$globe$2e$gl$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                ref: globeEl,
                width: 400,
                height: 300,
                backgroundColor: "#0a0a0a",
                globeImageUrl: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
                arcsData: arcsData,
                arcStartLat: (d)=>d.startLat,
                arcStartLng: (d)=>d.startLng,
                arcEndLat: (d)=>d.endLat,
                arcEndLng: (d)=>d.endLng,
                arcColor: (d)=>d.color,
                arcDashLength: 0.4,
                arcDashGap: 0.2,
                arcDashAnimateTime: 1500,
                labelsData: places,
                labelLat: (d)=>d.lat,
                labelLng: (d)=>d.lng,
                labelText: (d)=>d.name,
                labelSize: (d)=>d.size,
                labelDotRadius: (d)=>d.size * 0.5,
                labelColor: (d)=>d.color,
                labelResolution: 2
            }, void 0, false, {
                fileName: "[project]/components/WorldMap.jsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WorldMap.jsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(WorldMap, "l+Z1/bzN0CjrVSelE5izR1PZtkw=");
_c = WorldMap;
var _c;
__turbopack_context__.k.register(_c, "WorldMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/WorldMap.jsx [client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/components/WorldMap.jsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_WorldMap_jsx_0qyqw4j._.js.map