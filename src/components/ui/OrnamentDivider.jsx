import React from 'react';

/**
 * Indian Heritage Ornamental Divider
 * Incorporates traditional Rajput arch and lotus/jaali vector geometry.
 */
export default function OrnamentDivider({ className = '', dark = false }) {
  const strokeColor = dark ? '#C5A059' : '#C89D66';
  const fillColor = dark ? '#C5A059' : '#996515';

  return (
    <div className={`flex items-center justify-center my-6 gap-3 select-none ${className}`}>
      <div className="h-[1px] w-12 sm:w-20 md:w-32 bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#C5A059]" />
      
      {/* Ornate Rajput Arch & Lotus Motif */}
      <svg
        width="36"
        height="18"
        viewBox="0 0 36 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-90 transition-transform duration-300 hover:scale-110"
      >
        <path
          d="M1 9C5 9 8 1 18 1C28 1 31 9 35 9"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M6 13C10 13 13 5 18 5C23 5 26 13 30 13"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
        />
        <circle cx="18" cy="9" r="2.5" fill={fillColor} />
        <circle cx="18" cy="1" r="1.2" fill={fillColor} />
        <circle cx="6" cy="13" r="1" fill={strokeColor} />
        <circle cx="30" cy="13" r="1" fill={strokeColor} />
      </svg>

      <div className="h-[1px] w-12 sm:w-20 md:w-32 bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#C5A059]" />
    </div>
  );
}
