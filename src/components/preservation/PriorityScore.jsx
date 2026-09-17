import React, { useEffect, useState } from 'react';

/**
 * Animated Circular SVG Priority Score Gauge
 * Renders priority score (0 - 100) with smooth count-up and stroke-dashoffset transition.
 */
export default function PriorityScore({ score = 50, size = 160, strokeWidth = 12 }) {
  
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (displayScore / 100) * circumference;

  let strokeColor = '#C5A059'; // default gold
  let labelText = 'Moderate Priority';
  let badgeColor = 'text-[#996515] bg-[#C5A059]/15 border-[#C5A059]/30';

  if (score < 35) {
    strokeColor = '#2D4B39';
    labelText = 'Stable Condition';
    badgeColor = 'text-[#2D4B39] bg-[#2D4B39]/10 border-[#2D4B39]/30';
  } else if (score > 65) {
    strokeColor = '#A64B2A';
    labelText = 'High Priority';
    badgeColor = 'text-[#A64B2A] bg-[#A64B2A]/15 border-[#A64B2A]/30';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(197, 160, 89, 0.15)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
  {displayScore}
</span>
          <span className="text-[11px] uppercase tracking-widest text-[#7D6E5D] font-medium">
            of 100
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium border ${badgeColor}`}>
        {labelText}
      </div>
    </div>
  );
}
