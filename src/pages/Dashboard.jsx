import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowRight, Eye, RefreshCw, Layers, Database, Compass, CheckCircle2, ShieldAlert, Sparkles, Activity, Clock, X, Info } from 'lucide-react';
import { getDashboardSummary, getDashboardAnalyses } from '../api/dashboardApi';
import { PRESERVATION_ELEMENTS } from '../data/elements';
import { PRESERVATION_REFERENCES } from '../data/preservationReferences';
import StatusBadge from '../components/ui/StatusBadge';
import OrnamentDivider from '../components/ui/OrnamentDivider';
import HindiHeading from '../components/ui/HindiHeading';
import VisualTimeline from '../components/preservation/VisualTimeline';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, anaRes] = await Promise.all([
        getDashboardSummary(),
        getDashboardAnalyses(),
      ]);
      setSummary(sumRes);
      setAnalyses(anaRes.records || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnalyses = activeFilter === 'All'
    ? analyses
    : analyses.filter(a => a.condition.toLowerCase() === activeFilter.toLowerCase());

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
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5EFE6] hover:bg-[#EAE1D3] text-xs font-semibold text-[#1F1813] border border-[#C89D66]/30 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Refresh Records</span>
            </button>
            <Link
              to="/preserve"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold transition-all shadow cursor-pointer"
            >
              <span>+ Record Observation</span>
            </Link>
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
              {summary?.totalElements || 5}
            </p>
            <p className="text-[11px] text-[#7D6E5D] mt-1">4 Active in Sheesh Mahal</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 uppercase">
              <span>Total Analyses</span>
              <Database size={16} className="text-[#996515]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#1F1813] mt-2">
              {summary?.totalAnalyses || 18}
            </p>
            <p className="text-[11px] text-[#7D6E5D] mt-1">DynamoDB Logged</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#C89D66]/30 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 uppercase">
              <span>Field Follow-ups</span>
              <Activity size={16} className="text-[#996515]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#1F1813] mt-2">
              12
            </p>
            <p className="text-[11px] text-[#7D6E5D] mt-1">Inspection Schedules</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1F1813] text-white border border-[#C5A059]/40 shadow-lg">
            <div className="flex items-center justify-between text-xs font-medium text-[#E9D7A5] uppercase">
              <span>High Priority Elements</span>
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#E9D7A5] mt-2">
              03
            </p>
            <p className="text-[11px] text-stone-300 mt-1">Requiring Ground Verification</p>
          </div>
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
                <p className="text-xs font-hindi text-[#996515]">हाल के संरक्षण विश्लेषण (2021 संदर्भ बनाम आगंतुक अवलोकन)</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs">
                {['All', 'Stable', 'Moderate', 'High Priority'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                      activeFilter === f
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
                  {filteredAnalyses.map((record) => (
                    <tr key={record.analysisId} className="hover:bg-[#FBF8F2] transition-colors">
                      <td className="py-3 px-4 font-medium text-[#1F1813]">
                        <span className="font-mono text-[11px] font-bold block text-[#996515]">{record.elementId}</span>
                        <span>{record.elementName}</span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-mono text-stone-600">
                        <span className="text-[#996515] font-semibold">2021 Ref</span> vs <span className="text-amber-800 font-semibold">Visitor</span>
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
                        {record.date}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/analysis/${record.analysisId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#996515] hover:text-[#1F1813]"
                        >
                          <span>Review</span>
                          <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <span className="font-bold">3 Elements</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2D4B39] h-2 rounded-full" style={{ width: '60%' }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                    <span>Moderate Attention</span>
                  </span>
                  <span className="font-bold">1 Element (SM-01)</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C5A059] h-2 rounded-full" style={{ width: '20%' }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A64B2A]" />
                    <span>High Priority (SM-03)</span>
                  </span>
                  <span className="font-bold">1 Element</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#A64B2A] h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            {/* Quick Link Card to Demo Element SM-01 */}
            <div className="p-6 rounded-2xl bg-[#1F1813] text-white border border-[#C5A059]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#E9D7A5] font-mono">Primary Demo</span>
                <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#E9D7A5] text-[10px]">2021 Reference Active</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-white">East Mirror Wall (SM-01)</h4>
              <p className="text-xs text-stone-300">Sheesh Mahal &bull; 1950 &bull; 2009 &bull; 2021 Baseline</p>
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
    </div>
  );
}
