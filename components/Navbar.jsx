import { Menu, ShieldCheck, Bell, User, Info, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

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
    { id: 3, type: 'info', title: 'Supply Network Updated', text: 'Distributor B has updated their standard lead times.', time: '3 hrs ago', icon: Info, color: 'text-blue-500' }
  ]);

  return (
    <>
    <header className="h-16 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200 shadow-xs">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={() => {
          const sidebar = document.getElementById('mobile-sidebar');
          if (sidebar) sidebar.classList.toggle('hidden');
        }}>
          <Menu className="w-6 h-6 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white" />
        </button>
        <div className="flex items-center gap-2.5">
          <img 
            src="/shield.png" 
            alt="Logo Icon" 
            className="w-8 h-8 object-contain rounded-lg shadow-xs border border-slate-200/60 dark:border-[#27272a] shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">SentinelChain</span>
            <span className="text-[7.5px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Global Integrity</span>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
        Mission Control / <span className="text-slate-900 dark:text-white ml-1 font-extrabold">Dashboard</span>
      </div>
      <div className="flex items-center gap-3 relative">
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg hover:border-indigo-500/50 hover:bg-slate-200/50 transition-all font-medium"
        >
          <span>🔍</span>
          <span>Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white dark:bg-black/40 rounded border border-slate-200 dark:border-white/10 ml-2 shadow-2xs">⌘K</kbd>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 transition-all rounded-lg text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        )}
        <div ref={dropdownRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 transition-all relative rounded-lg border ${showNotifications ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/10'}`}
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-[#0f1115]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="text-[9px] uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No new notifications. You're all caught up!
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                        <div className="mt-0.5"><Icon className={`w-4 h-4 ${n.color}`} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-slate-600 dark:text-gray-400 leading-snug">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 uppercase tracking-wider transition-colors w-full py-1"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs shadow-2xs">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-slate-800 dark:text-slate-200">Enterprise Admin</span>
        </div>
      </div>
    </header>
    </>
  );
}
