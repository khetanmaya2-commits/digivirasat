import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Shield, Cpu, ExternalLink, Heart } from 'lucide-react';
import OrnamentDivider from '../ui/OrnamentDivider';

export default function Footer() {
  return (
    <footer className="no-print relative bg-[#16120E] text-stone-300 border-t border-[#C5A059]/30 pt-16 pb-12 overflow-hidden select-none">
      {/* Subtle jaali background motif */}
      <div className="absolute inset-0 opacity-5 pointer-events-none jaali-pattern" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Branding & Bilingual Motto */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E9D7A5] via-[#C5A059] to-[#996515] p-[1.5px] shadow-lg">
              <div className="w-full h-full rounded-[10px] bg-[#1F1813] flex items-center justify-center text-[#E9D7A5]">
                <Landmark size={20} />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              DigiVirasat <span className="text-xs font-mono font-normal text-[#C5A059]">2.0</span>
            </span>
          </div>

          <p className="text-base sm:text-lg font-serif italic text-[#E9D7A5]">
            &ldquo;Preserving yesterday. Documenting today. Protecting tomorrow.&rdquo;
          </p>

          <p className="text-sm font-hindi text-[#C5A059] leading-relaxed">
            &ldquo;कल की विरासत को आज दर्ज करें, ताकि आने वाली पीढ़ियाँ उसे देख सकें।&rdquo;
          </p>
        </div>

        <OrnamentDivider dark className="my-6" />

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1: Heritage Explorer */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#E9D7A5]">
              Explore Heritage
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/monument/amer-fort" className="hover:text-[#E9D7A5] transition-colors">Amer Fort (आमेर किला)</Link></li>
              <li><Link to="/monument/amer-fort/element/SM-01" className="hover:text-[#E9D7A5] transition-colors">Sheesh Mahal (SM-01)</Link></li>
              <li><Link to="/explore" className="hover:text-[#E9D7A5] transition-colors">Hawa Mahal & Jantar Mantar</Link></li>
              <li><Link to="/explore" className="hover:text-[#E9D7A5] transition-colors">UNESCO Hill Forts</Link></li>
            </ul>
          </div>

          {/* Column 2: Digital Preservation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#E9D7A5]">
              Preservation Engine
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/preserve" className="hover:text-[#E9D7A5] transition-colors">Document Current Condition</Link></li>
              <li><Link to="/timeline" className="hover:text-[#E9D7A5] transition-colors">Conservation Timeline</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#E9D7A5] transition-colors">Command Center</Link></li>
              <li><Link to="/about" className="hover:text-[#E9D7A5] transition-colors">Verification Methodology</Link></li>
            </ul>
          </div>

          {/* Column 3: AWS Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#E9D7A5]">
              Cloud Infrastructure
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs font-mono">
              <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">&bull;</span> Amazon API Gateway</li>
              <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">&bull;</span> AWS Lambda (ap-south-1)</li>
              <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">&bull;</span> Amazon S3 Private Bucket</li>
              <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">&bull;</span> Amazon Rekognition Vision</li>
              <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">&bull;</span> Amazon DynamoDB Registry</li>
            </ul>
          </div>

          {/* Column 4: Standards & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#E9D7A5]">
              Conservation Ethics
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Detected visual differences highlight change points for conservationists and do not independently constitute structural degradation without expert ground verification.
            </p>
            <div className="pt-1">
              <Link
                to="/about"
                className="inline-flex items-center gap-1 text-xs text-[#C5A059] hover:underline"
              >
                <span>Read Preservational Standards</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} DigiVirasat 2.0 &bull; Dedicated to the permanent digital preservation of Indian cultural heritage.
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <Link to="/about" className="hover:text-white transition-colors">Architecture</Link>
            <span>&bull;</span>
            <Link to="/dashboard" className="hover:text-white transition-colors">Command Center</Link>
            <span>&bull;</span>
            <span className="text-[#C5A059]">AWS ap-south-1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
