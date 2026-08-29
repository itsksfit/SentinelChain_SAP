import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { ShieldAlert, GitCommit, Factory, Box, CheckCircle, ArrowRight, XCircle, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import StatusBadge from '../../components/StatusBadge';

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
  const [approvedOption, setApprovedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id?.includes('LIVE')) {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const found = custom.find(d => d.disruption_id === id);
      if (found) {
        setData(found);
      }
    }
  }, [id]);

  const confidence = data.confidence || 92;
  const sources = data.sources || ["Government Trade Notice", "Reuters Market Data", "Supplier Bulletin"];
  const plants = data.plants_affected || 3;
  const products = data.products_affected || 7;
  
  const options = [
    {
      id: 'A',
      title: 'External Procurement',
      vendor: part?.pin_compatible_alternatives?.[0]?.vendor || "Farnell",
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

  const handleApprove = (opt) => {
    setApprovedOption(opt.id);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      // Route back to dashboard with a query param to trigger the chase agent visualization for the demo
      if (opt.id === 'A') {
         router.push(`/?execute=${data.disruption_id}`);
      } else {
         router.push('/disruptions');
      }
    }, 1500);
  };

  if (!data.part_affected && !data.event_type) return <div className="min-h-screen bg-[#0a0f18] text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head><title>Decision Center: {id} | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="mb-2">
            <Link href="/disruptions" className="text-sm text-gray-500 hover:text-indigo-500 flex items-center gap-1 mb-4">
              ← Back to Disruptions
            </Link>
          </div>

          <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    {id}
                  </h1>
                  <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-bold uppercase tracking-wider">
                    Critical Threat
                  </span>
                </div>
                <p className="text-xl font-mono text-gray-700 dark:text-gray-300">{data.event_type}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">AI Confidence</p>
                <div className="text-3xl font-bold text-emerald-500">{confidence}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-white/10">
              
              <div className="p-6 lg:col-span-1 space-y-8 bg-gray-50/20 dark:bg-black/10">
                <div>
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Evidence Sources
                  </h3>
                  <ul className="space-y-2">
                    {sources.map((src, i) => (
                      <li key={i} className="text-sm text-gray-800 dark:text-gray-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {src}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GitCommit className="w-4 h-4" /> Why We Think This Matters
                  </h3>
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1115] text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Factory className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:text-right md:group-odd:pr-4">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Supplier</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.vendor || "XYZ Semiconductor"}</p>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1115] text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Box className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:text-right md:group-odd:pr-4">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Part</p>
                        <p className="text-sm font-medium text-indigo-500 font-mono">{data.part_affected}</p>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1115] text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <BarChart2 className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:text-right md:group-odd:pr-4">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Impact Scope</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{plants} Plants / {products} Products</p>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <ShieldAlert className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:text-right md:group-odd:pr-4">
                        <p className="text-[10px] text-red-500 uppercase font-bold tracking-wider mb-0.5">Revenue Exposure</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">${data.revenue_at_risk_usd?.toLocaleString() || '3,500,000'}/day</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="p-6 lg:col-span-2">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> What Can We Do?
                </h3>
                
                <div className="space-y-4">
                  {options.map(opt => (
                    <div key={opt.id} className={`p-5 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${approvedOption === opt.id ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-500' : 'bg-white dark:bg-[#1a1d24] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Option {opt.id}: {opt.title}</h4>
                          {opt.id === 'A' && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded border border-emerald-500/20">Recommended</span>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{opt.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gray-50 dark:bg-[#0f1115] p-2 rounded border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Cost</p>
                            <p className={`text-sm font-bold ${opt.id === 'A' ? 'text-orange-500' : opt.id === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>{opt.cost_impact}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-[#0f1115] p-2 rounded border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Lead Time</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{opt.lead_time}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-[#0f1115] p-2 rounded border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Risk Reduction</p>
                            <p className={`text-sm font-bold ${opt.risk_reduction > 80 ? 'text-emerald-500' : opt.risk_reduction > 0 ? 'text-blue-500' : 'text-red-500'}`}>{opt.risk_reduction}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center justify-center">
                        <button 
                          onClick={() => handleApprove(opt)}
                          disabled={isProcessing && approvedOption !== opt.id}
                          className={`w-full md:w-32 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${approvedOption === opt.id ? 'bg-indigo-600 text-white shadow-lg' : isProcessing ? 'bg-gray-200 dark:bg-gray-800 text-gray-400' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'}`}
                        >
                          {isProcessing && approvedOption === opt.id ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></>
                          ) : approvedOption === opt.id ? (
                            'Approved'
                          ) : (
                            'Approve'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
