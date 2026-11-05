import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Activity, AlertTriangle, ShieldCheck, Cpu, Box, 
  Search, MessageSquare, CheckCircle, Clock, Zap,
  Menu, Bell, User, LayoutDashboard, Database, Settings, ShieldAlert, RefreshCw, ArrowRight,
  ExternalLink, Layers, Radio, Globe as GlobeIcon, FileText, Check, TrendingUp, TrendingDown,
  Sparkles, CheckCircle2, Sliders, ChevronRight
} from 'lucide-react';
import events from '../data/events.json';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PrAuditExportModal from '../components/PrAuditExportModal';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });

export async function getServerSideProps() {
  try {
    const { getLatestDisruptions } = require('../lib/intelligence/newsClient');
    const signals = await getLatestDisruptions();
    return { props: { initialSignals: signals || [] } };
  } catch(e) {
    return { props: { initialSignals: [] } };
  }
}

export default function Dashboard({ initialSignals = [] }) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(events[0].text);
  const [stage, setStage] = useState(0); 
  const [detectResult, setDetectResult] = useState(null);
  const [impactResult, setImpactResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [negotiateResult, setNegotiateResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatRevealIndex, setChatRevealIndex] = useState(-1);
  const [autoScroll, setAutoScroll] = useState(true);
  const [approved, setApproved] = useState(false);
  const [showPrModal, setShowPrModal] = useState(false);
  
  // SAP Integration State
  const [sapStatus, setSapStatus] = useState({ s4hana: 'Sandbox Mode', ariba: 'Sandbox Mode', mode: 'DEMO MODE' });
  const [auditTrail, setAuditTrail] = useState([]);
  const [aribaResponse, setAribaResponse] = useState(null);
  
  // Multi-Source Signal State
  const [liveNews, setLiveNews] = useState(initialSignals);
  const [filterTier, setFilterTier] = useState('ALL');
  const [accuracyStat, setAccuracyStat] = useState("Loading...");
  const [activeNews, setActiveNews] = useState(initialSignals.length > 0 ? initialSignals[0] : null);
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [isSearchingNews, setIsSearchingNews] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNews = async (query = '') => {
    setIsRefreshing(true);
    const url = query ? `/api/news/latest?q=${encodeURIComponent(query)}` : '/api/news/latest';
    try {
      const r = await fetch(url);
      const news = await r.json();
      if (Array.isArray(news) && news.length > 0) {
        setLiveNews(news);
        setActiveNews(prev => prev || news[0]);
      }
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    try {
      const pending = localStorage.getItem('pending_analysis_news');
      if (pending) {
        localStorage.removeItem('pending_analysis_news');
        const newsObj = JSON.parse(pending);
        setLiveNews([newsObj]);
        setActiveNews(newsObj);
        simulatePipeline(newsObj);
        fetch('/api/sap/status').then(r => r.json()).then(setSapStatus);
        fetch('/api/stats').then(r => r.json()).then(data => {
          try {
            const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
            const customConf = custom.filter(x => x.confirmed_impact).length;
            const total = data.total + custom.length;
            const conf = data.confirmed + customConf;
            setAccuracyStat(`${conf}/${total} (${((conf/total)*100).toFixed(0)}%)`);
          } catch(e) {
            setAccuracyStat(data.accuracyText);
          }
        });
        return;
      }
    } catch(e) {}

    fetch('/api/sap/status').then(r => r.json()).then(setSapStatus);
    fetch('/api/stats').then(r => r.json()).then(data => {
      try {
        const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
        const customConf = custom.filter(x => x.confirmed_impact).length;
        const total = data.total + custom.length;
        const conf = data.confirmed + customConf;
        setAccuracyStat(`${conf}/${total} (${((conf/total)*100).toFixed(0)}%)`);
      } catch(e) {
        setAccuracyStat(data.accuracyText);
      }
    });
    fetchNews();
    
    // Auto-refresh the multi-source signal feed every 30 seconds only if idle and not searching
    const interval = setInterval(() => {
      if (stageRef.current === 0 && !isSearchingNews) {
        fetchNews();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isSearchingNews]);

  const threatSectionRef = useRef(null);

  const addAudit = (source, message) => {
    setAuditTrail(prev => [...prev, { time: new Date().toISOString(), source, message }]);
  };

  const simulatePipeline = async (newsArticle) => {
    setLoading(true);
    setStage(1);
    setAuditTrail([]);
    setAribaResponse(null);
    setApproved(false);

    // Auto-scroll so user immediately sees threat analysis results
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
    setTimeout(() => {
      threatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
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
      
      const newRecord = {
        disruption_id: `DS-LIVE-${Math.floor(Math.random()*9000)+1000}`,
        recovery_plan_id: null,
        part_affected: "Unrelated / Noise",
        event_type: d1.reason || "Non-critical Event",
        detected_at: new Date().toISOString(),
        revenue_at_risk_usd: 0,
        status: "Resolved",
        confirmed_impact: false,
        resolution: {
          plan_id: null,
          alt_part_used: null,
          vendor: null,
          recovered_amount_usd: 0,
          time_to_recovery_hours: 0,
          outcome: "Resolved (False Positive)",
          proposed_action: "None. Threat safely dismissed."
        },
        decision_trail: [
          { agent: 'Detection Agent', action: d1.reason || "No relevant disruption classified", timestamp: new Date().toISOString(), data_used: "Multi-Source Extraction" },
          { agent: 'System', action: 'Event deemed non-critical to known supply chain. Pipeline halted.', timestamp: new Date().toISOString(), data_used: "Stopping Rules" }
        ]
      };
      try {
        const existing = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
        existing.unshift(newRecord);
        localStorage.setItem('custom_disruptions', JSON.stringify(existing));
      } catch(e) {}
      
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
    addAudit('Impact Agent', `${d2.affectedProducts.length} product lines mapped with $${d2.revenueAtRiskPerDay?.toLocaleString()}/day revenue exposure`);

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
    
    // Stop at Stage 3. The user opens the Decision Center for approval.
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
      products_affected: d2.affectedProducts?.length || 1,
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>SentinelChain | Autonomous Supply Chain Risk Management & Resilience</title>
        <meta name="description" content="AI-powered Supply Chain Risk Management (SCRM) and Resilience platform for electronics manufacturing." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-10 pb-28 min-w-0">
          
          {/* ======================================================== */}
          {/* SECTION 1: DASHBOARD EDITORIAL HEADER & METRIC DIVIDER   */}
          {/* ======================================================== */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-10">
            
            {/* Header Top Controls Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/40 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></span>
                Autonomous Supply Chain Risk Intelligence
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Live System Telemetry Status Pill */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0FDF4] dark:bg-emerald-950/30 border border-[#DCFCE7] dark:border-emerald-900/40 text-xs font-bold text-[#16A34A] dark:text-emerald-400 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  <span>SAP S/4HANA & Mouser Active</span>
                </div>

                {/* Date Horizon Filter Selector */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#141414] border border-[#EAEAEA] dark:border-[#262626] rounded-xl px-3 py-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-secondary-400" />
                  <span>Horizon:</span>
                  <span className="font-bold text-secondary-900 dark:text-white">Last 24h</span>
                </div>

                {/* Reset or Clear Pipeline Action */}
                {(loading || stage > 0) && (
                  <button 
                    onClick={() => { 
                      setStage(0); 
                      setDetectResult(null); 
                      setImpactResult(null); 
                      setMatchResult(null); 
                      setNegotiateResult(null); 
                      setApproved(false); 
                      setAribaResponse(null); 
                      setAuditTrail([]); 
                      setActiveNews(null); 
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white bg-white dark:bg-[#161616] hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all border border-[#EAEAEA] dark:border-[#262626]"
                  >
                    Reset Pipeline
                  </button>
                )}
              </div>
            </div>

            {/* Asymmetric SCALIX Layout: Bold Headline + 2x2 Divider Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Big Bold Typography & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-[-0.04em] text-secondary-900 dark:text-white leading-[1.08]">
                  Understand your <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">resilience.</span><br />
                  Decide faster with AI.
                </h1>

                <p className="text-secondary-600 dark:text-secondary-400 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                  Real-time institutional disruption triage with deterministic S/4HANA BOM correlation, live Mouser spot market sourcing, and autonomous SAP Ariba execution.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => {
                      if (liveNews.length > 0) simulatePipeline(liveNews[0]);
                    }}
                    className="px-7 py-4 bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-secondary-100 dark:text-secondary-900 text-white text-[13px] font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-primary-500" />
                    <span>Run Threat Triage</span>
                  </button>

                  <Link 
                    href="/disruptions" 
                    className="px-6 py-4 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262626] text-[13px] font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    Active Disruptions <ArrowRight className="w-4 h-4 text-secondary-400" />
                  </Link>

                  <Link 
                    href="/plans" 
                    className="px-6 py-4 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262626] text-[13px] font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    Recovery Plans <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Frameless Crosshair 2x2 Metric Matrix */}
              <div className="lg:col-span-5 grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] dark:divide-[#262626] pt-2">
                
                <div className="p-8 flex flex-col justify-between h-40">
                  <span className="text-4xl sm:text-5xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                    $84.5M+
                  </span>
                  <span className="text-xs text-secondary-600 dark:text-secondary-400 font-medium leading-relaxed">
                    Revenue exposure tracked across assembly lines in real time
                  </span>
                </div>

                <div className="p-8 flex flex-col justify-between h-40">
                  <span className="text-4xl sm:text-5xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                    32,490+
                  </span>
                  <span className="text-xs text-secondary-600 dark:text-secondary-400 font-medium leading-relaxed">
                    Global semiconductor fabs and distributor nodes monitored
                  </span>
                </div>

                <div className="p-8 flex flex-col justify-between h-40">
                  <span className="text-4xl sm:text-5xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                    &lt; 45s
                  </span>
                  <span className="text-xs text-secondary-600 dark:text-secondary-400 font-medium leading-relaxed">
                    Time from public disruption signal to actionable spot PR
                  </span>
                </div>

                <div className="p-8 flex flex-col justify-between h-40">
                  <span className="text-4xl sm:text-5xl font-extrabold text-primary-500 tracking-tight">
                    AI-powered
                  </span>
                  <span className="text-xs text-secondary-600 dark:text-secondary-400 font-medium leading-relaxed">
                    Decisions powered by deterministic BOM correlation
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: SCALIX LUMINOUS PEACH-TO-DARK MEDIA CONTAINER */}
          {/* ======================================================== */}
          <div className="hero-luminous-gradient rounded-[32px] p-6 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
            
            {/* Top Media Container Control Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-white mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/10 text-xs">
                  ◈
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Mission Control Surface
                  </h2>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Multi-Source Disruption Pipeline & Live Sourcing Matrix
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Telemetry Engine Active</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* FLOATING WHITE/DARK DASHBOARD WINDOW                      */}
            {/* ======================================================== */}
            <div className="bg-white dark:bg-[#111111] rounded-2xl floating-card-shadow p-6 sm:p-8 lg:p-10 space-y-8 transition-all">
              
              {/* Window Subnav Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAEA] dark:border-[#222222] pb-6">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F4511E] flex items-center justify-center text-white text-xs font-bold">
                      ⬡
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-secondary-900 dark:text-white">SentinelChain</span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F5F5F5] dark:bg-[#181818] p-1 rounded-xl text-xs font-semibold">
                    <span className="px-3.5 py-1.5 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-secondary-900 font-bold shadow-xs">Overview</span>
                    <Link href="/disruptions" className="px-3.5 py-1.5 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white">Disruptions</Link>
                    <Link href="/plans" className="px-3.5 py-1.5 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white">Plans</Link>
                    <Link href="/network" className="px-3.5 py-1.5 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white">Network</Link>
                    <Link href="/ledger" className="px-3.5 py-1.5 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white">Ledger</Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                    className="p-2 rounded-lg text-secondary-500 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-[#181818]"
                    title="Search (⌘K)"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-[#202020] text-white font-bold text-xs flex items-center justify-center">
                    KS
                  </div>
                </div>
              </div>

              {/* 1. 4-METRIC BALANCED STRIP WITH SUBTLE NUMBER NUANCE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-2">
                
                {/* Metric 1 */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block">Total revenue exposure</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                      $2,480,<span className="text-secondary-400">000</span>
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-400">
                      ↗ 32.5%
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block">Active disruptions count</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                      {liveNews.length > 0 ? liveNews.length : 12}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] dark:bg-red-950/40 dark:text-red-400">
                      ↗ 3 Critical
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block">Suppliers monitored</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                      32,<span className="text-secondary-400">490</span>
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-400">
                      ↗ 98.4%
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block">Network resilience score</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary-500 tracking-tight">
                      94.2%
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4ED] text-[#F4511E] dark:bg-primary-950/40 dark:text-primary-400">
                      ↗ +3.8%
                    </span>
                  </div>
                </div>

              </div>

              {/* 2. DUAL BALANCED ANALYTICAL PANELS (MAP + SPEND HORIZON AREA CURVE) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                
                {/* Left Panel: Global Disruption WorldMap (7 Columns / ~58%) */}
                <div className="lg:col-span-7 border border-[#EAEAEA] dark:border-[#262626] rounded-2xl overflow-hidden bg-[#0C0F17] relative shadow-inner">
                  <WorldMap />
                </div>

                {/* Right Panel: Spend Horizon Area Curve (5 Columns / ~42%) */}
                <div className="lg:col-span-5 border border-[#EAEAEA] dark:border-[#262626] rounded-2xl p-6 sm:p-7 space-y-5 bg-white dark:bg-[#141414] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wider block">Spend Protected</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">$120,384.<span className="text-secondary-400">86</span></span>
                        <span className="text-xs font-bold text-[#DC2626]">↘ 2% vs last week</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F5F5F5] dark:bg-[#1F1F1F] p-1 rounded-xl text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded-lg text-secondary-500">Day</span>
                      <span className="px-2 py-0.5 rounded-lg text-secondary-500">Wk</span>
                      <span className="px-2 py-0.5 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-secondary-900 font-bold shadow-xs">Mo</span>
                      <span className="px-2 py-0.5 rounded-lg text-secondary-500">Yr</span>
                    </div>
                  </div>

                  {/* SVG Layered Area Curve */}
                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="peachGradient1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF713B" stopOpacity="0.45"/>
                          <stop offset="100%" stopColor="#FFF4ED" stopOpacity="0.0"/>
                        </linearGradient>
                        <linearGradient id="peachGradient2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F4511E" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#FF713B" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="45" x2="500" y2="45" stroke="#F0F0F0" strokeDasharray="4 4" strokeWidth="1"/>
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#F0F0F0" strokeDasharray="4 4" strokeWidth="1"/>
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#F0F0F0" strokeDasharray="4 4" strokeWidth="1"/>
                      <path d="M0,150 Q100,120 200,95 T400,50 T500,75 L500,180 L0,180 Z" fill="url(#peachGradient1)"/>
                      <path d="M0,170 Q120,140 220,115 T380,65 T500,90 L500,180 L0,180 Z" fill="url(#peachGradient2)"/>
                      <path d="M0,170 Q120,140 220,115 T380,65 T500,90" fill="none" stroke="#F4511E" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="380" cy="65" r="5" fill="#FFFFFF" stroke="#F4511E" strokeWidth="3"/>
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-xs text-secondary-500 pt-2 border-t border-[#F0F0F0] dark:border-[#222222]">
                    <span>Taiwan Seismic</span>
                    <span>BIS Export</span>
                    <span>Infineon Lead</span>
                    <span>TI Sourced</span>
                  </div>
                </div>

              </div>

              {/* 2. RISK INTELLIGENCE SECTION: MAP AS MAJOR VISUAL FOCAL POINT (68% / 32% ASYMMETRIC SPLIT) */}
              <div className="space-y-4 pt-4 border-t border-[#EAEAEA] dark:border-[#222222]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="w-5 h-5 text-primary-500" />
                    <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">
                      Global Disruption Intelligence & Semiconductor Hubs
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold text-xs border border-primary-200 dark:border-primary-800/40">
                      20+ Nodes Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-400 font-semibold hidden sm:inline">Camera Focus:</span>
                    <button className="px-3 py-1 text-xs font-bold rounded-lg border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#161616] text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-2xs transition-colors">
                      APAC Silicon
                    </button>
                    <button className="px-3 py-1 text-xs font-bold rounded-lg border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#161616] text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-2xs transition-colors">
                      EMEA Auto
                    </button>
                    <button className="px-3 py-1 text-xs font-bold rounded-lg border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#161616] text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-2xs transition-colors">
                      Americas Analog
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: Major Global Map Visual Container (8 Columns / 68%) */}
                  <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#EAEAEA] dark:border-[#262626] bg-[#0C0F17] relative shadow-inner">
                    <WorldMap />
                  </div>

                  {/* Right: Contextual Regional Risk Summary (4 Columns / 32%) */}
                  <div className="lg:col-span-4 bg-[#FAFAFA] dark:bg-[#161616] rounded-2xl border border-[#EAEAEA] dark:border-[#262626] p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-1">
                        Contextual Regional Risk
                      </h4>
                      <p className="text-sm font-bold text-secondary-900 dark:text-white">
                        Active Fab Clusters Exposure
                      </p>
                    </div>

                    <div className="space-y-3">
                      
                      {/* Regional Card 1: APAC */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-[#111111] border border-[#EAEAEA] dark:border-[#262626] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-secondary-900 dark:text-white">East Asia Silicon Corridor</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] dark:bg-red-950/40 dark:text-red-400 border border-[#FEE2E2] dark:border-red-900/40">
                            Critical Exposure
                          </span>
                        </div>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-snug">
                          TSMC Fab 18 wafer logistics delayed due to M6.4 seismic event. STM32 and MCU lead times extended to 18 weeks.
                        </p>
                        <div className="mt-2 text-xs font-mono font-bold text-[#DC2626] dark:text-red-400">
                          Revenue at risk: $1,575,000 / day
                        </div>
                      </div>

                      {/* Regional Card 2: EMEA */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-[#111111] border border-[#EAEAEA] dark:border-[#262626] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-secondary-900 dark:text-white">Central Europe Automotive Hub</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-400 border border-[#FEF3C7] dark:border-amber-900/40">
                            Moderate Risk
                          </span>
                        </div>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-snug">
                          Dresden power semiconductor allocation tight. 2 Tier-1 harness plants re-routed.
                        </p>
                        <div className="mt-2 text-xs font-mono font-bold text-[#D97706] dark:text-amber-400">
                          Revenue at risk: $540,000 / day
                        </div>
                      </div>

                      {/* Regional Card 3: Americas */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-[#111111] border border-[#EAEAEA] dark:border-[#262626] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-secondary-900 dark:text-white">Americas Analog & Sensors</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-400 border border-[#DCFCE7] dark:border-emerald-900/40">
                            Stable Sourcing
                          </span>
                        </div>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-snug">
                          Texas Instruments and NXP Dallas lines running at 98.2% baseline inventory buffer.
                        </p>
                      </div>

                    </div>

                    <div className="pt-2 border-t border-[#EAEAEA] dark:border-[#222222]">
                      <Link 
                        href="/network"
                        className="w-full py-2.5 bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-secondary-800 border border-[#EAEAEA] dark:border-[#262626] text-xs font-bold text-secondary-900 dark:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        Open Global Network Directory <ChevronRight className="w-3.5 h-3.5 text-secondary-400" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. DISRUPTION MONITORING & LIVE MULTI-SOURCE SIGNALS STREAM */}
              <div className="space-y-5 pt-4 border-t border-[#EAEAEA] dark:border-[#222222]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-secondary-900 dark:text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-primary-500" /> Multi-Source Disruption Stream
                    </h3>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      Deterministic signal correlation with institutional registries (SEC, BIS, USGS, Reuters)
                    </p>
                  </div>

                  {/* Source Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-secondary-100 dark:bg-[#161616] p-1.5 rounded-xl border border-[#EAEAEA] dark:border-[#262626]">
                    {[
                      { id: 'ALL', label: 'All Signals' },
                      { id: 'SEC_IR', label: 'SEC / IR' },
                      { id: 'FED_REGISTER_BIS', label: 'BIS Rules' },
                      { id: 'USGS_SEISMIC', label: 'USGS Sensor' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setFilterTier(t.id)}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                          filterTier === t.id
                            ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                            : 'bg-white dark:bg-[#111111] text-secondary-700 dark:text-secondary-300 border-[#EAEAEA] dark:border-[#262626] hover:border-[#D6D6D6]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKU Search Filter */}
                <div className="p-3 flex items-center gap-2.5 rounded-xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#141414] shadow-2xs">
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
                    className="flex-1 bg-transparent border-none text-xs outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
                  />
                  {newsSearchQuery && (
                    <button 
                      onClick={() => {
                        setNewsSearchQuery('');
                        setIsSearchingNews(false);
                        fetchNews();
                      }} 
                      className="text-xs font-bold text-secondary-400 hover:text-red-500 transition-colors uppercase px-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Signal Stream Cards Grid */}
                <div className="space-y-3.5">
                  {filteredSignals.map((news) => {
                    const badge = getSourceBadge(news.sourceTier);
                    const isSelected = activeNews?.id === news.id;

                    return (
                      <div 
                        key={news.id} 
                        onClick={() => {
                          if (!loading) {
                            setStage(0); 
                            setDetectResult(null); 
                            setImpactResult(null); 
                            setMatchResult(null); 
                            setNegotiateResult(null); 
                            setApproved(false); 
                            setAribaResponse(null); 
                            setAuditTrail([]);
                            setActiveNews(news);
                          }
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
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

                          <h4 className="text-sm sm:text-base font-bold text-secondary-900 dark:text-white leading-snug">
                            {news.title}
                          </h4>

                          <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed">
                            {news.description}
                          </p>

                          {news.verifiedUrl && news.verifiedUrl !== '#' && (
                            <div className="pt-1">
                              <a 
                                href={news.verifiedUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
                              >
                                <FileText className="w-3 h-3" /> View Verified Source Registry <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}
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

              {/* 4. AI RECOMMENDATIONS & AUTONOMOUS DECISION CENTER (RENDERED DURING/AFTER TRIAGE) */}
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
                              className="w-full py-2.5 bg-white dark:bg-[#161616] hover:bg-secondary-50 border border-[#EAEAEA] dark:border-[#262626] text-xs font-bold text-secondary-900 dark:text-white rounded-xl transition-all flex items-center justify-center gap-2"
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
                              <td className="p-3.5 text-primary-600 dark:text-primary-400">STM32F401RBT6TR</td>
                              <td className="p-3.5 font-sans">Mouser Electronics</td>
                              <td className="p-3.5 text-emerald-600 dark:text-emerald-400">3 Days</td>
                              <td className="p-3.5">14,200 pcs</td>
                              <td className="p-3.5 text-secondary-400">$6.26</td>
                              <td className="p-3.5 text-emerald-600 dark:text-emerald-400">$5.80</td>
                              <td className="p-3.5 text-right font-sans">
                                <span className="px-2.5 py-1 rounded bg-primary-500 text-white text-[10px] font-bold">
                                  Optimal #1
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3.5 text-secondary-900 dark:text-white">STM32F401CCU6TR</td>
                              <td className="p-3.5 font-sans">Mouser Electronics</td>
                              <td className="p-3.5">3 Days</td>
                              <td className="p-3.5">8,500 pcs</td>
                              <td className="p-3.5 text-secondary-400">$6.70</td>
                              <td className="p-3.5 text-emerald-600 dark:text-emerald-400">$6.15</td>
                              <td className="p-3.5 text-right font-sans">
                                <span className="px-2.5 py-1 rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 text-[10px] font-bold">
                                  Alternate
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Cryptographic Audit Log */}
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

            </div>

          </div>

        </main>
      </div>

      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={matchResult || detectResult} />
    </div>
  );
}
