import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Activity, AlertTriangle, ShieldCheck, Cpu, Box, 
  Search, MessageSquare, CheckCircle, Clock, Zap,
  Menu, Bell, User, LayoutDashboard, Database, Settings, ShieldAlert, RefreshCw, ArrowRight,
  ExternalLink, Layers, Radio, Globe as GlobeIcon, FileText, Check
} from 'lucide-react';
import events from '../data/events.json';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
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

    // Auto-scroll to top so user immediately sees threat analysis results
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      threatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    
    // 1. Detect (Entity Extraction + Private Deterministic BOM Correlation)
    const r1 = await fetch('/api/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newsArticle })
    });
    const d1 = await r1.json();
    setDetectResult(d1);

    // Ensure screen is scrolled to show threat diagnosis
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      threatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

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

    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    
    // We stop at Stage 3. The user opens the Decision Center for approval.
    addAudit('System', 'Analysis complete. Awaiting human decision in Decision Center.');
    
    // Create the disruption payload to pass to the decision center
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
    
    const current = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
    localStorage.setItem('custom_disruptions', JSON.stringify([newRecord, ...current]));
    
    setMatchResult(newRecord);
  };

  const getSourceBadge = (tier) => {
    switch(tier) {
      case 'SEC_EDGAR':
        return { label: 'SEC EDGAR (10-K/8-K)', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30' };
      case 'OFFICIAL_IR':
        return { label: 'Official IR (Non-U.S.)', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30' };
      case 'FED_REGISTER_BIS':
        return { label: 'Federal Register (BIS)', color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' };
      case 'USGS_SEISMIC':
        return { label: 'USGS Seismic Sensor', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30' };
      case 'NEWS_BASELINE':
        return { label: 'Media Wire Baseline', color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30' };
      default:
        return { label: 'Primary Disclosure', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30' };
    }
  };

  const filteredSignals = liveNews.filter(s => {
    if (filterTier === 'ALL') return true;
    if (filterTier === 'SEC_IR') return s.sourceTier === 'SEC_EDGAR' || s.sourceTier === 'OFFICIAL_IR';
    return s.sourceTier === filterTier;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head>
        <title>SentinelChain | Multi-Source Supply Chain Command Center</title>
      </Head>

      <Sidebar />

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6 pb-24">
          
          {/* SAP CONNECTION STATUS & SYSTEM HEALTH */}
          {/* SAP CONNECTION STATUS & SYSTEM HEALTH */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex flex-wrap gap-3">
              <div className="glass-panel px-4 py-2 flex flex-col gap-0.5">
                <span className="text-[9.5px] text-slate-500 dark:text-gray-400 uppercase font-extrabold tracking-wider">SIGNAL LAYER</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE MULTI-SOURCE ({liveNews.length} Signals)
                </span>
              </div>
              <div className="glass-panel px-4 py-2 flex flex-col gap-0.5" title="SAP S/4HANA Cloud OData Service">
                <span className="text-[9.5px] text-slate-500 dark:text-gray-400 uppercase font-extrabold tracking-wider">SAP S/4HANA</span>
                <span className={`text-xs font-bold ${sapStatus.s4hana === 'Connected' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-gray-400'}`}>● {sapStatus.s4hana}</span>
              </div>
              <div className="glass-panel px-4 py-2 flex flex-col gap-0.5" title="SAP Ariba Procurement Engine">
                <span className="text-[9.5px] text-slate-500 dark:text-gray-400 uppercase font-extrabold tracking-wider">SAP Ariba</span>
                <span className={`text-xs font-bold ${sapStatus.ariba === 'Connected' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-gray-400'}`}>● {sapStatus.ariba}</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider shadow-2xs ${sapStatus.mode === 'LIVE SAP MODE' ? 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400' : 'border-indigo-300 dark:border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400'}`}>
              Multi-Source Intelligence Active
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Autonomous Supply Chain Recovery</h1>
              <p className="text-slate-600 dark:text-gray-400 text-sm mt-1 font-medium">Multi-Source Signal Layer → Deterministic BOM Correlation → Spot Market Sourcing → SAP Execution</p>
            </div>
            <div className="flex items-center gap-2">
              {(loading || stage > 0) && (
                <button 
                  onClick={() => { setStage(0); setDetectResult(null); setImpactResult(null); setMatchResult(null); setNegotiateResult(null); setApproved(false); setAribaResponse(null); setAuditTrail([]); setActiveNews(null); }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200 dark:border-white/10 shadow-xs"
                >
                  Reset Pipeline
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* LEFT COLUMN: MULTI-SOURCE SIGNAL FEED */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500" /> Multi-Source Signals
                </h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => fetchNews(newsSearchQuery)} 
                    disabled={isRefreshing}
                    className={`text-gray-400 hover:text-emerald-500 transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    title="Refresh Signals"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
                  </button>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                  </span>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="glass-panel p-2 flex items-center gap-2 border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-black/20">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
                  className="flex-1 bg-transparent border-none text-xs outline-none text-gray-900 dark:text-white placeholder-gray-500"
                />
                {newsSearchQuery && (
                  <button 
                    onClick={() => {
                      setNewsSearchQuery('');
                      setIsSearchingNews(false);
                      fetchNews();
                    }} 
                    className="text-[10px] font-bold text-gray-400 hover:text-red-400 transition-colors uppercase px-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* QUICK SKU SCANNER */}
              <div className="space-y-1.5 py-0.5">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">Quick SKU Exposure Scan:</span>
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
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-white text-indigo-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 dark:hover:bg-indigo-500/20'
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
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-white/5 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        activeNews?.id === news.id 
                          ? 'bg-indigo-50/95 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20' 
                          : 'bg-white dark:bg-[#0f1115]/60 border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-white/30 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-slate-400" /> {new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug mb-2.5">
                        {news.title}
                      </h3>

                      <div className="flex items-center justify-between text-[10px] mb-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Confidence: {news.evidenceConfidence}%
                        </span>
                        <span className="font-mono text-slate-500 dark:text-gray-400">
                          {news.sourceTier || 'OFFICIAL'}
                        </span>
                      </div>

                      {news.verifiedUrl && news.verifiedUrl !== '#' && (
                        <div className="mb-3">
                          <a 
                            href={news.verifiedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                          >
                            <FileText className="w-3 h-3" /> View Source Document <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}

                      {activeNews?.id === news.id && stage === 0 && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); simulatePipeline(news); }}
                           className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                         >
                           <Search className="w-3.5 h-3.5" /> Correlate with SAP BOM
                         </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: PIPELINE & VISUALIZATION */}
            <div ref={threatSectionRef} id="threat-section" className="lg:col-span-3 space-y-6">

              {/* 3D GLOBE VISUALIZATION (Stage 0) */}
              {stage === 0 && (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <WorldMap />
                </div>
              )}

              {/* STAGE PROGRESS INDICATOR */}
              {stage > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${stage >= 1 ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-500/50 shadow-2xs' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Entity Extraction</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Public Signal → BOM</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${stage >= 2 ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-500/50 shadow-2xs' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">SAP BOM Explosion</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Revenue at Risk</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${stage >= 3 ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-500/50 shadow-2xs' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Spot Sourcing</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Decision Center Ready</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DETECTION RESULT UI */}
              {stage > 0 && detectResult && (
                detectResult.isDisruption ? (
                  <div className="glass-panel border-red-300 dark:border-red-500/50 bg-red-50/70 dark:bg-red-950/20 p-0 overflow-hidden shadow-sm animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-red-100/90 dark:bg-red-900/30 px-6 py-4 flex flex-wrap items-center justify-between border-b border-red-200 dark:border-red-500/20 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-500/20 flex items-center justify-center text-red-700 dark:text-red-400">
                           <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-base font-black text-red-950 dark:text-white tracking-wide">CRITICAL DISRUPTION IDENTIFIED</h2>
                          <p className="text-[10.5px] font-medium text-red-800/80 dark:text-gray-300">Deterministic correlation between public signal and internal SAP BOM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest bg-red-600 text-white font-extrabold px-3 py-1 rounded-full shadow-2xs">
                          Severity: {detectResult.severity?.toUpperCase() || 'HIGH'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-[10.5px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-2">Public Signal Diagnostic Summary</h3>
                          <p className="text-slate-800 dark:text-gray-200 text-sm leading-relaxed bg-white dark:bg-black/40 p-4 rounded-xl border border-red-100 dark:border-white/5 shadow-2xs">
                            {detectResult.reason}
                          </p>
                        </div>

                        {/* Correlation Architecture Box */}
                        <div className="p-3.5 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-2 text-xs shadow-2xs">
                          <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-400 tracking-wider">Correlation Pipeline Proof</p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-gray-400">Public Entity Extracted:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{detectResult.correlationDetails?.publicEntityExtracted || 'Semiconductor Foundry Node'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-gray-400">Correlated Private BOM Part:</span>
                            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">{detectResult.partNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-gray-400">Evidence Confidence:</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">{detectResult.evidenceConfidence || 88}% (Tier-Weighted)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-gray-400">Primary Source Tier:</span>
                            <span className="font-bold text-indigo-700 dark:text-indigo-400">{detectResult.sourceTier || 'OFFICIAL_TELEMETRY'}</span>
                          </div>
                          {detectResult.verifiedUrl && detectResult.verifiedUrl !== '#' && (
                            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex justify-end">
                              <a 
                                href={detectResult.verifiedUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                View Verified Source Document on Official Registry <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4 md:border-l md:border-slate-200 dark:border-white/10 md:pl-6">
                         <div>
                           <h3 className="text-[10.5px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Impacted BOM Component</h3>
                           <div className="inline-flex items-center gap-2 font-mono text-sm text-indigo-900 dark:text-indigo-200 font-bold bg-indigo-50 dark:bg-indigo-950/50 px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 shadow-2xs">
                             <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                             {detectResult.partNumber}
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[10.5px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Disruption Classification</h3>
                           <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide">{detectResult.disruptionType || 'Operational Constraint'}</p>
                         </div>
                         <div>
                           <h3 className="text-[10.5px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Evidence Confidence Score</h3>
                           <div className="flex items-center gap-2 mt-1">
                             <div className="flex-1 bg-slate-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${detectResult.evidenceConfidence || 90}%` }}></div>
                             </div>
                             <span className="text-xs text-slate-900 dark:text-white font-extrabold">{detectResult.evidenceConfidence || 90}%</span>
                           </div>
                           <p className="text-[9.5px] font-medium text-slate-500 dark:text-gray-400 mt-1">Computed deterministically from source-tier weights</p>
                         </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/10 p-0 overflow-hidden shadow-sm animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-emerald-100/90 dark:bg-emerald-900/20 px-6 py-4 flex items-center gap-3 border-b border-emerald-200 dark:border-emerald-500/20">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                         <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-black text-emerald-950 dark:text-white tracking-wide">SIGNAL DISMISSED (NON-CRITICAL)</h2>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-2">Diagnostic Assessment</h3>
                      <p className="text-slate-800 dark:text-gray-200 text-sm leading-relaxed bg-white dark:bg-black/40 p-4 rounded-xl border border-emerald-100 dark:border-white/5 shadow-2xs">
                        {detectResult.reason}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* IMPACT RESULT UI (Stage >= 2) */}
              {stage >= 2 && impactResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_0.3s_ease-out]">
                  <div className="glass-panel p-5 border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#0f1115]/80">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">SAP S/4HANA Revenue Exposure</p>
                    <p className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
                      ${impactResult.revenueAtRiskPerDay?.toLocaleString() || '0'}<span className="text-xs text-slate-500 dark:text-gray-400 font-semibold"> / day</span>
                    </p>
                    <p className="text-[10.5px] font-medium text-slate-500 dark:text-gray-400 mt-2">Calculated from ERP Bill of Materials and active assembly line throughput</p>
                  </div>
                  <div className="glass-panel p-5 border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#0f1115]/80">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">Affected Assembly Lines</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {impactResult.affectedProducts?.map((prod, idx) => (
                        <span key={idx} className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DECISION CENTER CALLOUT (Stage >= 3) */}
              {stage >= 3 && matchResult && (
                <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/80 dark:bg-indigo-950/20 shadow-sm animate-[fadeIn_0.3s_ease-out] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-indigo-600 text-white shadow-2xs">
                      Decision Required
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">Autonomous Recovery Options Formulated</h3>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl font-medium">
                      Mouser spot market inventory and internal SAP STO options are calculated. Open Decision Center to review the impact tree and authorize autonomous procurement.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowPrModal(true)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-gray-200 dark:border-white/10 flex items-center gap-2 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" /> Export SAP PR Dossier
                    </button>
                    <Link
                      href={`/disruptions/${matchResult.disruption_id || 'DSP-LIVE-1001'}`}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2 transition-all"
                    >
                      Open Decision Center <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* AUDIT TRAIL LOG */}
              {auditTrail.length > 0 && (
                <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/10 space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Database className="w-3 h-3" /> System Audit Trail
                  </p>
                  <div className="space-y-1.5 font-mono text-[11px] max-h-40 overflow-y-auto pr-2">
                    {auditTrail.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <span className="text-gray-400 shrink-0">{new Date(log.time).toLocaleTimeString()}</span>
                        <span className="text-indigo-400 font-bold shrink-0">[{log.source}]</span>
                        <span className="text-gray-900 dark:text-gray-300">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={matchResult || detectResult} />
    </div>
  );
}
