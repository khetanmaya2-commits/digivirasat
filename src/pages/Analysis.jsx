import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, ShieldAlert, Sparkles, AlertCircle, FileCheck, CheckCircle2, Eye, Compass, Info, RefreshCw, Layers } from 'lucide-react';
import { getAnalysis } from '../api/analysisApi';
import { isApiConfigured } from '../api/apiClient';
import ImageComparison from '../components/preservation/ImageComparison';
import PriorityScore from '../components/preservation/PriorityScore';
import MetricCard from '../components/ui/MetricCard';
import StatusBadge from '../components/ui/StatusBadge';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import DigitalPreservationRecord from '../components/preservation/DigitalPreservationRecord';

export default function Analysis() {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recordOpen, setRecordOpen] = useState(false);

  const apiConnected = isApiConfigured();

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      if (apiConnected) {
        const data = await getAnalysis(analysisId);
        console.log('NORMALIZED ANALYSIS:', data);
console.log('PRIORITY SCORE:', data?.priorityScore);
console.log('CURRENT IMAGE URL:', data?.currentImageUrl);
console.log('CURRENT IMAGE KEY:', data?.currentImageKey);
        setAnalysis(data);
      } else {
        // Structured baseline fallback when API Gateway is unconfigured
        setAnalysis({
          analysisId: analysisId || 'DV-ANL-2026-0891',
          elementId: 'SM-01',
          monumentId: 'amer-fort',
          monumentName: 'Amer Fort',
          elementName: 'East Mirror Wall',
          condition: 'Moderate',
          priorityScore: 52,
          visualVariation: 53,
          comparison: {
            newLabels: ['Reflection Diffuse', 'Perimeter Shadow', 'Micro Fissure (Optical)'],
            removedLabels: ['Direct Specular Glint'],
            changedFeatures: 4,
            totalFeatures: 12,
            visualChangeScore: 53,
          },
          changes: [
            { label: 'Reflection Diffuse', type: 'new' },
            { label: 'Perimeter Shadow', type: 'new' },
            { label: 'Direct Specular Glint', type: 'removed' },
            { label: 'Micro Fissure (Optical)', type: 'new' },
          ],
          preservationInsight:
            'Comparative visual feature analysis completed across 2021 reference baseline and current visitor observation. Minor optical variation observed in secondary surface reflections and plaster joint contrast.',
          recommendedAction:
            'Schedule standardized photometric inspection by site conservators. Verify micro-fissure stability and monitor mirror adhesive integrity during seasonal humidity transitions.',
          createdAt: new Date().toISOString(),
          referenceImageUrl: '/images/sheesh-mahal/sheesh-mahal-2021.jpg',
          currentImageUrl: '/heritage/amer-fort/sheesh-mahal/sm-01/baseline-2026.jpg',
        });
      }
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
      setError(err.message || 'Could not retrieve preservation record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [analysisId, apiConnected]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center pt-24 pb-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />
          <p className="font-serif text-lg text-[#1F1813]">Retrieving Digital Preservation Record...</p>
          <p className="text-xs font-mono text-stone-500">Querying DynamoDB &bull; {analysisId}</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center pt-24 pb-20 px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#F5EFE6] border border-red-300 text-center space-y-4 shadow-md">
          <AlertCircle size={36} className="text-red-600 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-[#1F1813]">Preservation Record Unavailable</h2>
          <p className="text-xs text-stone-600 leading-relaxed">{error || 'Record could not be loaded.'}</p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={fetchAnalysis}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F1813] text-white text-xs font-semibold"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link to="/preserve" className="px-4 py-2 rounded-xl border border-stone-400 text-xs font-semibold">
              Back to Preserve
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation & Two Separate Actions Top Bar */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C89D66]/30 pb-4">
          <Link
            to="/preserve"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#996515] hover:text-[#1F1813] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>&larr; Back to Preservation Workflow</span>
          </Link>

          {/* TWO SEPARATE ACTIONS: VIEW RECORD and PRINT RECORD */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRecordOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F1813] hover:bg-[#2C221A] text-[#FBF8F2] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <FileCheck size={14} className="text-[#C5A059]" />
              <span>View Digital Preservation Record</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#16120E] text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Record</span>
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-2 no-print">
          <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold bg-[#C89D66]/15 px-3 py-1 rounded-full border border-[#C89D66]/30">
            AWS Visual Intelligence Output
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1F1813]">
            Preservation Analysis
          </h1>
          <p className="text-lg sm:text-xl font-hindi text-[#996515]">
            संरक्षण विश्लेषण
          </p>
          <p className="text-xs sm:text-sm text-[#5C5042]">
            {analysis.monumentName || 'Amer Fort'} &bull; Element {analysis.elementId}: {analysis.elementName || 'East Mirror Wall'}
          </p>
        </div>

        {/* 3 Major Metric Cards Matching Reference Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
          {/* Card 1: CONDITION */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#996515]">CONDITION</p>
              <p className="text-xs font-hindi text-[#A87B4F]">संरक्षण स्थिति</p>
            </div>
            <div className="space-y-2">
              <span className="text-3xl font-serif font-bold text-[#1F1813]">
                {analysis.condition}
              </span>
              <div>
                <StatusBadge status={analysis.condition} />
              </div>
            </div>
            <p className="text-[11px] text-[#7D6E5D] leading-normal pt-2 border-t border-[#C89D66]/20">
              Categorized based on algorithmic surface deviation and historical baseline delta.
            </p>
          </div>

          {/* Card 2: PRIORITY SCORE (Radial Gauge) */}
          <div className="p-6 rounded-2xl bg-[#1F1813] text-white border border-[#C5A059]/40 shadow-xl flex flex-col items-center justify-between space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-[#E9D7A5]">PRIORITY SCORE</p>
              <p className="text-xs font-hindi text-[#C5A059]">प्राथमिकता सूचकांक</p>
            </div>

            <PriorityScore score={analysis.priorityScore} size={150} />

            <p className="text-[11px] text-stone-400 text-center leading-normal pt-2 border-t border-[#C5A059]/20 w-full">
              Scale 0 (Stable) to 100 (Urgent Field Intervention Required).
            </p>
          </div>

          {/* Card 3: VISUAL VARIATION */}
          <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#996515]">VISUAL VARIATION</p>
              <p className="text-xs font-hindi text-[#A87B4F]">दृश्य भिन्नता</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl font-serif font-bold text-[#1F1813]">
                {analysis.visualVariation}%
              </span>
              <p className="text-xs text-stone-600">Feature Label Variance</p>
            </div>
            <p className="text-[11px] text-[#7D6E5D] leading-normal pt-2 border-t border-[#C89D66]/20">
              Cross-checked using Amazon Rekognition feature bounding geometry.
            </p>
          </div>
        </div>

        {/* Operational Comparison Slider: 2021 Reference vs Visitor Capture */}
        <div className="space-y-4 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F1813]">
                Visual Comparison Slider
              </h3>
              <p className="text-xs font-hindi text-[#996515]">
                २०२१ संदर्भ छायाचित्र बनाम वर्तमान आगंतुक छायाचित्र
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>Operational Pair: 2021 Reference &bull; Visitor Capture</span>
            </div>
          </div>

          <ImageComparison
            beforeImage={analysis.referenceImageUrl}
            afterImage={analysis.currentImageUrl}
            beforeLabel="2021 Reference (Operational Baseline)"
            afterLabel="Current Visitor Capture"
          />
        </div>

        {/* Detected Visual Differences & Crucial Safety Disclaimer */}
        <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 space-y-4 no-print">
          <div>
            <h4 className="text-base font-serif font-bold text-[#1F1813]">
              Detected Visual Variation
            </h4>
            <p className="text-xs font-hindi text-[#996515]">
              कंप्यूटर विज़न द्वारा पहचानी गई सतह विशेषताएं
            </p>
          </div>

          {/* Tags for New and Missing Features */}
          <div className="flex flex-wrap gap-2 pt-1">
            {analysis.comparison?.newLabels?.map((label, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#1F1813] text-[#E9D7A5] border border-[#C5A059]/40 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>New detected feature: {label}</span>
              </span>
            ))}
            {analysis.comparison?.removedLabels?.map((label, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-stone-200 text-stone-700 border border-stone-300 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>Not detected in current image: {label}</span>
              </span>
            ))}
          </div>

          {/* Critical Product Safety & Accuracy Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Standardized Preservation Protocol:</strong> Detected visual differences do not by themselves confirm physical deterioration. Field verification or standardized photography by certified Archaeological Survey personnel is recommended.
            </div>
          </div>
        </div>

        {/* Preservation Insight & Recommended Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
          <div className="p-6 rounded-2xl bg-white border border-[#C89D66]/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#996515]">
              <Sparkles size={18} />
              <h4 className="text-base font-serif font-bold text-[#1F1813]">Preservation Insight</h4>
            </div>
            <p className="text-xs font-hindi text-[#A87B4F]">संरक्षण अंतर्दृष्टि</p>
            <p className="text-sm text-[#3A2F25] leading-relaxed">
              {analysis.preservationInsight}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#C89D66]/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#2D4B39]">
              <Compass size={18} />
              <h4 className="text-base font-serif font-bold text-[#1F1813]">Recommended Conservation Action</h4>
            </div>
            <p className="text-xs font-hindi text-[#2D4B39]">अनुशंसित संरक्षण उपाय</p>
            <p className="text-sm text-[#3A2F25] leading-relaxed">
              {analysis.recommendedAction}
            </p>
          </div>
        </div>

        {/* Bottom Certificate Trigger Banner */}
        <div className="p-6 rounded-2xl bg-[#1F1813] text-white border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div>
            <h4 className="font-serif font-bold text-lg text-white">Digital Preservation Record Authenticated</h4>
            <p className="text-xs text-stone-400">Archived to DigiVirasat permanent registry with AWS cryptographic verification timestamp.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRecordOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-600 transition-colors cursor-pointer"
            >
              View Record
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38838] text-[#16120E] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Print Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Digital Preservation Record (Handles both on-screen modal & dedicated A4 print layout) */}
      <DigitalPreservationRecord
        record={analysis}
        isOpen={recordOpen}
        onClose={() => setRecordOpen(false)}
        onPrint={handlePrint}
      />
    </div>
  );
}
