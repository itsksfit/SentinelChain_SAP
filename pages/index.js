import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Activity, AlertTriangle, ShieldCheck, Cpu, Box, 
  Search, MessageSquare, CheckCircle, Clock, Zap,
  Menu, Bell, User, LayoutDashboard, Database, Settings, ShieldAlert, RefreshCw
} from 'lucide-react';
import events from '../data/events.json';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });

// --- MAIN PAGE ---

export default function Dashboard() {
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
  
  // SAP Integration State
  const [sapStatus, setSapStatus] = useState({ s4hana: 'Offline', ariba: 'Offline', mode: 'DEMO MODE' });
  const [auditTrail, setAuditTrail] = useState([]);
  const [aribaResponse, setAribaResponse] = useState(null);
  
  // Real-Time Intelligence State
  const [liveNews, setLiveNews] = useState([]);
  const [activeNews, setActiveNews] = useState(null);

  const fetchNews = () => {
    fetch('/api/news/latest').then(r => r.json()).then(news => {
      setLiveNews(news);
      setActiveNews(prev => prev || (news.length > 0 ? news[0] : null));
    });
  };

  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    fetch('/api/sap/status').then(r => r.json()).then(setSapStatus);
    fetchNews();
    // Auto-refresh the live disruption feed every 30 seconds only if idle
    const interval = setInterval(() => {
      if (stageRef.current === 0) {
        fetchNews();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const addAudit = (source, message) => {
    setAuditTrail(prev => [...prev, { time: new Date().toLocaleTimeString(), source, message }]);
  };

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll chat only if user hasn't manually scrolled up
  useEffect(() => {
    if (chatEndRef.current && (autoScroll || chatRevealIndex <= 1)) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatRevealIndex, negotiateResult, autoScroll]);

  const simulatePipeline = async (newsArticle) => {
    setLoading(true);
    setStage(1);
    setAuditTrail([]);
    setAribaResponse(null);
    setApproved(false);
    
    // 1. Detect
    const r1 = await fetch('/api/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newsArticle })
    });
    const d1 = await r1.json();
    setDetectResult(d1);
    addAudit('Detection Agent', `${d1.reason || "No relevant disruption classified"}`);
    
    if (!d1.isDisruption) {
      addAudit('System', 'Event deemed non-critical to known supply chain. Pipeline halted.');
      setLoading(false);
      return;
    }

    await new Promise(r => setTimeout(r, 1000));
    setStage(2);
    
    // 2. Impact
    const r2 = await fetch('/api/impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        partNumber: d1.partNumber,
        severity: d1.severity,
        confidence: d1.confidence
      })
    });
    const d2 = await r2.json();
    setImpactResult(d2);
    addAudit('SAP S/4HANA', `Material ${d1.partNumber} and BOM retrieved`);
    addAudit('Impact Agent', `${d2.affectedProducts.length} BOM dependencies identified`);

    await new Promise(r => setTimeout(r, 1200));
    setStage(3);

    // 3. Match
    const r3 = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partNumber: d1.partNumber })
    });
    const d3 = await r3.json();
    setMatchResult(d3);
    addAudit('Cross-Reference', `${d3.length} compatible alternatives found`);

    await new Promise(r => setTimeout(r, 1500));
    setStage(4);

    // 4. Negotiate
    const r4 = await fetch('/api/negotiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partNumber: d1.partNumber, options: d3 })
    });
    const d4 = await r4.json();
    setNegotiateResult(d4);
    
    setLoading(false);
    
    let index = 0;
    setChatRevealIndex(0);
    const interval = setInterval(() => {
      index++;
      setChatRevealIndex(index);
      if (index >= d4.chatLog.length) {
        clearInterval(interval);
        addAudit('Chase Agent', `Supplier quotes evaluated`);
        setTimeout(() => setStage(5), 1500);
      }
    }, 3500); 
  };

  const approvePlan = async () => {
    setApproved(true);
    addAudit('User', 'Recovery plan approved');
    
    const planDetails = negotiateResult.rankedPlan[0];
    const res = await fetch('/api/sap/recovery-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planDetails })
    });
    const data = await res.json();
    setAribaResponse(data);
    addAudit('SAP Ariba', 'Procurement workflow submitted');
    
    try {
      const activePlan = {
        id: `RP-${Math.floor(1000 + Math.random() * 9000)}`,
        trigger: activeNews?.title || "Live Disruption Detected",
        action: `Procure ${planDetails.part}`,
        vendor: planDetails.vendor,
        status: "Executing",
        riskReduction: planDetails.score.includes("Risk") ? "98%" : "94%",
        date: "Just Now",
        historyContext: `A severe disruption was detected affecting the primary supply chain. SentinelChain's Impact Agent dynamically calculated massive enterprise revenue at risk based on live SAP data. To mitigate this, the AI autonomously engaged ${planDetails.vendor} and negotiated the procurement of ${planDetails.quantity.toLocaleString()} alternative units (${planDetails.part}), successfully preserving the production pipeline.`
      };
      localStorage.setItem('sentinel_latest_plan', JSON.stringify(activePlan));
    } catch(e) {}
  };

  const getStageStatus = (currentStage, targetStage) => {
    if (currentStage > targetStage) return 'COMPLETED';
    if (currentStage === targetStage) return loading ? 'PROCESSING' : 'ACTIVE';
    return 'PENDING';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head>
        <title>SentinelChain | Supply Chain Command Center</title>
      </Head>

      <Sidebar />

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6 pb-24">
          
          {/* SAP CONNECTION STATUS */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex gap-4">
              <div className="glass-panel px-4 py-2 flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">LIVE INTELLIGENCE</span>
                <span className={`text-xs font-semibold ${liveNews.length > 0 && liveNews[0].isLive ? 'text-emerald-400' : 'text-orange-400'}`}>● {liveNews.length > 0 && liveNews[0].isLive ? 'CONNECTED' : 'DEMO MODE'}</span>
              </div>
              <div className="glass-panel px-4 py-2 flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">SAP S/4HANA</span>
                <span className={`text-xs font-semibold ${sapStatus.s4hana === 'Connected' ? 'text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>● {sapStatus.s4hana}</span>
              </div>
              <div className="glass-panel px-4 py-2 flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">SAP Ariba</span>
                <span className={`text-xs font-semibold ${sapStatus.ariba === 'Connected' ? 'text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>● {sapStatus.ariba}</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${sapStatus.mode === 'LIVE SAP MODE' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-orange-500/50 bg-orange-500/10 text-orange-400'}`}>
              {sapStatus.mode}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Autonomous Supply Chain Recovery</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Real World → Enterprise Context → AI Decision → Procurement Action</p>
            </div>
            {(loading || stage > 0) && (
              <button 
                onClick={() => { setStage(0); setDetectResult(null); setImpactResult(null); setMatchResult(null); setNegotiateResult(null); setApproved(false); setAribaResponse(null); setAuditTrail([]); setActiveNews(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10"
              >
                Reset System
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* LEFT COLUMN: LIVE FEED */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Live Disruption Feed
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={fetchNews} className="text-gray-400 hover:text-emerald-500 transition-colors" title="Force Refresh News">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Auto-Sync
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {liveNews.map((news) => (
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
                        ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                        : 'glass-panel hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{news.source}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-3">{news.title}</h3>
                    {activeNews?.id === news.id && stage === 0 && (
                       <button 
                         onClick={(e) => { e.stopPropagation(); simulatePipeline(news); }}
                         className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                       >
                         <Search className="w-3 h-3" /> Analyze Impact
                       </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: PIPELINE */}
            <div className="lg:col-span-3 space-y-6">

          {/* 3D GLOBE VISUALIZATION */}
          {stage === 0 && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <WorldMap />
            </div>
          )}

          {/* DETECTION RESULT UI */}
          {stage > 0 && detectResult && (
            detectResult.isDisruption ? (
              <div className="glass-panel border-l-4 border-red-500 bg-red-950/20 p-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-red-900/30 px-6 py-4 flex flex-wrap items-center justify-between border-b border-red-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                       <AlertTriangle className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">CRITICAL DISRUPTION DETECTED</h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest bg-red-500 text-gray-900 dark:text-white font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    Severity: {detectResult.severity?.toUpperCase() || 'HIGH'}
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Diagnostic Assessment</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-100 dark:bg-black/20 p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-inner">
                      {detectResult.reason}
                    </p>
                  </div>
                  
                  <div className="space-y-4 md:border-l md:border-gray-100 dark:border-white/5 md:pl-6">
                     <div>
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Impacted Node</h3>
                       <p className="font-mono text-base text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-white/5 inline-block px-3 py-1 rounded border border-gray-200 dark:border-white/10">{detectResult.partNumber}</p>
                     </div>
                     <div>
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Disruption Classification</h3>
                       <p className="text-sm text-red-400 font-semibold uppercase">{detectResult.disruptionType || 'Supply Shock'}</p>
                     </div>
                     <div>
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">AI Confidence Score</h3>
                       <div className="flex items-center gap-2 mt-1">
                         <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: `${(detectResult.confidence || 0.9) * 100}%` }}></div>
                         </div>
                         <span className="text-xs text-gray-900 dark:text-white font-bold">{Math.round((detectResult.confidence || 0.9) * 100)}%</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel border-l-4 border-emerald-500 bg-emerald-950/10 p-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-emerald-900/20 px-6 py-4 flex items-center gap-3 border-b border-emerald-500/20">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                     <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">THREAT DISMISSED</h2>
                </div>
                <div className="p-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Diagnostic Assessment</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-100 dark:bg-black/20 p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-inner">
                    {detectResult.reason}
                  </p>
                </div>
              </div>
            )
          )}

          {/* 4-STAGE PIPELINE */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Stage 1: Detection */}
            <div className={`glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 1 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''}`}>
              {stage === 1 && loading && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20"><div className="h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"></div></div>}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">AI LAYER</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Search className={`w-4 h-4 ${stage >= 1 ? 'text-indigo-400' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm ${stage >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Detection Agent</h3>
              </div>
              {getStageStatus(stage, 1) === 'COMPLETED' && detectResult && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Identified</p>
                  <p className="text-xs font-mono text-indigo-300 mt-1 truncate">{detectResult.partNumber}</p>
                </div>
              )}
            </div>

            {/* Stage 1.5: SAP S/4HANA */}
            <div className={`glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 2 ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-950/10' : ''} ${stage < 2 ? 'opacity-50' : ''}`}>
              {stage === 2 && loading && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20"><div className="h-full bg-emerald-500 animate-[progress_1.5s_ease-in-out_infinite]"></div></div>}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">ENTERPRISE</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Database className={`w-4 h-4 ${stage >= 2 ? 'text-emerald-400' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm ${stage >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>SAP S/4HANA</h3>
              </div>
              {getStageStatus(stage, 2) === 'COMPLETED' && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">BOM Retrieved</p>
                  <p className="text-xs font-mono text-emerald-300 mt-1 truncate">Source of Truth</p>
                </div>
              )}
            </div>

            {/* Stage 2: Impact */}
            <div className={`glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 2 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''} ${stage < 2 ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">AI LAYER</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className={`w-4 h-4 ${stage >= 2 ? 'text-orange-400' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm ${stage >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Impact Agent</h3>
              </div>
              {getStageStatus(stage, 2) === 'COMPLETED' && impactResult && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">At Risk</p>
                  <p className="text-xs font-mono text-orange-400 mt-1 truncate">${impactResult.revenueAtRiskPerDay.toLocaleString()}/day</p>
                </div>
              )}
            </div>

            {/* Stage 3: Match */}
            <div className={`glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 3 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''} ${stage < 3 ? 'opacity-50' : ''}`}>
              {stage === 3 && loading && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20"><div className="h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"></div></div>}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">AI LAYER</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Box className={`w-4 h-4 ${stage >= 3 ? 'text-blue-400' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm ${stage >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Cross-Reference</h3>
              </div>
              {getStageStatus(stage, 3) === 'COMPLETED' && matchResult && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alternatives</p>
                  <p className="text-xs font-mono text-blue-300 mt-1 truncate">{matchResult.length} verified</p>
                </div>
              )}
            </div>

            {/* Stage 4: Chase */}
            <div className={`glass-panel p-4 relative overflow-hidden transition-all duration-500 ${stage === 4 ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : ''} ${stage < 4 ? 'opacity-50' : ''}`}>
              {stage === 4 && loading && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20"><div className="h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"></div></div>}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">AI LAYER</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className={`w-4 h-4 ${stage >= 4 ? 'text-purple-400' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm ${stage >= 4 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Chase Agent</h3>
              </div>
              {getStageStatus(stage, 4) === 'COMPLETED' && negotiateResult && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evaluated</p>
                  <p className="text-xs font-mono text-purple-300 mt-1 truncate">{negotiateResult.rankedPlan.length} suppliers</p>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: IMPACT & ALTERNATIVES */}
            <div className="lg:col-span-1 space-y-6">
              {stage >= 2 && impactResult && (
                <div className="glass-panel p-6 animate-[fadeInUp_0.4s_ease-out]">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Business Impact</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-white/5">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Revenue at Risk</p>
                      <p className="text-3xl font-bold text-orange-400">${impactResult.revenueAtRiskPerDay.toLocaleString()} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Affected Products ({impactResult.affectedProducts.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {impactResult.affectedProducts.map(p => (
                          <span key={p} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stage >= 3 && matchResult && (
                <div className="glass-panel p-6 animate-[fadeInUp_0.4s_ease-out]">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Compatible Alternatives</h3>
                  <div className="space-y-3">
                    {matchResult.map((alt, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${i === 0 ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-gray-100 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-mono text-sm text-gray-900 dark:text-white font-bold">{alt.partNumber}</p>
                          {i === 0 && <span className="text-[9px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Top Match</span>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{alt.vendor}</p>
                        <p className="text-xs text-gray-500 mt-2">{alt.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: NEGOTIATION & RESOLUTION */}
            <div className="lg:col-span-2 space-y-6">
              {stage >= 4 && negotiateResult && (
                <div className="glass-panel flex flex-col h-[400px] animate-[fadeInUp_0.4s_ease-out]">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-100 dark:bg-white/5 rounded-t-xl">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chase Agent</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Autonomous supplier negotiation</p>
                    </div>
                    {stage === 4 ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-indigo-300 font-medium tracking-wide uppercase">Negotiating</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Session Closed</span>
                      </div>
                    )}
                  </div>
                  
                  <div ref={chatContainerRef} onScroll={(e) => {
                    const isBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
                    setAutoScroll(isBottom);
                  }} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {negotiateResult.chatLog.slice(0, chatRevealIndex).map((msg, i) => (
                      <div key={i} className={`flex w-full ${(msg.from === 'System' || msg.from === 'Chase Agent') ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                          (msg.from === 'System' || msg.from === 'Chase Agent') 
                            ? 'bg-indigo-600 text-gray-900 dark:text-white rounded-br-none' 
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        }`}>
                          <p className="text-[10px] uppercase tracking-wider mb-1 opacity-70 font-semibold">{msg.from}</p>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {stage === 4 && chatRevealIndex < negotiateResult.chatLog.length && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg rounded-bl-none p-4 flex gap-1 items-center">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              )}

              {/* FINAL PLAN */}
              {stage === 5 && negotiateResult && (
                <div className="glass-panel-success p-8 animate-[scaleIn_0.5s_ease-out]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recovery Plan Ready</h2>
                      <p className="text-emerald-300/80">AI-ranked response to MCU-2201X disruption</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-black/20 rounded-lg border border-emerald-500/20 p-5 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
                      <div className="col-span-1 md:col-span-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Supplier</p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{negotiateResult.rankedPlan[0].vendor}</p>
                      </div>
                      <div className="col-span-1 md:col-span-5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Replacement Part</p>
                        <p className="font-mono font-semibold text-gray-900 dark:text-white truncate" title={negotiateResult.rankedPlan[0].part}>{negotiateResult.rankedPlan[0].part}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{negotiateResult.rankedPlan[0].quantity.toLocaleString()} units</p>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Lead Time</p>
                        <p className="font-semibold text-emerald-400">{negotiateResult.rankedPlan[0].days} days</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Score: <span className="text-emerald-400 font-semibold">{negotiateResult.rankedPlan[0].score}</span></p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Risk Reduction: <span className="text-emerald-400 font-semibold">94%</span></p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button 
                      onClick={() => router.push('/plans')}
                      className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10"
                    >
                      View Details
                    </button>
                    {approved ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 px-6 py-3 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 font-semibold rounded-lg">
                          <CheckCircle className="w-5 h-5" /> SAP Ariba Integration Queued
                        </div>
                        {aribaResponse && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Doc ID: {aribaResponse.documentId} ({aribaResponse.sapSource})</span>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={approvePlan}
                        className="bg-emerald-600 hover:bg-emerald-500 text-gray-900 dark:text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" /> Approve & Send to SAP Ariba
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* AUDIT TRAIL */}
              {stage > 0 && (
                <div className="glass-panel overflow-hidden animate-[fadeIn_0.5s_ease-out] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/80">
                  <div className="bg-white dark:bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    <span className="ml-2 text-[10px] font-mono text-gray-500">root@sentinel-ai:~/audit</span>
                  </div>
                  <div className="p-4 font-mono text-xs space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {auditTrail.map((log, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <span className="text-emerald-500">[{log.time}]</span>
                          <span className="text-indigo-400 font-bold">{log.source}:</span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                          {log.message}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 items-center text-emerald-500 mt-4">
                      <span>root@sentinel-ai:~$</span>
                      <span className="w-2 h-4 bg-emerald-500 animate-[pulse_1s_step-end_infinite]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
      </main>

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
