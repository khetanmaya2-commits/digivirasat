import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, MapPin } from 'lucide-react';
import MonumentCard from '../components/heritage/MonumentCard';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import HindiHeading from '../components/ui/HindiHeading';
import { MONUMENTS } from '../data/monuments';

const STATES = ['All', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra', 'Tamil Nadu'];

export default function Explore() {
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMonuments = useMemo(() => {
    return MONUMENTS.filter((monument) => {
      const matchesState = selectedState === 'All' || monument.state.toLowerCase() === selectedState.toLowerCase();
      const matchesSearch =
        monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monument.hindiName.includes(searchQuery) ||
        monument.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (monument.tags && monument.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesState && matchesSearch;
    });
  }, [selectedState, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header Section with Side Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border-b border-[#C89D66]/30 pb-10">
          <div className="lg:col-span-2 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#C89D66]/15 text-[#996515] border border-[#C89D66]/30">
              <Sparkles size={13} />
              <span>Heritage Discovery Archive</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1F1813] tracking-tight">
              Explore India&rsquo;s Living Heritage
            </h1>

            <p className="text-xl sm:text-2xl font-hindi font-medium text-[#996515]">
              भारत की जीवित विरासत को जानें
            </p>

            <p className="text-sm sm:text-base text-[#5C5042] max-w-2xl leading-relaxed">
              Discover centuries of architectural brilliance, explore deep historical narratives, and actively contribute to preserving monuments through visual documentation.
            </p>
          </div>

          {/* Editorial Pull Quote */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/40 shadow-sm relative">
            <div className="text-3xl font-serif text-[#C5A059] absolute top-3 left-4 select-none">&ldquo;</div>
            <p className="text-sm sm:text-base font-serif italic text-[#2C221A] pl-6 leading-relaxed">
              Every monument has a story. Every element has a purpose.
            </p>
            <p className="text-xs font-hindi text-[#996515] pl-6 mt-1">
              प्रत्येक स्मारक एक अमर गाथा है, प्रत्येक नक्काशी एक उद्देश्य।
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* State Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
              {STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setSelectedState(state)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedState === state
                      ? 'bg-[#1F1813] text-[#FBF8F2] shadow-sm'
                      : 'bg-[#F5EFE6] text-[#4A3F33] hover:bg-[#EAE1D3] border border-[#C89D66]/30'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monuments..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F5EFE6] border border-[#C89D66]/40 text-xs text-[#1F1813] placeholder-stone-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Monuments Grid */}
        {filteredMonuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonuments.map((monument) => (
              <MonumentCard key={monument.id} monument={monument} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F5EFE6] rounded-2xl border border-dashed border-[#C89D66]/50 space-y-3">
            <p className="text-base font-serif font-semibold text-[#1F1813]">No monuments found matching your search.</p>
            <p className="text-xs text-stone-500">Try clearing filters or search terms.</p>
            <button
              type="button"
              onClick={() => { setSelectedState('All'); setSearchQuery(''); }}
              className="px-4 py-1.5 rounded-full bg-[#1F1813] text-[#FBF8F2] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
