import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';

/**
 * MonumentCard component for Explore and Featured Heritage sections
 */
export default function MonumentCard({ monument, featured = false }) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#C89D66]/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#C5A059] flex flex-col ${
      featured ? 'md:col-span-2' : ''
    }`}>
      {/* Image Container with Zoom */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1F1813]">
        <img
          src={monument.thumbnail || monument.heroImage}
          alt={monument.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1813]/90 via-[#1F1813]/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {monument.tags && monument.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#1F1813]/70 backdrop-blur-md text-[#E9D7A5] border border-[#C5A059]/40 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Floating Hindi Title & Location on Image */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-xs font-hindi text-[#E9D7A5] font-medium tracking-wide">
            {monument.hindiName}
          </p>
          <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white group-hover:text-[#E9D7A5] transition-colors">
            {monument.name}
          </h3>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata chips */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#5C5042] border-b border-[#C89D66]/20 pb-3">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin size={14} className="text-[#996515] flex-shrink-0" />
              <span className="truncate">{monument.location}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar size={14} className="text-[#996515] flex-shrink-0" />
              <span className="truncate">{monument.era}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#4A3F33] line-clamp-2 leading-relaxed">
            {monument.description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            to={`/monument/${monument.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F1813] hover:bg-[#2C221A] text-[#FBF8F2] text-xs font-semibold tracking-wider transition-all duration-300 group-hover:bg-[#996515] group-hover:text-white shadow-sm"
          >
            <span>Explore Monument</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
