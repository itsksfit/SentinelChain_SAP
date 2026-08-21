import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { CheckCircle, Clock, ArrowRight, Zap, X, Search } from 'lucide-react';
import { useState } from 'react';

export default function Plans() {
  const [plans, setPlans] = useState([
    { id: "RP-8042", trigger: "MCU-2201X Export Ban", action: "Procure MCU-2201X-ALT1", vendor: "Distributor A", status: "Executing", riskReduction: "94%", date: "Today" },
    { id: "RP-7711", trigger: "PWR-9942A Factory Fire", action: "Reallocate Global Inventory", vendor: "Internal", status: "Completed", riskReduction: "100%", date: "2 Days Ago" },
    { id: "RP-7104", trigger: "Logistics Strike", action: "Reroute Shipments via Air", vendor: "Global Freight", status: "Completed", riskReduction: "82%", date: "Last Week" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!customInput) return;
    
    setLoading(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const newPlan = {
        id: `RP-${Math.floor(Math.random() * 10000)}`,
        trigger: `Custom: ${customInput.substring(0, 20)}...`,
        action: "AI-Optimized Alternative Routing",
        vendor: "Multiple Suppliers",
        status: "Draft",
        riskReduction: "89%",
        date: "Just Now"
      };
      setPlans([newPlan, ...plans]);
      setLoading(false);
      setShowModal(false);
      setCustomInput('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`glass-panel p-6 border ${plan.status === 'Executing' ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-gray-200 dark:border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-gray-500">{plan.id}</span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${plan.status === 'Executing' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {plan.status === 'Executing' ? <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div> Executing</span> : <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {plan.status}</span>}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan.trigger}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>Detected</span> <ArrowRight className="w-3 h-3" /> <span className="text-gray-900 dark:text-white font-medium">{plan.action}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Vendor / Owner</p>
                    <p className="text-sm text-gray-200 mt-1">{plan.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Risk Reduction</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">{plan.riskReduction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOM PLAN MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f1115] border border-gray-100 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
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
                      disabled={!customInput || loading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</> : "Generate"}
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
