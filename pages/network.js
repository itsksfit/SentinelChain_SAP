import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Database, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Network() {
  const suppliers = [
    { name: "Distributor A", region: "Taiwan", health: 98, tier: 1, volume: "$4.2M" },
    { name: "PowerGlobal Inc.", region: "Germany", health: 92, tier: 1, volume: "$8.5M" },
    { name: "GlobalChips", region: "South Korea", health: 85, tier: 2, volume: "$1.1M" },
    { name: "ElectroSource", region: "USA", health: 99, tier: 1, volume: "$12.4M" },
    { name: "StorageTech", region: "Japan", health: 76, tier: 2, volume: "$850K" },
  ];

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
              <p className="text-gray-500 dark:text-gray-400 mt-1">Global vendor mapping and supplier health tracking.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="glass-panel p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2"><Database className="w-4 h-4" /> Active Suppliers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">1,402</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4" /> Network Health</p>
              <p className="text-3xl font-bold text-emerald-400">92%</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2"><MapPin className="w-4 h-4" /> Geographies</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">34 Countries</p>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Critical Tier-1 & Tier-2 Suppliers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Supplier Name</th>
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3">Annual Volume</th>
                    <th className="pb-3">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {suppliers.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-100 dark:bg-white/5">
                      <td className="py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400" /> {s.name}</td>
                      <td className="py-4 text-gray-700 dark:text-gray-300">{s.region}</td>
                      <td className="py-4 text-gray-700 dark:text-gray-300">Tier {s.tier}</td>
                      <td className="py-4 font-mono text-gray-700 dark:text-gray-300">{s.volume}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${s.health > 90 ? 'bg-emerald-500' : s.health > 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${s.health}%`}}></div>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{s.health}/100</span>
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
