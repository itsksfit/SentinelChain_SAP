import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import PrAuditExportModal from '../components/PrAuditExportModal';
import { 
  Radio, Zap, ShieldAlert, CheckCircle2, ArrowRight, Cpu, Layers, 
  ExternalLink, RefreshCw, Send, FileText, Database, ShieldCheck, 
  Activity, Terminal, AlertTriangle, Clock, Box, Sparkles
} from 'lucide-react';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const parts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'parts-catalog.json'), 'utf8'));

  return {
    props: {
      partsCatalog: parts.slice(0, 6)
    }
  };
}

export default function EventMeshPage({ partsCatalog }) {
  const [signals, setSignals] = useState([]);
  const [meshEvents, setMeshEvents] = useState([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [processingSignal, setProcessingSignal] = useState(null);
  const [activeTriggerResult, setActiveTriggerResult] = useState(null);
  const [customSignalText, setCustomSignalText] = useState('');
  const [selectedAuditData, setSelectedAuditData] = useState(null);
  const [showPrModal, setShowPrModal] = useState(false);

  // Load live signals and initial mesh events
  const loadMeshFeed = async () => {
    setLoadingSignals(true);
    try {
      const [newsRes, meshRes] = await Promise.all([
        fetch('/api/news/latest'),
        fetch('/api/mesh/events')
      ]);

      if (newsRes.ok) {
        const data = await newsRes.json();
        setSignals(data);
      }
      if (meshRes.ok) {
        const mData = await meshRes.json();
        setMeshEvents(mData.events || []);
      }
    } catch (err) {
      console.error("Failed to load mesh feed:", err);
    } finally {
      setLoadingSignals(false);
    }
  };

  useEffect(() => {
    loadMeshFeed();
  }, []);

  // Trigger autonomous agent chain through Event Mesh
  const handleTriggerMesh = async (signal) => {
    setProcessingSignal(signal.id || 'custom');
    setActiveTriggerResult(null);

    try {
      const res = await fetch('/api/mesh/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal })
      });

      if (res.ok) {
        const result = await res.json();
        setActiveTriggerResult(result);

        // Update mesh events stream
        if (result.meshEvents) {
          setMeshEvents(result.meshEvents);
        }

        // Also persist the generated recovery record to client localStorage
        if (result.recoveryRecord) {
          try {
            const existing = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
            localStorage.setItem('custom_disruptions', JSON.stringify([result.recoveryRecord, ...existing]));
          } catch(e) {}
        }
      }
    } catch (err) {
      console.error("Event mesh execution error:", err);
    } finally {
      setProcessingSignal(null);
    }
  };

  // Custom alert injection
  const handleInjectCustomSignal = (e) => {
    e.preventDefault();
    if (!customSignalText.trim()) return;

    const customSignal = {
      id: `manual-sig-${Date.now()}`,
      title: customSignalText,
      description: "Manual signal bulletin injected directly into the SAP Event Mesh.",
      source: "Manual Sensor Bulletin",
      sourceTier: "OFFICIAL_IR",
      verifiedUrl: "https://investor.nvidia.com",
      publishedAt: new Date().toISOString()
    };

    handleTriggerMesh(customSignal);
    setCustomSignalText('');
  };

  const getTopicColor = (topic) => {
    if (topic.includes('disruption')) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/30';
    if (topic.includes('ariba')) return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30';
    if (topic.includes('sourcing')) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30';
    if (topic.includes('s4hana')) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30';
    return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-white flex transition-colors duration-200">
      <Head>
        <title>News Event Mesh & Autonomous Agent Trigger | SentinelChain</title>
      </Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Radio className="w-5 h-5 animate-pulse" />
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  News Event Mesh & Agent Trigger
                </h1>
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SAP Event-Driven
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Autonomous real-time event broker. Ingests institutional signals, evaluates SAP S/4HANA BOM dependencies, and triggers multi-agent procurement recovery.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={loadMeshFeed}
                disabled={loadingSignals}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 text-slate-700 dark:text-gray-300 transition-all shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSignals ? 'animate-spin' : ''}`} /> Refresh Mesh
              </button>
            </div>
          </div>

          {/* Architecture Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Protocol</span>
              <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">CloudEvents v1.0 / AMQP</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">BOM Sensor</span>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">SAP S/4HANA API_PRODUCT_SRV</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Procurement Gateway</span>
              <p className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 mt-0.5">SAP Ariba Purchasing v2</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Active Agents</span>
              <p className="text-xs font-mono font-bold text-slate-800 dark:text-white mt-0.5">4 Autonomous Handlers</p>
            </div>
          </div>

          {/* MAIN 3-COLUMN WORKFLOW GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* COLUMN 1: INGESTION SENSOR STREAM (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" /> Ingested News & Signal Sensors
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400">{signals.length} Signals</span>
              </div>

              {/* Manual Event Injection Input */}
              <form onSubmit={handleInjectCustomSignal} className="p-3 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Inject Custom Signal Bulletin
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSignalText}
                    onChange={(e) => setCustomSignalText(e.target.value)}
                    placeholder="e.g. TSMC Fab 18 Power Outage halts 3nm wafer production..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!customSignalText.trim() || processingSignal}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>

              {/* Signals List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {signals.map((sig) => {
                  const isProcessing = processingSignal === sig.id;

                  return (
                    <div 
                      key={sig.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                          {sig.sourceTier || 'SIGNAL'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-gray-500">
                          {new Date(sig.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {sig.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 dark:text-gray-400 line-clamp-2">
                        {sig.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Conf: {sig.evidenceConfidence || 88}%
                        </span>

                        <button
                          onClick={() => handleTriggerMesh(sig)}
                          disabled={isProcessing}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-all shadow-xs disabled:opacity-50 active:scale-95"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3" /> Trigger Mesh Agents <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: REAL-TIME EVENT MESH TOPIC STREAM (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" /> Event Mesh Topic Stream
                </h3>
                <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">Live Broker Log</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-xs max-h-[660px] overflow-y-auto space-y-3 font-mono">
                {meshEvents.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <Radio className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse text-indigo-500" />
                    Listening for incoming News & BOM events...
                  </div>
                ) : (
                  meshEvents.map((evt, idx) => (
                    <div 
                      key={evt.id || idx}
                      className="p-3 rounded-lg border bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-white/10 space-y-1.5 text-xs animate-[fadeIn_0.2s_ease-out]"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTopicColor(evt.type)}`}>
                          {evt.type}
                        </span>
                        <span className="text-[9.5px] text-slate-400">
                          {new Date(evt.time).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-800 dark:text-gray-200 font-medium break-words">
                        {evt.data?.title || evt.data?.reason || evt.data?.action || evt.data?.replacementPart || JSON.stringify(evt.data)}
                      </p>

                      <div className="text-[9.5px] text-slate-400 dark:text-gray-500 flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/5">
                        <span>ID: {evt.id?.substring(0, 15)}...</span>
                        <span>v{evt.specversion}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: MULTI-AGENT EXECUTION TRAIL & PR GENERATOR (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Autonomous Agent Resolution
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">SAP Ariba PR</span>
              </div>

              {activeTriggerResult ? (
                <div className="p-5 rounded-xl bg-white dark:bg-[#0c1017] border-2 border-emerald-500/40 shadow-sm space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest">
                        {activeTriggerResult.isDisruption ? 'Disruption Resolved via AI Agents' : 'Signal Non-Disruptive'}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {activeTriggerResult.prNumber || 'BOM Secure'}
                      </h4>
                    </div>
                    {activeTriggerResult.isDisruption && (
                      <span className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    )}
                  </div>

                  {activeTriggerResult.isDisruption && (
                    <>
                      {/* Metric summary */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20">
                          <span className="text-[10px] text-red-600 font-bold uppercase">Revenue at Risk</span>
                          <p className="text-sm font-black text-red-600 mt-0.5">
                            ${activeTriggerResult.revenueAtRisk?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20">
                          <span className="text-[10px] text-emerald-600 font-bold uppercase">Recovered Value</span>
                          <p className="text-sm font-black text-emerald-600 mt-0.5">
                            ${activeTriggerResult.recoveredValue?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Disrupted vs Alternate Part */}
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Disrupted SAP Component:</span>
                          <span className="font-mono font-bold text-red-600">{activeTriggerResult.affectedPartNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Sourced Alternative:</span>
                          <span className="font-mono font-bold text-emerald-600">{activeTriggerResult.selectedAlternative?.alt_part_id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Selected Distributor:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{activeTriggerResult.selectedAlternative?.vendor}</span>
                        </div>
                      </div>

                      {/* Agent Trail Timeline */}
                      <div className="space-y-2">
                        <h5 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                          Agent Execution Steps:
                        </h5>
                        <div className="space-y-2 border-l-2 border-indigo-500/30 pl-3">
                          {activeTriggerResult.decisionTrail?.map((step, sIdx) => (
                            <div key={sIdx} className="text-xs space-y-0.5">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] block">
                                {step.agent}
                              </span>
                              <p className="text-[11px] text-slate-700 dark:text-gray-300 leading-snug">
                                {step.action}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                        <button
                          onClick={() => {
                            setSelectedAuditData(activeTriggerResult.recoveryRecord);
                            setShowPrModal(true);
                          }}
                          className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" /> View SAP Ariba PR Dossier
                        </button>

                        <Link href="/ledger" passHref legacyBehavior>
                          <a className="w-full py-2 px-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 text-slate-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                            View on Enterprise Ledger <ArrowRight className="w-3 h-3" />
                          </a>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-white dark:bg-[#0c1017] border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400 space-y-3">
                  <Cpu className="w-10 h-10 mx-auto text-slate-300 dark:text-gray-600" />
                  <p className="font-medium">
                    Select any signal on the left or inject a custom news event to trigger the autonomous multi-agent SAP resolution chain.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* SAP PR Dossier Export Modal */}
      <PrAuditExportModal 
        isOpen={showPrModal} 
        onClose={() => setShowPrModal(false)} 
        data={selectedAuditData} 
      />
    </div>
  );
}
