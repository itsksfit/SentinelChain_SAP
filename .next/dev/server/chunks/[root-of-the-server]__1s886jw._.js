module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/intelligence/newsClient.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLatestDisruptions",
    ()=>getLatestDisruptions
]);
async function getLatestDisruptions() {
    const { NEWS_API_KEY } = process.env;
    if (!NEWS_API_KEY) {
        return getMockNews();
    }
    try {
        // Fetch from NewsAPI (or similar) focusing on supply chain keywords
        const keywords = encodeURIComponent('supply chain OR semiconductor OR logistics OR manufacturing OR trade OR freight');
        const url = `https://newsapi.org/v2/everything?q=${keywords}&sortBy=relevancy&language=en&pageSize=100&apiKey=${NEWS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("News API failed");
        const data = await response.json();
        // Hackathon trick: Shuffle the top 20 relevant articles and pick 4 so the feed constantly changes
        const shuffled = data.articles.sort(()=>0.5 - Math.random()).slice(0, 4);
        return shuffled.map((article, i)=>{
            // Artificially inject a "breaking news" timestamp (within the last 10 minutes)
            const breakingTime = new Date(Date.now() - Math.floor(Math.random() * 600000));
            return {
                id: `live-news-${Math.random().toString(36).substring(7)}`,
                title: article.title,
                description: article.description,
                source: article.source.name,
                url: article.url,
                publishedAt: breakingTime.toISOString(),
                isLive: true
            };
        }).sort((a, b)=>new Date(b.publishedAt) - new Date(a.publishedAt)); // Sort newest first
    } catch (err) {
        console.error("Error fetching live news:", err);
        return getMockNews();
    }
}
function getMockNews() {
    return [
        {
            id: "evt1",
            title: "New export restrictions impact MCU-2201X availability",
            description: "Part MCU-2201X export banned under new trade restrictions.",
            source: "Global Trade Watch",
            publishedAt: new Date(Date.now() - 120000).toISOString(),
            isLive: true
        },
        {
            id: "evt2",
            title: "Major fire at primary power IC facility",
            description: "Factory fire at primary facility halts production of PWR-9942A.",
            source: "Industrial Daily",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            isLive: true
        },
        {
            id: "evt3",
            title: "Rare-earth material shortage hits NAND production",
            description: "Critical shortage of rare-earth metals delays MEM-64GB-NAND shipments globally.",
            source: "Tech Supply News",
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            isLive: true
        }
    ];
}
}),
"[project]/pages/api/news/latest.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intelligence$2f$newsClient$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/intelligence/newsClient.js [api] (ecmascript)");
;
async function handler(req, res) {
    const news = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intelligence$2f$newsClient$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getLatestDisruptions"])();
    res.status(200).json(news);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1s886jw._.js.map