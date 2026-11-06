import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Info, ShieldCheck, DollarSign } from 'lucide-react';

// Predefined datasets for Day, Wk, Mo, Yr
const TIMEFRAME_DATA = {
  Day: {
    total: '$14,820',
    cents: '.50',
    trend: '+4.2% vs yesterday',
    trendType: 'up',
    trendText: '↗ +4.2% Saved',
    points: [
      { x: 25, y: 155, label: '08:00', val: '$1,200', event: 'Morning Telemetry Ingest', desc: 'STMicro safety buffer verified for Plant 1010' },
      { x: 135, y: 130, label: '11:00', val: '$4,150', event: 'Dresden PO Air Expedite', desc: 'Air cargo re-routed around logistics delay' },
      { x: 255, y: 92, label: '14:00', val: '$9,300', event: 'TI PMIC Spot Allocation', desc: 'Dallas warehouse inventory locked at fixed price' },
      { x: 385, y: 52, label: '17:00', val: '$14,820', event: 'Mouser Spot Exec (Ariba)', desc: '14,200 pcs STM32 secured under cost ceiling' },
      { x: 485, y: 58, label: '20:00', val: '$14,820', event: 'SAP S/4HANA Reconciliation', desc: 'PR-ARIB synchronized with ERP inventory ledger' }
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
    trendText: '↗ +8.5% Saved',
    points: [
      { x: 25, y: 160, label: 'Mon', val: '$8,400', event: 'Plant 1010 Production Baseline', desc: 'Automotive tier-1 assembly lines active' },
      { x: 135, y: 125, label: 'Tue', val: '$18,200', event: 'Taiwan Seismic Alert (M6.4)', desc: 'USGS feed triggered wafer lead-time warning' },
      { x: 255, y: 88, label: 'Wed', val: '$29,600', event: 'Fab 18 Re-routing Initiated', desc: 'Alternate air freight carrier booking confirmed' },
      { x: 385, y: 46, label: 'Thu', val: '$44,100', event: 'Mouser Spot Sourced', desc: '3-day guaranteed delivery window locked' },
      { x: 485, y: 52, label: 'Fri', val: '$48,920', event: 'Stuttgart Line Secured', desc: 'Zero finished vehicle line halts ($1.58M avoided)' }
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
    trend: '+12.4% vs last month',
    trendType: 'up',
    trendText: '↗ +12.4% Saved',
    points: [
      { x: 25, y: 165, label: 'Week 1', val: '$22,400', event: 'Week 1 Telemetry Ingest', desc: 'Automotive tier-1 production baseline established' },
      { x: 135, y: 132, label: 'Week 2', val: '$51,800', event: 'Taiwan TSMC Fab Logistics', desc: 'Buffer stock deployed before distributor stockout' },
      { x: 255, y: 92, label: 'Week 3', val: '$88,200', event: 'BIS EAR Dual-Use Scan', desc: 'Compliance audit cleared for compute modules' },
      { x: 380, y: 48, label: 'Week 4', val: '$120,384', event: 'Infineon & TI Spot Requisition', desc: 'Direct Mouser API automated PR commitments' },
      { x: 485, y: 64, label: 'Month End', val: '$120,384', event: 'ERP Reconciliation Complete', desc: 'Full production SLA preserved with zero penalties' }
    ],
    milestones: [
      { id: 0, name: 'W1 Ingest', pointIndex: 0 },
      { id: 1, name: 'W2 Seismic', pointIndex: 1 },
      { id: 2, name: 'W3 BIS Rule', pointIndex: 2 },
      { id: 3, name: 'W4 Requisition', pointIndex: 3 }
    ]
  },
  Yr: {
    total: '$1,482,900',
    cents: '.00',
    trend: '+18.4% vs last year',
    trendType: 'up',
    trendText: '↗ +18.4% Saved',
    points: [
      { x: 25, y: 160, label: 'Q1', val: '$320,000', event: 'Q1 Maritime Bypass', desc: 'Air cargo corridor established for analog ICs' },
      { x: 140, y: 118, label: 'Q2', val: '$740,000', event: 'Q2 Saxony Power IC Allocation', desc: 'Dresden fab allocation secured via long-term PR' },
      { x: 260, y: 78, label: 'Q3', val: '$1,120,000', event: 'Q3 Advanced Packaging Buffer', desc: 'ASE Kaohsiung carrier bookings pre-empted shock' },
      { x: 385, y: 38, label: 'Q4', val: '$1,482,900', event: 'Q4 Mouser Spot Execution', desc: 'Autonomous procurement guardrails prevented downtime' },
      { x: 485, y: 46, label: 'Full Year', val: '$1,482,900', event: 'Annual Downtime Avoidance Target', desc: '$1.48M in net avoided factory assembly line stoppages' }
    ],
    milestones: [
      { id: 0, name: 'Q1 Logistics', pointIndex: 0 },
      { id: 1, name: 'Q2 Dresden', pointIndex: 1 },
      { id: 2, name: 'Q3 Packaging', pointIndex: 2 },
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

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x},${p2.y}`;
  }
  return path;
}

export default function SpendProtectedChart() {
  const [activeTab, setActiveTab] = useState('Day');
  const [activePointIndex, setActivePointIndex] = useState(3);
  const [isHovering, setIsHovering] = useState(false);

  const currentData = TIMEFRAME_DATA[activeTab];
  const points = currentData.points;
  const activePoint = points[activePointIndex] || points[points.length - 1];

  const strokePath = useMemo(() => buildSmoothPath(points), [points]);

  const areaPath = useMemo(() => {
    if (!points || points.length === 0) return '';
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${strokePath} L ${lastPoint.x},180 L ${firstPoint.x},180 Z`;
  }, [points, strokePath]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * 500;

    let closestIdx = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - svgX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    setActivePointIndex(closestIdx);
    setIsHovering(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newPoints = TIMEFRAME_DATA[tab]?.points || [];
    setActivePointIndex(Math.min(3, Math.max(0, newPoints.length - 2)));
  };

  return (
    <div className="lg:col-span-5 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-6 sm:p-7 space-y-5 bg-white dark:bg-[#141414] flex flex-col justify-between overflow-hidden shadow-xs transition-all">
      
      {/* Header Row: Metric + Timeframe Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#F0F2F5] dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span className="text-[11px] font-black uppercase tracking-wider font-mono">
              Capital Protected Terminal
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white tracking-tight font-mono transition-all">
              {currentData.total}
              <span className="text-secondary-400 text-lg sm:text-xl font-normal">
                {currentData.cents}
              </span>
            </span>

            {/* Dynamic Trend Badge */}
            <span 
              className="text-[11px] font-mono font-bold whitespace-nowrap px-2 py-0.5 rounded-md border text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40"
            >
              {currentData.trendText}
            </span>
          </div>
          <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-0.5">
            Avoided factory downtime cost via automated spot mitigation
          </p>
        </div>

        {/* Working Interactive Timeframe Tabs */}
        <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#1C202B] p-1 rounded-xl text-xs font-semibold shrink-0 self-start border border-[#E5E7EB] dark:border-[#2A3144]">
          {['Day', 'Wk', 'Mo', 'Yr'].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-xs'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
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
        className="h-44 w-full relative overflow-visible cursor-crosshair select-none my-1"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsHovering(false);
          setActivePointIndex(3);
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
          <div className="bg-secondary-900 dark:bg-[#1A1F2C] text-white px-3.5 py-2 rounded-xl shadow-xl border border-[#2E374D] text-left min-w-[150px] max-w-[220px]">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 mb-1 font-mono">
              <span className="text-[11px] font-bold uppercase text-primary-400">
                {activePoint.label}
              </span>
              <span className="text-[11px] font-black text-white">
                {activePoint.val}
              </span>
            </div>
            <div className="text-[11px] font-bold text-white leading-tight">
              {activePoint.event}
            </div>
            <div className="text-[11px] text-secondary-300 dark:text-secondary-400 leading-tight mt-1 line-clamp-2">
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
            <linearGradient id="capitalAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F4511E" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#FF713B" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#FF713B" stopOpacity="0.0" />
            </linearGradient>
            
            <linearGradient id="capitalStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F4511E" />
              <stop offset="50%" stopColor="#FF713B" />
              <stop offset="100%" stopColor="#E64212" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Guidelines */}
          <line x1="0" y1="45" x2="500" y2="45" stroke="currentColor" className="text-secondary-100 dark:text-[#222222]" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-secondary-100 dark:text-[#222222]" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1="135" x2="500" y2="135" stroke="currentColor" className="text-secondary-100 dark:text-[#222222]" strokeDasharray="3 3" strokeWidth="1" />

          {/* Vertical Crosshair Line */}
          <line 
            x1={activePoint.x} 
            y1={activePoint.y} 
            x2={activePoint.x} 
            y2="180" 
            stroke="#F4511E" 
            strokeDasharray="3 3" 
            strokeWidth="1.5" 
            opacity="0.8"
          />

          {/* Area Gradient Fill */}
          <path 
            d={areaPath} 
            fill="url(#capitalAreaGradient)" 
            className="transition-all duration-300"
          />

          {/* Stroke Line */}
          <path 
            d={strokePath} 
            fill="none" 
            stroke="url(#capitalStrokeGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-all duration-300"
          />

          {/* Inactive Point Guides */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={idx === activePointIndex ? 5.5 : 3.5}
              fill={idx === activePointIndex ? '#FFFFFF' : '#F4511E'}
              stroke={idx === activePointIndex ? '#F4511E' : '#FFFFFF'}
              strokeWidth={idx === activePointIndex ? 3 : 1.5}
              className="transition-all duration-150 cursor-pointer"
            />
          ))}

          {/* Subtle Ring around Active Point */}
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r="9"
            fill="none"
            stroke="#F4511E"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Interactive Milestones Strip Below Chart */}
      <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-[#F0F2F5] dark:border-[#222222]">
        {currentData.milestones.map((m) => {
          const isSelected = activePointIndex === m.pointIndex;
          return (
            <button
              key={m.id}
              onClick={() => setActivePointIndex(m.pointIndex)}
              className={`text-center py-1.5 px-1 rounded-lg text-[11px] font-mono font-semibold truncate transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800/60 shadow-2xs'
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
