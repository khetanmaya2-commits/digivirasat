import React from 'react';

/**
 * Editorial bilingual heading component displaying English and authentic Devanagari typography
 */
export default function HindiHeading({
  title,
  hindiTitle,
  subtitle,
  center = true,
  dark = false,
  badge = null,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${center ? 'text-center mx-auto max-w-3xl' : ''} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-widest ${
          dark
            ? 'bg-[#C5A059]/15 text-[#E9D7A5] border border-[#C5A059]/30'
            : 'bg-[#C89D66]/15 text-[#7D5220] border border-[#C89D66]/30'
        }`}>
          <span>✦</span>
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight ${
          dark ? 'text-[#FBF8F2]' : 'text-[#1F1813]'
        }`}>
          {title}
        </h2>
      )}

      {hindiTitle && (
        <p className={`text-lg sm:text-xl md:text-2xl font-hindi font-medium tracking-wide ${
          dark ? 'text-[#C5A059]' : 'text-[#996515]'
        }`}>
          {hindiTitle}
        </p>
      )}

      {subtitle && (
        <p className={`text-sm sm:text-base max-w-2xl mx-auto pt-1 font-light ${
          dark ? 'text-stone-400' : 'text-[#5C5042]'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
