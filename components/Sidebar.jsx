import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ShieldCheck, LayoutDashboard, ShieldAlert, CheckCircle2, 
  Database, Activity, DollarSign, X, Radio, Cpu, Layers, ArrowUpRight
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onClose }) {
  const router = useRouter();
  
  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };
  
  const linkClass = (path) => 
    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
      isActive(path) 
        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800/60 shadow-xs' 
        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100/70 dark:hover:bg-secondary-800/60 border border-transparent'
    }`;
    
  const iconClass = (path) => 
    `w-4 h-4 shrink-0 transition-colors ${isActive(path) ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500 group-hover:text-secondary-700 dark:group-hover:text-secondary-300'}`;

  const handleClose = () => {
    if (onClose) onClose();
    const el = document.getElementById('mobile-sidebar');
    if (el) el.classList.add('hidden');
    const backdrop = document.getElementById('mobile-sidebar-backdrop');
    if (backdrop) backdrop.classList.add('hidden');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        id="mobile-sidebar-backdrop" 
        className={`${mobileOpen ? 'block' : 'hidden'} fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden`}
        onClick={handleClose}
      />

      <aside 
        id="mobile-sidebar" 
        className={`${mobileOpen ? 'flex' : 'hidden'} lg:flex flex-col w-64 border-r border-[#E5E7EB] dark:border-[#222222] bg-[#FFFFFF] dark:bg-[#0D0F14] h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-colors duration-200 select-none`}
      >
        {/* Brand Header: Defense/Control Tower Emblem */}
        <div className="p-4.5 border-b border-[#E5E7EB] dark:border-[#222222] bg-[#FAFAFC] dark:bg-[#0A0C10]">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group" onClick={handleClose}>
              <div className="relative">
                <img 
                  src="/shield.png" 
                  alt="SentinelChain Shield" 
                  className="w-8 h-8 object-contain rounded-lg shadow-sm shrink-0 transition-transform group-hover:scale-105"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-[#0D0F14]"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-secondary-900 dark:text-white leading-none">
                    SentinelChain
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-primary-500 text-white px-1.5 py-0.5 rounded">
                    SCRM
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mt-1">
                  Enterprise Control Tower
                </span>
              </div>
            </Link>
            <button 
              className="lg:hidden p-1.5 text-secondary-400 hover:text-secondary-700 dark:hover:text-white rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800" 
              onClick={handleClose}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Institutional Status Ribbon */}
          <div className="mt-3 pt-2.5 border-t border-[#EAEAEA] dark:border-[#1E232F] flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-secondary-600 dark:text-secondary-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SAP S/4HANA OData
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              LIVE
            </span>
          </div>
        </div>
        
        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6 flex-1">
          <div>
            <p className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 mb-2 px-2.5 uppercase tracking-wider flex items-center justify-between">
              <span>Operations Tower</span>
              <span className="text-[11px] text-secondary-400 font-mono font-normal">Real-Time</span>
            </p>
            <nav className="space-y-1">
              <Link href="/" className={linkClass('/')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={iconClass('/')} />
                  <span>Mission Control</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-secondary-500 bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">
                  24h
                </span>
              </Link>
              <Link href="/disruptions" className={linkClass('/disruptions')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className={iconClass('/disruptions')} />
                  <span>Threat Intelligence</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 px-1.5 py-0.5 rounded">
                  3 Crit
                </span>
              </Link>
              <Link href="/plans" className={linkClass('/plans')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className={iconClass('/plans')} />
                  <span>Recovery Plans</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  4 Active
                </span>
              </Link>
              <Link href="/ledger" className={linkClass('/ledger')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className={iconClass('/ledger')} />
                  <span>PR Audit Ledger</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">
                  Immutable
                </span>
              </Link>
            </nav>
          </div>
          
          <div>
            <p className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 mb-2 px-2.5 uppercase tracking-wider flex items-center justify-between">
              <span>Supply Telemetry</span>
              <span className="text-[11px] text-secondary-400 font-mono font-normal">Foundry Grid</span>
            </p>
            <nav className="space-y-1">
              <Link href="/network" className={linkClass('/network')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <Database className={iconClass('/network')} />
                  <span>Silicon Fab Network</span>
                </div>
                <span className="text-[11px] font-mono text-secondary-500">20+ Fabs</span>
              </Link>
              <Link href="/risk" className={linkClass('/risk')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <Activity className={iconClass('/risk')} />
                  <span>BOM Risk Matrix</span>
                </div>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">Exposure</span>
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 mb-2 px-2.5 uppercase tracking-wider">
              Procurement & ROI
            </p>
            <nav className="space-y-1">
              <Link href="/pricing" className={linkClass('/pricing')} onClick={handleClose}>
                <div className="flex items-center gap-2.5">
                  <DollarSign className={iconClass('/pricing')} />
                  <span>Commercial & ROI</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-secondary-400" />
              </Link>
            </nav>
          </div>
        </div>

        {/* Sentinel Live Telemetry Widget */}
        <div className="mt-auto p-3 m-3 rounded-xl border border-[#E5E7EB] dark:border-[#222222] bg-[#F9FAFB] dark:bg-[#121620] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] uppercase font-bold text-secondary-800 dark:text-secondary-200 tracking-wider">Telemetry Engine</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              34ms
            </span>
          </div>
          
          <div className="space-y-1 pt-1 border-t border-[#EAEAEA] dark:border-[#1E232F] text-[11px] font-mono">
            <div className="flex items-center justify-between text-secondary-600 dark:text-secondary-400">
              <span>Mouser Sourcing:</span>
              <span className="text-secondary-900 dark:text-white font-bold">14,200 pcs</span>
            </div>
            <div className="flex items-center justify-between text-secondary-600 dark:text-secondary-400">
              <span>BOM Coverage:</span>
              <span className="text-secondary-900 dark:text-white font-bold">100% Exploded</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
