import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Eye,
  Compass,
  RefreshCw,
  Camera,
  Activity,
  ScanSearch,
} from 'lucide-react';

import { getAnalysis } from '../api/analysisApi';
import { isApiConfigured } from '../api/apiClient';

import ImageComparison from '../components/preservation/ImageComparison';
import PriorityScore from '../components/preservation/PriorityScore';
import StatusBadge from '../components/ui/StatusBadge';
import DigitalPreservationRecord from '../components/preservation/DigitalPreservationRecord';
import { getTemporalEvidence } from '../api/analysisApi';

/* =========================================================
   GEMINI INSIGHT PARSER
========================================================= */

function parsePreservationInsight(text = '') {
  if (!text) return {};

  const headingPattern =
    /(?:^|\s)(OBSERVATION|VERIFICATION FOCUS|FIELD DOCUMENTATION|REMOTE FOLLOW-UP|CONSERVATION NOTE)\s*:/gi;

  const matches = [...text.matchAll(headingPattern)];

  if (!matches.length) {
    return {
      OBSERVATION: text.trim(),
    };
  }

  const sections = {};

  matches.forEach((match, index) => {
    const heading = match[1].toUpperCase();

    const start =
      (match.index ?? 0) + match[0].length;

    const end =
      index + 1 < matches.length
        ? matches[index + 1].index
        : text.length;

    const content = text
      .slice(start, end)
      .replace(/^[\s:]+/, '')
      .trim();

    if (content) {
      sections[heading] = content;
    }
  });

  return sections;
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Analysis() {
  const { analysisId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [temporalEvidence, setTemporalEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recordOpen, setRecordOpen] = useState(false);

  const apiConnected = isApiConfigured();

  const insightSections = parsePreservationInsight(
    analysis?.preservationInsight || ''
  );


  /* =========================================================
     FETCH ANALYSIS
  ========================================================= */

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
        console.log('REFERENCE IMAGE URL:', data?.referenceImageUrl);
console.log('REFERENCE IMAGE KEY:', data?.referenceImageKey);

        setAnalysis(data);
      } else {
        /* -----------------------------------------------
           DEVELOPMENT FALLBACK
        ------------------------------------------------ */

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
            newLabels: [
              'Reflection Diffuse',
              'Perimeter Shadow',
              'Micro Fissure (Optical)',
            ],
            removedLabels: [
              'Direct Specular Glint',
            ],
            changedFeatures: 4,
            totalFeatures: 12,
            visualChangeScore: 53,
          },

          preservationInsight:
            'OBSERVATION: Comparative visual analysis detected variation between the reference baseline and the current observation. VERIFICATION FOCUS: Review whether the observed differences are associated with viewpoint, lighting, framing, occlusion, or other photographic conditions. REMOTE FOLLOW-UP: Capture an additional standardized photograph from a comparable viewpoint and compare the new observation with the existing evidence. CONSERVATION NOTE: Detected visual variation does not by itself establish physical deterioration or structural damage.',

          recommendedAction:
            'Capture an additional standardized observation from a comparable viewpoint and review the result against the existing reference and current observation.',

          createdAt: new Date().toISOString(),

          referenceImageUrl:
            '/images/sheesh-mahal/sheesh-mahal-2021.jpg',

          currentImageUrl:
            '/heritage/amer-fort/sheesh-mahal/sm-01/baseline-2026.jpg',
        });
      }
    } catch (err) {
      console.error('Failed to fetch analysis:', err);

      setError(
        err.message ||
        'Could not retrieve preservation record.'
      );
    } finally {
      setLoading(false);
    }
  };


 useEffect(() => {
  fetchAnalysis();

  if (apiConnected) {
    getTemporalEvidence('amer-fort', 'Sheesh Mahal')
  .then((result) => {
    console.log('TEMPORAL EVIDENCE:', result);

    if (result?.success && Array.isArray(result.evidence)) {
      setTemporalEvidence(result.evidence);
    }
  })
  .catch((error) => {
    console.error('TEMPORAL EVIDENCE ERROR:', error);
  });
  }
}, [analysisId, apiConnected]);


  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center px-6">

        <div className="text-center space-y-5">

          <div className="w-14 h-14 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />

          <div>
            <p className="font-serif text-xl text-[#1F1813]">
              Retrieving Preservation Record
            </p>

            <p className="text-xs text-stone-500 mt-2">
              Querying DigiVirasat analysis registry
            </p>

            <p className="text-[10px] font-mono text-stone-400 mt-1">
              {analysisId}
            </p>
          </div>

        </div>

      </div>
    );
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center px-4">

        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-red-200 text-center shadow-lg">

          <AlertCircle
            size={40}
            className="text-red-600 mx-auto mb-4"
          />

          <h2 className="text-2xl font-serif font-bold text-[#1F1813]">
            Preservation Record Unavailable
          </h2>

          <p className="text-sm text-stone-600 leading-relaxed mt-3">
            {error || 'Record could not be loaded.'}
          </p>

          <div className="flex justify-center gap-3 mt-6">

            <button
              type="button"
              onClick={fetchAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F1813] text-white text-xs font-semibold"
            >
              <RefreshCw size={14} />
              Retry
            </button>

            <Link
              to="/preserve"
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
            >
              Back to Preserve
            </Link>

          </div>

        </div>

      </div>
    );
  }


  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-24">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">


        {/* =====================================================
            TOP NAVIGATION
        ===================================================== */}

        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#C89D66]/30">

          <Link
            to="/preserve"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#996515] hover:text-[#1F1813] transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Preservation Workflow
          </Link>

          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={() => setRecordOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F1813] text-[#FBF8F2] text-xs font-semibold shadow-sm hover:bg-[#2C221A] transition-colors"
            >
              <FileCheck
                size={14}
                className="text-[#C5A059]"
              />

              View Digital Record
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A059] text-[#16120E] text-xs font-bold hover:bg-[#D4AF37] transition-colors"
            >
              <Printer size={14} />

              Print
            </button>

          </div>

        </div>


        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <header className="text-center max-w-3xl mx-auto no-print">

          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#996515] font-bold bg-[#C89D66]/10 px-4 py-2 rounded-full border border-[#C89D66]/30">
            <Activity size={12} />
            Visual Monitoring Output
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1F1813]">
            Preservation Analysis
          </h1>

          <p className="text-xl font-hindi text-[#996515] mt-2">
            संरक्षण विश्लेषण
          </p>

          <p className="text-sm text-[#5C5042] mt-4">
            {analysis.monumentName || 'Amer Fort'}
            <span className="mx-2 text-[#C5A059]">•</span>
            Element {analysis.elementId}
            <span className="mx-2 text-[#C5A059]">•</span>
            {analysis.elementName || 'Heritage Element'}
          </p>

        </header>


        {/* =====================================================
            METRICS
        ===================================================== */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 no-print">


          {/* CONDITION */}

          <div className="rounded-3xl bg-[#F5EFE6] border border-[#C89D66]/30 p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#996515]">
                  Condition
                </p>

                <p className="text-xs font-hindi text-[#A87B4F] mt-1">
                  संरक्षण स्थिति
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center">
                <ScanSearch
                  size={17}
                  className="text-[#996515]"
                />
              </div>

            </div>

            <div className="mt-8">

              <p className="text-4xl font-serif font-bold">
                {analysis.condition}
              </p>

              <div className="mt-3">
                <StatusBadge status={analysis.condition} />
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-[#C89D66]/20">

              <p className="text-[11px] text-[#7D6E5D] leading-relaxed">
                Classification derived from the detected visual variation and monitoring baseline.
              </p>

            </div>

          </div>


          {/* PRIORITY */}

          <div className="rounded-3xl bg-[#1F1813] text-white border border-[#C5A059]/40 p-6 shadow-xl">

            <div className="text-center">

              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#E9D7A5]">
                Priority Score
              </p>

              <p className="text-xs font-hindi text-[#C5A059] mt-1">
                प्राथमिकता सूचकांक
              </p>

            </div>

            <div className="flex justify-center py-5">
              <PriorityScore
                score={analysis.priorityScore}
                size={145}
              />
            </div>

            <div className="pt-4 border-t border-white/10 text-center">

              <p className="text-[11px] text-stone-400 leading-relaxed">
                Composite monitoring score based on observed visual variation and contextual factors.
              </p>

            </div>

          </div>


          {/* VISUAL VARIATION */}

          <div className="rounded-3xl bg-[#F5EFE6] border border-[#C89D66]/30 p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#996515]">
                  Visual Variation
                </p>

                <p className="text-xs font-hindi text-[#A87B4F] mt-1">
                  दृश्य भिन्नता
                </p>

              </div>

              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center">
                <Eye
                  size={17}
                  className="text-[#996515]"
                />
              </div>

            </div>

            <div className="mt-8">

              <p className="text-5xl font-serif font-bold">
                {analysis.visualVariation}%
              </p>

              <p className="text-xs text-stone-600 mt-2">
                Detected feature variation
              </p>

            </div>

            <div className="mt-6 pt-4 border-t border-[#C89D66]/20">

              <p className="text-[11px] text-[#7D6E5D] leading-relaxed">
                Calculated from differences between detected visual labels in the reference and current photographs.
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            IMAGE COMPARISON
        ===================================================== */}

        <section className="no-print">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">

            <div>

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#996515] font-bold">
                Evidence Comparison
              </p>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
                Reference vs Current Observation
              </h2>

              <p className="text-sm font-hindi text-[#996515] mt-1">
                संदर्भ छायाचित्र बनाम वर्तमान अवलोकन
              </p>

            </div>

            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-stone-500">

              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />

              <span>
                {analysis?.referenceYear || 'Reference'} → Current Observation
              </span>

            </div>

          </div>
<ImageComparison
  beforeImage={
    temporalEvidence.find(
      (item) => Number(item.year) === 2021
    )?.imageUrl
  }
  afterImage={analysis.currentImageUrl}
  beforeLabel="2021 Active Reference"
  afterLabel="Today Observation"
/>

        </section>


        {/* =====================================================
            DETECTED DIFFERENCES
        ===================================================== */}

        <section className="rounded-3xl bg-white border border-[#C89D66]/30 shadow-sm overflow-hidden no-print">

          <div className="p-6 sm:p-7">

            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 flex items-center justify-center flex-shrink-0">
                <ScanSearch
                  size={19}
                  className="text-[#996515]"
                />
              </div>

              <div>

                <h3 className="text-xl font-serif font-bold">
                  Detected Visual Variation
                </h3>

                <p className="text-xs font-hindi text-[#996515] mt-1">
                  कंप्यूटर विज़न द्वारा पहचाने गए दृश्य अंतर
                </p>

              </div>

            </div>


            <div className="mt-6 flex flex-wrap gap-2">

              {analysis.comparison?.newLabels?.map((label, index) => (
                <span
                  key={`new-${index}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-medium bg-[#1F1813] text-[#E9D7A5] border border-[#C5A059]/40"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  New: {label}
                </span>
              ))}

              {analysis.comparison?.removedLabels?.map((label, index) => (
                <span
                  key={`removed-${index}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                  Not detected: {label}
                </span>
              ))}

            </div>

          </div>


          {/* SAFETY NOTE */}

          <div className="px-6 sm:px-7 py-5 bg-[#FFF9EA] border-t border-[#D7B96E]/40">

            <div className="flex items-start gap-3">

              <ShieldAlert
                size={18}
                className="text-[#996515] flex-shrink-0 mt-0.5"
              />

              <p className="text-xs text-[#6B512E] leading-relaxed">

                <strong className="text-[#5A421F]">
                  Preservation protocol:
                </strong>{' '}

                Detected visual differences do not by themselves confirm physical deterioration.
                Additional standardized observations may be requested when the photographic evidence is inconclusive.

              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            PRESERVATION INTELLIGENCE
        ===================================================== */}

        <section className="space-y-6 no-print">


          {/* SECTION HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 text-[#996515] mb-2">

                <Sparkles size={16} />

                <span className="text-[10px] uppercase tracking-[0.22em] font-bold">
                  Preservation Intelligence
                </span>

              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Observation & Follow-up
              </h2>

              <p className="text-sm font-hindi text-[#996515] mt-1">
                अवलोकन एवं अनुवर्ती निगरानी
              </p>

            </div>

            <div className="text-[10px] font-mono text-stone-500">
              Evidence-based monitoring output
            </div>

          </div>


          {/* ===================================================
              01 OBSERVATION
          =================================================== */}

          {insightSections.OBSERVATION && (

            <article className="rounded-3xl bg-[#1F1813] text-white border border-[#C5A059]/40 shadow-xl overflow-hidden">

              <div className="p-7 sm:p-9">

                <div className="flex items-start gap-5">

                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center flex-shrink-0">

                    <Eye
                      size={20}
                      className="text-[#E9D7A5]"
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#C5A059]">
                        01
                      </span>

                      <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#E9D7A5]">
                        Observation
                      </span>

                    </div>

                    <h3 className="text-2xl font-serif font-bold mt-2">
                      Detected visual variation
                    </h3>

                    <p className="text-xs font-hindi text-[#C5A059] mt-1">
                      दृश्य अवलोकन
                    </p>

                    <p className="mt-5 text-sm sm:text-[15px] leading-7 text-[#E6D9CA]">
                      {insightSections.OBSERVATION}
                    </p>

                  </div>

                </div>

              </div>


              {/* METADATA */}

              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10">

                <div className="p-5">

                  <p className="text-[9px] uppercase tracking-widest text-stone-500">
                    Variation
                  </p>

                  <p className="text-xl font-serif font-bold text-[#E9D7A5] mt-1">
                    {analysis.visualVariation}%
                  </p>

                </div>

                <div className="p-5 border-l border-white/10">

                  <p className="text-[9px] uppercase tracking-widest text-stone-500">
                    Changed
                  </p>

                  <p className="text-xl font-serif font-bold text-[#E9D7A5] mt-1">
                    {analysis.comparison?.changedFeatures ?? 0}
                  </p>

                </div>

                <div className="p-5 border-l border-white/10">

                  <p className="text-[9px] uppercase tracking-widest text-stone-500">
                    Compared
                  </p>

                  <p className="text-xl font-serif font-bold text-[#E9D7A5] mt-1">
                    {analysis.comparison?.totalFeatures ?? 0}
                  </p>

                </div>

                <div className="p-5 border-l border-white/10">

                  <p className="text-[9px] uppercase tracking-widest text-stone-500">
                    Status
                  </p>

                  <p className="text-xl font-serif font-bold text-[#E9D7A5] mt-1">
                    {analysis.condition}
                  </p>

                </div>

              </div>

            </article>

          )}


          {/* ===================================================
              02 + 03
          =================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            {/* VERIFICATION */}

            {insightSections['VERIFICATION FOCUS'] && (

              <article className="rounded-3xl bg-white border border-[#C89D66]/30 shadow-sm p-7">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 flex items-center justify-center flex-shrink-0">

                    <Compass
                      size={18}
                      className="text-[#996515]"
                    />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] font-mono text-[#C5A059]">
                        02
                      </span>

                      <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#996515]">
                        Verification Focus
                      </span>

                    </div>

                    <p className="text-xs font-hindi text-[#A87B4F] mt-1">
                      सत्यापन केंद्र
                    </p>

                    <p className="mt-5 text-sm text-[#3A2F25] leading-7">
                      {insightSections['VERIFICATION FOCUS']}
                    </p>

                  </div>

                </div>

              </article>

            )}


            {/* REMOTE FOLLOW-UP */}

            {(insightSections['REMOTE FOLLOW-UP'] ||
              insightSections['FIELD DOCUMENTATION']) && (

              <article className="rounded-3xl bg-[#F4F8F3] border border-[#A8BDAE]/50 shadow-sm p-7">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-2xl bg-[#2D4B39]/10 border border-[#2D4B39]/20 flex items-center justify-center flex-shrink-0">

                    <Camera
                      size={18}
                      className="text-[#2D4B39]"
                    />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] font-mono text-[#2D4B39]">
                        03
                      </span>

                      <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#2D4B39]">
                        Remote Follow-up
                      </span>

                    </div>

                    <p className="text-xs font-hindi text-[#50715A] mt-1">
                      दूरस्थ अनुवर्ती अवलोकन
                    </p>

                    <p className="mt-5 text-sm text-[#3A2F25] leading-7">
                      {insightSections['REMOTE FOLLOW-UP'] ||
                        insightSections['FIELD DOCUMENTATION']}
                    </p>

                  </div>

                </div>

              </article>

            )}

          </div>


          {/* ===================================================
              04 CONSERVATION NOTE
          =================================================== */}

          {insightSections['CONSERVATION NOTE'] && (

            <article className="rounded-3xl bg-[#FFF9EA] border border-[#D7B96E]/50 p-7">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center flex-shrink-0">

                  <ShieldAlert
                    size={18}
                    className="text-[#996515]"
                  />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-[10px] font-mono text-[#996515]">
                      04
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#996515]">
                      Conservation Note
                    </span>

                  </div>

                  <p className="text-xs font-hindi text-[#A87B4F] mt-1">
                    संरक्षण टिप्पणी
                  </p>

                  <p className="mt-5 text-sm text-[#5C4630] leading-7">
                    {insightSections['CONSERVATION NOTE']}
                  </p>

                </div>

              </div>

            </article>

          )}


          {/* ===================================================
              RECOMMENDED ACTION
          =================================================== */}

          <article className="rounded-3xl bg-white border border-[#2D4B39]/25 shadow-md overflow-hidden">

            <div className="px-7 sm:px-9 py-6 bg-[#2D4B39] text-white">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">

                  <CheckCircle2
                    size={20}
                    className="text-[#D8E5DA]"
                  />

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#D8E5DA] font-bold">
                    Recommended Next Step
                  </p>

                  <h3 className="text-2xl font-serif font-bold mt-1">
                    Conservation Action
                  </h3>

                  <p className="text-xs font-hindi text-[#C8D8CB] mt-1">
                    अनुशंसित संरक्षण उपाय
                  </p>

                </div>

              </div>

            </div>


            <div className="p-7 sm:p-9">

              <div className="flex items-start gap-4">

                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] mt-2 flex-shrink-0" />

                <p className="text-sm sm:text-[15px] text-[#3A2F25] leading-7">
                  {analysis.recommendedAction}
                </p>

              </div>


              <div className="mt-7 pt-5 border-t border-[#C89D66]/20 flex flex-wrap gap-2">

                <span className="px-3 py-1.5 rounded-full bg-[#F5EFE6] border border-[#C89D66]/30 text-[10px] font-semibold text-[#5C5042]">
                  Remote monitoring
                </span>

                <span className="px-3 py-1.5 rounded-full bg-[#F5EFE6] border border-[#C89D66]/30 text-[10px] font-semibold text-[#5C5042]">
                  Comparable viewpoint
                </span>

                <span className="px-3 py-1.5 rounded-full bg-[#F5EFE6] border border-[#C89D66]/30 text-[10px] font-semibold text-[#5C5042]">
                  Expert review when required
                </span>

              </div>

            </div>

          </article>

        </section>


        {/* =====================================================
            DIGITAL RECORD
        ===================================================== */}

        <section className="rounded-3xl bg-[#1F1813] text-white border border-[#C5A059]/40 shadow-xl p-7 sm:p-8 no-print">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            <div>

              <div className="flex items-center gap-2">

                <FileCheck
                  size={18}
                  className="text-[#C5A059]"
                />

                <h3 className="text-xl font-serif font-bold">
                  Digital Preservation Record
                </h3>

              </div>

              <p className="text-xs text-stone-400 mt-2 max-w-2xl leading-relaxed">
                This analysis has been recorded with its observation timestamp,
                image references and automated comparison results in the DigiVirasat registry.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => setRecordOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-600 transition-colors"
              >
                View Record
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38838] text-[#16120E] text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Printer size={14} />
                Print Record
              </button>

            </div>

          </div>

        </section>

      </div>


      {/* =======================================================
          DIGITAL PRESERVATION RECORD MODAL
      ======================================================= */}

      <DigitalPreservationRecord
        record={analysis}
        isOpen={recordOpen}
        onClose={() => setRecordOpen(false)}
        onPrint={handlePrint}
      />

    </div>
  );
}