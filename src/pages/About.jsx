import React from 'react';
import { Landmark, ShieldCheck, Sparkles, Database, Eye, Heart, Compass, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import AwsArchitectureDiagram from '../components/about/AwsArchitectureDiagram';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import HindiHeading from '../components/ui/HindiHeading';

export default function About() {
  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold bg-[#C89D66]/15 px-3.5 py-1 rounded-full border border-[#C89D66]/30">
            About The Initiative
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1F1813]">
            Preserving Yesterday. Documenting Today.
          </h1>
          <p className="text-lg sm:text-xl font-hindi text-[#996515]">
            डिजिटल विरासत संरक्षण का दृष्टिकोण एवं वास्तुकला
          </p>
          <p className="text-sm sm:text-base text-[#5C5042] leading-relaxed">
            DigiVirasat creates a living digital record of India&rsquo;s heritage by connecting historical context, visitor observations, and cloud-powered visual analysis.
          </p>
          <OrnamentDivider />
        </div>

        {/* The Problem & The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-4 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold font-mono">
              01 &bull; The Conservation Dilemma
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#1F1813]">
              Monuments are Not Static
            </h3>
            <p className="text-sm text-[#4A3F33] leading-relaxed">
              India boasts thousands of world-renowned architectural masterpieces, from the hill citadels of Rajasthan to ancient cave monasteries. However, these physical monuments are subject to micro-weathering, ambient humidity variations, tourist wear, and environmental erosion.
            </p>
            <p className="text-sm text-[#4A3F33] leading-relaxed">
              Traditional manual inspection cycles often happen at intervals of years. Subtle micro-fissures, delaminating mirror foils, or stone spalling can easily progress undetected between inspection milestones.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#1F1813] text-[#FBF8F2] border border-[#C5A059]/40 space-y-4 shadow-xl">
            <span className="text-xs uppercase tracking-widest text-[#E9D7A5] font-semibold font-mono">
              02 &bull; The Digital Solution
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              Continuous Crowd-Assisted Observation
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              DigiVirasat transforms millions of everyday heritage visitors into conscientious conservation contributors. By enabling visitors to upload photos of designated architectural elements (e.g., SM-01 East Mirror Wall), our cloud engine immediately cross-references current observations against calibrated historical baselines.
            </p>
            <p className="text-sm text-stone-300 leading-relaxed">
              Computer vision pinpoints visual shifts, flags anomaly priorities, and logs permanent entries into the national preservation registry for archaeological review.
            </p>
          </div>
        </div>

        {/* AWS Architecture Diagram Section
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813]">
              Cloud-Powered Preservation Engine
            </h2>
            <p className="text-xs font-hindi text-[#996515]">क्लाउड आर्किटेक्चर एवं सुरक्षा</p>
          </div>

          <AwsArchitectureDiagram />
        </section> */}
        <section className="space-y-8">
  <div className="text-center max-w-3xl mx-auto space-y-3">
    <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
      Why DigiVirasat?
    </span>

    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1813]">
      Why Preserve What Already Exists?
    </h2>

    <p className="text-lg font-hindi text-[#996515]">
      जो विरासत आज हमारे पास है, उसे कल के लिए सुरक्षित रखना।
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="p-7 rounded-3xl bg-[#F5EFE6] border border-[#C89D66]/30">
      <h3 className="text-xl font-serif font-bold mb-3">
        Heritage is Changing
      </h3>

      <p className="text-sm text-[#4A3F33] leading-relaxed">
        Historic monuments continuously experience environmental exposure,
        humidity, dust, visitor activity and natural ageing. Small visual
        changes can become difficult to track when documentation is
        performed only occasionally.
      </p>
    </div>

    <div className="p-7 rounded-3xl bg-[#1F1813] text-white border border-[#C5A059]/40">
      <h3 className="text-xl font-serif font-bold text-[#E9D7A5] mb-3">
        DigiVirasat Creates a Living Record
      </h3>

      <p className="text-sm text-stone-300 leading-relaxed">
        DigiVirasat connects historical photographs, recent reference
        imagery and present-day visitor captures into a continuous digital
        record for individual heritage elements.
      </p>
    </div>

    <div className="p-7 rounded-3xl bg-[#F5EFE6] border border-[#C89D66]/30">
      <h3 className="text-xl font-serif font-bold mb-3">
        From Visitors to Preservation
      </h3>

      <p className="text-sm text-[#4A3F33] leading-relaxed">
        A visitor can document what they see today. Visual analysis can
        highlight differences that deserve attention, helping conservation
        teams prioritize further inspection and documentation.
      </p>
    </div>
  </div>
</section>

<section className="p-8 sm:p-12 rounded-3xl bg-[#1F1813] text-white border border-[#C5A059]/40">
  <div className="max-w-3xl mx-auto text-center space-y-5">
    <span className="text-xs uppercase tracking-widest text-[#C5A059]">
      Preservation in the Digital Age
    </span>

    <h2 className="text-2xl sm:text-4xl font-serif font-bold">
      Turning Photographs Into Historical Evidence
    </h2>

    <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
      Digital preservation allows heritage documentation to become more
      continuous, accessible and structured. Instead of relying only on
      isolated photographs or periodic inspections, DigiVirasat builds a
      chronological visual record of specific architectural elements.
    </p>

    <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
      The platform is designed to support researchers, visitors and
      conservation teams by connecting historical context with present-day
      observations and computer-vision-assisted comparison.
    </p>

    <p className="text-sm font-hindi text-[#E9D7A5]">
      इतिहास को केवल देखने के लिए नहीं, बल्कि दर्ज करने और संरक्षित करने के लिए।
    </p>
  </div>
</section>

        {/* Methodological Integrity & Disclaimer */}
        <div className="p-8 rounded-3xl bg-amber-50/70 border border-amber-300/80 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900">
            <ShieldAlert size={22} className="text-amber-700" />
            <h3 className="text-lg font-serif font-bold">Standardized Preservation Disclaimer</h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            Amazon Rekognition identifies optical feature labels, contrast variations, and perimeter geometry differences. It does <strong>not</strong> independently prove structural damage or physical deterioration.
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            All outputs generated by DigiVirasat 2.0 serve as prioritization indices and comparative observational flags for conservation specialists. Certified ground inspections and standardized photometric analyses remain essential before any physical conservation intervention is initiated.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center py-6">
          <Link
            to="/preserve"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-sm font-bold tracking-wider hover:brightness-110 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <span>Start Documenting Heritage</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
