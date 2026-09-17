import React from 'react';

/**
 * StatusBadge for preservation conditions and operational states
 * Designed with heritage colors to avoid garish neon alerts.
 */
export default function StatusBadge({ status, className = '', showDot = true }) {
  const normalized = (status || '').toLowerCase();

  let colors = 'bg-stone-100 text-stone-700 border-stone-300';
  let dotColor = 'bg-stone-400';

  if (normalized.includes('stable') || normalized.includes('low')) {
    colors = 'bg-[#2D4B39]/10 text-[#2D4B39] border-[#2D4B39]/30';
    dotColor = 'bg-[#2D4B39]';
  } else if (normalized.includes('moderate') || normalized.includes('monitoring')) {
    colors = 'bg-[#C5A059]/15 text-[#996515] border-[#C5A059]/40';
    dotColor = 'bg-[#C5A059]';
  } else if (normalized.includes('high') || normalized.includes('inspection') || normalized.includes('verification')) {
    colors = 'bg-[#A64B2A]/15 text-[#A64B2A] border-[#A64B2A]/30';
    dotColor = 'bg-[#A64B2A]';
  } else if (normalized.includes('critical')) {
    colors = 'bg-red-900/15 text-red-800 border-red-300';
    dotColor = 'bg-red-600';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border ${colors} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColor}`} />}
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
