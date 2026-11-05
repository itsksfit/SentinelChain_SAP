import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldAlert, AlertTriangle, AlertCircle, Clock, ArrowRight, Activity, FileText, Database, Layers, CheckCircle2, TrendingUp, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StatusBadge from '../components/StatusBadge';
import SourceRegistryScraperModal from '../components/SourceRegistryScraperModal';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  return {
    props: {
      initialDisruptions: data
    }
  };
}

export default function Disruptions({ initialDisruptions }) {
  const [disruptions, setDisruptions] = useState(initialDisruptions);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [selectedSignalForScrape, setSelectedSignalForScrape] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      if (custom.length > 0) {
        setDisruptions([...custom, ...initialDisruptions]);
      }
    } catch(e) {}
  }, [initialDisruptions]);
  
  useEffect(() => {
    if (router.query.id) {
      setTimeout(() => {
        const el = document.getElementById(router.query.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
    if (router.query.vendor) {
      setSearchQuery(router.query.vendor);
    }
  }, [router.query.id, router.query.vendor]);

  const countCrit = disruptions.filter(d => (d.revenue_at_risk_usd || 0) > 2000000 && !d.status.includes('Resolved') && !d.status.includes('Completed')).length;
  const countHigh = disruptions.filter(d => (d.revenue_at_risk_usd || 0) > 500000 && (d.revenue_at_risk_usd || 0) <= 2000000 && !d.status.includes('Resolved') && !d.status.includes('Completed')).length;

  const filteredDisruptions = disruptions.filter(d => {
    const matchesSearch = !searchQuery || 
      d.disruption_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.part_affected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.event_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterSeverity === 'CRITICAL') return (d.revenue_at_risk_usd || 0) > 2000000;
    if (filterSeverity === 'HIGH') return (d.revenue_at_risk_usd || 0) > 500000 && (d.revenue_at_risk_usd || 0) <= 2000000;
    if (filterSeverity === 'MEDIUM') return (d.revenue_at_risk_usd || 0) <= 500000;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Active Disruptions | SentinelChain</title>
        <meta name="description" content="Real-time multi-source institutional signals correlated with ERP S/4HANA production bills of materials." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-10 pb-28 min-w-0">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-[10.5px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                Continuous Risk Telemetry Active
              </div>

              {/* Cross-Module Shortcuts */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/plans" className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-[#181818] transition-all flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Recovery Plans
                </Link>
                <Link href="/ledger" className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-[#181818] transition-all flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300 shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-primary-500" /> Sourcing Ledger
                </Link>
                <Link href="/risk" className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-[#181818] transition-all flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300 shadow-2xs">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> Risk Matrix
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Active Supply Chain <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Disruptions.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Real-time multi-source institutional signals correlated deterministically with internal SAP S/4HANA production bills of materials.
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Total Active Signals</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{disruptions.length}</span>
              <span className="text-xs text-secondary-400">Institutional telemetry ingest</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">Critical ($2M+/day)</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">{countCrit}</span>
              <span className="text-xs text-secondary-400">Immediate plant shutdown risk</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">Elevated ($500K+/day)</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">{countHigh}</span>
              <span className="text-xs text-secondary-400">Production exposure mapped</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">AI Mitigation Engine</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">100%</span>
              <span className="text-xs text-secondary-400">Automated Mouser spot discovery</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
            <div className="flex items-center gap-2.5 w-full sm:w-96 px-3.5 py-2 bg-[#FAFAFA] dark:bg-[#181818] border border-[#E5E7EB] dark:border-[#262626] rounded-xl">
              <Search className="w-4 h-4 text-secondary-400" />
              <input 
                type="text"
                placeholder="Search by ID, Part Number (e.g. STM32), or Event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterSeverity(tab)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                    filterSeverity === tab 
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-secondary-900 border-[#111111] dark:border-white shadow-xs'
                      : 'bg-[#FAFAFA] dark:bg-[#181818] text-secondary-600 dark:text-secondary-400 border-[#E5E7EB] dark:border-[#262626] hover:border-[#D6D6D6]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Disruptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDisruptions.map((d, i) => {
              const risk = d.revenue_at_risk_usd || 0;
              const sev = risk > 2000000 
                ? { label: 'Critical', color: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/40' }
                : (risk > 500000 
                    ? { label: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/40 dark:border-orange-900/40' }
                    : { label: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900/40' });

              return (
                <div 
                  key={i} 
                  id={d.disruption_id} 
                  className="bg-white dark:bg-[#141414] p-6 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl shadow-sm hover:border-primary-400 dark:hover:border-primary-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${sev.color}`}>
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-secondary-900 dark:text-white flex items-center gap-2 text-base leading-snug">
                            {d.disruption_id.includes('LIVE') && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>
                            )}
                            <span className="font-mono">{d.disruption_id}</span>
                            <span className="text-secondary-300 dark:text-secondary-600">•</span>
                            <span className="font-mono text-primary-600 dark:text-primary-400">{d.part_affected}</span>
                          </h3>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                            {d.event_type}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${sev.color}`}>
                        {sev.label}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E5E7EB] dark:border-[#262626] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-500">Daily Revenue Exposure:</span>
                        <span className="font-bold text-red-600 dark:text-red-400 font-mono">${risk.toLocaleString()} / day</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-500">Impacted Plant Line:</span>
                        <span className="font-bold text-secondary-900 dark:text-white font-mono">{d.bom_affected || 'BOM-IND-4091'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-500">Sourcing Availability:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Qualified Mouser Stock Ready</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#262626] text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-secondary-400 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(d.detected_at || Date.now()).toLocaleDateString()}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSignalForScrape(d);
                          setShowScraperModal(true);
                        }}
                        className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 bg-[#FAFAFA] dark:bg-[#181818] hover:bg-primary-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-[#E5E7EB] dark:border-[#262626] flex items-center gap-1.5 cursor-pointer"
                        title="View scraped source registry telemetry"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-primary-500" />
                        <span>Source Registry</span>
                      </button>

                      {d.recovery_plan_id && (
                        <Link 
                          href={`/plans?id=${d.recovery_plan_id}`} 
                          className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 bg-[#FAFAFA] dark:bg-[#181818] hover:bg-primary-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-[#E5E7EB] dark:border-[#262626]"
                        >
                          Plan
                        </Link>
                      )}
                      <Link 
                        href={`/disruptions/${d.disruption_id}`} 
                        className="px-4 py-2 bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-secondary-100 text-white dark:text-secondary-900 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        Decision Center <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>

      <SourceRegistryScraperModal 
        isOpen={showScraperModal} 
        onClose={() => setShowScraperModal(false)} 
        signal={selectedSignalForScrape} 
      />
    </div>
  );
}
