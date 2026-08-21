module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/data/components.json.[json].cjs [api] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "partNumber": "MCU-2201X",
        "name": "32-bit Automotive Microcontroller",
        "usedInProducts": [
            "EV Charging Controller",
            "Smart Thermostat V3"
        ],
        "revenueAtRiskPerDay": 42000
    },
    {
        "partNumber": "PWR-9942A",
        "name": "High-Voltage Power IC",
        "usedInProducts": [
            "Industrial Motor Drive",
            "Solar Inverter"
        ],
        "revenueAtRiskPerDay": 85000
    },
    {
        "partNumber": "MEM-64GB-NAND",
        "name": "64GB NAND Flash",
        "usedInProducts": [
            "Flagship Smartphone X",
            "Tablet Pro 12"
        ],
        "revenueAtRiskPerDay": 120000
    }
];
}),
"[project]/pages/api/impact.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$components$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/components.json.[json].cjs [api] (ecmascript)");
;
function handler(req, res) {
    const { partNumber } = req.body;
    const component = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$components$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__["default"].find((c)=>c.partNumber === partNumber);
    if (component) {
        res.status(200).json({
            affectedProducts: component.usedInProducts,
            revenueAtRiskPerDay: component.revenueAtRiskPerDay
        });
    } else {
        res.status(404).json({
            error: "Part not found"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0zt3w5u._.js.map