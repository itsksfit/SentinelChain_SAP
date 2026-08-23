import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldAlert, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

export default function Disruptions() {
  const disruptions = [
    { id: "DSP-092", part: "MCU-2201X", type: "Export Ban", severity: "CRITICAL", time: "2 hours ago", status: "Mitigating", products: 2 },
    { id: "DSP-091", part: "PWR-9942A", type: "Factory Fire", severity: "HIGH", time: "14 hours ago", status: "Assessing", products: 1 },
    { id: "DSP-088", part: "MEM-64GB-NAND", type: "Material Shortage", severity: "MEDIUM", time: "2 days ago", status: "Resolved", products: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] flex">
      <Head><title>Active Disruptions | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Active Disruptions</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time monitoring of supply chain anomalies.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm font-medium">1 Critical</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-sm font-medium">1 High</span>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Component</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Type</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detected</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {disruptions.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-100 dark:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300">{d.id}</td>
                    <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">{d.part}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{d.type}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 w-max px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        d.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                        d.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {d.severity === 'CRITICAL' ? <AlertTriangle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {d.severity}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {d.time}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${d.status === 'Resolved' ? 'text-emerald-400 bg-emerald-500/10' : 'text-indigo-400 bg-indigo-500/10'}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
