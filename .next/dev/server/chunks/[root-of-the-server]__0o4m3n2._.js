module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/data/distributors.json.[json].cjs [api] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "name": "Distributor A",
        "leadTimeDays": 6,
        "unitsAvailable": 12000,
        "price": 4.5
    },
    {
        "name": "Distributor B",
        "leadTimeDays": 14,
        "unitsAvailable": 50000,
        "price": 3.8
    },
    {
        "name": "Distributor C",
        "leadTimeDays": 2,
        "unitsAvailable": 2500,
        "price": 8.0
    }
];
}),
"[project]/pages/api/negotiate.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$distributors$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/distributors.json.[json].cjs [api] (ecmascript)");
;
async function handler(req, res) {
    const { partNumber, options } = req.body;
    const prompt = `You are a procurement AI called "Chase Agent" negotiating with distributors to buy replacements for ${partNumber}.
Available replacement options: ${JSON.stringify(options)}
Available distributors and their typical data: ${JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$distributors$2e$json$2e5b$json$5d2e$cjs__$5b$api$5d$__$28$ecmascript$29$__["default"])}

Roleplay a brief negotiation. The system drafts an RFQ, then distributors reply with realistic quotes (quantity, lead time, price), then the system analyzes it.

Return ONLY a valid JSON object with TWO keys:
1. "chatLog": an array of message objects { "from": "...", "text": "..." }. The first and last messages must be from "System". The middle messages must be from the specific distributors replying to the RFQ.
2. "rankedPlan": an array of 2 recovery plan options, ranked best to worst. Each object needs: "vendor", "part", "quantity" (number), "days" (number), "score" (string, e.g. "Optimal Value").

Ensure the JSON is strictly valid.`;
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
                temperature: 0.6
            })
        });
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        // Ensure the required keys exist
        if (parsed.chatLog && parsed.rankedPlan) {
            return res.status(200).json(parsed);
        } else {
            throw new Error("Missing keys in Groq response");
        }
    } catch (err) {
        console.error("Groq API Error in negotiate:", err);
        // Graceful fallback to static data
        let chatLog = [
            {
                from: "System",
                text: "Drafting RFQ for alternative parts..."
            },
            {
                from: "System",
                text: "Negotiation failed or timed out. Falling back to cached supplier agreements..."
            }
        ];
        let plan = [
            {
                vendor: "Primary Distributor",
                part: options[0]?.partNumber || "Unknown",
                quantity: 5000,
                days: 5,
                score: "Default Plan"
            }
        ];
        return res.status(200).json({
            chatLog,
            rankedPlan: plan
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0o4m3n2._.js.map