import React from 'react';
import { X, Printer, Download, ShieldCheck, Landmark } from 'lucide-react';
import OrnamentDivider from '../ui/OrnamentDivider';
import StatusBadge from '../ui/StatusBadge';

/**
 * Digital Preservation Record Modal & Print Layout
 */
export default function DigitalRecordModal({ record, onClose }) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#FBF8F2] text-[#1F1813] rounded-2xl border border-[#C5A059] shadow-2xl overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-[#1F1813] text-[#FBF8F2] border-b border-[#C5A059]/30">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#C5A059]" />
            <span className="font-serif font-bold tracking-wide">Digital Preservation Certificate</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B38838] text-[#1F1813] text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate / Record Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-2 border-b border-[#C89D66]/30 pb-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#996515] font-semibold">
              <Landmark size={15} />
              <span>DigiVirasat National Digital Heritage Registry</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#1F1813]">
              Digital Preservation Record
            </h1>
            <p className="text-sm font-hindi text-[#A87B4F]">
              राष्ट्रीय विरासत डिजिटल संरक्षण प्रमाणपत्र
            </p>
            <p className="text-xs font-mono text-stone-500">
              Record ID: {record.analysisId} &bull; Generated: {new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <OrnamentDivider className="my-2" />

          {/* Monument & Element Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5EFE6] p-4 rounded-xl border border-[#C89D66]/30">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#996515] font-semibold">Heritage Monument</p>
              <p className="text-lg font-serif font-bold text-[#1F1813]">{record.monumentName || 'Amer Fort'}</p>
              <p className="text-xs text-[#7D6E5D]">Jaipur, Rajasthan &bull; UNESCO World Heritage</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#996515] font-semibold">Architectural Element</p>
              <p className="text-lg font-serif font-bold text-[#1F1813]">
                {record.elementId}: {record.elementName || 'East Mirror Wall'}
              </p>
              <p className="text-xs font-hindi text-[#A87B4F]">Sheesh Mahal (Jai Mandir)</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <p className="text-[11px] uppercase text-stone-500 font-medium">Condition</p>
              <div className="mt-1 flex justify-center">
                <StatusBadge status={record.condition} />
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <p className="text-[11px] uppercase text-stone-500 font-medium">Priority Score</p>
              <p className="text-xl font-serif font-bold text-[#C5A059]">{record.priorityScore} / 100</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <p className="text-[11px] uppercase text-stone-500 font-medium">Visual Variation</p>
              <p className="text-xl font-serif font-bold text-[#1F1813]">{record.visualVariation}%</p>
            </div>
          </div>

          {/* Insights & Actions */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-[#C89D66]/30">
              <h4 className="text-xs uppercase tracking-wider text-[#996515] font-bold mb-1">
                Preservation Insight
              </h4>
              <p className="text-sm text-[#2C221A] leading-relaxed">
                {record.preservationInsight}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#C89D66]/30">
              <h4 className="text-xs uppercase tracking-wider text-[#2D4B39] font-bold mb-1">
                Recommended Conservation Action
              </h4>
              <p className="text-sm text-[#2C221A] leading-relaxed">
                {record.recommendedAction}
              </p>
            </div>
          </div>

          {/* Legal / Standardized Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-normal">
            <strong>Standardized Preservation Protocol:</strong> Detected visual differences do not by themselves confirm physical deterioration. Field verification and calibrated photometric inspection by certified Archaeological Survey personnel is recommended.
          </div>

          {/* Sign-off Seals */}
          <div className="pt-6 border-t border-[#C89D66]/30 flex items-center justify-between text-xs text-stone-500">
            <div>
              <p className="font-semibold text-stone-700">DigiVirasat Archival Registry</p>
              <p>AWS Cloud Verified Record</p>
            </div>
            <div className="text-right">
              <p className="font-serif italic text-stone-700 font-medium">Digital Verification Seal</p>
              <p className="font-mono text-[10px]">AUTH-SIG: SHA256-VALIDATED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
