import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, LayoutDashboard, ShieldAlert, CheckCircle, Database, Activity, Radio } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  
  const isActive = (path) => router.pathname === path;
  
  const linkClass = (path) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive(path) 
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-600/10 dark:text-indigo-400 font-bold border border-indigo-200/80 dark:border-indigo-500/30 shadow-xs' 
        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
    }`;
    
  const iconClass = (path, defaultColor) => 
    `w-4 h-4 shrink-0 ${isActive(path) ? defaultColor : 'text-slate-500 dark:text-gray-400'}`;

  return (
    <aside id="mobile-sidebar" className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f18] h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-colors duration-200">
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <img 
            src="/shield.png" 
            alt="Logo Icon" 
            className="w-9 h-9 object-contain rounded-xl shadow-xs border border-slate-200/60 dark:border-[#27272a] shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">SentinelChain</span>
            <span className="text-[7.5px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-1">Global Integrity</span>
          </div>
        </div>
        <button className="lg:hidden p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>
          ✕
        </button>
      </div>
      
      <div className="px-4 py-4 space-y-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 mb-2 px-2 uppercase tracking-wider">Command Center</p>
          <nav className="space-y-1">
            <Link href="/" passHref legacyBehavior>
              <a className={linkClass('/')}>
                <LayoutDashboard className={iconClass('/', 'text-indigo-600 dark:text-indigo-400')} /> Dashboard
              </a>
            </Link>
            <Link href="/mesh" passHref legacyBehavior>
              <a className={linkClass('/mesh')}>
                <Radio className={iconClass('/mesh', 'text-amber-500 dark:text-amber-400')} /> Event Mesh Sensor
              </a>
            </Link>
            <Link href="/disruptions" passHref legacyBehavior>
              <a className={linkClass('/disruptions')}>
                <ShieldAlert className={iconClass('/disruptions', 'text-red-500 dark:text-red-400')} /> Active Disruptions
              </a>
            </Link>
            <Link href="/plans" passHref legacyBehavior>
              <a className={linkClass('/plans')}>
                <CheckCircle className={iconClass('/plans', 'text-emerald-600 dark:text-emerald-400')} /> Recovery Plans
              </a>
            </Link>
            <Link href="/ledger" passHref legacyBehavior>
              <a className={linkClass('/ledger')}>
                <ShieldCheck className={iconClass('/ledger', 'text-blue-600 dark:text-blue-400')} /> Recovery Ledger
              </a>
            </Link>
          </nav>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 mb-2 px-2 uppercase tracking-wider">Intelligence</p>
          <nav className="space-y-1">
            <Link href="/network" passHref legacyBehavior>
              <a className={linkClass('/network')}>
                <Database className={iconClass('/network', 'text-cyan-600 dark:text-cyan-400')} /> Supply Network
              </a>
            </Link>
            <Link href="/risk" passHref legacyBehavior>
              <a className={linkClass('/risk')}>
                <Activity className={iconClass('/risk', 'text-amber-500 dark:text-amber-400')} /> Risk Analysis
              </a>
            </Link>
          </nav>
        </div>
      </div>

      <div className="mt-auto p-4 m-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-gray-300 tracking-wider">AI Sentinel Node</span>
        </div>
        <p className="text-xs font-semibold text-slate-600 dark:text-gray-400">Actively Scanning</p>
        <p className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">32,491 Global Nodes</p>
      </div>
    </aside>
  );
}
