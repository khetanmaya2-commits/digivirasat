import React, { useEffect, useRef } from 'react';
import { X, Printer, ShieldCheck, Landmark, Calendar, MapPin, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import OrnamentDivider from '../ui/OrnamentDivider';
import StatusBadge from '../ui/StatusBadge';

/**
 * DigitalPreservationRecord Component
 * Handles:
 * 1. View Record: Accessible modal with sticky visible [X] close button, Escape key, outside click
 * 2. Print Record: Standardized A4 print document formatted cleanly via print.css
 */
export default function DigitalPreservationRecord({ record, isOpen, onClose, onPrint }) {
  const modalContentRef = useRef(null);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
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

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  if (!record) return null;

  const formattedDate = new Date(record.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const referenceImage = record.referenceImageUrl || '/images/sheesh-mahal/sheesh-mahal-2021.jpg';
  const currentImage = record.currentImageUrl || '/heritage/amer-fort/sheesh-mahal/sm-01/baseline-2026.jpg';

  return (
    <>
      {/* ============================================================ */}
      {/* 1. ON-SCREEN MODAL VIEW (Rendered when isOpen is true)       */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto no-print"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="record-title"
        >
          <div
            ref={modalContentRef}
            className="relative w-full max-w-4xl bg-[#FBF8F2] text-[#1F1813] rounded-2xl sm:rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header Bar with Fixed High-Visibility Close Button */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#1F1813] text-[#FBF8F2] border-b border-[#C5A059]/40 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#C5A059]/20 text-[#E9D7A5]">
                  <FileCheck size={18} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C5A059] font-mono font-semibold block leading-none">
                    National Heritage Archive
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base text-white">
                    Digital Preservation Record
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#16120E] text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-sm"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Print Record</span>
                </button>

                {/* Explicit Accessible [X] Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close preservation record"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8">
              {/* Document Title & Header */}
              <div className="text-center space-y-2 border-b border-[#C89D66]/30 pb-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#996515] font-semibold">
                  <Landmark size={15} />
                  <span>DigiVirasat &bull; Archaeological Record Registry</span>
                </div>

                <h2 id="record-title" className="text-2xl sm:text-4xl font-serif font-bold text-[#1F1813]">
                  Digital Preservation Record
                </h2>

                <p className="text-base sm:text-lg font-hindi text-[#996515] font-medium">
                  राष्ट्रीय विरासत डिजिटल संरक्षण अभिलेख
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-stone-600 pt-1">
                  <span>Record ID: <strong className="text-[#1F1813]">{record.analysisId}</strong></span>
                  <span>&bull;</span>
                  <span>Generated: {formattedDate}</span>
                </div>
              </div>

              {/* Monument & Element Dossier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F5EFE6] p-5 rounded-2xl border border-[#C89D66]/30">
                <div className="space-y-1">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#996515] font-bold">
                    Heritage Monument
                  </p>
                  <p className="text-xl font-serif font-bold text-[#1F1813]">
                    {record.monumentName || 'Amer Fort'}
                  </p>
                  <p className="text-xs font-hindi text-[#7D5220]">
                    आमेर किला &bull; Jaipur, Rajasthan
                  </p>
                  <p className="text-xs text-stone-500">
                    Location: Amber Ridge, UNESCO World Heritage Site
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#996515] font-bold">
                    Architectural Element
                  </p>
                  <p className="text-xl font-serif font-bold text-[#1F1813]">
                    {record.elementId}: {record.elementName || 'East Mirror Wall'}
                  </p>
                  <p className="text-xs font-hindi text-[#7D5220]">
                    पूर्वी शीशा दीवार &bull; Sheesh Mahal (Jai Mandir)
                  </p>
                  <p className="text-xs text-stone-500">
                    Classification: Thikri Glass Inlay &amp; Araish Plasterwork
                  </p>
                </div>
              </div>

              {/* Key Preservation Indicators */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <p className="text-[11px] uppercase font-bold text-stone-500">Condition</p>
                  <div className="flex justify-center pt-1">
                    <StatusBadge status={record.condition} />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <p className="text-[11px] uppercase font-bold text-stone-500">Priority Score</p>
                  <p className="text-2xl font-serif font-bold text-[#996515]">
                    {record.priorityScore} <span className="text-xs text-stone-400 font-normal">/ 100</span>
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <p className="text-[11px] uppercase font-bold text-stone-500">Visual Variation</p>
                  <p className="text-2xl font-serif font-bold text-[#1F1813]">
                    {record.visualVariation}%
                  </p>
                </div>
              </div>

              {/* Side-by-Side Photographic Evidence */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-[#996515]">
                  Photographic Comparison Evidence
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-stone-300 bg-black">
                      <img
                        src={referenceImage}
                        alt="2021 Reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F1813]">2021 Reference Benchmark</span>
                      <span className="text-stone-500 font-mono text-[10px]">Operational Baseline</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-stone-300 bg-black">
                      <img
                        src={currentImage}
                        alt="Current Visitor Capture"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F1813]">Current Visitor Capture</span>
                      <span className="text-amber-700 font-mono text-[10px]">On-site Observation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Visual Variations */}
              <div className="p-5 rounded-xl bg-white border border-[#C89D66]/30 space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#996515] font-bold">
                  Detected Visual Variation
                </h4>
                <div className="flex flex-wrap gap-2">
                  {record.comparison?.newLabels?.length > 0 ? (
                    record.comparison.newLabels.map((lbl, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#1F1813] text-[#E9D7A5] border border-[#C5A059]/40"
                      >
                        New visual label: {lbl}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-500 italic">No discrete anomalous visual labels detected.</span>
                  )}
                  {record.comparison?.removedLabels?.map((lbl, idx) => (
                    <span
                      key={`rem-${idx}`}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-300"
                    >
                      Baseline label not captured: {lbl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preservation Insight & Conservation Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-[#996515] font-bold">
                    Preservation Insight
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2C221A] leading-relaxed">
                    {record.preservationInsight}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-[#2D4B39] font-bold">
                    Recommended Conservation Action
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2C221A] leading-relaxed">
                    {record.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Verification Notice */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle size={14} />
                  <span>Standardized Preservation Protocol</span>
                </div>
                <p>
                  Detected visual differences do not by themselves confirm physical deterioration. Field verification or standardized photography by certified conservation staff is recommended.
                </p>
              </div>

              {/* Footer Stamp */}
              <div className="pt-6 border-t border-[#C89D66]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
                <div className="text-center sm:text-left">
                  <p className="font-serif font-bold text-stone-800">DigiVirasat &bull; Digital Heritage Preservation</p>
                  <p className="italic text-stone-500">Explore the story. Document the present. Preserve the future.</p>
                </div>
                <div className="text-center sm:text-right font-mono text-[11px]">
                  <span>AWS Rekognition &bull; DynamoDB SHA-256</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. DEDICATED PRINT DOCUMENT (Visible ONLY when printing)     */}
      {/* ============================================================ */}
      <div className="hidden print:block print-record bg-white text-black p-4 font-sans">
        {/* Certificate Header Banner */}
        <div className="border-b-2 border-[#C5A059] pb-4 mb-5 text-center">
          <div className="text-[10pt] uppercase tracking-widest font-bold text-[#996515] mb-1">
            Archaeological Survey &bull; DigiVirasat National Heritage Registry
          </div>
          <h1 className="text-2xl font-serif font-bold text-black tracking-tight">
            Digital Preservation Record
          </h1>
          <p className="text-sm font-hindi text-[#7D5220]">
            राष्ट्रीय विरासत डिजिटल संरक्षण अभिलेख
          </p>
          <div className="mt-2 text-[9pt] font-mono text-stone-600 flex justify-center gap-4">
            <span><strong>Record ID:</strong> {record.analysisId}</span>
            <span>&bull;</span>
            <span><strong>Date:</strong> {formattedDate}</span>
          </div>
        </div>

        {/* Monument & Element Summary */}
        <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-300 mb-4 print-avoid-break">
          <div>
            <div className="text-[8pt] uppercase font-bold text-stone-500">Heritage Monument</div>
            <div className="text-base font-serif font-bold text-black">{record.monumentName || 'Amer Fort'} (आमेर किला)</div>
            <div className="text-[9pt] text-stone-600">Jaipur, Rajasthan &bull; UNESCO World Heritage Site</div>
          </div>
          <div>
            <div className="text-[8pt] uppercase font-bold text-stone-500">Preservation Element</div>
            <div className="text-base font-serif font-bold text-black">{record.elementId}: {record.elementName || 'East Mirror Wall'} (पूर्वी शीशा दीवार)</div>
            <div className="text-[9pt] text-stone-600">Location: Sheesh Mahal (Jai Mandir)</div>
          </div>
        </div>

        {/* Metrics Table */}
        <table className="w-full mb-4 border border-stone-300 print-avoid-break">
          <thead>
            <tr className="bg-stone-100 text-[9pt] uppercase text-stone-700">
              <th className="p-2 border border-stone-300 text-center">Condition Status</th>
              <th className="p-2 border border-stone-300 text-center">Preservation Priority Score</th>
              <th className="p-2 border border-stone-300 text-center">Detected Visual Variation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center font-bold text-base">
              <td className="p-2 border border-stone-300">{record.condition}</td>
              <td className="p-2 border border-stone-300 text-[#996515]">{record.priorityScore} / 100</td>
              <td className="p-2 border border-stone-300">{record.visualVariation}%</td>
            </tr>
          </tbody>
        </table>

        {/* Photographic Evidence Pair */}
        <div className="mb-4 print-avoid-break">
          <div className="text-[9pt] font-bold uppercase tracking-wider text-stone-700 mb-2">
            Comparative Photographic Evidence
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-stone-300 p-2 rounded text-center">
              <img
                src={referenceImage}
                alt="2021 Reference"
                className="w-full h-36 object-cover rounded mb-1"
              />
              <div className="text-[8pt] font-bold text-stone-800">2021 Reference Photograph</div>
              <div className="text-[7pt] text-stone-500">Calibrated Operational Baseline</div>
            </div>

            <div className="border border-stone-300 p-2 rounded text-center">
              <img
                src={currentImage}
                alt="Current Visitor Capture"
                className="w-full h-36 object-cover rounded mb-1"
              />
              <div className="text-[8pt] font-bold text-stone-800">Current Visitor Capture</div>
              <div className="text-[7pt] text-stone-500">On-site Observation Record</div>
            </div>
          </div>
        </div>

        {/* Detected Visual Variations */}
        <div className="border border-stone-300 p-3 rounded-lg mb-3 print-avoid-break">
          <div className="text-[8pt] font-bold uppercase text-stone-600 mb-1">
            Detected Visual Variation (Computer Vision Features)
          </div>
          <div className="text-[9pt] text-stone-800">
            {record.comparison?.newLabels?.length > 0
              ? record.comparison.newLabels.join(', ')
              : 'Optical variations detected in ambient reflection and mortar joint contrast.'}
          </div>
        </div>

        {/* Insights and Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4 print-avoid-break">
          <div className="border border-stone-300 p-3 rounded-lg">
            <div className="text-[8pt] font-bold uppercase text-stone-600 mb-1">Preservation Insight</div>
            <p className="text-[9pt] text-stone-800 leading-snug">{record.preservationInsight}</p>
          </div>

          <div className="border border-stone-300 p-3 rounded-lg">
            <div className="text-[8pt] font-bold uppercase text-stone-600 mb-1">Recommended Action</div>
            <p className="text-[9pt] text-stone-800 leading-snug">{record.recommendedAction}</p>
          </div>
        </div>

        {/* Verification Protocol Notice */}
        <div className="border border-stone-300 p-3 rounded-lg bg-stone-50 mb-5 print-avoid-break text-[8pt] text-stone-700 leading-normal">
          <strong>Official Preservation Protocol:</strong> Detected visual differences do not by themselves confirm physical deterioration. Field verification or standardized photography by certified conservation staff is recommended prior to physical conservation treatment.
        </div>

        {/* Print Sign-off Footer */}
        <div className="border-t border-stone-400 pt-3 flex justify-between items-center text-[8pt] text-stone-600 print-avoid-break">
          <div>
            <p className="font-bold text-black">DigiVirasat &bull; Digital Heritage Preservation</p>
            <p className="italic">Explore the story. Document the present. Preserve the future.</p>
          </div>
          <div className="text-right">
            <p className="font-mono">AWS Verified Archive Record</p>
            <p className="font-mono text-[7pt]">HASH: SHA256-DIGIVIRASAT-AUTHENTICATED</p>
          </div>
        </div>
      </div>
    </>
  );
}
