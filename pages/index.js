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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>SentinelChain | Autonomous Supply Chain Risk Management & Resilience</title>
        <meta name="description" content="AI-powered Supply Chain Risk Management (SCRM) and Resilience platform for electronics manufacturing." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-8 pb-24 min-w-0">
          
          {/* ======================================================== */}
          {/* SECTION B: SCALIX EDITORIAL HERO & 2x2 METRIC GRID       */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#E8E8E8] dark:border-[#222222] pb-10">
            {/* Left Column: Two-line editorial title & CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/40 text-[10.5px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                AI-Powered Supply Chain Resilience
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary-900 dark:text-white leading-[1.15]">
                Understand your <span className="italic text-primary-500 font-serif">supply chain</span>.<br className="hidden sm:inline" />
                Decide faster with AI.
              </h1>

              <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Real-time disruption intelligence with deterministic BOM correlation, live Mouser spot sourcing, and autonomous SAP Ariba recovery.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => {
                    if (liveNews.length > 0) simulatePipeline(liveNews[0]);
                  }}
                  className="btn-primary gap-2 shadow-sm font-semibold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  Analyze Active Signal
                </button>

                <Link href="/disruptions" className="btn-secondary gap-2 text-xs uppercase tracking-wider font-semibold">
                  Disruptions Feed <ArrowRight className="w-3.5 h-3.5" />
                </Link>

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
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white bg-white dark:bg-[#161616] hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-all border border-[#E8E8E8] dark:border-[#222222]"
                  >
                    Reset Pipeline
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: 2x2 Clean KPI Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-[#E8E8E8] dark:bg-[#222222] rounded-xl overflow-hidden border border-[#E8E8E8] dark:border-[#222222] shadow-2xs">
              <div className="bg-white dark:bg-[#111111] p-5 flex flex-col justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                  $84.5M+
                </span>
                <span className="text-[11px] font-medium text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                  Revenue exposure tracked in real time
                </span>
              </div>

              <div className="bg-white dark:bg-[#111111] p-5 flex flex-col justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                  32,490+
                </span>
                <span className="text-[11px] font-medium text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                  Global supply nodes monitored
                </span>
              </div>

              <div className="bg-white dark:bg-[#111111] p-5 flex flex-col justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                  &lt; 2 min
                </span>
                <span className="text-[11px] font-medium text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                  Time to actionable mitigation
                </span>
              </div>

              <div className="bg-white dark:bg-[#111111] p-5 flex flex-col justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary-500 tracking-tight">
                  Autonomous
                </span>
                <span className="text-[11px] font-medium text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                  Decisions & Ariba PR execution
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION C: SCALIX GRADIENT CONTAINER & DASHBOARD PREVIEW */}
          {/* ======================================================== */}
          <div className="relative rounded-2xl overflow-hidden p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#F7C9B9] via-[#F28A62] to-[#080808] dark:from-[#3a180e] dark:via-[#1c0d08] dark:to-[#080808] border border-[#E8E8E8] dark:border-[#222222] shadow-card dark:shadow-dark-card">
            
            {/* Top Container Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/60 flex items-center justify-center shadow-2xs">
                  <img src="/shield.png" alt="Shield" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Executive Command Center</span>
                  <span className="text-[10px] text-white/80 font-medium">Real-time Telemetry & Exposure Metrics</span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Protection</span>
              </div>
            </div>

            {/* Floating White/Dark Dashboard Preview Card */}
            <div className="bg-white dark:bg-[#111111] rounded-xl border border-white/50 dark:border-white/10 shadow-2xl p-5 sm:p-6 transition-all duration-300">
              
              {/* Segmented Subnav / Header Bar inside preview */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
                    Overview
                  </span>
                  <Link href="/disruptions" className="px-3 py-1 rounded-lg text-secondary-500 hover:text-secondary-900 dark:hover:text-white text-xs font-medium transition-colors">
                    Disruptions
                  </Link>
                  <Link href="/plans" className="px-3 py-1 rounded-lg text-secondary-500 hover:text-secondary-900 dark:hover:text-white text-xs font-medium transition-colors">
                    Plans
                  </Link>
                  <Link href="/network" className="px-3 py-1 rounded-lg text-secondary-500 hover:text-secondary-900 dark:hover:text-white text-xs font-medium transition-colors">
                    Network
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-secondary-400 dark:text-secondary-500">Live Telemetry:</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Operational
                  </span>
                </div>
              </div>

              {/* 4 Major KPI Cards (PART 8.2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1: Active Disruptions */}
                <div className="p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#161616] flex flex-col justify-between hover:border-primary-300 dark:hover:border-primary-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Active Disruptions</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Critical
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                      {liveNews.length > 0 ? liveNews.length : 12}
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary-400 dark:text-secondary-500">
                    3 high-impact semiconductor alerts
                  </span>
                </div>

                {/* KPI 2: Revenue at Risk */}
                <div className="p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#161616] flex flex-col justify-between hover:border-primary-300 dark:hover:border-primary-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Revenue at Risk</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 flex items-center gap-1">
                      Daily ERP
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                      $2.4M
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary-400 dark:text-secondary-500">
                    Mapped across 5 active plant lines
                  </span>
                </div>

                {/* KPI 3: Suppliers Monitored */}
                <div className="p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#161616] flex flex-col justify-between hover:border-primary-300 dark:hover:border-primary-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Suppliers Monitored</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 98.4%
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                      248
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary-400 dark:text-secondary-500">
                    Tier-1, Tier-2 & spot distributors
                  </span>
                </div>

                {/* KPI 4: Network Resilience Score */}
                <div className="p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#161616] flex flex-col justify-between hover:border-primary-300 dark:hover:border-primary-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Resilience Score</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40 flex items-center gap-1">
                      Target 95%
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-primary-500 tracking-tight">
                      94.2%
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary-400 dark:text-secondary-500">
                    +3.4% recovery velocity this quarter
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* SAP CONNECTION STATUS & SYSTEM HEALTH STRIP              */}
          {/* ======================================================== */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-4 px-5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] flex items-center gap-2">
                <span className="text-[10px] text-secondary-500 dark:text-secondary-400 uppercase font-bold tracking-wider">Signal Layer:</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Multi-Source ({liveNews.length})
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] flex items-center gap-2">
                <span className="text-[10px] text-secondary-500 dark:text-secondary-400 uppercase font-bold tracking-wider">SAP S/4HANA:</span>
                <span className={`text-xs font-bold ${sapStatus.s4hana === 'Connected' ? 'text-emerald-600 dark:text-emerald-400' : 'text-secondary-500 dark:text-secondary-400'}`}>
                  ● {sapStatus.s4hana}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] flex items-center gap-2">
                <span className="text-[10px] text-secondary-500 dark:text-secondary-400 uppercase font-bold tracking-wider">SAP Ariba:</span>
                <span className={`text-xs font-bold ${sapStatus.ariba === 'Connected' ? 'text-emerald-600 dark:text-emerald-400' : 'text-secondary-500 dark:text-secondary-400'}`}>
                  ● {sapStatus.ariba}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-200 dark:border-primary-800/40 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              {sapStatus.mode || 'Multi-Source Intelligence Active'}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MAIN DASHBOARD: SIGNALS FEED + RISK CENTER / WORLD MAP    */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* LEFT COLUMN: MULTI-SOURCE SIGNAL FEED */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary-500" /> Multi-Source Signals
                </h2>
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => fetchNews(newsSearchQuery)} 
                    disabled={isRefreshing}
                    className={`text-secondary-400 hover:text-primary-500 transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    title="Refresh Signals"
                    aria-label="Refresh signals"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary-500' : ''}`} />
                  </button>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                  </span>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="p-2.5 flex items-center gap-2 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] shadow-2xs">
                <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                <input 
                  type="text"
                  placeholder="Filter SEC, BIS, USGS, or Part..."
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
                    className="text-[10px] font-bold text-secondary-400 hover:text-red-500 transition-colors uppercase px-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* QUICK SKU SCANNER */}
              <div className="space-y-1.5 py-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-secondary-400 dark:text-secondary-500">Quick SKU Exposure Scan:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['STM32F401RE', 'TPS54331DR', 'BMI270', 'XC7Z020', 'GPU-A100-80'].map((sku) => (
                    <button
                      key={sku}
                      onClick={() => {
                        setNewsSearchQuery(sku);
                        setIsSearchingNews(true);
                        fetchNews(sku);
                      }}
                      className={`px-2.5 py-1 text-[9.5px] font-mono font-bold rounded-lg border transition-all ${
                        newsSearchQuery === sku 
                          ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                          : 'bg-white text-secondary-700 border-[#E8E8E8] hover:bg-primary-50 hover:border-primary-200 dark:bg-[#111111] dark:text-secondary-300 dark:border-[#222222] dark:hover:bg-[#181818]'
                      }`}
                    >
                      {sku}
                    </button>
                  ))}
                </div>
              </div>

              {/* SOURCE TIER FILTER TABS */}
              <div className="flex flex-wrap gap-1.5 py-1">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'SEC_IR', label: 'SEC / IR' },
                  { id: 'FED_REGISTER_BIS', label: 'BIS Rules' },
                  { id: 'USGS_SEISMIC', label: 'USGS' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFilterTier(t.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      filterTier === t.id
                        ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                        : 'bg-white dark:bg-[#111111] text-secondary-700 dark:text-secondary-300 border-[#E8E8E8] dark:border-[#222222] hover:border-[#D6D6D6] dark:hover:border-[#333333]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* SIGNAL CARDS */}
              <div className="space-y-3">
                {filteredSignals.map((news) => {
                  const badge = getSourceBadge(news.sourceTier);
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
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        activeNews?.id === news.id 
                          ? 'bg-primary-50/70 dark:bg-primary-950/20 border-primary-400 dark:border-primary-500/50 shadow-sm ring-1 ring-primary-500/30' 
                          : 'bg-white dark:bg-[#111111] border-[#E8E8E8] dark:border-[#222222] hover:border-primary-200 dark:hover:border-primary-500/30 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-medium text-secondary-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-secondary-400" /> {new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-secondary-900 dark:text-white leading-snug mb-2">
                        {news.title}
                      </h3>

                      <div className="flex items-center justify-between text-[10px] mb-2.5 pt-2 border-t border-[#E8E8E8] dark:border-[#222222]">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Confidence: {news.evidenceConfidence}%
                        </span>
                        <span className="font-mono text-secondary-400">
                          {news.sourceTier || 'OFFICIAL'}
                        </span>
                      </div>

                      {news.verifiedUrl && news.verifiedUrl !== '#' && (
                        <div className="mb-2.5">
                          <a 
                            href={news.verifiedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                          >
                            <FileText className="w-3 h-3" /> View Source Document <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}

                      {activeNews?.id === news.id && stage === 0 && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); simulatePipeline(news); }}
                           className="w-full flex items-center justify-center gap-2 btn-primary !h-9 text-xs font-bold uppercase tracking-wider shadow-2xs mt-2"
                         >
                           <Search className="w-3.5 h-3.5" /> Correlate with SAP BOM
                         </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: WORLD MAP & PIPELINE EXECUTION */}
            <div ref={threatSectionRef} id="threat-section" className="lg:col-span-3 space-y-6">

              {/* 3D GLOBE VISUALIZATION (Stage 0) */}
              {stage === 0 && (
                <div className="space-y-4">
                  <WorldMap />

                  {/* AI Recommendation & Executive Briefing Card (PART 8.6) */}
                  <div className="p-5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] shadow-2xs">
                    <div className="flex items-center justify-between mb-3 border-b border-[#E8E8E8] dark:border-[#222222] pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        <h3 className="text-xs font-bold text-secondary-900 dark:text-white uppercase tracking-wider">
                          AI Sentinel Executive Briefing
                        </h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                        Automated Summary
                      </span>
                    </div>

                    <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed mb-3">
                      SentinelChain is actively correlating institutional telemetry against your SAP S/4HANA bill of materials. Selecting any signal on the left will run entity extraction, explode affected production lines, calculate daily revenue at risk, and discover verified Mouser spot alternatives.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626]">
                        <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider block">Target Silicon</span>
                        <span className="text-xs font-bold text-secondary-900 dark:text-white mt-0.5 block">STM32 / TPS / BMI</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626]">
                        <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider block">Lead Time Window</span>
                        <span className="text-xs font-bold text-secondary-900 dark:text-white mt-0.5 block">3 - 5 Business Days</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626]">
                        <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider block">Ariba PR Automation</span>
                        <span className="text-xs font-bold text-primary-500 mt-0.5 block">Guarded Auto-Dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE PROGRESS INDICATOR */}
              {stage > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${stage >= 1 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#111111] border-[#E8E8E8] dark:border-[#222222]'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 1 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>1</div>
                    <div>
                      <p className="text-xs font-bold text-secondary-900 dark:text-white">Entity Extraction</p>
                      <p className="text-[10px] text-secondary-400">Public Signal → BOM</p>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${stage >= 2 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#111111] border-[#E8E8E8] dark:border-[#222222]'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 2 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>2</div>
                    <div>
                      <p className="text-xs font-bold text-secondary-900 dark:text-white">SAP BOM Explosion</p>
                      <p className="text-[10px] text-secondary-400">Revenue at Risk</p>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${stage >= 3 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#111111] border-[#E8E8E8] dark:border-[#222222]'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 3 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>3</div>
                    <div>
                      <p className="text-xs font-bold text-secondary-900 dark:text-white">Spot Sourcing</p>
                      <p className="text-[10px] text-secondary-400">Decision Ready</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DETECTION RESULT UI */}
              {stage > 0 && detectResult && (
                detectResult.isDisruption ? (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-[#111111] overflow-hidden shadow-2xs">
                    <div className="bg-red-50 dark:bg-red-950/30 px-6 py-4 flex flex-wrap items-center justify-between border-b border-red-200/80 dark:border-red-900/40 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                           <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-red-900 dark:text-red-300 tracking-wide">CRITICAL DISRUPTION IDENTIFIED</h2>
                          <p className="text-[10.5px] font-medium text-red-700/80 dark:text-secondary-400">Deterministic correlation between public signal and internal SAP BOM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-2xs">
                          Severity: {detectResult.severity?.toUpperCase() || 'HIGH'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-[10.5px] font-bold text-secondary-500 uppercase tracking-wider mb-2">Public Signal Diagnostic Summary</h3>
                          <p className="text-secondary-800 dark:text-secondary-200 text-xs sm:text-sm leading-relaxed bg-[#F8F9FA] dark:bg-[#161616] p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222]">
                            {detectResult.reason}
                          </p>
                        </div>

                        {/* Correlation Architecture Box */}
                        <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#161616] rounded-xl border border-[#E8E8E8] dark:border-[#222222] space-y-2 text-xs">
                          <p className="text-[10px] font-bold uppercase text-secondary-400 tracking-wider">Correlation Pipeline Proof</p>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-500 dark:text-secondary-400">Public Entity Extracted:</span>
                            <span className="font-bold text-secondary-900 dark:text-white">{detectResult.correlationDetails?.publicEntityExtracted || 'Semiconductor Foundry Node'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-500 dark:text-secondary-400">Correlated Private BOM Part:</span>
                            <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{detectResult.partNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-500 dark:text-secondary-400">Evidence Confidence:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{detectResult.evidenceConfidence || 88}% (Tier-Weighted)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-500 dark:text-secondary-400">Primary Source Tier:</span>
                            <span className="font-bold text-secondary-900 dark:text-white">{detectResult.sourceTier || 'OFFICIAL_TELEMETRY'}</span>
                          </div>
                          {detectResult.verifiedUrl && detectResult.verifiedUrl !== '#' && (
                            <div className="pt-2 border-t border-[#E8E8E8] dark:border-[#222222] flex justify-end">
                              <a 
                                href={detectResult.verifiedUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10.5px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline flex items-center gap-1"
                              >
                                View Verified Source Document on Official Registry <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4 md:border-l md:border-[#E8E8E8] dark:md:border-[#222222] md:pl-6">
                         <div>
                           <h3 className="text-[10.5px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Impacted BOM Component</h3>
                           <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-primary-700 dark:text-primary-300 font-bold bg-primary-50 dark:bg-primary-950/40 px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-800/40">
                             <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                             {detectResult.partNumber}
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[10.5px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Disruption Classification</h3>
                           <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">{detectResult.disruptionType || 'Operational Constraint'}</p>
                         </div>
                         <div>
                           <h3 className="text-[10.5px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Evidence Confidence Score</h3>
                           <div className="flex items-center gap-2 mt-1">
                             <div className="flex-1 bg-secondary-200 dark:bg-secondary-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${detectResult.evidenceConfidence || 90}%` }}></div>
                             </div>
                             <span className="text-xs text-secondary-900 dark:text-white font-bold">{detectResult.evidenceConfidence || 90}%</span>
                           </div>
                           <p className="text-[9.5px] font-medium text-secondary-400 mt-1">Computed deterministically from source-tier weights</p>
                         </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-[#111111] overflow-hidden shadow-2xs">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 px-6 py-4 flex items-center gap-3 border-b border-emerald-200/80 dark:border-emerald-800/40">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                         <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 tracking-wide">SIGNAL DISMISSED (NON-CRITICAL)</h2>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">Diagnostic Assessment</h3>
                      <p className="text-secondary-800 dark:text-secondary-200 text-xs sm:text-sm leading-relaxed bg-[#F8F9FA] dark:bg-[#161616] p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222]">
                        {detectResult.reason}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* IMPACT RESULT UI (Stage >= 2) */}
              {stage >= 2 && impactResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-1">SAP S/4HANA Revenue Exposure</p>
                    <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                      ${impactResult.revenueAtRiskPerDay?.toLocaleString() || '0'}<span className="text-xs text-secondary-400 font-semibold"> / day</span>
                    </p>
                    <p className="text-[10.5px] font-medium text-secondary-400 mt-2">Calculated from ERP Bill of Materials and active assembly line throughput</p>
                  </div>
                  <div className="p-5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-1">Affected Assembly Lines</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {impactResult.affectedProducts?.map((prod, idx) => (
                        <span key={idx} className="px-3 py-1.5 text-xs font-bold bg-[#F8F9FA] dark:bg-[#161616] text-secondary-800 dark:text-secondary-200 rounded-lg border border-[#E8E8E8] dark:border-[#262626]">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DECISION CENTER CALLOUT (Stage >= 3) */}
              {stage >= 3 && matchResult && (
                <div className="p-6 rounded-xl border border-primary-200 dark:border-primary-800/40 bg-white dark:bg-[#111111] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded-md bg-primary-500 text-white shadow-2xs">
                      Decision Formulated
                    </span>
                    <h3 className="text-base font-bold text-secondary-900 dark:text-white mt-2">Autonomous Recovery Options Ready</h3>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1 max-w-xl">
                      Mouser spot market inventory and internal SAP STO options are calculated. Open Decision Center to review technical spec comparisons and authorize autonomous procurement.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setShowPrModal(true)}
                      className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-[#E8E8E8] dark:border-[#262626] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary-500" /> Export PR Dossier
                    </button>
                    <Link
                      href={`/disruptions/${matchResult.disruption_id || 'DSP-LIVE-1001'}`}
                      className="btn-primary !h-10 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all"
                    >
                      Open Decision Center <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* AUDIT TRAIL LOG */}
              {auditTrail.length > 0 && (
                <div className="p-4 rounded-xl border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] space-y-2">
                  <p className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-primary-500" /> Cryptographic System Audit Trail
                  </p>
                  <div className="space-y-1.5 font-mono text-[11px] max-h-40 overflow-y-auto pr-2">
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
          </div>

        </main>
      </div>

      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={matchResult || detectResult} />
    </div>
  );
}
