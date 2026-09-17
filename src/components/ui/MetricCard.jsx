import React from 'react';

/**
 * Metric card for analysis outputs and dashboard KPIs
 */
export default function MetricCard({
  title,
  hindiTitle,
  value,
  subvalue,
  variant = 'default',
  icon: Icon,
  className = '',
}) {
  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-300 ${
        variant === 'dark'
          ? 'bg-[#1F1813] border-[#C5A059]/20 text-[#FBF8F2] shadow-lg'
          : 'bg-[#F5EFE6] border-[#C89D66]/30 text-[#1F1813] shadow-sm hover:shadow-md'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-[#996515] dark:text-[#C5A059]">
            {title}
          </p>
          {hindiTitle && (
            <p className="text-xs font-hindi text-[#A87B4F]">
              {hindiTitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#C5A059]/10 text-[#C5A059]">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
          {value}
        </span>
        {subvalue && (
          <span className="text-xs sm:text-sm text-[#7D6E5D] font-medium">
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
}
