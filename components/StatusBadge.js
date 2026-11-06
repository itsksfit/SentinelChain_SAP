import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;
  const s = status.toLowerCase();
  
  let colorClasses = "bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-300 dark:border-secondary-700";
  let dotColor = "bg-secondary-400";

  if (s.includes('completed') || s.includes('resolved') || s.includes('low') || s.includes('healthy')) {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40";
    dotColor = "bg-emerald-500";
  } else if (s.includes('critical') || s.includes('failed') || s.includes('severe')) {
    colorClasses = "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/40";
    dotColor = "bg-red-500 animate-pulse";
  } else if (s.includes('high') || s.includes('escalated')) {
    colorClasses = "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800/40";
    dotColor = "bg-orange-500";
  } else if (s.includes('medium') || s.includes('pending') || s.includes('warning') || s.includes('awaiting')) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40";
    dotColor = "bg-amber-500";
  } else if (s.includes('mitigating') || s.includes('assessing') || s.includes('executing') || s.includes('active')) {
    colorClasses = "bg-primary-50 text-primary-700 border-primary-200/80 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800/40";
    dotColor = "bg-primary-500 animate-pulse";
  }

  const sizeClasses = size === 'xs' 
    ? "px-2 py-0.5 text-[9px]" 
    : "px-2.5 py-0.5 text-[10px]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider border shadow-2xs ${sizeClasses} ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
}
