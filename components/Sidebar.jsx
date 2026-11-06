import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, LayoutDashboard, ShieldAlert, CheckCircle, Database, Activity, DollarSign, X, Radio } from 'lucide-react';

export default function Sidebar({ mobileOpen, onClose }) {
  const router = useRouter();
  
  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };
  
  const linkClass = (path) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
      isActive(path) 
        ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-bold border border-primary-200/80 dark:border-primary-500/30 shadow-2xs' 
        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-900/60 border border-transparent'
    }`;
    
  const iconClass = (path, defaultColor) => 
    `w-4 h-4 shrink-0 transition-colors ${isActive(path) ? 'text-primary-500 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`;

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
        className={`${mobileOpen ? 'flex' : 'hidden'} lg:flex flex-col w-64 border-r border-[#E8E8E8] dark:border-[#222222] bg-white dark:bg-[#0D0D0D] h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-colors duration-200 select-none`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#E8E8E8] dark:border-[#222222]">
          <Link href="/" className="flex items-center gap-3 group" onClick={handleClose}>
            <div className="relative">
              <img 
                src="/shield.png" 
                alt="SentinelChain Shield" 
                className="w-8 h-8 object-contain rounded-lg shadow-2xs shrink-0 transition-transform group-hover:scale-105"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-[#0D0D0D]"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-secondary-900 dark:text-white leading-none">
                SentinelChain
              </span>
              <span className="text-[8px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mt-1">
                Enterprise SCRM
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
        
        {/* Navigation Sections */}
        <div className="px-3.5 py-4 space-y-6 flex-1">
          <div>
            <p className="text-[10px] font-bold text-secondary-400 dark:text-secondary-500 mb-2 px-2.5 uppercase tracking-wider">
              Command Center
            </p>
            <nav className="space-y-1">
              <Link href="/" className={linkClass('/')} onClick={handleClose}>
                <LayoutDashboard className={iconClass('/', 'text-primary-500')} /> Dashboard
              </Link>
              <Link href="/disruptions" className={linkClass('/disruptions')} onClick={handleClose}>
                <ShieldAlert className={iconClass('/disruptions', 'text-red-500')} /> Active Disruptions
              </Link>
              <Link href="/plans" className={linkClass('/plans')} onClick={handleClose}>
                <CheckCircle className={iconClass('/plans', 'text-emerald-500')} /> Recovery Plans
              </Link>
              <Link href="/ledger" className={linkClass('/ledger')} onClick={handleClose}>
                <ShieldCheck className={iconClass('/ledger', 'text-primary-500')} /> Recovery Ledger
              </Link>
            </nav>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-secondary-400 dark:text-secondary-500 mb-2 px-2.5 uppercase tracking-wider">
              Intelligence
            </p>
            <nav className="space-y-1">
              <Link href="/network" className={linkClass('/network')} onClick={handleClose}>
                <Database className={iconClass('/network', 'text-cyan-500')} /> Supply Network
              </Link>
              <Link href="/risk" className={linkClass('/risk')} onClick={handleClose}>
                <Activity className={iconClass('/risk', 'text-amber-500')} /> Risk Matrix
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-bold text-secondary-400 dark:text-secondary-500 mb-2 px-2.5 uppercase tracking-wider">
              Commercial
            </p>
            <nav className="space-y-1">
              <Link href="/pricing" className={linkClass('/pricing')} onClick={handleClose}>
                <DollarSign className={iconClass('/pricing', 'text-emerald-500')} /> Pricing & ROI Model
              </Link>
            </nav>
          </div>
        </div>

        {/* Sentinel Live Status Card */}
        <div className="mt-auto p-3.5 m-3.5 rounded-lg border border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#111111] shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9.5px] uppercase font-bold text-secondary-700 dark:text-secondary-300 tracking-wider">AI Sentinel Node</span>
            </div>
            <Radio className="w-3 h-3 text-primary-500" />
          </div>
          <p className="text-[11px] font-medium text-secondary-500 dark:text-secondary-400">Continuous Ingestion</p>
          <p className="text-[11px] font-mono font-bold text-primary-600 dark:text-primary-400 mt-0.5">32,491 Global Nodes</p>
        </div>
      </aside>
    </>
  );
}
