import React, { useEffect } from 'react';
import { X, Calendar, Landmark, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import OrnamentDivider from '../ui/OrnamentDivider';

/**
 * HistoricalStoryModal Component
 * Opens an archival story dossier when clicking "View Story →" on any timeline card.
 */
export default function HistoricalStoryModal({ item, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isReference = item.type === 'reference' || item.role === 'Active Reference';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto no-print select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.year} - ${item.title}`}
    >
      <div className="relative w-full max-w-3xl bg-[#FBF8F2] text-[#1F1813] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1F1813] text-white border-b border-[#C5A059]/40">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
              isReference ? 'bg-[#C5A059] text-[#16120E]' : 'bg-stone-800 text-[#E9D7A5]'
            }`}>
              {item.year}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#E9D7A5] font-semibold">
              {item.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close story dialog"
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Large Image Frame */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black shadow-md border border-[#C89D66]/40">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {isReference && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#C5A059] text-[#16120E] text-xs font-bold shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16120E] animate-pulse" />
                <span>Active Operational Baseline</span>
              </div>
            )}
          </div>

          {/* Title and Hindi Header */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813]">
                {item.title}
              </h3>
              <span className="text-sm font-mono text-[#996515] font-bold">{item.year}</span>
            </div>
            {item.hindiTitle && (
              <p className="text-base font-hindi text-[#996515] font-medium">
                {item.hindiTitle}
              </p>
            )}
          </div>

          <OrnamentDivider className="my-2" />

          {/* Detailed Narrative */}
          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#996515] font-bold">
              Archival Context &amp; Significance
            </h4>
            <p className="text-sm text-[#3A2F25] leading-relaxed">
              {item.detailedStory || item.description}
            </p>
          </div>

          {/* Metadata Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 border-t border-stone-200 gap-3">
            <div className="font-mono text-[11px]">
              {item.archivalMetadata}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#1F1813] text-white text-xs font-semibold hover:bg-[#2C221A] transition-colors cursor-pointer self-end sm:self-auto"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
