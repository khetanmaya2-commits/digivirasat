import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { ShieldCheck, AlertTriangle, ArrowRight, Eye, RefreshCw, Layers, Database, Compass, CheckCircle2, ShieldAlert, Sparkles, Activity, Clock, X, Info } from 'lucide-react';
import { getDashboardSummary, getDashboardAnalyses, } from '../api/dashboardApi';
import { getTemporalAnalyses, getTemporalEvidence, runTemporalAnalysis } from '../api/analysisApi';
import { PRESERVATION_ELEMENTS } from '../data/elements';
import { PRESERVATION_REFERENCES } from '../data/preservationReferences';
import StatusBadge from '../components/ui/StatusBadge';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import HindiHeading from '../components/ui/HindiHeading';
import VisualTimeline from '../components/preservation/VisualTimeline';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [temporalAnalyses, setTemporalAnalyses] = useState([]);
  const [latestAvailableYear, setLatestAvailableYear] = useState(null);
  const [overallTemporalSummary, setOverallTemporalSummary] = useState(null);
  const [runningTemporalAnalysis, setRunningTemporalAnalysis] = useState(false);
  const [temporalAnalysisReady, setTemporalAnalysisReady] = useState(
    () => sessionStorage.getItem('digivirasat_temporal_analysis_ready') === 'true'
  );

  console.log(
    'TEMPORAL UI STATE:',
    {
      temporalAnalysisReady,
      overallTemporalSummary,
      temporalAnalyses,
    }
  );

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTemporalAnalysis, setSelectedTemporalAnalysis] = useState(null);
  const [temporalEvidence, setTemporalEvidence] = useState([]);
  const [temporalDetailLoading, setTemporalDetailLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const handleSignOut = async () => {
  try {
    // Clear temporal analysis for this
    // conservation-team session.
    sessionStorage.removeItem(
      'digivirasat_temporal_analysis_result'
    );

    sessionStorage.removeItem(
      'digivirasat_temporal_analysis_ready'
    );

    await signOut();

    window.location.href =
      '/dashboard/login';

  } catch (error) {
    console.error(
      'Sign out failed:',
      error
    );
  }
};

  const loadData = async () => {
  setLoading(true);

  try {
    const [
      sumRes,
      anaRes,
      temporalRes,
      evidenceRes,
    ] = await Promise.all([
      getDashboardSummary(),
      getDashboardAnalyses(),
      getTemporalAnalyses(),
      getTemporalEvidence(
        'amer-fort',
        'Sheesh Mahal'
      ),
    ]);

    // -----------------------------
    // Dashboard summary
    // -----------------------------
    setSummary(sumRes);

    // -----------------------------
    // Normal observation analyses
    // Exclude temporal records from
    // the normal conservation table.
    // -----------------------------
    const normalAnalyses = (
      anaRes.records || []
    ).filter(
      (analysis) =>
        analysis.analysisType !==
          'TEMPORAL_COMPARISON' &&
        analysis.analysisType !==
          'TEMPORAL_SUMMARY'
    );

    setAnalyses(normalAnalyses);

    // -----------------------------
    // Latest available evidence year
    // -----------------------------
    setLatestAvailableYear(
      temporalRes.latestAvailableYear || null
    );

    // =================================================
    // TEMPORAL ANALYSIS SESSION STATE
    // =================================================

    const savedSessionAnalysis =
      sessionStorage.getItem(
        'digivirasat_temporal_analysis_result'
      );

    if (savedSessionAnalysis) {
      try {
        const sessionResult = JSON.parse(
          savedSessionAnalysis
        );

        // Restore temporal comparison results
        // after browser refresh.
        setTemporalAnalyses(
          sessionResult.analyses || []
        );

        // Restore Gemini summary.
        setOverallTemporalSummary(
          sessionResult.overallTemporalSummary ||
            null
        );

        setTemporalAnalysisReady(true);

      } catch (error) {
        console.error(
          'Failed to restore temporal analysis session:',
          error
        );

        sessionStorage.removeItem(
          'digivirasat_temporal_analysis_result'
        );

        sessionStorage.removeItem(
          'digivirasat_temporal_analysis_ready'
        );

        setTemporalAnalyses([]);
        setOverallTemporalSummary(null);
        setTemporalAnalysisReady(false);
      }

    } else {
      // ---------------------------------------------
      // No analysis has been run during this session.
      // Do NOT display old DynamoDB temporal results.
      // ---------------------------------------------
      setTemporalAnalyses([]);
      setOverallTemporalSummary(null);
      setTemporalAnalysisReady(false);
    }

  } catch (err) {
    console.error(
      'Failed to load dashboard:',
      err
    );
  } finally {
    setLoading(false);
  }
};

 const handleRunTemporalAnalysis = async () => {
  setRunningTemporalAnalysis(true);

  try {
    // ---------------------------------------------
    // Run fresh temporal analysis
    // ---------------------------------------------
    const result = await runTemporalAnalysis({
      monumentId: 'amer-fort',
      evidenceScope: 'Sheesh Mahal',
    });

    console.log(
      'Fresh temporal analysis result:',
      result
    );

    // ---------------------------------------------
    // Retrieve the newly saved analysis records
    // ---------------------------------------------
    const temporalRes =
      await getTemporalAnalyses();

    console.log(
      'Updated temporal analysis records:',
      temporalRes
    );

    // ---------------------------------------------
    // Build the session result
    // ---------------------------------------------
    const sessionTemporalResult = {
      analyses:
        temporalRes.analyses || [],

      overallTemporalSummary:
        temporalRes.overallTemporalSummary ||
        result.overallTemporalSummary ||
        null,
    };

    // ---------------------------------------------
    // Persist result for browser refresh
    // ---------------------------------------------
    sessionStorage.setItem(
      'digivirasat_temporal_analysis_result',
      JSON.stringify(
        sessionTemporalResult
      )
    );

    sessionStorage.setItem(
      'digivirasat_temporal_analysis_ready',
      'true'
    );

    // ---------------------------------------------
    // Update React state
    // ---------------------------------------------
    setTemporalAnalyses(
      sessionTemporalResult.analyses
    );

    setLatestAvailableYear(
      temporalRes.latestAvailableYear ||
        null
    );

    setOverallTemporalSummary(
      sessionTemporalResult.overallTemporalSummary
    );

    setTemporalAnalysisReady(true);

    // ---------------------------------------------
    // Success message
    // ---------------------------------------------
    alert(
      `Temporal analysis completed successfully across ${
        result.pairCount || 0
      } evidence periods.`
    );

  } catch (error) {
    console.error(
      'Temporal analysis failed:',
      error
    );

    alert(
      error?.message ||
        'Temporal analysis could not be completed. Please try again.'
    );

  } finally {
    setRunningTemporalAnalysis(false);
  }
};  

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnalyses = activeFilter === 'All'
    ? analyses
    : analyses.filter(a => a.condition.toLowerCase() === activeFilter.toLowerCase());

  const totalPages = Math.ceil(
    filteredAnalyses.length / recordsPerPage
  );

  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Calculate health breakdown from all analysis records
  // shown in the dashboard table.

  const health = {
    stable: analyses.filter((analysis) => {
      const condition = String(analysis.condition || '')
        .trim()
        .toLowerCase();

      return condition === 'stable' || condition === 'low';
    }).length,

    moderate: analyses.filter((analysis) => {
      const condition = String(analysis.condition || '')
        .trim()
        .toLowerCase();

      return condition === 'moderate';
    }).length,

    highPriority: analyses.filter((analysis) => {
      const condition = String(analysis.condition || '')
        .trim()
        .toLowerCase();

      return (
        condition === 'high' ||
        condition === 'high priority' ||
        condition === 'critical'
      );
    }).length,
  };

  const totalHealthElements =
    health.stable +
    health.moderate +
    health.highPriority;

  const stablePercentage =
    totalHealthElements > 0
      ? Math.round((health.stable / totalHealthElements) * 100)
      : 0;

  const moderatePercentage =
    totalHealthElements > 0
      ? Math.round((health.moderate / totalHealthElements) * 100)
      : 0;

  const highPriorityPercentage =
    totalHealthElements > 0
      ? Math.round((health.highPriority / totalHealthElements) * 100)
      : 0;

  const openTemporalDetail = async (analysis) => {
    setSelectedTemporalAnalysis(analysis);
    setTemporalDetailLoading(true);

    try {
      const evidenceResponse = await getTemporalEvidence(
        analysis.monumentId || 'amer-fort',
        analysis.evidenceScope || 'Sheesh Mahal'
      );

      setTemporalEvidence(evidenceResponse.evidence || []);
    } catch (error) {
      console.error('Failed to load temporal evidence:', error);
      setTemporalEvidence([]);
    } finally {
      setTemporalDetailLoading(false);
    }
  };

  const closeTemporalDetail = () => {
    setSelectedTemporalAnalysis(null);
    setTemporalEvidence([]);
  };

  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header & Role Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C89D66]/30 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#1F1813] text-[#E9D7A5] border border-[#C5A059]/40 mb-2">
              <ShieldCheck size={13} className="text-[#C5A059]" />
              <span>Conservation Command Center &bull; प्रशासनिक नियंत्रण</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1813]">
              Conservation Command Center
            </h1>
            <p className="text-lg sm:text-xl font-hindi text-[#996515]">
              विरासत संरक्षण नियंत्रण केंद्र
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-[#E9D7A5] border border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              <Clock size={13} />
              <span>View Historical Context</span>
            </button>


            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 border border-stone-600 transition-colors cursor-pointer"
            >
              Sign Out
            </button>


          </div>
        </div>

        {/* Top 4 KPI Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 uppercase">
              <span>Total Elements</span>
              <Layers size={16} className="text-[#996515]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#1F1813] mt-2">
              {summary?.totalElements ?? 0}
            </p>
            <p className="text-[11px] text-[#7D6E5D] mt-1">Live Heritage elements</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 uppercase">
              <span>Total Analyses</span>
              <Database size={16} className="text-[#996515]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#1F1813] mt-2">
              {summary?.totalAnalyses ?? 0}
            </p>
            <p className="text-[11px] text-[#7D6E5D] mt-1">Live DynamoDB records</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 uppercase">
              <span>Moderate Attention</span>
              <Activity size={16} className="text-[#996515]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#1F1813] mt-2">
              {summary?.healthDistribution?.moderate ?? 0}
            </p>
            <p className="text-[11px] text-[#7D6E5D] mt-1">Inspection Schedules</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1F1813] text-white border border-[#C5A059]/40 shadow-lg">
            <div className="flex items-center justify-between text-xs font-medium text-[#E9D7A5] uppercase">
              <span>High Priority Elements</span>
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#E9D7A5] mt-2">
              {summary?.activeAlerts ?? 0}
            </p>
            <p className="text-[11px] text-stone-300 mt-1">Latest high-priority status</p>
          </div>
        </div>

        {/* Temporal Evidence & Change History */}

        <div
          id="temporal-analysis-section"
          className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C89D66]/30 shadow-sm space-y-6 scroll-mt-28"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#996515]">
                <Clock size={13} />
                Temporal Evidence
              </div>

              <h2 className="text-2xl font-serif font-bold text-[#1F1813] mt-1">
                Multi-Year Heritage Change History
              </h2>

              <p className="text-xs font-hindi text-[#996515] mt-1">
                बहुवर्षीय विरासत दृश्य परिवर्तन इतिहास
              </p>

              <p className="text-sm text-stone-600 mt-3 max-w-2xl leading-relaxed">
                Automated comparisons across available photographic evidence help
                identify visual variation over time for remote conservation review.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-stretch gap-2">
              <button
                type="button"
                onClick={handleRunTemporalAnalysis}
                disabled={runningTemporalAnalysis}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={14}
                  className={runningTemporalAnalysis ? 'animate-spin' : ''}
                />

                <span>
                  {runningTemporalAnalysis
                    ? 'Running Analysis...'
                    : temporalAnalysisReady
                      ? 'Refresh Temporal Analysis'
                      : 'Run Temporal Evidence Analysis'}
                </span>
              </button>

              <div className="px-4 py-3 rounded-2xl bg-[#1F1813] border border-[#C5A059]/40">
                <p className="text-[10px] uppercase tracking-widest text-[#E9D7A5]">
                  Latest Available Evidence
                </p>

                <p className="text-2xl font-serif font-bold text-[#E9D7A5] mt-1">
                  {latestAvailableYear || '—'}
                </p>
              </div>
            </div>
          </div>

          {!temporalAnalysisReady ? (
            <div className="p-8 rounded-3xl bg-[#FBF8F2] border border-[#C89D66]/30 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1F1813] flex items-center justify-center">
                <Clock size={24} className="text-[#E9D7A5]" />
              </div>

              <h3 className="text-xl font-serif font-bold text-[#1F1813] mt-5">
                Temporal Analysis Required
              </h3>

              <p className="text-xs font-hindi text-[#996515] mt-1">
                बहुवर्षीय विश्लेषण आवश्यक है
              </p>

              <p className="text-sm text-stone-600 max-w-xl mx-auto mt-4 leading-relaxed">
                Run the temporal evidence analysis to compare the currently
                available photographic records and generate the latest
                multi-year heritage history.
              </p>

              <button
                type="button"
                onClick={handleRunTemporalAnalysis}
                disabled={runningTemporalAnalysis}
                className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={15}
                  className={runningTemporalAnalysis ? 'animate-spin' : ''}
                />

                {runningTemporalAnalysis
                  ? 'Running Temporal Analysis...'
                  : 'Run Temporal Evidence Analysis'}
              </button>

              <p className="text-[10px] text-stone-400 mt-3">
                Latest available evidence: {latestAvailableYear || 'Checking...'}
              </p>

            </div>
          ) : (
            <>


              {/* Evidence Coverage */}
              <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Evidence Coverage
                  </span>

                  <span className="text-[10px] text-stone-500">
                    {temporalAnalyses.length} temporal comparisons
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    ...new Set(
                      temporalAnalyses.flatMap((item) => [
                        item.fromYear,
                        item.toYear,
                      ])
                    ),
                  ]
                    .filter(Boolean)
                    .sort((a, b) => a - b)
                    .map((year, index, years) => (
                      <React.Fragment key={year}>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${year === latestAvailableYear
                            ? 'bg-[#1F1813] text-[#E9D7A5] border-[#C5A059]'
                            : 'bg-white text-[#7D5220] border-[#C89D66]/30'
                            }`}
                        >
                          {year}
                        </span>

                        {index < years.length - 1 && (
                          <ArrowRight
                            size={13}
                            className="text-[#C5A059]"
                          />
                        )}
                      </React.Fragment>
                    ))}
                </div>

                <p className="text-[11px] text-stone-500 mt-3">
                  The latest year is determined from available evidence rather than being
                  hardcoded as a fixed "current" year.
                </p>
              </div>
              {/* Overall Temporal Summary */}
              {overallTemporalSummary && (
                <div className="mb-8 p-6 md:p-8 rounded-3xl bg-[#1F1813] border border-[#C5A059]/30 shadow-lg">

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/25 flex items-center justify-center">
                      <Activity
                        size={20}
                        className="text-[#E9D7A5]"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg md:text-xl font-serif font-bold text-[#F5EBDD]">
                          Overall Temporal Summary
                        </h3>

                        <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/25 text-[9px] uppercase tracking-wider font-bold text-[#E9D7A5]">
                          {overallTemporalSummary
                            ? `${temporalAnalyses[0]?.fromYear || ''}–${temporalAnalyses[temporalAnalyses.length - 1]?.toYear || ''}`
                            : ''}
                        </span>
                      </div>

                      <p className="text-[11px] font-hindi text-[#C5A059] mt-1">
                        समग्र बहुवर्षीय विरासत अवलोकन
                      </p>

                      <div className="mt-5 space-y-5">
                        {overallTemporalSummary
                          .split(/\n\s*\n/)
                          .map((section, index) => {
                            const [heading, ...content] =
                              section.split(':');

                            return (
                              <div key={index}>
                                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#C5A059]">
                                  {heading}
                                </p>

                                <p className="text-sm leading-7 text-[#E8DED2] mt-1.5">
                                  {content.join(':').trim()}
                                </p>
                              </div>
                            );
                          })}
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#C5A059]/15">
                        <p className="text-[10px] leading-relaxed text-[#B9AA9A]">
                          This summary describes differences in detected visual
                          categories across the available photographic record.
                          It does not establish physical deterioration, damage,
                          or structural change.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pairwise Temporal Analyses */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#1F1813]">
                      Detected Visual Variation by Period
                    </h3>

                    <p className="text-[11px] text-stone-500 mt-1">
                      Changes in automated visual classification between adjacent records.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {temporalAnalyses.map((item) => (
                    <button
                      key={item.analysisId}
                      type="button"
                      onClick={() => openTemporalDetail(item)}
                      className="w-full text-left p-4 rounded-2xl bg-[#FBF8F2] border border-[#C89D66]/25 hover:border-[#C5A059] hover:shadow-md transition-all duration-300 cursor-pointer">

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1F1813]">
                          {item.fromYear} → {item.toYear}
                        </span>

                        <span className="text-lg font-serif font-bold text-[#996515]">
                          {item.visualChangeScore}%
                        </span>
                      </div>

                      <p className="text-[10px] uppercase tracking-wider text-stone-500 mt-1">
                        Detected visual variation
                      </p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-stone-400 mb-1.5">
                          <span>Variation indicator</span>
                          <span>Category-level</span>
                        </div>

                        <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#C5A059]"
                            style={{
                              width: `${Math.min(
                                Math.max(item.visualChangeScore || 0, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[11px]">
                        <span className="text-stone-500">
                          Changed features
                        </span>

                        <span className="font-bold text-[#1F1813]">
                          {item.changedFeatures ?? 0} / {item.totalFeatures ?? 0}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-200">
                        <p className="text-[10px] leading-relaxed text-stone-500">
                          This percentage represents differences in detected visual
                          categories. It does not represent percentage physical damage.
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Future Evidence Notice */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30">
                <Info
                  size={17}
                  className="text-[#996515] shrink-0 mt-0.5"
                />

                <div className="text-[11px] leading-relaxed text-[#7D5220]">
                  <strong className="text-[#1F1813]">
                    Evidence evolves over time.
                  </strong>{' '}
                  {latestAvailableYear
                    ? `The latest available photographic evidence is currently ${latestAvailableYear}.`
                    : 'No temporal evidence is currently available.'}{' '}
                  When a new validated observation becomes available, it can become the
                  next temporal comparison without requiring a code or year-specific
                  update to the system.
                </div>
              </div>
            </>
          )}
        </div>



        {/* Prominent Standardized Conservation Advisory Notice */}
        <div className="p-4 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-start gap-3 text-xs text-[#7D5220]">
          <ShieldAlert size={20} className="text-[#996515] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-[#1F1813]">Conservation Advisory &bull; क्षेत्र सत्यापन अनुशंसित:</strong> Computer vision indicators highlight micro-surface deviations between photographic exposures. Ground inspection, photometric calibration, and microscopic mortar assessment are mandatory prior to any physical preservation work.
          </div>
        </div>

        {/* Main Content Grid: Recent Analyses Table + Element Health Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table of Recent Analyses (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#1F1813]">
                  Recent Preservation Analyses
                </h3>
                <p className="text-xs font-hindi text-[#996515]">हाल के संरक्षण विश्लेषण (संदर्भ छायाचित्र बनाम आगंतुक अवलोकन)</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs">
                {['All', 'Stable', 'Moderate', 'High Priority'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setActiveFilter(f);
                      setCurrentPage(1);


                    }}

                    className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${activeFilter === f
                      ? 'bg-[#1F1813] text-white'
                      : 'bg-[#F5EFE6] text-stone-600 hover:bg-[#EAE1D3]'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#C89D66]/30 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFE6] text-[#7D5220] uppercase font-semibold border-b border-[#C89D66]/20">
                  <tr>
                    <th className="py-3 px-4">Element</th>
                    <th className="py-3 px-4">Operational Pair</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Visual Var.</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedAnalyses.map((record) => (
                    <tr key={record.analysisId} className="hover:bg-[#FBF8F2] transition-colors">
                      <td className="py-3 px-4 font-medium text-[#1F1813]">
                        <span className="font-mono text-[11px] font-bold block text-[#996515]">{record.elementId}</span>
                        <span> {PRESERVATION_ELEMENTS.find(
                          (element) => element.id === record.elementId
                        )?.name || record.elementId}</span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-mono text-stone-600">
                        <span className="text-[#996515] font-semibold"> {record.referenceYear || 'Reference'} Ref</span> vs <span className="text-amber-800 font-semibold">Current Capture</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={record.condition} />
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-sm">
                        {record.priorityScore} / 100
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {record.visualVariation}%
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {record.date
                          ? new Date(record.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewAnalysis(record)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#996515] hover:text-[#1F1813] transition-colors"
                        >
                          <span>View Analysis</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#FBF8F2] border-t border-[#C89D66]/20">

                  <p className="text-[11px] text-stone-500">
                    Showing{' '}
                    <span className="font-semibold text-[#1F1813]">
                      {(currentPage - 1) * recordsPerPage + 1}
                    </span>
                    {' '}–{' '}
                    <span className="font-semibold text-[#1F1813]">
                      {Math.min(
                        currentPage * recordsPerPage,
                        filteredAnalyses.length
                      )}
                    </span>
                    {' '}of{' '}
                    <span className="font-semibold text-[#1F1813]">
                      {filteredAnalyses.length}
                    </span>
                    {' '}analyses
                  </p>

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(page - 1, 1))
                      }
                      className="px-3 py-1.5 rounded-lg border border-[#C89D66]/30 bg-white text-xs font-semibold text-[#7D5220] hover:bg-[#F5EFE6] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-8 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${currentPage === page
                          ? 'bg-[#1F1813] text-[#E9D7A5]'
                          : 'bg-white border border-[#C89D66]/30 text-[#7D5220] hover:bg-[#F5EFE6]'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(page + 1, totalPages)
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-[#C89D66]/30 bg-white text-xs font-semibold text-[#7D5220] hover:bg-[#F5EFE6] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Element Health & Site Overview (1 col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#1F1813]">
                Element Health Breakdown
              </h3>
              <p className="text-xs font-hindi text-[#996515]">तत्व स्वास्थ्य स्थिति</p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2D4B39]" />
                    <span>Stable Condition</span>
                  </span>
                  <span className="font-bold">{summary?.healthDistribution?.stable ?? 0} Elements</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2D4B39] h-2 rounded-full" style={{ width: `${stablePercentage}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                    <span>Moderate Attention</span>
                  </span>
                  <span className="font-bold"> {summary?.healthDistribution?.moderate ?? 0} Elements</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C5A059] h-2 rounded-full" style={{ width: `${moderatePercentage}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A64B2A]" />
                    <span>High Priority (SM-03)</span>
                  </span>
                  <span className="font-bold"> {summary?.healthDistribution?.highPriority ?? 0} Elements</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#A64B2A] h-2 rounded-full" style={{ width: `${highPriorityPercentage}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Link Card to Demo Element SM-01 */}
            <div className="p-6 rounded-2xl bg-[#1F1813] text-white border border-[#C5A059]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#E9D7A5] font-mono">Primary Demo</span>
                <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#E9D7A5] text-[10px]">2016 Reference Active</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-white">East Mirror Wall (SM-01)</h4>
              <p className="text-xs text-stone-300">Sheesh Mahal &bull; 1950 &bull; 2009 &bull; 2016 Baseline</p>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  to="/monument/amer-fort/element/SM-01"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38838] text-[#16120E] text-xs font-bold transition-colors"
                >
                  <span>Element Dossier</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-[#E9D7A5] text-xs font-semibold border border-stone-600 cursor-pointer"
                >
                  History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Context Modal for Conservation Team */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowHistoryModal(false);
          }}
        >
          <div className="relative w-full max-w-5xl bg-[#FBF8F2] text-[#1F1813] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden my-auto p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-[#C89D66]/30 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#996515] font-bold">
                  Historical Photographic Evidence
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1F1813]">
                  Sheesh Mahal Multi-Decade Timeline
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <VisualTimeline elementId="SM-01" showHeader={false} />

            <div className="text-right pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-6 py-2 rounded-xl bg-[#1F1813] text-white text-xs font-bold"
              >
                Close Context Viewer
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTemporalAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#FBF8F2] rounded-3xl shadow-2xl border border-[#C89D66]/40">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#FBF8F2]/95 backdrop-blur border-b border-[#C89D66]/20 px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#996515]">
                  <Clock size={13} />
                  Temporal Comparison
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813] mt-1">
                  {selectedTemporalAnalysis.fromYear}
                  {' → '}
                  {selectedTemporalAnalysis.toYear}
                </h2>

                <p className="text-xs font-hindi text-[#996515] mt-1">
                  बहुवर्षीय दृश्य तुलना
                </p>
              </div>

              <button
                type="button"
                onClick={closeTemporalDetail}
                className="p-2 rounded-full hover:bg-stone-200 transition"
                aria-label="Close temporal comparison"
              >
                <X size={20} className="text-stone-600" />
              </button>
            </div>

            <div className="p-6 space-y-7">

              {/* Variation summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">
                    Detected visual variation
                  </p>
                  <p className="text-3xl font-serif font-bold text-[#996515] mt-1">
                    {selectedTemporalAnalysis.visualChangeScore ?? 0}%
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">
                    Changed features
                  </p>
                  <p className="text-3xl font-serif font-bold text-[#1F1813] mt-1">
                    {selectedTemporalAnalysis.changedFeatures ?? 0}
                    <span className="text-base text-stone-400">
                      {' / '}
                      {selectedTemporalAnalysis.totalFeatures ?? 0}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">
                    Comparison scope
                  </p>
                  <p className="text-lg font-serif font-bold text-[#1F1813] mt-2">
                    {selectedTemporalAnalysis.evidenceScope || 'Sheesh Mahal'}
                  </p>
                </div>

              </div>

              {/* Photographs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#1F1813]">
                      Photographic Evidence
                    </h3>

                    <p className="text-xs text-stone-500 mt-1">
                      Source photographs used for this temporal comparison.
                    </p>
                  </div>
                </div>

                {temporalDetailLoading ? (
                  <div className="p-10 text-center rounded-2xl bg-white border border-[#C89D66]/20">
                    <RefreshCw
                      size={24}
                      className="mx-auto animate-spin text-[#996515]"
                    />
                    <p className="text-sm text-stone-500 mt-3">
                      Loading evidence...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {[
                      {
                        year: selectedTemporalAnalysis.fromYear,
                        evidenceId: selectedTemporalAnalysis.fromEvidenceId,
                        label: 'Earlier Evidence',
                      },
                      {
                        year: selectedTemporalAnalysis.toYear,
                        evidenceId: selectedTemporalAnalysis.toEvidenceId,
                        label: 'Later Evidence',
                      },
                    ].map((side) => {
                      const evidence = temporalEvidence.find(
                        (item) =>
                          item.evidenceId === side.evidenceId ||
                          Number(item.year) === Number(side.year)
                      );

                      return (
                        <div
                          key={`${side.label}-${side.year}`}
                          className="rounded-2xl overflow-hidden bg-white border border-[#C89D66]/25"
                        >

                          <div className="aspect-[4/3] bg-stone-100">
                            {evidence?.imageUrl ? (
                              <img
                                src={evidence.imageUrl}
                                alt={`${selectedTemporalAnalysis.evidenceScope || 'Heritage element'} ${side.year}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm text-stone-400">
                                Image unavailable
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-[#996515] font-bold">
                                  {side.label}
                                </p>

                                <p className="text-2xl font-serif font-bold text-[#1F1813]">
                                  {side.year}
                                </p>
                              </div>

                              {evidence?.captureDate && (
                                <p className="text-[10px] text-stone-500 text-right">
                                  {evidence.captureDate}
                                </p>
                              )}
                            </div>

                            {evidence?.author && (
                              <p className="text-xs text-stone-500 mt-3">
                                Photographer: {evidence.author}
                              </p>
                            )}

                            {evidence?.license && (
                              <p className="text-[10px] text-stone-400 mt-1">
                                {evidence.license}
                              </p>
                            )}
                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}
              </div>

              {/* Detected categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="p-5 rounded-2xl bg-white border border-[#C89D66]/25">
                  <h3 className="text-sm font-serif font-bold text-[#1F1813]">
                    Newly Detected Categories
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(selectedTemporalAnalysis.newLabels || []).filter(
                      (label) => label !== 'none'
                    ).length > 0 ? (
                      selectedTemporalAnalysis.newLabels
                        .filter((label) => label !== 'none')
                        .map((label) => (
                          <span
                            key={label}
                            className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
                          >
                            {label}
                          </span>
                        ))
                    ) : (
                      <span className="text-xs text-stone-400">
                        No newly detected categories.
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#C89D66]/25">
                  <h3 className="text-sm font-serif font-bold text-[#1F1813]">
                    No Longer Detected
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(selectedTemporalAnalysis.removedLabels || []).filter(
                      (label) => label !== 'none'
                    ).length > 0 ? (
                      selectedTemporalAnalysis.removedLabels
                        .filter((label) => label !== 'none')
                        .map((label) => (
                          <span
                            key={label}
                            className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold"
                          >
                            {label}
                          </span>
                        ))
                    ) : (
                      <span className="text-xs text-stone-400">
                        No removed categories.
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Gemini insight */}
              <div className="p-6 rounded-3xl bg-[#1F1813] border border-[#C5A059]/40">

                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-[#E9D7A5]" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E9D7A5]">
                      Temporal Comparison
                    </p>

                    <p className="text-xs text-[#D8C6A5] mt-1">
                      AI-assisted interpretation of the detected visual evidence
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#F5EFE6] leading-relaxed mt-5 whitespace-pre-line">
                  {selectedTemporalAnalysis.preservationInsight ||
                    'No Gemini insight is available for this comparison.'}
                </p>

              </div>

              {/* Limitation */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30">

                <Info
                  size={17}
                  className="text-[#996515] shrink-0 mt-0.5"
                />

                <p className="text-[11px] leading-relaxed text-[#7D5220]">
                  <strong className="text-[#1F1813]">
                    Interpretation note:
                  </strong>{' '}
                  The reported percentage represents differences in detected visual
                  categories between the two photographs. It does not represent
                  a percentage of physical damage or deterioration. Conservation
                  conclusions require further visual verification.
                </p>

              </div>

            </div>
          </div>
        </div>
      )}
      {/* Normal Preservation Analysis Detail Modal */}
      {selectedAnalysis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedAnalysis(null);
            }
          }}
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FBF8F2] rounded-3xl shadow-2xl border border-[#C89D66]/40">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#FBF8F2]/95 backdrop-blur border-b border-[#C89D66]/20 px-6 py-5 flex items-start justify-between gap-4">

              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#996515]">
                  <ShieldCheck size={13} />
                  Preservation Analysis
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1813] mt-1">
                  {selectedAnalysis.elementId}
                </h2>

                <p className="text-xs font-hindi text-[#996515] mt-1">
                  संरक्षण विश्लेषण विवरण
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnalysis(null)}
                className="p-2 rounded-full hover:bg-stone-200 transition"
                aria-label="Close analysis"
              >
                <X size={20} className="text-stone-600" />
              </button>

            </div>

            <div className="p-6 space-y-6">

              {/* Status overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">
                    Condition
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={selectedAnalysis.condition} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">
                    Priority Score
                  </p>

                  <p className="text-3xl font-serif font-bold text-[#996515] mt-1">
                    {selectedAnalysis.priorityScore ?? 0}
                    <span className="text-base text-stone-400">
                      {' / 100'}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">
                    Detected Visual Variation
                  </p>

                  <p className="text-3xl font-serif font-bold text-[#1F1813] mt-1">
                    {selectedAnalysis.visualVariation ?? 0}%
                  </p>
                </div>

              </div>

              {/* Element */}
              <div className="p-5 rounded-2xl bg-white border border-[#C89D66]/25">

                <p className="text-[10px] uppercase tracking-wider text-[#996515] font-bold">
                  Heritage Element
                </p>

                <h3 className="text-xl font-serif font-bold text-[#1F1813] mt-1">
                  {PRESERVATION_ELEMENTS.find(
                    (element) =>
                      element.id === selectedAnalysis.elementId
                  )?.name || selectedAnalysis.elementId}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      Reference
                    </p>

                    <p className="text-sm font-semibold text-stone-700 mt-1">
                      {selectedAnalysis.referenceYear || 'Reference'} record
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      Observation
                    </p>

                    <p className="text-sm font-semibold text-stone-700 mt-1">
                      Current capture
                    </p>
                  </div>

                </div>

              </div>

              {/* Analysis insight */}
              <div className="p-6 rounded-3xl bg-[#1F1813] border border-[#C5A059]/40">

                <div className="flex items-center gap-2">
                  <Sparkles
                    size={17}
                    className="text-[#E9D7A5]"
                  />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E9D7A5]">
                      Preservation Insight
                    </p>

                    <p className="text-xs text-[#D8C6A5] mt-1">
                      Remote review of detected visual evidence
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#F5EFE6] leading-relaxed mt-5 whitespace-pre-line">
                  {selectedAnalysis.preservationInsight ||
                    'No preservation insight is available for this analysis.'}
                </p>

              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400">
                    Analysis ID
                  </p>

                  <p className="text-xs font-mono text-stone-700 mt-2 break-all">
                    {selectedAnalysis.analysisId || '—'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#C89D66]/25">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400">
                    Analysis Date
                  </p>

                  <p className="text-sm text-stone-700 mt-2">
                    {selectedAnalysis.date
                      ? new Date(
                        selectedAnalysis.date
                      ).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                      : '—'}
                  </p>
                </div>

              </div>

              {/* Interpretation note */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30">

                <Info
                  size={17}
                  className="text-[#996515] shrink-0 mt-0.5"
                />

                <p className="text-[11px] leading-relaxed text-[#7D5220]">
                  <strong className="text-[#1F1813]">
                    Interpretation note:
                  </strong>{' '}
                  Detected visual variation represents differences
                  identified between the available photographs. It does
                  not by itself establish physical deterioration,
                  structural damage, or material loss.
                </p>

              </div>

              {/* Close */}
              <div className="flex justify-end pt-2">

                <button
                  type="button"
                  onClick={() => setSelectedAnalysis(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1F1813] text-[#E9D7A5] text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  Close Analysis
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
