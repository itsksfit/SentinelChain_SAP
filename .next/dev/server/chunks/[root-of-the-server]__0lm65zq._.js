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
"[project]/pages/api/detect.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$components$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/components.json.[json].cjs [api] (ecmascript)");
;
async function handler(req, res) {
    const { article } = req.body;
    const partNumbers = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$components$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__["default"].map((c)=>c.partNumber);
    const textToAnalyze = article ? `${article.title}. ${article.description}` : req.body.eventText;
    const prompt = `You are a strict, highly accurate supply-chain disruption classifier.
Known enterprise part numbers in our system: ${JSON.stringify(partNumbers)}
News Article: "${textToAnalyze}"

Your job is to identify if this news FACTUALLY affects any of our known enterprise parts.
- If the news is about microcontrollers, chips, automotive silicon, or TSMC, map it to "MCU-2201X".
- If the news is about memory, storage, NAND, or rare-earth materials, map it to "MEM-64GB-NAND".
- If the news is about power ICs, batteries, industrial machinery, or factory fires, map it to "PWR-9942A".

CRITICAL INSTRUCTION: If the news is generic macroeconomics (e.g. stock market updates, general politics, generic tariffs) or completely unrelated, you MUST set "isDisruption" to false and "partNumber" to null. DO NOT hallucinate a connection.

If it IS a disruption, write a highly specific, factual 1-sentence reason linking the news to the chosen part number. If it is NOT a disruption, write "News event does not directly impact the tracked enterprise BOM."

Return ONLY a valid JSON object with EXACTLY these keys: 
"isDisruption" (boolean), "partNumber" (string or null), "reason" (string), "severity" (string), "confidence" (number), "disruptionType" (string).`;
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
                temperature: 0.1 // Low temperature for factual, strict matching
            })
        });
        let aiResponse = await response.json();
        let result = JSON.parse(aiResponse.choices[0].message.content);
        // Strict validation: if part number isn't in our system, it's not a disruption
        if (result.partNumber && !partNumbers.includes(result.partNumber)) {
            result.isDisruption = false;
            result.partNumber = null;
        }
        res.status(200).json(result);
    } catch (err) {
        console.error("Groq API Error in detect:", err);
        // Fallback if API fails, do not hallucinate a fake disruption
        res.status(200).json({
            isDisruption: false,
            partNumber: null,
            reason: "Analysis unavailable or event deemed non-critical (API Fallback)",
            severity: "low",
            confidence: 0,
            disruptionType: "NONE"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0lm65zq._.js.map