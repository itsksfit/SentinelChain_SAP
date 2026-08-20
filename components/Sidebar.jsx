import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, LayoutDashboard, ShieldAlert, CheckCircle, Database, Activity } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  
  const isActive = (path) => router.pathname === path;
  
  const linkClass = (path) => 
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-white/5 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;
    
  const iconClass = (path, defaultColor) => 
    `w-4 h-4 ${isActive(path) ? defaultColor : 'text-gray-400'}`;

  return (
    <aside id="mobile-sidebar" className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#0f1115] h-screen fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-wide text-white">SentinelChain</span>
        </div>
        <button className="lg:hidden p-2 text-gray-400 hover:text-white" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>
          ✕
        </button>
      </div>
      
      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">Command Center</p>
        <nav className="space-y-1">
          <Link href="/" passHref legacyBehavior>
            <a className={linkClass('/')}>
              <LayoutDashboard className={iconClass('/', 'text-indigo-400')} /> Dashboard
            </a>
          </Link>
          <Link href="/disruptions" passHref legacyBehavior>
            <a className={linkClass('/disruptions')}>
              <ShieldAlert className={iconClass('/disruptions', 'text-red-400')} /> Active Disruptions
            </a>
          </Link>
          <Link href="/plans" passHref legacyBehavior>
            <a className={linkClass('/plans')}>
              <CheckCircle className={iconClass('/plans', 'text-emerald-400')} /> Recovery Plans
            </a>
          </Link>
        </nav>
      </div>

      <div className="px-4 py-6">
        <p className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">Intelligence</p>
        <nav className="space-y-1">
          <Link href="/network" passHref legacyBehavior>
            <a className={linkClass('/network')}>
              <Database className={iconClass('/network', 'text-blue-400')} /> Supply Network
            </a>
          </Link>
          <Link href="/risk" passHref legacyBehavior>
            <a className={linkClass('/risk')}>
              <Activity className={iconClass('/risk', 'text-orange-400')} /> Risk Analysis
            </a>
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-white/10">
        <div className="relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 p-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 animate-[progress_2s_ease-in-out_infinite]"></div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">AI Sentinel Node</p>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <div className="absolute inset-2 rounded-full bg-indigo-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Actively Scanning</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">32,491 Global Nodes</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
