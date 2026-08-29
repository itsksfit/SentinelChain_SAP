import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
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

export default function RiskAnalysis({ initialDisruptions, initialRecovered, initialRisk }) {
  const [liveRecovered, setLiveRecovered] = useState(initialRecovered);
  const [liveAtRisk, setLiveAtRisk] = useState(initialRisk || 84500000);
  const [categoryExposure, setCategoryExposure] = useState([]);
  const [activeThreats, setActiveThreats] = useState(0);

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      const allDisruptions = [...custom, ...initialDisruptions];
      
      const extraRecovered = custom.reduce((acc, d) => acc + (d.resolution?.recovered_amount_usd || 0), 0);
      const extraRisk = custom.reduce((acc, d) => acc + (d.revenue_at_risk_usd || 0), 0);
      setLiveRecovered(initialRecovered + extraRecovered);
      
      const newTotalRisk = (initialRisk || 84500000) + extraRisk;
      setLiveAtRisk(newTotalRisk);

      const active = allDisruptions.filter(d => d.status !== 'Resolved' && d.status !== 'Completed').length;
      setActiveThreats(active);

      const groups = {};
      allDisruptions.forEach(d => {
        let cat = d.part_affected.split('-')[0];
        if (cat === 'N/A' || cat === 'Unrelated / Noise') return; 
        if (!groups[cat]) groups[cat] = 0;
        groups[cat] += (d.revenue_at_risk_usd || 0);
      });

      const sortedCategories = Object.keys(groups).map(k => ({
        name: k,
        value: groups[k],
        pct: newTotalRisk > 0 ? (groups[k] / newTotalRisk) * 100 : 0
      })).sort((a, b) => b.value - a.value);

      setCategoryExposure(sortedCategories);

    } catch(e) {}
  }, [initialDisruptions, initialRecovered, initialRisk]);

  const formatMillions = (val) => `$${(val / 1000000).toFixed(1)}M`;
  const getCategoryName = (code) => {
    const map = {
      'GPU': 'Graphics Processors (GPU)',
      'MCU': 'Microcontrollers (MCU)',
      'PWR': 'Power Management (PWR)',
      'MEM': 'Memory (NAND/DRAM)',
      'NAND': 'NAND Storage',
      'CPU': 'Central Processors',
      'DSP': 'Digital Signal Processors',
      'FPGA': 'Field Programmable Gates'
    };
    return map[code] || `${code} Components`;
  };

  const getCategoryColor = (i) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500'];
    return colors[i % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head><title>Risk Analysis | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Enterprise Risk Analysis</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Macro-level financial exposure and AI mitigation metrics.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Total Value at Risk (30d)</p>
              <div className="text-[24px] font-bold text-gray-900 dark:text-white">{formatMillions(liveAtRisk)}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Active Threats</p>
              <div className="text-[24px] font-bold text-gray-900 dark:text-white">{activeThreats}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Mitigated Value</p>
              <div className="text-[24px] font-bold text-emerald-600 dark:text-emerald-400">{formatMillions(liveRecovered)}</div>
            </div>
            <div className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-5 rounded-lg">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Risk Reduction</p>
              <div className="text-[24px] font-bold text-gray-900 dark:text-white">{liveAtRisk > 0 ? Math.round((liveRecovered/liveAtRisk)*100) : 0}%</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1115] p-6 border border-gray-200 dark:border-white/10 rounded-xl mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Financial Exposure by Category (Live Data)</h3>
            <div className="space-y-5">
              {categoryExposure.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{getCategoryName(cat.name)}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatMillions(cat.value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className={`${getCategoryColor(i)} h-2 rounded-full transition-all duration-1000`} style={{width: `${cat.pct}%`}}></div>
                  </div>
                </div>
              ))}
              {categoryExposure.length === 0 && (
                <p className="text-gray-500 text-sm">No significant financial exposure registered yet.</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
