import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Zap, X, ArrowRight, ShieldCheck, Link as LinkIcon, CheckCircle2, Clock, Search, ChevronRight, Activity, Database, ShieldAlert, FileText, Filter, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import StatusBadge from '../components/StatusBadge';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Filter only those with a plan_id
  const planData = data.filter(d => d.recovery_plan_id).map(d => ({
    id: d.recovery_plan_id,
    source_disruption_id: d.disruption_id,
    generated_at: d.detected_at,
    status: d.resolution?.outcome || "Pending",
    vendor: d.resolution?.vendor || "Mouser Electronics",
    part: d.part_affected,
    proposed_action: d.resolution?.proposed_action || (d.resolution?.alt_part_used ? `Procure ${d.resolution.alt_part_used} from ${d.resolution.vendor || 'Mouser Electronics'}` : `Procure verified pin-compatible replacement via Mouser Spot Allocation`),
    risk_reduction_pct: d.revenue_at_risk_usd > 0 ? Math.round(((d.resolution?.recovered_amount_usd || (d.revenue_at_risk_usd * 0.92)) / d.revenue_at_risk_usd) * 100) : 92,
    decision_trail: d.decision_trail
  }));
  
  return {
    props: {
      initialPlans: planData
    }
  };
}

export default function Plans({ initialPlans }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  useEffect(() => {
    try {
      const customDisruptions = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      if (customDisruptions.length > 0) {
        const customPlans = customDisruptions
          .filter(d => d.recovery_plan_id)
          .map(d => ({
            id: d.recovery_plan_id,
            source_disruption_id: d.disruption_id,
            generated_at: d.detected_at,
            status: d.resolution?.outcome || "Awaiting Execution",
            vendor: d.resolution?.vendor || "Mouser Electronics",
            part: d.part_affected,
            proposed_action: d.resolution?.proposed_action || `Autonomous Spot Procurement & Allocation for ${d.part_affected}`,
            risk_reduction_pct: d.revenue_at_risk_usd > 0 ? Math.round(((d.resolution?.recovered_amount_usd || (d.revenue_at_risk_usd * 0.95)) / d.revenue_at_risk_usd) * 100) : 95,
            decision_trail: d.decision_trail
          }));
        
        // Combine without duplicate IDs
        const existingIds = new Set(customPlans.map(p => p.id));
        const nonDupInitials = initialPlans.filter(p => !existingIds.has(p.id));
        setPlans([...customPlans, ...nonDupInitials]);
      }
    } catch(e) {}
  }, [initialPlans]);

  useEffect(() => {
    if (router.query.id) {
      setTimeout(() => {
        const el = document.getElementById(router.query.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-primary-500');
          setTimeout(() => el.classList.remove('ring-2', 'ring-primary-500'), 3000);
        }
      }, 500);
    }
  }, [router.query.id]);

  const filteredPlans = plans.filter(p => {
    if (selectedFilter !== 'ALL') {
      const st = (p.status || '').toLowerCase();
      if (selectedFilter === 'EXECUTED' && !st.includes('executed') && !st.includes('completed') && !st.includes('resolved')) return false;
      if (selectedFilter === 'AWAITING' && !st.includes('awaiting') && !st.includes('pending')) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.id.toLowerCase().includes(q) || 
           p.source_disruption_id.toLowerCase().includes(q) || 
           p.part.toLowerCase().includes(q) ||
           p.vendor.toLowerCase().includes(q);
  });

  const avgReduction = plans.length > 0 
    ? Math.round(plans.reduce((acc, p) => acc + (p.risk_reduction_pct || 0), 0) / plans.length)
    : 94;

  const executedCount = plans.filter(p => {
    const st = (p.status || '').toLowerCase();
    return st.includes('executed') || st.includes('completed') || st.includes('resolved');
  }).length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Recovery Plans | SentinelChain</title>
        <meta name="description" content="AI-orchestrated mitigation plans, commercial spot allocations, and SAP Ariba PR execution packages." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-400 gap-2">
            <Link href="/" className="hover:text-primary-500 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white">Mitigation Strategies</span>
          </div>

          {/* Editorial Header */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Autonomous Orchestration
                </span>
                <span className="text-xs font-mono font-bold text-secondary-400">
                  {plans.length} Strategies Active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/disruptions" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-red-600 dark:text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5" /> Active Threats
                </Link>
                <Link href="/ledger" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-primary-600 dark:text-primary-400">
                  <FileText className="w-3.5 h-3.5" /> Recovery Ledger
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Autonomous <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Recovery Plans.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Algorithmic mitigation strategies, pin-compatible spot allocations, and automated SAP Ariba purchase requisition packages generated in under 45 seconds.
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Total Strategies</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{plans.length}</span>
              <span className="text-xs text-secondary-400">AI-synthesized mitigation blueprints</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Mean Risk Mitigated</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{avgReduction}%</span>
              <span className="text-xs text-secondary-400">Verified financial loss protection</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Execution Velocity</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">&lt; 45s</span>
              <span className="text-xs text-secondary-400">Telemetry to Mouser spot match</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Executed PRs</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">{executedCount}</span>
              <span className="text-xs text-secondary-400">Dispatched to S/4HANA & Ariba</span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Strategy Status:
              </span>
              {[
                { id: 'ALL', label: `All Plans (${plans.length})` },
                { id: 'EXECUTED', label: `Executed (${executedCount})` },
                { id: 'AWAITING', label: `Awaiting Approval (${plans.length - executedCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                    selectedFilter === tab.id
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
                placeholder="Search Plan ID, MPN, or Distributor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-medium outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
            </div>
          </div>

          {/* Recovery Plans Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map((plan, i) => (
              <div 
                key={i} 
                id={plan.id} 
                className="bg-white dark:bg-[#141414] p-6 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl hover:border-primary-400 dark:hover:border-primary-500 transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 px-2.5 py-0.5 rounded-full">
                          {plan.id}
                        </span>
                        <StatusBadge status={plan.status} />
                      </div>
                      <p className="text-base font-extrabold text-secondary-900 dark:text-white font-mono">
                        {plan.part}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-wider mb-0.5">Risk Mitigated</p>
                      <p className={`font-extrabold text-lg sm:text-xl ${plan.risk_reduction_pct > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-secondary-400'}`}>
                        {plan.risk_reduction_pct}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] dark:bg-[#18191D] p-4 rounded-xl border border-[#E5E7EB] dark:border-[#262626] mb-5">
                    <p className="text-xs text-secondary-700 dark:text-secondary-300 font-medium leading-relaxed">
                      {plan.proposed_action}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262626] flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
                      <span>Primary Sourcing Partner:</span>
                      <strong className="text-secondary-900 dark:text-white font-bold">{plan.vendor}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] dark:border-[#262626]">
                  <Link 
                    href={`/disruptions/${plan.source_disruption_id}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-secondary-500 hover:text-primary-500 transition-colors"
                  >
                    <LinkIcon className="w-3 h-3" /> Event: {plan.source_disruption_id}
                  </Link>

                  <Link 
                    href={`/disruptions/${plan.source_disruption_id}`} 
                    className="btn-primary !h-9 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                  >
                    Decision Center <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
