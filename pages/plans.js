import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { CheckCircle, Clock, ArrowRight, Zap, X, Search, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [generating, setGenerating] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        // Fetch dynamic historical plans from AI
        const res = await fetch('/api/plans/history');
        let historicalPlans = [];
        if (res.ok) {
          historicalPlans = await res.json();
        }

        // Check if there is a LIVE plan executed from the dashboard
        let livePlan = null;
        try {
          const stored = localStorage.getItem('sentinel_latest_plan');
          if (stored) {
            livePlan = JSON.parse(stored);
          }
        } catch(e) {}

        if (livePlan) {
          // Prevent duplicates by ID just in case
          historicalPlans = historicalPlans.filter(p => p.id !== livePlan.id);
          setPlans([livePlan, ...historicalPlans]);
        } else {
          setPlans(historicalPlans);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!customInput) return;
    
    setGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const newPlan = {
        id: `RP-${Math.floor(Math.random() * 10000)}`,
        trigger: `Custom: ${customInput.substring(0, 20)}...`,
        action: "AI-Optimized Routing",
        vendor: "Multiple Suppliers",
        status: "Draft",
        riskReduction: "89%",
        date: "Just Now",
        historyContext: `User explicitly requested a custom simulation for: "${customInput}". The AI analyzed the hypothetical impact across the global supply chain, evaluated 14 different mitigation paths, and constructed a multi-vendor sourcing strategy to bypass the proposed bottleneck.`
      };
      setPlans([newPlan, ...plans]);
      setGenerating(false);
      setShowModal(false);
      setCustomInput('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f18] flex">
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
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
            >
              <Zap className="w-4 h-4" /> Generate Custom Plan
            </button>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
               <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
               <p className="animate-pulse">Loading active and historical execution plans...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan, i) => (
                <div key={i} onClick={() => setSelectedPlan(plan)} className={`glass-panel p-6 border cursor-pointer transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.03] ${plan.status === 'Executing' ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-gray-200 dark:border-white/10'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-gray-500">{plan.id}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${plan.status === 'Executing' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {plan.status === 'Executing' ? <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div> Executing</span> : <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {plan.status}</span>}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{plan.trigger}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Detected</span> <ArrowRight className="w-3 h-3" /> <span className="text-gray-900 dark:text-white font-medium line-clamp-1">{plan.action}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Vendor / Owner</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 truncate">{plan.vendor}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Risk Reduction</p>
                        <p className="text-sm font-bold text-emerald-400 mt-1">{plan.riskReduction}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PLAN DETAILS MODAL */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if(e.target === e.currentTarget) setSelectedPlan(null) }}>
            <div className="bg-white dark:bg-[#0a0f18] border border-gray-100 dark:border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">{selectedPlan.id}</span>
                    <span className="text-xs text-gray-500">{selectedPlan.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPlan.trigger}</h2>
                </div>
                <button onClick={() => setSelectedPlan(null)} className="text-gray-500 hover:text-gray-900 dark:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Execution Strategy</h3>
                  <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm">{selectedPlan.historyContext}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      {selectedPlan.status === 'Executing' ? <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> : <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      {selectedPlan.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Partner</p>
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{selectedPlan.vendor}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-emerald-500/10">
                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1">Risk Mitigated</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedPlan.riskReduction}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM PLAN MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0a0f18] border border-gray-100 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Zap className="w-5 h-5 text-indigo-400" /> AI Plan Generator</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-900 dark:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Describe a hypothetical disruption scenario or component shortage to generate a custom recovery plan.</p>
                <form onSubmit={handleGenerate}>
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" />
                    <input 
                      type="text" 
                      autoFocus
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. Total failure of Supplier B for part MCU-2201X..." 
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600"
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={!customInput || generating}
                      className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</> : "Generate"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
