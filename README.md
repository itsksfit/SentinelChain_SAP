<div align="center">
  <img src="public/shield.png" alt="SentinelChain Logo" width="120" />
  <h1>SentinelChain</h1>
  <p><b>Global Integrity Ecosystem & Autonomous Procurement Engine</b></p>
  <p><i>Built for Hackathon Track 03: AI Revenue Recovery</i></p>
  
  <br />
  <a href="https://sentinelchain-gilt.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Live_on_Vercel-success?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
</div>

---

## 🚀 The Vision
When a global supply chain disruption occurs (e.g., a factory fire, port strike, or geopolitical event), traditional procurement teams take weeks to manually cross-reference their Bill of Materials (BOM) and negotiate with suppliers. By the time humans react, competitors have already bought out the remaining global inventory.

**SentinelChain** bridges a company's internal ERP system with external global market data. It autonomously calculates revenue at risk, sources alternative components from the open market, and negotiates recovery options before competitors even realize there is a shortage.

## 🔄 The 6-Step Autonomous Workflow

SentinelChain executes a closed-loop revenue recovery pipeline:

1. **📡 Multi-Source Signal Intelligence**
   Ingests live primary data across four verifiable institutional adapters:
   - **Corporate Disclosure Adapter**: SEC EDGAR Full-Text Search for U.S.-reporting semiconductor companies/ADRs + Official IR disclosures for non-U.S. foundries (ASML, STMicro).
   - **Geophysical Hazard Adapter**: Live USGS Seismic Geo-Feed cross-referenced against the Global Semiconductor Fab Registry (Heuristic Fab Vibration Exposure Model).
   - **Trade Policy Adapter**: US Federal Register API for Bureau of Industry and Security (BIS) / EAR entity rules.
   - **Macroeconomic Context**: NY Fed Global Supply Chain Pressure Index (GSCPI).
   - **Media Baseline**: NewsAPI used strictly to benchmark the **Early Detection Advantage** ($\Delta T = T_{\text{news}} - T_{\text{primary}}$).
2. **💥 Public Entity Extraction & Private BOM Correlation (SAP S/4HANA)**
   Extracts public entities/technologies and deterministically correlates them against the private enterprise Bill of Materials (BOM) in SAP S/4HANA, calculating daily revenue at risk.
3. **🌐 Real-Time Market Sourcing (Mouser API)**
   SAP knows what parts you *can* use, but not what is in stock globally. The system dynamically queries the **Mouser Electronics Search API** to pull real-time stock availability, lead times, and spot pricing for pin-compatible chips.
4. **🧠 Recovery Options & Comparison**
   The AI generates three bounded recovery paths:
   - **Option A (External):** AI Chase Agent autonomously negotiates a bulk discount with Mouser/distributors to issue a new Purchase Order.
   - **Option B (Internal):** Simulate an SAP Stock Transport Order (STO) to reallocate existing inventory from another internal warehouse.
   - **Option C (Accept Risk):** Do nothing and absorb the revenue hit.
5. **🧑‍💼 Human Approval**
   The supply chain manager reviews the **Signal Provenance Dossier** (deterministic Evidence Confidence score + direct link to official SEC/USGS document), the dynamic **Visual Impact Graph**, and the generated recovery options in the Decision Center.
6. **⚡ Execution & Verification**
   The AI agent instantly executes the selected strategy (simulating an RFQ chat log or SAP STO), submitting purchase requisitions directly to **SAP Ariba**.

## 🏗️ Enterprise Architecture
SentinelChain was built with strict enterprise constraints, ensuring a clean separation between internal systems of record and external market volatility.

* **Internal Brain:** `SAP Business Accelerator Hub` (OData V4 APIs)
* **External Market:** `Mouser Electronics Search API`
* **Signal Layer:** `SEC EDGAR`, `USGS Geo-Feed`, `Federal Register BIS`, `Official IR`, `NewsAPI Baseline`, `NY Fed GSCPI`
* **AI Engine:** `GroqCloud API` (Llama 3 / Mixtral for entity extraction and negotiation)

## ✨ Key Features Developed
* **Enterprise Authentication:** Fully integrated `NextAuth.js` enabling genuine Google Single Sign-On (SSO) alongside a persistent, secure cookie-based database for authentic Enterprise Registration/Login workflows.
* **Deterministic Evidence Confidence:** Mathematically computed veracity score based on verified primary government and corporate source tiers.
* **Early Detection Advantage:** Computes exact hours/days gained between primary regulatory/seismic event timestamps and mainstream media coverage.
* **Visual Node-Link Impact Graph:** A dynamic, CSS-rendered dependency tree showing exactly how a single component shortage cascades into multi-million dollar revenue loss.
* **Live Enterprise Data Fusion:** Blends real-time SAP Sandbox data with live Mouser market pricing to ground the AI in reality.
* **Minimalist Vercel-Style UI:** Strict, flat, Radix-inspired monochrome design for a highly professional enterprise aesthetic.

## 🛠️ Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons, NextAuth.js
* **Integrations:** SAP S/4HANA, SAP Ariba, Mouser API, SEC EDGAR, Federal Register, USGS Geo-Feed, NewsAPI
* **AI / LLM Inference:** Groq Cloud API
* **Deployment:** Vercel

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
GOOGLE_ID="your_google_oauth_client_id"
GOOGLE_SECRET="your_google_oauth_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any_secure_random_string"
```

4. Start the Development Server
```bash
npm run dev
```

---
*Built for the Enterprise AI Hackathon.*
