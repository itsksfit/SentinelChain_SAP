<div align="center">
  <img src="public/shield.png" alt="SentinelChain Logo" width="110" />
  <h1>SentinelChain</h1>
  <p><b>Autonomous B2B Supply Chain AI Revenue Recovery Engine</b></p>
  <p><i>Global Integrity Ecosystem & Automated Procurement Intervention</i></p>
  
  <br />
  <a href="https://sentinelchain-gilt.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Live_on_Vercel-success?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Platform-Enterprise_SaaS-indigo?style=for-the-badge" alt="Enterprise SaaS" />
  <img src="https://img.shields.io/badge/SAP_S%2F4HANA-OData_V4_Connected-blue?style=for-the-badge&logo=sap" alt="SAP Connected" />
  <img src="https://img.shields.io/badge/AI_Engine-Groq_Llama_3-purple?style=for-the-badge" alt="Groq AI" />
</div>

---

## 🎯 The Mission
In enterprise manufacturing and B2B supply chains, revenue loss rarely occurs in one clean step—it slips away when external supply chain disruptions (e.g., factory fires, port closures, export bans) halt assembly lines and breach delivery SLAs. Manual resolution takes weeks of phone calls and spreadsheets, by which time alternative inventory is gone and millions of dollars in revenue are permanently lost.

**SentinelChain** bridges a company's internal ERP with live market sourcing to autonomously detect revenue at risk, diagnose the root cause in the Bill of Materials (BOM), negotiate replacement components, and execute bounded recovery before production halts.

---

## 🔄 The 6-Step Autonomous Recovery Pipeline

```
[Institutional Signals] ➔ [Signal Consensus] ➔ [SAP S/4HANA BOM] ➔ [Mouser Spot Sourcing] ➔ [Groq AI Negotiation] ➔ [Human Approval & Ariba PR] ➔ [Recovery Ledger]
```

1. **🛰️ Multi-Source Institutional Signal Ingestion**
   Ingests raw, verifiable signals across primary institutional regulatory adapters:
   - **Geophysical Hazard Adapter:** Live **USGS Seismic Sensor Network** cross-referenced against the Global Semiconductor Fab Registry to detect factory earthquakes.
   - **Trade Policy Adapter:** Live **US Federal Register API** for Bureau of Industry and Security (BIS) / EAR entity rules and export bans.
   - **Corporate Disclosure Adapter:** **SEC EDGAR** Full-Text Search (10-Q / 8-K filings) from chipmakers (NVIDIA, Texas Instruments) disclosing wafer constraints.
   - **Macro Context:** **NY Fed Global Supply Chain Pressure Index (GSCPI)** for macro-economic supply risk.
   - **Early Detection Advantage:** Benchmarks primary event timestamps against mainstream media to quantify hours/days gained ($\Delta T = T_{\text{news}} - T_{\text{primary}}$).

2. **🛡️ Signal Consensus & Anti-Hallucination Engine**
   Cross-verifies data across independent regulatory feeds to enforce a strict **95%+ confidence score** before triggering any downstream ERP actions.

3. **💥 Private BOM Correlation & Revenue at Risk (SAP S/4HANA)**
   Connects directly to live **SAP S/4HANA Cloud OData V4 APIs** (`API_PRODUCT_SRV`) to explode the factory's Bill of Materials. It maps affected assembly lines, calculates exact **Daily Revenue Loss ($/day)**, and extracts engineering-approved alternate parts.

4. **🌐 Real-Time Market Sourcing & Part Comparison (Mouser API)**
   SAP knows *which* backup parts are approved, but not who has them in stock. SentinelChain dynamically queries the **Mouser Electronics API** to locate live spot inventory, warehouse lead times, and unit pricing, with an interactive side-by-side **Part Comparison Modal**.

5. **🤖 Autonomous AI Chase Agent & Negotiation (Groq AI)**
   Powered by ultra-fast **GroqCloud Llama-3 inference**, the AI agent executes automated RFQ negotiations directly with suppliers—securing volume bulk discounts and collapsing supplier lead times from **18 weeks down to 3 days**.

6. **⚖️ Bounded Workflows, Guardrails & SAP Ariba PR Execution**
   - **3 Bounded Options:** External Spot Buy with negotiated discount (Option A), Internal Stock Transport Order reallocation (Option B), or Risk Acceptance (Option C).
   - **Enterprise Guardrails:** Enforces unit price caps, spending limits, and an automated **1-click Human-in-the-Loop approval modal**.
   - **Execution & Audit:** Generates an official **SAP Ariba Purchase Requisition (PR)** and logs every decision, negotiation message, and recovered dollar onto the **Recovery Ledger (`/ledger`)**.

---

## 🏛️ System Modules

| Module | Route | Purpose |
| :--- | :--- | :--- |
| **Mission Control** | `/` | 3D Global Semiconductor Node Grid, Live Institutional Signal Ticker, ERP Status Pills |
| **Active Disruptions** | `/disruptions` | Active incident catalog, Visual Node-Link Impact Graph, SAP BOM Explosion |
| **Recovery Plans** | `/plans` | Mouser live sourcing, Part Comparison Modal, Groq AI supplier negotiation chat |
| **Recovery Ledger** | `/ledger` | Immutable financial audit trail, net dollars recovered, resolution breakdowns |
| **Supply Network** | `/network` | Global Tier-1 & Tier-2 supplier reliability scores (94% health), geographic risk clusters |
| **Risk Analysis** | `/risk` | Enterprise portfolio view: Total Dollars at Risk vs. Total Recovered ROI |

---

## 🛠️ Enterprise Architecture & Tech Stack

* **Frontend:** Next.js (Turbopack), React, Tailwind CSS, Lucide Icons, Recharts, Three.js / React-Globe.gl
* **Enterprise ERP:** SAP S/4HANA Cloud (OData V4), SAP Ariba Procurement APIs
* **Market Sourcing:** Mouser Electronics Search API
* **Institutional Signal Feeds:** USGS Seismic API, US Federal Register (BIS), SEC EDGAR, NY Fed GSCPI
* **AI / LLM Engine:** Groq Cloud API (Llama 3 / Mixtral for high-speed inference)
* **Deployment:** Vercel (Production Edge)

---

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
GROQ_API_KEY="your_groq_api_key"
NEWS_API_KEY="your_newsapi_key"
SAP_SANDBOX_API_KEY="your_sap_sandbox_key"
SAP_S4_BASE_URL="https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap/API_PRODUCT_SRV"
SAP_ARIBA_BASE_URL="https://sandbox.api.sap.com/ariba/api/purchasing-operational-sourcing/v2/prod"
MOUSER_API_KEY="your_mouser_api_key"
```

4. Start the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to launch the platform.
