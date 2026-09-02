import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { ShieldAlert, Activity, ArrowRight, Database, CheckCircle2, AlertTriangle, Layers, ExternalLink, Sliders } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const totalRecovered = data.reduce((acc, d) => acc + (d.resolution?.recovered_amount_usd || 0), 0);
  const totalAtRisk = data.reduce((acc, d) => acc + (d.revenue_at_risk_usd || 0), 0);
  
  return {
    props: {
      initialDisruptions: data,
      initialRecovered: totalRecovered,
      initialRisk: totalAtRisk
    }
  };
}

function getPartCategory(mpn) {
  const p = (mpn || '').toUpperCase();
  if (p.includes('STM32') || p.includes('LPC') || p.includes('MSP430') || p.includes('MCU')) return 'MCU';
  if (p.includes('TPS') || p.includes('LM2596') || p.includes('MP1484') || p.includes('PWR')) return 'PWR';
  if (p.includes('BMI') || p.includes('BME') || p.includes('BMP') || p.includes('ICM') || p.includes('LSM') || p.includes('SENSOR')) return 'SENSOR';
  if (p.includes('W25Q') || p.includes('MT29F') || p.includes('IS42S') || p.includes('MEM') || p.includes('NAND')) return 'MEM';
  if (p.includes('XC7') || p.includes('EP4CE') || p.includes('FPGA') || p.includes('ZYNQ')) return 'FPGA';
  if (p.includes('GPU') || p.includes('A100') || p.includes('MXM') || p.includes('RTX')) return 'GPU';
  return 'OTHER';
}

export default function RiskAnalysis({ initialDisruptions, initialRecovered, initialRisk }) {
  const [liveRecovered, setLiveRecovered] = useState(initialRecovered);
  const [liveAtRisk, setLiveAtRisk] = useState(initialRisk || 84500000);
  const [categoryExposure, setCategoryExposure] = useState([]);
  const [activeThreats, setActiveThreats] = useState(0);
  const [allDisruptionsList, setAllDisruptionsList] = useState(initialDisruptions);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const allDisruptions = [...custom, ...initialDisruptions];
      setAllDisruptionsList(allDisruptions);
      
      const extraRecovered = custom.reduce((acc, d) => acc + (d.resolution?.recovered_amount_usd || 0), 0);
      const extraRisk = custom.reduce((acc, d) => acc + (d.revenue_at_risk_usd || 0), 0);
      setLiveRecovered(initialRecovered + extraRecovered);
      
      const newTotalRisk = (initialRisk || 84500000) + extraRisk;
      setLiveAtRisk(newTotalRisk);

      const active = allDisruptions.filter(d => d.status !== 'Resolved' && d.status !== 'Completed').length;
      setActiveThreats(active);

      const groups = {};
      allDisruptions.forEach(d => {
        const cat = getPartCategory(d.part_affected);
        if (!groups[cat]) groups[cat] = { totalRisk: 0, items: [] };
        groups[cat].totalRisk += (d.revenue_at_risk_usd || 0);
        groups[cat].items.push(d);
      });

      const sortedCategories = Object.keys(groups).map(k => ({
        name: k,
        value: groups[k].totalRisk,
        items: groups[k].items,
        pct: newTotalRisk > 0 ? (groups[k].totalRisk / newTotalRisk) * 100 : 0
      })).sort((a, b) => b.value - a.value);

      setCategoryExposure(sortedCategories);
      if (sortedCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(sortedCategories[0].name);
      }
    } catch(e) {}
  }, [initialDisruptions, initialRecovered, initialRisk]);

  const formatMillions = (val) => `$${(val / 1000000).toFixed(2)}M`;
  
  const getCategoryName = (code) => {
    const map = {
      'GPU': 'Graphics & AI Compute Accelerators (GPU)',
      'MCU': 'Microcontrollers & Embedded Logic (MCU)',
      'PWR': 'Power Management & Inverter ICs (PWR)',
      'MEM': 'Memory & Storage (NAND / SDRAM)',
      'FPGA': 'Field Programmable Gate Arrays (FPGA)',
      'SENSOR': 'Precision IMU & Environmental Sensors'
    };
    return map[code] || `${code} Semiconductor Silicon`;
  };

  const getCategoryColor = (i) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500'];
    return colors[i % colors.length];
  };

  const currentCategoryObj = categoryExposure.find(c => c.name === selectedCategory) || categoryExposure[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex text-gray-900 dark:text-white">
      <Head><title>Risk Analysis | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-5">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <Activity className="w-7 h-7 text-amber-500" /> Enterprise Risk & Exposure Matrix
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Real-time financial exposure, active threat clusters, and deterministic S/4HANA ERP risk reduction.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/disruptions" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Active Disruptions
              </Link>
              <Link href="/plans" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recovery Plans
              </Link>
              <Link href="/network" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Database className="w-3.5 h-3.5" /> Supply Network
              </Link>
            </div>
          </div>

          {/* Top KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Total S/4HANA Exposure</p>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">{formatMillions(liveAtRisk)}</div>
              <p className="text-[10px] text-gray-400 mt-1">Daily aggregated assembly revenue</p>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Active Threat Clusters</p>
              <div className="text-2xl font-black text-amber-500 font-mono">{activeThreats} Threats</div>
              <p className="text-[10px] text-gray-400 mt-1">Cross-referenced with fab telemetry</p>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Autonomous Mitigated Value</p>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatMillions(liveRecovered)}</div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Protected via spot allocations</p>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Enterprise Recovery Rate</p>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {liveAtRisk > 0 ? Math.round((liveRecovered / liveAtRisk) * 100) : 88}%
              </div>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">Target benchmark &gt; 85%</p>
            </div>
          </div>

          {/* Interactive Exposure Breakdown & Drilldown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Category Stack */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0f1115] p-6 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" /> Exposure by Silicon Category
                </h3>
                <span className="text-[11px] text-gray-400">Click to filter</span>
              </div>

              <div className="space-y-3">
                {categoryExposure.map((cat, i) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div 
                      key={i}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' 
                          : 'bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-gray-900 dark:text-white">{getCategoryName(cat.name)}</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">{formatMillions(cat.value)} ({Math.round(cat.pct)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className={`${getCategoryColor(i)} h-2 rounded-full transition-all duration-700`} style={{ width: `${Math.max(cat.pct, 5)}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2">
                        <span>{cat.items?.length || 0} Impacted Components</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                          View Drilldown <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Component Drilldown Table */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0f1115] p-6 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm space-y-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-500" /> Active Disrupted Components in {selectedCategory}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Click any component to open its live Decision Center and Mouser Sourcing Matrix.</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {currentCategoryObj?.items?.length || 0} Active MPNs
                </span>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-white/5 overflow-y-auto max-h-[480px]">
                {currentCategoryObj?.items?.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-white/5 px-2 rounded-xl transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">
                          {item.part_affected}
                        </span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 font-mono">
                          {item.disruption_id}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{item.event_type} • S/4HANA Daily Risk: <span className="font-bold text-red-600 dark:text-red-400">${item.revenue_at_risk_usd?.toLocaleString()}</span></p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link 
                        href={`/disruptions/${item.disruption_id}`}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        Decision Center <ArrowRight className="w-3 h-3" />
                      </Link>
                      {item.recovery_plan_id && (
                        <Link 
                          href={`/plans?id=${item.recovery_plan_id}`}
                          className="px-2.5 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-all"
                        >
                          Plan
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
