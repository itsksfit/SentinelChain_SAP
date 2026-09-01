import React from 'react';
import { Clock, Zap, ShieldAlert, Radio } from 'lucide-react';

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
    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/40 border border-indigo-500/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Early Detection Horizon
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          Official Signal vs. Media Wire Delta
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-2 mt-2">
        {/* Connection Line with Gradient */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-gray-600 z-0"></div>

        {/* Primary Source Node (Left) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 mb-1">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-400">{primaryTimeStr}</span>
          <span className="text-[9px] font-semibold text-gray-300 truncate w-full" title={sourceName || "Primary Regulatory Filing"}>
            {sourceTier === 'USGS_SEISMIC' ? 'USGS Sensor' : (sourceTier === 'SEC_EDGAR' ? 'SEC Filing' : 'Primary Source')}
          </span>
        </div>

        {/* Center Badge: Advantage Time Window */}
        <div className="relative z-10 px-3 py-1.5 rounded-full bg-[#0a0f18]/90 border border-amber-500/40 shadow-xl flex items-center gap-1.5 text-amber-300 text-[11px] font-bold tracking-wide">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{advantage}</span>
        </div>

        {/* Media Wire Node (Right) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
          <div className="w-7 h-7 rounded-full bg-gray-800/80 border-2 border-gray-600 flex items-center justify-center text-gray-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono font-bold text-gray-400">{mediaTimeStr}</span>
          <span className="text-[9px] font-semibold text-gray-500">Media Wire</span>
        </div>
      </div>
    </div>
  );
}
