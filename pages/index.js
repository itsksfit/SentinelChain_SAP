import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SentinelChainLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqs, setOpenFaqs] = useState({ 0: true });

  const toggleFaq = (idx) => {
    setOpenFaqs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const chartCurves = {
    '12m': {
      burnArea: 'M 0 50 Q 250 60 450 110 T 800 155 L 800 160 L 0 160 Z',
      burnLine: 'M 0 50 Q 250 60 450 110 T 800 155',
      recoveryArea: 'M 480 155 Q 580 100 680 60 T 800 45 L 800 160 L 480 160 Z',
      recoveryLine: 'M 480 155 Q 580 100 680 60 T 800 45',
      cx: 480, cy: 155
    },
    '30d': {
      burnArea: 'M 0 40 Q 220 50 420 100 T 800 152 L 800 160 L 0 160 Z',
      burnLine: 'M 0 40 Q 220 50 420 100 T 800 152',
      recoveryArea: 'M 440 152 Q 540 105 660 50 T 800 35 L 800 160 L 440 160 Z',
      recoveryLine: 'M 440 152 Q 540 105 660 50 T 800 35',
      cx: 440, cy: 152
    },
    '7d': {
      burnArea: 'M 0 30 Q 200 45 400 90 T 800 150 L 800 160 L 0 160 Z',
      burnLine: 'M 0 30 Q 200 45 400 90 T 800 150',
      recoveryArea: 'M 420 150 Q 520 110 650 40 T 800 25 L 800 160 L 420 160 Z',
      recoveryLine: 'M 420 150 Q 520 110 650 40 T 800 25',
      cx: 420, cy: 150
    },
    '24h': {
      burnArea: 'M 0 25 Q 180 40 380 85 T 800 145 L 800 160 L 0 160 Z',
      burnLine: 'M 0 25 Q 180 40 380 85 T 800 145',
      recoveryArea: 'M 400 145 Q 500 95 620 30 T 800 20 L 800 160 L 400 160 Z',
      recoveryLine: 'M 400 145 Q 500 95 620 30 T 800 20',
      cx: 400, cy: 145
    }
  };

  const faqItems = [
    {
      q: "Do I need SAP to try it?",
      a: "No. The live demo is fully pre-loaded with an interactive sandbox replicating an automotive OEM's SAP S/4HANA bill of materials, including Stuttgart Plant 1001. You can test the end-to-end flow without entering any credentials or configuring SAP RFC connectors."
    },
    {
      q: "Does it buy parts on its own?",
      a: "Never. SentinelChain strictly adheres to human-in-the-loop governance. It stages purchase requisitions (PR-ARIB-xxxx) with full audit telemetry and pricing validation in SAP Ariba or S/4HANA, leaving the final sign-off and PO release entirely in the hands of authorized procurement personnel."
    },
    {
      q: "Where does the disruption data come from?",
      a: "We ingest directly from authoritative public and institutional feeds: USGS seismic event feeds, the Federal Register for Bureau of Industry and Security (BIS) export restriction rulings, SEC EDGAR 8-K / 10-Q filings, the New York Fed Global Supply Chain Pressure Index (GSCPI), and direct foundry investor statements (TSMC, ASML, STMicroelectronics)."
    },
    {
      q: "How do you pick replacement parts?",
      a: "Our multi-tier matching engine inspects manufacturer part number schemas, pin-out compatibility, thermal and voltage tolerances, AEC-Q100 automotive grade specifications, and real-time distributor inventory APIs (e.g. Mouser, DigiKey). Parts are ranked by availability, landed cost, and freight delivery lead-time."
    },
    {
      q: "Can the AI get it wrong?",
      a: "SentinelChain uses deterministic guardrails: any AI-generated hypothesis must pass a multi-factor confidence threshold (≥ 95% evidence confidence). Quotes exceeding 10% variance against the SAP material master baseline are automatically flagged for manual review, preventing hallucinatory pricing or inappropriate parts."
    },
    {
      q: "Is the revenue number real?",
      a: "Yes. In production, revenue at risk ($1,575,000 / day in our sample scenario) is calculated by traversing the SAP BOM tree down to individual planned production orders (PLAF) and finished product sales margins (CO-PA), accounting for plant-specific burn rate and safety buffer days."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-brand-900 font-sans antialiased selection:bg-brand-900 selection:text-white">
      <Head>
        <title>SentinelChain | Autonomous Supply Chain Resilience & ERP Remediation</title>
        <meta name="description" content="Autonomous enterprise supply chain resilience. SentinelChain detects disruptions, matches BOM parts in SAP, quantifies daily revenue at risk, and stages replacement purchase requisitions." />
        <link rel="icon" href="/shield.png" />
      </Head>

{/*  BEGIN: Navigation  */}
<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-200">
<div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
{/*  Brand Logo  */}
<Link className="flex items-center gap-3 group" data-purpose="site-brand" href="/">
<div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-brand-900 shadow-subtle hover:bg-black transition-colors">
<img alt="SentinelChain Logo" className="h-8 md:h-9 w-auto object-contain" src="/logo.png"/>
</div>
</Link>
{/*  Desktop Navigation Links  */}
<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-600" data-purpose="primary-navigation">
<a className="hover:text-brand-900 transition-colors" href="#how-it-works">How it works</a>
<a className="hover:text-brand-900 transition-colors" href="#scenario">Scenario</a>
<a className="hover:text-brand-900 transition-colors" href="#data-sources">Data sources</a>
<a className="hover:text-brand-900 transition-colors" href="#faq">FAQ</a>
</nav>
{/*  Action Buttons  */}
<div className="flex items-center gap-4">
<Link className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-white bg-brand-900 hover:bg-black rounded-full px-5 py-2.5 transition-all shadow-subtle hover:scale-[1.02]" href="/disruptions/DSP-092">
    Launch Demo
    <svg className="w-3.5 h-3.5 ml-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</Link>
{/*  Mobile Hamburger Button  */}
<button aria-label="Toggle Navigation Menu" className="md:hidden p-2 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-brand-50 border border-brand-200" id="mobileMenuBtn" onClick={() => setMobileMenuOpen(prev => !prev)} className="md:hidden p-2 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-brand-50 border border-brand-200 cursor-pointer">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M4 6h16M4 12h16M4 18h16" id="hamburgerIcon" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
</button>
</div>
</div>
{/*  Mobile Dropdown Menu  */}
<div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden border-b border-brand-200 bg-white px-6 py-4 space-y-3 shadow-lg`} id="mobileMenu">
<a className="block py-2 text-sm font-medium text-brand-700 hover:text-brand-900" href="#how-it-works">How it works</a>
<a className="block py-2 text-sm font-medium text-brand-700 hover:text-brand-900" href="#scenario">Scenario</a>
<a className="block py-2 text-sm font-medium text-brand-700 hover:text-brand-900" href="#data-sources">Data sources</a>
<a className="block py-2 text-sm font-medium text-brand-700 hover:text-brand-900" href="#faq">FAQ</a>
<div className="pt-2 border-t border-brand-100 flex flex-col gap-2">
<Link className="w-full inline-flex items-center justify-center text-sm font-medium text-white bg-brand-900 hover:bg-black rounded-full px-4 py-2.5 transition shadow-subtle" href="/disruptions/DSP-092">
      Launch Demo
    </Link>
</div>
</div>
</header>
{/*  END: Navigation  */}
<main>
{/*  BEGIN: HeroSection  */}
<section className="pt-16 pb-20 overflow-hidden relative" data-purpose="hero-section">
<div className="max-w-6xl mx-auto px-6 text-center">
{/*  Hero Headline  */}
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-900 max-w-4xl mx-auto leading-[1.12]">Know which production line will stop, before it stops.</h1>
{/*  Subtitle  */}
<p className="mt-6 text-base sm:text-lg text-brand-600 max-w-2xl mx-auto leading-relaxed">SentinelChain watches earthquakes, export rules and filings, matches them to the parts in your SAP bill of materials, shows the revenue at risk per day, and drafts the purchase request for in-stock replacements.</p>
{/*  CTA Row  */}
<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
<div className="flex flex-col items-center">
<Link className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle hover:scale-[1.01]" href="/disruptions/DSP-092">
      Run the Taiwan earthquake scenario
      <svg className="w-4 h-4 ml-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</Link>
<span className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Sandbox data. No SAP connection needed.</span>
</div>
<div className="flex flex-col items-center self-start w-full sm:w-auto">
<button className="w-full sm:w-auto inline-flex items-center justify-center border border-brand-300 bg-white hover:bg-brand-50 text-brand-700 text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle gap-2" id="openWalkthroughBtn" onClick={() => setShowWalkthrough(true)} className="w-full sm:w-auto inline-flex items-center justify-center border border-brand-300 bg-white hover:bg-brand-50 text-brand-700 text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle gap-2 cursor-pointer">
<span className="text-xs text-brand-900">▶</span> Watch the 45-second walkthrough
    </button>
</div>
</div>
{/*  Mockup Card Container  */}
<div className="mt-14 relative max-w-5xl mx-auto">
{/*  Responsive context disclosure (Visible on all screen sizes)  */}
<div className="flex items-center justify-center sm:justify-end mb-2 text-center sm:text-right px-2">
<span className="text-xs md:text-sm text-gray-600 font-medium bg-brand-50/90 border border-brand-200/80 px-3 py-1 rounded-full shadow-xs">
    Sample scenario: Stuttgart plant, Taiwan earthquake. Numbers come from demo plant data.
  </span>
</div>
{/*  Rich Interactive Mockup Dashboard Card  */}
<div className="bg-white rounded-2xl border border-brand-200 shadow-float overflow-hidden text-left" data-purpose="dashboard-mockup">
{/*  Window Titlebar / Navigation Mock  */}
<div className="bg-brand-50/80 px-6 py-3.5 border-b border-brand-200 flex flex-wrap items-center justify-between gap-4">
<div className="flex items-center gap-6 text-xs font-medium text-brand-600">
<span className="font-bold text-brand-900 flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-sm bg-brand-900 inline-block"></span> Sentinel UI
</span>
{['Overview', 'Notifications', 'Analytics', 'Saved reports'].map((tab) => (
  <button
    key={tab}
    type="button"
    onClick={() => setActiveTab(tab)}
    className={`cursor-pointer transition-colors ${
      activeTab === tab
        ? 'text-brand-900 font-semibold border-b-2 border-brand-900 pb-0.5'
        : 'text-brand-600 hover:text-brand-900'
    }`}
  >
    {tab}
  </button>
))}
<span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1 font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Live ERP Bridge
</span>
</div>
<div className="flex items-center gap-3 text-xs text-brand-400">
<div className="px-2.5 py-1 bg-white border border-brand-200 rounded-md text-brand-500 flex items-center gap-1.5 text-xs">
  <svg className="w-3 h-3 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
  <input 
    type="text" 
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search plant, part #, or disruption..." 
    className="bg-transparent border-none outline-none text-xs text-brand-800 placeholder-brand-400 w-36 sm:w-56"
  />
</div>
</div>
</div>
{/*  Dashboard Inner Content  */}
<div className="p-6 sm:p-8 space-y-6">
{/*  KPI Top 3-Card Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{/*  KPI 1  */}
<div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30">
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-brand-500">Daily Revenue at Risk</span>
<span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Severe Shock</span>
</div>
<div className="mt-2 text-2xl font-bold text-brand-900">$1,575,000<span className="text-xs font-normal text-brand-500">/day</span></div>
<div className="mt-1 flex items-center text-xs text-brand-600 gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Plant 1001 • Stuttgart Line 4
</div>
</div>
{/*  KPI 2  */}
<div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40">
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-brand-500">Mouser Qualified Stock</span>
<span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Lock Ready</span>
</div>
<div className="mt-2 text-2xl font-bold text-brand-900">3,384 <span className="text-xs font-normal text-brand-500">units</span></div>
<div className="mt-1 text-xs text-brand-600 truncate">
STM32F401RBT6TR • (Replaces STM32F401RE)
</div>
</div>
{/*  KPI 3  */}
<div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40">
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-brand-500">Line Buffer Remaining</span>
<span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Stoppage Warning</span>
</div>
<div className="mt-2 text-2xl font-bold text-brand-900">{'< 5 Days'}</div>
<div className="mt-1 text-xs text-brand-600">
Depletion Window: T+4.5 Days (Critical Buffer)
</div>
</div>
</div>
{/*  Interactive Telemetry Line Graph Mockup Area  */}
<div className="relative bg-white rounded-xl border border-brand-200 p-6 pt-5">
<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-100 gap-3">
<div>
<h4 className="text-sm font-semibold text-brand-900">Inventory Depletion vs. Spot Inbound Delivery Window</h4>
<p className="text-xs text-brand-500">Real-time simulation based on Plant 1001 burn rate</p>
</div>
{/*  Dynamic Range Switcher  */}
<div className="flex items-center gap-1 text-xs text-brand-500 bg-brand-50 p-1 rounded-lg border border-brand-200 self-start sm:self-auto" id="timelineTabs">
<button className="timeline-tab px-2 py-1 rounded transition text-brand-600 hover:text-brand-900" data-range="12m" type="button">12 months</button>
<button className="timeline-tab px-2 py-1 rounded transition text-brand-600 hover:text-brand-900" data-range="30d" type="button">30 days</button>
<button className="timeline-tab px-2 py-1 rounded transition font-semibold text-brand-900 bg-white shadow-xs" data-range="7d" type="button">7 days</button>
<button className="timeline-tab px-2 py-1 rounded transition text-brand-600 hover:text-brand-900" data-range="24h" type="button">24 hours</button>
</div>
</div>
{/*  SVG Graph Simulation  */}
<div className="h-44 w-full mt-4 relative">
<svg className="w-full h-full" id="telemetryChart" preserveAspectRatio="none" viewBox="0 0 800 160">
<defs>
<linearGradient id="gradientRisk" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#EF4444" stopOpacity="0.22"></stop>
<stop offset="100%" stopColor="#EF4444" stopOpacity="0.0"></stop>
</linearGradient>
<linearGradient id="gradientBuffer" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#10B981" stopOpacity="0.22"></stop>
<stop offset="100%" stopColor="#10B981" stopOpacity="0.0"></stop>
</linearGradient>
</defs>
{/*  Horizontal Gridlines  */}
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="20" y2="20"></line>
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="60" y2="60"></line>
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="140" y2="140"></line>
{/*  Inventory Burn Curve (Declining)  */}
<path d="M 0 30 Q 200 45 400 90 T 800 150 L 800 160 L 0 160 Z" fill="url(#gradientRisk)" id="burnArea"></path>
<path d="M 0 30 Q 200 45 400 90 T 800 150" fill="none" id="burnLine" stroke="#EF4444" strokeWidth="2.5"></path>
{/*  Inbound Spot Delivery Recovery Line  */}
<path d="M 420 150 Q 520 110 650 40 T 800 25 L 800 160 L 420 160 Z" fill="url(#gradientBuffer)" id="recoveryArea"></path>
<path d="M 420 150 Q 520 110 650 40 T 800 25" fill="none" id="recoveryLine" stroke="#10B981" strokeDasharray="4 4" strokeWidth="2.5"></path>
{/*  Event Indicator Point  */}
<circle cx="420" cy="150" fill="#10B981" id="eventMarker" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
</svg>
{/*  Graph Interactive Play Trigger  */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<a className="pointer-events-auto w-14 h-14 rounded-full bg-white/95 shadow-xl border border-brand-200/80 flex items-center justify-center text-brand-900 hover:scale-105 transition-transform backdrop-blur-sm group" href="#walkthrough" onClick={(e) => { e.preventDefault(); setShowWalkthrough(true); }} className="pointer-events-auto w-14 h-14 rounded-full bg-white/95 shadow-xl border border-brand-200/80 flex items-center justify-center text-brand-900 hover:scale-105 transition-transform backdrop-blur-sm group cursor-pointer">
<svg className="w-6 h-6 ml-0.5 text-brand-900 fill-current group-hover:text-indigo-600 transition-colors" viewBox="0 0 24 24">
<polygon points="6 4 20 12 6 20 6 4"></polygon>
</svg>
</a>
</div>
</div>
<div className="flex flex-wrap items-center justify-between text-xs text-brand-700 font-semibold mt-3 px-1 gap-2">
<span className="text-brand-600 font-medium">Day -7 (Normal Operation)</span>
<span className="text-rose-600 font-semibold">Day 0: Seismic Shock Recorded</span>
<span className="text-emerald-600 font-semibold">Day +3: Air Freight Inbound</span>
<span className="text-brand-600 font-medium">Day +7 (Buffer Restored)</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  END: HeroSection  */}
{/*  BEGIN: FeatureEngineSection  */}
<section className="py-24 bg-white border-t border-brand-100" data-purpose="engine-features" id="how-it-works">
<div className="max-w-6xl mx-auto px-6">
{/*  Section Header  */}
<div className="text-center max-w-3xl mx-auto mb-16">
<span className="text-xs font-semibold text-brand-500 uppercase tracking-widest">HOW IT WORKS</span>
<h2 className="text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight mt-3">
    From disruption alert to purchase request, in one flow.
  </h2>
<p className="mt-4 text-base text-brand-600 leading-relaxed">
    Six steps connect a world event to your parts, your revenue and a replacement you can order.
  </p>
</div>
{/*  2x3 Grid of 6 Feature Cards  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/*  Card 1  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<h3 className="text-lg font-semibold text-brand-900 mb-2">1. Early warning</h3>
<p className="text-sm text-brand-600 leading-relaxed">
  Live feeds from seismic networks, trade regulators and SEC filings, scanned continuously.
</p>
</div>
{/*  Card 2  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<h3 className="text-lg font-semibold text-brand-900 mb-2">2. Part-level impact</h3>
<p className="text-sm text-brand-600 leading-relaxed">
  We trace each event to the exact parts and finished products in your SAP bill of materials.
</p>
</div>
{/*  Card 3  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<h3 className="text-lg font-semibold text-brand-900 mb-2">3. Revenue at risk</h3>
<p className="text-sm text-brand-600 leading-relaxed">
  See the cost of the disruption in dollars per day, calculated precisely per manufacturing plant.
</p>
</div>
{/*  Card 4  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<h3 className="text-lg font-semibold text-brand-900 mb-2">4. Replacement sourcing</h3>
<p className="text-sm text-brand-600 leading-relaxed">
  We check live distributor stock for pin-compatible parts and rank them by availability, price and delivery time.
</p>
</div>
{/*  Card 5 (Shield with Checkmark Guardrail Icon)  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<h3 className="text-lg font-semibold text-brand-900 mb-2">5. Spending guardrails</h3>
<p className="text-sm text-brand-600 leading-relaxed">
  Quotes more than 10% above your SAP baseline, or alerts below 95% evidence confidence, never reach the approval step.
</p>
</div>
{/*  Card 6  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<h3 className="text-lg font-semibold text-brand-900 mb-2">6. Audit-ready paperwork</h3>
<p className="text-sm text-brand-600 leading-relaxed">
  Each purchase request comes with sources, part IDs and approved pricing in a one-page PDF.
</p>
</div>
</div>
{/*  Engine Section Bottom CTA  */}
<div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
<Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white font-semibold rounded-full px-6 py-2.5 transition shadow-subtle" href="/disruptions/DSP-092">
    Run the Taiwan earthquake scenario
    <svg className="w-3.5 h-3.5 ml-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</Link>
<a className="font-medium text-brand-600 hover:text-brand-900 flex items-center gap-1 transition-colors" href="https://github.com/itsksfit/SentinelChain_SAP#readme" rel="noopener noreferrer" target="_blank">
    Explore platform architecture <span aria-hidden="true">→</span>
</a>
</div>
</div>
</section>
{/*  END: FeatureEngineSection  */}
{/*  BEGIN: TrustIntegrations  */}
<section className="py-12 bg-white" data-purpose="trust-integrations" id="data-sources">
<div className="max-w-5xl mx-auto px-6">
{/*  Enclosed Gray Card Container  */}
<div className="bg-brand-50 rounded-3xl p-10 sm:p-12 border border-brand-200/70">
<div className="text-center mb-10">
<h3 className="text-lg sm:text-xl font-semibold text-brand-900 tracking-tight">
    Built on live public data and your SAP system.
  </h3>
<p className="text-xs sm:text-sm text-brand-500 mt-1 max-w-2xl mx-auto">
    Connected data sources and integrations. Today's demo runs on the SAP S/4HANA sandbox and live Mouser stock.
  </p>
</div>
<div className="space-y-6">
<div>
<div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3 px-1">Integrations</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-blue-600"></span>
<span className="font-semibold text-sm text-brand-800">SAP S/4HANA</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-blue-500"></span>
<span className="font-semibold text-sm text-brand-800">SAP Ariba</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-blue-700"></span>
<span className="font-semibold text-sm text-brand-800">Mouser Electronics</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-orange-600"></span>
<span className="font-semibold text-sm text-brand-800">Groq Inference</span>
</div>
</div>
</div>
<div>
<div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3 px-1">Disruption Feeds &amp; Public Data Sources</div>
<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
<div className="bg-white border border-brand-200 rounded-xl py-3 px-3 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors text-center">
<span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
<span className="font-semibold text-xs text-brand-800">USGS Seismic Net</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-3 px-3 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors text-center">
<span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
<span className="font-semibold text-xs text-brand-800">Federal Register (BIS)</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-3 px-3 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors text-center">
<span className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></span>
<span className="font-semibold text-xs text-brand-800">SEC EDGAR</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-3 px-3 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors text-center">
<span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
<span className="font-semibold text-xs text-brand-800">NY Fed GSCPI</span>
</div>
<div className="col-span-2 md:col-span-1 bg-white border border-brand-200 rounded-xl py-3 px-3 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors text-center">
<span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
<span className="font-semibold text-xs text-brand-800">Foundry IR (TSMC/ASML)</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  END: TrustIntegrations  */}
{/*  BEGIN: CustomerTestimonial  */}
<section className="py-20 bg-white" data-purpose="customer-testimonial" id="scenario">
<div className="max-w-5xl mx-auto px-6">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
{/*  Text column  */}
<div className="lg:col-span-7 space-y-6">
<h2 className="text-2xl sm:text-3xl font-bold text-brand-900 leading-snug tracking-tight">
  When a chip fab goes down, most teams find out from the news.
</h2>
<p className="text-base sm:text-lg text-brand-600 leading-relaxed">
  By the time procurement has traced the affected parts, called suppliers and chased approvals, the spare stock is gone. SentinelChain connects the event to your part, your plant and a replacement you can order.
</p>
<div className="pt-2 flex flex-wrap items-center gap-3">
<Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-sm font-semibold rounded-full px-6 py-2.5 transition shadow-subtle" href="/disruptions/DSP-092">
    Launch live scenario
    <svg className="w-3.5 h-3.5 ml-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</Link>
<a className="inline-flex items-center justify-center text-brand-700 hover:text-brand-900 text-sm font-medium px-4 py-2" href="#faq">
    Review FAQ &amp; Guardrails ↓
  </a>
</div>
</div>
{/*  Dashboard Decision Preview Graphic  */}
<div className="lg:col-span-5 flex flex-col items-center justify-center">
<div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-card border border-brand-200 bg-white p-5 space-y-4">
<div className="flex items-center justify-between pb-3 border-b border-brand-100">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
<span className="text-xs font-bold text-brand-900 uppercase tracking-wider">Fab Incident M6.4</span>
</div>
<span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Critical</span>
</div>
<div className="space-y-2 text-xs">
<div className="flex justify-between py-1 border-b border-brand-50">
<span className="text-brand-500">Affected Component</span>
<span className="font-mono font-semibold text-brand-900">STM32F401RE</span>
</div>
<div className="flex justify-between py-1 border-b border-brand-50">
<span className="text-brand-500">Plant Exposure</span>
<span className="font-semibold text-brand-900">Stuttgart Line 4</span>
</div>
<div className="flex justify-between py-1 border-b border-brand-50">
<span className="text-brand-500">Revenue at Risk</span>
<span className="font-bold text-rose-600">$1,575,000 / day</span>
</div>
<div className="flex justify-between py-1">
<span className="text-brand-500">Qualified drop-in</span>
<span className="font-semibold text-emerald-600">3,384 in stock (Mouser)</span>
</div>
</div>
<div className="pt-2 border-t border-brand-100 flex items-center justify-between">
<span className="text-xs font-medium text-brand-500">Staged PR: PR-ARIB-2026-092</span>
<span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Ready for approval</span>
</div>
</div>
<span className="text-xs font-medium text-gray-600 mt-2 text-center">Sample scenario using demo data.</span>
</div>
</div>
</div>
</section>
{/*  END: CustomerTestimonial  */}
{/*  BEGIN: FAQ Section  */}
<section className="py-20 bg-brand-50/50 border-t border-brand-200" id="faq">
<div className="max-w-4xl mx-auto px-6">
<div className="text-center mb-12">
<span className="text-xs font-semibold text-brand-500 uppercase tracking-widest">FREQUENTLY ASKED QUESTIONS</span>
<h2 className="text-3xl font-bold text-brand-900 tracking-tight mt-2">Clear answers to your technical questions</h2>
<p className="text-brand-600 text-sm mt-2">Everything you need to know about system architecture, safety guardrails, and data integrity.</p>
</div>
<div className="space-y-4" id="faqAccordion">
  {faqItems.map((item, idx) => {
    const isExpanded = openFaqs[idx] ?? (idx === 0);
    return (
      <div key={idx} className="faq-item border border-brand-200 rounded-xl bg-white overflow-hidden transition-all shadow-subtle">
        <button 
          onClick={() => toggleFaq(idx)}
          className="faq-question w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-brand-900 hover:text-brand-700 transition-colors cursor-pointer"
        >
          <span>{item.q}</span>
          <svg className={`faq-icon w-5 h-5 text-brand-400 transition-transform duration-200 shrink-0 ml-4 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        {isExpanded && (
          <div className="faq-answer px-6 pb-4 pt-1 text-sm text-brand-600 leading-relaxed border-t border-brand-100/60 bg-brand-50/20">
            {item.a}
          </div>
        )}
      </div>
    );
  })}
</div>
</div>
</section>
{/*  END: FAQ Section  */}
{/*  BEGIN: PreFooterBanner  */}
<section className="py-12 bg-white" data-purpose="pre-footer-cta">
<div className="max-w-5xl mx-auto px-6">
<div className="bg-brand-50 rounded-3xl p-10 sm:p-14 text-center border border-brand-200/80 shadow-subtle">
<h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
  Find your exposure before the next disruption does.
</h2>
<p className="mt-3 text-sm sm:text-base text-brand-600 max-w-xl mx-auto">
  Run the interactive Taiwan earthquake scenario on live Mouser stock and a SAP sandbox.
</p>
<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
<Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle" href="/disruptions/DSP-092">
  Run the scenario
  <svg className="w-4 h-4 ml-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</Link>
<a className="inline-flex items-center justify-center bg-white hover:bg-brand-100 text-brand-700 text-sm font-semibold rounded-full px-6 py-3 transition border border-brand-300 shadow-subtle" href="mailto:contact@sentinelchain.com">
  Get in touch
</a>
</div>
</div>
</div>
</section>
{/*  END: PreFooterBanner  */}
</main>
{/*  BEGIN: Footer  */}
<footer className="bg-white border-t border-brand-200 pt-16 pb-12" data-purpose="page-footer">
<div className="max-w-6xl mx-auto px-6">
{/*  3 Column Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-sm max-w-3xl">
{/*  Col 1: Product  */}
<div>
<h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wider mb-4">Product</h4>
<ul className="space-y-2.5 text-brand-600">
<li><a className="hover:text-brand-900 transition-colors" href="#">Overview</a></li>
<li><Link className="hover:text-brand-900 transition-colors" href="/disruptions/DSP-092">Live Demo</Link></li>
<li><a className="hover:text-brand-900 transition-colors" href="#how-it-works">How it works</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="#scenario">Scenario preview</a></li>
</ul>
</div>
{/*  Col 2: Resources  */}
<div>
<h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wider mb-4">Resources</h4>
<ul className="space-y-2.5 text-brand-600">
<li><a className="hover:text-brand-900 transition-colors" href="https://github.com/itsksfit/SentinelChain_SAP" rel="noopener noreferrer" target="_blank">GitHub</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="https://github.com/itsksfit/SentinelChain_SAP#readme" rel="noopener noreferrer" target="_blank">Platform Architecture</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="#data-sources">Data sources</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="#faq">FAQ &amp; Guardrails</a></li>
</ul>
</div>
{/*  Col 3: Contact  */}
<div>
<h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wider mb-4">Contact</h4>
<ul className="space-y-2.5 text-brand-600">
<li><a className="hover:text-brand-900 transition-colors" href="mailto:contact@sentinelchain.com">Get in touch (contact@sentinelchain.com)</a></li>
</ul>
</div>
</div>
{/*  Bottom Bar  */}
<div className="pt-8 border-t border-brand-200 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-500 gap-4">
<div className="flex items-center gap-2">
<div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-900 shadow-xs">
<img alt="SentinelChain" className="h-5 w-auto object-contain" src="/logo.png"/>
</div>
<span>SentinelChain © 2026. Supply chain disruption intelligence.</span>
</div>
<div className="text-brand-400">
  Integrated with SAP S/4HANA &amp; SAP Ariba APIs
</div>
</div>
</div>
</footer>
{/*  END: Footer  */}

{/*  BEGIN: Interactive Walkthrough Modal  */}
<div className={`${showWalkthrough ? "flex" : "hidden"} fixed inset-0 z-50 bg-black/60 backdrop-blur-sm items-center justify-center p-4`} id="walkthroughModal" onClick={(e) => { if (e.target.id === 'walkthroughModal') setShowWalkthrough(false); }}>
<div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-200 relative animate-in fade-in zoom-in-95 duration-200">
<button aria-label="Close walkthrough" onClick={() => setShowWalkthrough(false)} className="absolute top-4 right-4 p-2 text-brand-400 hover:text-brand-900 rounded-full hover:bg-brand-50 cursor-pointer" id="closeWalkthroughBtn">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</button>
<div className="flex items-center gap-2 mb-2">
<span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
<span className="text-xs uppercase font-bold tracking-wider text-brand-500">45-Second Flow Walkthrough</span>
</div>
<h3 className="text-xl sm:text-2xl font-bold text-brand-900">How SentinelChain Responds in Seconds</h3>
<p className="text-sm text-brand-600 mt-1">Autonomous orchestration from raw sensor feed to ERP draft PO.</p>
{/*  Steps Progression  */}
<div className="mt-6 space-y-4 text-sm">
<div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-start gap-3">
<span className="px-2 py-0.5 rounded bg-brand-900 text-white font-mono text-xs font-bold mt-0.5">00:05</span>
<div>
<strong className="text-brand-900 block font-semibold">1. Seismic / Trade Event Ingestion</strong>
<span className="text-brand-600 text-xs">USGS registers 6.4M epicenter 18km from Hsinchu Science Park. Groq parses severity, foundry coordinates, and wafer fab lines.</span>
</div>
</div>
<div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-start gap-3">
<span className="px-2 py-0.5 rounded bg-brand-900 text-white font-mono text-xs font-bold mt-0.5">00:15</span>
<div>
<strong className="text-brand-900 block font-semibold">2. S/4HANA BOM &amp; Plant Exposure Mapping</strong>
<span className="text-brand-600 text-xs">Cross-references SAP Material Masters. Identifies critical MCU STM32F401RE halting Stuttgart Line 4 with $1,575,000/day revenue impact.</span>
</div>
</div>
<div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-start gap-3">
<span className="px-2 py-0.5 rounded bg-brand-900 text-white font-mono text-xs font-bold mt-0.5">00:30</span>
<div>
<strong className="text-brand-900 block font-semibold">3. Real-Time Replacement Sourcing &amp; Guardrails</strong>
<span className="text-brand-600 text-xs">Scans Mouser inventory for pin-compatible STM32F401RBT6TR (3,384 units verified). Confirms delta {'<10%'} baseline cost.</span>
</div>
</div>
<div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-start gap-3">
<span className="px-2 py-0.5 rounded bg-brand-900 text-white font-mono text-xs font-bold mt-0.5">00:45</span>
<div>
<strong className="text-brand-900 block font-semibold">4. One-Click PR-ARIB-2026-092 Stage</strong>
<span className="text-brand-600 text-xs">Generates ready-for-approval SAP requisition with full audit PDF trail before spot distributor stock runs out.</span>
</div>
</div>
</div>
<div className="mt-6 pt-4 border-t border-brand-100 flex items-center justify-between">
<button onClick={() => setShowWalkthrough(false)} className="text-xs font-medium text-brand-500 hover:text-brand-900 cursor-pointer" id="closeWalkthroughBtn2">Close preview</button>
<Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-xs font-semibold rounded-full px-5 py-2.5 transition shadow-subtle cursor-pointer" href="/disruptions/DSP-092">
        Try it live in sandbox →
      </Link>
</div>
</div>
</div>
{/*  END: Interactive Walkthrough Modal  */}
    </div>
  );
}
