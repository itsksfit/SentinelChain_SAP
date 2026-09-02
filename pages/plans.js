import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Zap, X, ArrowRight, ShieldCheck, Link as LinkIcon, CheckCircle2, Clock, Search, ChevronRight, Activity, Database, ShieldAlert, FileText } from 'lucide-react';
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
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          el.classList.add('ring-2', 'ring-indigo-500');
          setTimeout(() => el.classList.remove('ring-2', 'ring-indigo-500'), 3000);
        }
      }, 500);
    }
  }, [router.query.id]);

  const filteredPlans = plans.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.id.toLowerCase().includes(q) || 
           p.source_disruption_id.toLowerCase().includes(q) || 
           p.part.toLowerCase().includes(q) ||
           p.vendor.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex text-gray-900 dark:text-white">
      <Head><title>Recovery Plans | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-5">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" /> Autonomous Recovery Plans
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AI-orchestrated mitigation plans, commercial spot allocations, and ERP purchase orders.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/disruptions" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Active Disruptions
              </Link>
              <Link href="/ledger" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <FileText className="w-3.5 h-3.5" /> Recovery Ledger
              </Link>
              <Link href="/risk" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                <Activity className="w-3.5 h-3.5" /> Risk Analysis
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#0f1115] p-3.5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <input 
              type="text"
              placeholder="Search by Plan ID, Disruption ID, Part Number, or Distributor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-96 px-3.5 py-1.5 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none text-gray-900 dark:text-white"
            />
            <span className="text-xs text-gray-400 font-mono font-bold">
              Showing {filteredPlans.length} active recovery strategies
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan, i) => (
              <div 
                key={i} 
                id={plan.id} 
                className="bg-white dark:bg-[#0f1115] p-5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-indigo-500/30 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                          {plan.id.includes('LIVE') && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>}
                          <span className="font-mono">{plan.id}</span>
                        </h3>
                        <StatusBadge status={plan.status} />
                      </div>
                      <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        Affected Material: {plan.part}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Risk Mitigated</p>
                      <p className={`font-black text-base ${plan.risk_reduction_pct > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                        {plan.risk_reduction_pct}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5 mb-4">
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                      {plan.proposed_action}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                      <span>Vendor / Distributor: <strong className="text-gray-800 dark:text-gray-200">{plan.vendor}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Interactive Interconnected Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
                  <Link 
                    href={`/disruptions/${plan.source_disruption_id}`}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <LinkIcon className="w-3 h-3" /> Event: {plan.source_disruption_id}
                  </Link>
                  <Link 
                    href={`/disruptions/${plan.source_disruption_id}`} 
                    className="text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
                  >
                    Decision Center <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
