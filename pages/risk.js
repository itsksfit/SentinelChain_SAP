import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { ShieldAlert, Activity, ArrowRight, Database, CheckCircle2, AlertTriangle, Layers, ExternalLink, Sliders, TrendingUp } from 'lucide-react';
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
    const colors = ['bg-primary-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500'];
    return colors[i % colors.length];
  };

  const currentCategoryObj = categoryExposure.find(c => c.name === selectedCategory) || categoryExposure[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
      <Head>
        <title>Risk Matrix | SentinelChain</title>
        <meta name="description" content="Real-time financial exposure, active threat clusters, and deterministic S/4HANA ERP risk reduction." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-6 pb-24 min-w-0">
          
          {/* Header & Interconnected Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] dark:border-[#222222] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                ERP Exposure Analysis
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
                Enterprise Risk & Exposure Matrix
              </h1>
              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-2xl">
                Real-time financial exposure, active threat clusters, and deterministic SAP S/4HANA risk reduction.
              </p>
            </div>

            {/* Cross-Module Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/disruptions" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-red-600 dark:text-red-400 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5" /> Active Disruptions
              </Link>
              <Link href="/plans" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recovery Plans
              </Link>
              <Link href="/network" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#111111] hover:bg-secondary-50 dark:hover:bg-[#161616] transition-all flex items-center gap-1.5 text-primary-600 dark:text-primary-400 shadow-2xs">
                <Database className="w-3.5 h-3.5" /> Supply Network
              </Link>
            </div>
          </div>

          {/* Top KPI Metrics (PART 8.2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Total S/4HANA Exposure</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">{formatMillions(liveAtRisk)}</div>
              <p className="text-[10.5px] text-secondary-400 mt-1">Daily aggregated assembly revenue</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mb-1">Active Threat Clusters</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">{activeThreats} Threats</div>
              <p className="text-[10.5px] text-secondary-400 mt-1">Cross-referenced with fab telemetry</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Autonomous Mitigated Value</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{formatMillions(liveRecovered)}</div>
              <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Protected via spot allocations</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] p-5 rounded-xl shadow-2xs">
              <p className="text-[11px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-1">Enterprise Recovery Rate</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-500 tracking-tight">
                {liveAtRisk > 0 ? Math.round((liveRecovered / liveAtRisk) * 100) : 88}%
              </div>
              <p className="text-[10.5px] text-primary-600 dark:text-primary-400 font-bold mt-1">Target benchmark &gt; 85%</p>
            </div>
          </div>

          {/* Interactive Exposure Breakdown & Drilldown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Category Stack */}
            <div className="lg:col-span-5 bg-white dark:bg-[#111111] p-5 sm:p-6 border border-[#E8E8E8] dark:border-[#222222] rounded-xl shadow-2xs space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-secondary-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary-500" /> Exposure by Silicon Category
                </h3>
                <span className="text-[11px] text-secondary-400">Click to filter</span>
              </div>

              <div className="space-y-3">
                {categoryExposure.map((cat, i) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div 
                      key={i}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-primary-50/70 dark:bg-primary-950/20 border-primary-500 ring-1 ring-primary-500/30 shadow-2xs' 
                          : 'bg-[#F8F9FA] dark:bg-[#161616] border-[#E8E8E8] dark:border-[#262626] hover:border-[#D6D6D6] dark:hover:border-[#333333]'
                      }`}
                    >
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-secondary-900 dark:text-white">{getCategoryName(cat.name)}</span>
                        <span className="font-mono text-primary-600 dark:text-primary-400">{formatMillions(cat.value)} ({Math.round(cat.pct)}%)</span>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-secondary-800 rounded-full h-1.5 overflow-hidden">
                        <div className={`${getCategoryColor(i)} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${Math.max(cat.pct, 5)}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-secondary-400 mt-2">
                        <span>{cat.items?.length || 0} Impacted Components</span>
                        <span className="text-primary-600 dark:text-primary-400 font-bold flex items-center gap-0.5">
                          View Drilldown <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Component Drilldown Table */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111111] p-5 sm:p-6 border border-[#E8E8E8] dark:border-[#222222] rounded-xl shadow-2xs space-y-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#E8E8E8] dark:border-[#222222] pb-3">
                <div>
                  <h3 className="text-xs font-bold text-secondary-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-500" /> Active Disrupted Components in {selectedCategory}
                  </h3>
                  <p className="text-[11px] text-secondary-400 mt-0.5">Click any component to inspect technical specifications and Mouser alternatives.</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  {currentCategoryObj?.items?.length || 0} Active MPNs
                </span>
              </div>

              <div className="divide-y divide-[#E8E8E8] dark:divide-[#222222] overflow-y-auto max-h-[480px]">
                {currentCategoryObj?.items?.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary-50 dark:hover:bg-[#161616] px-2 rounded-lg transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded border border-primary-200 dark:border-primary-800/40">
                          {item.part_affected}
                        </span>
                        <span className="text-[11px] font-bold text-secondary-700 dark:text-secondary-300 font-mono">
                          {item.disruption_id}
                        </span>
                      </div>
                      <p className="text-[11px] text-secondary-500 dark:text-secondary-400">{item.event_type} • Daily Exposure: <span className="font-bold text-red-600 dark:text-red-400">${item.revenue_at_risk_usd?.toLocaleString()}</span></p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link 
                        href={`/disruptions/${item.disruption_id}`}
                        className="btn-primary !h-8 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs"
                      >
                        Decision Center <ArrowRight className="w-3 h-3" />
                      </Link>
                      {item.recovery_plan_id && (
                        <Link 
                          href={`/plans?id=${item.recovery_plan_id}`}
                          className="px-2.5 py-1.5 bg-[#F8F9FA] dark:bg-[#161616] hover:bg-secondary-100 dark:hover:bg-[#202020] text-secondary-700 dark:text-secondary-300 rounded-md text-xs font-bold transition-all border border-[#E8E8E8] dark:border-[#262626]"
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
        </main>
      </div>
    </div>
  );
}
