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
          el.classList.add('ring-2', 'ring-primary-500');
          setTimeout(() => el.classList.remove('ring-2', 'ring-primary-500'), 3000);
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>Recovery Plans | SentinelChain</title>
        <meta name="description" content="AI-orchestrated mitigation plans, commercial spot allocations, and ERP purchase orders." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-6 pb-24 min-w-0">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Autonomous Mitigation Orchestration
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
                Autonomous Recovery Plans
              </h1>
              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-2xl">
                AI-orchestrated mitigation plans, commercial spot allocations, and SAP Ariba PR execution packages.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/disruptions" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-red-600 dark:text-red-400 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5" /> Active Disruptions
              </Link>
              <Link href="/ledger" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-primary-600 dark:text-primary-400 shadow-2xs">
                <FileText className="w-3.5 h-3.5" /> Recovery Ledger
              </Link>
              <Link href="/risk" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-amber-600 dark:text-amber-400 shadow-2xs">
                <Activity className="w-3.5 h-3.5" /> Risk Matrix
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#111111] p-3.5 rounded-xl border border-[#E8E8E8] dark:border-[#222222] shadow-2xs">
            <div className="flex items-center gap-2 w-full sm:w-96 px-3 py-1.5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg">
              <Search className="w-3.5 h-3.5 text-secondary-400" />
              <input 
                type="text"
                placeholder="Search by Plan ID, Event ID, MPN, or Distributor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
            </div>
            <span className="text-xs text-secondary-400 font-mono font-medium">
              Showing {filteredPlans.length} active recovery strategies
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan, i) => (
              <div 
                key={i} 
                id={plan.id} 
                className="bg-white dark:bg-[#111111] p-5 border border-[#E8E8E8] dark:border-[#222222] rounded-xl hover:border-primary-300 dark:hover:border-primary-500/40 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-secondary-900 dark:text-white text-base flex items-center gap-2">
                          {plan.id.includes('LIVE') && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>
                          )}
                          <span className="font-mono">{plan.id}</span>
                        </h3>
                        <StatusBadge status={plan.status} />
                      </div>
                      <p className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                        Affected Material: {plan.part}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-wider mb-0.5">Risk Mitigated</p>
                      <p className={`font-extrabold text-base ${plan.risk_reduction_pct > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-secondary-400'}`}>
                        {plan.risk_reduction_pct}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8F9FA] dark:bg-[#161616] p-3 rounded-lg border border-[#E8E8E8] dark:border-[#262626] mb-4">
                    <p className="text-xs text-secondary-700 dark:text-secondary-300 font-medium leading-relaxed">
                      {plan.proposed_action}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-secondary-400 font-mono">
                      <span>Vendor / Distributor: <strong className="text-secondary-900 dark:text-white font-semibold">{plan.vendor}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Interactive Interconnected Action Bar */}
                <div className="flex items-center justify-between pt-3.5 border-t border-[#E8E8E8] dark:border-[#222222] text-xs">
                  <Link 
                    href={`/disruptions/${plan.source_disruption_id}`}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <LinkIcon className="w-3 h-3" /> Event: {plan.source_disruption_id}
                  </Link>
                  <Link 
                    href={`/disruptions/${plan.source_disruption_id}`} 
                    className="btn-primary !h-8 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                  >
                    Decision Center <ArrowRight className="w-3 h-3" />
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
