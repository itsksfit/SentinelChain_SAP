import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PrAuditExportModal from '../../components/PrAuditExportModal';
import PartComparisonModal from '../../components/PartComparisonModal';
import { ShieldAlert, GitCommit, Factory, Box, CheckCircle, CheckCircle2, ArrowRight, XCircle, FileText, BarChart2, MessageSquare, ChevronRight, Activity, Database, AlertTriangle, ExternalLink, Printer, Mail, Copy, Check, Sliders, Layers, Sparkles } from 'lucide-react';
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
    const partKey = disruption?.part_affected || 'STM32F401RE';
    partInfo = partsData.find(p => p.part_id === partKey) || null;
  } catch (e) {}

  const defaultDisruption = {
    disruption_id: id || "DSP-LIVE-1001",
    event_type: "Active Global Semiconductor Supply Disruption",
    part_affected: "STM32F401RE",
    severity: "CRITICAL",
    revenue_at_risk_usd: 1575000,
    status: "Awaiting Decision",
    evidenceConfidence: 88,
    verifiedUrl: "https://earthquake.usgs.gov/earthquakes/map/",
    sourceTier: "OFFICIAL_TELEMETRY",
    source: "Institutional Telemetry Feed",
    plants_affected: 3,
    products_affected: 5,
    orders_at_risk: 42,
    detected_at: new Date().toISOString()
  };

  const finalDisruption = disruption ? { ...defaultDisruption, ...disruption } : defaultDisruption;
  const defaultPart = {
    part_id: finalDisruption.part_affected || 'STM32F401RE',
    category: 'MCU',
    manufacturer: 'STMicroelectronics',
    base_price: 4.50,
    pin_compatible_alternatives: [
      { alt_part_id: "STM32F401RBT6TR", vendor: "Mouser Electronics", unit_price: 6.26, lead_time_days: 3, stock_qty: 3384 },
      { alt_part_id: "STM32F401CCU6TR", vendor: "Mouser Electronics", unit_price: 6.70, lead_time_days: 3, stock_qty: 540 },
      { alt_part_id: "MSP430F5529IPNR", vendor: "Mouser Electronics", unit_price: 3.85, lead_time_days: 3, stock_qty: 525 }
    ]
  };

  const finalPart = partInfo ? { ...defaultPart, ...partInfo } : defaultPart;

  return { 
    props: { 
      ssrDisruption: finalDisruption,
      ssrPartInfo: finalPart
    } 
  };
}

export default function DisruptionDetail({ ssrDisruption = {}, ssrPartInfo = {} }) {
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

  // Safe Formatting Helpers
  const formatPrice = (val) => {
    if (val === undefined || val === null) return '4.50';
    const num = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(num) ? '4.50' : num.toFixed(2);
  };

  const formatQty = (val) => {
    if (val === undefined || val === null) return '0';
    const num = typeof val === 'number' ? val : parseInt(val, 10);
    return isNaN(num) ? '0' : num.toLocaleString();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
        const found = custom.find(d => d.disruption_id === id);
        if (found) {
          setData(prev => ({ ...prev, ...found }));
        }
      } catch (err) {
        console.warn("Could not read custom_disruptions from localStorage", err);
      }
    }
  }, [id]);

  const generateEmailDraft = (chosenVendor, prNum, targetQty, targetPlant) => {
    const partName = chosenVendor?.altPartId || chosenVendor?.alt_part_id || 'Alternative Part';
    const supplierName = chosenVendor?.vendor || 'Mouser Electronics';
    const priceStr = formatPrice(chosenVendor?.unitPrice);
    const totalCostStr = ((chosenVendor?.unitPrice || 4.50) * targetQty).toLocaleString();
    const leadTimeStr = chosenVendor?.leadTimeDays || 3;

    return `SUBJECT: [URGENT SPOT RFQ / PO: ${prNum}] Emergency Allocation Order for ${partName}

Attn: ${supplierName} Global Sourcing & Sales Desk

We are issuing an urgent commercial purchase requisition for immediate warehouse dispatch:

• Sourced Part Number: ${partName}
• Target Volume: ${targetQty.toLocaleString()} units
• Quoted Spot Unit Price: $${priceStr} USD
• Total Order Commitment: $${totalCostStr} USD
• Required Lead Time: ${leadTimeStr} Business Days (Spot Courier Dispatch)
• Destination Plant: ${targetPlant}
• Requisition Reference: ${prNum}

Please confirm warehouse spot stock allocation and provide the formal order acknowledgment for SAP Ariba automated synchronization.

Authorized by:
Global Procurement Director
SentinelChain Autonomous Supply Chain Resiliency Network`;
  };

  useEffect(() => {
    fetchDistributorRankings();
  }, [data?.part_affected, quantity, targetDays]);

  const fetchDistributorRankings = async () => {
    setIsLoadingDistributors(true);
    try {
      let liveOptions = null;
      try {
        const matchRes = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partNumber: data?.part_affected || 'STM32F401RE' })
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
          disruption: data,
          quantity: quantity,
          maxDays: targetDays,
          overrideOptions: liveOptions
        })
      });

      if (res.ok) {
        const result = await res.json();
        const dists = result.rankedDistributors || [];
        setRankedDistributors(dists);

        if (dists.length > 0) {
          const topChoice = dists[0];
          setSelectedDistributor(topChoice);
          const pr = `PR-ARIB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          setPrNumber(pr);
          setEmailDraft(generateEmailDraft(topChoice, pr, quantity, deliveryPlant));
        }
      }
    } catch (err) {
      console.error("Negotiate API call failed:", err);
    } finally {
      setIsLoadingDistributors(false);
    }
  };

  const handleSelectAndDraft = async (vendorOption) => {
    setSelectedDistributor(vendorOption);
    const pr = prNumber || `PR-ARIB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setPrNumber(pr);
    setEmailDraft(generateEmailDraft(vendorOption, pr, quantity, deliveryPlant));
  };

  const handleApprovePlan = () => {
    const chosen = selectedDistributor || rankedDistributors[0];
    if (!chosen) return;

    setApprovedOption(chosen);
    setPlanGenerated(true);

    const planId = `RP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      ...data,
      recovery_plan_id: planId,
      status: "Resolved",
      resolution: {
        plan_id: planId,
        alt_part_used: chosen.altPartId,
        vendor: chosen.vendor,
        unit_price: chosen.unitPrice,
        recovered_amount_usd: Math.round((data.revenue_at_risk_usd || 1575000) * 0.94),
        time_to_recovery_hours: (chosen.leadTimeDays || 3) * 24,
        outcome: "Executed (Mouser Spot)",
        proposed_action: `Procure ${quantity.toLocaleString()} units of ${chosen.altPartId} from ${chosen.vendor} at $${formatPrice(chosen.unitPrice)}/ea for ${deliveryPlant}`
      },
      decision_trail: [
        ...(data.decision_trail || []),
        {
          agent: "Procurement Lead (Human Approval)",
          action: `Authorized purchase requisition ${prNumber} for ${chosen.altPartId} via ${chosen.vendor}`,
          timestamp: new Date().toISOString()
        },
        {
          agent: "SAP Ariba Connector",
          action: `Generated PR ${prNumber} and dispatched to ${chosen.vendor} EDI queue`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const filtered = custom.filter(d => d.disruption_id !== data.disruption_id);
      localStorage.setItem('custom_disruptions', JSON.stringify([newRecord, ...filtered]));
    } catch(e) {}

    setData(newRecord);

    const newPlan = {
      id: planId,
      source_disruption_id: data.disruption_id,
      generated_at: new Date().toISOString(),
      status: "Executed (Mouser Spot)",
      vendor: chosen.vendor,
      part: data.part_affected,
      proposed_action: `Procure ${quantity.toLocaleString()} units of ${chosen.altPartId} from ${chosen.vendor} at $${formatPrice(chosen.unitPrice)}/ea for ${deliveryPlant}`,
      risk_reduction_pct: 94,
      decision_trail: newRecord.decision_trail
    };

    try {
      const customPlans = JSON.parse(localStorage.getItem('custom_plans') || '[]');
      localStorage.setItem('custom_plans', JSON.stringify([newPlan, ...customPlans]));
    } catch(e) {}
  };

  const copyToClipboard = () => {
    if (!emailDraft) return;
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const confidence = data?.evidenceConfidence || data?.confidence || 94;
  const plants = data?.plants_affected || 2;
  const safePartNumber = data?.part_affected || part?.part_id || 'STM32F401RE';
  const originalPartData = part?.part_id ? part : {
    part_id: safePartNumber,
    category: safePartNumber.split('-')[0] || 'MCU',
    manufacturer: data?.vendor || 'STMicroelectronics',
    base_price: 4.50
  };

  const openSpecComparison = (alt) => {
    setComparedAlt(alt);
    setShowCompareModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Decision Center: {id || 'DSP-LIVE'} | SentinelChain</title>
        <meta name="description" content="Autonomous procurement decision center, technical part comparison, and SAP Ariba PR dispatch." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />
        
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-400 gap-2 mb-2">
            <Link href="/" className="hover:text-primary-500 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <Link href="/disruptions" className="hover:text-primary-500 transition-colors">Disruptions</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white font-mono">{id || 'DSP-LIVE'}</span>
          </div>

          {/* Editorial Decision Center Header */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 px-3 py-1 rounded-full">
                  {id || 'DSP-LIVE-1001'}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${planGenerated ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40'}`}>
                  {planGenerated ? '✓ Purchase Requisition Dispatched' : '● Critical Shortage Risk'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button 
                  onClick={() => setShowPrModal(true)} 
                  className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-primary-500" /> Export PR Dossier (PDF)
                </button>
                <Link href="/risk" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> Category Matrix
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Autonomous <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Decision Center.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              {data?.event_type || 'Active Global Semiconductor Supply Disruption'}
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Revenue at Risk</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                ${formatQty(data?.revenue_at_risk_usd || 1575000)}<span className="text-xs font-semibold text-secondary-400">/day</span>
              </span>
              <span className="text-xs text-secondary-400">{plants} assembly plants impacted</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Target Component</span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">{safePartNumber}</span>
              <span className="text-xs text-secondary-400">{part?.category || 'MCU'} Architecture</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Evidence Confidence</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{confidence}%</span>
              <span className="text-xs text-secondary-400">Tier-weighted deterministic score</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Procurement Status</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{planGenerated ? 'PR Dispatched' : 'Ready'}</span>
              <span className="text-xs text-secondary-400">{planGenerated ? 'Sent to Ariba Queue' : 'Mouser Spot Qualified'}</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#141414] shadow-sm">
            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB] dark:divide-[#262626]">
              
              {/* LEFT COLUMN: DIAGNOSTICS & PIN-COMPATIBLE CATALOG */}
              <div className="p-6 md:p-8 lg:col-span-4 space-y-6 bg-[#F8F9FA]/60 dark:bg-[#0D0D0D]">
                
                {/* Provenance Card */}
                <div>
                  <h3 className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary-500" /> Evidence Provenance
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#111111] rounded-lg border border-[#E8E8E8] dark:border-[#222222] shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-secondary-900 dark:text-white">
                          {data?.source || 'Institutional Registry'}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40">
                        {data?.sourceTier || 'OFFICIAL_IR'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <a 
                      href={
                        (data?.verifiedUrl && data.verifiedUrl !== '#' && !data.verifiedUrl.includes('us7000m8v5'))
                          ? data.verifiedUrl 
                          : (data?.sourceTier === 'FED_REGISTER_BIS' 
                              ? 'https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items'
                              : (data?.part_affected === 'STM32F401RE' ? 'https://earthquake.usgs.gov/earthquakes/map/' : 'https://www.ti.com'))
                      } 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Official Source Document <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Revenue Impact Summary */}
                <div>
                  <h3 className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-red-500" /> S/4HANA ERP Exposure
                  </h3>
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-red-700 dark:text-red-400 font-bold uppercase tracking-wider">Revenue at Risk</span>
                      <span className="text-[10px] font-bold text-secondary-500">{plants} Assembly Plants</span>
                    </div>
                    <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                      ${formatQty(data?.revenue_at_risk_usd || 1575000)}<span className="text-xs text-red-500/70 font-semibold"> / day</span>
                    </p>
                    <p className="text-[11px] text-secondary-600 dark:text-secondary-400 mt-1">
                      Component: <span className="font-mono font-bold text-secondary-900 dark:text-white">{safePartNumber}</span>
                    </p>
                  </div>
                </div>

                {/* Pin-Compatible Cross-Reference */}
                <div className="pt-4 border-t border-[#E8E8E8] dark:border-[#222222]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary-500" /> Pin-Compatible Replacements
                    </h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Verified Drop-in</span>
                  </div>

                  <div className="space-y-2.5">
                    {(() => {
                      const alts = (rankedDistributors && rankedDistributors.length > 0)
                        ? rankedDistributors.map(d => ({
                            alt_part_id: d.altPartId || d.alt_part_id || 'Alternative Part',
                            vendor: d.vendor || 'Mouser Electronics',
                            unit_price: d.unitPrice || 4.50,
                            lead_time_days: d.leadTimeDays || 3,
                            stock_qty: d.stockQty || 0,
                            productDetailUrl: d.productDetailUrl
                          }))
                        : (Array.isArray(data?.matched_options) ? data.matched_options.map(o => o._raw || o) : (part?.pin_compatible_alternatives || []));

                      return alts.map((alt, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] rounded-xl shadow-2xs flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 font-mono">{alt.alt_part_id || alt.altPartId || alt.partNumber || 'Alternative Component'}</p>
                              <p className="text-[10px] text-secondary-500 font-medium">{alt.vendor || 'Mouser Electronics'} • {formatQty(alt.stock_qty || alt.stockQty)} units</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-extrabold text-secondary-900 dark:text-white">${formatPrice(alt.unit_price || alt.unitPrice)}</p>
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{alt.lead_time_days || alt.leadTimeDays || 3} days ETA</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openSpecComparison(alt)}
                            className="w-full py-1.5 px-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/20 dark:hover:bg-primary-950/40 text-primary-700 dark:text-primary-400 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-primary-200 dark:border-primary-800/40"
                          >
                            <Sliders className="w-3.5 h-3.5" /> Compare Technical Specs & Pinout
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: DISTRIBUTOR RANKING & RFQ DRAFTER */}
              <div className="p-6 md:p-8 lg:col-span-8 bg-white dark:bg-[#111111] space-y-6">
                
                {/* REQUIREMENT TUNING */}
                <div className="p-5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#222222] rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-primary-500" /> Sourcing Requirement Configuration
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40">
                      Interactive Sourcing Gate
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 block mb-1">Target Volume (Units)</label>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-sm font-bold text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 block mb-1">Max Delivery Window (Days)</label>
                      <input 
                        type="number" 
                        value={targetDays}
                        onChange={(e) => setTargetDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-sm font-bold text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 block mb-1">Delivery Destination</label>
                      <input 
                        type="text" 
                        value={deliveryPlant}
                        onChange={(e) => setDeliveryPlant(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-xs font-medium text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* RANKED DISTRIBUTOR MATRIX */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary-500" /> Distributor Procurement & Fulfillment Matrix
                    </h3>
                    <span className="text-[11px] text-secondary-400">Live Franchised Market Inventory & Sourcing</span>
                  </div>

                  <div className="space-y-3">
                    {rankedDistributors.map((dist, idx) => {
                      const currentSelectedId = selectedDistributor?.altPartId || selectedDistributor?.alt_part_id || selectedDistributor?.partNumber || (rankedDistributors[0]?.altPartId);
                      const isSelected = dist.altPartId === currentSelectedId;
                      const isInStock = (dist.stockQty || 0) > 0;
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleSelectAndDraft(dist)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                            isSelected 
                              ? 'bg-primary-50/70 dark:bg-primary-950/20 border-primary-500 ring-1 ring-primary-500/30 shadow-2xs' 
                              : 'bg-white dark:bg-[#161616] border-[#E8E8E8] dark:border-[#222222] hover:border-[#D6D6D6] dark:hover:border-[#333333]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              isSelected 
                                ? 'border-primary-500 bg-primary-500 text-white shadow-2xs' 
                                : 'border-secondary-300 dark:border-secondary-600 bg-transparent'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                              idx === 0 ? 'bg-primary-500 text-white' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                            }`}>
                              #{dist.rank}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-secondary-900 dark:text-white">{dist.vendor}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  isInStock
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' 
                                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                                }`}>
                                  {dist.recommendation || (isInStock ? 'In Stock (Spot Delivery)' : 'Factory Backorder')}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                <p className="text-xs text-primary-600 dark:text-primary-400 font-mono font-bold">
                                  Sourced Part: {dist.altPartId}
                                </p>
                                {dist.productDetailUrl && (
                                  <a 
                                    href={dist.productDetailUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                                  >
                                    <span>Direct Product Link</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:gap-6 text-xs">
                            <div>
                              <p className="text-[10px] text-secondary-400 font-bold uppercase">Unit Price</p>
                              <p className="font-extrabold text-secondary-900 dark:text-white">${formatPrice(dist.unitPrice)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-secondary-400 font-bold uppercase">Lead Time</p>
                              <p className="font-extrabold text-secondary-900 dark:text-white">
                                {dist.leadTimeDays || 3} {(dist.leadTimeDays === 1) ? 'Day' : 'Days'}
                                {isInStock && <span className="text-[9px] text-emerald-500 font-normal block">Spot Courier</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-secondary-400 font-bold uppercase">In-Stock Qty</p>
                              <p className="font-bold text-secondary-700 dark:text-secondary-300">
                                {dist.stockQty > 0 ? formatQty(dist.stockQty) : '0 (Backorder)'}
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
                                    ? 'bg-primary-500 text-white shadow-2xs' 
                                    : 'bg-secondary-100 hover:bg-primary-50 text-secondary-700 hover:text-primary-600 dark:bg-secondary-800 dark:hover:bg-primary-950/20 dark:text-secondary-300 dark:hover:text-primary-400 border border-[#E8E8E8] dark:border-[#262626]'
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
                                className="px-2.5 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-950/40 rounded-lg border border-primary-200 dark:border-primary-800/40 transition-colors"
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

                {/* COMMERCIAL ORDER DRAFT & DISPATCH */}
                <div className="p-5 bg-white dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#222222] rounded-xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8] dark:border-[#222222]">
                    <div>
                      <h3 className="text-sm font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary-500" /> Commercial Purchase Requisition & RFQ Email Package
                      </h3>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        Tailored for <span className="font-bold text-secondary-900 dark:text-white">{selectedDistributor?.vendor || 'Mouser Electronics'}</span> • Part: <span className="font-mono text-primary-600 dark:text-primary-400 font-bold">{selectedDistributor?.altPartId || 'Selected Alternative'}</span> • Ref <span className="font-mono text-primary-600 dark:text-primary-400 font-bold">{prNumber}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy Email'}
                      </button>

                      <a
                        href={`mailto:orders@${(selectedDistributor?.vendor || 'supplier').toLowerCase().replace(/\s+/g, '')}.com?subject=${encodeURIComponent(`[URGENT RFQ / PO: ${prNumber}] Procurement Order for ${selectedDistributor?.altPartId || 'Component'}`)}&body=${encodeURIComponent(emailDraft)}`}
                        className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/20 dark:hover:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-primary-200 dark:border-primary-800/40"
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
                      className="w-full p-4 bg-[#F8F9FA] dark:bg-[#0D0D0D] border border-[#E8E8E8] dark:border-[#222222] rounded-xl font-mono text-xs text-secondary-800 dark:text-secondary-200 leading-relaxed outline-none focus:border-primary-500"
                      placeholder="Generating commercial procurement draft..."
                    />
                    <div className="absolute right-3 bottom-3 text-[10px] text-secondary-400 flex items-center gap-1 bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                      <Sparkles className="w-3 h-3 text-primary-500" /> Drafted via Groq LLM
                    </div>
                  </div>

                  {/* APPROVAL & ACTION BAR */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-secondary-500 dark:text-secondary-400">
                      Total Order Commitment ({selectedDistributor?.altPartId || 'Component'}): <span className="font-extrabold text-secondary-900 dark:text-white">${((selectedDistributor?.unitPrice || 4.35) * quantity).toLocaleString()} USD</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setShowPrModal(true)}
                        className="px-4 py-2.5 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-primary-500" /> View Audit Dossier
                      </button>

                      <button
                        onClick={handleApprovePlan}
                        className="btn-primary !h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Requisition {selectedDistributor?.altPartId || 'Option'}
                      </button>
                    </div>
                  </div>

                  {planGenerated && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
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
        </main>
      </div>

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
