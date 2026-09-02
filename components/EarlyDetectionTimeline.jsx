import React from 'react';

export default function EarlyDetectionTimeline() {
  return null;
import { Clock, Zap, Radio } from 'lucide-react';

export default function EarlyDetectionTimeline({ 
  primaryTimestamp, 
  mediaTimestamp, 
  advantageText, 
  sourceTier,
  sourceName
}) {
  const formatTime = (ts) => {
    if (!ts) return '09:00 UTC';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
    } catch(e) {
      return '09:00 UTC';
    }
  };

  const primaryTimeStr = formatTime(primaryTimestamp);
  const mediaTimeStr = formatTime(mediaTimestamp);
  const advantage = advantageText || 'Pre-Emptive Window Gained';

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/70 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-950/40 border border-indigo-200 dark:border-indigo-500/30 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" /> Early Detection Horizon
        </span>
        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold">
          Official Signal vs. Media Wire Delta
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-2 mt-2">
        {/* Connection Line with Gradient */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-slate-400 dark:to-gray-600 z-0"></div>

        {/* Primary Source Node (Left) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-600 dark:border-emerald-500 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-sm mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">{primaryTimeStr}</span>
          <span className="text-[9.5px] font-bold text-slate-700 dark:text-gray-300 truncate w-full" title={sourceName || "Primary Regulatory Filing"}>
            {sourceTier === 'USGS_SEISMIC' ? 'USGS Sensor' : (sourceTier === 'SEC_EDGAR' ? 'SEC Filing' : 'Primary Source')}
          </span>
        </div>

        {/* Center Badge: Advantage Time Window */}
        <div className="relative z-10 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0a0f18] border border-amber-400 dark:border-amber-500/40 shadow-sm flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold tracking-wide">
          <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{advantage}</span>
        </div>

        {/* Media Wire Node (Right) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800/80 border-2 border-slate-400 dark:border-gray-600 flex items-center justify-center text-slate-600 dark:text-gray-400 shadow-sm mb-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-gray-400">{mediaTimeStr}</span>
          <span className="text-[9.5px] font-bold text-slate-500 dark:text-gray-500">Media Wire</span>
        </div>
      </div>
    </div>
  );
}

