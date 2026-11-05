import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { 
  Check, ArrowRight, ShieldCheck, Zap, Calculator, 
  DollarSign, TrendingUp, AlertTriangle, Layers, Cpu, 
  Activity, ShieldAlert, CheckCircle2, Lock, Radio, Database, FileText, Sparkles, ChevronRight, Sliders
} from 'lucide-react';
import React, { useState } from 'react';

export default function PricingCommercialModel() {
  // Interactive ROI & Cost Simulation Inputs
  const [plants, setPlants] = useState(3);
  const [spendMillions, setSpendMillions] = useState(45);
  const [exposureMillions, setExposureMillions] = useState(24);
  const [recoveryRate, setRecoveryRate] = useState(92);

  // Model Constants
  const FLAT_FEE_PER_PLANT = 65000; // $65k/yr per plant for Monitor
  const FEE_PER_MILLION_SPEND = 2500; // $2,500/yr per $1M spend for Respond
  const BASIS_POINTS_FEE = 0.0015; // 15 basis points (0.15%) on recovered revenue for Autonomous

  // Calculated Costs
  const monitorAnnualFee = plants * FLAT_FEE_PER_PLANT;
  const respondAnnualFee = spendMillions * FEE_PER_MILLION_SPEND;
  const standardTierTotal = monitorAnnualFee + respondAnnualFee;

  const grossRecoveredRevenue = (exposureMillions * 1000000) * (recoveryRate / 100);
  const autonomousSuccessFee = Math.round(grossRecoveredRevenue * BASIS_POINTS_FEE);
  const autonomousTierTotal = standardTierTotal + autonomousSuccessFee;

  const netSavings = Math.round(grossRecoveredRevenue - autonomousTierTotal);
  const roiMultiple = (grossRecoveredRevenue / autonomousTierTotal).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Commercial Model & Pricing | SentinelChain</title>
        <meta name="description" content="Outcome and exposure-based enterprise pricing for SentinelChain supply chain risk management." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-400 gap-2">
            <Link href="/" className="hover:text-primary-500 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white">Commercial Architecture</span>
          </div>

          {/* Editorial Header */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Outcome & Exposure-Based Pricing
                </span>
                <span className="text-xs font-mono font-bold text-secondary-400">
                  Zero Per-Seat Penalties
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/risk" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-amber-600 dark:text-amber-400">
                  <Activity className="w-3.5 h-3.5" /> Risk Matrix
                </Link>
                <Link href="/disruptions" className="btn-primary !h-9 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5" /> Active Threats
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Value-Aligned <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Commercial Model.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Priced strictly against physical plant footprint, material spend under management, and protected gross margin — eliminating per-seat licensing penalties so entire engineering and procurement teams can collaborate freely.
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Tier 1: Monitor</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">$65k<span className="text-sm font-normal text-secondary-400">/plant</span></span>
              <span className="text-xs text-secondary-400">Signal ingestion & ERP BOM exposure</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Tier 2: Respond</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">$2.5k<span className="text-sm font-normal text-secondary-400">/$1M</span></span>
              <span className="text-xs text-secondary-400">Live Mouser spot sourcing & guardrails</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Tier 3: Autonomous</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">15 bps</span>
              <span className="text-xs text-secondary-400">Success fee on saved gross revenue</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Simulated Net ROI</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">{roiMultiple}x</span>
              <span className="text-xs text-secondary-400">${(netSavings / 1000000).toFixed(2)}M projected net margin</span>
            </div>
          </div>

          {/* Pricing Sequencing Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Phase 1: Ingest & Correlate</span>
                <h3 className="text-base font-extrabold text-secondary-900 dark:text-white mt-1">1. Monitor</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1.5 leading-relaxed">
                  Flat annual license per plant/BOM connected. Telemetry ingestion, deterministic S/4HANA correlation, and $/day revenue-at-risk.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-800 border border-[#E5E7EB] dark:border-[#262626] flex items-center justify-center text-secondary-700 dark:text-secondary-300 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-500">Phase 2: Source & Match</span>
                <h3 className="text-base font-extrabold text-secondary-900 dark:text-white mt-1">2. Respond</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1.5 leading-relaxed">
                  Priced per $M of spend under management. Live franchised distributor catalog matching (Mouser/Arrow), pinout spec compare & RFQ drafter.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Phase 3: Execute & Settle</span>
                <h3 className="text-base font-extrabold text-secondary-900 dark:text-white mt-1">3. Autonomous</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1.5 leading-relaxed">
                  Direct SAP S/4HANA & Ariba PR auto-execution. Priced on a success-aligned basis point fee (15 bps) on measured revenue saved.
                </p>
              </div>
            </div>
          </div>

          {/* TWO MAIN SUBSCRIPTION PACKAGES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* TIER 1 & 2: STANDARD ENTERPRISE */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col justify-between relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300">
                      Standard Package
                    </span>
                    <h2 className="text-2xl font-black text-secondary-900 dark:text-white mt-3">Core Operational License</h2>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      Includes <strong className="text-secondary-900 dark:text-white">Tier 1: Monitor</strong> + <strong className="text-secondary-900 dark:text-white">Tier 2: Respond</strong>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-800 border border-[#E5E7EB] dark:border-[#262626] flex items-center justify-center text-secondary-700 dark:text-secondary-300 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#F9FAFB] dark:bg-[#18191D] border border-[#E5E7EB] dark:border-[#262626] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-secondary-500 uppercase">Fixed Component (Monitor):</span>
                    <span className="font-mono font-extrabold text-secondary-900 dark:text-white text-sm">$65,000 <span className="text-xs text-secondary-400 font-normal">/ plant / yr</span></span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[#E5E7EB] dark:border-[#262626]">
                    <span className="text-xs font-bold text-secondary-500 uppercase">Variable Component (Respond):</span>
                    <span className="font-mono font-extrabold text-secondary-900 dark:text-white text-sm">$2,500 <span className="text-xs text-secondary-400 font-normal">/ $1M spend / yr</span></span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-400">Included Core Capabilities:</h4>
                  <ul className="space-y-2.5 text-xs text-secondary-700 dark:text-secondary-300">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Full USGS, Fed Register BIS & Taiwan MOEA signal ingestion feeds</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Real-time BOM exposure correlation & revenue-at-risk calculations</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Mouser Electronics franchised distributor live catalog lookup</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Pin-to-pin technical spec comparison & drop-in qualification matrix</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>AI-drafted commercial spot RFQ & distributor email generation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-[#E5E7EB] dark:border-[#262626]">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs font-bold text-secondary-500 uppercase">Current Parameter Estimate:</span>
                  <span className="text-2xl font-black text-secondary-900 dark:text-white">${standardTierTotal.toLocaleString()} <span className="text-xs text-secondary-400 font-normal">/ yr</span></span>
                </div>
                <button className="w-full py-3 px-4 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-[#F9FAFB] hover:bg-secondary-100 dark:bg-[#18191D] dark:hover:bg-[#222328] text-xs font-bold uppercase tracking-wider text-secondary-900 dark:text-white transition-all shadow-2xs">
                  Request Standard POC Deployment
                </button>
              </div>
            </div>

            {/* TIER 3: AUTONOMOUS ENTERPRISE RESILIENCE */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#141414] border-2 border-primary-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-xs">
                Featured Autonomous Tier
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40">
                      Complete Autonomous Stack
                    </span>
                    <h2 className="text-2xl font-black text-secondary-900 dark:text-white mt-3">Autonomous Resilience Edition</h2>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      Includes <strong className="text-secondary-900 dark:text-white">Monitor</strong> + <strong className="text-secondary-900 dark:text-white">Respond</strong> + <strong className="text-primary-600 dark:text-primary-400">Autonomous Ariba PR Auto-Execution</strong>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800/40 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase">Base Core Platform:</span>
                    <span className="font-mono font-extrabold text-secondary-900 dark:text-white text-sm">${standardTierTotal.toLocaleString()} <span className="text-xs text-secondary-400 font-normal">/ yr</span></span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-primary-200/60 dark:border-primary-800/40">
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase">Autonomous Success Fee:</span>
                    <span className="font-mono font-extrabold text-primary-600 dark:text-primary-400 text-sm">15 bps (0.15%) <span className="text-xs text-secondary-400 font-normal">of saved revenue</span></span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-400">Everything in Standard, plus Autonomous Execution:</h4>
                  <ul className="space-y-2.5 text-xs text-secondary-700 dark:text-secondary-300">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span className="font-bold text-secondary-900 dark:text-white">Direct SAP Ariba Purchase Requisition (PR) automated creation & dispatch</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span>SAP S/4HANA material document reservation & live stock synchronization</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span>Continuous AI autonomous chase agent for spot distributor allocation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span>Cryptographic Recovery Ledger audit trail & PDF PR dossier generation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span>Value-aligned success fee: zero risk if no revenue is protected</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-[#E5E7EB] dark:border-[#262626]">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs font-bold text-secondary-500 uppercase">Simulated Gross Investment:</span>
                  <span className="text-2xl font-black text-primary-600 dark:text-primary-400">${autonomousTierTotal.toLocaleString()} <span className="text-xs text-secondary-400 font-normal">/ yr</span></span>
                </div>
                <button className="btn-primary !h-12 w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
                  Activate Autonomous Enterprise Pilot <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Interactive ROI Simulation Calculator */}
          <div className="bg-white dark:bg-[#141414] p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB] dark:border-[#262626]">
              <div>
                <h3 className="text-xl font-black text-secondary-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary-500" /> Enterprise ROI & Margin Recovery Simulator
                </h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                  Tune operational variables to evaluate the outcome-based fee versus protected assembly margin.
                </p>
              </div>

              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">Projected ROI Multiplier</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{roiMultiple}x Return</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  <span>Manufacturing Plants</span>
                  <span className="font-mono text-primary-600 dark:text-primary-400 font-extrabold">{plants} Plants</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={plants} 
                  onChange={(e) => setPlants(Number(e.target.value))}
                  className="w-full accent-primary-500 cursor-pointer"
                />
                <span className="text-[11px] text-secondary-400 block">$65k/plant flat annual license</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  <span>Annual Spend Managed</span>
                  <span className="font-mono text-primary-600 dark:text-primary-400 font-extrabold">${spendMillions}M USD</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="500" 
                  step="5"
                  value={spendMillions} 
                  onChange={(e) => setSpendMillions(Number(e.target.value))}
                  className="w-full accent-primary-500 cursor-pointer"
                />
                <span className="text-[11px] text-secondary-400 block">$2,500 per $1M spend managed</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  <span>Gross Margin at Risk</span>
                  <span className="font-mono text-primary-600 dark:text-primary-400 font-extrabold">${exposureMillions}M USD</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="200" 
                  step="2"
                  value={exposureMillions} 
                  onChange={(e) => setExposureMillions(Number(e.target.value))}
                  className="w-full accent-primary-500 cursor-pointer"
                />
                <span className="text-[11px] text-secondary-400 block">Protected at 92% recovery rate</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#F9FAFB] dark:bg-[#18191D] border border-[#E5E7EB] dark:border-[#262626] grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Gross Recovered</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">${(grossRecoveredRevenue / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Total SentinelChain Fee</span>
                <p className="text-xl font-extrabold text-secondary-900 dark:text-white mt-1">${(autonomousTierTotal / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Net Profit Preserved</span>
                <p className="text-xl font-extrabold text-primary-600 dark:text-primary-400 mt-1">${(netSavings / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">ROI Return Multiplier</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{roiMultiple}x</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
