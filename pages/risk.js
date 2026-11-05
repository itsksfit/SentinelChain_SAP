import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { ShieldAlert, Activity, ArrowRight, Database, CheckCircle2, AlertTriangle, Layers, ExternalLink, Sliders, TrendingUp, ChevronRight, Zap, Cpu } from 'lucide-react';
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

  const currentCategoryObj = categoryExposure.find(c => c.name === selectedCategory) || categoryExposure[0];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>Risk Matrix | SentinelChain</title>
        <meta name="description" content="Real-time financial exposure, active threat clusters, and deterministic S/4HANA ERP risk reduction." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-400 gap-2">
            <Link href="/" className="hover:text-primary-500 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white">ERP Exposure Matrix</span>
          </div>

          {/* Editorial Header */}
          <div className="border-b border-[#EAEAEA] dark:border-[#222222] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  S/4HANA BOM Correlation
                </span>
                <span className="text-xs font-mono font-bold text-secondary-400">
                  {categoryExposure.length} Silicon Categories Exposed
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/disruptions" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-red-600 dark:text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5" /> Disruption Feed
                </Link>
                <Link href="/ledger" className="px-4 py-2 bg-white dark:bg-[#141414] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center gap-2 transition-all text-primary-600 dark:text-primary-400">
                  <Activity className="w-3.5 h-3.5" /> Recovery Ledger
                </Link>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-secondary-900 dark:text-white leading-[1.12]">
              Enterprise <span className="font-serif-italic text-primary-500 font-normal tracking-normal text-[1.12em] px-1">Risk & Exposure Matrix.</span>
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Real-time financial exposure grouped by component semiconductor architectures, cross-referenced with fab telemetry, assembly plant dependencies, and bill-of-materials impact.
            </p>
          </div>

          {/* Frameless Crosshair 4-Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E5E7EB] dark:divide-[#262626] border-y border-[#E5E7EB] dark:border-[#262626] py-2">
            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Total S/4HANA Exposure</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">{formatMillions(liveAtRisk)}</span>
              <span className="text-xs text-secondary-400">Daily aggregated assembly revenue</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Active Threat Clusters</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">{activeThreats} Threats</span>
              <span className="text-xs text-secondary-400">Cross-referenced with fab telemetry</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Gross Margin Recovered</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{formatMillions(liveRecovered)}</span>
              <span className="text-xs text-secondary-400">Through autonomous Mouser spot matching</span>
            </div>

            <div className="p-6 flex flex-col justify-between h-36">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wider">Silicon Exposure Depth</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">{categoryExposure.length} Families</span>
              <span className="text-xs text-secondary-400">MCUs, Power ICs, Memory, FPGAs</span>
            </div>
          </div>

          {/* Balanced Two-Column Exposure Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Category Vulnerability Heat Bars (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#141414] p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-[#262626]">
                <div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Component Architecture Vulnerability</h3>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">Click a category to inspect affected bill-of-materials components</p>
                </div>
                <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                  {selectedCategory || 'ALL'} SELECTED
                </span>
              </div>

              <div className="space-y-4">
                {categoryExposure.map((cat, i) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-primary-50/70 dark:bg-primary-950/20 border-primary-500 shadow-2xs' 
                          : 'bg-[#F9FAFB] dark:bg-[#18191D] border-[#E5E7EB] dark:border-[#262626] hover:border-[#D1D5DB] dark:hover:border-[#333333]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-md ${isSelected ? 'bg-primary-500' : 'bg-secondary-400'}`}></span>
                          <span className="text-sm font-extrabold text-secondary-900 dark:text-white">
                            {getCategoryName(cat.name)}
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-secondary-900 dark:text-white">
                          ${(cat.value / 1000000).toFixed(2)}M
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-primary-500' : 'bg-secondary-400 dark:bg-secondary-600'}`}
                            style={{width: `${Math.min(100, Math.max(5, cat.pct))}%`}}
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-bold text-secondary-500 w-12 text-right">
                          {cat.pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Active Drilldown Detail Card (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#141414] p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-[#262626]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block mb-1">
                      Active Threat Drilldown
                    </span>
                    <h3 className="text-lg font-extrabold text-secondary-900 dark:text-white">
                      {currentCategoryObj ? getCategoryName(currentCategoryObj.name) : 'Category Details'}
                    </h3>
                  </div>
                  <Cpu className="w-6 h-6 text-primary-500 shrink-0" />
                </div>

                <div className="mt-5 space-y-4">
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">Category Exposure at Risk</p>
                    <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                      ${((currentCategoryObj?.value || 0) / 1000000).toFixed(2)}M <span className="text-xs font-semibold text-secondary-400">/ day</span>
                    </p>
                    <p className="text-xs text-secondary-500 mt-1">
                      Represents {currentCategoryObj?.pct?.toFixed(1) || 0}% of total enterprise daily exposure.
                    </p>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-400 pt-2">
                    Affected Components ({currentCategoryObj?.items?.length || 0})
                  </h4>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {currentCategoryObj?.items?.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#F9FAFB] dark:bg-[#18191D] border border-[#E5E7EB] dark:border-[#262626] flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-xs text-primary-600 dark:text-primary-400">{item.part_affected}</p>
                          <p className="text-[11px] text-secondary-500">{item.event_type || 'Silicon Shortage'} • {item.plants_affected || 2} Plants</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="font-extrabold text-xs text-secondary-900 dark:text-white">${((item.revenue_at_risk_usd || 1575000) / 1000).toFixed(0)}k/d</span>
                          <Link 
                            href={`/disruptions/${item.disruption_id}`}
                            className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5"
                          >
                            Decision Center <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#262626]">
                <Link
                  href="/disruptions"
                  className="btn-primary !h-10 w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4" /> Open Full Disruption Decision Queue
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
