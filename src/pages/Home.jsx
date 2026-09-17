import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShieldCheck, Users, Sparkles, ChevronDown, Landmark, Clock, Database, Layers } from 'lucide-react';
import MonumentCard from '../components/heritage/MonumentCard';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import HindiHeading from '../components/ui/HindiHeading';
import { MONUMENTS } from '../data/monuments';

export default function Home() {
  const featuredMonument = MONUMENTS[0]; // Amer Fort
  const secondaryMonuments = MONUMENTS.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813]">
      {/* ============================================================ */}
      {/* CINEMATIC HERO SECTION                                       */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#16120E] text-white">
        {/* Background Heritage Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/heritage/amer-fort/hero.jpg"
            alt="Amer Fort Amber Palace Rajasthan"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out brightness-75"
          />
          {/* Warm Dark Cinematic Overlay matching reference image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16120E] via-[#16120E]/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(197,160,89,0.15)_0%,_transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 space-y-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1813]/80 backdrop-blur-md border border-[#C5A059]/40 text-[#E9D7A5] text-xs uppercase tracking-widest shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
            <span>Digital Heritage Preservation &bull; डिजिटल विरासत संरक्षण</span>
          </div>

          {/* Headline and Hindi Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-white drop-shadow-md">
              Some stories are <br className="hidden sm:block" />
              <span className="gold-gradient-text italic font-serif">written in stone.</span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl font-hindi font-medium text-[#E9D7A5] tracking-wide">
              &ldquo;कुछ कहानियाँ पत्थरों में लिखी होती हैं।&rdquo;
            </p>
          </div>

          {/* Supporting Paragraph */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-300 font-light leading-relaxed">
            DigiVirasat creates a living digital record of India&rsquo;s heritage by connecting historical context, current observations, and cloud-powered visual analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#996515] text-[#16120E] text-sm font-bold tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(197,160,89,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <span>Explore Heritage</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/preserve"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1F1813]/80 hover:bg-[#2C221A] text-[#FBF8F2] text-sm font-medium tracking-wider border border-[#C5A059]/40 hover:border-[#C5A059] transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <span>Preserve an Element</span>
              <Sparkles size={16} className="text-[#C5A059]" />
            </Link>
          </div>

          {/* Hero Statistics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#1F1813]/70 backdrop-blur-md border border-[#C5A059]/20 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#E9D7A5]">01</span>
              <span className="text-xs uppercase tracking-wider text-stone-400">Featured Monument</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1F1813]/70 backdrop-blur-md border border-[#C5A059]/20 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#E9D7A5]">05+</span>
              <span className="text-xs uppercase tracking-wider text-stone-400">Preservation Elements</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1F1813]/70 backdrop-blur-md border border-[#C5A059]/20 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#E9D7A5]">18th C.</span>
              <span className="text-xs uppercase tracking-wider text-stone-400">Historical Context</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1F1813]/70 backdrop-blur-md border border-[#C5A059]/20 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#E9D7A5]">01</span>
              <span className="text-xs uppercase tracking-wider text-stone-400">Digital Archive</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-stone-400 flex flex-col items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity">
          <span>Scroll down</span>
          <ChevronDown size={14} className="animate-bounce text-[#C5A059]" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* PHILOSOPHY SECTION: "Heritage is not static."                 */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <HindiHeading
            badge="Living Heritage"
            title="Heritage is not static."
            hindiTitle="विरासत स्थिर नहीं है।"
            subtitle="Every observation, every comparison, every record helps us preserve what time tries to change. Monuments breathe, weather, and evolve with generations."
          />
          <OrnamentDivider />
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 01 */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F1813]">Visual Analysis</h3>
            <p className="text-xs font-hindi text-[#996515]">दृश्य विश्लेषण</p>
            <p className="text-xs sm:text-sm text-[#4A3F33] leading-relaxed">
              AI-assisted visual feature comparison against calibrated 2016 reference photography to highlight micro-surface deviations.
            </p>
          </div>

          {/* Feature 02 */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F1813]">Digital Records</h3>
            <p className="text-xs font-hindi text-[#996515]">संरक्षित डिजिटल अभिलेख</p>
            <p className="text-xs sm:text-sm text-[#4A3F33] leading-relaxed">
              Create structured, immutable preservation certificates backed by Amazon DynamoDB with verifiable historical metadata.
            </p>
          </div>

          {/* Feature 03 */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F1813]">Community Driven</h3>
            <p className="text-xs font-hindi text-[#996515]">जनसहभागिता आधारित</p>
            <p className="text-xs sm:text-sm text-[#4A3F33] leading-relaxed">
              Empower everyday visitors and researchers to document real-time conditions using simple mobile camera captures.
            </p>
          </div>

          {/* Feature 04 */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F1813]">Sustainable Future</h3>
            <p className="text-xs font-hindi text-[#996515]">स्थायी विरासत प्रबंधन</p>
            <p className="text-xs sm:text-sm text-[#4A3F33] leading-relaxed">
              Equip conservation bodies and ASI teams with longitudinal trends and condition priority rankings for timely intervention.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED MONUMENTS SECTION                                   */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-[#F5EFE6]/50 rounded-3xl border border-[#C89D66]/20 p-6 sm:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
              Heritage Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1813] mt-1">
              Featured Monuments
            </h2>
            <p className="text-base font-hindi text-[#996515]">
              भारत की जीवित विरासत को जानें
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#996515] hover:text-[#1F1813] transition-colors"
          >
            <span>View All Monuments</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid of Monument Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MonumentCard monument={featuredMonument} />
          <MonumentCard monument={secondaryMonuments[0]} />
          <MonumentCard monument={secondaryMonuments[1]} />
        </div>
      </section>

      {/* ============================================================ */}
      {/* CALL TO ACTION BANNER                                        */}
      {/* ============================================================ */}
      <section className="my-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#16120E] text-[#FBF8F2] border border-[#C5A059]/40 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none jaali-pattern" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-[#E9D7A5] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
              Preservation in Action
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Are you standing before Amer Fort?
            </h2>

            <p className="text-base font-hindi text-[#C5A059]">
              वर्तमान की तस्वीर दर्ज करें और संरक्षण में भागीदार बनें।
            </p>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Upload a photograph of the East Mirror Wall (SM-01) in Sheesh Mahal. Our AWS vision pipeline compares your observation against the 2016 baseline within seconds.
            </p>

            <div className="pt-4">
              <Link
                to="/preserve"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-sm font-bold tracking-wider hover:brightness-110 shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <span>Document Current Condition</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
