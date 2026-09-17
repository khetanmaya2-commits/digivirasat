import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Sparkles, MapPin, Eye,Calendar, Clock, Info, ShieldAlert, Layers } from 'lucide-react';
import { PRESERVATION_ELEMENTS } from '../data/elements';
import { HERITAGE_STORIES } from '../data/heritageStories';
import { HERITAGE_TIMELINE } from '../data/timeline';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import StatusBadge from '../components/ui/StatusBadge';
import VisualTimeline from '../components/preservation/VisualTimeline';

export default function ElementDetail() {
   const [filter, setFilter] = useState('All');
  const { elementId = 'SM-01', monumentId = 'amer-fort' } = useParams();
  const [activeTab, setActiveTab] = useState('story');

  const element = PRESERVATION_ELEMENTS.find((e) => e.id === elementId) || PRESERVATION_ELEMENTS[0];
  const story = HERITAGE_STORIES.sm01Story;

  const elementTabs = [
    { id: 'story', label: 'Historical Story', hindi: 'ऐतिहासिक कहानी' },
    { id: 'architectural', label: 'Architectural Significance', hindi: 'स्थापत्य महत्व' },
    { id: 'cultural', label: 'Cultural Significance', hindi: 'सांस्कृतिक धरोहर' },
    { id: 'years', label: 'Through the Years', hindi: 'समय के साथ' },
    { id: 'preservation', label: 'Preservation', hindi: 'संरक्षण विवरण' },
  ];

  const filteredMilestones = filter === 'All'
      ? HERITAGE_TIMELINE
      : HERITAGE_TIMELINE.filter(item => item.category === filter || item.role === filter);

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to={`/monument/${monumentId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#996515] hover:text-[#1F1813] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Amer Fort</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500">Element ID:</span>
            <span className="px-2.5 py-0.5 rounded bg-[#1F1813] text-[#E9D7A5] font-mono text-xs font-bold">
              {element.id}
            </span>
          </div>
        </div>

        {/* Hero Editorial Card */}
        <div className="rounded-3xl overflow-hidden bg-[#1F1813] text-white shadow-2xl relative">

  <div className="grid grid-cols-1 lg:grid-cols-2">

    {/* ========================================= */}
{/* EDITORIAL HERITAGE PHOTO COLLAGE          */}
{/* ========================================= */}
<div className="relative min-h-[520px] lg:min-h-[620px] bg-[#241712] overflow-hidden">

  {/* Background image atmosphere */}
  <img
    src={element.historicalImage || element.archiveImage}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover opacity-[0.08] blur-[2px]"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0" />


  {/* ========================================= */}
  {/* TOP LABELS                                */}
  {/* ========================================= */}
  <div className="absolute top-5 left-5 right-5 z-30 flex items-start justify-between">

    <div>
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#E9D7A5]">
        Heritage Element
      </p>

      <p className="text-xs font-hindi text-[#C89D66] mt-1">
        विरासत तत्व
      </p>
    </div>

    <StatusBadge status={element.status} />

  </div>


  {/* ========================================= */}
  {/* MONUMENT NAME                             */}
  {/* ========================================= */}
  <div className="absolute top-[90px] left-0 right-0 z-20 text-center px-4">

    <p className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-[#C89D66] mb-2">
      Jai Mandir • Amer Fort
    </p>

    <h2
      className="
        font-serif
        font-black
        uppercase
        text-[#E9D7A5]
        text-4xl
        sm:text-5xl
        lg:text-6xl
        tracking-[0.08em]
        leading-none
      "
    >
      SHEESH
    </h2>

    <h2
      className="
        font-serif
        font-black
        uppercase
        text-[#E9D7A5]
        text-4xl
        sm:text-5xl
        lg:text-6xl
        tracking-[0.08em]
        leading-none
      "
    >
      MAHAL
    </h2>

    <p className="font-hindi text-sm sm:text-base text-[#C89D66] mt-2">
      शीश महल
    </p>

  </div>


  {/* ========================================= */}
  {/* VERTICAL IMAGE PANELS                     */}
  {/* ========================================= */}
  <div className="absolute left-5 right-5 bottom-20 top-[285px] flex items-start justify-center gap-2 sm:gap-3">

   {/* ========================================= */}
{/* ONE IMAGE — SPLIT INTO FIVE PANELS       */}
{/* ========================================= */}

{(() => {
  const heritageImage =
    element.historicalImage || element.archiveImage;

  return (
    <>
      {/* PANEL 1 */}
      <div
        className="
          relative
          w-[18%]
          h-[100%]
          overflow-hidden
          bg-[#1F1813]
          shadow-[0_14px_35px_rgba(0,0,0,0.45)]
          transition-all duration-500
          hover:-translate-y-2
        "
      >
        <img
          src={heritageImage}
          alt="Sheesh Mahal"
          className="absolute h-full max-w-none object-cover"
          style={{
            width: '500%',
            left: '0%',
            top: 0,
          }}
        />
      </div>


      {/* PANEL 2 */}
      <div
        className="
          relative
          w-[18%]
          h-[110%]
          overflow-hidden
          bg-[#1F1813]
          shadow-[0_14px_35px_rgba(0,0,0,0.45)]
          transition-all duration-500
          hover:-translate-y-2
        "
      >
        <img
          src={heritageImage}
          alt="Sheesh Mahal"
          className="absolute h-full max-w-none object-cover"
          style={{
            width: '500%',
            left: '-100%',
            top: 0,
          }}
        />
      </div>


      {/* PANEL 3 — CENTER */}
      <div
        className="
          relative
          w-[20%]
          h-[120%]
          overflow-hidden
          bg-[#1F1813]
          shadow-[0_20px_45px_rgba(0,0,0,0.55)]
          transition-all duration-500
          hover:-translate-y-2
        "
      >
        <img
          src={heritageImage}
          alt="Sheesh Mahal"
          className="absolute h-full max-w-none object-cover"
          style={{
            width: '500%',
            left: '-200%',
            top: 0,
          }}
        />

        {/* Center label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[8px] uppercase tracking-[0.2em] text-[#E9D7A5] whitespace-nowrap">
            SM-01
          </span>
        </div>
      </div>


      {/* PANEL 4 */}
      <div
        className="
          relative
          w-[18%]
          h-[110%]
          overflow-hidden
          bg-[#1F1813]
          shadow-[0_14px_35px_rgba(0,0,0,0.45)]
          transition-all duration-500
          hover:-translate-y-2
        "
      >
        <img
          src={heritageImage}
          alt="Sheesh Mahal"
          className="absolute h-full max-w-none object-cover"
          style={{
            width: '500%',
            left: '-300%',
            top: 0,
          }}
        />
      </div>


      {/* PANEL 5 */}
      <div
        className="
          relative
          w-[18%]
          h-[100%]
          overflow-hidden
          bg-[#1F1813]
          shadow-[0_14px_35px_rgba(0,0,0,0.45)]
          transition-all duration-500
          hover:-translate-y-2
        "
      >
        <img
          src={heritageImage}
          alt="Sheesh Mahal"
          className="absolute h-full max-w-none object-cover"
          style={{
            width: '500%',
            left: '-400%',
            top: 0,
          }}
        />
      </div>
    </>
  );
})()}

  </div>


  {/* ========================================= */}
  {/* REFERENCE LABEL                           */}
  {/* ========================================= */}
  <div className="absolute bottom-5 left-5 z-30">

    <div className="px-3 py-1.5 rounded bg-[#16120E]/90 backdrop-blur-sm border border-[#C5A059]/40">

      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#E9D7A5]">
        2021 Reference Benchmark
      </p>

    </div>

  </div>


  {/* Decorative frame */}
  <div className="absolute inset-3 border border-[#C5A059]/20 rounded-2xl pointer-events-none z-40" />

</div>


            {/* Content Pane */}
            <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E9D7A5]">
                  <Sparkles size={13} />
                  <span>Sheesh Mahal (Jai Mandir) &bull; Amer Fort</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                  {element.name}
                </h1>

                <p className="text-xl sm:text-2xl font-hindi text-[#E9D7A5] font-medium">
                  {element.hindiName}
                </p>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-2">
                  {element.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#C5A059]/20 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to={`/preserve?element=${element.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold tracking-wider hover:brightness-110 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Camera size={15} />
                  <span>Document Current Condition</span>
                </Link>

                <div className="text-xs text-stone-400 font-mono">
                  Benchmark: 2021 Reference
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-b border-[#C89D66]/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {elementTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1F1813] text-[#FBF8F2]'
                      : 'text-[#5C5042] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="space-y-12">
          {/* HISTORICAL STORY */}
          {activeTab === 'story' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
                      The Story Behind the Mirrors
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#1F1813] mt-1">
                      {story.title}
                    </h3>
                    <p className="text-sm font-hindi text-[#996515]">{story.hindiTitle}</p>
                  </div>

                  <div className="space-y-4 text-sm sm:text-base text-[#4A3F33] leading-relaxed">
                    {story.narrative.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Emphasized Pull Quote */}
                <div className="p-6 sm:p-8 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/40 shadow-sm space-y-4">
                  <div className="text-4xl font-serif text-[#C5A059] leading-none">&ldquo;</div>
                  <blockquote className="font-serif italic text-lg text-[#2C221A] leading-relaxed">
                    {story.quote}
                  </blockquote>
                  <p className="text-xs font-hindi text-[#996515] leading-relaxed">
                    {story.hindiQuote}
                  </p>
                  <OrnamentDivider className="my-3" />
                  <p className="text-xs text-[#7D6E5D] font-mono">
                    Technique: {element.craftsmanshipDetails.technique}
                  </p>
                </div>
              </div>

              
            </div>
          )}

          {/* ARCHITECTURAL SIGNIFICANCE */}
          {activeTab === 'architectural' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-4">
                <h3 className="text-xl font-serif font-bold text-[#1F1813]">Material Composition &amp; Setting</h3>
                <p className="text-sm text-[#4A3F33] leading-relaxed">
                  The East Mirror Wall forms the principal reflective plane of the Jai Mandir audience hall. Crafted during the reigns of Mirza Raja Jai Singh and Sawai Jai Singh, the wall utilizes imported Belgian convex glass mosaic pieces set into natural Araish plaster.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-[#C89D66]/20">
                    <p className="text-xs uppercase font-semibold text-[#996515]">Technique</p>
                    <p className="text-sm font-medium text-[#1F1813] mt-1">{element.craftsmanshipDetails.technique}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#C89D66]/20">
                    <p className="text-xs uppercase font-semibold text-[#996515]">Materials</p>
                    <p className="text-sm font-medium text-[#1F1813] mt-1">{element.craftsmanshipDetails.materials}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CULTURAL SIGNIFICANCE */}
          {activeTab === 'cultural' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-4">
                <h3 className="text-xl font-serif font-bold text-[#1F1813]">Celestial Courtly Aesthetics</h3>
                <p className="text-sm text-[#4A3F33] leading-relaxed">
                  In Rajput cosmology and Mughal court ritual, mirror ornamentation served both poetic and practical functions. The convex shape transformed solitary candle flame flickers into infinite glittering stars, providing radiant illumination while preserving thermal insulation within desert winter evenings.
                </p>
              </div>
            </div>
          )}

          {/* THROUGH THE YEARS (VISUAL TIMELINE) */}
          {activeTab === 'years' && (
  <div className="space-y-8">

    {/* EXISTING THROUGH THE YEARS CONTENT */}
    <VisualTimeline
      elementId={element.id}
      showHeader={true}
    />


    {/* ========================================= */}
    {/* EXISTING CONTENT ENDS HERE                */}
    {/* VERTICAL TIMELINE STARTS HERE             */}
    {/* ========================================= */}

    <div className="pt-10 mt-10 border-t border-[#C89D66]/30">

      {/* Timeline Heading */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
          Historical Timeline
        </span>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1813] mt-2">
          Heritage Through Time
        </h2>

        <p className="text-lg font-hindi text-[#996515] mt-1">
          समय के साथ विरासत
        </p>

        <p className="text-sm text-[#5C5042] mt-3 max-w-2xl leading-relaxed">
          Explore documented photographs and historical observations
          of this heritage element across different periods.
        </p>
      </div>


      {/* VERTICAL TIMELINE */}
      <div className="relative border-l-2 border-[#C5A059]/40 ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-10">

        {filteredMilestones.map((item, index) => {

          const isReference =
            item.isReference ||
            item.role === 'AWS Comparison Reference';

          const isHistorical =
            item.isHistorical ||
            item.role === 'Historical Context';

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
                <span className="text-[10px] font-bold">
                  &bull;
                </span>
              </div>


              {/* Year Chip */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right w-24">

                <span
                  className={`font-mono text-xs font-bold block ${
                    isReference
                      ? 'text-[#C5A059]'
                      : 'text-[#996515]'
                  }`}
                >
                  {item.year}
                </span>

                <span className="text-[10px] text-stone-500 font-serif">
                  {item.era}
                </span>

              </div>


              {/* Timeline Card */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  isReference
                    ? 'bg-[#1F1813] text-white border-2 border-[#C5A059]'
                    : item.isActive
                      ? 'bg-[#1F1813] text-white border-[#C5A059]/40'
                      : 'bg-[#F5EFE6] text-[#1F1813] border-[#C89D66]/30'
                }`}
              >

                {/* Mobile Year */}
                <div className="sm:hidden mb-2 inline-flex items-center gap-2">

                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#C5A059]/20 text-[#996515]">
                    {item.year} &bull; {item.era}
                  </span>

                </div>


                {/* Category + Source */}
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


                {/* Title */}
                <h3
                  className={`text-xl font-serif font-bold ${
                    isReference || item.isActive
                      ? 'text-[#E9D7A5]'
                      : 'text-[#1F1813]'
                  }`}
                >
                  {item.title}
                </h3>


                {/* Hindi Title */}
                <p
                  className={`text-sm font-hindi font-medium mt-0.5 ${
                    isReference || item.isActive
                      ? 'text-stone-300'
                      : 'text-[#996515]'
                  }`}
                >
                  {item.hindiTitle}
                </p>


                {/* Description */}
                <p
                  className={`text-xs sm:text-sm mt-3 leading-relaxed ${
                    isReference || item.isActive
                      ? 'text-stone-300'
                      : 'text-[#4A3F33]'
                  }`}
                >
                  {item.description}
                </p>


                {/* Image */}
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

                      <span>
                        Click to view full photograph
                      </span>

                    </div>

                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>

  </div>
)}

          {/* PRESERVATION */}
          {activeTab === 'preservation' && (
            <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-4 max-w-4xl">
              <div className="flex items-center gap-2 text-[#996515]">
                <ShieldAlert size={18} />
                <h3 className="text-lg font-serif font-bold text-[#1F1813]">Active Preservation Vulnerabilities</h3>
              </div>
              <p className="text-sm text-[#4A3F33] leading-relaxed">
                {element.craftsmanshipDetails.vulnerabilities}
              </p>
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                <strong>Standardized Baseline:</strong> {element.craftsmanshipDetails.conservationBaseline}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
