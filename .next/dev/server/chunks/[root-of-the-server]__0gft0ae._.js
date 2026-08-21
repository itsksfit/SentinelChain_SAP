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
"[project]/lib/sap/auth.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAribaAccessToken",
    ()=>getAribaAccessToken,
    "getS4HanaAccessToken",
    ()=>getS4HanaAccessToken
]);
// lib/sap/auth.js
let cachedS4Token = null;
let s4TokenExpiry = null;
let cachedAribaToken = null;
let aribaTokenExpiry = null;
async function getS4HanaAccessToken() {
    const { SAP_S4_BASE_URL, SAP_S4_CLIENT_ID, SAP_S4_CLIENT_SECRET } = process.env;
    if (!SAP_S4_BASE_URL || !SAP_S4_CLIENT_ID || !SAP_S4_CLIENT_SECRET) {
        return null; // Demo Mode
    }
    if (cachedS4Token && s4TokenExpiry > Date.now()) {
        return cachedS4Token;
    }
    try {
        const authString = Buffer.from(`${SAP_S4_CLIENT_ID}:${SAP_S4_CLIENT_SECRET}`).toString('base64');
        const response = await fetch(`${SAP_S4_BASE_URL}/oauth/token?grant_type=client_credentials`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!response.ok) throw new Error('S/4HANA Auth Failed');
        const data = await response.json();
        cachedS4Token = data.access_token;
        s4TokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
        return cachedS4Token;
    } catch (error) {
        console.error("SAP S/4HANA Authentication Error:", error);
        return null;
    }
}
async function getAribaAccessToken() {
    const { SAP_ARIBA_BASE_URL, SAP_ARIBA_CLIENT_ID, SAP_ARIBA_CLIENT_SECRET } = process.env;
    if (!SAP_ARIBA_BASE_URL || !SAP_ARIBA_CLIENT_ID || !SAP_ARIBA_CLIENT_SECRET) {
        return null; // Demo Mode
    }
    if (cachedAribaToken && aribaTokenExpiry > Date.now()) {
        return cachedAribaToken;
    }
    try {
        const authString = Buffer.from(`${SAP_ARIBA_CLIENT_ID}:${SAP_ARIBA_CLIENT_SECRET}`).toString('base64');
        const response = await fetch(`${SAP_ARIBA_BASE_URL}/oauth/token?grant_type=client_credentials`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!response.ok) throw new Error('Ariba Auth Failed');
        const data = await response.json();
        cachedAribaToken = data.access_token;
        aribaTokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
        return cachedAribaToken;
    } catch (error) {
        console.error("SAP Ariba Authentication Error:", error);
        return null;
    }
}
}),
"[project]/lib/sap/client.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sapGet",
    ()=>sapGet,
    "sapPost",
    ()=>sapPost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sap/auth.js [api] (ecmascript)");
;
async function sapGet(url, system = 's4hana') {
    const sandboxKey = process.env.SAP_SANDBOX_API_KEY;
    let token = null;
    if (!sandboxKey) {
        token = system === 's4hana' ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getS4HanaAccessToken"])() : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getAribaAccessToken"])();
        if (!token) return null; // Fallback to demo mode if neither Sandbox key nor OAuth token exists
    }
    const headers = {
        'Accept': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (sandboxKey) headers['APIKey'] = sandboxKey;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers
        });
        if (!response.ok) throw new Error(`SAP ${system} GET failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`SAP API Error (${system}):`, error);
        return null;
    }
}
async function sapPost(url, payload, system = 's4hana') {
    const sandboxKey = process.env.SAP_SANDBOX_API_KEY;
    let token = null;
    if (!sandboxKey) {
        token = system === 's4hana' ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getS4HanaAccessToken"])() : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getAribaAccessToken"])();
        if (!token) return null;
    }
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (sandboxKey) headers['APIKey'] = sandboxKey;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`SAP ${system} POST failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`SAP API Error (${system}):`, error);
        return null;
    }
}
}),
"[project]/lib/sap/s4hana.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMaterial",
    ()=>getMaterial
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$client$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sap/client.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$components$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/components.json.[json].cjs [api] (ecmascript)");
;
;
async function getMaterial(materialId) {
    const { SAP_S4_BASE_URL } = process.env;
    if (!SAP_S4_BASE_URL) return getMockMaterial(materialId);
    // Map our mock components to an actual SAP Sandbox test product (TG11) so the network call succeeds 200 OK!
    const sapMaterialId = "TG11";
    // SAP S/4HANA Cloud API (API_PRODUCT_SRV)
    const url = `${SAP_S4_BASE_URL}/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('${sapMaterialId}')?$format=json`;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$client$2e$js__$5b$api$5d$__$28$ecmascript$29$__["sapGet"])(url, 's4hana');
    if (result && result.d) {
        const mockContext = getMockMaterial(materialId); // Keep our rich UI context
        return {
            partNumber: materialId,
            sapSandboxId: result.d.Product,
            name: mockContext.name,
            usedInProducts: mockContext.usedInProducts,
            revenueAtRiskPerDay: mockContext.revenueAtRiskPerDay,
            sapRawData: result.d // Exposing the raw SAP object for the frontend to show
        };
    }
    return getMockMaterial(materialId);
}
function getMockMaterial(materialId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$components$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__["default"].find((c)=>c.partNumber === materialId) || null;
}
}),
"[project]/pages/api/impact.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$s4hana$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sap/s4hana.js [api] (ecmascript)");
;
async function handler(req, res) {
    const { partNumber, severity, confidence } = req.body;
    // 1. Fetch raw enterprise data from SAP S/4HANA (Sandbox or Fallback)
    const component = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sap$2f$s4hana$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getMaterial"])(partNumber);
    if (!component) {
        return res.status(404).json({
            error: "Part not found"
        });
    }
    // 2. Use Groq AI to act as the "Impact Agent" to mathematically calculate the risk
    const prompt = `You are an AI financial supply chain analyst.
The company is facing a disruption for the following SAP component:
Component ID: ${component.partNumber}
SAP Raw Data / Weights: ${JSON.stringify(component.sapRawData || {})}
Downstream Products: ${JSON.stringify(component.usedInProducts)}
Disruption Severity: ${severity || 'high'}
AI Confidence in disruption: ${confidence || 0.9}

Based on this enterprise data, dynamically calculate the estimated daily revenue at risk in USD. 
Keep the numbers grounded. If the component is critical, the impact should be around $25,000 to $45,000/day. 
If it's a minor component, it should be around $5,000 to $12,000/day.
Factor in the severity and confidence score to adjust the final number.

Return ONLY a strictly valid JSON object with exactly ONE key: "revenueAtRiskPerDay" (a number). No markdown.`;
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: {
                    type: "json_object"
                },
                temperature: 0.5
            })
        });
        const aiResponse = await response.json();
        const result = JSON.parse(aiResponse.choices[0].message.content);
        res.status(200).json({
            affectedProducts: component.usedInProducts,
            revenueAtRiskPerDay: result.revenueAtRiskPerDay,
            sapSource: process.env.SAP_S4_BASE_URL ? "LIVE SAP MODE" : "DEMO MODE",
            calculatedByAI: true
        });
    } catch (err) {
        console.error("Groq Impact API Error:", err);
        // Fallback to the SAP/Mock base data if the AI fails
        res.status(200).json({
            affectedProducts: component.usedInProducts,
            revenueAtRiskPerDay: component.revenueAtRiskPerDay,
            sapSource: process.env.SAP_S4_BASE_URL ? "LIVE SAP MODE" : "DEMO MODE"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0gft0ae._.js.map