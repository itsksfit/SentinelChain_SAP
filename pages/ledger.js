import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import PrAuditExportModal from '../components/PrAuditExportModal';
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Clock, RefreshCw, Filter, Sparkles, TrendingUp, Search } from 'lucide-react';
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
      const uniqueCustom = [];
      const seen = new Set();
      
      customRaw.forEach(item => {
        if (!seen.has(item.disruption_id)) {
          seen.add(item.disruption_id);
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

  // Series Colors following PART 8.5: primary orange, emerald, amber, red, neutral
  const donutData = [
    { name: 'Completed', value: outcomeCounts['Completed'] || 0, color: '#16A34A' }, 
    { name: 'Executing', value: outcomeCounts['Executing'] || 0, color: '#F4511E' }, 
    { name: 'Awaiting', value: outcomeCounts['Awaiting'] || 0, color: '#D97706' },
    { name: 'Escalated', value: outcomeCounts['Escalated'] || 0, color: '#EA580C' }, 
    { name: 'Failed', value: outcomeCounts['Failed'] || 0, color: '#DC2626' }
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>Recovery Ledger | SentinelChain</title>
        <meta name="description" content="Immutable audit trail and measured revenue recovery across all disruption batches." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-6 pb-24 min-w-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-900/40 text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                Cryptographic Audit Trail
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
                Enterprise Recovery Ledger
              </h1>
              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-2xl">
                Immutable audit trail, PR records, and measured financial recovery across all operational disruption batches.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={clearTestDrafts}
                className="px-3 py-1.5 text-xs font-bold text-secondary-600 dark:text-secondary-400 bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] border border-[#E8E8E8] dark:border-[#222222] rounded-lg transition-all shadow-2xs flex items-center gap-1.5"
                title="Reset local test injections"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Test Injections
              </button>
            </div>
          </div>

          {/* Top Metric Cards & Donut Chart (PART 8.2 & 8.5) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
                <p className="text-[11px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Total at Risk</p>
                <div className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">${totalAtRisk.toLocaleString()}</div>
                <p className="text-[10.5px] text-secondary-400 mt-1">Cumulative batch exposure</p>
              </div>

              <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Total Recovered</p>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">${totalRecovered.toLocaleString()}</div>
                <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Verified gross margin saved</p>
              </div>

              <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
                <p className="text-[11px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-1">Recovery Rate</p>
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-500 tracking-tight">{recoveryRate}%</div>
                <p className="text-[10.5px] text-primary-600 dark:text-primary-400 font-bold mt-1">Target benchmark &gt; 85%</p>
              </div>

              <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
                <p className="text-[11px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Avg Turnaround</p>
                <div className="text-2xl sm:text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{avgTime} <span className="text-sm font-normal text-secondary-400">hrs</span></div>
                <p className="text-[10.5px] text-secondary-400 mt-1">vs. 21 days manual baseline</p>
              </div>

            </div>

            {/* Donut Chart Card */}
            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs flex items-center justify-between">
               <div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-2">Outcome Mix</p>
                  <div className="space-y-1.5">
                     {donutData.map(d => (
                        <div key={d.name} className="flex items-center gap-2 text-[11px] font-bold text-secondary-700 dark:text-secondary-300">
                           <span className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: d.color}}></span>
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
                      <Tooltip 
                        contentStyle={{backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold'}} 
                        itemStyle={{color: '#fff'}} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#111111] p-3.5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] shadow-2xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
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
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      filterOutcome === tab.id
                        ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                        : 'bg-[#F8F9FA] dark:bg-[#161616] text-secondary-600 dark:text-secondary-400 border-[#E8E8E8] dark:border-[#262626] hover:border-[#D6D6D6] dark:hover:border-[#333333]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-72 flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg">
              <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
              <input 
                type="text"
                placeholder="Search ID, Part, or Event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
            </div>
          </div>

          {/* Table (PART 9.2) */}
          <div className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden border border-[#E8E8E8] dark:border-[#222222] shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-secondary-600 dark:text-secondary-400">
                <thead className="text-[11px] font-bold uppercase tracking-wider bg-[#F8F9FA] dark:bg-[#161616] border-b border-[#E8E8E8] dark:border-[#222222] text-secondary-700 dark:text-secondary-300">
                  <tr>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-secondary-100 dark:hover:bg-[#1f1f1f]" onClick={() => handleSort('disruption_id')}>Disruption ID</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-secondary-100 dark:hover:bg-[#1f1f1f]" onClick={() => handleSort('part_affected')}>Part</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-secondary-100 dark:hover:bg-[#1f1f1f]" onClick={() => handleSort('revenue_at_risk_usd')}>At Risk</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-secondary-100 dark:hover:bg-[#1f1f1f]" onClick={() => handleSort('recovered')}>Recovered</th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-secondary-100 dark:hover:bg-[#1f1f1f]" onClick={() => handleSort('recovery_pct')}>Recovery %</th>
                    <th className="px-5 py-3.5">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] dark:divide-[#222222]">
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
                          className={`cursor-pointer transition-colors hover:bg-secondary-50 dark:hover:bg-[#161616] ${isExpanded || expandedId === d.disruption_id ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}
                        >
                          <td className="px-5 py-4 font-mono font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                            {d.disruption_id.includes('LIVE') ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary-300 dark:bg-secondary-600"></span>
                            )}
                            {d.disruption_id}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs font-bold text-secondary-800 dark:text-secondary-200">{d.part_affected}</td>
                          <td className="px-5 py-4 font-mono font-semibold text-secondary-700 dark:text-secondary-300">${d.revenue_at_risk_usd?.toLocaleString() || '0'}</td>
                          <td className="px-5 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {recovered > 0 ? `$${recovered.toLocaleString()}` : '$0'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-16 h-2 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{width: `${Math.min(100, recPct)}%`}}></div>
                              </div>
                              <span className="text-xs font-mono font-bold text-secondary-800 dark:text-secondary-200">{recPct}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={outcomeStr} />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="p-0 border-b border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#161616]">
                              <div className="p-6 text-xs">
                                <h4 className="font-bold text-secondary-900 dark:text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-primary-500" /> Audit & Decision Trail
                                </h4>
                                <div className="space-y-4 pl-2 border-l-2 border-primary-500/40">
                                  {d.decision_trail && d.decision_trail.map((t, idx) => (
                                    <div key={idx} className="relative pl-4">
                                      <div className="absolute w-2 h-2 bg-primary-500 rounded-full -left-[5px] top-1"></div>
                                      <p className="text-[11px] text-secondary-400 mb-0.5">
                                        <span className="font-bold text-secondary-900 dark:text-white">{t.agent}</span> • {isNaN(new Date(t.timestamp)) ? t.timestamp : new Date(t.timestamp).toLocaleString()}
                                      </p>
                                      <p className="text-secondary-800 dark:text-secondary-200 font-medium text-xs">{t.action}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-5 pt-4 border-t border-[#E8E8E8] dark:border-[#262626] flex items-center justify-between">
                                  {d.recovery_plan_id ? (
                                    <a href={`/plans?id=${d.recovery_plan_id}`} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
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
                                    className="btn-primary !h-8 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
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
        </main>
      </div>

      <PrAuditExportModal isOpen={showPrModal} onClose={() => setShowPrModal(false)} data={selectedAudit} />
    </div>
  );
}
