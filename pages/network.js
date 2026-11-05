import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Database, MapPin, TrendingUp, ShieldCheck, ShieldAlert, Activity, ArrowRight, CheckCircle2, FileText, Layers, Search } from 'lucide-react';
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
          el.classList.add('bg-primary-50', 'dark:bg-primary-950/20');
          setTimeout(() => el.classList.remove('bg-primary-50', 'dark:bg-primary-950/20'), 3000);
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>Supply Network | SentinelChain</title>
        <meta name="description" content="Franchised distributor health ratings, geographic fab telemetry, and autonomous spot capacity." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-6 pb-24 min-w-0">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                Tier-1 / Franchised Sourcing Telemetry
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
                Global Supply Network
              </h1>
              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-2xl">
                Franchised distributor health ratings, geographic semiconductor telemetry, and autonomous spot capacity.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/disruptions" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-red-600 dark:text-red-400 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5" /> Active Disruptions
              </Link>
              <Link href="/risk" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-amber-600 dark:text-amber-400 shadow-2xs">
                <Activity className="w-3.5 h-3.5" /> Risk Matrix
              </Link>
              <Link href="/ledger" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-primary-600 dark:text-primary-400 shadow-2xs">
                <FileText className="w-3.5 h-3.5" /> Recovery Ledger
              </Link>
            </div>
          </div>

          {/* Metric Overview (PART 8.2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Active Sourcing Channels</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{vendors.length} Distributors</div>
              <p className="text-[10.5px] text-secondary-400 mt-1">Direct live API integration active</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Avg Reliability Rating</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{avgHealth}%</div>
              <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Tier-1 franchised compliance</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-1">Global Sourcing Hubs</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-500 tracking-tight">{uniqueRegions} Continents</div>
              <p className="text-[10.5px] text-primary-600 dark:text-primary-400 font-bold mt-1">Americas, EMEA, APAC</p>
            </div>
          </div>

          {/* Search & Directory Table (PART 9.2) */}
          <div className="bg-white dark:bg-[#111111] p-5 sm:p-6 border border-[#E8E8E8] dark:border-[#222222] rounded-xl shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8E8E8] dark:border-[#222222] pb-4">
              <div>
                <h3 className="text-base font-bold text-secondary-900 dark:text-white">Supplier Directory & Live Health Matrix</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">Autonomous spot execution desks and pricing variance metrics.</p>
              </div>

              <div className="w-full sm:w-72 flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg">
                <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                <input 
                  type="text"
                  placeholder="Search vendor name, region, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E8] dark:border-[#222222] text-[11px] font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider bg-[#F8F9FA] dark:bg-[#161616]">
                    <th className="py-3 px-4">Vendor ID</th>
                    <th className="py-3 px-4">Supplier Name</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Spot Variance</th>
                    <th className="py-3 px-4">Reliability Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] dark:divide-[#222222]">
                  {filteredVendors.map((s, i) => (
                    <tr key={i} id={s.name} className="hover:bg-secondary-50 dark:hover:bg-[#161616] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary-600 dark:text-primary-400">{s.vendor_id}</td>
                      <td className="py-3.5 px-4 font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${s.reliability_score >= 95 ? 'text-emerald-500' : 'text-amber-500'}`} /> 
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 text-secondary-600 dark:text-secondary-300 font-medium">{s.region}</td>
                      <td className="py-3.5 px-4 font-mono text-secondary-600 dark:text-secondary-300">
                        ±{s.price_variance_pct}% Spot SLA
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden">
                            <div className={`h-full ${s.reliability_score > 90 ? 'bg-emerald-500' : s.reliability_score > 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${s.reliability_score}%`}}></div>
                          </div>
                          <span className="font-mono font-bold text-secondary-900 dark:text-white">{s.reliability_score}/100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link 
                          href={`/disruptions?vendor=${encodeURIComponent(s.name)}`}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40 inline-flex items-center gap-1 transition-all"
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
        </main>
      </div>
    </div>
  );
}
