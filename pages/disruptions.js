import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldAlert, AlertTriangle, AlertCircle, Clock, ArrowRight, Activity, FileText, Database, Layers, CheckCircle2, TrendingUp, Search } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>Active Disruptions | SentinelChain</title>
        <meta name="description" content="Real-time multi-source institutional signals correlated with ERP S/4HANA production bills of materials." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-6 pb-24 min-w-0">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Continuous Risk Telemetry
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
                Active Supply Chain Disruptions
              </h1>
              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-2xl">
                Real-time multi-source institutional signals correlated with SAP S/4HANA production bills of materials.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/plans" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recovery Plans
              </Link>
              <Link href="/ledger" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-primary-600 dark:text-primary-400 shadow-2xs">
                <FileText className="w-3.5 h-3.5" /> Recovery Ledger
              </Link>
              <Link href="/risk" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-amber-600 dark:text-amber-400 shadow-2xs">
                <Activity className="w-3.5 h-3.5" /> Risk Matrix
              </Link>
            </div>
          </div>

          {/* Metric Overview Cards (PART 8.2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Total Active Signals</p>
              <div className="text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{disruptions.length}</div>
              <span className="text-[10.5px] text-secondary-400 mt-1 block">Institutional telemetry ingest</span>
            </div>
            
            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mb-1">Critical Tier ($2M+/day)</p>
              <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">{countCrit}</div>
              <span className="text-[10.5px] text-secondary-400 mt-1 block">Immediate plant threat</span>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mb-1">Elevated ($500K+/day)</p>
              <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">{countHigh}</div>
              <span className="text-[10.5px] text-secondary-400 mt-1 block">Production exposure</span>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">AI Mitigation Engine</p>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">100%</div>
              <span className="text-[10.5px] text-secondary-400 mt-1 block">Active SAP Ariba dispatch</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#111111] p-3.5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] shadow-2xs">
            <div className="flex items-center gap-2 w-full sm:w-80 px-3 py-1.5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg">
              <Search className="w-3.5 h-3.5 text-secondary-400" />
              <input 
                type="text"
                placeholder="Search by ID, MPN, or Event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterSeverity(tab)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                    filterSeverity === tab 
                      ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                      : 'bg-[#F8F9FA] dark:bg-[#161616] text-secondary-600 dark:text-secondary-400 border-[#E8E8E8] dark:border-[#262626] hover:border-[#D6D6D6] dark:hover:border-[#333333]'
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
                ? { label: 'Critical', color: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/40' }
                : (risk > 500000 
                    ? { label: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/40 dark:border-orange-900/40' }
                    : { label: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900/40' });

              return (
                <div 
                  key={i} 
                  id={d.disruption_id} 
                  className="bg-white dark:bg-[#111111] p-5 border border-[#E8E8E8] dark:border-[#222222] rounded-xl shadow-2xs hover:border-primary-300 dark:hover:border-primary-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border shrink-0 ${sev.color}`}>
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-secondary-900 dark:text-white flex items-center gap-2 text-sm leading-snug">
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
                          <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1 font-medium">
                            S/4HANA Revenue Exposure: <span className="font-bold text-red-600 dark:text-red-400">${risk.toLocaleString()}/day</span>
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded border ${sev.color}`}>
                        {sev.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-[#E8E8E8] dark:border-[#222222] text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-secondary-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(d.detected_at || Date.now()).toLocaleDateString()}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {d.recovery_plan_id && (
                        <Link 
                          href={`/plans?id=${d.recovery_plan_id}`} 
                          className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 bg-secondary-100 dark:bg-[#161616] hover:bg-primary-50 dark:hover:bg-primary-950/20 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all border border-[#E8E8E8] dark:border-[#262626]"
                        >
                          Plan
                        </Link>
                      )}
                      <Link 
                        href={`/disruptions/${d.disruption_id}`} 
                        className="btn-primary !h-8 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                      >
                        Decision Center <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
