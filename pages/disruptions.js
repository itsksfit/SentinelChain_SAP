import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldAlert, AlertTriangle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StatusBadge from '../components/StatusBadge';

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  return {
    props: {
      initialDisruptions: data
    }
  };
}

export default function Disruptions({ initialDisruptions }) {
  const [disruptions, setDisruptions] = useState(initialDisruptions);

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      if (custom.length > 0) {
        setDisruptions([...custom, ...initialDisruptions]);
      }
    } catch(e) {}
  }, [initialDisruptions]);
  
  const router = useRouter();
  useEffect(() => {
    if (router.query.id) {
      setTimeout(() => {
        const el = document.getElementById(router.query.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [router.query.id]);
  
  const getSeverity = (risk) => {
    if (risk > 1000000) return { label: 'CRITICAL', color: 'text-red-400 bg-red-500/20 border-red-500/30' };
    if (risk > 200000) return { label: 'HIGH', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' };
    return { label: 'MEDIUM', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' };
  };


  const countCrit = disruptions.filter(d => d.revenue_at_risk_usd > 1000000 && !d.status.includes('Resolved') && !d.status.includes('Completed')).length;
  const countHigh = disruptions.filter(d => d.revenue_at_risk_usd > 200000 && d.revenue_at_risk_usd <= 1000000 && !d.status.includes('Resolved') && !d.status.includes('Completed')).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f18] flex">
      <Head><title>Active Disruptions | SentinelChain</title></Head>
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Active Disruptions</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time monitoring of supply chain anomalies mapped to BOM.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm font-medium">{countCrit} Critical</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-sm font-medium">{countHigh} High</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disruptions.map((d, i) => {
              const sev = getSeverity(d.revenue_at_risk_usd);
              return (
                <div key={i} id={d.disruption_id} className="bg-white dark:bg-[#0f1115] p-5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${sev.color.replace('border-', '').replace('text-', 'bg-').replace('/20', '/10')}`}>
                        <ShieldAlert className={`w-5 h-5 ${sev.color.split(' ')[0]}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {d.disruption_id.includes('LIVE') && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Session Injection"></span>}
                          {d.disruption_id} • {d.part_affected}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{d.event_type} — Risk: ${d.revenue_at_risk_usd?.toLocaleString() || '0'}/day</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${sev.color}`}>
                      {sev.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {new Date(d.detected_at || Date.now()).toLocaleDateString()}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    
                    <Link href={`/disruptions/${d.disruption_id}`} className="text-indigo-500 hover:text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded transition-colors">
                      Open Decision Center <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
