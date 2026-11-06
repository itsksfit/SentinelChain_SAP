import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Info, ShieldCheck } from 'lucide-react';

// Predefined datasets for Day, Wk, Mo, Yr
const TIMEFRAME_DATA = {
  Day: {
    total: '$14,820',
    cents: '.50',
    trend: '+4.2% vs yesterday',
    trendType: 'up',
    trendText: '↗ 4.2% vs yesterday',
    points: [
      { x: 25, y: 155, label: '08:00', val: '$1,200', event: 'Morning Ingest', desc: 'STMicro safety stock verified in Plant 1010' },
      { x: 135, y: 130, label: '11:00', val: '$4,150', event: 'Dresden PO Buffer', desc: 'Air freight expedited for assembly line' },
      { x: 255, y: 92, label: '14:00', val: '$9,300', event: 'TI PMIC Allocation', desc: 'Dallas warehouse inventory locked' },
      { x: 385, y: 52, label: '17:00', val: '$14,820', event: 'Mouser Spot Exec', desc: '10,000 units STM32 secured via Ariba' },
      { x: 485, y: 58, label: '20:00', val: '$14,820', event: 'PO Reconciliation', desc: 'SAP S/4HANA PR synchronized' }
    ],
    milestones: [
      { id: 0, name: '08:00 Ingest', pointIndex: 0 },
      { id: 1, name: '11:00 Expedite', pointIndex: 1 },
      { id: 2, name: '14:00 Allocation', pointIndex: 2 },
      { id: 3, name: '17:00 Spot Exec', pointIndex: 3 }
    ]
  },
  Wk: {
    total: '$48,920',
    cents: '.00',
    trend: '+8.5% vs last week',
    trendType: 'up',
    trendText: '↗ 8.5% vs last week',
    points: [
      { x: 25, y: 160, label: 'Mon', val: '$8,400', event: 'Mon Ingest', desc: 'Baseline production run at Plant 1010' },
      { x: 135, y: 125, label: 'Tue', val: '$18,200', event: 'Taiwan Seismic Alert', desc: 'USGS M5.4 seismic detection trigger' },
      { x: 255, y: 88, label: 'Wed', val: '$29,600', event: 'Fab 18 Re-routing', desc: 'Alternate air freight carrier booking' },
      { x: 385, y: 46, label: 'Thu', val: '$44,100', event: 'Mouser Spot Sourced', desc: '3-day guaranteed delivery window' },
      { x: 485, y: 52, label: 'Fri', val: '$48,920', event: 'Stuttgart Line Safe', desc: 'Zero finished vehicle line stoppages' }
    ],
    milestones: [
      { id: 0, name: 'Mon Baseline', pointIndex: 0 },
      { id: 1, name: 'Tue Seismic', pointIndex: 1 },
      { id: 2, name: 'Thu Sourced', pointIndex: 3 },
      { id: 3, name: 'Fri Validated', pointIndex: 4 }
    ]
  },
  Mo: {
    total: '$120,384',
    cents: '.86',
    trend: '2% vs last week',
    trendType: 'down',
    trendText: '↘ 2% vs last week',
    points: [
      { x: 25, y: 165, label: 'Week 1', val: '$22,400', event: 'Week 1 Ingest', desc: 'Automotive tier-1 production baseline' },
      { x: 135, y: 132, label: 'Week 2', val: '$51,800', event: 'Taiwan Seismic', desc: 'TSMC Fab 18 wafer logistics buffer' },
      { x: 255, y: 92, label: 'Week 3', val: '$88,200', event: 'BIS Export Control', desc: 'Dual-use compute license verified' },
      { x: 380, y: 48, label: 'Week 4', val: '$120,384', event: 'Infineon Lead & TI Sourced', desc: 'Mouser spot delivery for Plant 1010 & 1020' },
      { x: 485, y: 64, label: 'Month End', val: '$120,384', event: 'SAP Reconciliation', desc: 'Production target fully protected' }
    ],
    milestones: [
      { id: 0, name: 'Taiwan Seismic', pointIndex: 1 },
      { id: 1, name: 'BIS Export', pointIndex: 2 },
      { id: 2, name: 'Infineon Lead', pointIndex: 3 },
      { id: 3, name: 'TI Sourced', pointIndex: 3 }
    ]
  },
  Yr: {
    total: '$1,482,900',
    cents: '.00',
    trend: '+18.4% vs last year',
    trendType: 'up',
    trendText: '↗ 18.4% vs last year',
    points: [
      { x: 25, y: 160, label: 'Q1', val: '$320,000', event: 'Q1 Red Sea Logistics', desc: 'Maritime shipping bypass established' },
      { x: 140, y: 118, label: 'Q2', val: '$740,000', event: 'Q2 Dresden Allocation', desc: 'Silicon Saxony power IC reallocation' },
      { x: 260, y: 78, label: 'Q3', val: '$1,120,000', event: 'Q3 Taiwan Seismic', desc: 'Advanced packaging buffer secured' },
      { x: 385, y: 38, label: 'Q4', val: '$1,482,900', event: 'Q4 Mouser Spot Exec', desc: 'Strategic semiconductor reserve deployed' },
      { x: 485, y: 46, label: 'Full Year', val: '$1,482,900', event: 'Annual Target Achieved', desc: '$1.48M in avoided factory downtime' }
    ],
    milestones: [
      { id: 0, name: 'Q1 Logistics', pointIndex: 0 },
      { id: 1, name: 'Q2 Dresden', pointIndex: 1 },
      { id: 2, name: 'Q3 Seismic', pointIndex: 2 },
      { id: 3, name: 'Q4 Annual', pointIndex: 3 }
    ]
  }
};

/**
 * Builds a smooth Catmull-Rom / cubic bezier SVG path passing exactly through each coordinate
 */
function buildSmoothPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return path;
}

export default function SpendProtectedChart() {
  const [activeTab, setActiveTab] = useState('Mo');
  const currentData = TIMEFRAME_DATA[activeTab] || TIMEFRAME_DATA.Mo;
  
  // Default active point is index 3 (the peak / feature point)
  const [activePointIndex, setActivePointIndex] = useState(3);
  const [isHovering, setIsHovering] = useState(false);

  const points = currentData.points;
  const activePoint = points[Math.min(activePointIndex, points.length - 1)] || points[0];

  // Generate upper stroke curve
  const strokePath = useMemo(() => buildSmoothPath(points), [points]);

  // Generate closed area fill path (down to y=180 baseline)
  const areaPath = useMemo(() => {
    if (!points || points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    return `${strokePath} L ${last.x},180 L ${first.x},180 Z`;
  }, [points, strokePath]);

  // Handle mouse move over SVG to find nearest point
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 500;

    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setActivePointIndex(closestIdx);
    setIsHovering(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset to peak point on tab switch
    const newPoints = TIMEFRAME_DATA[tab]?.points || [];
    setActivePointIndex(Math.min(3, Math.max(0, newPoints.length - 2)));
  };

  return (
    <div className="lg:col-span-5 border border-[#EAEAEA] dark:border-[#262626] rounded-2xl p-6 sm:p-7 space-y-5 bg-white dark:bg-[#141414] flex flex-col justify-between overflow-hidden shadow-xs transition-all">
      
      {/* Header Row: Metric + Timeframe Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-secondary-400 uppercase tracking-wider block">
            Spend Protected
          </span>
          <div className="flex items-baseline gap-2.5 mt-1 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white tracking-tight font-mono transition-all">
              {currentData.total}
              <span className="text-secondary-400 text-lg sm:text-xl font-normal">
                {currentData.cents}
              </span>
            </span>

            {/* Dynamic Trend Badge */}
            <span 
              className={`text-[11px] font-bold whitespace-nowrap px-2 py-0.5 rounded-md border transition-all ${
                currentData.trendType === 'down'
                  ? 'text-[#DC2626] bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40'
                  : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40'
              }`}
            >
              {currentData.trendText}
            </span>
          </div>
        </div>

        {/* Working Interactive Timeframe Tabs */}
        <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#1F1F1F] p-1 rounded-xl text-xs font-semibold shrink-0 self-start">
          {['Day', 'Wk', 'Mo', 'Yr'].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-secondary-900 shadow-xs scale-100'
                    : 'text-secondary-500 hover:text-secondary-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-secondary-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Layered Area Curve & Interactive Hover Canvas */}
      <div 
        className="h-44 w-full relative overflow-visible cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsHovering(false);
          setActivePointIndex(3); // Reset to primary peak on leave
        }}
      >
        {/* Floating Tooltip positioned over the active point */}
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-150 ease-out -top-2"
          style={{
            left: `${(activePoint.x / 500) * 100}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-secondary-900/95 dark:bg-[#1C1D22]/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-white/10 dark:border-white/15 text-left min-w-[140px] max-w-[200px] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-400">
                {activePoint.label}
              </span>
              <span className="text-[11px] font-mono font-extrabold text-white">
                {activePoint.val}
              </span>
            </div>
            <div className="text-[10px] font-bold text-white truncate">
              {activePoint.event}
            </div>
            <div className="text-[9px] text-secondary-300 dark:text-secondary-400 leading-tight mt-0.5 line-clamp-2">
              {activePoint.desc}
            </div>
          </div>
        </div>

        <svg 
          className="w-full h-full overflow-visible" 
          viewBox="0 0 500 180" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="peachAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF713B" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#FF8A50" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFF4ED" stopOpacity="0.0" />
            </linearGradient>
            
            <linearGradient id="strokeLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F4511E" />
              <stop offset="50%" stopColor="#FF713B" />
              <stop offset="100%" stopColor="#FF5722" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F4511E" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Horizontal Dashed Grid Guidelines */}
          <line x1="0" y1="45" x2="500" y2="45" stroke="currentColor" className="text-secondary-100 dark:text-[#222222]" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-secondary-100 dark:text-[#222222]" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="135" x2="500" y2="135" stroke="currentColor" className="text-secondary-100 dark:text-[#222222]" strokeDasharray="4 4" strokeWidth="1" />

          {/* Vertical Crosshair Line tracking active point */}
          <line 
            x1={activePoint.x} 
            y1={activePoint.y} 
            x2={activePoint.x} 
            y2="180" 
            stroke="#F4511E" 
            strokeDasharray="3 3" 
            strokeWidth="1.5" 
            opacity="0.65"
          />

          {/* Area Gradient Fill */}
          <path 
            d={areaPath} 
            fill="url(#peachAreaGradient)" 
            className="transition-all duration-300"
          />

          {/* Stroke Line */}
          <path 
            d={strokePath} 
            fill="none" 
            stroke="url(#strokeLineGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#glow)"
            className="transition-all duration-300"
          />

          {/* Inactive Point Guides (Subtle Dots) */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={idx === activePointIndex ? 6 : 3.5}
              fill={idx === activePointIndex ? '#FFFFFF' : '#FF713B'}
              stroke={idx === activePointIndex ? '#F4511E' : '#FFFFFF'}
              strokeWidth={idx === activePointIndex ? 3.5 : 1.5}
              className="transition-all duration-150 cursor-pointer"
            />
          ))}

          {/* Pulsating Ring around Active Point */}
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r="10"
            fill="none"
            stroke="#F4511E"
            strokeWidth="1.5"
            opacity="0.4"
            className="animate-ping"
            style={{ transformOrigin: `${activePoint.x}px ${activePoint.y}px` }}
          />
        </svg>
      </div>

      {/* Interactive Milestones Strip Below Chart */}
      <div className="grid grid-cols-4 gap-1 pt-3 border-t border-[#F0F0F0] dark:border-[#222222]">
        {currentData.milestones.map((m) => {
          const isSelected = activePointIndex === m.pointIndex;
          return (
            <button
              key={m.id}
              onClick={() => setActivePointIndex(m.pointIndex)}
              className={`text-center py-1.5 px-1 rounded-lg text-xs font-semibold truncate transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800/40 shadow-2xs'
                  : 'text-secondary-500 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-[#1E1E1E]'
              }`}
              title={m.name}
            >
              {m.name}
            </button>
          );
        })}
      </div>

    </div>
  );
}
