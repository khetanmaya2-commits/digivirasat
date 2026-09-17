import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';
import OrnamentDivider from '../ui/OrnamentDivider';

const ANALYSIS_STAGES = [
  { id: 1, title: 'Retrieving reference image', hindi: 'संदर्भ छवि प्राप्त की जा रही है', detail: 'Connecting to S3 bucket (recent/amer-fort/SM-01-2016.jpg)' },
  { id: 2, title: 'Processing current photograph', hindi: 'वर्तमान छायाचित्र का प्रक्रमण', detail: 'Validating aspect ratio, optical exposure & RGB color profile' },
  { id: 3, title: 'Detecting visual features', hindi: 'दृश्य विशेषताओं की पहचान', detail: 'Running Amazon Rekognition feature detection & label extraction' },
  { id: 4, title: 'Comparing observations', hindi: 'अवलोकनों की तुलना', detail: 'Cross-referencing historical baseline labels with current observations' },
  { id: 5, title: 'Calculating preservation priority', hindi: 'संरक्षण प्राथमिकता की गणना', detail: 'Evaluating visual variation index & environmental factors' },
  { id: 6, title: 'Preparing preservation insight', hindi: 'संरक्षण अंतर्दृष्टि का निर्माण', detail: 'Writing persistent record to DynamoDB and finalizing recommendations' },
];

/**
 * Animated 6-stage analysis loader communicating AWS backend pipeline execution
 */
export default function AnalysisLoader({ active = true, onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [active, onComplete]);

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#1F1813] border border-[#C5A059]/30 text-[#FBF8F2] shadow-2xl relative overflow-hidden">
      {/* Background motif accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#C5A059]/5 blur-2xl pointer-events-none" />

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E9D7A5] text-xs uppercase tracking-widest mb-3">
          <Cpu size={14} className="text-[#C5A059] animate-spin" />
          <span>AWS Heritage Analysis Pipeline</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-[#FBF8F2]">
          Analyzing Architectural Differences
        </h3>
        <p className="text-sm font-hindi text-[#C5A059] mt-1">
          दृश्य परिवर्तन और संरक्षण स्थिति का विश्लेषण जारी है...
        </p>
      </div>

      <OrnamentDivider dark className="my-4" />

      {/* Sequential Stage List */}
      <div className="space-y-4 my-6">
        {ANALYSIS_STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          const isPending = idx > currentStage;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all duration-500 flex items-start gap-4 ${
                isCurrent
                  ? 'bg-[#2C221A] border-[#C5A059] shadow-lg translate-x-1'
                  : isDone
                  ? 'bg-[#18130E]/60 border-emerald-900/40 text-stone-300'
                  : 'bg-transparent border-stone-800/60 opacity-40 text-stone-500'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 size={20} className="text-[#C5A059] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-stone-600 flex items-center justify-center text-[10px] font-mono">
                    {stage.id}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className={`text-sm font-medium ${isCurrent ? 'text-[#E9D7A5]' : 'text-stone-300'}`}>
                    {stage.title}
                  </span>
                  <span className="text-xs font-hindi text-stone-400">
                    {stage.hindi}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 truncate">
                  {stage.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-[#C5A059]/80 font-light flex items-center justify-center gap-1.5">
        <Sparkles size={13} />
        <span>Amazon Rekognition &bull; S3 Presigned Workflow &bull; DynamoDB</span>
      </div>
    </div>
  );
}
