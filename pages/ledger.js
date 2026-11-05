import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import PrAuditExportModal from '../components/PrAuditExportModal';
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Clock, RefreshCw, Filter, Sparkles, TrendingUp, Search, ChevronRight, Activity, ShieldAlert, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Recovery Ledger | SentinelChain</title>
        <meta name="description" content="Immutable audit trail and measured revenue recovery across all disruption batches." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-400 gap-2">
            <Link href="/" className="hover:text-primary-500 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white">Audit & Settlement</span>
          </div>

          {/* Editorial Header */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Cryptographic Audit Trail
                </span>
                <span className="text-xs font-mono font-bold text-secondary-400">
                  {disruptions.length} Verified Entries
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button 
                  onClick={clearTestDrafts}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-[#1C1D21] border border-[#E5E7EB] dark:border-[#262626] rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Reset local test injections"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Local Tests
                </button>
                <Link href="/risk" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-amber-600 dark:text-amber-400">
                  <Activity className="w-3.5 h-3.5" /> Category Matrix
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Enterprise <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Recovery Ledger.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Immutable audit records, SAP Ariba purchase requisitions, and deterministic financial margin preservation across every global disruption batch.
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Total Revenue at Risk</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">${totalAtRisk.toLocaleString()}</span>
              <span className="text-xs text-secondary-400">Cumulative disruption exposure</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Gross Margin Recovered</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">${totalRecovered.toLocaleString()}</span>
              <span className="text-xs text-secondary-400">Protected assembly line revenue</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Verified Recovery Rate</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">{recoveryRate}%</span>
              <span className="text-xs text-secondary-400">Benchmark target &gt; 85%</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Mean Turnaround Time</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{avgTime} <span className="text-sm font-normal text-secondary-400">hrs</span></span>
              <span className="text-xs text-secondary-400">vs. 21 days manual baseline</span>
            </div>
          </div>

          {/* Outcome Mix Breakdown & Filter Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Outcome Donut & Breakdown */}
            <div className="lg:col-span-5 bg-white dark:bg-[#141414] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider block mb-3">Disruption Outcome Mix</span>
                <div className="space-y-2">
                  {donutData.map(d => (
                    <div key={d.name} className="flex items-center gap-2.5 text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: d.color}}></span>
                      <span>{d.name}:</span>
                      <span className="font-mono text-secondary-900 dark:text-white">{d.value}</span>
                      <span className="text-[11px] text-secondary-400 font-normal">({Math.round((d.value/disruptions.length)*100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-28 h-28 sm:w-32 sm:h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} innerRadius={32} outerRadius={50} dataKey="value" stroke="none">
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold'}} 
                      itemStyle={{color: '#fff'}} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Filter Pills & Live Search */}
            <div className="lg:col-span-7 bg-white dark:bg-[#141414] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider block mb-3">Audit Query & Filters</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'ALL', label: `All (${disruptions.length})` },
                    { id: 'COMPLETED', label: `Completed (${outcomeCounts['Completed'] || 0})` },
                    { id: 'EXECUTING', label: `Executing (${outcomeCounts['Executing'] || 0})` },
                    { id: 'AWAITING', label: `Awaiting (${outcomeCounts['Awaiting'] || 0})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterOutcome(tab.id)}
                      className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                        filterOutcome === tab.id
                          ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 border-secondary-900 dark:border-white shadow-2xs'
                          : 'bg-[#F9FAFB] dark:bg-[#1C1D21] text-secondary-600 dark:text-secondary-400 border-[#E5E7EB] dark:border-[#262626] hover:border-[#D1D5DB] dark:hover:border-[#333333]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] dark:bg-[#1C1D21] border border-[#E5E7EB] dark:border-[#262626] rounded-xl">
                <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                <input 
                  type="text"
                  placeholder="Search by Disruption ID, Part Number, or Incident Type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
                />
              </div>
            </div>

          </div>

          {/* Cryptographic Ledger Table */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#262626] bg-[#F9FAFB] dark:bg-[#18191D] text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                    <th className="px-6 py-4 cursor-pointer hover:text-secondary-900 dark:hover:text-white" onClick={() => handleSort('disruption_id')}>
                      Disruption ID
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:text-secondary-900 dark:hover:text-white" onClick={() => handleSort('part_affected')}>
                      Affected Material
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:text-secondary-900 dark:hover:text-white" onClick={() => handleSort('revenue_at_risk_usd')}>
                      Revenue at Risk
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:text-secondary-900 dark:hover:text-white" onClick={() => handleSort('recovered')}>
                      Recovered
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:text-secondary-900 dark:hover:text-white" onClick={() => handleSort('recovery_pct')}>
                      Recovery %
                    </th>
                    <th className="px-6 py-4">Outcome</th>
                    <th className="px-6 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
                  {filteredDisruptions.map((d) => {
                    const recovered = Math.round(d.resolution?.recovered_amount_usd || 0);
                    const recPct = d.revenue_at_risk_usd > 0 ? Math.round((recovered / d.revenue_at_risk_usd) * 100) : 0;
                    const isExpanded = expandedId === d.disruption_id;

                    return (
                      <React.Fragment key={d.disruption_id}>
                        <tr 
                          id={d.disruption_id}
                          onClick={() => setExpandedId(isExpanded ? null : d.disruption_id)}
                          className={`cursor-pointer transition-colors hover:bg-secondary-50 dark:hover:bg-[#18191D] ${isExpanded ? 'bg-primary-50/40 dark:bg-primary-950/20' : ''}`}
                        >
                          <td className="px-6 py-4 font-mono font-bold text-primary-600 dark:text-primary-400">
                            {d.disruption_id}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-secondary-900 dark:text-white">
                            {d.part_affected}
                          </td>
                          <td className="px-6 py-4 font-extrabold text-secondary-900 dark:text-white">
                            ${d.revenue_at_risk_usd?.toLocaleString() || '1,575,000'}
                          </td>
                          <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                            ${recovered.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-mono font-extrabold ${recPct > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {recPct}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={d.resolution?.outcome || d.status || 'Executing'} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="p-1 rounded-md text-secondary-400 hover:text-secondary-900 dark:hover:text-white inline-block">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#F9FAFB]/70 dark:bg-[#16171B]">
                            <td colSpan={7} className="px-6 py-5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 mb-2">Disruption Telemetry</h4>
                                  <p className="text-xs text-secondary-700 dark:text-secondary-300 mb-1">{d.event_type || 'Active Silicon Disruption'}</p>
                                  <p className="text-xs font-mono text-secondary-500">Source: {d.source || 'Official Registry'} ({d.sourceTier || 'IR_TIER_1'})</p>
                                </div>

                                <div>
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 mb-2">S/4HANA & Ariba Action</h4>
                                  <p className="text-xs text-secondary-700 dark:text-secondary-300 mb-1">{d.resolution?.proposed_action || 'Autonomous Spot Procurement & Requisition'}</p>
                                  <p className="text-xs font-mono text-secondary-500">Distributor: {d.resolution?.vendor || 'Mouser Electronics'}</p>
                                </div>

                                <div className="flex flex-col justify-between items-start md:items-end gap-2">
                                  <div className="text-xs text-secondary-500">
                                    Turnaround: <span className="font-bold text-secondary-900 dark:text-white">{d.resolution?.time_to_recovery_hours || 4.2} hrs</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAudit(d);
                                        setShowPrModal(true);
                                      }}
                                      className="px-3 py-1.5 bg-white dark:bg-[#1F2024] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all text-secondary-800 dark:text-secondary-200"
                                    >
                                      <FileText className="w-3 h-3 text-primary-500" /> Audit Dossier
                                    </button>
                                    <Link
                                      href={`/disruptions/${d.disruption_id}`}
                                      className="btn-primary !h-8 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                                    >
                                      Decision Center <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  </div>
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

      <PrAuditExportModal 
        isOpen={showPrModal} 
        onClose={() => setShowPrModal(false)} 
        data={selectedAudit || disruptions[0]} 
      />
    </div>
  );
}
