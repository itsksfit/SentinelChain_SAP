module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/negotiate.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
;
async function handler(req, res) {
    const { partNumber, options } = req.body;
    const prompt = `You are a highly advanced procurement AI called "Chase Agent" autonomously negotiating with electronics distributors to buy emergency replacements for ${partNumber}.
Available options to buy: ${JSON.stringify(options)}

Generate a highly realistic, dynamic negotiation chat log. Do NOT just output a standard template. 
- The system must aggressively negotiate on price and lead time.
- Distributors should push back (e.g., "Due to the recent shortage, we can't do $3.80, best is $4.10" or "We can expedite shipping for an extra fee").
- The system should play distributors against each other (e.g., "Distributor B is offering 14 days, can you beat that?").
- The system must eventually make a mathematical decision and rank the top 2 plans.

Return ONLY a strictly valid JSON object with exactly TWO keys:
1. "chatLog": an array of objects { "from": "Chase Agent" or "Distributor Name", "text": "..." }. 
2. "rankedPlan": an array of 2 objects ranked best to worst. Each needs: "vendor", "part", "quantity" (number), "days" (number), "score" (string, e.g. "Optimal Value", "Emergency Backup").

Ensure JSON is valid. NO markdown wrapping.`;
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
                temperature: 0.9
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0rpchmw._.js.map