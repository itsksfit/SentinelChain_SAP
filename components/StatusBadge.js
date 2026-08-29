import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;
  const s = status.toLowerCase();
  let colorClasses = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

  if (s.includes('completed') || s.includes('resolved')) {
    colorClasses = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400";
  } else if (s.includes('escalated') || s.includes('pending')) {
    colorClasses = "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400";
  } else if (s.includes('failed')) {
    colorClasses = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400";
  } else if (s.includes('mitigating') || s.includes('assessing') || s.includes('executing')) {
    colorClasses = "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}>
      {status}
    </span>
  );
}
