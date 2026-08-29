import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { ShieldAlert, GitCommit, Factory, Box, CheckCircle, ArrowRight, XCircle, FileText, BarChart2, MessageSquare, ChevronRight, Activity, Database, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export async function getServerSideProps(context) {
  const { id } = context.params;
  const fs = require('fs');
  const path = require('path');

  let disruption = null;
  let partInfo = null;
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    disruption = data.find(d => d.disruption_id === id) || null;

    const partsPath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(partsPath, 'utf8'));
    partInfo = partsData.find(p => p.part_id === disruption?.part_affected) || null;
  } catch (e) {}

  if (!disruption && !id.includes('LIVE')) {
    return { notFound: true };
  }

  return { 
    props: { 
      ssrDisruption: disruption || { disruption_id: id },
      ssrPartInfo: partInfo || {}
    } 
  };
}

export default function DisruptionDetail({ ssrDisruption, ssrPartInfo }) {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(ssrDisruption);
  const [part, setPart] = useState(ssrPartInfo);
  
  // Execution states
  const [approvedOption, setApprovedOption] = useState(null);
  const [executionStarted, setExecutionStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [negotiateResult, setNegotiateResult] = useState(null);
  const [chatRevealIndex, setChatRevealIndex] = useState(-1);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [erpProgress, setErpProgress] = useState(0);
  
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (id?.includes('LIVE')) {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const found = custom.find(d => d.disruption_id === id);
      if (found) {
        setData(found);
      }
    }
  }, [id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatRevealIndex, negotiateResult, erpProgress]);

  const confidence = data.confidence || 94;
  const sources = data.sources || ["Government Trade Notice", "Reuters Market Data", "Supplier Bulletin"];
  const plants = data.plants_affected || 3;
  const products = data.products_affected || 7;
  
  const options = [
    {
      id: 'A',
      title: 'External Procurement',
      vendor: part?.pin_compatible_alternatives?.[0]?.vendor || "Avnet",
      cost_impact: "+8%",
      lead_time: "5 days",
      risk_reduction: 95,
      description: "Trigger automated RFQ and PO execution with alternative vendor."
    },
    {
      id: 'B',
      title: 'Internal Reallocation',
      vendor: "Global Inventory Sweep",
      cost_impact: "+2%",
      lead_time: "2 days",
      risk_reduction: 61,
      description: "Reroute existing stock from unaffected regional plants."
    },
    {
      id: 'C',
      title: 'Do Nothing',
      vendor: "N/A",
      cost_impact: "Full Exposure",
      lead_time: "N/A",
      risk_reduction: 0,
      description: "Absorb the delay and maintain current procurement path."
    }
  ];

  const handleApprove = async (opt) => {
    setApprovedOption(opt.id);
    setIsProcessing(true);
    setExecutionStarted(true);
    
    if (opt.id === 'A') {
      try {
        const r = await fetch('/api/negotiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            partNumber: data.part_affected, 
            options: data.matched_options || (part ? part.pin_compatible_alternatives.map(v => ({ _raw: v })) : [])
          })
        });
        const d = await r.json();
        setNegotiateResult(d);
        
        let index = 0;
        setChatRevealIndex(0);
        const interval = setInterval(() => {
          index++;
          setChatRevealIndex(index);
          if (index >= d.chatLog.length) {
            clearInterval(interval);
            setTimeout(() => completeExecution(opt), 1500);
          }
        }, 2000); 

      } catch(e) {
        setTimeout(() => completeExecution(opt), 2000);
      }
    } else if (opt.id === 'B') {
      let progress = 0;
      const int = setInterval(() => {
        progress += 25;
        setErpProgress(progress);
        if(progress >= 100) {
          clearInterval(int);
          setTimeout(() => completeExecution(opt), 1000);
        }
      }, 1500);
    } else {
      setTimeout(() => completeExecution(opt), 2000);
    }
  };

  const completeExecution = (opt) => {
    setIsProcessing(false);
    setPlanGenerated(true);

    const planId = `RP-LIVE-${Math.floor(Math.random()*9000)+1000}`;
    const dt = [
      { timestamp: new Date(Date.now() - 30000).toISOString(), agent: "Detection Agent", action: "Identified critical shortage risk." },
      { timestamp: new Date(Date.now() - 25000).toISOString(), agent: "Impact Agent", action: "Mapped revenue at risk." },
      { timestamp: new Date(Date.now() - 15000).toISOString(), agent: "Decision Matrix", action: `User approved Option ${opt.id}: ${opt.title}` },
      { timestamp: new Date().toISOString(), agent: "Execution Engine", action: `Finalized ${opt.title} workflow.` }
    ];
    
    let recoveredAmt = 0;
    if (opt.id === 'A') recoveredAmt = (data.revenue_at_risk_usd || 10000) * 0.95;
    if (opt.id === 'B') recoveredAmt = (data.revenue_at_risk_usd || 10000) * 0.61;

    // Update status globally
    if (id?.includes('LIVE')) {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const updated = custom.map(d => {
        if (d.disruption_id === id) {
          return { 
            ...d, 
            status: 'Resolved', 
            recovery_plan_id: planId,
            decision_trail: dt,
            resolution: {
              outcome: "Executed",
              vendor: opt?.vendor || "N/A",
              proposed_action: opt.description,
              recovered_amount_usd: recoveredAmt
            }
          };
        }
        return d;
      });
      localStorage.setItem('custom_disruptions', JSON.stringify(updated));
    }

    // Generate Recovery Plan with Execution History for the /plans module
    const newPlan = {
      plan_id: planId,
      disruption_id: id,
      part_affected: data.part_affected || "Unknown Part",
      created_at: new Date().toISOString(),
      status: "Executing",
      confidence: confidence,
      action_summary: opt.description,
      decision_trail: dt,
      steps: [
        { status: "Completed", description: "Authorization received" },
        { status: "In Progress", description: "ERP execution" }
      ],
      metrics: {
        cost_impact_usd: (data.revenue_at_risk_usd || 10000) * (opt.id === 'A' ? 0.08 : opt.id === 'B' ? 0.02 : 1),
        revenue_protected_usd: recoveredAmt,
        days_saved: opt.id === 'A' ? 14 : opt.id === 'B' ? 17 : 0
      }
    };

    const customPlans = JSON.parse(localStorage.getItem('custom_plans') || '[]');
    localStorage.setItem('custom_plans', JSON.stringify([newPlan, ...customPlans]));
  };

  if (!data.part_affected && !data.event_type) return <div className="min-h-screen bg-[#0a0f18] text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0a0f18] flex text-gray-900 dark:text-white">
      <Head><title>Decision Center: {id} | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        
        <div className="p-6 max-w-7xl mx-auto w-full space-y-4 pb-24">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 gap-2 mb-2">
            <Link href="/" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/disruptions" className="hover:text-indigo-500 transition-colors">Disruptions</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 dark:text-gray-200">{id}</span>
          </div>

          <div className="glass-panel overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl bg-white dark:bg-[#11141c]">
            {/* HEADER */}
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-gray-50 to-white dark:from-[#11141c] dark:to-[#1a1d24]">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    {id}
                  </h1>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${planGenerated ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20'}`}>
                    {planGenerated ? 'Resolved' : 'Critical Threat'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-4xl leading-relaxed">
                  {data.event_type}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">AI Confidence</p>
                <div className="text-4xl font-black text-emerald-500 mb-2">{confidence}%</div>
                <Link href="/risk" className="text-[10px] bg-gray-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors font-bold tracking-wide uppercase">
                  <Activity className="w-3 h-3" /> View Risk Model
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-white/10">
              
              {/* LEFT COLUMN: EVIDENCE & IMPACT */}
              <div className="p-6 md:p-8 lg:col-span-4 space-y-10 bg-gray-50 dark:bg-black/20">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Evidence Sources
                  </h3>
                  <ul className="space-y-3">
                    {sources.map((src, i) => (
                      <li key={i} className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div> {src}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <GitCommit className="w-4 h-4" /> Impact Chain
                  </h3>
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
                    
                    <div className="relative flex items-start gap-4 pb-6">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-[#11141c] bg-gray-200 dark:bg-gray-800 text-gray-500 shadow-sm shrink-0 z-10 mt-0.5">
                        <Factory className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Supplier</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{data.vendor || "XYZ Semiconductor"}</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4 pb-6">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-[#11141c] bg-gray-200 dark:bg-gray-800 text-gray-500 shadow-sm shrink-0 z-10 mt-0.5">
                        <Box className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Part</p>
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                          <Link href="/network" className="hover:underline">{data.part_affected}</Link>
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4 pb-6">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-[#11141c] bg-gray-200 dark:bg-gray-800 text-gray-500 shadow-sm shrink-0 z-10 mt-0.5">
                        <BarChart2 className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Impact Scope</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{plants} Plants / {products} Products</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-[#11141c] bg-red-100 dark:bg-red-900/30 text-red-500 shadow-sm shrink-0 z-10 mt-0.5">
                        <ShieldAlert className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest mb-0.5">Revenue Exposure</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">${data.revenue_at_risk_usd?.toLocaleString() || '3,500,000'}/day</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DECISION MATRIX OR EXECUTION */}
              <div className="p-6 md:p-8 lg:col-span-8 bg-white dark:bg-[#11141c]">
                
                {!executionStarted ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Action Matrix
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {options.map(opt => (
                        <div key={opt.id} className={`p-5 border rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all shadow-sm ${approvedOption === opt.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-300 dark:border-indigo-500/50' : 'bg-white dark:bg-[#151821] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md'}`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-black text-gray-900 dark:text-white">Option {opt.id}: {opt.title}</h4>
                              {opt.id === 'A' && <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide rounded-full border border-emerald-200 dark:border-emerald-500/20">Recommended</span>}
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{opt.description}</p>
                            
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-gray-50 dark:bg-[#0f1115] p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Cost Impact</p>
                                <p className={`text-sm font-black ${opt.id === 'A' ? 'text-orange-500' : opt.id === 'B' ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-500'}`}>{opt.cost_impact}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-[#0f1115] p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Lead Time</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{opt.lead_time}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-[#0f1115] p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Risk Reduction</p>
                                <p className={`text-sm font-black ${opt.risk_reduction > 80 ? 'text-emerald-600 dark:text-emerald-400' : opt.risk_reduction > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'}`}>{opt.risk_reduction}%</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="shrink-0 flex items-center justify-center w-full xl:w-auto">
                            <button 
                              onClick={() => handleApprove(opt)}
                              disabled={isProcessing}
                              className={`w-full xl:w-36 py-4 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg'}`}
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  
                  /* EXECUTION UI */
                  <div className="flex flex-col h-full min-h-[450px] animate-[fadeInUp_0.4s_ease-out]">
                    <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                          {approvedOption === 'A' ? <MessageSquare className="w-6 h-6 text-indigo-500" /> : approvedOption === 'B' ? <Database className="w-6 h-6 text-blue-500" /> : <AlertTriangle className="w-6 h-6 text-orange-500" />} 
                          Execution Subsystem
                        </h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                          {approvedOption === 'A' ? 'Autonomous Supplier Negotiation (Chase Agent)' : approvedOption === 'B' ? 'SAP S/4HANA Internal Stock Transport Order' : 'Risk Acknowledgement & Monitoring'}
                        </p>
                      </div>
                      {!planGenerated ? (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 rounded-full border border-indigo-200 dark:border-indigo-500/30">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] dark:text-indigo-300 font-bold tracking-widest uppercase">Processing</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                          <CheckCircle className="w-3 h-3 dark:text-emerald-500" />
                          <span className="text-[10px] dark:text-emerald-400 font-bold tracking-widest uppercase">Completed</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col relative bg-gray-50 dark:bg-[#0f1115] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-inner">
                      
                      {approvedOption === 'A' && (
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
                          {negotiateResult?.chatLog.slice(0, chatRevealIndex + 1).map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.from.includes('Agent') || msg.from === 'System' ? 'items-end' : 'items-start'} animate-[fadeInUp_0.3s_ease-out]`}>
                              <span className="text-[10px] text-gray-400 mb-1.5 px-1 font-bold uppercase tracking-widest">{msg.from}</span>
                              <div className={`p-3.5 rounded-xl max-w-[85%] shadow-sm ${
                                msg.from === 'System' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                msg.from.includes('Agent') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-[#1a1d24] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10'
                              }`}>
                                <p className={`text-sm font-medium leading-relaxed ${msg.from === 'System' ? 'font-mono' : ''}`}>{msg.text}</p>
                              </div>
                            </div>
                          ))}
                          {!planGenerated && negotiateResult && chatRevealIndex < negotiateResult.chatLog.length - 1 && (
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-gray-400 mb-1.5 px-1 font-bold uppercase tracking-widest">Chase Agent</span>
                              <div className="bg-indigo-600/50 p-3.5 rounded-xl max-w-[85%] flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      )}

                      {approvedOption === 'B' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                           <Database className={`w-12 h-12 ${planGenerated ? 'text-emerald-500' : 'text-blue-500 animate-pulse'}`} />
                           <div className="w-full max-w-md">
                             <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                               <span>STO Generation</span>
                               <span>{erpProgress}%</span>
                             </div>
                             <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${erpProgress}%`}}></div>
                             </div>
                             <p className="mt-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                               {erpProgress < 30 ? '> Locating global inventory surplus...' : erpProgress < 70 ? '> Locking inventory at EU-Central...' : erpProgress < 100 ? '> Generating Stock Transport Order...' : '> STO Executed Successfully.'}
                             </p>
                           </div>
                        </div>
                      )}

                      {approvedOption === 'C' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                           <AlertTriangle className="w-12 h-12 text-orange-500" />
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white">Risk Profile Acknowledged</h3>
                           <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                             No immediate procurement action taken. SentinelChain will continue monitoring supplier ETA updates and escalate if delays exceed 14 days.
                           </p>
                        </div>
                      )}
                      
                    </div>
                    {planGenerated && (
                      <div className="mt-6 animate-[fadeInUp_0.3s_ease-out]">
                        <Link href="/ledger" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wide rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                          View Verified Impact in Recovery Ledger <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
