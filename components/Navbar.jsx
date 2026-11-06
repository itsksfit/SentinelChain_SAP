import { Menu, ShieldCheck, Bell, User, AlertTriangle, Sun, Moon, Search, Radio, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';

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
    { id: 1, type: 'alert', title: 'Critical Disruption Detected', text: 'AI identified a high-probability impact to MCU-2201X from recent export restrictions.', time: '2 mins ago', icon: AlertTriangle, color: 'text-red-500' },
    { id: 2, type: 'success', title: 'SAP Ariba PR Approved', text: 'Recovery plan RP-8042 has been successfully submitted to Ariba.', time: '1 hr ago', icon: ShieldCheck, color: 'text-emerald-500' },
    { id: 3, type: 'info', title: 'Supply Network Updated', text: 'Mouser Electronics has updated standard lead times for STM32 families.', time: '3 hrs ago', icon: Radio, color: 'text-primary-500' }
  ]);

  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/') return 'Mission Control';
    if (path.startsWith('/disruptions/')) return 'Decision Center';
    if (path === '/disruptions') return 'Active Disruptions';
    if (path === '/plans') return 'Recovery Plans';
    if (path === '/ledger') return 'Recovery Ledger';
    if (path === '/network') return 'Supply Network';
    if (path === '/risk') return 'Risk Matrix';
    if (path === '/pricing') return 'Pricing & ROI';
    if (path === '/login') return 'Authentication';
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
    <header className="h-[70px] border-b border-[#E8E8E8] dark:border-[#222222] bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="h-full w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: Mobile menu or Desktop breadcrumbs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMobileMenu}
            className="lg:hidden p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Mobile brand fallback */}
          <div className="flex items-center lg:hidden">
            <img 
              src="/logo-dark.png" 
              alt="SentinelChain" 
              className="h-7 w-auto max-w-[140px] object-contain block dark:hidden"
            />
            <img 
              src="/logo.png" 
              alt="SentinelChain" 
              className="h-7 w-auto max-w-[140px] object-contain hidden dark:block"
            />
          </div>

          {/* Desktop Breadcrumb */}
          <div className="hidden lg:flex items-center text-xs font-semibold text-secondary-400 dark:text-secondary-500 tracking-wide">
            <span>Enterprise SCRM</span>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-secondary-300 dark:text-secondary-600" />
            <span className="text-secondary-900 dark:text-white font-bold">{getPageTitle()}</span>
          </div>
        </div>

        {/* Right: Search, Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-2.5 relative">
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg hover:border-primary-500/40 hover:bg-secondary-100 dark:hover:bg-[#1f1f1f] transition-all font-medium"
          title="Open Command Palette (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-secondary-400" />
          <span>Quick search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9.5px] font-mono font-bold bg-white dark:bg-black/50 text-secondary-600 dark:text-secondary-400 rounded border border-[#E8E8E8] dark:border-[#2e2e2e] ml-2 shadow-2xs">⌘K</kbd>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 transition-all rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 border border-transparent hover:border-[#E8E8E8] dark:hover:border-[#222222]"
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
            className={`p-2 transition-all relative rounded-lg border ${
              showNotifications 
                ? 'text-secondary-900 dark:text-white bg-secondary-100 dark:bg-secondary-800 border-[#D6D6D6] dark:border-[#333333]' 
                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 border-transparent hover:border-[#E8E8E8] dark:hover:border-[#222222]'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full animate-pulse ring-2 ring-white dark:ring-[#0D0D0D]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#222222] rounded-xl shadow-card dark:shadow-dark-card overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#E8E8E8] dark:border-[#222222] flex justify-between items-center bg-[#F8F9FA] dark:bg-[#161616]">
                <h3 className="text-xs font-bold text-secondary-900 dark:text-white uppercase tracking-wider">
                  Risk & Sourcing Alerts
                </h3>
                {notifications.length > 0 && (
                  <span className="text-[9px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 px-2 py-0.5 rounded-full">
                    {notifications.length} Unresolved
                  </span>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-[#E8E8E8] dark:divide-[#222222]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-secondary-500 text-xs">
                    No active notifications. All signals monitored!
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className="p-3.5 hover:bg-secondary-50 dark:hover:bg-[#161616] transition-colors cursor-pointer flex gap-3">
                        <div className="mt-0.5 shrink-0"><Icon className={`w-4 h-4 ${n.color}`} /></div>
                        <div>
                          <p className="text-xs font-bold text-secondary-900 dark:text-white mb-0.5 leading-snug">{n.title}</p>
                          <p className="text-[11px] text-secondary-600 dark:text-secondary-400 leading-snug">{n.text}</p>
                          <p className="text-[9.5px] text-secondary-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2.5 border-t border-[#E8E8E8] dark:border-[#222222] bg-[#F8F9FA] dark:bg-[#161616] text-center">
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 uppercase tracking-wider transition-colors w-full py-1"
                  >
                    Mark all as investigated
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 border-l border-[#E8E8E8] dark:border-[#222222] pl-3">
          <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xs shadow-2xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-secondary-900 dark:text-white leading-none">Enterprise Admin</span>
            <span className="text-[9.5px] font-medium text-secondary-400 dark:text-secondary-500 mt-0.5">Plant Ops Lead</span>
          </div>
        </div>
      </div>
    </div>
  </header>
  );
}
