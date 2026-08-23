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

  // Close dropdown when clicking outside
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
    { id: 1, type: 'alert', title: 'Critical Disruption Detected', text: 'AI identified a high-probability impact to MCU-2201X from recent export restrictions.', time: '2 mins ago', icon: AlertTriangle, color: 'text-red-400' },
    { id: 2, type: 'success', title: 'SAP Ariba PR Approved', text: 'Recovery plan RP-8042 has been successfully submitted to Ariba.', time: '1 hr ago', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 3, type: 'info', title: 'Supply Network Updated', text: 'Distributor B has updated their standard lead times.', time: '3 hrs ago', icon: Info, color: 'text-blue-400' }
  ]);

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-200 dark:border-white/10 flex items-center justify-between px-6 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={() => {
          const sidebar = document.getElementById('mobile-sidebar');
          if (sidebar) sidebar.classList.toggle('hidden');
        }}>
          <Menu className="w-6 h-6 text-gray-500 dark:text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-900 dark:text-white" />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-indigo-500 w-5 h-5" />
          <span className="font-bold text-gray-900 dark:text-gray-900 dark:text-white">SentinelChain</span>
        </div>
      </div>
      <div className="hidden lg:flex items-center text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
        Mission Control / Dashboard
      </div>
      <div className="flex items-center gap-4 relative">
        
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 transition-colors rounded-full text-gray-500 dark:text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:bg-white/5"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
        <div ref={dropdownRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 transition-colors relative rounded-full ${showNotifications ? 'text-gray-900 dark:text-white bg-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/5'}`}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f1115] animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider bg-indigo-600/20 px-2 py-0.5 rounded">{notifications.length} New</span>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No new notifications. You're all caught up!
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:bg-white/5 transition-colors cursor-pointer flex gap-3">
                        <div className="mt-0.5"><Icon className={`w-4 h-4 ${n.color}`} /></div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">{n.text}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-center">
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors w-full py-1"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden hover:border-gray-500 transition-colors cursor-pointer">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </header>
  );
}
