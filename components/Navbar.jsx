import { Menu, ShieldCheck, Bell, User, AlertTriangle, Sun, Moon, Search, Radio, ChevronRight, Clock, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'Critical Seismic Shock: Hsinchu Fab 18', text: 'USGS M6.4 event detected near TSMC Tainan. STM32 MCU runout in 5 days at Plant 1010.', time: '4 mins ago', icon: AlertTriangle, color: 'text-red-500', link: '/disruptions' },
    { id: 2, type: 'success', title: 'SAP Ariba Purchase Requisition Ready', text: 'Autonomous spot allocation RP-8042 (14,200 pcs STM32F401RBT6TR) ready for human commitment.', time: '22 mins ago', icon: ShieldCheck, color: 'text-emerald-500', link: '/plans' },
    { id: 3, type: 'info', title: 'BIS Export Administration Update', text: 'Federal Register EAR gazette scanned. Advanced computing chip rule verified.', time: '1 hr ago', icon: Radio, color: 'text-primary-500', link: '/disruptions' }
  ]);

  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/') return 'Mission Control & BOM Explosion';
    if (path.startsWith('/disruptions/')) return 'Disruption Decision Center';
    if (path === '/disruptions') return 'Active Threat Intelligence';
    if (path === '/plans') return 'Automated Recovery Plans';
    if (path === '/ledger') return 'PR Compliance Audit Ledger';
    if (path === '/network') return 'Global Silicon Fab Network';
    if (path === '/risk') return 'Dollar-at-Risk Matrix';
    if (path === '/pricing') return 'Enterprise Commercial & ROI';
    if (path === '/login') return 'Enterprise Authentication';
    return 'Dashboard';
  };

  const handleMobileMenu = () => {
    if (onMenuClick) {
      onMenuClick();
      return;
    }
    const sidebar = document.getElementById('mobile-sidebar');
    if (sidebar) sidebar.classList.toggle('hidden');
    const backdrop = document.getElementById('mobile-sidebar-backdrop');
    if (backdrop) backdrop.classList.toggle('hidden');
  };

  return (
    <header className="h-[68px] border-b border-[#E5E7EB] dark:border-[#222222] bg-[#FFFFFF]/95 dark:bg-[#0D0F14]/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="h-full w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        
        {/* Left: Mobile trigger & Telemetry Breadcrumbs */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={handleMobileMenu}
            className="lg:hidden p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Mobile brand logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <img 
              src="/shield.png" 
              alt="SentinelChain Logo" 
              className="w-7 h-7 object-contain rounded-md"
            />
            <span className="text-sm font-black tracking-tight text-secondary-900 dark:text-white">SentinelChain</span>
          </div>

          {/* Desktop Breadcrumbs with Live Status */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-100 dark:bg-[#151922] border border-[#E5E7EB] dark:border-[#262B37] text-secondary-600 dark:text-secondary-400 font-mono text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SAP S/4HANA</span>
              <span className="text-secondary-400 dark:text-secondary-600">•</span>
              <span className="text-secondary-900 dark:text-white">OData V4</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-secondary-400" />
            <span className="text-secondary-900 dark:text-white font-black tracking-tight text-xs">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Center: Global Fab Corridor Clocks (UTC, TPE, FRA, AUS) */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-lg bg-secondary-50 dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#202636] text-[11px] font-mono text-secondary-600 dark:text-secondary-400">
          <div className="flex items-center gap-1.5 font-bold text-secondary-800 dark:text-secondary-300">
            <Globe className="w-3.5 h-3.5 text-primary-500" />
            <span>FAB TIMEZONES:</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span>TPE <strong className="text-secondary-900 dark:text-white">17:54</strong> <span className="text-[11px] text-emerald-600 font-bold">(TSMC)</span></span>
            <span className="text-secondary-300 dark:text-secondary-700">•</span>
            <span>FRA <strong className="text-secondary-900 dark:text-white">10:54</strong> <span className="text-[11px] text-emerald-600 font-bold">(Saxony)</span></span>
            <span className="text-secondary-300 dark:text-secondary-700">•</span>
            <span>AUS <strong className="text-secondary-900 dark:text-white">03:54</strong> <span className="text-[11px] text-secondary-400">(Austin)</span></span>
          </div>
        </div>

        {/* Right: Search, Theme Toggle, Notifications, Operator Profile */}
        <div className="flex items-center gap-2.5 relative">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-[#141824] border border-[#E5E7EB] dark:border-[#222736] rounded-xl hover:border-primary-500/50 hover:bg-secondary-100 dark:hover:bg-[#1B2030] transition-all font-medium shadow-2xs"
            title="Open Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-secondary-400" />
            <span className="font-mono text-[11px]">Search MPN, BOM or Fab...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono font-bold bg-white dark:bg-black/60 text-secondary-700 dark:text-secondary-300 rounded border border-[#E5E7EB] dark:border-[#2A3144] ml-1.5 shadow-2xs">⌘K</kbd>
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 transition-all rounded-xl text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#262626]"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-secondary-700" />
              )}
            </button>
          )}

          {/* Notifications Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 transition-all relative rounded-xl border ${
                showNotifications 
                  ? 'text-secondary-900 dark:text-white bg-secondary-100 dark:bg-secondary-800 border-[#D6D6D6] dark:border-[#333333]' 
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 border-transparent hover:border-[#E5E7EB] dark:hover:border-[#262626]'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full animate-pulse ring-2 ring-white dark:ring-[#0D0F14]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#222736] flex justify-between items-center bg-[#F9FAFB] dark:bg-[#0E1118]">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
                    <h3 className="text-xs font-black text-secondary-900 dark:text-white uppercase tracking-wider">
                      Real-Time Risk Telemetry
                    </h3>
                  </div>
                  {notifications.length > 0 && (
                    <span className="text-[11px] font-mono font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 px-2 py-0.5 rounded-full">
                      {notifications.length} Unresolved
                    </span>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-[#E5E7EB] dark:divide-[#1F2533]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-secondary-500 text-xs font-medium">
                      All disruption signals acknowledged. Plant buffers nominal.
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <Link 
                          key={n.id} 
                          href={n.link} 
                          onClick={() => setShowNotifications(false)}
                          className="p-3.5 hover:bg-secondary-50 dark:hover:bg-[#161C28] transition-colors block"
                        >
                          <div className="flex gap-3">
                            <div className="mt-0.5 shrink-0"><Icon className={`w-4 h-4 ${n.color}`} /></div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-secondary-900 dark:text-white leading-snug">{n.title}</p>
                              <p className="text-[11px] text-secondary-600 dark:text-secondary-400 leading-snug">{n.text}</p>
                              <p className="text-[11px] font-mono text-secondary-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2.5 border-t border-[#E5E7EB] dark:border-[#222736] bg-[#F9FAFB] dark:bg-[#0E1118] text-center">
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 uppercase tracking-wider transition-colors w-full py-1 cursor-pointer"
                    >
                      Acknowledge All Telemetry Signals
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile / Plant Lead */}
          <div className="flex items-center gap-2.5 border-l border-[#E5E7EB] dark:border-[#222222] pl-3">
            <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xs shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-black text-secondary-900 dark:text-white leading-none">Enterprise Ops</span>
              <span className="text-[11px] font-mono text-secondary-500 dark:text-secondary-400 mt-0.5">Plant Lead (Stuttgart)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
