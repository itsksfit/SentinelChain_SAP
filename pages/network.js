import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Database, MapPin, TrendingUp, ShieldCheck, ShieldAlert, Activity, ArrowRight, CheckCircle2, FileText, Layers, Search, ChevronRight, Globe, Zap, Filter } from 'lucide-react';
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
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  useEffect(() => {
    if (router.query.vendor) {
      setSearchQuery(router.query.vendor);
      setTimeout(() => {
        const el = document.getElementById(router.query.vendor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-primary-50', 'dark:bg-primary-950/30');
          setTimeout(() => el.classList.remove('bg-primary-50', 'dark:bg-primary-950/30'), 3000);
        }
      }, 500);
    }
  }, [router.query.vendor]);
  
  const avgHealth = Math.round(vendors.reduce((acc, v) => acc + v.reliability_score, 0) / vendors.length);
  const uniqueRegions = new Set(vendors.map(v => v.region)).size;
  
  const filteredVendors = vendors.filter(v => {
    if (selectedRegion !== 'ALL') {
      if (v.region.toUpperCase() !== selectedRegion) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(q) || 
           v.region.toLowerCase().includes(q) || 
           v.vendor_id.toLowerCase().includes(q);
  }).sort((a,b) => b.reliability_score - a.reliability_score);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Supply Network | SentinelChain</title>
        <meta name="description" content="Franchised distributor health ratings, geographic fab telemetry, and autonomous spot capacity." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-400 gap-2">
            <Link href="/" className="hover:text-primary-500 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white">Partner Network</span>
          </div>

          {/* Editorial Header */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  Tier-1 Sourcing Telemetry
                </span>
                <span className="text-xs font-mono font-bold text-secondary-400">
                  {vendors.length} Verified Distributors
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/disruptions" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-red-600 dark:text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5" /> Disruption Feed
                </Link>
                <Link href="/risk" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-amber-600 dark:text-amber-400">
                  <Activity className="w-3.5 h-3.5" /> Exposure Matrix
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Global <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Supply Network.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Franchised distributor health ratings, geographic semiconductor fab telemetry, and autonomous spot procurement integration across the Americas, EMEA, and APAC.
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Active Sourcing Channels</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{vendors.length}</span>
              <span className="text-xs text-secondary-400">Direct live API integrations active</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Mean Reliability Rating</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{avgHealth}%</span>
              <span className="text-xs text-secondary-400">Tier-1 franchised compliance score</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Geographic Sourcing Hubs</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">{uniqueRegions} Continents</span>
              <span className="text-xs text-secondary-400">Americas, EMEA, APAC regions</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Catalog Sync Latency</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">&lt; 120ms</span>
              <span className="text-xs text-secondary-400">Mouser live spot inventory pipeline</span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Regional Hub:
              </span>
              {[
                { id: 'ALL', label: `Global (${vendors.length})` },
                { id: 'AMERICAS', label: `Americas (${vendors.filter(v => v.region.toUpperCase() === 'AMERICAS').length})` },
                { id: 'EMEA', label: `EMEA (${vendors.filter(v => v.region.toUpperCase() === 'EMEA').length})` },
                { id: 'APAC', label: `APAC (${vendors.filter(v => v.region.toUpperCase() === 'APAC').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRegion(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                    selectedRegion === tab.id
                      ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 border-secondary-900 dark:border-white shadow-2xs'
                      : 'bg-[#F9FAFB] dark:bg-[#1C1D21] text-secondary-600 dark:text-secondary-400 border-[#E5E7EB] dark:border-[#262626] hover:border-[#D1D5DB] dark:hover:border-[#333333]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-80 flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] dark:bg-[#1C1D21] border border-[#E5E7EB] dark:border-[#262626] rounded-xl">
              <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
              <input 
                type="text"
                placeholder="Search vendor name, region, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-medium outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
            </div>
          </div>

          {/* Supplier Directory Table */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#262626] bg-[#F9FAFB] dark:bg-[#18191D] text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                    <th className="px-6 py-4">Vendor Identifier</th>
                    <th className="px-6 py-4">Distributor / Fab Name</th>
                    <th className="px-6 py-4">Regional Hub</th>
                    <th className="px-6 py-4">Spot Pricing SLA</th>
                    <th className="px-6 py-4">Reliability Rating</th>
                    <th className="px-6 py-4 text-right">Autonomous Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
                  {filteredVendors.map((s, i) => (
                    <tr key={i} id={s.name} className="hover:bg-secondary-50 dark:hover:bg-[#18191D] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary-600 dark:text-primary-400">
                        {s.vendor_id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className={`w-4 h-4 shrink-0 ${s.reliability_score >= 95 ? 'text-emerald-500' : 'text-amber-500'}`} />
                          <span className="font-extrabold text-secondary-900 dark:text-white text-sm">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-secondary-600 dark:text-secondary-300">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-800 text-[11px] font-bold">
                          <Globe className="w-3 h-3 text-secondary-400" /> {s.region}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-secondary-600 dark:text-secondary-400">
                        ±{s.price_variance_pct}% Spot Variance
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-2 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${s.reliability_score > 90 ? 'bg-emerald-500' : s.reliability_score > 80 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{width: `${s.reliability_score}%`}}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-secondary-900 dark:text-white">{s.reliability_score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/disruptions?search=${encodeURIComponent(s.name)}`} 
                          className="px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                        >
                          Matched Parts <ArrowRight className="w-3 h-3 text-primary-500" />
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
