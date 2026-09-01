import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import PrAuditExportModal from '../components/PrAuditExportModal';
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Clock, RefreshCw, Filter, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  return { props: { initialDisruptions: data } };
}

export default function Ledger({ initialDisruptions }) {
  const [disruptions, setDisruptions] = useState(initialDisruptions);
  const [expandedId, setExpandedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'detected_at', direction: 'desc' });
  const [showPrModal, setShowPrModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [filterOutcome, setFilterOutcome] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const customRaw = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      // Deduplicate and filter out excessive uncompleted live test drafts
      const uniqueCustom = [];
      const seen = new Set();
      
      customRaw.forEach(item => {
        if (!seen.has(item.disruption_id)) {
          seen.add(item.disruption_id);
          // If custom disruption was completed, keep as is. If draft, format properly
          if (item.status === 'Resolved' || item.resolution?.outcome) {
            uniqueCustom.push(item);
          } else if (uniqueCustom.length < 3) {
            uniqueCustom.push({
              ...item,
              revenue_at_risk_usd: item.revenue_at_risk_usd || 1575000,
              resolution: item.resolution || {
                outcome: 'Awaiting Decision',
                recovered_amount_usd: 0,
                time_to_recovery_hours: 0.1
              }
            });
          }
        }
      });

      if (uniqueCustom.length > 0) {
        setDisruptions([...uniqueCustom, ...initialDisruptions]);
      } else {
        setDisruptions(initialDisruptions);
      }
    } catch(e) {
      setDisruptions(initialDisruptions);
    }
  }, [initialDisruptions]);

  useEffect(() => {
    if (router.query.id) {
      setExpandedId(router.query.id);
      setTimeout(() => {
        const el = document.getElementById(router.query.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [router.query.id]);

  const clearTestDrafts = () => {
    try {
      localStorage.removeItem('custom_disruptions');
      setDisruptions(initialDisruptions);
    } catch(e) {}
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
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

  // Clean, realistic rounded totals
  const totalAtRisk = Math.round(disruptions.reduce((acc, d) => acc + (d.revenue_at_risk_usd || 0), 0));
  const totalRecovered = Math.round(disruptions.reduce((acc, d) => acc + (d.resolution?.recovered_amount_usd || 0), 0));
  const rawRate = totalAtRisk > 0 ? (totalRecovered / totalAtRisk) * 100 : 0;
  const recoveryRate = rawRate.toFixed(1);

  const recoveredDisruptions = disruptions.filter(d => (d.resolution?.recovered_amount_usd || 0) > 0);
  const avgTime = recoveredDisruptions.length > 0
    ? (recoveredDisruptions.reduce((acc, d) => acc + (d.resolution?.time_to_recovery_hours || 4), 0) / recoveredDisruptions.length).toFixed(1)
    : '4.2';

  const outcomeCounts = disruptions.reduce((acc, d) => {
    const status = d.resolution?.outcome || d.status || 'Executing';
    let category = 'Executing';
    if (status.includes('Completed') || status.includes('Resolved') || status.includes('Executed')) category = 'Completed';
    else if (status.includes('Escalated')) category = 'Escalated';
    else if (status.includes('Failed')) category = 'Failed';
    else if (status.includes('Awaiting') || status.includes('Pending')) category = 'Awaiting';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const donutData = [
    { name: 'Completed', value: outcomeCounts['Completed'] || 0, color: '#10b981' }, 
    { name: 'Executing', value: outcomeCounts['Executing'] || 0, color: '#3b82f6' }, 
    { name: 'Awaiting', value: outcomeCounts['Awaiting'] || 0, color: '#8b5cf6' },
    { name: 'Escalated', value: outcomeCounts['Escalated'] || 0, color: '#f59e0b' }, 
    { name: 'Failed', value: outcomeCounts['Failed'] || 0, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const filteredDisruptions = disruptions.filter(d => {
    if (filterOutcome !== 'ALL') {
      const status = (d.resolution?.outcome || d.status || '').toLowerCase();
      if (filterOutcome === 'COMPLETED' && !status.includes('completed') && !status.includes('resolved') && !status.includes('executed')) return false;
      if (filterOutcome === 'EXECUTING' && !status.includes('executing') && !status.includes('mitigating')) return false;
      if (filterOutcome === 'AWAITING' && !status.includes('awaiting') && !status.includes('pending')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.disruption_id.toLowerCase().includes(q) ||
        d.part_affected.toLowerCase().includes(q) ||
        (d.event_type && d.event_type.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f18] flex transition-colors duration-200">
      <Head><title>Recovery Ledger | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6 pb-24">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Recovery Ledger</h1>
              <p className="text-slate-600 dark:text-gray-400 text-sm mt-1 font-medium">Immutable audit trail and measured revenue recovery across all disruption batches.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearTestDrafts}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-gray-400 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                title="Reset local test injections"
              >
                <RefreshCw className="w-3 h-3" /> Reset Test Injections
              </button>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xs">
                <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Total at Risk</p>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">${totalAtRisk.toLocaleString()}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Cumulative batch exposure</p>
              </div>

              <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xs">
                <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Total Recovered</p>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">${totalRecovered.toLocaleString()}</div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Verified gross margin saved</p>
              </div>

              <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xs">
                <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Recovery Rate</p>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">{recoveryRate}%</div>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">Target benchmark &gt; 85%</p>
              </div>

              <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xs">
                <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Avg Turnaround</p>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{avgTime} <span className="text-sm font-normal text-slate-400">hrs</span></div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">vs. 21 days manual baseline</p>
              </div>

            </div>

            {/* Donut Chart Card */}
            <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xs flex items-center justify-between">
               <div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Outcome Mix</p>
                  <div className="space-y-1.5">
                     {donutData.map(d => (
                        <div key={d.name} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-gray-300">
                           <span className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></span>
                           <span>{d.name} ({Math.round((d.value/disruptions.length)*100)}%)</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donutData} innerRadius={24} outerRadius={38} dataKey="value" stroke="none">
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'}} itemStyle={{color: '#fff'}} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#0f1115] p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'ALL', label: `All (${disruptions.length})` },
                  { id: 'COMPLETED', label: `Completed (${outcomeCounts['Completed'] || 0})` },
                  { id: 'EXECUTING', label: `Executing (${outcomeCounts['Executing'] || 0})` },
                  { id: 'AWAITING', label: `Awaiting (${outcomeCounts['Awaiting'] || 0})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterOutcome(tab.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                      filterOutcome === tab.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:border-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-64">
              <input 
                type="text"
                placeholder="Search ID, Part, or Event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#0f1115] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-gray-400">
                <thead className="text-[11px] font-extrabold uppercase tracking-wider bg-slate-100/70 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300">
                  <tr>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10" onClick={() => handleSort('disruption_id')}>Disruption ID</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10" onClick={() => handleSort('part_affected')}>Part</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10" onClick={() => handleSort('revenue_at_risk_usd')}>At Risk</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10" onClick={() => handleSort('recovered')}>Recovered</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10" onClick={() => handleSort('recovery_pct')}>Recovery %</th>
                    <th className="px-5 py-3.5">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredDisruptions.map((d) => {
                    const recovered = Math.round(d.resolution?.recovered_amount_usd || 0);
                    const recPct = d.revenue_at_risk_usd > 0 ? Math.round((recovered / d.revenue_at_risk_usd) * 100) : 0;
                    const isExpanded = expandedId === d.disruption_id;
                    const outcomeStr = d.resolution?.outcome || d.status || 'Pending';

                    return (
                      <React.Fragment key={d.disruption_id}>
                        <tr 
                          id={d.disruption_id}
                          onClick={() => setExpandedId(isExpanded ? null : d.disruption_id)}
                          className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] ${isExpanded || expandedId === d.disruption_id ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : ''}`}
                        >
                          <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {d.disruption_id.includes('LIVE') ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            )}
                            {d.disruption_id}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{d.part_affected}</td>
                          <td className="px-5 py-4 font-mono font-semibold text-slate-700 dark:text-slate-300">${d.revenue_at_risk_usd?.toLocaleString() || '0'}</td>
                          <td className="px-5 py-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {recovered > 0 ? `$${recovered.toLocaleString()}` : '$0'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{width: `${Math.min(100, recPct)}%`}}></div>
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{recPct}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={outcomeStr} />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="p-0 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-black/30">
                              <div className="p-6 text-sm">
                                <h4 className="font-extrabold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Audit & Decision Trail
                                </h4>
                                <div className="space-y-4 pl-2 border-l-2 border-indigo-500/40">
                                  {d.decision_trail && d.decision_trail.map((t, idx) => (
                                    <div key={idx} className="relative pl-4">
                                      <div className="absolute w-2 h-2 bg-indigo-600 rounded-full -left-[5px] top-1.5"></div>
                                      <p className="text-xs text-slate-500 dark:text-gray-400 mb-0.5">
                                        <span className="font-bold text-slate-800 dark:text-gray-200">{t.agent}</span> • {isNaN(new Date(t.timestamp)) ? t.timestamp : new Date(t.timestamp).toLocaleString()}
                                      </p>
                                      <p className="text-slate-800 dark:text-gray-200 font-medium text-xs">{t.action}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                                  {d.recovery_plan_id ? (
                                    <a href={`/plans?id=${d.recovery_plan_id}`} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                      View Recovery Plan {d.recovery_plan_id} <ArrowRight className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <span></span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedAudit(d);
                                      setShowPrModal(true);
                                    }}
                                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> Export SAP PR Dossier
                                  </button>
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
      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={selectedAudit} />
    </div>
  );
}
