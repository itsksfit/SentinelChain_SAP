import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Activity, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import batchData from '../data/disruption-batch.json';

export default function Ledger() {
  const [disruptions, setDisruptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'detected_at', direction: 'desc' });

  useEffect(() => {
    setDisruptions(batchData);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...disruptions].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'recovered') {
        aVal = a.resolution?.recovered_amount_usd || 0;
        bVal = b.resolution?.recovered_amount_usd || 0;
      }
      if (key === 'recovery_pct') {
        aVal = a.revenue_at_risk_usd > 0 ? ((a.resolution?.recovered_amount_usd || 0) / a.revenue_at_risk_usd) : 0;
        bVal = b.revenue_at_risk_usd > 0 ? ((b.resolution?.recovered_amount_usd || 0) / b.revenue_at_risk_usd) : 0;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setDisruptions(sortedData);
  };

  // Summaries
  const totalAtRisk = disruptions.reduce((acc, d) => acc + (d.revenue_at_risk_usd || 0), 0);
  const totalRecovered = disruptions.reduce((acc, d) => acc + (d.resolution?.recovered_amount_usd || 0), 0);
  const recoveryRate = totalAtRisk > 0 ? ((totalRecovered / totalAtRisk) * 100).toFixed(1) : 0;
  
  const recoveredDisruptions = disruptions.filter(d => d.resolution?.time_to_recovery_hours > 0);
  const avgTime = recoveredDisruptions.length > 0 
    ? (recoveredDisruptions.reduce((acc, d) => acc + d.resolution.time_to_recovery_hours, 0) / recoveredDisruptions.length).toFixed(1)
    : 0;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Escalated': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'Resolved': return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f18] flex">
      <Head><title>Recovery Ledger | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Recovery Ledger</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Audit trail and measured revenue recovery across all disruption batches.</p>
          </div>

          {/* Summary Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-5 border border-gray-200 dark:border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Total at Risk
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalAtRisk.toLocaleString()}</div>
            </div>
            <div className="glass-panel p-5 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium uppercase tracking-wider">
                <DollarSign className="w-4 h-4" /> Total Recovered
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalRecovered.toLocaleString()}</div>
            </div>
            <div className="glass-panel p-5 border border-gray-200 dark:border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                <Activity className="w-4 h-4" /> Recovery Rate
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{recoveryRate}%</div>
            </div>
            <div className="glass-panel p-5 border border-gray-200 dark:border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                <Clock className="w-4 h-4" /> Avg Time to Recovery
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgTime} hrs</div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="glass-panel rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => handleSort('disruption_id')}>Disruption ID</th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => handleSort('part_affected')}>Part</th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => handleSort('revenue_at_risk_usd')}>At Risk</th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => handleSort('recovered')}>Recovered</th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => handleSort('recovery_pct')}>Recovery %</th>
                    <th className="px-4 py-3">Outcome / Status</th>
                  </tr>
                </thead>
                <tbody>
                  {disruptions.map((d) => {
                    const recovered = d.resolution?.recovered_amount_usd || 0;
                    const recPct = d.revenue_at_risk_usd > 0 ? Math.round((recovered / d.revenue_at_risk_usd) * 100) : 0;
                    const isExpanded = expandedId === d.disruption_id;

                    return (
                      <React.Fragment key={d.disruption_id}>
                        <tr 
                          onClick={() => setExpandedId(isExpanded ? null : d.disruption_id)}
                          className={`border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${isExpanded ? 'bg-gray-50 dark:bg-white/[0.02]' : ''}`}
                        >
                          <td className="px-4 py-4 font-mono font-medium text-gray-900 dark:text-white">{d.disruption_id}</td>
                          <td className="px-4 py-4">{d.part_affected}</td>
                          <td className="px-4 py-4">${d.revenue_at_risk_usd.toLocaleString()}</td>
                          <td className="px-4 py-4 font-medium text-emerald-600 dark:text-emerald-400">${recovered.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{width: `${recPct}%`}}></div>
                              </div>
                              <span className="text-xs">{recPct}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 font-medium">
                              {getStatusIcon(d.status)}
                              <span className={d.status === 'Escalated' ? 'text-orange-500' : 'text-gray-900 dark:text-white'}>{d.status}</span>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="p-0 border-b border-gray-200 dark:border-white/10">
                              <div className="p-6 bg-gray-50/50 dark:bg-black/20 text-sm">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                  Audit & Decision Trail
                                </h4>
                                <div className="space-y-3 pl-2 border-l-2 border-indigo-500/30">
                                  {d.decision_trail.map((t, idx) => (
                                    <div key={idx} className="relative pl-4">
                                      <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-1.5"></div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{t.agent}</span> • {new Date(t.timestamp).toLocaleString()}
                                      </p>
                                      <p className="text-gray-800 dark:text-gray-200">{t.action}</p>
                                      <p className="text-[10px] font-mono text-gray-500 mt-1 flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3" /> Source: {t.data_used}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
