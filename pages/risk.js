import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldAlert, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
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
      initialRecovered: totalRecovered,
      initialRisk: totalAtRisk
    }
  };
}

export default function RiskAnalysis({ initialRecovered, initialRisk }) {
  const [liveRecovered, setLiveRecovered] = useState(initialRecovered);
  const [liveAtRisk, setLiveAtRisk] = useState(initialRisk || 84500000);

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      if (custom.length > 0) {
        const extraRecovered = custom.reduce((acc, d) => acc + (d.resolution?.recovered_amount_usd || 0), 0);
        const extraRisk = custom.reduce((acc, d) => acc + (d.revenue_at_risk_usd || 0), 0);
        setLiveRecovered(initialRecovered + extraRecovered);
        setLiveAtRisk((initialRisk || 84500000) + extraRisk);
      }
    } catch(e) {}
  }, [initialRecovered, initialRisk]);

  const formatMillions = (val) => `$${(val / 1000000).toFixed(1)}M`;

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 border-l-4 border-red-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Value at Risk (30d)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMillions(liveAtRisk)}</p>
            </div>
            <div className="glass-panel p-5 border-l-4 border-indigo-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Active Threats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="glass-panel p-5 border-l-4 border-emerald-500" title="Dynamically synced with Recovery Ledger total">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Mitigated Value</p>
              <p className="text-2xl font-bold text-emerald-400">{formatMillions(liveRecovered)}</p>
            </div>
          </div>

          <div className="glass-panel p-6 border border-gray-200 dark:border-white/10 rounded-xl mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Financial Exposure by Category</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Microcontrollers (MCU)</span>
                  <span className="font-bold text-gray-900 dark:text-white">$42.1M</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Power Management (PWR)</span>
                  <span className="font-bold text-gray-900 dark:text-white">$28.4M</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Memory (NAND/DRAM)</span>
                  <span className="font-bold text-gray-900 dark:text-white">$14.0M</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
