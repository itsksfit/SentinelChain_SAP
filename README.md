# 🛡️ SentinelChain

**Autonomous Supply Chain Resilience & Procurement Platform**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Live_on_Vercel-success?style=for-the-badge&logo=vercel)](https://sentinelchain-gilt.vercel.app)

SentinelChain is an AI-powered enterprise pipeline that transforms supply-chain risk management from a reactive, manual process into an autonomous, self-healing workflow. Designed specifically for the **Global Semiconductor Industry**, SentinelChain sits seamlessly between live global intelligence feeds and enterprise ERP software (SAP). It detects real-time disruptions, calculates massive financial impacts, engineers pin-compatible chip alternatives on the fly, and negotiates procurement—all in seconds.

## 🚀 The Problem
When a global disruption occurs (e.g., a factory fire, a port strike, or geopolitical export restrictions), traditional procurement teams take weeks to manually cross-reference their Bill of Materials (BOM), email suppliers, and draft Purchase Requisitions. By the time humans react, competitors have already bought out the remaining global inventory.

**SentinelChain turns a two-week human process into a two-minute autonomous AI workflow.**

## 🧠 The Multi-Agent AI Architecture

Our architecture is powered by a **Multi-Agent Generative AI framework** (via Groq / `gpt-oss-120b`), working in four autonomous stages:

1. **📡 Detection Agent (Live Intelligence)**
   - Continuously ingests live global news via a heavily optimized NewsAPI pipeline.
   - Strictly filters irrelevant news and maps real-world macroeconomic events (e.g., TSMC yield drops, NVIDIA export bans) directly to the enterprise Bill of Materials using rigid factual LLM guardrails.

2. **💥 Impact Agent (The AI CFO)**
   - Connects to the **SAP S/4HANA Business Accelerator Hub** (The "Brain").
   - Extracts real-time enterprise baseline data and dynamically calculates exact daily revenue at risk in USD (e.g., scaling up to $1.5M+/day for critical AI accelerators like the A100 GPU).

3. **⚙️ Match & Chase Agents (Engineering & Negotiation)**
   - **Match Agent:** Acts as an AI electronics engineer. Instead of hardcoded databases, it uses internal LLM knowledge to dynamically generate commercially viable, pin-compatible alternative chips from global distributors (Digi-Key, Mouser, Arrow).
   - **Chase Agent:** Acts as an autonomous procurement officer. It aggressively haggles with global distributors on price and lead times via conversational inference to find the mathematically optimal recovery path.

4. **💼 Execution Agent (SAP Ariba Sandbox)**
   - Once the human-in-the-loop approves the AI's strategy, the system interfaces with **SAP Ariba** (The "Wallet").
   - It seamlessly pushes a drafted Purchase Requisition (PR) directly into the ERP workflow, bypassing the bottleneck.

## ✨ Key Features Developed
* **100% Live AI Generation:** No hardcoded solutions. Alternatives, chat logs, and financial impacts are generated in real-time based on the specific disrupted semiconductor.
* **Interactive 3D Supply Network:** A WebGL-powered interactive globe mapping major semiconductor hubs (Hsinchu, Eindhoven, Santa Clara) with live pulsing data strings representing technology trade routes.
* **Dynamic Recovery Plans:** A fully interactive history vault where the AI dynamically generates and documents executed mitigation strategies with detailed historical context.
* **Light / Dark Mode:** Fully responsive, polished enterprise UI with beautiful glass-morphism panels and dynamic theme switching.

## 🛠️ Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons, next-themes
* **3D Visualization:** React-Globe.gl, Three.js
* **AI / LLM Inference:** Groq Cloud API
* **Enterprise Integration:** SAP S/4HANA (Sandbox API), SAP Ariba (Procurement API)
* **Live Data:** NewsAPI

## 💻 Running Locally

1. Clone the repository
```bash
git clone https://github.com/itsksfit/SentinelChain_SAP.git
cd SentinelChain_SAP
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables (`.env.local`)
```env
GROQ_API_KEY="your_groq_key"
NEWS_API_KEY="your_newsapi_key"
SAP_SANDBOX_API_KEY="your_sap_sandbox_key"
SAP_S4_BASE_URL="https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap/API_PRODUCT_SRV"
SAP_ARIBA_BASE_URL="https://sandbox.api.sap.com/ariba/api/purchasing-operational-sourcing/v2/prod"
```

4. Start the Development Server
```bash
npm run dev
```

## 🌐 Live Demo
The application is deployed on Vercel:
👉 **[https://sentinelchain-gilt.vercel.app](https://sentinelchain-gilt.vercel.app)**
