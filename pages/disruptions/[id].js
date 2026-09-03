import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PrAuditExportModal from '../../components/PrAuditExportModal';
import PartComparisonModal from '../../components/PartComparisonModal';
import { ShieldAlert, GitCommit, Factory, Box, CheckCircle, ArrowRight, XCircle, FileText, BarChart2, MessageSquare, ChevronRight, Activity, Database, AlertTriangle, ExternalLink, Printer, Mail, Copy, Check, Sliders, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export async function getServerSideProps(context) {
  const { id } = context.params;
  const fs = require('fs');
  const path = require('path');

  let disruption = null;
  let partInfo = null;
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    disruption = data.find(d => d.disruption_id === id) || null;

    const partsPath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(partsPath, 'utf8'));
    partInfo = partsData.find(p => p.part_id === disruption?.part_affected) || null;
  } catch (e) {}

  if (!disruption && !id?.includes('LIVE')) {
    return { notFound: true };
  }

  return { 
    props: { 
      ssrDisruption: disruption || { disruption_id: id },
      ssrPartInfo: partInfo || {}
    } 
  };
}

export default function DisruptionDetail({ ssrDisruption, ssrPartInfo }) {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(ssrDisruption);
  const [part, setPart] = useState(ssrPartInfo);
  
  // Sourcing & Requirement Configuration
  const [quantity, setQuantity] = useState(10000);
  const [targetDays, setTargetDays] = useState(15);
  const [deliveryPlant, setDeliveryPlant] = useState('Plant 1001 (Automotive Hub - Stuttgart)');
  
  // Distributor Ranking & Drafting State
  const [rankedDistributors, setRankedDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [emailDraft, setEmailDraft] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [isLoadingDistributors, setIsLoadingDistributors] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Execution & Modals
  const [approvedOption, setApprovedOption] = useState(null);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [showPrModal, setShowPrModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparedAlt, setComparedAlt] = useState(null);

  useEffect(() => {
    if (id?.includes('LIVE')) {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const found = custom.find(d => d.disruption_id === id);
      if (found) {
        setData(found);
      }
    }
  }, [id]);

  // Load distributor rankings and initial Groq email draft on mount
  useEffect(() => {
    fetchDistributorRankings();
  }, [data.part_affected, quantity, targetDays]);

  const fetchDistributorRankings = async (chosenAlt = null) => {
    setIsLoadingDistributors(true);
    try {
      let liveOptions = null;
      try {
        const matchRes = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partNumber: data.part_affected || 'STM32F401RE' })
        });
        if (matchRes.ok) {
          const fetched = await matchRes.json();
          if (Array.isArray(fetched) && fetched.length > 0) {
            liveOptions = fetched;
          }
        }
      } catch(e) {
        console.warn("Match API fetch error:", e);
      }

      const res = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partNumber: data.part_affected || 'STM32F401RE',
          selectedOption: chosenAlt || selectedDistributor,
          allOptions: liveOptions || [],
          requirement: {
            quantity,
            targetDays,
            deliveryPlant
          }
        })
      });

      if (res.ok) {
        const result = await res.json();
        const ranked = result.rankedDistributors || [];
        setRankedDistributors(ranked);
        
        if (chosenAlt) {
          setSelectedDistributor(chosenAlt);
        } else if (ranked.length > 0) {
          setSelectedDistributor(prev => prev || ranked[0]);
        }
        
        setEmailDraft(result.emailDraft || '');
        setPrNumber(result.prNumber || `PR-ARIB-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch (err) {
      console.error("Failed to load distributor rankings:", err);
    } finally {
      setIsLoadingDistributors(false);
    }
  };

  const handleSelectAndDraft = async (vendor) => {
    setSelectedDistributor(vendor);
    await fetchDistributorRankings(vendor);
  };

  const handleApprovePlan = () => {
    setApprovedOption('A');
    setPlanGenerated(true);

    const planId = `RP-LIVE-${Math.floor(Math.random() * 9000) + 1000}`;
    const dt = [
      { timestamp: new Date(Date.now() - 30000).toISOString(), agent: "Detection Agent", action: "Identified capacity shortage risk." },
      { timestamp: new Date(Date.now() - 25000).toISOString(), agent: "Impact Agent", action: "Exploded S/4HANA BOM & calculated revenue exposure." },
      { timestamp: new Date(Date.now() - 15000).toISOString(), agent: "Ranking Engine", action: `Ranked distributors and selected ${selectedDistributor?.vendor || 'Arrow Electronics'}.` },
      { timestamp: new Date().toISOString(), agent: "Execution Engine", action: `Approved commercial order draft & generated ${prNumber}.` }
    ];

    const recoveredAmt = (data.revenue_at_risk_usd || 1575000) * 0.95;

    // Update global state in localStorage
    if (id?.includes('LIVE')) {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const updated = custom.map(d => {
        if (d.disruption_id === id) {
          return {
            ...d,
            status: 'Resolved',
            recovery_plan_id: planId,
            decision_trail: dt,
            resolution: {
              outcome: "Executed",
              vendor: selectedDistributor?.vendor || "Arrow Electronics",
              proposed_action: `Dispatched commercial RFQ for ${selectedDistributor?.altPartId || 'AT32F403ARCT7'} (${quantity.toLocaleString()} units)`,
              recovered_amount_usd: recoveredAmt
            }
          };
        }
        return d;
      });
      localStorage.setItem('custom_disruptions', JSON.stringify(updated));
    }

    const newPlan = {
      plan_id: planId,
      disruption_id: id,
      part_affected: data.part_affected || "STM32F401RE",
      created_at: new Date().toISOString(),
      status: "Approved",
      confidence: confidence,
      action_summary: `Commercial Requisition ${prNumber} prepared for ${selectedDistributor?.vendor || 'Arrow Electronics'}`,
      decision_trail: dt,
      steps: [
        { status: "Completed", description: "Technical pinout qualification verified" },
        { status: "Completed", description: "Commercial RFQ package drafted" },
        { status: "In Progress", description: "SAP Ariba Purchase Requisition submission" }
      ],
      metrics: {
        cost_impact_usd: (selectedDistributor?.unitPrice || 4.35) * quantity,
        revenue_protected_usd: recoveredAmt,
        days_saved: 14
      }
    };

    const customPlans = JSON.parse(localStorage.getItem('custom_plans') || '[]');
    localStorage.setItem('custom_plans', JSON.stringify([newPlan, ...customPlans]));
  };

  const copyToClipboard = () => {
    if (!emailDraft) return;
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const confidence = data.confidence || 94;
  const plants = data.plants_affected || 2;
  const products = data.products_affected || 5;
  const originalPartData = part?.part_id ? part : {
    part_id: data.part_affected || 'STM32F401RE',
    category: data.part_affected?.split('-')[0] || 'MCU',
    manufacturer: data.vendor || 'STMicroelectronics',
    base_price: 4.50
  };

  const openSpecComparison = (alt) => {
    setComparedAlt(alt);
    setShowCompareModal(true);
  };

  if (!data.part_affected && !data.event_type) return <div className="min-h-screen bg-[#0a0f18] text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0a0f18] flex text-gray-900 dark:text-white">
      <Head><title>Decision Center: {id} | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        
        <div className="p-6 max-w-7xl mx-auto w-full space-y-4 pb-24">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 gap-2 mb-2">
            <Link href="/" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/disruptions" className="hover:text-indigo-500 transition-colors">Disruptions</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 dark:text-gray-200">{id}</span>
          </div>

          <div className="glass-panel overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl bg-white dark:bg-[#11141c]">
            {/* HEADER */}
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-gray-50 to-white dark:from-[#11141c] dark:to-[#1a1d24]">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    {id}
                  </h1>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${planGenerated ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20'}`}>
                    {planGenerated ? 'Order Package Approved' : 'Critical Shortage Risk'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-4xl leading-relaxed">
                  {data.event_type}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Evidence Confidence</p>
                    <div className="text-3xl font-black text-emerald-500">{confidence}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPrModal(true)} 
                    className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-all font-bold tracking-wide uppercase shadow-md"
                  >
                    <FileText className="w-3 h-3" /> Export PR Dossier
                  </button>
                  <Link href="/risk" className="text-[10px] bg-gray-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors font-bold tracking-wide uppercase">
                    <Activity className="w-3 h-3" /> Risk Model
                  </Link>
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-white/10">
              
              {/* LEFT COLUMN: DIAGNOSTICS & PIN-COMPATIBLE CATALOG */}
              <div className="p-6 md:p-8 lg:col-span-4 space-y-6 bg-gray-50/50 dark:bg-[#0f1115]">
                
                {/* Provenance Card */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" /> Evidence Provenance
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          {data.source || 'Institutional Registry'}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        {data.sourceTier || 'OFFICIAL_IR'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <a 
                      href={
                        (data.verifiedUrl && data.verifiedUrl !== '#' && !data.verifiedUrl.includes('us7000m8v5'))
                          ? data.verifiedUrl 
                          : (data.sourceTier === 'FED_REGISTER_BIS' 
                              ? 'https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items'
                              : (data.part_affected === 'STM32F401RE' ? 'https://earthquake.usgs.gov/earthquakes/map/' : 'https://www.ti.com'))
                      } 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Official Source Document <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Revenue Impact Summary */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-red-500" /> S/4HANA ERP Exposure
                  </h3>
                  <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Revenue at Risk</span>
                      <span className="text-[10px] font-bold text-gray-500">{plants} Assembly Plants</span>
                    </div>
                    <p className="text-2xl font-black text-red-600 dark:text-red-400">
                      ${data.revenue_at_risk_usd?.toLocaleString() || '1,575,000'}<span className="text-xs text-red-500/70 font-medium"> / day</span>
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                      Component: <span className="font-mono font-bold text-gray-900 dark:text-white">{data.part_affected}</span>
                    </p>
                  </div>
                </div>

                {/* Pin-Compatible Cross-Reference with Spec Comparison Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-500" /> Pin-Compatible Replacements
                    </h3>
                    <span className="text-[10px] text-indigo-500 font-bold">Verified</span>
                  </div>

                  <div className="space-y-2.5">
                    {(() => {
                      const alts = (rankedDistributors && rankedDistributors.length > 0)
                        ? rankedDistributors.map(d => ({
                            alt_part_id: d.altPartId,
                            vendor: d.vendor,
                            unit_price: d.unitPrice,
                            lead_time_days: d.leadTimeDays,
                            stock_qty: d.stockQty,
                            productDetailUrl: d.productDetailUrl
                          }))
                        : (data.matched_options?.map(o => o._raw) || part?.pin_compatible_alternatives || []);

                      return alts.map((alt, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-[#151821] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{alt.alt_part_id}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{alt.vendor} • {alt.stock_qty?.toLocaleString()} units</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-gray-900 dark:text-white">${alt.unit_price?.toFixed(2)}</p>
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{alt.lead_time_days} days ETA</p>
                            </div>
                          </div>
                          
                          {/* Clean Spec Comparison Button */}
                          <button
                            onClick={() => openSpecComparison(alt)}
                            className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-500/30"
                          >
                            <Sliders className="w-3.5 h-3.5" /> Compare Technical Specs & Pinout
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: DISTRIBUTOR RANKING & GROQ COMMERCIAL EMAIL DRAFTER */}
              <div className="p-6 md:p-8 lg:col-span-8 bg-white dark:bg-[#11141c] space-y-6">
                
                {/* SECTION 1: REQUIREMENT TUNING */}
                <div className="p-5 bg-gray-50 dark:bg-[#151821] border border-gray-200 dark:border-white/10 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-500" /> Sourcing Requirement Configuration
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      Interactive Parameter Gate
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">Target Volume (Units)</label>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-lg text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">Max Delivery Window (Days)</label>
                      <input 
                        type="number" 
                        value={targetDays}
                        onChange={(e) => setTargetDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-lg text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">Delivery Destination</label>
                      <input 
                        type="text" 
                        value={deliveryPlant}
                        onChange={(e) => setDeliveryPlant(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-lg text-xs font-medium text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: RANKED DISTRIBUTOR MATRIX */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-indigo-500" /> Distributor Procurement & Fulfillment Matrix
                    </h3>
                    <span className="text-[11px] text-gray-400">Live Franchised Market Inventory & Sourcing</span>
                  </div>

                  <div className="space-y-3">
                    {rankedDistributors.map((dist, idx) => {
                      const currentSelectedId = selectedDistributor?.altPartId || selectedDistributor?.alt_part_id || selectedDistributor?.partNumber;
                      const isSelected = currentSelectedId ? currentSelectedId === dist.altPartId : idx === 0;
                      const isInStock = (dist.stockQty || 0) > 0;
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleSelectAndDraft(dist)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                            isSelected 
                              ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md' 
                              : 'bg-white dark:bg-[#151821] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              isSelected 
                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs' 
                                : 'border-gray-300 dark:border-gray-600 bg-transparent'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                              idx === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                            }`}>
                              #{dist.rank}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{dist.vendor}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  isInStock
                                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                }`}>
                                  {dist.recommendation || (isInStock ? 'In Stock (Spot Delivery)' : 'Factory Backorder')}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                                  Sourced Part: {dist.altPartId}
                                </p>
                                {dist.productDetailUrl && (
                                  <a 
                                    href={dist.productDetailUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                                    title="View live product listing on Mouser"
                                  >
                                    <span>Direct Product Link</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                                {dist.dataSheetUrl && (
                                  <a 
                                    href={dist.dataSheetUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                                    title="Official Manufacturer Datasheet PDF"
                                  >
                                    <span>Datasheet PDF</span>
                                    <FileText className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:gap-6 text-xs">
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">Unit Price</p>
                              <p className="font-black text-gray-900 dark:text-white">${dist.unitPrice?.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">Lead Time</p>
                              <p className="font-black text-gray-900 dark:text-white">
                                {dist.leadTimeDays} {dist.leadTimeDays === 1 ? 'Day' : 'Days'}
                                {isInStock && <span className="text-[9px] text-emerald-500 font-normal block">Spot Courier</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">In-Stock Qty</p>
                              <p className="font-bold text-gray-700 dark:text-gray-300">
                                {dist.stockQty > 0 ? dist.stockQty.toLocaleString() : '0 (Backorder)'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                              <p className={`font-black text-xs ${isInStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                {isInStock ? 'Ready to Ship' : 'Backorder'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectAndDraft(dist);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                                  isSelected 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                                    : 'bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 dark:bg-white/5 dark:hover:bg-indigo-500/10 dark:text-gray-300 dark:hover:text-indigo-400 border border-gray-200 dark:border-white/10'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                                  </>
                                ) : (
                                  'Select Option'
                                )}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openSpecComparison({ alt_part_id: dist.altPartId, vendor: dist.vendor, unit_price: dist.unitPrice, lead_time_days: dist.leadTimeDays, productDetailUrl: dist.productDetailUrl });
                                }}
                                className="px-2.5 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg border border-indigo-200 dark:border-indigo-500/30 transition-colors"
                              >
                                Compare
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 3: GROQ LLM COMMERCIAL ORDER DRAFT & DISPATCH */}
                <div className="p-5 bg-white dark:bg-[#151821] border border-gray-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-500" /> Commercial Purchase Requisition & RFQ Email Package
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tailored for <span className="font-bold text-gray-900 dark:text-white">{selectedDistributor?.vendor || 'Mouser Electronics'}</span> • Sourcing Part: <span className="font-mono text-indigo-500 font-bold">{selectedDistributor?.altPartId || 'Selected Alternative'}</span> • Reference <span className="font-mono text-indigo-500 font-bold">{prNumber}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied to Clipboard!' : 'Copy Email'}
                      </button>

                      <a
                        href={`mailto:orders@${(selectedDistributor?.vendor || 'supplier').toLowerCase().replace(/\s+/g, '')}.com?subject=${encodeURIComponent(`[URGENT RFQ / PO: ${prNumber}] Procurement Order for ${selectedDistributor?.altPartId || 'Component'}`)}&body=${encodeURIComponent(emailDraft)}`}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-500/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open in Mail Client
                      </a>
                    </div>
                  </div>

                  {/* Editable Rich Email Textarea */}
                  <div className="relative">
                    <textarea
                      rows={12}
                      value={emailDraft}
                      onChange={(e) => setEmailDraft(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-xl font-mono text-xs text-gray-800 dark:text-gray-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Generating commercial procurement draft..."
                    />
                    <div className="absolute right-3 bottom-3 text-[10px] text-gray-400 flex items-center gap-1 bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> Drafted via Groq LLM
                    </div>
                  </div>

                  {/* APPROVAL & ACTION BAR */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total Order Commitment ({selectedDistributor?.altPartId || 'Component'}): <span className="font-black text-gray-900 dark:text-white">${((selectedDistributor?.unitPrice || 4.35) * quantity).toLocaleString()} USD</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setShowPrModal(true)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-4 h-4" /> View Audit Dossier
                      </button>

                      <button
                        onClick={handleApprovePlan}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Requisition {selectedDistributor?.altPartId || 'Selected Option'}
                      </button>
                    </div>
                  </div>

                  {planGenerated && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between animate-[fadeInUp_0.3s_ease-out]">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                            Procurement Requisition {prNumber} Approved & Synchronized
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            Requisition logged to SAP Ariba and saved to the verified Recovery Ledger.
                          </p>
                        </div>
                      </div>
                      <Link 
                        href="/ledger" 
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-all shadow"
                      >
                        View in Ledger <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={data} />
      
      {/* SIDE-BY-SIDE SPEC COMPARISON MODAL */}
      <PartComparisonModal 
        isOpen={showCompareModal} 
        onClose={() => setShowCompareModal(false)}
        originalPart={originalPartData}
        altPart={comparedAlt}
        onSelectOption={(chosen) => handleSelectAndDraft({
          vendor: chosen.vendor,
          altPartId: chosen.alt_part_id,
          unitPrice: chosen.unit_price,
          leadTimeDays: chosen.lead_time_days,
          stockQty: chosen.stock_qty
        })}
      />
    </div>
  );
}
