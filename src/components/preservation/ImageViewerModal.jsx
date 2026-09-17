import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Info, ShieldCheck } from 'lucide-react';

/**
 * Accessible Lightbox / Large Image Viewer for Historical & Reference Photographs
 */
export default function ImageViewerModal({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onSelectIndex,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  const handlePrev = () => {
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onSelectIndex((currentIndex + 1) % images.length);
  };

  const isReference = current.isReference || current.role?.includes('Reference');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md no-print select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1F1813]/90 text-[#E9D7A5] border border-[#C5A059]/40">
            {currentIndex + 1} / {images.length}
          </span>
          <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
            isReference
              ? 'bg-[#C5A059] text-[#16120E]'
              : 'bg-stone-800 text-stone-300'
          }`}>
            {current.role || (isReference ? 'AWS Comparison Reference' : 'Historical Context')}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="p-2.5 rounded-full bg-[#1F1813]/90 hover:bg-[#2C221A] text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center">
        <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black/60 border border-[#C5A059]/30">
          <img
            src={current.image}
            alt={current.title || 'Historical photograph'}
            className="max-h-[68vh] w-auto object-contain transition-transform duration-300"
          />

          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photograph"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#E9D7A5] transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photograph"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#E9D7A5] transition-all cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Details Caption */}
        <div className="w-full mt-3 p-4 rounded-xl bg-[#1F1813]/90 border border-[#C5A059]/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#C5A059] font-bold text-sm">{current.year}</span>
              <span className="font-serif text-base font-bold text-white">{current.title}</span>
              {current.hindiTitle && (
                <span className="font-hindi text-stone-300 text-xs">({current.hindiTitle})</span>
              )}
            </div>
            <p className="text-stone-300 max-w-2xl leading-relaxed text-[11px] sm:text-xs">
              {current.description}
            </p>
          </div>

          <div className="text-right flex-shrink-0 text-stone-400 font-mono text-[10px]">
            {current.source && <div>Source: {current.source}</div>}
            <div className="text-[#C5A059]">Press &larr; / &rarr; to navigate &bull; Esc to close</div>
          </div>
        </div>
      </div>
    </div>
  );
}
