import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { CheckCircle, Clock, ArrowRight, Zap, X, Search, ChevronRight, Link as LinkIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Filter only those with a plan_id
  const planData = data.filter(d => d.recovery_plan_id).map(d => ({
    id: d.recovery_plan_id,
    source_disruption_id: d.disruption_id,
    generated_at: d.detected_at, // approximated for demo
    status: d.resolution?.outcome || "Pending",
    vendor: d.resolution?.vendor || "N/A",
    part: d.part_affected,
    proposed_action: d.resolution?.proposed_action || (d.resolution?.alt_part_used ? `Procure ${d.resolution.alt_part_used} from ${d.resolution.vendor}` : 'Internal reallocation'),
    risk_reduction_pct: d.revenue_at_risk_usd > 0 ? Math.round(((d.resolution?.recovered_amount_usd || 0) / d.revenue_at_risk_usd) * 100) : 0,
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
  const [showModal, setShowModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    try {
      const customDisruptions = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const customPlans = customDisruptions.filter(d => d.recovery_plan_id).map(d => ({
        id: d.recovery_plan_id,
        source_disruption_id: d.disruption_id,
        generated_at: d.detected_at,
        status: d.resolution?.outcome || "Pending",
        vendor: d.resolution?.vendor || "N/A",
        part: d.part_affected,
        proposed_action: d.resolution?.proposed_action || (d.resolution?.alt_part_used ? `Procure ${d.resolution.alt_part_used} from ${d.resolution.vendor}` : 'Internal reallocation'),
        risk_reduction_pct: d.revenue_at_risk_usd > 0 ? Math.round(((d.resolution?.recovered_amount_usd || 0) / d.revenue_at_risk_usd) * 100) : 0,
        decision_trail: d.decision_trail
      }));
      setPlans([...customPlans, ...initialPlans]);
    } catch(e) {}
  }, [initialPlans]);

  const handleGenerate = async () => {
    if (!customInput.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customInput })
      });
      if (res.ok) {
        const newRecord = await res.json();
        
        // Also save to localStorage so it persists instantly on client
        try {
          const existing = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
          existing.unshift(newRecord);
          localStorage.setItem('custom_disruptions', JSON.stringify(existing));
        } catch(e) {}

        // Reload the page to get the new SSR data
        router.replace(router.asPath);
        setShowModal(false);
        setCustomInput('');
      }
    } catch(e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Completed') || status.includes('Resolved')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (status.includes('Executing') || status.includes('Mitigating')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (status.includes('Escalated')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (status.includes('Failed')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head><title>Recovery Plans | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Recovery Plans</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">AI-generated mitigation strategies and their execution status.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
            >
              <Zap className="w-4 h-4" /> Generate Custom Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className="glass-panel p-5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col" onClick={() => setSelectedPlan(plan)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                        {plan.id.includes('LIVE') && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>}
                        {plan.id}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-indigo-400">{plan.part}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Risk Reduction</p>
                    <p className={`font-bold text-lg ${plan.risk_reduction_pct > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>{plan.risk_reduction_pct}%</p>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/5 mb-4 flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">{plan.proposed_action}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span>Vendor: {plan.vendor}</span>
                    <Link href="/disruptions" className="flex items-center gap-1 text-indigo-500 hover:text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                      <LinkIcon className="w-3 h-3" /> Triggered by: {plan.source_disruption_id}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                Generate Custom Plan
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Describe the specific disruption or criteria you want the AI to solve for. 
              </p>
              <textarea 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500/50 transition-colors resize-none h-32"
                placeholder="e.g., Generate a recovery plan for MCU shortage targeting exclusively North American suppliers..."
              />
              <button 
                onClick={handleGenerate}
                disabled={generating || !customInput.trim()}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                ) : (
                  'Generate Plan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white dark:bg-[#0f1115] border-l border-gray-200 dark:border-white/10 w-full max-w-md h-full flex flex-col shadow-2xl animate-[slideIn_0.3s_ease-out]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{selectedPlan.id}</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-gray-500 hover:text-gray-900 dark:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Target Component</p>
                <p className="font-mono text-gray-900 dark:text-white font-medium text-lg">{selectedPlan.part}</p>
              </div>

              <div className="mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/5">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Proposed Action</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedPlan.proposed_action}
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Execution History
                </h4>
                <div className="space-y-4 pl-2 border-l-2 border-indigo-500/30">
                  {selectedPlan.decision_trail && selectedPlan.decision_trail.map((t, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-1.5"></div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        <span className="font-bold text-gray-700 dark:text-gray-300">{t.agent}</span> • {new Date(t.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{t.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
