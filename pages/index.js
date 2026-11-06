import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Activity, AlertTriangle, ShieldCheck, Cpu, Box, 
  Search, MessageSquare, CheckCircle, Clock, Zap,
  Menu, Bell, User, LayoutDashboard, Database, Settings, ShieldAlert, RefreshCw, ArrowRight,
  ExternalLink, Layers, Radio, Globe as GlobeIcon, FileText, Check, TrendingUp, TrendingDown,
  Sparkles, CheckCircle2, Sliders, ChevronRight, Factory, Package, ArrowUpRight
} from 'lucide-react';
import events from '../data/events.json';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PrAuditExportModal from '../components/PrAuditExportModal';
import SourceRegistryScraperModal from '../components/SourceRegistryScraperModal';
import SpendProtectedChart from '../components/SpendProtectedChart';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });

export async function getServerSideProps() {
  try {
    const { getLatestDisruptions } = require('../lib/intelligence/newsClient');
    const { explodeBOM } = require('../lib/sap/bomEngine');
    const signals = await getLatestDisruptions();

    // Explode real SAP S/4HANA BOMs for all key tracked enterprise materials
    const trackedParts = [
      'STM32F401RE',
      'TPS54331DR',
      'BMI270',
      'MT29F64G08AECABH1',
      'XC7Z020-1CLG400C',
      'MCU-2201X',
      'PWR-9942A'
    ];

    const realSapBOMs = [];
    const realAffectedProducts = [];

    for (const p of trackedParts) {
      try {
        const explosion = await explodeBOM(p);
        if (explosion && explosion.found) {
          realSapBOMs.push(explosion);
          for (const a of (explosion.assemblies || [])) {
            realAffectedProducts.push({
              productName: a.finishedProduct,
              productCode: a.productCode || 'TG-SAP',
              assemblyName: a.assemblyName,
              assemblyId: a.assemblyId,
              plant: a.factory,
              bottleneckPart: explosion.partNumber,
              category: explosion.category || 'Semiconductor',
              dailyRevenue: a.dailyRevenue || Math.round(explosion.totalDailyRevenue / (explosion.assemblies.length || 1)),
              dailyVolume: a.dailyProductionVolume || 50,
              inventoryOnHand: explosion.inventoryOnHand,
              safetyStock: explosion.safetyStock,
              daysOfSupply: explosion.daysOfSupply,
              isStockDeficit: explosion.isStockDeficit,
              primarySupplier: explosion.primarySupplier || 'STMicroelectronics'
            });
          }
        }
      } catch(err) {
        console.warn(`Error exploding BOM for ${p}:`, err);
      }
    }

    return { 
      props: JSON.parse(JSON.stringify({ 
        initialSignals: signals || [],
        initialSapBOMs: realSapBOMs,
        initialAffectedProducts: realAffectedProducts
      }))
    };
  } catch(e) {
    return { props: { initialSignals: [], initialSapBOMs: [], initialAffectedProducts: [] } };
  }
}

export default function Dashboard({ initialSignals = [], initialSapBOMs = [], initialAffectedProducts = [] }) {
  const router = useRouter();
  const [stage, setStage] = useState(0); 
  const [detectResult, setDetectResult] = useState(null);
  const [impactResult, setImpactResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrModal, setShowPrModal] = useState(false);
  
  // Real SAP Data from S/4HANA BOM Engine
  const [sapBOMs] = useState(initialSapBOMs);
  const [affectedProducts] = useState(initialAffectedProducts);
  const [selectedPlantFilter, setSelectedPlantFilter] = useState('ALL');
  
  // SAP Integration State
  const [sapStatus, setSapStatus] = useState({ s4hana: 'Sandbox Mode', ariba: 'Sandbox Mode', mode: 'DEMO MODE' });
  const [auditTrail, setAuditTrail] = useState([]);
  
  // Multi-Source Signal State
  const [liveNews, setLiveNews] = useState(initialSignals);
  const [filterTier, setFilterTier] = useState('ALL');
  const [activeNews, setActiveNews] = useState(initialSignals.length > 0 ? initialSignals[0] : null);
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [isSearchingNews, setIsSearchingNews] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const SCAN_CYCLE_SECONDS = 24 * 60 * 60; // 24 Hours Cycle (86,400s)
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState(SCAN_CYCLE_SECONDS);
  const [lastScannedTime, setLastScannedTime] = useState(new Date().toLocaleTimeString());

  // Formatter for 24-hour countdown display (e.g., 23h 59m 45s)
  const formatScanCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  // Scraper Modal State
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [selectedSignalForScrape, setSelectedSignalForScrape] = useState(null);
  const [bomSortBy, setBomSortBy] = useState('revenue');

  const fetchNews = async (query = '', forceRefresh = false) => {
    setIsRefreshing(true);
    setIsLiveScanning(true);
    let url = '/api/news/latest';
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (forceRefresh) params.append('refresh', 'true');
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    try {
      const r = await fetch(url);
      const news = await r.json();
      if (Array.isArray(news) && news.length > 0) {
        setLiveNews(news);
        setActiveNews(prev => prev || news[0]);
        setLastScannedTime(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setIsLiveScanning(false);
      }, 500);
    }
  };

  const handleManualScan = () => {
    setScanCountdown(SCAN_CYCLE_SECONDS); // Reset to 24 hours
    fetchNews(newsSearchQuery, true);
  };

  const handleOpenScraperModal = (sig, e) => {
    if (e) e.stopPropagation();
    setSelectedSignalForScrape(sig);
    setShowScraperModal(true);
  };

  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    fetch('/api/sap/status').then(r => r.json()).then(setSapStatus);
    fetchNews('', false);
    
    const ticker = setInterval(() => {
      setScanCountdown(prev => {
        if (prev <= 1) {
          if (stageRef.current === 0 && !isSearchingNews) {
            fetchNews('', true);
          }
          return SCAN_CYCLE_SECONDS; // Reset to 24-hour cycle
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [isSearchingNews]);

  const threatSectionRef = useRef(null);

  const addAudit = (source, message) => {
    setAuditTrail(prev => [...prev, { time: new Date().toISOString(), source, message }]);
  };

  const simulatePipeline = async (newsArticle) => {
    setLoading(true);
    setStage(1);
    setAuditTrail([]);

    if (typeof window !== 'undefined' && threatSectionRef.current) {
      threatSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 1. Detect (Entity Extraction + Private Deterministic BOM Correlation)
    const r1 = await fetch('/api/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newsArticle })
    });
    const d1 = await r1.json();
    setDetectResult(d1);

    addAudit('Entity Extraction Agent', `Extracted public entity: ${d1.correlationDetails?.publicEntityExtracted || 'Industry Node'}`);
    addAudit('BOM Correlation Engine', `Correlated to private BOM: ${d1.partNumber || 'No Direct Match'}`);
    
    if (!d1.isDisruption || !d1.partNumber) {
      addAudit('System', 'Signal verified as non-critical to tracked enterprise BOM. Pipeline safely halted.');
      setLoading(false);
      return;
    }

    await new Promise(r => setTimeout(r, 1000));
    setStage(2);
    
    // 2. Impact (SAP S/4HANA BOM Explosion)
    const r2 = await fetch('/api/impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        partNumber: d1.partNumber,
        severity: d1.severity,
        confidence: d1.evidenceConfidence
      })
    });
    const d2 = await r2.json();
    setImpactResult(d2);
    addAudit('SAP S/4HANA', `Material ${d1.partNumber} exploded in ERP BOM`);
    addAudit('Impact Agent', `${(d2.affectedProducts || []).length} product lines mapped with $${d2.revenueAtRiskPerDay?.toLocaleString()}/day revenue exposure`);

    await new Promise(r => setTimeout(r, 1200));
    setStage(3);

    // 3. Match (Spot Market Sourcing via Mouser / Catalog)
    const r3 = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partNumber: d1.partNumber })
    });
    const d3 = await r3.json();
    setMatchResult(d3);
    addAudit('Mouser Market Sourcing', `${d3.length} pin-compatible replacement alternatives discovered with live stock levels`);

    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    
    addAudit('System', 'Analysis complete. Awaiting human decision in Decision Center.');
    
    const newRecord = {
      disruption_id: "DSP-LIVE-" + Math.floor(Math.random() * 10000),
      event_type: d1.reason || "Operational Anomaly Identified",
      part_affected: d1.partNumber,
      severity: d1.severity,
      revenue_at_risk_usd: d2.revenueAtRiskPerDay,
      status: "Awaiting Decision",
      evidenceConfidence: d1.evidenceConfidence || 92,
      verifiedUrl: d1.verifiedUrl || newsArticle.verifiedUrl || "#",
      sourceTier: d1.sourceTier || newsArticle.sourceTier || "CORPORATE_DISCLOSURE",
      source: newsArticle.source || "Multi-Source Feed",
      correlationDetails: d1.correlationDetails,
      plants_affected: 3,
      products_affected: d2.affectedProducts?.length || 3,
      orders_at_risk: 42,
      matched_options: d3,
      detected_at: new Date().toISOString()
    };
    
    try {
      const current = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      localStorage.setItem('custom_disruptions', JSON.stringify([newRecord, ...current]));
    } catch(e) {}
    
    setMatchResult(newRecord);
  };

  const getSourceBadge = (tier) => {
    switch(tier) {
      case 'SEC_EDGAR':
        return { label: 'SEC EDGAR (10-K/8-K)', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40' };
      case 'OFFICIAL_IR':
        return { label: 'Official IR (Non-U.S.)', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40' };
      case 'FED_REGISTER_BIS':
        return { label: 'Federal Register (BIS)', color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40' };
      case 'USGS_SEISMIC':
        return { label: 'USGS Seismic Sensor', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40' };
      case 'NEWS_BASELINE':
        return { label: 'Media Wire Baseline', color: 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-300 dark:border-secondary-700' };
      default:
        return { label: 'Primary Disclosure', color: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/40 dark:text-primary-400 dark:border-primary-900/40' };
    }
  };

  const filteredSignals = liveNews.filter(s => {
    if (filterTier === 'ALL') return true;
    if (filterTier === 'SEC_IR') return s.sourceTier === 'SEC_EDGAR' || s.sourceTier === 'OFFICIAL_IR';
    return s.sourceTier === filterTier;
  });

  // Filter & sort real SAP BOM products
  const filteredSapProducts = affectedProducts.filter(prod => {
    if (selectedPlantFilter === 'ALL') return true;
    return prod.plant.toUpperCase().includes(selectedPlantFilter);
  }).sort((a, b) => {
    if (bomSortBy === 'runout') {
      const getDays = (s) => {
        const m = (s || '').match(/(\d+)d/);
        return m ? parseInt(m[1]) : 999;
      };
      return getDays(a.runout) - getDays(b.runout);
    }
    return (b.dailyRevenue || 0) - (a.dailyRevenue || 0);
  });

  const totalSapRevenueAtRisk = affectedProducts.reduce((sum, p) => sum + (p.dailyRevenue || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>SentinelChain | Autonomous Supply Chain Risk Management & Resilience</title>
        <meta name="description" content="AI-powered Supply Chain Risk Management (SCRM) and Resilience platform for electronics manufacturing." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-12 pb-28 min-w-0">
          
          {/* ======================================================== */}
          {/* SECTION 1: EXECUTIVE OPERATIONS TOWER & THREAT MATRIX    */}
          {/* ======================================================== */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-10">
            
            {/* Header Top Controls Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/40 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Autonomous Supply Chain Risk Intelligence
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0FDF4] dark:bg-emerald-950/30 border border-[#DCFCE7] dark:border-emerald-900/40 text-xs font-bold text-[#16A34A] dark:text-emerald-400 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                  <span>SAP S/4HANA & Mouser Connected</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-[#141414] border border-[#EAEAEA] dark:border-[#262626] rounded-xl px-3 py-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-secondary-400" />
                  <span>Horizon:</span>
                  <span className="font-bold text-secondary-900 dark:text-white">Last 24h</span>
                </div>

                {(loading || stage > 0) && (
                  <button 
                    onClick={() => { 
                      setStage(0); 
                      setDetectResult(null); 
                      setImpactResult(null); 
                      setMatchResult(null); 
                      setAuditTrail([]); 
                      setActiveNews(null); 
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white bg-white dark:bg-[#161616] hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all border border-[#EAEAEA] dark:border-[#262626] cursor-pointer"
                  >
                    Reset Pipeline
                  </button>
                )}
              </div>
            </div>

            {/* Asymmetric Layout: Operational Title + Unified Executive Threat Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Command Title & Operational Actions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
                    Supply Chain Operations Tower
                  </h1>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Real-time semiconductor telemetry correlating active fab disruptions with SAP S/4HANA Bill of Materials, component inventory runout rates, and automated Mouser spot sourcing.
                  </p>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => {
                      if (liveNews.length > 0) simulatePipeline(liveNews[0]);
                    }}
                    className="h-11 px-5 bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-secondary-100 dark:text-secondary-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-primary-500" />
                    <span>Run Threat Triage</span>
                  </button>

                  <Link 
                    href="/disruptions" 
                    className="h-11 px-5 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262626] text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs transition-all flex items-center gap-2"
                  >
                    Active Disruptions <ArrowRight className="w-4 h-4 text-secondary-400" />
                  </Link>

                  <Link 
                    href="/plans" 
                    className="h-11 px-5 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262626] text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs transition-all flex items-center gap-2"
                  >
                    Recovery Plans <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Authoritative Executive Threat Matrix (Unified Ground Truth) */}
              <div className="lg:col-span-5 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden bg-white dark:bg-[#141414] divide-x divide-y divide-[#E5E7EB] dark:divide-[#262626] shadow-sm">
                <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] dark:divide-[#262626]">
                  <div className="p-5 flex flex-col justify-between min-h-[135px]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      Total Daily Exposure
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
                        ${(totalSapRevenueAtRisk / 1000000).toFixed(2)}M <span className="text-xs font-semibold text-secondary-500">/ day</span>
                      </div>
                      <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                        Active SAP S/4HANA BOM line revenue-at-risk
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between min-h-[135px]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      Critical Assembly Buffers
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                        3 Plants
                      </div>
                      <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                        Stuttgart, Austin, Munich facing &lt; 5d stock runout
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] dark:divide-[#262626]">
                  <div className="p-5 flex flex-col justify-between min-h-[135px]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      Active Threat Signals
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white tracking-tight">
                        {liveNews.length > 0 ? liveNews.length : 14} Verified
                      </div>
                      <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                        USGS seismic, BIS rules & SEC disclosures
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between min-h-[135px]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      Autonomous Remediation
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                        100% Guardrailed
                      </div>
                      <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                        Mouser API spot-matching & SAP Ariba PR active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: GLOBAL SUPPLY CORRIDORS & SPEND PROTECTION    */}
          {/* ======================================================== */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-[#E5E7EB] dark:border-[#222222] p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Header Control Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA] dark:border-[#222222]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/40 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-secondary-900 dark:text-white">
                    Global Semiconductor Corridors & Margin Protection
                  </h2>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Live Foundry Telemetry (Hsinchu, Tainan, Pyeongtaek, Dresden) and Autonomous Spend Preservation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Live Telemetry Engine Active
                </span>
              </div>
            </div>

            {/* DUAL BALANCED ANALYTICAL PANELS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Panel: Global Disruption WorldMap (7 Columns / ~58%) */}
              <div className="lg:col-span-7 border border-[#EAEAEA] dark:border-[#262626] rounded-2xl overflow-hidden bg-[#F8F9FA] dark:bg-[#0C0F17] relative shadow-inner min-h-[440px] flex flex-col justify-between">
                <div className="p-4 bg-white/90 dark:bg-black/40 backdrop-blur border-b border-[#EAEAEA] dark:border-white/10 flex items-center justify-between text-secondary-900 dark:text-white z-10">
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="w-4 h-4 text-primary-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Geographic Foundry Telemetry</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30">APAC</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-white/70">EMEA</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-white/70">Americas</span>
                  </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center">
                  <WorldMap />
                </div>
              </div>

              {/* Right Panel: Interactive Spend Horizon Area Curve (5 Columns / ~42%) */}
              <SpendProtectedChart />
            </div>

          </div>

          {/* ======================================================== */}
          {/* SECTION 3: REAL SAP S/4HANA BOM AFFECTED PRODUCTS        */}
          {/* ======================================================== */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA] dark:border-[#222222]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl sm:text-2xl font-black text-secondary-900 dark:text-white tracking-tight">
                    Impacted Finished Products & Assembly Lines
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400">
                  Live SAP S/4HANA Bill of Materials (<code className="text-primary-600 dark:text-primary-400 font-mono font-bold">API_BILL_OF_MATERIAL_SRV</code>) explosion correlating component shortages to downstream finished assemblies.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                  {filteredSapProducts.length} Assemblies at Risk (${(totalSapRevenueAtRisk / 1000000).toFixed(2)}M/d)
                </span>

                {/* Sort Order Toggle */}
                <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#161616] p-1 rounded-xl border border-[#EAEAEA] dark:border-[#262626]">
                  <span className="text-[10px] uppercase font-bold text-secondary-500 px-1.5">Sort:</span>
                  <button
                    onClick={() => setBomSortBy('revenue')}
                    className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                      bomSortBy === 'revenue'
                        ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-2xs'
                        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                    }`}
                  >
                    Revenue at Risk
                  </button>
                  <button
                    onClick={() => setBomSortBy('runout')}
                    className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                      bomSortBy === 'runout'
                        ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-2xs'
                        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                    }`}
                  >
                    Urgent Runout
                  </button>
                </div>
                
                {/* Plant Filter Pills */}
                <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#161616] p-1 rounded-xl border border-[#EAEAEA] dark:border-[#262626]">
                  {['ALL', 'STUTTGART', 'AUSTIN', 'MUNICH'].map(pl => (
                    <button
                      key={pl}
                      onClick={() => setSelectedPlantFilter(pl)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                        selectedPlantFilter === pl
                          ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-2xs'
                          : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                      }`}
                    >
                      {pl === 'ALL' ? 'All Plants' : pl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real SAP BOM Table */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#262626] bg-[#F9FAFB] dark:bg-[#18191D] text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      <th className="px-6 py-4">Finished Product (SAP Code)</th>
                      <th className="px-6 py-4">Assembly Plant</th>
                      <th className="px-6 py-4">Bottleneck Component</th>
                      <th className="px-6 py-4">Revenue at Risk</th>
                      <th className="px-6 py-4">Runout / Stock Buffer</th>
                      <th className="px-6 py-4 text-right">Autonomous Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
                    {filteredSapProducts.slice(0, 8).map((prod, idx) => (
                      <tr key={idx} className="hover:bg-secondary-50 dark:hover:bg-[#18191D] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-secondary-900 dark:text-white text-sm">
                            {prod.productName}
                          </div>
                          <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-bold">{prod.productCode}</span>
                          <span className="text-[11px] text-secondary-400 ml-2">({prod.assemblyId})</span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300 font-medium">
                            <Factory className="w-3.5 h-3.5 text-secondary-400" />
                            <span>{prod.plant}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 px-2.5 py-1 rounded-md">
                            {prod.bottleneckPart}
                          </span>
                          <span className="text-[10px] text-secondary-400 font-medium ml-2">{prod.category}</span>
                        </td>

                        <td className="px-6 py-4 font-black text-red-600 dark:text-red-400 text-sm">
                          ${(prod.dailyRevenue / 1000).toFixed(0)}k<span className="text-xs font-normal text-secondary-400">/day</span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              prod.daysOfSupply <= 5 
                                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40'
                                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40'
                            }`}>
                              {prod.daysOfSupply <= 5 ? `Critical: ${prod.daysOfSupply}d Runout` : `${prod.daysOfSupply}d Buffer Remaining`}
                            </span>
                            <span className="text-[11px] text-secondary-400 block font-medium">
                              {prod.inventoryOnHand} in stock / {prod.safetyStock} safety
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/disruptions/DSP-LIVE-1001`}
                            className="px-3.5 py-1.5 bg-secondary-100 hover:bg-primary-50 hover:text-primary-600 dark:bg-secondary-800 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 text-secondary-900 dark:text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <span>Decision Center</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: CONTEXTUAL REGIONAL RISK TELEMETRY            */}
          {/* ======================================================== */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] dark:border-[#222222]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-secondary-900 dark:text-white tracking-tight">
                  Contextual Regional Risk & Semiconductor Hubs
                </h2>
                <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                  Active fab clusters exposure mapped across APAC, EMEA, and Americas manufacturing corridors.
                </p>
              </div>

              <Link 
                href="/network"
                className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <span>Directory</span> <ChevronRight className="w-3.5 h-3.5 text-secondary-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Regional Card 1: APAC */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary-400">East Asia Silicon Corridor</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] dark:bg-red-950/40 dark:text-red-400 border border-[#FEE2E2] dark:border-red-900/40">
                      Critical Exposure
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Taiwan & Hsinchu Fab Cluster</h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-2 leading-relaxed">
                    TSMC Fab 18 wafer logistics delayed due to M6.4 seismic event. STM32 and MCU lead times extended to 18 weeks.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#262626] flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-secondary-400">Revenue at risk:</span>
                  <span className="text-base font-black text-[#DC2626] dark:text-red-400">$1,575,000 / day</span>
                </div>
              </div>

              {/* Regional Card 2: EMEA */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary-400">Central Europe Automotive Hub</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-400 border border-[#FEF3C7] dark:border-amber-900/40">
                      Moderate Risk
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Dresden Silicon Saxony Corridor</h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-2 leading-relaxed">
                    Dresden power semiconductor allocation tight. 2 Tier-1 automotive harness plants re-routed to backup stock.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#262626] flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-secondary-400">Revenue at risk:</span>
                  <span className="text-base font-black text-[#D97706] dark:text-amber-400">$540,000 / day</span>
                </div>
              </div>

              {/* Regional Card 3: Americas */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary-400">Americas Analog & Sensors</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-400 border border-[#DCFCE7] dark:border-emerald-900/40">
                      Stable Sourcing
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Dallas & Austin Semiconductor Corridors</h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-2 leading-relaxed">
                    Texas Instruments and NXP Dallas lines running at 98.2% baseline inventory buffer with zero unfulfilled orders.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#262626] flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-secondary-400">Revenue at risk:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">$0 / day (Nominal)</span>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 5: MULTI-SOURCE DISRUPTION STREAM & TRIAGE       */}
          {/* ======================================================== */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA] dark:border-[#222222]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-secondary-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Radio className="w-5 h-5 text-primary-500" /> Multi-Source Disruption Stream
                </h2>
                <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                  Deterministic signal correlation with institutional registries (SEC, BIS, USGS, Reuters)
                </p>
              </div>

              {/* Source Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F2F4] dark:bg-[#161616] p-1.5 rounded-xl border border-[#EAEAEA] dark:border-[#262626]">
                {[
                  { id: 'ALL', label: 'All Signals' },
                  { id: 'SEC_IR', label: 'SEC / IR' },
                  { id: 'FED_REGISTER_BIS', label: 'BIS Rules' },
                  { id: 'USGS_SEISMIC', label: 'USGS Sensor' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFilterTier(t.id)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      filterTier === t.id
                        ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 border-secondary-900 dark:border-white shadow-2xs'
                        : 'bg-white dark:bg-[#111111] text-secondary-700 dark:text-secondary-300 border-[#EAEAEA] dark:border-[#262626] hover:border-[#D6D6D6]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Web Scraping Engine Control Bar & Live Ticker */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141414] text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/40 text-primary-600 dark:text-primary-400 shrink-0">
                  <Radio className="w-4 h-4 text-primary-500" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#141414]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-secondary-900 dark:text-white flex items-center gap-1.5">
                      Real-Time Disruption Web-Scraping Engine
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Continuous institutional web-crawling across USGS Sensor, Federal Register (BIS), SEC EDGAR & Corporate IR (Every 24 Hours)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* 24-Hour Countdown Ticker */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary-50 dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#2B3242]">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs text-secondary-700 dark:text-slate-300 font-mono">
                    Auto-scrape in <span className="font-extrabold text-primary-600 dark:text-primary-400">{formatScanCountdown(scanCountdown)}</span>
                  </span>
                  <span className="text-secondary-300 dark:text-slate-600">•</span>
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 font-mono font-bold bg-primary-50 dark:bg-primary-950/60 px-1.5 py-0.5 rounded border border-primary-200 dark:border-primary-800/40">
                    24h Cycle
                  </span>
                  <span className="text-secondary-300 dark:text-slate-600">•</span>
                  <span className="text-[10px] text-secondary-500 dark:text-slate-400 font-mono">
                    Last: {lastScannedTime}
                  </span>
                </div>

                {/* Instant Scan Live Button */}
                <button
                  onClick={handleManualScan}
                  disabled={isLiveScanning}
                  className="px-3.5 py-1.5 bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLiveScanning ? 'animate-spin' : ''}`} />
                  <span>{isLiveScanning ? 'Scraping Sources...' : 'Scan Sources Live'}</span>
                </button>
              </div>
            </div>

            {/* SKU Search Filter */}
            <div className="p-3.5 flex items-center gap-3 rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#141414] shadow-2xs">
              <Search className="w-4 h-4 text-secondary-400 shrink-0" />
              <input 
                type="text"
                placeholder="Search by Part Number (e.g. STM32F401, TPS54331), supplier, or event..."
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newsSearchQuery.trim()) {
                      setIsSearchingNews(true);
                      fetchNews(newsSearchQuery);
                    } else {
                      setIsSearchingNews(false);
                      fetchNews();
                    }
                  }
                }}
                className="flex-1 bg-transparent border-none text-xs font-medium outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
              {newsSearchQuery && (
                <button 
                  onClick={() => {
                    setNewsSearchQuery('');
                    setIsSearchingNews(false);
                    fetchNews();
                  }} 
                  className="text-xs font-bold text-secondary-400 hover:text-red-500 transition-colors uppercase px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Signal Stream Cards Grid */}
            <div className="space-y-4">
              {filteredSignals.map((news) => {
                const badge = getSourceBadge(news.sourceTier);
                const isSelected = activeNews?.id === news.id;

                return (
                  <div 
                    key={news.id} 
                    onClick={() => {
                      if (!loading && activeNews?.id !== news.id) {
                        setActiveNews(news);
                      }
                    }}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                      isSelected
                        ? 'bg-primary-50/80 dark:bg-primary-950/25 border-primary-500 shadow-sm ring-1 ring-primary-500/30' 
                        : 'bg-white dark:bg-[#141414] border-[#EAEAEA] dark:border-[#262626] hover:border-primary-300 dark:hover:border-primary-500/40 hover:shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2 max-w-4xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {news.evidenceConfidence}% Tier-Weighted Confidence
                        </span>
                        <span className="text-xs text-secondary-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-secondary-400" />
                          {new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-secondary-900 dark:text-white leading-snug">
                        {news.title}
                      </h4>

                      <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed">
                        {news.description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button 
                          onClick={(e) => handleOpenScraperModal(news, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-600 hover:text-white bg-primary-50 hover:bg-primary-600 dark:bg-primary-950/40 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white border border-primary-200 dark:border-primary-800/50 transition-all cursor-pointer shadow-2xs group"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>View Verified Source Registry</span>
                        </button>

                        {news.verifiedUrl && news.verifiedUrl !== '#' && (
                          <a 
                            href={news.verifiedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary-500 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-white transition-colors"
                          >
                            <span>Open URL</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          simulatePipeline(news); 
                        }}
                        className="w-full md:w-auto px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" /> Run Threat Triage
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 6: AI RECOMMENDATIONS & AUTONOMOUS DECISION      */}
          {/* ======================================================== */}
          {(stage > 0 || detectResult || matchResult) && (
            <div ref={threatSectionRef} id="threat-section" className="space-y-6 pt-6 border-t border-[#EAEAEA] dark:border-[#222222]">
              
              {/* Stage Progress Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${stage >= 1 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#141414] border-[#EAEAEA] dark:border-[#262626]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 1 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>1</div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">Entity Extraction</p>
                    <p className="text-[10px] text-secondary-500 dark:text-secondary-400">Institutional Signal → BOM</p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${stage >= 2 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#141414] border-[#EAEAEA] dark:border-[#262626]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 2 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>2</div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">SAP S/4HANA BOM Explosion</p>
                    <p className="text-[10px] text-secondary-500 dark:text-secondary-400">Revenue Exposure Calculated</p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${stage >= 3 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#141414] border-[#EAEAEA] dark:border-[#262626]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 3 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>3</div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">Mouser Spot Sourcing</p>
                    <p className="text-[10px] text-secondary-500 dark:text-secondary-400">Ariba PR Ready</p>
                  </div>
                </div>
              </div>

              {/* Detection Card */}
              {detectResult && (
                <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-[#141414] overflow-hidden shadow-sm">
                  <div className="bg-red-50 dark:bg-red-950/30 px-6 py-4 flex flex-wrap items-center justify-between border-b border-red-200 dark:border-red-900/40 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-red-900 dark:text-red-300 uppercase tracking-wide">
                          Critical Disruption Confirmed
                        </h3>
                        <p className="text-xs text-red-700/80 dark:text-secondary-400">
                          Deterministic correlation with private enterprise SAP Bill of Materials
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-full shadow-2xs">
                      Severity: {detectResult.severity?.toUpperCase() || 'HIGH'}
                    </span>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">
                          Diagnostic Assessment
                        </h4>
                        <p className="text-secondary-800 dark:text-secondary-200 text-xs sm:text-sm leading-relaxed bg-[#FAFAFA] dark:bg-[#161616] p-4 rounded-xl border border-[#EAEAEA] dark:border-[#262626]">
                          {detectResult.reason}
                        </p>
                      </div>

                      {/* Display Real Exploded Products in Triage */}
                      {impactResult?.affectedProducts && (
                        <div>
                          <h4 className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">
                            SAP S/4HANA Exploded Assemblies ({impactResult.affectedProducts.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {impactResult.affectedProducts.map((prod, idx) => (
                              <span key={idx} className="px-3 py-1.5 text-xs font-bold bg-[#F9FAFB] dark:bg-[#18191D] text-secondary-900 dark:text-white rounded-xl border border-[#E5E7EB] dark:border-[#262626] flex items-center gap-1.5 shadow-2xs">
                                <Package className="w-3.5 h-3.5 text-primary-500" />
                                {prod}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-[#FAFAFA] dark:bg-[#161616] rounded-xl border border-[#EAEAEA] dark:border-[#262626] space-y-2 text-xs">
                        <p className="text-xs font-bold uppercase text-secondary-400 tracking-wider">Provenance Proof</p>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-500">Public Entity:</span>
                          <span className="font-bold text-secondary-900 dark:text-white">{detectResult.correlationDetails?.publicEntityExtracted || 'Semiconductor Foundry'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-500">Target Material:</span>
                          <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{detectResult.partNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-500">Confidence:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{detectResult.evidenceConfidence || 88}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 lg:border-l lg:border-[#EAEAEA] dark:lg:border-[#262626] lg:pl-6">
                      <div>
                        <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider block">Impacted Material</span>
                        <span className="font-mono text-sm font-extrabold text-primary-600 dark:text-primary-400 mt-1 block">
                          {detectResult.partNumber}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider block">Daily Revenue Exposure</span>
                        <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 block">
                          ${(detectResult.revenueAtRiskPerDay || 1575000).toLocaleString()}<span className="text-xs font-semibold text-secondary-400">/day</span>
                        </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setShowPrModal(true)}
                          className="w-full py-2.5 bg-white dark:bg-[#161616] hover:bg-secondary-50 border border-[#EAEAEA] dark:border-[#262626] text-xs font-bold text-secondary-900 dark:text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-primary-500" /> Export PR Dossier (PDF)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sourced Alternatives Decision Center Table */}
              {matchResult && (
                <div className="rounded-2xl border border-primary-200 dark:border-primary-800/40 bg-white dark:bg-[#141414] p-6 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">Autonomous Sourcing Qualified</span>
                      <h3 className="text-lg font-black text-secondary-900 dark:text-white mt-0.5">Mouser Electronics Spot Allocation Ready</h3>
                    </div>

                    <Link
                      href={`/disruptions/${matchResult.disruption_id || 'DSP-LIVE-1001'}`}
                      className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                    >
                      Open Decision Center <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="border border-[#EAEAEA] dark:border-[#262626] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFAFA] dark:bg-[#161616] border-b border-[#EAEAEA] dark:border-[#262626] text-secondary-500 font-bold">
                        <tr>
                          <th className="p-3.5">Qualified Part (MPN)</th>
                          <th className="p-3.5">Package & Compatibility</th>
                          <th className="p-3.5">Vendor</th>
                          <th className="p-3.5">Lead Time</th>
                          <th className="p-3.5">Stock Qty</th>
                          <th className="p-3.5">Quoted Price</th>
                          <th className="p-3.5">Target Negotiated</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAEAEA] dark:divide-[#262626] font-mono">
                        <tr className="bg-primary-50/40 dark:bg-primary-950/20 font-bold">
                          <td className="p-3.5 text-primary-600 dark:text-primary-400 font-bold">STM32F401RBT6TR</td>
                          <td className="p-3.5 font-sans">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              LQFP-64 (100% Drop-In)
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">Mouser Electronics</td>
                          <td className="p-3.5 text-emerald-600 dark:text-emerald-400">3 Days</td>
                          <td className="p-3.5">14,200 pcs</td>
                          <td className="p-3.5 text-secondary-400">$6.26</td>
                          <td className="p-3.5 text-emerald-600 dark:text-emerald-400">$5.80</td>
                          <td className="p-3.5 text-right font-sans">
                            <span className="px-2.5 py-1 rounded bg-primary-500 text-white text-[11px] font-bold">
                              Optimal #1
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3.5 text-secondary-900 dark:text-white">STM32F401CCU6TR</td>
                          <td className="p-3.5 font-sans">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700">
                              UFQFPN-48 (Functional Alt)
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">Mouser Electronics</td>
                          <td className="p-3.5">3 Days</td>
                          <td className="p-3.5">8,500 pcs</td>
                          <td className="p-3.5 text-secondary-400">$6.70</td>
                          <td className="p-3.5 text-emerald-600 dark:text-emerald-400">$6.15</td>
                          <td className="p-3.5 text-right font-sans">
                            <span className="px-2.5 py-1 rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 text-[11px] font-bold">
                              Alternate
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Multi-Agent Audit Log */}
              {auditTrail.length > 0 && (
                <div className="p-4 rounded-xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] space-y-2">
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-primary-500" /> Multi-Agent Audit Trail
                  </p>
                  <div className="space-y-1 font-mono text-xs max-h-40 overflow-y-auto pr-2">
                    {auditTrail.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-secondary-600 dark:text-secondary-400">
                        <span className="text-secondary-400 shrink-0">{new Date(log.time).toLocaleTimeString()}</span>
                        <span className="text-primary-600 dark:text-primary-400 font-bold shrink-0">[{log.source}]</span>
                        <span className="text-secondary-900 dark:text-secondary-200">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={matchResult || detectResult} />
      <SourceRegistryScraperModal isOpen={showScraperModal} onClose={() => setShowScraperModal(false)} signal={selectedSignalForScrape} />
    </div>
  );
}
