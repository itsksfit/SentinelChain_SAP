import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Activity, AlertTriangle, TrendingUp, Globe } from 'lucide-react';

export default function Risk() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex">
      <Head><title>Risk Analysis | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Predictive Risk Analysis</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">AI-driven geopolitical, climate, and logistical risk evaluation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass-panel p-5 border-l-4 border-orange-500 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-4 border-orange-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-orange-500/40 animate-[ping_3s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 relative z-10">Global Risk Index</p>
              <div className="flex items-end gap-2 relative z-10 mt-2">
                <p className="text-4xl font-bold text-orange-400 leading-none">74</p>
                <p className="text-sm font-normal text-gray-500 mb-1">/ 100</p>
              </div>
            </div>
            <div className="glass-panel p-5 border-l-4 border-indigo-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Monitored Nodes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4,281</p>
            </div>
            <div className="glass-panel p-5 border-l-4 border-red-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-400 flex items-center gap-2">3 <AlertTriangle className="w-4 h-4" /></p>
            </div>
            <div className="glass-panel p-5 border-l-4 border-emerald-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Mitigated Value</p>
              <p className="text-2xl font-bold text-emerald-400">$14.2M</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Geopolitical Risk Radar</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">East Asia (Export Controls)</span>
                    <span className="text-red-400 font-bold">High</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full"><div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">European Ports (Labor Strikes)</span>
                    <span className="text-orange-400 font-bold">Medium</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full"><div className="bg-orange-500 h-2 rounded-full" style={{width: '60%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">North America (Logistics)</span>
                    <span className="text-emerald-400 font-bold">Low</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '20%'}}></div></div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> AI Threat Intelligence</h3>
              <ul className="space-y-3">
                <li className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm font-bold text-red-400 mb-1">New Export Restrictions Drafted</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Intelligence models detect a 92% probability of new MCU export restrictions within 72 hours.</p>
                </li>
                <li className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm font-bold text-orange-400 mb-1">Rare-Earth Supply Constraints</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Global tracking indicates a 15% reduction in available NAND flash memory inventory across tier-1 suppliers.</p>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
                  <p className="text-sm font-bold text-indigo-400 mb-1">Supplier Health Upgraded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Distributor A has expanded warehousing capacity in Taiwan, decreasing average lead time by 2 days.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
