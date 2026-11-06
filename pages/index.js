import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ShieldCheck, AlertTriangle, Activity, ArrowRight, CheckCircle2, 
  Cpu, Database, Layers, Radio, Globe as GlobeIcon, FileText, 
  Clock, Zap, Check, ChevronRight, Sliders, ExternalLink, RefreshCw, 
  Terminal, ShieldAlert, Package, Lock, BarChart3, TrendingUp, Sparkles, Building2
} from 'lucide-react';

export default function LandingPage() {
  // Interactive Scenario Step State (Section 3)
  const [activeScenarioStep, setActiveScenarioStep] = useState(0);

  // Auto-cycle through scenario steps subtly if user hasn't clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScenarioStep(prev => (prev + 1) % 5);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scenarioSteps = [
    {
      step: "01",
      timing: "T+00s",
      phase: "Global Telemetry Ingest",
      title: "M6.4 Seismic Shock Detected Near Hsinchu Science Park",
      badge: "USGS TELEMETRY FEED",
      badgeColor: "text-red-400 bg-red-950/50 border-red-800/60",
      description: "USGS geological telemetry registers a 6.4 magnitude earthquake (24.8°N, 121.0°E) at 14km depth, within the primary Taiwan semiconductor corridor.",
      meta: [
        { label: "Data Source", val: "USGS Seismic API" },
        { label: "Telemetry Latency", val: "1.2s" },
        { label: "Confidence", val: "98.4% Tier-1" }
      ],
      detailCode: "EVENT_ID: USGS-2026-TW-8841 | MAG: 6.4 | CORRIDOR: HSINCHU-TAINAN"
    },
    {
      step: "02",
      timing: "T+12s",
      phase: "Foundry Impact Analysis",
      title: "TSMC Fab 18 Advanced Cleanroom Logistics Disrupted",
      badge: "FOUNDRY IR GEOLOCATION",
      badgeColor: "text-amber-400 bg-amber-950/50 border-amber-800/60",
      description: "Automated geofence triangulation identifies TSMC Fab 18 and packaging facilities in the shock radius. Cleanroom automated material handling systems (AMHS) suspended for inspection.",
      meta: [
        { label: "Affected Facility", val: "TSMC Fab 18" },
        { label: "Product Lines", val: "Logic & MCU Wafers" },
        { label: "Estimated Halt", val: "3 to 4 Weeks" }
      ],
      detailCode: "FACILITY_ID: TSMC-TW-FAB18 | PROCESS: 12nm/28nm | STATUS: SUSPENDED"
    },
    {
      step: "03",
      timing: "T+24s",
      phase: "Private SAP S/4HANA Correlation",
      title: "Deterministic Correlation to Material STM32F401RE",
      badge: "S/4HANA ODATA EXPLOSION",
      badgeColor: "text-blue-400 bg-blue-950/50 border-blue-800/60",
      description: "SentinelChain connects to private SAP S/4HANA BOMs via API_BILL_OF_MATERIAL_SRV. Disrupted foundry wafer allocation maps to active component STM32F401RE across assembly plants.",
      meta: [
        { label: "Internal MPN", val: "STM32F401RE" },
        { label: "BOM Assembly", val: "BOM-IND-4091 (Drive Controller)" },
        { label: "Impacted Facility", val: "Plant 1010 (Stuttgart)" }
      ],
      detailCode: "ERP_BOM: API_BILL_OF_MATERIAL_SRV | PLANT: 1010 | LINE: 4"
    },
    {
      step: "04",
      timing: "T+35s",
      phase: "Financial Exposure Analysis",
      title: "$1,575,000 / Day Revenue Exposure with < 5 Days Buffer",
      badge: "ENTERPRISE RISK COMPUTATION",
      badgeColor: "text-red-400 bg-red-950/50 border-red-800/60",
      description: "Plant inventory reveals only 380 units on hand against a daily run rate of 80 units (4.8 days of supply). Imminent assembly stoppage will idle high-margin industrial drive lines.",
      meta: [
        { label: "On-Hand Stock", val: "380 Units (4.8 Days)" },
        { label: "Safety Stock Threshold", val: "1,200 Units" },
        { label: "Revenue Exposure", val: "$1,575,000 / Day" }
      ],
      detailCode: "DOS: 4.8 DAYS | LINE_RATE: 80 U/D | DAILY_EXPOSURE: $1,575,000"
    },
    {
      step: "05",
      timing: "T+45s",
      phase: "Autonomous Sourcing & SAP Ariba PR",
      title: "Mouser Spot Discovery & Guardrailed Ariba Requisition",
      badge: "AUTONOMOUS EXECUTION",
      badgeColor: "text-emerald-400 bg-emerald-950/50 border-emerald-800/60",
      description: "Live Mouser API locates 14,200 units of 100% pin-compatible STM32F401RBT6TR @ $5.80/unit with 3-day air courier dispatch. SentinelChain automatically drafts an SAP Ariba PR within the +10% price ceiling.",
      meta: [
        { label: "Discovered Alternate", val: "STM32F401RBT6TR" },
        { label: "Franchised Stock", val: "14,200 pcs (Mouser)" },
        { label: "Price Delta", val: "+8.2% (Within Guardrail)" }
      ],
      detailCode: "PR_DRAFT: #PR-2026-8891 | VENDOR: MOUSER | EXECUTION: GUARDRAILED_OK"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-white selection:bg-white/20 selection:text-white antialiased font-sans relative overflow-x-hidden">
      <Head>
        <title>SentinelChain — Autonomous Supply Chain Intelligence & Procurement Platform</title>
        <meta name="description" content="AI-Powered Supply Chain Resilience & Autonomous Procurement Platform for Electronics Manufacturing. Detect disruptions, correlate private SAP S/4HANA BOMs, discover Mouser alternatives, and execute via SAP Ariba." />
        <link rel="icon" href="/shield.png" />
      </Head>

      {/* Subtle Hairline Technical Grid Background Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Silver Sheen Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial from-transparent via-[#050608]/80 to-[#050608]" />

      {/* ======================================================== */}
      {/* 1. TOP MINIMALIST ENTERPRISE NAVIGATION                   */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 w-full bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
          
          {/* Brand Identity: Full Brand Lockup */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="SentinelChain" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono">
            <a href="#pipeline" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>01</span> <span>Intelligence Pipeline</span>
            </a>
            <a href="#scenario" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>02</span> <span>Disruption Scenario</span>
            </a>
            <a href="#integrations" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>03</span> <span>Enterprise Systems</span>
            </a>
            <a href="#preview" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>04</span> <span>Command Center</span>
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3.5">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-all"
            >
              Enterprise Login
            </Link>

            <Link 
              href="/dashboard?demo=true" 
              className="px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black bg-gradient-to-r from-white via-[#E2E8F0] to-[#CBD5E1] hover:brightness-110 shadow-lg shadow-white/10 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Launch Quick Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* SECTION 1 — HERO: DISTINCTIVE ENTERPRISE OPENING         */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 sm:pt-24 pb-16 lg:pb-24">
        
        {/* Top Node Telemetry Indicator */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-xs font-mono uppercase tracking-widest text-slate-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Sentinel Telemetry Node Active</span>
          <span className="text-white/20">•</span>
          <span className="text-slate-400">SAP S/4HANA & Mouser Live Bridge</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authoritative Editorial Positioning */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
              Your Supply Chain Doesn't Need Another Dashboard.{" "}
              <span className="text-slate-300">
                It Needs a Sentinel.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Detect global disruptions. Trace component-level exposure. Discover alternative suppliers. Execute procurement decisions — all through one intelligent resilience platform.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link 
                href="/dashboard?demo=true" 
                className="px-7 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black bg-gradient-to-r from-white via-[#E2E8F0] to-[#CBD5E1] hover:brightness-110 shadow-xl shadow-white/10 transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <span>Launch Quick Demo</span>
                <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
              </Link>

              <Link 
                href="/login" 
                className="px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Enterprise Login</span>
              </Link>
            </div>

            {/* 4-Metric Hardened Trust Banner */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">&lt; 45s</span>
                <span className="text-slate-400 text-xs leading-snug">Event-to-BOM Detection Latency</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">100%</span>
                <span className="text-slate-400 text-xs leading-snug">Private SAP S/4HANA Correlation</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">14,200+</span>
                <span className="text-slate-400 text-xs leading-snug">Mouser Spot Components Ready</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">+10%</span>
                <span className="text-slate-400 text-xs leading-snug">Guarded Ariba Price Ceiling</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Metallic Supply-Chain Topology Visualization */}
          <div className="lg:col-span-5 relative">
            
            {/* Visual Glass Frame */}
            <div className="relative rounded-2xl border border-white/15 bg-gradient-to-b from-[#0D111A]/90 to-[#070A0F]/95 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
              
              {/* Header HUD Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white font-bold tracking-wider uppercase">GLOBAL SILICON LEDGER</span>
                </div>
                <span className="px-2 py-0.5 rounded text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 text-xs font-bold">
                  TELEMETRY_ONLINE
                </span>
              </div>

              {/* Network Node Architecture SVG Graphic */}
              <div className="my-6 relative h-[260px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 440 260" fill="none">
                  <defs>
                    <linearGradient id="corridorGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="shockwaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Subsea & Air Logistics Grid Tracks */}
                  <path d="M 60 80 Q 150 40 240 70 T 380 90" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M 60 80 Q 160 160 250 180 T 380 90" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M 240 70 L 250 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <path d="M 80 190 Q 180 210 250 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Active Seismic Shockwave Radiating from TSMC Tainan Node */}
                  <circle cx="80" cy="190" r="32" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.3" className="animate-ping" />
                  <circle cx="80" cy="190" r="16" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="1.5" />
                  <circle cx="80" cy="190" r="4" fill="#EF4444" />

                  {/* Corridors connecting nodes with moving packets */}
                  <line x1="80" y1="190" x2="240" y2="70" stroke="url(#corridorGrad1)" strokeWidth="2" strokeDasharray="6 4" />
                  <line x1="240" y1="70" x2="380" y2="90" stroke="#10B981" strokeWidth="2" strokeOpacity="0.7" />

                  {/* Key Nodes */}
                  {/* Node 1: Taiwan TSMC Fab 18 */}
                  <circle cx="80" cy="190" r="6" fill="#EF4444" />
                  <text x="80" y="215" fill="#EF4444" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TSMC Fab 18 (Disrupted)</text>
                  <text x="80" y="228" fill="#94A3B8" fontSize="9" fontFamily="monospace" textAnchor="middle">24.8°N 121.0°E</text>

                  {/* Node 2: S/4HANA Stuttgart Plant 1010 */}
                  <circle cx="240" cy="70" r="7" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="240" y="50" fill="#E2E8F0" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Stuttgart Plant 1010</text>
                  <text x="240" y="62" fill="#94A3B8" fontSize="9" fontFamily="monospace" textAnchor="middle">Assembly Line 4 • BOM-4091</text>

                  {/* Node 3: Mouser Spot Distribution Hub */}
                  <circle cx="380" cy="90" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="380" y="70" fill="#10B981" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Mouser Hub (Air Transit)</text>
                  <text x="380" y="82" fill="#94A3B8" fontSize="9" fontFamily="monospace" textAnchor="middle">14,200 pcs • 3-Day Courier</text>

                  {/* Node 4: Silicon Saxony Dresden */}
                  <circle cx="200" cy="120" r="4" fill="#94A3B8" />
                  <text x="195" y="136" fill="#64748B" fontSize="8" fontFamily="monospace">Dresden Fab</text>

                  {/* Node 5: Texas Instruments Sherman */}
                  <circle cx="320" cy="190" r="4" fill="#94A3B8" />
                  <text x="320" y="206" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle">TI Sherman</text>
                </svg>
              </div>

              {/* Bottom Real-time Data Readout HUD */}
              <div className="pt-3.5 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <span className="text-slate-400 text-xs uppercase block">Seismic Signal Hash</span>
                  <span className="text-white font-bold text-xs truncate block">SHA-256: 8f2c...4e19</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <span className="text-slate-400 text-xs uppercase block">Autonomous Action</span>
                  <span className="text-emerald-400 font-bold text-xs block">Ariba PR Prepared</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* SECTION 2 — THE SENTINELCHAIN INTELLIGENCE PIPELINE      */}
      {/* ======================================================== */}
      <section id="pipeline" className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 py-20 border-t border-white/[0.08]">
        
        <div className="space-y-4 max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>End-to-End Autonomous Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            The SentinelChain Intelligence Architecture
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            External supply chain shocks do not stop at dashboards. SentinelChain connects real-world disruption telemetry to private ERP bills of materials and automated purchasing workflows in six deterministic stages.
          </p>
        </div>

        {/* The 6-Stage Technical Bus Spine */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          
          {/* Stage 01 */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">01</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                  SIGNAL INGESTION
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-slate-200">
                Global Disruption Telemetry
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitors global signals from USGS Seismic, Federal Register (BIS Export Regulations), SEC 10-Q/8-K disclosures, and foundry facility releases on a 24-hour continuous cycle.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Telemetry: Multi-Source Web Crawler</span>
              <span className="text-cyan-400">24h Sweep</span>
            </div>
          </div>

          {/* Stage 02 */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">02</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                  AI VALIDATION
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-slate-200">
                Noise Filtering & Threat Verification
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filters noise, extracts public semiconductor entities, and calculates tier-weighted signal confidence (94.2% threshold) with cryptographic SHA-256 provenance logging.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Algorithm: Tier-Weighted Bayesian</span>
              <span className="text-emerald-400">Zero Hallucinations</span>
            </div>
          </div>

          {/* Stage 03 */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">03</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                  ERP CORRELATION
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-slate-200">
                Private SAP S/4HANA BOM Explosion
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects external disruptions to actual materials, components, assembly lines, and physical manufacturing plants using native <code className="text-cyan-300">API_BILL_OF_MATERIAL_SRV</code> without public exposure.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Integration: SAP S/4HANA OData</span>
              <span className="text-cyan-400">Zero Retention</span>
            </div>
          </div>

          {/* Stage 04 */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">04</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                  RISK QUANTIFICATION
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-slate-200">
                Financial Revenue Exposure Analysis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes daily revenue at risk by combining assembly line velocity, finished product ASP, and inventory Days of Supply (DoS) buffers to identify line stoppage triggers.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Metrics: DoS & Line Velocity</span>
              <span className="text-red-400">Runout Warning</span>
            </div>
          </div>

          {/* Stage 05 */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">05</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                  MARKET SOURCING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-slate-200">
                Alternative Component Discovery
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Searches franchised distributor APIs (Mouser Electronics) for 100% pin-compatible alternative microcontrollers, verifying live stock availability, pricing, and 3-day air courier lead times.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Vendor: Mouser API Live</span>
              <span className="text-emerald-400">14,200 pcs Verified</span>
            </div>
          </div>

          {/* Stage 06 */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">06</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                  AUTONOMOUS EXECUTION
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-slate-200">
                Guardrailed SAP Ariba Purchase Requisition
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates audit-ready procurement documentation and executes autonomous purchase requisitions into SAP Ariba within a hard-coded +10% price ceiling safety circuit breaker.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Target: SAP Ariba Procurement</span>
              <span className="text-emerald-400">+10% Price Ceiling</span>
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* SECTION 3 — FROM DISRUPTION TO DECISION (Scenario)       */}
      {/* ======================================================== */}
      <section id="scenario" className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 py-20 border-t border-white/[0.08]">
        
        <div className="space-y-4 max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Disruption Scenario</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            From Shockwave to Purchase Requisition
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Follow a real-world scenario: An earthquake hits Taiwan's semiconductor hub. Experience how SentinelChain moves from external seismology to an approved SAP Ariba PR in under 45 seconds.
          </p>
        </div>

        {/* Step Selector Tab Strip */}
        <div className="flex flex-wrap gap-2.5 mb-8 border-b border-white/10 pb-4">
          {scenarioSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScenarioStep(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeScenarioStep === idx
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              <span className={activeScenarioStep === idx ? 'text-black' : 'text-slate-500'}>{s.timing}</span>
              <span>{s.phase}</span>
            </button>
          ))}
        </div>

        {/* Active Scenario Card View */}
        <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#0D111A] to-[#070A0F] p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-2 font-mono">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${scenarioSteps[activeScenarioStep].badgeColor}`}>
                  {scenarioSteps[activeScenarioStep].badge}
                </span>
                <span className="text-xs text-slate-400">Elapsed: {scenarioSteps[activeScenarioStep].timing}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {scenarioSteps[activeScenarioStep].title}
              </h3>
            </div>

            <div className="shrink-0 font-mono text-xs text-slate-400 bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/10">
              <code>{scenarioSteps[activeScenarioStep].detailCode}</code>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {scenarioSteps[activeScenarioStep].description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {scenarioSteps[activeScenarioStep].meta.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                <span className="text-xs uppercase text-slate-400 block">{m.label}</span>
                <span className="text-sm font-bold text-white mt-1 block">{m.val}</span>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* SECTION 4 — BUILT FOR REAL ENTERPRISE SYSTEMS            */}
      {/* ======================================================== */}
      <section id="integrations" className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 py-20 border-t border-white/[0.08]">
        
        <div className="space-y-4 max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise Integration Stack</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Engineered for Mission-Critical Infrastructure
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            SentinelChain acts as the real-time remediation layer between global public disclosures and authoritative internal ERP systems. No manual data entry, no brittle browser scraping, and no unapproved financial writes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* System 1: SAP S/4HANA */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block">PRIVATE ERP INTEGRATION</span>
              <h3 className="text-lg font-bold text-white mt-1">SAP S/4HANA</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Multi-level BOM explosion via standard <code className="text-slate-300">API_BILL_OF_MATERIAL_SRV</code>. Reads active manufacturing plants, inventory buffers, and assembly line safety stocks.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 space-y-1">
              <div>Scope: Read-Only OData v2/v4</div>
              <div className="text-emerald-400">Zero Data Retention</div>
            </div>
          </div>

          {/* System 2: SAP Ariba */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">PROCUREMENT AUTOMATION</span>
              <h3 className="text-lg font-bold text-white mt-1">SAP Ariba</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Autonomous generation of Purchase Requisitions (PR) with embedded spec comparisons, price validation, and a strict +10% price ceiling circuit breaker.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 space-y-1">
              <div>Protocol: cXML & Ariba REST</div>
              <div className="text-amber-400">+10% Guardrail Protected</div>
            </div>
          </div>

          {/* System 3: Mouser Electronics */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">FRANCHISED SPOT MARKET</span>
              <h3 className="text-lg font-bold text-white mt-1">Mouser Electronics</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Direct live API connection verifying authorized stock quantities, factory lead times, tiered pricing, and form-fit-function pin compatibility for microcontrollers and power ICs.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 space-y-1">
              <div>API: api.mouser.com Search v1</div>
              <div className="text-emerald-400">3-Day Air Dispatch Stock</div>
            </div>
          </div>

          {/* System 4: Global Regulatory & Telemetry */}
          <div className="p-6 rounded-2xl bg-[#090D14] border border-white/10 hover:border-white/20 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 block">EXTERNAL INTELLIGENCE</span>
              <h3 className="text-lg font-bold text-white mt-1">Regulatory & Seismic</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Multi-source crawlers scanning USGS Seismic (M4+), Federal Register (BIS Export Administration Regulations), SEC EDGAR 10-Q/8-K, and foundry IR filings.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-500 space-y-1">
              <div>Crawler: 24h Sweeper Engine</div>
              <div className="text-purple-400">Tier-Weighted Provenance</div>
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* SECTION 5 — THE COMMAND CENTER PREVIEW                   */}
      {/* ======================================================== */}
      <section id="preview" className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 py-20 border-t border-white/[0.08]">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mission Control Preview</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              The SentinelChain Command Center
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore the actual interface used by global supply chain executives to monitor daily revenue exposure, review exploded S/4HANA BOMs, and execute automated Mouser procurement.
            </p>
          </div>

          <Link
            href="/dashboard?demo=true"
            className="px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black bg-gradient-to-r from-white via-[#E2E8F0] to-[#CBD5E1] hover:brightness-110 shadow-lg shadow-white/10 transition-all flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <span>Open Interactive Dashboard</span>
            <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Live Interface Preview Window */}
        <div className="rounded-2xl border border-white/15 bg-[#090D14] shadow-2xl overflow-hidden relative group">
          
          {/* Top Browser / App Chrome Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-white/20"></span>
                <span className="w-3 h-3 rounded-full bg-white/20"></span>
                <span className="w-3 h-3 rounded-full bg-white/20"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">sentinelchain.enterprise/dashboard</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-bold">LIVE TELEMETRY</span>
            </div>
          </div>

          {/* Actual Dashboard UI Components Preview */}
          <div className="p-6 sm:p-10 space-y-8 bg-[#050608]/90">
            
            {/* Top 4-Metric Grid Preview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs uppercase text-slate-400 block">Total Daily Revenue Exposure</span>
                <span className="text-2xl sm:text-3xl font-black text-red-400 mt-1 block">$1,575,000<span className="text-xs font-normal text-slate-400">/day</span></span>
                <span className="text-xs text-slate-500 mt-1 block">Plant 1010 Assembly Line 4</span>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs uppercase text-slate-400 block">Line Runout Buffer</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">&lt; 5 Days</span>
                <span className="text-xs text-slate-500 mt-1 block">380 Pcs On Hand (Critical)</span>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs uppercase text-slate-400 block">Monitored Foundry Nodes</span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">32,491</span>
                <span className="text-xs text-slate-500 mt-1 block">TSMC, Saxony, TI, NXP</span>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs uppercase text-slate-400 block">Mouser Spot Qualified</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">14,200 pcs</span>
                <span className="text-xs text-slate-500 mt-1 block">100% Pin-Compatible Drop-In</span>
              </div>
            </div>

            {/* Simulated Live Disruption & Mouser Resolution Row */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded text-red-400 bg-red-950/60 border border-red-800/40 text-xs font-bold">
                    ACTIVE TSMC SEISMIC ALERT
                  </span>
                  <span className="text-slate-400">Material: <strong className="text-white">STM32F401RE</strong></span>
                  <span className="text-slate-400">Assembly: <strong className="text-white">BOM-IND-4091</strong></span>
                </div>
                <h4 className="text-base font-bold text-white">
                  M6.4 Earthquake near Hsinchu Science Park — TSMC Fab 18 Disrupted
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  Sourced Alternative: <span className="text-emerald-400 font-bold">STM32F401RBT6TR</span> • 14,200 pcs in stock at Mouser • 3-Day Delivery • Unit Price: $5.80 (Within +10% Ariba ceiling)
                </p>
              </div>

              <Link
                href="/dashboard?demo=true"
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
              >
                Launch Live View &rarr;
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* SECTION 6 — FINAL CTA & ENTERPRISE FOOTER               */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 py-24 border-t border-white/[0.08]">
        
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#0D111A] to-[#050608] p-8 sm:p-14 lg:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Don't Just Monitor Disruptions. Stay Ahead of Them.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Turn fragmented global signals into actionable manufacturing intelligence and procurement decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard?demo=true" 
              className="px-8 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black bg-gradient-to-r from-white via-[#E2E8F0] to-[#CBD5E1] hover:brightness-110 shadow-xl shadow-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span>Launch Interactive Demo</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <Link 
              href="/login" 
              className="px-8 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Enterprise Login</span>
            </Link>
          </div>

        </div>

        {/* Enterprise Compliance & Footer Navigation */}
        <footer className="mt-20 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-slate-400">
          
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="SentinelChain" className="h-7 w-auto object-contain" />
            <span className="text-slate-500">|</span>
            <span>Autonomous Supply Chain Resilience</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/dashboard" className="hover:text-white transition-colors">Command Center</Link>
            <Link href="/disruptions" className="hover:text-white transition-colors">Disruptions</Link>
            <Link href="/plans" className="hover:text-white transition-colors">Recovery Plans</Link>
            <Link href="/ledger" className="hover:text-white transition-colors">Audit Ledger</Link>
            <Link href="/risk" className="hover:text-white transition-colors">Risk Matrix</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">ROI Model</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SOC 2 Type II • ISO 27001 • SAP PartnerEdge</span>
          </div>

        </footer>

      </section>

    </div>
  );
}
