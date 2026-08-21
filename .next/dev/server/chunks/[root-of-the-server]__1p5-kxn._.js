module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/data/alternatives.json.[json].cjs [api] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "MCU-2201X": [
        {
            "partNumber": "MCU-2201X-ALT1",
            "vendor": "Distributor A",
            "note": "Pin-compatible, same voltage & package"
        },
        {
            "partNumber": "MCU-3301Y",
            "vendor": "Distributor B",
            "note": "Requires slight PCB layout change, but available in volume"
        },
        {
            "partNumber": "MCU-1100Z",
            "vendor": "Distributor C",
            "note": "Lower performance but pin-compatible drop-in"
        }
    ],
    "PWR-9942A": [
        {
            "partNumber": "PWR-9942B-REV2",
            "vendor": "PowerGlobal Inc.",
            "note": "Direct replacement, slightly higher thermal output"
        },
        {
            "partNumber": "VOLT-8800",
            "vendor": "ElectroSource",
            "note": "Pin-compatible, certified for industrial use"
        }
    ],
    "MEM-64GB-NAND": [
        {
            "partNumber": "MEM-128GB-NAND",
            "vendor": "StorageTech",
            "note": "Higher capacity, same form factor, higher cost"
        },
        {
            "partNumber": "NAND-64-IND",
            "vendor": "GlobalChips",
            "note": "Industrial grade, identical specs"
        }
    ]
};
}),
"[project]/pages/api/match.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$alternatives$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/alternatives.json.[json].cjs [api] (ecmascript)");
;
async function handler(req, res) {
    const { partNumber } = req.body;
    const alts = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$alternatives$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__["default"][partNumber] || [];
    if (alts.length === 0) {
        return res.status(200).json([]);
    }
    const prompt = `You are an AI supply chain assistant evaluating replacement parts.
Original Part: ${partNumber}
Available Alternatives: ${JSON.stringify(alts)}

Please rank these alternatives from best to worst based on their notes (pin-compatible and direct replacements are better).
Return ONLY a valid JSON object containing an array called "matches", where each item has the original keys ("partNumber", "vendor", "note").

Example output format:
{
  "matches": [
    { "partNumber": "...", "vendor": "...", "note": "..." }
  ]
}
`;
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3.6-27b",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: {
                    type: "json_object"
                },
                temperature: 0.1
            })
        });
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        if (parsed.matches && Array.isArray(parsed.matches)) {
            res.status(200).json(parsed.matches);
        } else {
            res.status(200).json(alts); // Fallback to unsorted if format is wrong
        }
    } catch (err) {
        console.error("Groq API Error in match:", err);
        res.status(200).json(alts);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1p5-kxn._.js.map