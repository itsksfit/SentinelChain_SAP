import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Database, MapPin, TrendingUp, ShieldCheck, ShieldAlert, Activity, ArrowRight, CheckCircle2, FileText, Layers } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'vendors.json');
  const vendors = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  return { props: { vendors } };
}

export default function Network({ vendors }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (router.query.vendor) {
      setSearchQuery(router.query.vendor);
      setTimeout(() => {
        const el = document.getElementById(router.query.vendor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-indigo-50', 'dark:bg-indigo-900/20');
          setTimeout(() => el.classList.remove('bg-indigo-50', 'dark:bg-indigo-900/20'), 3000);
        }
      }, 500);
    }
  }, [router.query.vendor]);
  
  const avgHealth = Math.round(vendors.reduce((acc, v) => acc + v.reliability_score, 0) / vendors.length);
  const uniqueRegions = new Set(vendors.map(v => v.region)).size;
  
  const filteredVendors = vendors.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(q) || 
           v.region.toLowerCase().includes(q) || 
           v.vendor_id.toLowerCase().includes(q);
  }).sort((a,b) => b.reliability_score - a.reliability_score);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex text-gray-900 dark:text-white">
      <Head><title>Supply Network | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-5">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <Database className="w-7 h-7 text-cyan-500" /> Global Supply Network
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Franchised distributor health ratings, geographic fab telemetry, and autonomous spot capacity.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/disruptions" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Active Disruptions
              </Link>
              <Link href="/risk" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                <Activity className="w-3.5 h-3.5" /> Risk Analysis
              </Link>
              <Link href="/ledger" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <FileText className="w-3.5 h-3.5" /> Recovery Ledger
              </Link>
            </div>
          </div>

          {/* Metric Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Active Sourcing Channels</p>
              <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">{vendors.length} Distributors</div>
              <p className="text-[10px] text-gray-400 mt-1">Direct live API integration active</p>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-1">Avg Reliability Rating</p>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{avgHealth}%</div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Tier-1 franchised compliance</p>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-1">Global Sourcing Hubs</p>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{uniqueRegions} Continents</div>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">Americas, EMEA, APAC</p>
            </div>
          </div>

          {/* Search & Directory */}
          <div className="bg-white dark:bg-[#0f1115] p-6 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Supplier Directory & Live Health Matrix</h3>
                <p className="text-xs text-gray-500">Autonomous spot execution desks and pricing variance metrics.</p>
              </div>
              <input 
                type="text"
                placeholder="Search vendor name, region, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-3.5 py-1.5 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 px-4">Vendor ID</th>
                    <th className="pb-3 px-4">Supplier Name</th>
                    <th className="pb-3 px-4">Region</th>
                    <th className="pb-3 px-4">Spot Variance</th>
                    <th className="pb-3 px-4">Reliability Score</th>
                    <th className="pb-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredVendors.map((s, i) => (
                    <tr key={i} id={s.name} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{s.vendor_id}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${s.reliability_score >= 95 ? 'text-emerald-500' : 'text-yellow-500'}`} /> 
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300 font-medium">{s.region}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-700 dark:text-gray-300">
                        ±{s.price_variance_pct}% Spot SLA
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${s.reliability_score > 90 ? 'bg-emerald-500' : s.reliability_score > 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${s.reliability_score}%`}}></div>
                          </div>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">{s.reliability_score}/100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link 
                          href={`/disruptions?vendor=${encodeURIComponent(s.name)}`}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 inline-flex items-center gap-1 transition-all"
                        >
                          Disruptions <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
