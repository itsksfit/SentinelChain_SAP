import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Database, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (router.query.vendor) {
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
  
  // Calculate aggregate metrics from vendors.json
  const avgHealth = Math.round(vendors.reduce((acc, v) => acc + v.reliability_score, 0) / vendors.length);
  const uniqueRegions = new Set(vendors.map(v => v.region)).size;
  
  // Sort vendors by reliability
  const sortedVendors = [...vendors].sort((a,b) => b.reliability_score - a.reliability_score);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head><title>Supply Network | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Supply Network</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Global vendor mapping, pricing variance, and supplier health tracking based on active catalogs.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Catalog Suppliers</p>
              <div className="text-[24px] font-bold text-gray-900 dark:text-white">{vendors.length}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Avg Network Health</p>
              <div className="text-[24px] font-bold text-gray-900 dark:text-white">{avgHealth}%</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Regions Active</p>
              <div className="text-[24px] font-bold text-gray-900 dark:text-white">{uniqueRegions}</div>
            </div>
          </div>

          <div className="glass-panel p-6 border border-gray-200 dark:border-white/10 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Supplier Directory & Health Ratings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 px-4">Vendor ID</th>
                    <th className="pb-3 px-4">Supplier Name</th>
                    <th className="pb-3 px-4">Region</th>
                    <th className="pb-3 px-4">Price Variance</th>
                    <th className="pb-3 px-4">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {sortedVendors.map((s, i) => (
                    <tr key={i} id={s.name} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-indigo-400">{s.vendor_id}</td>
                      <td className="py-4 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${s.reliability_score >= 95 ? 'text-emerald-500' : 'text-yellow-500'}`} /> 
                        {s.name}
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{s.region}</td>
                      <td className="py-4 px-4 font-mono text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        ±{s.price_variance_pct}%
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${s.reliability_score > 90 ? 'bg-emerald-500' : s.reliability_score > 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${s.reliability_score}%`}}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.reliability_score}/100</span>
                        </div>
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
