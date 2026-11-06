# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Enterprise electronics and semiconductor procurement teams (VPs of Supply Chain, Procurement Directors, Commodity Managers, and Operations Leads). They operate under high pressure to prevent factory assembly line halts, delivery SLA breaches, and spot-market inventory exhaustion when macro or physical disruptions strike semiconductor supply chains.

## Product Purpose

SentinelChain is an autonomous B2B supply chain intelligence and real-time ERP remediation platform. It exists to reduce supply chain crisis recovery time from weeks of manual phone calls and fragmented spreadsheets to under two minutes of AI-driven analysis, BOM cross-referencing, spot-market sourcing, and ERP purchase requisitioning. Success means zero assembly line downtime, continuous revenue protection, and deterministic procurement compliance.

## Positioning

Unlike conventional supply chain monitoring dashboards that only generate passive alert noise, SentinelChain closes the loop between physical signal ingestion and enterprise ERP execution: it correlates live real-world telemetry (USGS seismic feeds, Federal Register BIS export controls, SEC 10-Q disclosures, foundry investor updates) directly with SAP S/4HANA Bill of Materials (BOM) trees, evaluates financial dollar-at-risk per day, sources form-fit-function pin-compatible alternative chips in real-time via Mouser APIs, and executes automated SAP Ariba Purchase Requisitions within policy guardrails.

## Operating Context

- Enterprise ERP environments, specifically SAP S/4HANA (data center & BOM ground truth) and SAP Ariba (procurement center & purchase requisition execution).
- High-stakes, time-sensitive trading environments where spot distributor inventories (e.g., Mouser, Digi-Key) can vanish within hours during global component allocations.
- Supervised autonomous human-in-the-loop governance: AI models analyze disruption telemetry, explode BOMs, compute financial exposure, and rank pin-compatible replacement parts, requiring explicit authorized human sign-off before committing funds to SAP Ariba purchase requisitions.
- Compliance and governance auditing: single-page audit dossiers, immutable recovery ledgers, and deterministic spend guardrails (+10% cost ceiling baseline).

## Capabilities and Constraints

- **Confirmed Functionality:**
  - Multi-source institutional telemetry ingestion (USGS seismic sensor network, US Federal Register BIS rules, SEC EDGAR 10-Q/8-K, foundry investor relations).
  - Groq LPU inference for real-time entity extraction and vibration exposure modeling.
  - SAP S/4HANA OData V4 integration for dynamic BOM explosion, active inventory evaluation, and dollar-at-risk per day quantification.
  - Mouser Electronics live catalog API integration for real-time stock lookup, USD price-break calculations, and pin-compatible (form-fit-function) drop-in part matching.
  - SAP Ariba Purchase Requisition generation with strict cost-ceiling guardrails and PDF audit trail generation.
- **Technical Stack & Constraints:**
  - Next.js (Pages router), React, Tailwind CSS, Lucide icons, Three.js / React Globe GL for interactive global disruption mapping, Recharts for financial exposure analytics.
  - Web platform only; dark enterprise SaaS aesthetic with high information density.
- **Undecided / Open Decisions:**
  - Secondary ERP integrations (e.g., Oracle NetSuite, Microsoft Dynamics 365) are deferred to future roadmaps; SAP S/4HANA and SAP Ariba remain the sole target integrations.

## Brand Commitments

- **Name:** SentinelChain.
- **Tagline:** Autonomous B2B Supply Chain Intelligence & Real-Time ERP Remediation Platform.
- **Voice:** Authoritative, precise, enterprise-grade, institutional, mission-critical. No consumer fluff, marketing hyperbole, or vague AI hand-waving.
- **Assets:** Official shield emblem (`public/shield.png`).

## Evidence on Hand

- Live production demo deployed on Vercel: `https://sentinelchain-gilt.vercel.app`.
- Working Next.js application codebase with active routes (`/disruptions`, `/network`, `/risk`, `/ledger`, `/plans`, `/pricing`, `/login`).
- Component library with interactive 3D Globe (`components/WorldMap.jsx`), PR audit export modal (`components/PrAuditExportModal.jsx`), Part comparison modal (`components/PartComparisonModal.jsx`), and Spend protection charts (`components/SpendProtectedChart.jsx`).
- Detailed technical architecture and data specifications documented in `sentinelchain_analysis.md` and `README.md`.

## Product Principles

1. **Closed-Loop Action Over Passive Notification:** Never alert without calculating financial exposure and preparing an actionable, verified remediation plan.
2. **Determinism and Ground Truth:** Rely on structured ERP business data (SAP S/4HANA BOMs) and live distributor APIs (Mouser) rather than hallucinated or speculative sourcing.
3. **Supervised Autonomy & Guardrailed Governance:** Empower AI to execute high-speed analysis and draft transactions, but always preserve human accountability and policy limits before capital commitment.
4. **Mission-Critical Clarity & High Information Density:** Every interface surface must prioritize fast comprehension of revenue-at-risk, part pinout compatibility, and actionable recovery steps without decorative clutter.

