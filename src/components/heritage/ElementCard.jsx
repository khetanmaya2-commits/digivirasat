import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

/**
 * ElementCard component for architectural preservation elements
 */
export default function ElementCard({ element, monumentId = 'amer-fort' }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-[#FBF8F2] border border-[#C89D66]/40 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 flex flex-col">
      {/* Image Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1F1813]">
        <img
          src={element.historicalImage || element.currentImage}
          alt={element.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Element ID Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#1F1813]/85 text-[#E9D7A5] border border-[#C5A059]/40 shadow">
            {element.id}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={element.status} />
        </div>

        {/* Chamber / Location caption */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 text-xs text-stone-200 truncate">
          <MapPin size={12} className="text-[#C5A059] flex-shrink-0" />
          <span className="truncate">{element.chamber || element.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="text-base sm:text-lg font-serif font-bold text-[#1F1813] group-hover:text-[#996515] transition-colors leading-tight">
            {element.name}
          </h4>
          <p className="text-xs font-hindi text-[#996515] font-medium mt-0.5">
            {element.hindiName}
          </p>
          <p className="text-xs text-[#5C5042] mt-2 line-clamp-2 leading-relaxed">
            {element.description}
          </p>
        </div>

        {/* View Action Link */}
        <div className="pt-2 border-t border-[#C89D66]/20">
          <Link
            to={`/monument/${monumentId}/element/${element.id}`}
            className="inline-flex items-center justify-between w-full text-xs font-semibold text-[#1F1813] group-hover:text-[#996515] transition-colors"
          >
            <span>View Element Details</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
