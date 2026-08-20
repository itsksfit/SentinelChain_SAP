# 🛡️ SentinelChain

**Autonomous Supply Chain Resilience & Procurement Platform**

SentinelChain is an AI-powered enterprise pipeline that transforms supply-chain risk management from a reactive, manual process into an autonomous, self-healing workflow. By sitting between live global intelligence feeds and enterprise ERP software, SentinelChain detects disruptions, measures financial impact, negotiates alternatives, and executes recovery procurement—all without human intervention.

## 🚀 The Hackathon Problem
When a global disruption occurs (e.g., a factory fire, a port strike, or geopolitical export restrictions), traditional procurement teams take days or weeks to manually cross-reference their Bill of Materials (BOM), email suppliers, and draft Purchase Requisitions. 

**SentinelChain turns a two-week human process into a two-minute autonomous workflow.**

## 🧠 The AI Pipeline (How it works)

Our architecture utilizes a multi-agent system powered by Llama 3 (120B) via Groq, working in four distinct stages:

1. **📡 Detection Agent (Live Intelligence)**
   - Continuously ingests live global news via the NewsAPI.
   - Strictly maps macro-economic events and disruptions to specific nodes in the enterprise BOM using rigid factual LLM guardrails.

2. **💥 Impact Agent (SAP S/4HANA Sandbox)**
   - Connects to the SAP S/4HANA Business Accelerator Hub.
   - Extracts real-time product weight, dimensions, and downstream BOM dependencies to dynamically calculate the exact daily revenue at risk (in USD).

3. **🕵️‍♂️ Cross-Reference & Chase Agent (Negotiation)**
   - Queries known alternative distributors for the affected component.
   - The AI acts as an autonomous procurement officer, aggressively negotiating price and lead times via conversational LLM inference to find the mathematically optimal recovery path.

4. **⚙️ Execution Agent (SAP Ariba Sandbox)**
   - Once a recovery plan is selected, the system autonomously interfaces with the SAP Ariba Procurement API.
   - It seamlessly pushes a drafted Purchase Requisition (PR) directly into the ERP workflow, completing the self-healing cycle.

## 🛠️ Tech Stack
* **Frontend:** React, Next.js, Tailwind CSS, Framer Motion
* **3D Visualization:** React-Globe.gl, Three.js
* **AI / LLM Inference:** Groq Cloud (Llama 3 120B)
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
👉 **[SentinelChain Live](https://sentinelchain-gilt.vercel.app)**
