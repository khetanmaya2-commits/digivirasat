import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, Shield, ArrowRight, Sparkles, Landmark, Award, BookOpen, Layers } from 'lucide-react';
import { MONUMENTS } from '../data/monuments';
import { PRESERVATION_ELEMENTS } from '../data/elements';
import { HERITAGE_STORIES } from '../data/heritageStories';
import ElementCard from '../components/heritage/ElementCard';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import HindiHeading from '../components/ui/HindiHeading';

export default function Monument() {
  const { monumentId = 'amer-fort' } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const monument = MONUMENTS.find((m) => m.id === monumentId) || MONUMENTS[0];
  const elements = PRESERVATION_ELEMENTS.filter((e) => e.monumentId === monument.id);
  const stories = HERITAGE_STORIES.amerFort;

  const tabs = [
    { id: 'overview', label: 'Overview', hindi: 'अवलोकन' },
    { id: 'history', label: 'History', hindi: 'इतिहास' },
    { id: 'architecture', label: 'Architecture', hindi: 'स्थापत्य कला' },
    { id: 'elements', label: 'Preservation Elements', hindi: 'संरक्षण तत्व' },
    { id: 'timeline', label: 'Digital Timeline', hindi: 'समयरेखा' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813]">
      {/* ============================================================ */}
      {/* MONUMENT HERO BANNER                                         */}
      {/* ============================================================ */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end justify-start bg-[#16120E] overflow-hidden">
        <img
          src={monument.heroImage}
          alt={monument.name}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16120E] via-[#16120E]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16120E]/80 via-transparent to-transparent" />

        {/* Hero Details */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-36 w-full">
          <div className="max-w-3xl space-y-4 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C5A059]/20 backdrop-blur-md text-[#E9D7A5] border border-[#C5A059]/40 inline-flex items-center gap-1.5">
                <Award size={13} />
                <span>{monument.unescoStatus}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1F1813]/70 backdrop-blur-md text-stone-300 border border-stone-700">
                {monument.era}
              </span>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-hindi text-[#E9D7A5] font-medium">
                {monument.hindiName}
              </p>
              <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-white mt-1">
                {monument.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} className="text-[#C5A059]" />
                {monument.location}
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1.5">
                <Compass size={16} className="text-[#C5A059]" />
                {monument.architecturalStyle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* NAVIGATION TABS                                              */}
      {/* ============================================================ */}
      <div className="sticky top-[60px] z-30 bg-[#F5EFE6] border-b border-[#C89D66]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'timeline') {
                      window.location.href = '/timeline';
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1F1813] text-[#FBF8F2] shadow-sm'
                      : 'text-[#5C5042] hover:bg-[#EAE1D3] hover:text-[#1F1813]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB CONTENTS                                                 */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Monument Brief with Pull Quote */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
                    About Amer Fort
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813] mt-1">
                    The Crown of the Aravalli Hills
                  </h2>
                </div>

                <p className="text-base text-[#4A3F33] leading-relaxed">
                  {monument.description}
                </p>

                <p className="text-sm font-hindi text-[#7D5220] leading-relaxed bg-[#F5EFE6] p-4 rounded-xl border border-[#C89D66]/30">
                  {monument.hindiDescription}
                </p>

                {/* 3 Fact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#C89D66]/30">
                    <p className="text-xs uppercase tracking-wider text-[#996515] font-semibold">Built</p>
                    <p className="text-base font-serif font-bold text-[#1F1813] mt-1">{monument.builtYear}</p>
                    <p className="text-xs text-[#7D6E5D] mt-0.5">{monument.builtBy}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#C89D66]/30">
                    <p className="text-xs uppercase tracking-wider text-[#996515] font-semibold">Location</p>
                    <p className="text-base font-serif font-bold text-[#1F1813] mt-1">{monument.location}</p>
                    <p className="text-xs text-[#7D6E5D] mt-0.5">Maota Lake Ridge</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#C89D66]/30">
                    <p className="text-xs uppercase tracking-wider text-[#996515] font-semibold">Architecture</p>
                    <p className="text-base font-serif font-bold text-[#1F1813] mt-1">Rajput - Mughal</p>
                    <p className="text-xs text-[#7D6E5D] mt-0.5">Sandstone & Marble</p>
                  </div>
                </div>
              </div>

              {/* Side Pull Quote */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/40 shadow-sm space-y-4">
                <div className="text-4xl font-serif text-[#C5A059] leading-none">&ldquo;</div>
                <blockquote className="font-serif italic text-lg sm:text-xl text-[#2C221A] leading-relaxed">
                  Not just a fort, but a living symbol of India&rsquo;s royal heritage.
                </blockquote>
                <p className="text-xs font-hindi text-[#996515]">
                  राजपूत वीरता, कला और स्थापत्य प्रतिभा का अमर प्रतीक।
                </p>
                <div className="pt-4 border-t border-[#C89D66]/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#996515]">
                    <Sparkles size={16} />
                  </div>
                  <div className="text-xs text-[#5C5042]">
                    <span className="font-semibold block text-[#1F1813]">UNESCO Inscription</span>
                    <span>Hill Forts of Rajasthan &bull; 2013</span>
                  </div>
                </div>
              </div>
            </div>

            <OrnamentDivider />

            {/* PRESERVATION ELEMENTS SECTION */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
                    Monitored Architectural Features
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813] mt-1">
                    Preservation Elements
                  </h3>
                  <p className="text-sm font-hindi text-[#996515]">
                    संरक्षण के महत्वपूर्ण तत्व
                  </p>
                </div>

                <Link
                  to="/preserve"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F1813] hover:bg-[#996515] text-[#FBF8F2] text-xs font-semibold tracking-wider transition-colors shadow-sm"
                >
                  <span>Document an Element</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Elements Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {elements.map((elem) => (
                  <ElementCard key={elem.id} element={elem} monumentId={monument.id} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
                Historical Chronicles
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#1F1813]">{stories.title}</h2>
              <p className="text-base font-hindi text-[#996515]">{stories.hindiTitle}</p>
            </div>

            <OrnamentDivider />

            <div className="space-y-8">
              {stories.sections.map((sec, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#1F1813]">{sec.heading}</h3>
                  <p className="text-xs font-hindi text-[#996515] font-medium">{sec.hindiHeading}</p>
                  <p className="text-sm sm:text-base text-[#4A3F33] leading-relaxed">{sec.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ARCHITECTURE TAB */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
                Architectural Mastery
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#1F1813]">Rajput & Mughal Syncretism</h2>
              <p className="text-base font-hindi text-[#996515]">कलात्मक हिंदू-मुगल स्थापत्य शैली</p>
            </div>

            <OrnamentDivider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {monument.highlights.map((highlight, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center font-mono text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <h4 className="text-lg font-serif font-bold text-[#1F1813]">{highlight}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
                Digital Preservation Registry
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#1F1813]">Chamber of Sheesh Mahal</h2>
              <p className="text-base font-hindi text-[#996515]">संरक्षण तत्व सूची</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {elements.map((elem) => (
                <ElementCard key={elem.id} element={elem} monumentId={monument.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
