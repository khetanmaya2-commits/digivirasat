import React, { useState, useRef, useCallback,useEffect } from 'react';
import { ArrowLeftRight, Eye, ShieldAlert } from 'lucide-react';

/**
 * Interactive Before/After Image Comparison Slider
 * Allows smooth dragging, touch sliding, and keyboard arrow controls.
 */
export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Reference (2016)',
  afterLabel = 'Current (Visitor Capture)',
  className = '',
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);
  useEffect(() => {
  setBeforeError(false);
}, [beforeImage]);

useEffect(() => {
  setAfterError(false);
}, [afterImage]);
  const containerRef = useRef(null);

  const fallbackBefore =
  '/images/sheesh-mahal/sheesh-mahal-2021.jpg';

const fallbackAfter =
  '/images/sheesh-mahal/sheesh-mahal-2021.jpg';

const effectiveBefore = beforeError
  ? fallbackBefore
  : beforeImage || fallbackBefore;

const effectiveAfter = afterError
  ? fallbackAfter
  : afterImage || fallbackAfter;

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className={`relative select-none overflow-hidden rounded-2xl border border-[#C5A059]/30 bg-[#16120E] shadow-2xl ${className}`}>
      {/* Visual Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1F1813] border-b border-[#C5A059]/20 text-xs font-mono text-stone-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
          <span className="font-sans font-medium text-[#E9D7A5]">{beforeLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-[#C5A059]">
          <ArrowLeftRight size={14} />
          <span className="hidden sm:inline text-stone-400 font-sans text-xs">Drag slider to compare</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans font-medium text-amber-200">{afterLabel}</span>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* Main Comparison Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] max-h-[560px] cursor-ew-resize overflow-hidden"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Image comparison slider"
        onKeyDown={handleKeyDown}
      >
        {/* Layer 1: AFTER (Current Observation) - Base Layer */}
        <img
          src={effectiveAfter}
          alt={afterLabel}
          onError={() => setAfterError(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Layer 2: BEFORE (Reference Baseline) - Clipped Overlay */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={effectiveBefore}
            alt={beforeLabel}
            onError={() => setBeforeError(true)}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E9D7A5] via-[#C5A059] to-[#996515] pointer-events-none shadow-[0_0_12px_rgba(197,160,89,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Grab Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#1F1813] border-2 border-[#C5A059] shadow-xl flex items-center justify-center text-[#E9D7A5] cursor-ew-resize transition-transform duration-150 hover:scale-110 active:scale-95">
            <ArrowLeftRight size={14} />
          </div>
        </div>

        {/* Corner Watermarks */}
        <div className="absolute bottom-3 left-3 bg-[#1F1813]/85 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-[#E9D7A5] border border-[#C5A059]/30 pointer-events-none shadow-md">
          {beforeLabel}
        </div>
        <div className="absolute bottom-3 right-3 bg-[#1F1813]/85 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-stone-200 border border-[#C5A059]/30 pointer-events-none shadow-md">
          {afterLabel}
        </div>
      </div>

      {/* Touch/Accessible Slider Control for Fine Tuning */}
      <div className="p-3 bg-[#1F1813]/90 flex items-center gap-4 text-xs border-t border-[#C5A059]/15">
        <span className="text-stone-400 font-medium">Position: {Math.round(sliderPosition)}%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="w-full accent-[#C5A059] bg-[#2C221A] h-1.5 rounded-lg cursor-pointer"
          aria-label="Fine tune comparison split"
        />
        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className="px-2.5 py-1 text-[11px] bg-[#2C221A] hover:bg-[#3A2F25] text-[#E9D7A5] rounded border border-[#C5A059]/30 transition-colors whitespace-nowrap"
        >
          Center Split
        </button>
      </div>
    </div>
  );
}
