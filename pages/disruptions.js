import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldAlert, AlertTriangle, AlertCircle, Clock, ArrowRight, Activity, FileText, Database, Layers, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StatusBadge from '../components/StatusBadge';

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex text-gray-900 dark:text-white">
      <Head><title>Active Disruptions | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-5">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <ShieldAlert className="w-7 h-7 text-red-500" /> Active Supply Chain Disruptions
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Real-time multi-source institutional signals correlated with ERP S/4HANA production bills of materials.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/plans" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recovery Plans
              </Link>
              <Link href="/ledger" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <FileText className="w-3.5 h-3.5" /> Recovery Ledger
              </Link>
              <Link href="/risk" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                <Activity className="w-3.5 h-3.5" /> Risk Analysis
              </Link>
            </div>
          </div>

          {/* Metric Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Total Active Signals</p>
              <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">{disruptions.length}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-red-500 dark:text-red-400 font-bold uppercase tracking-wider mb-1">Critical Tier ($2M+/day)</p>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">{countCrit}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-amber-500 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">Elevated ($500K+/day)</p>
              <div className="text-2xl font-black text-amber-500 font-mono">{countHigh}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">AI Mitigation Engine</p>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100% Live</div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#0f1115] p-3.5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <input 
              type="text"
              placeholder="Search by Disruption ID, Real Semiconductor MPN, or Event Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-3.5 py-1.5 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none text-gray-900 dark:text-white"
            />
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterSeverity(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                    filterSeverity === tab 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Disruptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDisruptions.map((d, i) => {
              const risk = d.revenue_at_risk_usd || 0;
              const sev = risk > 2000000 
                ? { label: 'Critical', color: 'text-red-500 border-red-500/20 bg-red-500/10' }
                : (risk > 500000 
                    ? { label: 'High', color: 'text-amber-500 border-amber-500/20 bg-amber-500/10' }
                    : { label: 'Medium', color: 'text-blue-500 border-blue-500/20 bg-blue-500/10' });

              return (
                <div key={i} id={d.disruption_id} className="bg-white dark:bg-[#0f1115] p-5 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${sev.color}`}>
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {d.disruption_id.includes('LIVE') && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>}
                            <span className="font-mono">{d.disruption_id}</span> • <span className="font-mono text-indigo-600 dark:text-indigo-400">{d.part_affected}</span>
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d.event_type} • S/4HANA Risk: <span className="font-bold text-red-600 dark:text-red-400">${risk.toLocaleString()}/day</span></p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${sev.color}`}>
                        {sev.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(d.detected_at || Date.now()).toLocaleDateString()}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {d.recovery_plan_id && (
                        <Link 
                          href={`/plans?id=${d.recovery_plan_id}`} 
                          className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 bg-gray-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2.5 py-1 rounded text-[11px] font-bold transition-all"
                        >
                          Plan
                        </Link>
                      )}
                      <Link 
                        href={`/disruptions/${d.disruption_id}`} 
                        className="text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
                      >
                        Decision Center <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
