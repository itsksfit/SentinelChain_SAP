import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Activity, AlertTriangle, ShieldCheck, Box, Search, MessageSquare,
  CheckCircle, Clock, Database, TrendingUp, Globe, Zap, RotateCcw,
  RefreshCw, Copy, Check, Filter, ExternalLink, ChevronRight, AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import PrAuditExportModal from '../components/PrAuditExportModal';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });

/* ── Helpers & Formatters ─────────────────────────────── */
const delay = ms => new Promise(r => setTimeout(r, ms));

function formatRelativeTime(isoString) {
  try {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recent';
  }
}

function classifySeverity(title = '', desc = '') {
  const t = `${title} ${desc}`.toLowerCase();
  if (/ban|halt|fire|restrict|sanction|shutdown|critical/.test(t)) return 'CRITICAL';
  if (/shortage|strike|disruption|delay|impact|warning/.test(t)) return 'HIGH';
  return 'MEDIUM';
}

const SEV = {
  CRITICAL: { badge: 'badge-red',   dot: '#f87171', label: 'Critical' },
  HIGH:     { badge: 'badge-amber', dot: '#fcd34d', label: 'High'     },
  MEDIUM:   { badge: 'badge-accent',dot: '#a5b4fc', label: 'Medium'   },
};

const STAGES = [
  { id: 1, Icon: Search,        label: 'Detection',    tag: 'AI Layer',   color: '#5a67f2' },
  { id: 2, Icon: Database,      label: 'SAP S/4HANA',  tag: 'Enterprise', color: '#4ade80' },
  { id: 3, Icon: Activity,      label: 'Impact Agent', tag: 'AI Layer',   color: '#fb923c' },
  { id: 4, Icon: Box,           label: 'Cross-Ref',    tag: 'AI Layer',   color: '#60a5fa' },
  { id: 5, Icon: MessageSquare, label: 'Chase Agent',  tag: 'AI Layer',   color: '#c084fc' },
];

function stageStatus(stage, id, loading) {
  if (stage > id) return 'done';
  if (stage === id) return loading ? 'running' : 'active';
  return 'idle';
}

const AUDIT_COLORS = {
  'Detection Agent': '#818cf8',
  'SAP S/4HANA':    '#4ade80',
  'Impact Agent':   '#fb923c',
  'Risk Engine':    '#f43f5e',
  'Policy Engine':  '#c084fc',
  'Cross-Reference':'#60a5fa',
  'Chase Agent':    '#c084fc',
  'SAP Ariba':      '#4ade80',
  'User':           '#fcd34d',
  'System':         '#94a3b8',
};

/* ── Components ──────────────────────────────────────── */
function StatCard({ Icon, label, value, sub, color, delayMs = 0 }) {
  return (
    <div
      className="card p-4 sm:p-5 anim-fade-up"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="section-label">{label}</p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  );
}

function StageCard({ s, stage, loading, detectResult, impactResult, matchResult, negotiateResult }) {
  const status = stageStatus(stage, s.id, loading);
  const done    = status === 'done';
  const running = status === 'running';
  const idle    = status === 'idle';

  const sub = {
    1: detectResult?.partNumber,
    2: done ? 'BOM retrieved' : null,
    3: impactResult ? `$${impactResult.revenueAtRiskPerDay?.toLocaleString()}/day` : null,
    4: matchResult  ? `${matchResult.length} alternatives` : null,
    5: negotiateResult ? `${negotiateResult.rankedPlan?.length || 2} ranked` : null,
  }[s.id];

  return (
    <div
      className="rounded-xl p-3.5 relative overflow-hidden transition-all duration-200"
      style={{
        background: running ? 'var(--bg-elevated)' : done ? 'var(--bg-card)' : 'var(--bg-subtle)',
        border: `1px solid ${running ? `${s.color}60` : done ? 'var(--border-subtle)' : 'var(--border-faint)'}`,
        opacity: idle ? 0.5 : 1,
      }}
    >
      {running && (
        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden" style={{ background: `${s.color}20` }}>
          <div
            className="h-full w-1/3 rounded-full"
            style={{ background: s.color, animation: 'indeterminate 1.2s ease-in-out infinite' }}
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="section-label" style={{ color: done || running ? s.color : 'var(--text-faint)' }}>{s.tag}</span>
        {done && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: s.color }} />}
        {running && (
          <div className="flex gap-0.5">
            {[0, 120, 240].map(d => (
              <div key={d} className="w-1 h-1 rounded-full animate-bounce" style={{ background: s.color, animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 min-w-0">
        <s.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: done || running ? s.color : 'var(--text-faint)' }} />
        <span
          className="text-xs font-medium truncate"
          style={{ color: done || running ? 'var(--text-primary)' : 'var(--text-muted)' }}
        >
          {s.label}
        </span>
      </div>

      {sub && (
        <p className="mono text-[11px] mt-2 font-medium truncate" style={{ color: s.color }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stage, setStage]                     = useState(0);
  const [loading, setLoading]                 = useState(false);
  const [detectResult, setDetectResult]       = useState(null);
  const [impactResult, setImpactResult]       = useState(null);
  const [matchResult, setMatchResult]         = useState(null);
  const [negotiateResult, setNegotiateResult] = useState(null);
  const [chatRevealIndex, setChatRevealIndex] = useState(-1);
  const [approved, setApproved]               = useState(false);
  const [submittingAriba, setSubmittingAriba] = useState(false);
  const [aribaResponse, setAribaResponse]     = useState(null);
  const [sapStatus, setSapStatus]             = useState({ s4hana: 'Connected', ariba: 'Connected', mode: 'LIVE SAP MODE' });
  const [auditTrail, setAuditTrail]           = useState([]);
  const [copiedAudit, setCopiedAudit]         = useState(false);
  const [showPrModal, setShowPrModal]         = useState(false);

  // Live News State
  const [liveNews, setLiveNews]               = useState([]);
  const [activeNews, setActiveNews]           = useState(null);
  const [newsLoading, setNewsLoading]         = useState(true);
  const [newsRefreshing, setNewsRefreshing]   = useState(false);
  const [newsSearch, setNewsSearch]           = useState('');
  const [newsError, setNewsError]             = useState(null);
  const [lastUpdated, setLastUpdated]         = useState(null);

  const chatEndRef = useRef(null);
  const pollingRef = useRef(null);

  const addAudit = useCallback((source, message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditTrail(prev => [...prev, { time, source, message }]);
  }, []);

  const fetchNews = useCallback(async (isBackground = false) => {
    if (isBackground) setNewsRefreshing(true);
    else setNewsLoading(true);
    setNewsError(null);

    try {
      const res = await fetch('/api/news/latest');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const news = await res.json();
      
      if (Array.isArray(news) && news.length > 0) {
        const sorted = [...news].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setLiveNews(sorted);
        setActiveNews(prev => {
          if (!prev) return sorted[0];
          const matched = sorted.find(n => n.id === prev.id);
          return matched || sorted[0];
        });
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to load news:', err);
      setNewsError('Unable to sync live news. Showing cached intel.');
    } finally {
      setNewsLoading(false);
      setNewsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/sap/status').then(r => r.json()).then(setSapStatus).catch(() => {});
    fetchNews(false);

    pollingRef.current = setInterval(() => {
      fetchNews(true);
    }, 30000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchNews]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatRevealIndex]);

  const reset = () => {
    setStage(0);
    setLoading(false);
    setDetectResult(null);
    setImpactResult(null);
    setMatchResult(null);
    setNegotiateResult(null);
    setApproved(false);
    setSubmittingAriba(false);
    setAribaResponse(null);
    setAuditTrail([]);
    setChatRevealIndex(-1);
  };

  const runPipeline = async (news) => {
    if (!news) return;
    setLoading(true);
    setStage(1);
    setAuditTrail([]);
    setAribaResponse(null);
    setApproved(false);
    setChatRevealIndex(-1);

    addAudit('System', `Ingesting signal from ${news.source}: "${news.title.slice(0, 60)}..."`);

    try {
      // Stage 1: Detect
      const r1 = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: news })
      });
      const d1 = await r1.json();
      setDetectResult(d1);
      addAudit('Detection Agent', d1.reason || 'Analysis complete.');

      if (!d1.isDisruption) {
        addAudit('System', 'Event deemed non-critical. Pipeline safely disarmed.');
        setLoading(false);
        return;
      }

      await delay(700);
      setStage(2);

      // Stage 2: S/4HANA & Impact + Deterministic Risk & Decision Engine
      const r2 = await fetch('/api/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partNumber: d1.partNumber, severity: d1.severity, confidence: d1.confidence })
      });
      const d2 = await r2.json();
      setImpactResult(d2);
      addAudit('SAP S/4HANA', `Retrieved material master record & BOM tree for ${d1.partNumber}`);
      addAudit('Impact Agent', `Identified ${d2.affectedProducts.length} BOM dependencies. Financial exposure: $${d2.revenueAtRiskPerDay?.toLocaleString()}/day`);
      if (d2.risk) {
        addAudit('Risk Engine', `Computed composite risk score: ${d2.risk.riskScore}/100 [Severity: ${d2.risk.severity}]`);
      }
      if (d2.decision) {
        addAudit('Policy Engine', `Decision: ${d2.decision.decision} — ${d2.decision.rationale}`);
      }

      await delay(800);
      setStage(3);

      // Stage 3: Cross-Reference
      const r3 = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partNumber: d1.partNumber })
      });
      const d3 = await r3.json();
      setMatchResult(d3);
      addAudit('Cross-Reference', `Located ${d3.length} form-fit-function compatible alternatives in global catalog.`);

      await delay(900);
      setStage(4);

      // Stage 4: Chase Agent Autonomous Sourcing
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
      const chatInterval = setInterval(() => {
        index++;
        setChatRevealIndex(index);
        if (index >= (d4.chatLog?.length || 0)) {
          clearInterval(chatInterval);
          addAudit('Chase Agent', 'Multi-supplier RFQ negotiation concluded. Optimal procurement strategy selected.');
          setTimeout(() => setStage(5), 1000);
        }
      }, 950);
    } catch (err) {
      console.error('Pipeline execution error:', err);
      addAudit('System', `Pipeline error: ${err.message}. Please retry.`);
      setLoading(false);
    }
  };

  const approvePlan = async () => {
    if (!negotiateResult?.rankedPlan?.[0]) return;
    setSubmittingAriba(true);
    addAudit('User', 'Authorized recovery procurement plan. Dispatching to SAP Ariba network.');

    try {
      const res = await fetch('/api/sap/recovery-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planDetails: negotiateResult.rankedPlan[0] })
      });
      const data = await res.json();
      setAribaResponse(data);
      setApproved(true);
      addAudit('SAP Ariba', `Purchase Requisition generated: ${data.documentId} [Status: Approved / Routing to Supplier]`);
    } catch (err) {
      console.error('SAP Ariba submission error:', err);
      addAudit('SAP Ariba', 'Submission error occurred. Fallback demo order generated.');
      setApproved(true);
    } finally {
      setSubmittingAriba(false);
    }
  };

  const copyAuditLogs = () => {
    const text = auditTrail.map(l => `[${l.time}] ${l.source}: ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  const filteredNews = liveNews.filter(n => {
    if (!newsSearch.trim()) return true;
    const q = newsSearch.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.source.toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q);
  });

  const isLive = liveNews.length > 0 && liveNews[0].isLive;

  return (
    <Layout
      title="Dashboard"
      description="Autonomous AI-powered supply chain resilience and procurement platform."
      maxWidth="1280px"
    >
      <div className="space-y-6">

        {/* ── KPI METRICS ROW ────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            Icon={AlertTriangle}
            label="Active Alerts"
            value="3"
            sub="2 Critical · 1 High"
            color="var(--red)"
            delayMs={0}
          />
          <StatCard
            Icon={TrendingUp}
            label="Revenue at Risk"
            value="$247K"
            sub="Daily potential exposure"
            color="var(--amber)"
            delayMs={40}
          />
          <StatCard
            Icon={Globe}
            label="Suppliers Monitored"
            value="1,402"
            sub="Across 34 countries"
            color="#818cf8"
            delayMs={80}
          />
          <StatCard
            Icon={Zap}
            label="AI Interventions"
            value="14"
            sub="100% automated resolution"
            color="var(--green-light)"
            delayMs={120}
          />
        </div>

        {/* ── STATUS BAR + QUICK CONTROLS ────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl card">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--bg-elevated)' }}>
              <span className="section-label" style={{ fontSize: 10 }}>Intel Feed</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isLive ? '#4ade80' : 'var(--text-faint)', animation: isLive ? 'pulse-dot 2s ease-in-out infinite' : 'none' }}
                />
                <span className="font-medium" style={{ color: isLive ? '#4ade80' : 'var(--text-secondary)' }}>
                  {isLive ? 'Live Stream' : 'Mock Intel'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--bg-elevated)' }}>
              <span className="section-label" style={{ fontSize: 10 }}>SAP S/4HANA</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <span className="font-medium" style={{ color: '#4ade80' }}>{sapStatus.s4hana}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--bg-elevated)' }}>
              <span className="section-label" style={{ fontSize: 10 }}>SAP Ariba</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <span className="font-medium" style={{ color: '#4ade80' }}>{sapStatus.ariba}</span>
              </div>
            </div>

            <span className="badge badge-green font-mono text-[10px]">
              {sapStatus.mode}
            </span>
          </div>

          {(loading || stage > 0) && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium hover:bg-white/5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Pipeline
            </button>
          )}
        </div>

        {/* ── SECTION HEADER ─────────────────────────────── */}
        <div className="flex items-baseline justify-between">
          <div>
            <h1>Autonomous Recovery Pipeline</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Threat detection → S/4HANA BOM explosion → Deterministic Risk & Policy evaluation → Autonomous ERP mitigation
            </p>
          </div>
        </div>

        {/* ── MAIN WORKSPACE GRID ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* ── LEFT: LIVE NEWS INTEL FEED ───────────────── */}
          <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-faint)' }}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#4ade80]" />
                <h3 className="text-sm font-semibold m-0">Live Disruption Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNews(true)}
                  disabled={newsLoading || newsRefreshing}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  title="Refresh news stream"
                  aria-label="Refresh news"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${newsRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
                <span className="section-label flex items-center gap-1.5" style={{ fontSize: 9 }}>
                  <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" />
                  30s sync
                </span>
              </div>
            </div>

            {/* News search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search intel articles..."
                value={newsSearch}
                onChange={e => setNewsSearch(e.target.value)}
                className="w-full rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:border-indigo-500/50"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-faint)', color: 'var(--text-primary)' }}
              />
            </div>

            {newsError && (
              <div className="p-2.5 rounded-lg text-xs flex items-center gap-2" style={{ background: 'var(--amber-subtle)', color: '#fcd34d', border: '1px solid var(--amber-border)' }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[11px] leading-tight">{newsError}</span>
              </div>
            )}

            {/* News Articles List */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-0.5 custom-scrollbar">
              {newsLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-24 rounded-xl" style={{ animationDelay: `${i * 100}ms` }} />
                ))
              ) : filteredNews.length === 0 ? (
                <div className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  No articles matched your search.
                </div>
              ) : (
                filteredNews.map((news) => {
                  const sev = classifySeverity(news.title, news.description);
                  const s = SEV[sev];
                  const isActive = activeNews?.id === news.id;

                  return (
                    <div
                      key={news.id}
                      onClick={() => {
                        if (!loading && stage === 0) setActiveNews(news);
                      }}
                      className={`rounded-xl p-3.5 cursor-pointer transition-all duration-150 relative ${
                        isActive ? 'ring-1 ring-indigo-500/40' : 'hover:border-slate-700'
                      }`}
                      style={{
                        background: isActive ? 'var(--bg-elevated)' : 'var(--bg-subtle)',
                        border: `1px solid ${isActive ? 'var(--border-muted)' : 'var(--border-faint)'}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`badge ${s.badge}`}>
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                          {s.label}
                        </span>
                        <span className="text-[10px] flex items-center gap-1 tabular-nums" style={{ color: 'var(--text-muted)' }} title={new Date(news.publishedAt).toLocaleString()}>
                          <Clock className="w-2.5 h-2.5" />
                          {formatRelativeTime(news.publishedAt)}
                        </span>
                      </div>

                      <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {news.source}
                      </p>

                      <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {news.title}
                      </p>

                      {isActive && stage === 0 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            runPipeline(news);
                          }}
                          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                          style={{ background: 'var(--accent)' }}
                        >
                          <Search className="w-3.5 h-3.5" /> Analyze & Resolve
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {lastUpdated && (
              <p className="text-[10px] text-center mono" style={{ color: 'var(--text-muted)' }}>
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* ── RIGHT: PIPELINE EXECUTION & INTELLIGENCE ─── */}
          <div className="space-y-5">

            {/* 3D Global Supply Map */}
            {stage === 0 && (
              <div className="anim-fade-in">
                <WorldMap />
              </div>
            )}

            {/* Detection Assessment Banner */}
            {stage > 0 && detectResult && (
              <div className={`rounded-xl overflow-hidden anim-fade-up ${detectResult.isDisruption ? 'card-red' : 'card-green'}`}>
                <div
                  className="px-5 py-3.5 flex items-center justify-between"
                  style={{ borderBottom: `1px solid ${detectResult.isDisruption ? 'var(--red-border)' : 'var(--green-border)'}` }}
                >
                  <div className="flex items-center gap-2.5">
                    {detectResult.isDisruption ? (
                      <AlertTriangle className="w-4 h-4 text-[#f87171]" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
                    )}
                    <h3 className="m-0 text-sm font-semibold" style={{ color: detectResult.isDisruption ? '#fca5a5' : '#86efac' }}>
                      {detectResult.isDisruption ? 'Supply Disruption Confirmed' : 'Signal Classified as Safe'}
                    </h3>
                  </div>
                  {detectResult.isDisruption && (
                    <span className="badge badge-red font-mono">
                      SEV: {detectResult.severity?.toUpperCase() || 'HIGH'}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  {detectResult.isDisruption ? (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5">
                      <div>
                        <p className="section-label mb-2">Diagnostic Rationale</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {detectResult.reason}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 md:pl-5 md:border-l min-w-[170px]" style={{ borderColor: 'var(--red-border)' }}>
                        <div>
                          <p className="section-label mb-1">Impacted Component</p>
                          <code className="mono text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: '#fca5a5', border: '1px solid var(--red-border)' }}>
                            {detectResult.partNumber}
                          </code>
                        </div>

                        <div>
                          <p className="section-label mb-1">Disruption Vector</p>
                          <p className="text-xs font-medium text-slate-200">{detectResult.disruptionType || 'Supply Shock'}</p>
                        </div>

                        <div>
                          <p className="section-label mb-1.5">AI Confidence</p>
                          <div className="flex items-center gap-2">
                            <div className="progress-track flex-1">
                              <div className="progress-fill" style={{ width: `${(detectResult.confidence || 0.95) * 100}%`, background: 'var(--red)' }} />
                            </div>
                            <span className="text-xs font-semibold mono" style={{ color: '#fca5a5' }}>
                              {Math.round((detectResult.confidence || 0.95) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {detectResult.reason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pipeline Stages Progression Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {STAGES.map(s => (
                <StageCard
                  key={s.id}
                  s={s}
                  stage={stage}
                  loading={loading}
                  detectResult={detectResult}
                  impactResult={impactResult}
                  matchResult={matchResult}
                  negotiateResult={negotiateResult}
                />
              ))}
            </div>

            {/* Impact Analysis & Cross-Reference Alternatives */}
            {((stage >= 2 && impactResult) || (stage >= 3 && matchResult)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage >= 2 && impactResult && (
                  <div className="card p-5 anim-fade-up">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <h3 className="m-0 text-sm font-semibold">Financial & Risk Impact</h3>
                      </div>
                      {impactResult.risk && (
                        <span className={`badge ${impactResult.risk.severity === 'CRITICAL' ? 'badge-red' : impactResult.risk.severity === 'HIGH' ? 'badge-amber' : 'badge-accent'}`}>
                          Risk Score: {impactResult.risk.riskScore}/100
                        </span>
                      )}
                    </div>
                    <div className="rounded-lg p-4 mb-3" style={{ background: 'var(--amber-subtle)', border: '1px solid var(--amber-border)' }}>
                      <p className="section-label mb-1">Estimated Daily Revenue at Risk</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-semibold tracking-tight tabular-nums" style={{ color: '#fcd34d', letterSpacing: '-0.04em' }}>
                          ${impactResult.revenueAtRiskPerDay?.toLocaleString()}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ day</span>
                      </div>
                    </div>
                    {impactResult.decision && (
                      <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-faint)' }}>
                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Policy Decision</span>
                        <span className="mono text-xs font-semibold" style={{ color: impactResult.decision.decision === 'AUTONOMOUS_MITIGATION' ? '#4ade80' : impactResult.decision.decision === 'REVIEW' ? '#fcd34d' : '#818cf8' }}>
                          {impactResult.decision.decision}
                        </span>
                      </div>
                    )}
                    <p className="section-label mb-2">Impacted Downstream Products ({impactResult.affectedProducts?.length || 0})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {impactResult.affectedProducts?.map(p => (
                        <span key={p} className="badge badge-muted text-xs font-mono">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {stage >= 3 && matchResult && (
                  <div className="card p-5 anim-fade-up">
                    <div className="flex items-center gap-2 mb-3">
                      <Box className="w-4 h-4 text-blue-400" />
                      <h3 className="m-0 text-sm font-semibold">Form-Fit-Function Alternatives</h3>
                    </div>
                    <div className="space-y-2 max-h-[170px] overflow-y-auto custom-scrollbar pr-0.5">
                      {matchResult.map((alt, i) => (
                        <div
                          key={i}
                          className="flex items-start justify-between gap-3 p-3 rounded-lg"
                          style={{
                            background: i === 0 ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                            border: `1px solid ${i === 0 ? 'var(--accent-border)' : 'var(--border-faint)'}`
                          }}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <code className="mono text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{alt.partNumber}</code>
                              {i === 0 && <span className="badge badge-accent">Top Match</span>}
                            </div>
                            <p className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{alt.vendor}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{alt.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chase Agent Autonomous Negotiation Terminal */}
            {stage >= 4 && negotiateResult && (
              <div className="card overflow-hidden anim-fade-up flex flex-col" style={{ height: 360 }}>
                <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-faint)', background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <div>
                      <h3 className="m-0 text-sm font-semibold">Chase Agent — Autonomous Supplier RFQ</h3>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Multi-agent real-time price & lead-time negotiation</p>
                    </div>
                  </div>
                  {stage === 4 ? (
                    <span className="badge badge-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-pulse" />
                      Negotiating
                    </span>
                  ) : (
                    <span className="badge badge-muted">Session Complete</span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
                  {negotiateResult.chatLog?.slice(0, chatRevealIndex).map((msg, i) => {
                    const isAgent = msg.from === 'System' || msg.from === 'Chase Agent';
                    return (
                      <div key={i} className={`flex ${isAgent ? 'justify-end' : 'justify-start'} anim-fade-up`} style={{ animationDelay: `${i * 30}ms` }}>
                        <div
                          className="max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs shadow-sm"
                          style={
                            isAgent
                              ? { background: 'var(--accent)', color: '#fff', borderRadius: '14px 14px 2px 14px' }
                              : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '14px 14px 14px 2px' }
                          }
                        >
                          <p className="text-[9px] font-semibold uppercase tracking-wider mb-1 opacity-70">{msg.from}</p>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {stage === 4 && chatRevealIndex < (negotiateResult.chatLog?.length || 0) && (
                    <div className="flex justify-start">
                      <div className="flex gap-1 px-4 py-2.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        {[0, 120, 240].map(d => (
                          <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}

            {/* Stage 5: Final Ranked Plan & ERP Execution */}
            {stage === 5 && negotiateResult?.rankedPlan?.[0] && (
              <div className="card-green rounded-xl p-6 anim-scale-in shadow-lg">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--green-subtle)', border: '1px solid var(--green-border)' }}>
                      <CheckCircle className="w-5 h-5 text-[#4ade80]" />
                    </div>
                    <div>
                      <h2 className="m-0 text-base font-semibold text-[#86efac]">Optimal Recovery Plan Synthesized</h2>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Ranked #1 out of alternative quotes for component {detectResult?.partNumber}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-green font-mono">CONFIRMED</span>
                </div>

                <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--green-border)' }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: 'Selected Vendor', value: negotiateResult.rankedPlan[0].vendor, mono: false },
                      { label: 'Alternative Part', value: negotiateResult.rankedPlan[0].part, mono: true },
                      { label: 'Order Quantity', value: `${negotiateResult.rankedPlan[0].quantity?.toLocaleString()} units`, mono: false },
                      { label: 'Expedited Lead Time', value: `${negotiateResult.rankedPlan[0].days} days`, mono: false, highlight: true },
                    ].map(({ label, value, mono, highlight }) => (
                      <div key={label}>
                        <p className="section-label mb-1">{label}</p>
                        <p className={`text-sm font-semibold ${mono ? 'mono' : ''}`} style={{ color: highlight ? '#86efac' : 'var(--text-primary)' }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="divider my-3" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Estimated Risk Reduction</span>
                      <span className="font-semibold text-[#86efac] font-mono">94%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: '94%', background: 'var(--green-light)' }} />
                    </div>
                  </div>
                </div>

                {/* Approve Action or Approved Confirmation */}
                <div className="flex items-center justify-end gap-3">
                  {approved ? (
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--green-subtle)', border: '1px solid var(--green-border)', color: '#86efac' }}>
                        <CheckCircle className="w-4 h-4" /> Dispatched to SAP Ariba Procurement
                      </div>
                      {aribaResponse && (
                        <span className="mono text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-faint)', color: 'var(--text-secondary)' }}>
                          Doc ID: {aribaResponse.documentId}
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={approvePlan}
                      disabled={submittingAriba}
                      className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-md disabled:opacity-50"
                      style={{ background: 'var(--green)' }}
                    >
                      {submittingAriba ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {submittingAriba ? 'Submitting to SAP...' : 'Approve & Send to SAP Ariba'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Audit Trail Terminal Log */}
            {stage > 0 && (
              <div className="glass-terminal overflow-hidden anim-fade-in shadow-md">
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b"
                  style={{ background: '#05060a', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="mono text-[10px] ml-2 text-slate-400">
                      sentinel-chain — pipeline-audit.log
                    </span>
                  </div>

                  <button
                    onClick={copyAuditLogs}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded text-slate-400 hover:text-white transition-colors"
                    title="Copy audit logs"
                  >
                    {copiedAudit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAudit ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar font-mono text-xs">
                  {auditTrail.map((log, i) => (
                    <div key={i} className="anim-fade-left" style={{ animationDelay: `${i * 15}ms` }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-emerald-400">[{log.time}]</span>
                        <span className="text-[10px] font-bold" style={{ color: AUDIT_COLORS[log.source] || '#94a3b8' }}>
                          {log.source}:
                        </span>
                      </div>
                      <p
                        className="text-[11px] leading-relaxed pl-3 ml-0.5"
                        style={{ color: 'var(--text-secondary)', borderLeft: `2px solid ${(AUDIT_COLORS[log.source] || '#334155')}30` }}
                      >
                        {log.message}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-1">
                    <span>sentinel@sap-node:~$</span>
                    <span className="w-1.5 h-3 bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

          </div>{/* end right column */}
        </div>{/* end main grid */}
      </div>
      {showPrModal && (
        <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={matchResult || detectResult} />
      )}
    </Layout>
  );
}
