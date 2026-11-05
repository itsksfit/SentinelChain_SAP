import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { 
  Check, ArrowRight, ShieldCheck, Zap, Calculator, 
  DollarSign, TrendingUp, AlertTriangle, Layers, Cpu, 
  Activity, ShieldAlert, CheckCircle2, Lock, Radio, Database, FileText, Sparkles
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>Commercial Model & Enterprise Pricing | SentinelChain</title>
        <meta name="description" content="Outcome and exposure-based enterprise pricing for SentinelChain supply chain risk management." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-8 pb-24 min-w-0">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40">
                  Value-Aligned Commercial Model
                </span>
                <span className="text-xs font-mono font-bold text-secondary-400">Enterprise Edition</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" /> Outcome & Exposure-Based Pricing
              </h1>
              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-3xl leading-relaxed">
                Priced strictly against physical plant footprint, material spend under management, and protected gross margin — eliminating seat-license penalties for operations teams.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/risk"
                className="px-3.5 py-2 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300 shadow-2xs"
              >
                <Activity className="w-3.5 h-3.5 text-amber-500" /> View Risk Matrix
              </Link>
              <Link
                href="/disruptions"
                className="btn-primary !h-9 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Active Threats
              </Link>
            </div>
          </div>

          {/* Pricing Sequencing Strategy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] shadow-2xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Step 1: Ingest & Correlate</span>
                <h3 className="text-sm font-bold text-secondary-900 dark:text-white mt-0.5">1. Monitor</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 leading-relaxed">
                  Flat annual license per plant/BOM connected. Telemetry ingestion, deterministic ERP BOM correlation, and $/day revenue-at-risk.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] shadow-2xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-secondary-100 dark:bg-secondary-800 border border-[#E8E8E8] dark:border-[#262626] flex items-center justify-center text-secondary-700 dark:text-secondary-300 shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300">Step 2: Source & Qualify</span>
                <h3 className="text-sm font-bold text-secondary-900 dark:text-white mt-0.5">2. Respond</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 leading-relaxed">
                  Priced per $M of spend under management. Live franchised distributor catalog matching (Mouser/Arrow), pinout spec compare & RFQ drafter.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] shadow-2xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Step 3: Execute & Settle</span>
                <h3 className="text-sm font-bold text-secondary-900 dark:text-white mt-0.5">3. Autonomous</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 leading-relaxed">
                  Direct SAP S/4HANA & Ariba PR auto-execution. Priced on a success-aligned basis point fee (15 bps) on measured revenue saved.
                </p>
              </div>
            </div>
          </div>

          {/* TWO MAIN SUBSCRIPTION PACKAGES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* TIER 1 & 2: STANDARD ENTERPRISE (Monitor + Respond) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border border-[#E8E8E8] dark:border-[#262626]">
                      Baseline Operational License
                    </span>
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mt-3">Core Enterprise Subscription</h2>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      Includes <strong className="text-secondary-900 dark:text-white">Tier 1: Monitor</strong> + <strong className="text-secondary-900 dark:text-white">Tier 2: Respond</strong>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-800 border border-[#E8E8E8] dark:border-[#262626] flex items-center justify-center text-secondary-700 dark:text-secondary-300 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-secondary-500 uppercase">Fixed Component (Monitor):</span>
                    <span className="font-mono font-bold text-secondary-900 dark:text-white text-sm">$65,000 <span className="text-xs text-secondary-400 font-normal">/ plant / yr</span></span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[#E8E8E8] dark:border-[#222222]">
                    <span className="text-xs font-bold text-secondary-500 uppercase">Variable Component (Respond):</span>
                    <span className="font-mono font-bold text-secondary-900 dark:text-white text-sm">$2,500 <span className="text-xs text-secondary-400 font-normal">/ $1M spend / yr</span></span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary-400">Included Core Capabilities:</h4>
                  <ul className="space-y-2.5 text-xs text-secondary-700 dark:text-secondary-300">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Multi-Source Telemetry Feed:</strong> SEC 10-K/8-K, Federal Register (BIS), USGS seismic sensors, and institutional media streams.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Deterministic BOM Correlation:</strong> Maps external geographic & supplier anomalies directly to internal S/4HANA material IDs.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Financial Exposure Engine:</strong> Real-time $/day revenue-at-risk aggregation per assembly line and manufacturing plant.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Live Franchised Spot Sourcing:</strong> Direct API discovery with Mouser, DigiKey, Arrow, and Avnet live warehouse inventory.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Pinout & Spec Cross-Matching:</strong> Side-by-side technical qualification matrix with tolerance and package verification.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Human-in-the-Loop RFQ Drafter:</strong> LLM-synthesized procurement packages ready for single-click supplier dispatch.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E8E8] dark:border-[#222222] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-400">Target Enterprise Cycle</span>
                  <p className="text-xs font-bold text-secondary-800 dark:text-secondary-200">Months 0 – 6 (Rapid Land & Sourcing Assist)</p>
                </div>
                <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300">
                  Human Authorized
                </span>
              </div>
            </div>

            {/* TIER 3: AUTONOMOUS ENTERPRISE (Monitor + Respond + Autonomous Execution) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111111] border-2 border-primary-500/80 shadow-card dark:shadow-dark-card flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3.5 py-1 bg-primary-500 text-white text-[9.5px] font-bold uppercase tracking-wider rounded-bl-xl shadow-2xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Highest ROI Tier
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      Full Autonomous Orchestration
                    </span>
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mt-3">Autonomous Enterprise Subscription</h2>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      Includes <strong className="text-secondary-900 dark:text-white">Core Enterprise (Monitor + Respond)</strong> + <strong className="text-primary-500">Tier 3: Autonomous Execution</strong>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400 uppercase">Core Base Platform Fee:</span>
                    <span className="font-mono font-bold text-secondary-900 dark:text-white text-sm">Monitor + Respond Rates</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[#E8E8E8] dark:border-[#222222]">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Autonomous Success Fee:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">15 bps (0.15%) <span className="text-xs font-normal text-secondary-400">on recovered margin</span></span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Autonomous Value Multipliers:</h4>
                  <ul className="space-y-2.5 text-xs text-secondary-700 dark:text-secondary-300">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Automated SAP S/4HANA & Ariba PR Generation:</strong> Lights-out PO dispatch directly through ERP OData services within enterprise guardrails.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Event Mesh Real-Time Triggering:</strong> Sub-second response from telemetry anomaly detection to spot warehouse allocation.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Immutable Recovery Ledger:</strong> Cryptographic decision audit trail with verified revenue recovery metrics for executive compliance.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Enterprise Guardrails & Policy Thresholds:</strong> Custom budget caps, multi-signature delegation gates, and certified franchised vendor filtering.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span><strong>Dedicated 24/7 SLA & Custom ERP Mesh Adapters:</strong> Custom integration for Oracle NetSuite, SAP ECC 6.0, and proprietary ERP schemas.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E8E8] dark:border-[#222222] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-400">Enterprise Expansion Journey</span>
                  <p className="text-xs font-bold text-primary-600 dark:text-primary-400">Month 6–12+ (Full Confidence Autonomy)</p>
                </div>
                <span className="btn-primary !h-8 px-3 text-xs font-bold rounded-lg shadow-2xs">
                  Autonomous Execution
                </span>
              </div>
            </div>

          </div>

          {/* INTERACTIVE ENTERPRISE PRICING & ROI SIMULATOR */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-5">
              <div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary-500" /> Interactive Enterprise ROI & Cost Simulator
                </h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                  Adjust your operational parameters to model annual subscription investment, recovered revenue, and net financial ROI.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-800/40">
                <Sparkles className="w-3.5 h-3.5" /> Outcome Formula: Exposure × Recovery Rate - Fees
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* SLIDERS COLUMN */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Plants Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-secondary-700 dark:text-secondary-300">Active Manufacturing / Assembly Plants</span>
                    <span className="font-mono text-primary-600 dark:text-primary-400 font-bold">{plants} Plants ({plants * 2} Active BOM Instances)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={plants} 
                    onChange={(e) => setPlants(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 dark:bg-secondary-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-[10px] text-secondary-400 mt-1">
                    <span>1 Regional Facility</span>
                    <span>10 Distributed Hubs</span>
                    <span>20 Global Giga-Facilities</span>
                  </div>
                </div>

                {/* Material Spend Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-secondary-700 dark:text-secondary-300">Annual Semiconductor Spend Under Management (SUM)</span>
                    <span className="font-mono text-primary-600 dark:text-primary-400 font-bold">${spendMillions}M USD / Year</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    step="5"
                    value={spendMillions} 
                    onChange={(e) => setSpendMillions(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 dark:bg-secondary-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-[10px] text-secondary-400 mt-1">
                    <span>$5M Mid-Market</span>
                    <span>$100M Enterprise</span>
                    <span>$200M Global Tier-1</span>
                  </div>
                </div>

                {/* Annual Disruption Exposure */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-secondary-700 dark:text-secondary-300">Historical Annual Disruption Exposure (Revenue at Risk)</span>
                    <span className="font-mono text-red-600 dark:text-red-400 font-bold">${exposureMillions}M USD / Year</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="100" 
                    step="2"
                    value={exposureMillions} 
                    onChange={(e) => setExposureMillions(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 dark:bg-secondary-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-[10px] text-secondary-400 mt-1">
                    <span>$2M (Low Volatility)</span>
                    <span>$50M (Standard Shortages)</span>
                    <span>$100M (Severe Geopolitical Friction)</span>
                  </div>
                </div>

                {/* Recovery SLA Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-secondary-700 dark:text-secondary-300">Autonomous Mitigation & Recovery Rate</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{recoveryRate}% Yield</span>
                  </div>
                  <input 
                    type="range" 
                    min="70" 
                    max="98" 
                    value={recoveryRate} 
                    onChange={(e) => setRecoveryRate(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 dark:bg-secondary-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-secondary-400 mt-1">
                    <span>70% Minimum SLA</span>
                    <span>92% Empirical Average</span>
                    <span>98% High Redundancy</span>
                  </div>
                </div>

              </div>

              {/* CALCULATION RESULTS PANEL */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 border-b border-[#E8E8E8] dark:border-[#222222] pb-3">
                  Estimated Financial Ledger & ROI
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-secondary-600 dark:text-secondary-400">
                    <span>1. Monitor Tier Base ({plants} Plants):</span>
                    <span className="font-bold text-secondary-900 dark:text-white">${monitorAnnualFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-secondary-600 dark:text-secondary-400">
                    <span>2. Respond Tier (${spendMillions}M SUM):</span>
                    <span className="font-bold text-secondary-900 dark:text-white">${respondAnnualFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-secondary-600 dark:text-secondary-400">
                    <span>3. Autonomous Success Fee (15 bps):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${autonomousSuccessFee.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-[#E8E8E8] dark:border-[#222222] flex justify-between items-center text-sm">
                    <span className="font-bold text-secondary-900 dark:text-white">Total Annual Platform Investment:</span>
                    <span className="font-extrabold text-primary-600 dark:text-primary-400">${autonomousTierTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* ROI METRICS CALLOUT */}
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Gross Revenue Protected:</span>
                    <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">${(grossRecoveredRevenue / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Net Financial Value Saved:</span>
                    <span className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-300">${(netSavings / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/40 flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-900 dark:text-white uppercase">Projected Net ROI:</span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{roiMultiple}x</span>
                  </div>
                </div>

                <div className="text-[11px] text-secondary-500 text-center font-medium">
                  ⚡ Payback Period: <strong>&lt; 9 Days</strong> upon first prevented production line halt.
                </div>
              </div>

            </div>
          </div>

          {/* DETAILED FEATURE COMPARISON MATRIX */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] shadow-2xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white">Feature & SLA Comparison Matrix</h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Granular breakdown across signal intelligence, risk modeling, and ERP orchestration.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E8] dark:border-[#222222] text-[11px] font-bold text-secondary-400 uppercase tracking-wider bg-[#F8F9FA] dark:bg-[#161616]">
                    <th className="py-3 px-4">Capability & Module</th>
                    <th className="py-3 px-4">Core Enterprise (Monitor + Respond)</th>
                    <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400">Autonomous Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] dark:divide-[#222222]">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">Multi-Source Telemetry (SEC, BIS, USGS, Wires)</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Full Ingestion</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Full Ingestion + Custom Feeds</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">Deterministic S/4HANA BOM Correlation</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Included</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Multi-Plant ERP BOM Correlation</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">Live Franchised Market Sourcing (Mouser, DigiKey)</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Direct Sourcing Catalog</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Priority Spot Allocation APIs</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">Pin-Compatible Technical Spec Matrix</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Interactive Comparison Modal</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Automated EE Form-Fit-Function Proof</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">SAP Ariba Purchase Requisition (PR/PO) Automation</td>
                    <td className="py-3.5 px-4 text-secondary-400">Manual RFQ Dispatch Drafts</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Autonomous Direct Execution</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">ERP Event Mesh Real-Time Webhooks</td>
                    <td className="py-3.5 px-4 text-secondary-400">Standard Polling (30s)</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Sub-Second Event Mesh Push</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">Cryptographic Recovery Ledger Audit Trail</td>
                    <td className="py-3.5 px-4 text-secondary-400">Standard History Logs</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 inline mr-1" /> Immutable Audit Dossiers & PR Exports</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white">Commercial Fee Metric</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-secondary-800 dark:text-secondary-200">Flat Plant Fee + Spend Managed</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">Core + 15 bps (0.15%) Value Share</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
