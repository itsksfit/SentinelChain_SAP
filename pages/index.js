import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SentinelChainLandingPage() {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('7 days');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white text-brand-900 font-sans antialiased selection:bg-brand-900 selection:text-white">
      <Head>
        <title>SentinelChain — Autonomous Enterprise Supply Chain Resilience</title>
        <meta name="description" content="SentinelChain watches earthquakes, export rules and filings, matches them to the parts in your SAP bill of materials, shows the revenue at risk per day, and drafts the purchase request for in-stock replacements." />
        <link rel="icon" href="/shield.png" />
      </Head>

{/*  BEGIN: Navigation  */}
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-200">
<div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
{/*  Brand Logo  */}
<Link className="flex items-center gap-3 group" data-purpose="site-brand" href="/"><div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-brand-900 shadow-subtle hover:bg-black transition-colors"><img alt="SentinelChain Logo" className="h-10 w-auto object-contain filter contrast-125" src="/logo.png" /></div></Link>
{/*  Desktop Navigation Links  */}
<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-600" data-purpose="primary-navigation"><a className="hover:text-brand-900 transition-colors" href="#how-it-works">How it works</a>
<a className="hover:text-brand-900 transition-colors" href="#scenario">Scenario</a>
<a className="hover:text-brand-900 transition-colors" href="#data-sources">Data sources</a>
<a className="hover:text-brand-900 transition-colors" href="#faq">FAQ</a></nav>
{/*  Action Buttons  */}
<div className="flex items-center gap-4">
  <Link href="/login" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors hidden sm:inline-block">
    Enterprise Login
  </Link>
  <Link className="inline-flex items-center justify-center text-sm font-medium text-white bg-brand-900 hover:bg-black rounded-full px-4 py-2 transition-all shadow-subtle hover:scale-[1.02]" href="/dashboard?demo=true">
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
{/*  Live Alert / Announcement Pill  */}

{/*  Hero Headline  */}
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-900 max-w-4xl mx-auto leading-[1.12]">Know which production line will stop, before it stops.</h1>
{/*  Subtitle  */}
<p className="mt-6 text-base sm:text-lg text-brand-600 max-w-2xl mx-auto leading-relaxed">SentinelChain watches earthquakes, export rules and filings, matches them to the parts in your SAP bill of materials, shows the revenue at risk per day, and drafts the purchase request for in-stock replacements.</p>
{/*  CTA Row  */}
<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"><div className="flex flex-col items-center">
<Link className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle hover:scale-[1.01]" href="/dashboard?demo=true&scenario=taiwan">
              Run the Taiwan earthquake scenario
            </Link>
<span className="text-xs text-brand-400 mt-2 font-normal">Sandbox data. No SAP connection needed.</span>
</div>
<div className="flex flex-col items-center self-start">
<button onClick={() => setShowWalkthrough(true)} className="w-full sm:w-auto inline-flex items-center justify-center border border-brand-300 bg-white hover:bg-brand-50 text-brand-700 text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle gap-2 cursor-pointer">
<span className="text-xs">▶</span> Watch the 45-second walkthrough
            </button>
</div></div>
{/*  Mockup Card Container  */}
<div className="mt-14 relative max-w-5xl mx-auto">
{/*  Curved annotation arrow pointing to Card 1  */}
<div className="hidden lg:flex items-center justify-end mb-2 text-right pr-2">
<span className="text-xs font-normal text-brand-500 bg-white/90 px-2 py-0.5 rounded shadow-xs">
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
    onClick={() => setActiveTab(tab)}
    className={`cursor-pointer transition-colors ${
      activeTab === tab
        ? 'text-brand-900 font-semibold border-b-2 border-brand-900 pb-0.5'
        : 'hover:text-brand-900'
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
  <svg className="w-3 h-3 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
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
                    STM32F401RBT6TR • 100% Drop-in
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
                    Depletion Date: Nov 18, 14:00 CET
                  </div>
</div>
</div>
{/*  Interactive Telemetry Line Graph Mockup Area  */}
<div className="relative bg-white rounded-xl border border-brand-200 p-6 pt-5">
<div className="flex items-center justify-between pb-4 border-b border-brand-100">
<div>
<h4 className="text-sm font-semibold text-brand-900">Inventory Depletion vs. Spot Inbound Delivery Window</h4>
<p className="text-xs text-brand-500">Real-time simulation based on Plant 1001 burn rate</p>
</div>
<div className="flex items-center gap-1.5 text-xs text-brand-500 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
  {['12 months', '30 days', '7 days', '24 hours'].map((range) => (
    <button
      key={range}
      onClick={() => setTimeRange(range)}
      className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
        timeRange === range
          ? 'font-semibold text-brand-900 bg-white shadow-xs'
          : 'hover:text-brand-900'
      }`}
    >
      {range}
    </button>
  ))}
</div>
</div>
{/*  SVG Graph Simulation  */}
<div className="h-44 w-full mt-4 relative">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 160">
<defs>
<linearGradient id="gradientRisk" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#EF4444" stopOpacity="0.18"></stop>
<stop offset="100%" stopColor="#EF4444" stopOpacity="0.0"></stop>
</linearGradient>
<linearGradient id="gradientBuffer" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#10B981" stopOpacity="0.2"></stop>
<stop offset="100%" stopColor="#10B981" stopOpacity="0.0"></stop>
</linearGradient>
</defs>
{/*  Horizontal Gridlines  */}
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="20" y2="20"></line>
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="60" y2="60"></line>
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
<line stroke="#F2F4F7" strokeWidth="1" x1="0" x2="800" y1="140" y2="140"></line>
{/*  Inventory Burn Curve (Declining)  */}
<path d="M 0 30 Q 200 45 400 90 T 800 150 L 800 160 L 0 160 Z" fill="url(#gradientRisk)"></path>
<path d="M 0 30 Q 200 45 400 90 T 800 150" fill="none" stroke="#EF4444" strokeWidth="2.5"></path>
{/*  Inbound Spot Delivery Recovery Line  */}
<path d="M 420 150 Q 520 110 650 40 T 800 25 L 800 160 L 420 160 Z" fill="url(#gradientBuffer)"></path>
<path d="M 420 150 Q 520 110 650 40 T 800 25" fill="none" stroke="#10B981" strokeDasharray="4 4" strokeWidth="2.5"></path>
{/*  Event Indicator Point  */}
<circle cx="420" cy="150" fill="#10B981" r="4.5" stroke="#FFFFFF" strokeWidth="2"></circle>
</svg>
{/*  Graph Overlay Play Button Mockup (matching Untitled UI hero asset)  */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
<button onClick={() => setShowWalkthrough(true)} className="w-14 h-14 rounded-full bg-white/90 shadow-xl border border-brand-200/80 flex items-center justify-center text-brand-900 hover:scale-105 transition-transform backdrop-blur-sm cursor-pointer" title="Watch Walkthrough">
<svg className="w-6 h-6 ml-0.5 text-brand-900 fill-current" viewBox="0 0 24 24">
<polygon points="6 4 20 12 6 20 6 4"></polygon>
</svg>
</button>
</div>
</div>
<div className="flex items-center justify-between text-xs text-brand-700 font-semibold mt-3 px-1">
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
<div className="text-center max-w-3xl mx-auto mb-16"><span className="text-xs font-semibold text-brand-500 uppercase tracking-widest">HOW IT WORKS</span>
<h2 className="text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight mt-3">
            From disruption alert to purchase request, in one flow.
          </h2>
<p className="mt-4 text-base text-brand-600 leading-relaxed">
            Six steps connect a world event to your parts, your revenue and a replacement you can order.
          </p></div>
{/*  2x3 Grid of 6 Feature Cards  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/*  Card 1  */}
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
              See the cost of the disruption in dollars per day, by plant.
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
{/*  Card 5  */}
<div className="p-8 rounded-2xl border border-brand-200 bg-white hover:border-brand-300 hover:shadow-card transition-all group">
<div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
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
</div></div>
{/*  Engine Section Bottom CTA  */}
<div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"><Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white font-semibold rounded-full px-6 py-2.5 transition shadow-subtle" href="/dashboard?demo=true&scenario=taiwan">
            Run the Taiwan earthquake scenario
          </Link>
<a className="font-medium text-brand-600 hover:text-brand-900 flex items-center gap-1 transition-colors" href="/">
            Explore platform architecture <span aria-hidden="true">→</span>
</a></div>
</div>
</section>
{/*  END: FeatureEngineSection  */}
{/*  BEGIN: TrustIntegrations  */}
<section className="py-12 bg-white" data-purpose="trust-integrations" id="data-sources">
<div className="max-w-5xl mx-auto px-6">
{/*  Enclosed Gray Card Container  */}
<div className="bg-brand-50 rounded-3xl p-10 sm:p-12 border border-brand-200/70"><div className="text-center mb-10">
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
<div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3 px-1">Data sources</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-emerald-600"></span>
<span className="font-semibold text-sm text-brand-800">USGS Seismic Net</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-amber-600"></span>
<span className="font-semibold text-sm text-brand-800">Federal Register (BIS)</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-slate-700"></span>
<span className="font-semibold text-sm text-brand-800">SEC EDGAR</span>
</div>
<div className="bg-white border border-brand-200 rounded-xl py-4 px-4 shadow-subtle flex items-center justify-center gap-2 hover:border-brand-300 transition-colors">
<span className="w-2 h-2 rounded-full bg-indigo-600"></span>
<span className="font-semibold text-sm text-brand-800">NY Fed Supply Chain Index</span>
</div>
</div>
</div>
</div></div>
</div>
</section>
{/*  END: TrustIntegrations  */}
{/*  BEGIN: CustomerTestimonial  */}
<section className="py-20 bg-white" data-purpose="customer-testimonial" id="scenario">
<div className="max-w-5xl mx-auto px-6">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">{/*  Text column  */}
<div className="lg:col-span-7 space-y-6">
<h2 className="text-2xl sm:text-3xl font-bold text-brand-900 leading-snug tracking-tight">
  When a chip fab goes down, most teams find out from the news.
</h2>
<p className="text-base sm:text-lg text-brand-600 leading-relaxed">
  By the time procurement has traced the affected parts, called suppliers and chased approvals, the spare stock is gone. SentinelChain connects the event to your part, your plant and a replacement you can order.
</p>
<div className="pt-2 flex items-center gap-3">
  <Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-sm font-semibold rounded-full px-6 py-2.5 transition shadow-subtle" href="/dashboard?demo=true&scenario=taiwan">
    Explore the flow
  </Link>
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
      <span className="font-bold text-rose-600">$1.58M / day</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-brand-500">Approved Drop-in</span>
      <span className="font-semibold text-emerald-600">3,384 in stock (Mouser)</span>
    </div>
  </div>
  <div className="pt-2 border-t border-brand-100 flex items-center justify-between">
    <span className="text-xs font-medium text-brand-500">Auto PR Draft: #PR-88410</span>
    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Ready to order</span>
  </div>
</div>
<span className="text-xs text-brand-400 mt-2 font-normal">Sample scenario using demo data.</span>
</div></div>
</div>
</section>
{/*  END: CustomerTestimonial  */}
{/*  BEGIN: PreFooterBanner  */}
<section className="py-12 bg-white" data-purpose="pre-footer-cta">
<div className="max-w-5xl mx-auto px-6">
<div className="bg-brand-50 rounded-3xl p-10 sm:p-14 text-center border border-brand-200/80 shadow-subtle"><h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
            Find your exposure before the next disruption does.
          </h2>
<p className="mt-3 text-sm sm:text-base text-brand-600 max-w-xl mx-auto">
            Run the interactive Taiwan earthquake scenario on live Mouser stock and a SAP sandbox.
          </p>
<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
<Link className="inline-flex items-center justify-center bg-brand-900 hover:bg-black text-white text-sm font-semibold rounded-full px-6 py-3 transition shadow-subtle" href="/dashboard?demo=true&scenario=taiwan">
              Run the scenario
            </Link>
<a className="inline-flex items-center justify-center bg-white hover:bg-brand-100 text-brand-700 text-sm font-semibold rounded-full px-6 py-3 transition border border-brand-300 shadow-subtle" href="#faq">
              Get in touch
            </a>
</div></div>
</div>
</section>
{/*  END: PreFooterBanner  */}
</main>
{/*  BEGIN: Footer  */}
<footer className="bg-white border-t border-brand-200 pt-16 pb-12" data-purpose="page-footer" id="faq">
<div className="max-w-6xl mx-auto px-6">
{/*  5 Column Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-sm max-w-3xl">
{/*  Col 1: Product  */}
<div>
<h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wider mb-4">Product</h4>
<ul className="space-y-2.5 text-brand-600">
<li><a className="hover:text-brand-900 transition-colors" href="/">Overview</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="/dashboard?demo=true">Live Demo</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="#how-it-works">How it works</a></li>
</ul>
</div>
{/*  Col 2: Resources  */}
<div>
<h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wider mb-4">Resources</h4>
<ul className="space-y-2.5 text-brand-600">
<li><a className="hover:text-brand-900 transition-colors" href="/">GitHub</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="#data-sources">Data sources</a></li>
<li><a className="hover:text-brand-900 transition-colors" href="#faq">FAQ</a></li>
</ul>
</div>
{/*  Col 3: Contact  */}
<div>
<h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wider mb-4">Contact</h4>
<ul className="space-y-2.5 text-brand-600">
<li><a className="hover:text-brand-900 transition-colors" href="/">Get in touch</a></li>
</ul>
</div>
</div>
{/*  Bottom Bar  */}
<div className="pt-8 border-t border-brand-200 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-500 gap-4"><div className="flex items-center gap-2">
<div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-brand-900 shadow-xs"><img alt="SentinelChain" className="h-5 w-auto object-contain" src="/logo.png" /></div>
<span>SentinelChain © 2026. Supply chain disruption intelligence.</span>
</div></div>
</div>
</footer>
{/*  END: Footer  */}
      {/* 45-Second Walkthrough Modal */}
      {showWalkthrough && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-brand-200 relative">
            <button 
              onClick={() => setShowWalkthrough(false)}
              className="absolute top-4 right-4 text-brand-400 hover:text-brand-900 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Walkthrough Simulation</span>
            </div>
            <h3 className="text-xl font-bold text-brand-900 mb-2">Autonomous Supply Chain Resilience in 45s</h3>
            <p className="text-sm text-brand-600 mb-5 leading-relaxed">
              Watch SentinelChain ingest a real-time USGS seismic alert, correlate the Taiwan chip corridor against SAP S/4HANA BOM line items, identify $1.58M/day exposure on Stuttgart Line 4, and draft an approved Mouser requisition in SAP Ariba.
            </p>
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-200 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-brand-700">
                <span>00:01 - USGS Telemetry Signal</span>
                <span className="text-rose-600 font-semibold">[M6.4 SHOCK]</span>
              </div>
              <div className="flex items-center justify-between text-brand-700">
                <span>00:12 - SAP BOM Correlation</span>
                <span className="text-brand-900 font-semibold">STM32F401RE</span>
              </div>
              <div className="flex items-center justify-between text-brand-700">
                <span>00:24 - Financial Risk Engine</span>
                <span className="text-rose-600 font-semibold">$1,575,000 / day</span>
              </div>
              <div className="flex items-center justify-between text-brand-700">
                <span>00:35 - Mouser Component Match</span>
                <span className="text-emerald-600 font-semibold">3,384 In-Stock Units</span>
              </div>
              <div className="flex items-center justify-between text-brand-700">
                <span>00:45 - SAP Ariba Requisition</span>
                <span className="text-indigo-600 font-semibold">#PR-88410 Generated</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowWalkthrough(false)}
                className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-900 cursor-pointer"
              >
                Close
              </button>
              <Link 
                href="/dashboard?demo=true&scenario=taiwan"
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-900 hover:bg-black rounded-full shadow-subtle transition-all cursor-pointer"
              >
                Launch Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
