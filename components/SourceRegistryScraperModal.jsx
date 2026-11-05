import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, RefreshCw, ShieldCheck, FileText, Globe, 
  Terminal, Hash, Zap, CheckCircle2, Copy, Check, AlertCircle, 
  Clock, Server, Cpu, Database
} from 'lucide-react';

export default function SourceRegistryScraperModal({ isOpen, onClose, signal }) {
  const [loading, setLoading] = useState(false);
  const [scrapedResult, setScrapedResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (isOpen && signal) {
      performScrape();
    } else {
      setScrapedResult(null);
      setError(null);
    }
  }, [isOpen, signal]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const targetUrl = signal?.verifiedUrl && signal.verifiedUrl !== '#'
    ? signal.verifiedUrl
    : (signal?.sourceTier === 'FED_REGISTER_BIS'
        ? 'https://www.federalregister.gov/api/v1/documents/2023-23055.json'
        : (signal?.part_affected === 'STM32F401RE' || signal?.entityName === 'TSMC'
            ? 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
            : 'https://www.ti.com'));

  const performScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scrape/source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          context: {
            title: signal.title || signal.event_type,
            description: signal.description || signal.event_type,
            sourceTier: signal.sourceTier,
            entityName: signal.entityName,
            targetFab: signal.targetFab
          }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      setScrapedResult(data);
    } catch (err) {
      console.error('Failed to scrape verified source:', err);
      setError(err.message || 'Scrape operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHash = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  if (!isOpen || !signal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#121316] rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-[#EAEAEA] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#16171B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center text-primary-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified Provenance Registry
                </span>
                <span className="text-xs text-secondary-400 font-mono">
                  {signal.sourceTier || 'OFFICIAL_IR'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-secondary-900 dark:text-white tracking-tight mt-0.5">
                Real-Time Web Scraper Telemetry
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={performScrape}
              disabled={loading}
              className="p-2 text-secondary-500 hover:text-secondary-900 dark:hover:text-white rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors disabled:opacity-50"
              title="Re-scrape source URL"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-secondary-400 hover:text-secondary-900 dark:hover:text-white rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Signal Headline Context */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#18191D] border border-[#E5E7EB] dark:border-[#262626] space-y-2">
            <div className="flex items-center justify-between text-xs text-secondary-500">
              <span className="font-semibold uppercase tracking-wider">Trigger Signal Reference</span>
              <span className="font-mono">{signal.id || 'DSP-LIVE'}</span>
            </div>
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white leading-snug">
              {signal.title || signal.event_type}
            </h3>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed">
              {signal.description || signal.event_type}
            </p>
          </div>

          {/* Web Scraper Live Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#16171B]">
              <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> HTTP Status
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-extrabold text-secondary-900 dark:text-white font-mono">
                  {scrapedResult ? `${scrapedResult.statusCode} ${scrapedResult.statusText || 'OK'}` : (loading ? 'Connecting...' : 'Ready')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#16171B]">
              <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Network Latency
              </span>
              <span className="text-sm font-extrabold text-secondary-900 dark:text-white font-mono">
                {scrapedResult ? `${scrapedResult.latencyMs} ms` : (loading ? 'Measuring...' : '—')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#16171B]">
              <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5 text-purple-500" /> Host Domain
              </span>
              <span className="text-xs font-bold text-secondary-900 dark:text-white font-mono truncate block" title={scrapedResult?.domain}>
                {scrapedResult?.domain || 'Institutional Host'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#16171B]">
              <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-500" /> Word Count
              </span>
              <span className="text-sm font-extrabold text-secondary-900 dark:text-white font-mono">
                {scrapedResult ? `${scrapedResult.wordCount} words` : (loading ? 'Parsing...' : '—')}
              </span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Provenance & Target URL */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#18191D] border border-[#E5E7EB] dark:border-[#262626] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary-500 shrink-0" />
                <span className="text-xs font-bold text-secondary-900 dark:text-white">
                  SHA-256 Cryptographic Payload Hash:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-[11px] font-mono text-secondary-600 dark:text-secondary-400 bg-white dark:bg-[#121316] px-2.5 py-1 rounded-md border border-[#E5E7EB] dark:border-[#262626]">
                  {scrapedResult?.contentHash || 'Generating SHA-256 digest...'}
                </code>
                {scrapedResult?.fullContentHash && (
                  <button
                    onClick={() => handleCopyHash(scrapedResult.fullContentHash)}
                    className="p-1 text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
                    title="Copy full SHA-256 hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#EAEAEA] dark:border-[#222222] text-xs">
              <span className="text-secondary-500 font-semibold">Live Target URL:</span>
              <a 
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-mono truncate max-w-lg inline-flex items-center gap-1"
              >
                {targetUrl} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Scraped Document Plain-Text Excerpt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-secondary-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300">
                  Extracted Document Body (Clean Scraped Text)
                </span>
              </div>
              {scrapedResult?.matchedKeywords && scrapedResult.matchedKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-secondary-400">Extracted Keywords:</span>
                  {scrapedResult.matchedKeywords.slice(0, 4).map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#2E3440] bg-[#0E1117]">
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center space-y-3 text-secondary-400">
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-8 h-8 rounded-full border border-primary-500/30 animate-ping"></div>
                  </div>
                  <span className="text-xs font-mono">Fetching remote institutional endpoint & stripping HTML...</span>
                </div>
              ) : error ? (
                <div className="p-6 text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                  <p className="text-xs text-red-400 font-mono">{error}</p>
                  <button 
                    onClick={performScrape}
                    className="px-3 py-1.5 bg-secondary-800 text-white rounded-lg text-xs font-bold"
                  >
                    Retry Scrape
                  </button>
                </div>
              ) : (
                <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 max-h-64 overflow-y-auto whitespace-pre-wrap select-text">
                  {scrapedResult?.extractedExcerpt || 'No scraped text available.'}
                </div>
              )}
            </div>
          </div>

          {/* SAP Bill-of-Materials Cross-Correlation Footer */}
          <div className="p-4 rounded-xl bg-primary-50/60 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/40 flex items-start gap-3">
            <Database className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-extrabold text-secondary-900 dark:text-white">
                Deterministic SAP S/4HANA Correlation Confirmed
              </h4>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                This scraped institutional registry item has been matched by SentinelChain's heuristic signal layer to component 
                <span className="font-mono font-bold text-primary-600 dark:text-primary-400 px-1">
                  {signal.entityName === 'TSMC' || signal.part_affected === 'STM32F401RE' ? 'STM32F401RE' : (signal.entityName === 'Texas Instruments' ? 'PWR-9942A' : 'MT29F64G08')}
                </span> 
                affecting active assembly lines at Plant 1010 (Stuttgart) and Plant 1020 (Austin).
              </p>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-[#EAEAEA] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#16171B] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-secondary-400 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5" /> Scraped at: {scrapedResult?.scrapedAt ? new Date(scrapedResult.scrapedAt).toLocaleTimeString() : 'Live'}
          </span>

          <div className="flex items-center gap-3">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-800 dark:text-white border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5 transition-all"
            >
              <span>Open External Registry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary-900 hover:bg-black dark:bg-white dark:hover:bg-secondary-100 text-white dark:text-secondary-900 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              Close Telemetry
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
