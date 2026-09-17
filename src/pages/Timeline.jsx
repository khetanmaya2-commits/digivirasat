import React, { useState } from 'react';
import { Clock, Calendar, Bookmark, ShieldCheck, Sparkles, Filter, Landmark, Eye, Info, HelpCircle } from 'lucide-react';
import { HERITAGE_TIMELINE } from '../data/timeline';
import VisualTimeline from '../components/preservation/VisualTimeline';
import ImageViewerModal from '../components/preservation/ImageViewerModal';
import OrnamentDivider from '../components/ui/OrnamentDivider';

export default function Timeline() {
  const [filter, setFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = ['All', 'Historical Context', 'AWS Comparison Reference', 'Architecture', 'Recognition', 'Active Preservation'];

  const filteredMilestones = filter === 'All'
    ? HERITAGE_TIMELINE
    : HERITAGE_TIMELINE.filter(item => item.category === filter || item.role === filter);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ============================================================ */}
        {/* PART A: SHEESH MAHAL PHOTOGRAPHIC PROGRESSION TIMELINE       */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <VisualTimeline elementId="SM-01" showHeader={true} />
        </section>

        <OrnamentDivider className="my-8" />

        {/* ============================================================ */}
        {/* PART B: CHRONOLOGICAL CONSERVATION & ARCHIVAL MILESTONES     */}
        {/* ============================================================ */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold bg-[#C89D66]/15 px-3 py-1 rounded-full border border-[#C89D66]/30">
              Four-Century Continuum
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813]">
              Chronological Heritage Milestones
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5042]">
              Explore the key historical, architectural, and conservation milestones of Amer Fort and the Sheesh Mahal.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                  filter === cat
                    ? 'bg-[#1F1813] text-[#FBF8F2] shadow-sm'
                    : 'bg-[#F5EFE6] text-[#4A3F33] hover:bg-[#EAE1D3] border border-[#C89D66]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Vertical Timeline Structure with Real Photographs */}
          <div className="relative border-l-2 border-[#C5A059]/40 ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-10">
            {filteredMilestones.map((item, index) => {
              const isReference = item.isReference || item.role === 'AWS Comparison Reference';
              const isHistorical = item.isHistorical || item.role === 'Historical Context';

              return (
                <div key={index} className="relative group">
                  {/* Timeline Marker Node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-125 ${
                      isReference
                        ? 'bg-[#C5A059] text-[#16120E] ring-4 ring-[#C5A059]/30'
                        : item.isActive
                        ? 'bg-[#996515] text-white ring-4 ring-[#C5A059]/20'
                        : 'bg-[#1F1813] text-[#E9D7A5] ring-2 ring-stone-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold">&bull;</span>
                  </div>

                  {/* Year Chip (Desktop view left floating) */}
                  <div className="hidden sm:block absolute -left-36 top-1 text-right w-24">
                    <span className={`font-mono text-xs font-bold block ${isReference ? 'text-[#C5A059]' : 'text-[#996515]'}`}>
                      {item.year}
                    </span>
                    <span className="text-[10px] text-stone-500 font-serif">
                      {item.era}
                    </span>
                  </div>

                  {/* Card Container */}
                  <div
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                      isReference
                        ? 'bg-[#1F1813] text-white border-2 border-[#C5A059]'
                        : item.isActive
                        ? 'bg-[#1F1813] text-white border-[#C5A059]/40'
                        : 'bg-[#F5EFE6] text-[#1F1813] border border-[#C89D66]/30'
                    }`}
                  >
                    {/* Mobile Year Badge */}
                    <div className="sm:hidden mb-2 inline-flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#C5A059]/20 text-[#996515]">
                        {item.year} &bull; {item.era}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isReference
                            ? 'bg-[#C5A059] text-[#16120E]'
                            : isHistorical
                            ? 'bg-[#C89D66]/20 text-[#7D5220]'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {item.role || item.category}
                      </span>

                      <span className="text-xs text-stone-400 font-mono">
                        Source: {item.source}
                      </span>
                    </div>

                    <h3 className={`text-xl font-serif font-bold ${isReference ? 'text-[#E9D7A5]' : item.isActive ? 'text-[#E9D7A5]' : 'text-[#1F1813]'}`}>
                      {item.title}
                    </h3>

                    <p className={`text-sm font-hindi font-medium mt-0.5 ${isReference || item.isActive ? 'text-stone-300' : 'text-[#996515]'}`}>
                      {item.hindiTitle}
                    </p>

                    <p className={`text-xs sm:text-sm mt-3 leading-relaxed ${isReference || item.isActive ? 'text-stone-300' : 'text-[#4A3F33]'}`}>
                      {item.description}
                    </p>

                    {item.image && (
                      <div
                        className="mt-4 rounded-xl overflow-hidden aspect-[21/9] max-h-56 bg-black/40 cursor-pointer relative group/img"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover brightness-90 group-hover/img:scale-105 group-hover/img:brightness-100 transition-all duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1.5 font-semibold">
                          <Eye size={16} />
                          <span>Click to view full photograph</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      <ImageViewerModal
        images={filteredMilestones}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={setLightboxIndex}
      />
    </div>
  );
}
