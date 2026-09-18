import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ArrowRight, Eye, Sparkles, Check, Clock, ChevronRight, HelpCircle, Layers, ArrowLeftRight } from 'lucide-react';
import HistoricalStoryModal from './HistoricalStoryModal';
import LiveCameraModal from './LiveCameraModal';
import ImageComparison from './ImageComparison';
import OrnamentDivider from '../ui/OrnamentDivider';
import { PRESERVATION_REFERENCES } from '../../data/preservationReferences';
import { isApiConfigured } from '../../api/apiClient';
import { getPresignedUploadUrl, uploadToS3 } from '../../api/uploadApi';
import { analyzeChange } from '../../api/analysisApi';

export default function VisualTimeline({ elementId = 'SM-01' }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const referenceData = PRESERVATION_REFERENCES[elementId] || PRESERVATION_REFERENCES['SM-01'];
  const timelineItems = referenceData.timelineItems || [];
  const referenceItem2021 = timelineItems.find((item) => item.year === 2021) || timelineItems[2];

  // Modals state
  const [selectedStoryItem, setSelectedStoryItem] = useState(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  // Present-day visitor capture state
  const [capturedFile, setCapturedFile] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Handle file input selection (Only opened by "Upload Photo")
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, PNG, or WEBP photograph.');
      return;
    }

    setCapturedFile(file);
    setCapturedPreview(URL.createObjectURL(file));
    setUploadError(null);
  };

  // Handle camera capture from LiveCameraModal
  const handleCameraCapture = (file, previewUrl) => {
    setCapturedFile(file);
    setCapturedPreview(previewUrl);
    setUploadError(null);
  };

  // Reset current capture
  const handleResetCapture = () => {
    if (capturedPreview && capturedPreview.startsWith('blob:')) {
      URL.revokeObjectURL(capturedPreview);
    }
    setCapturedFile(null);
    setCapturedPreview(null);
    setUploadError(null);
  };

  // Trigger analysis for the captured photo
  const handleProceedToAnalysis = async () => {
    if (!capturedFile) return;

    if (!isApiConfigured()) {
      // Offline demo fallback: navigate to analysis with pre-indexed benchmark record
      navigate('/analysis/DV-ANL-2026-0891');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // 1. Get presigned URL from API Gateway
      const presign = await getPresignedUploadUrl({
        fileName: capturedFile.name,
        contentType: capturedFile.type,
        elementId: elementId,
      });

      // 2. Direct binary PUT to S3
      await uploadToS3(presign.uploadUrl, capturedFile);

      // 3. Trigger POST /analyze with actual uploaded key and 2021 reference
      const analysisResult = await analyzeChange({
        elementId: elementId,
        monumentId: referenceData.monumentId,
        currentImageKey: presign.key,
      });

      navigate(`/analysis/${analysisResult.analysisId || 'DV-ANL-2026-0891'}`);
    } catch (err) {
      console.error('Preservation workflow error:', err);
      setIsUploading(false);
      setUploadError(err.message || 'Failed to upload observation. Please retry.');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 select-none">
      {/* ============================================================ */}
      {/* SECTION HEADER: "Visual History of Sheesh Mahal"              */}
      {/* ============================================================ */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-serif italic bg-[#C89D66]/15 text-[#996515] border border-[#C89D66]/30">
          <span>&ldquo;एक विरासत, अनेक समय&rdquo;</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1F1813] tracking-tight">
          Visual History of Sheesh Mahal
        </h2>

        <p className="text-lg sm:text-2xl font-hindi text-[#996515] font-medium">
          शीश महल की दृश्य यात्रा
        </p>

        <div className="space-y-1 pt-1">
          <p className="text-base sm:text-lg font-serif italic text-stone-700">
            From archival memory to the present day.
          </p>
          <p className="text-xs sm:text-sm font-hindi text-[#7D5220]">
            ऐतिहासिक स्मृतियों से वर्तमान तक।
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[#5C5042] max-w-2xl mx-auto pt-3 leading-relaxed">
          Explore how this heritage space has been documented across time, then contribute a photograph of what you see today.
        </p>

        <OrnamentDivider className="my-6" />

        {/* Conceptual Distinction Bridge */}
        <div className="hidden sm:flex items-center justify-center gap-3 text-xs font-mono text-stone-500 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] border border-[#C89D66]/30">
            <span className="font-bold text-[#1F1813]">PAST</span>
            <span className="text-[#996515] font-sans">1950 &bull; 2000</span>
          </div>
          <span className="text-[#C5A059]">&rarr;</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1813] text-[#E9D7A5] border border-[#C5A059]/40 shadow-sm">
            <span className="font-bold">RECENT BASELINE</span>
            <span className="text-[#C5A059]">2021 Reference</span>
          </div>
          <span className="text-[#C5A059]">&rarr;</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span className="font-bold">PRESENT</span>
            <span className="text-stone-700 font-sans">Visitor Capture</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3 PHOTOGRAPHIC CARDS: 1950 | 2000 | 2021                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {timelineItems.map((item) => {
          const isReference = item.type === 'reference';

          return (
            <div
              key={item.year}
              className={`group rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${
                isReference
                  ? 'bg-[#1F1813] text-white border-2 border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-lg'
                  : 'bg-[#FBF8F2] text-[#1F1813] border border-[#C89D66]/40 hover:border-[#C5A059]'
              }`}
            >
              {/* Photo Canvas */}
              <div
                className="relative aspect-[4/3] overflow-hidden bg-black cursor-pointer"
                onClick={() => setSelectedStoryItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Floating Year Tag */}
                <div className="absolute top-3.5 left-3.5">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold shadow ${
                      isReference
                        ? 'bg-[#C5A059] text-[#16120E]'
                        : 'bg-[#1F1813]/85 text-[#E9D7A5] border border-[#C5A059]/40'
                    }`}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Role Badge */}
                <div className="absolute top-3.5 right-3.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                      isReference
                        ? 'bg-[#C5A059] text-[#16120E]'
                        : 'bg-black/60 backdrop-blur-sm text-stone-200 border border-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-[#E9D7A5] bg-black/60 px-2 py-0.5 rounded-md">
                  <Eye size={12} />
                  <span>Enlarge</span>
                </div>
              </div>

              {/* Clean Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className={`text-xl font-serif font-bold ${isReference ? 'text-[#E9D7A5]' : 'text-[#1F1813]'}`}>
                      {item.title}
                    </h3>
                    {isReference && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#C5A059] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                        ACTIVE REFERENCE
                      </span>
                    )}
                  </div>

                  {item.hindiTitle && (
                    <p className={`text-xs font-hindi ${isReference ? 'text-stone-300' : 'text-[#996515]'}`}>
                      {item.hindiTitle}
                    </p>
                  )}

                  {/* One short description only */}
                  <p className={`text-xs sm:text-sm leading-relaxed ${isReference ? 'text-stone-300' : 'text-[#4A3F33]'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Clean CTA */}
                <div className="pt-3 border-t border-stone-700/30">
                  <button
                    type="button"
                    onClick={() => setSelectedStoryItem(item)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                      isReference
                        ? 'text-[#C5A059] hover:text-white'
                        : 'text-[#996515] hover:text-[#1F1813]'
                    }`}
                  >
                    <span>View Story &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* DOCUMENT THE PRESENT: DEDICATED FULL-WIDTH SECTION           */}
      {/* ============================================================ */}
      {!capturedPreview ? (
        <div className="rounded-3xl bg-[#16120E] text-white border-2 border-[#C5A059]/40 p-8 sm:p-14 max-w-5xl mx-auto shadow-2xl relative overflow-hidden space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-[#C5A059]/20 text-[#E9D7A5] border border-[#C5A059]/40">
              <Camera size={13} className="text-[#C5A059]" />
              <span>Community Archival Action</span>
            </span>

            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Document the Present
            </h3>

            <p className="text-base sm:text-lg font-hindi text-[#C5A059]">
              वर्तमान को दर्ज करें
            </p>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
              The story of Sheesh Mahal does not end with its historical photographs. Your photograph can become part of its continuing digital record.
            </p>
          </div>

          {/* Two Balanced Action Options: TAKE PHOTO vs UPLOAD PHOTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-2">
            {/* Option 1: Take Photo (Live Camera) */}
            <button
              type="button"
              onClick={() => setCameraModalOpen(true)}
              className="group p-8 rounded-2xl bg-[#1F1813] hover:bg-[#2C221A] border border-[#C5A059]/40 hover:border-[#C5A059] text-center space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#996515] text-[#16120E] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Camera size={28} />
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-white group-hover:text-[#E9D7A5] transition-colors">
                  TAKE PHOTO
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Document the element using your camera.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] pt-2">
                <span>Launch Live Camera</span>
                <ArrowRight size={13} />
              </span>
            </button>

            {/* Option 2: Upload Photo (File input) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group p-8 rounded-2xl bg-[#1F1813] hover:bg-[#2C221A] border border-[#C5A059]/40 hover:border-[#C5A059] text-center space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-stone-800 text-[#E9D7A5] border border-stone-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-white group-hover:text-[#E9D7A5] transition-colors">
                  UPLOAD PHOTO
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Choose an image from your device.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 pt-2">
                <span>Browse Files (JPG, PNG, WEBP)</span>
                <ArrowRight size={13} />
              </span>

              {/* Hidden file input opened exclusively by Upload Photo */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* AFTER USER CAPTURES PHOTO: "Reference vs Present"            */
        /* ============================================================ */
        <div className="rounded-3xl bg-[#F5EFE6] border-2 border-[#C89D66] p-6 sm:p-12 max-w-5xl mx-auto shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-2 border-b border-[#C89D66]/30 pb-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#996515] font-bold">
              Pairwise Operational Comparison
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#1F1813]">
              Reference vs Present
            </h3>
            <p className="text-base font-hindi text-[#996515]">
              संदर्भ और वर्तमान
            </p>
            <p className="text-xs sm:text-sm text-[#5C5042] max-w-xl mx-auto">
              Compare your current visitor capture against the standardized <strong>2021 Reference</strong> before triggering cloud visual feature analysis.
            </p>
          </div>

          {/* Interactive Comparison Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-stone-600">
              <span className="font-bold text-[#996515]">LEFT: 2021 Reference</span>
              <span className="font-bold text-amber-800">RIGHT: TODAY Visitor Capture</span>
            </div>

            <ImageComparison
              beforeImage={referenceItem2021.image}
              afterImage={capturedPreview}
              beforeLabel="2021 Active Reference"
              afterLabel="Today Visitor Capture"
            />
          </div>

          {uploadError && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-900">
              {uploadError}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#C89D66]/30">
            <button
              type="button"
              onClick={handleResetCapture}
              className="px-5 py-2.5 rounded-xl border border-stone-400 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              Take Another Photo
            </button>

            <button
              type="button"
              onClick={handleProceedToAnalysis}
              disabled={isUploading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold tracking-wider hover:brightness-110 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>{isUploading ? 'Transferring to S3...' : 'Analyze Visual Variation \u2192'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Historical Story Modal */}
      <HistoricalStoryModal
        item={selectedStoryItem}
        isOpen={Boolean(selectedStoryItem)}
        onClose={() => setSelectedStoryItem(null)}
      />

      {/* Live Camera Modal */}
      <LiveCameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onPhotoCaptured={handleCameraCapture}
      />
    </div>
  );
}
