import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Camera, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { PRESERVATION_ELEMENTS } from '../data/elements';
import { isApiConfigured } from '../api/apiClient';
import { getPresignedUploadUrl, uploadToS3 } from '../api/uploadApi';
import { analyzeChange } from '../api/analysisApi';
import AnalysisLoader from '../components/preservation/AnalysisLoader';
import OrnamentDivider from '../components/ui/OrnamentDivider';

export default function Preserve() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Preselected element (defaults to SM-01)
  const initialElementId = searchParams.get('element') || 'SM-01';
  const [selectedElementId, setSelectedElementId] = useState(initialElementId);

  // Workflow steps: 1 = select, 2 = upload, 3 = analyze
  const [step, setStep] = useState(2);

  // Upload State
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | uploaded | error
  const [uploadedS3Key, setUploadedS3Key] = useState(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const selectedElement = PRESERVATION_ELEMENTS.find((e) => e.id === selectedElementId) || PRESERVATION_ELEMENTS[0];
  const apiConnected = isApiConfigured();

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 12MB)
    if (selectedFile.size > 12 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 12MB. Please select a smaller photo.');
      return;
    }

    setErrorMessage(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadedS3Key(null);
    setStep(2);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Perform S3 Presigned Upload
  const handleUploadToS3 = async () => {
    if (!file) return;

    if (!apiConnected) {
      setErrorMessage(
        'AWS API Gateway endpoint is not configured (VITE_API_BASE_URL is missing in environment). Live AWS preservation upload cannot be reached.'
      );
      return;
    }

    try {
      setUploadStatus('uploading');
      setErrorMessage(null);
      setUploadProgress(10);

      // 1. Obtain presigned URL from API Gateway Lambda
      const presignResponse = await getPresignedUploadUrl({
        fileName: file.name,
        contentType: file.type,
        elementId: selectedElement.id,
      });

      const { uploadUrl, key } = presignResponse;
      if (!uploadUrl) {
        throw new Error('Upload URL was not returned by API Gateway.');
      }

      setUploadProgress(30);

      // 2. Direct binary PUT upload to S3 with live progress
      await uploadToS3(uploadUrl, file, (percent) => {
        setUploadProgress(30 + Math.round(percent * 0.7));
      });

      setUploadedS3Key(key);
      setUploadStatus('uploaded');
      setUploadProgress(100);
      setStep(3);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      setErrorMessage(err.message || 'DigiVirasat could not upload the image to Amazon S3. Please retry.');
    }
  };

  // Perform Analysis
 const handleAnalyze = async () => {
  if (!apiConnected) {
    setErrorMessage(
      'AWS API Gateway endpoint is not configured. Please set VITE_API_BASE_URL to trigger live AWS Rekognition analysis.'
    );
    return;
  }

  if (!uploadedS3Key) {
    setErrorMessage(
      'Please upload the current photograph to the archive first.'
    );
    return;
  }

  try {
    setIsAnalyzing(true);
    setErrorMessage(null);

    console.log('ANALYZING CURRENT S3 KEY:', uploadedS3Key);

    const result = await analyzeChange({
      elementId: selectedElement.id,
      monumentId: selectedElement.monumentId,
      currentImageKey: uploadedS3Key,
    });

    console.log('AWS ANALYSIS RESPONSE:', result);

    if (!result?.analysisId) {
      throw new Error(
        'AWS analysis completed but no analysisId was returned.'
      );
    }

    // Navigate using the real analysis ID returned by AWS
    navigate(`/analysis/${result.analysisId}`);

  } catch (err) {
    console.error('Analysis error:', err);
    setIsAnalyzing(false);
    setErrorMessage(
      err.message ||
      'Analysis failed to complete. Please check connection and retry.'
    );
  }
};

  // Fallback demo option when offline / unconfigured
  const handleDemoPreset = () => {
    // Load local demo baseline observation
    setPreviewUrl('/heritage/amer-fort/sheesh-mahal/sm-01/baseline-2026.jpg');
    setUploadedS3Key('uploads/amer-fort/SM-01-demo.jpg');
    setUploadStatus('uploaded');
    setUploadProgress(100);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F1813] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold bg-[#C89D66]/15 px-3 py-1 rounded-full border border-[#C89D66]/30">
            Heritage Preservation Workflow
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1F1813]">
            Capture the present.
          </h1>
          <p className="text-lg sm:text-xl font-hindi text-[#996515]">
            वर्तमान की तस्वीर दर्ज करें।
          </p>
          <p className="text-xs sm:text-sm text-[#5C5042] max-w-xl mx-auto">
            Upload an unedited, clear photograph of the architectural element. Our AWS Rekognition engine cross-checks visual labels against the calibrated baseline.
          </p>
        </div>

        {/* 3-Step Stepper Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto select-none">
          <div
            onClick={() => setStep(1)}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              step === 1
                ? 'bg-[#1F1813] text-[#FBF8F2] border-[#C5A059]'
                : 'bg-[#F5EFE6] text-stone-600 border-[#C89D66]/30'
            }`}
          >
            <span className="block text-[10px] font-mono text-[#C5A059]">STEP 01</span>
            <span className="text-xs font-semibold">Select Element</span>
          </div>

          <div
            onClick={() => setStep(2)}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              step === 2
                ? 'bg-[#1F1813] text-[#FBF8F2] border-[#C5A059]'
                : 'bg-[#F5EFE6] text-stone-600 border-[#C89D66]/30'
            }`}
          >
            <span className="block text-[10px] font-mono text-[#C5A059]">STEP 02</span>
            <span className="text-xs font-semibold">Upload Photo</span>
          </div>

          <div
            onClick={() => {
              if (uploadStatus === 'uploaded') setStep(3);
            }}
            className={`p-3 rounded-xl border text-center transition-all ${
              step === 3
                ? 'bg-[#1F1813] text-[#FBF8F2] border-[#C5A059]'
                : 'bg-[#F5EFE6] text-stone-400 border-[#C89D66]/20'
            }`}
          >
            <span className="block text-[10px] font-mono text-[#C5A059]">STEP 03</span>
            <span className="text-xs font-semibold">Analyze Change</span>
          </div>
        </div>

        {/* Unconfigured Warning Alert if API Gateway URL not yet set */}
        {!apiConnected && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Live preservation service is not connected:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_API_BASE_URL</code> is not configured.
                To test live AWS S3 & Rekognition, set your API Gateway URL in <code className="font-mono">.env</code>. You may also click &ldquo;Load Demo Observation&rdquo; below to explore the complete workflow with pre-indexed baseline imagery.
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoPreset}
              className="px-3 py-1.5 rounded-lg bg-[#996515] hover:bg-[#7D5220] text-white font-semibold text-xs whitespace-nowrap cursor-pointer"
            >
              Load Demo Observation
            </button>
          </div>
        )}

        {/* Main Work Area */}
        {isAnalyzing ? (
          <AnalysisLoader active={isAnalyzing} onComplete={() => navigate('/analysis/DV-ANL-2026-0891')} />
        ) : (
          <div className="bg-[#F5EFE6] rounded-3xl border border-[#C89D66]/40 p-6 sm:p-10 shadow-lg space-y-8">
            {/* Element Selector Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#C89D66]/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center font-mono font-bold text-sm">
                  {selectedElement.id}
                </div>
                <div>
                  <p className="text-xs font-mono text-stone-500">Selected Architectural Element</p>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#1F1813]">
                    {selectedElement.name}
                  </h3>
                  <p className="text-xs font-hindi text-[#996515]">
                    {selectedElement.hindiName} &bull; {selectedElement.chamber}
                  </p>
                </div>
              </div>

              {/* Element Dropdown */}
              <select
                value={selectedElementId}
                onChange={(e) => setSelectedElementId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F5EFE6] border border-[#C89D66]/40 text-xs font-semibold text-[#1F1813] focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                {PRESERVATION_ELEMENTS.map((elem) => (
                  <option key={elem.id} value={elem.id}>
                    {elem.id} - {elem.name} ({elem.hindiName})
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Canvas */}
            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center transition-all ${
                  isDragging
                    ? 'border-[#C5A059] bg-[#C5A059]/10'
                    : 'border-[#C89D66]/60 bg-white/60 hover:bg-white hover:border-[#C5A059]'
                }`}
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#1F1813] text-[#E9D7A5] flex items-center justify-center mx-auto shadow-md">
                    <Upload size={28} />
                  </div>

                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#1F1813]">
                      Drag &amp; drop your image here
                    </h4>
                    <p className="text-xs text-[#7D6E5D] mt-1">
                      Supported formats: JPG, JPEG, PNG, WEBP &bull; Max size: 12MB
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-[#1F1813] hover:bg-[#2C221A] text-[#FBF8F2] text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                    >
                      Choose File
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-[#C89D66]/20 hover:bg-[#C89D66]/30 text-[#1F1813] text-xs font-semibold tracking-wider transition-colors inline-flex items-center gap-1.5 border border-[#C89D66]/40 cursor-pointer"
                    >
                      <Camera size={14} />
                      <span>Use Camera</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    className="hidden"
                  />

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              /* Preview & Upload Progress */
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-[420px] flex items-center justify-center border border-[#C89D66]/40">
                  <img
                    src={previewUrl}
                    alt="Current Observation Preview"
                    className="max-h-[420px] w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setFile(null);
                      setUploadStatus('idle');
                    }}
                    className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-medium backdrop-blur-sm cursor-pointer"
                  >
                    Change Photo
                  </button>

                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-[#1F1813]/85 text-[#E9D7A5] text-xs font-mono border border-[#C5A059]/40">
                    Observation Preview &bull; {selectedElement.id}
                  </div>
                </div>

                {/* Progress bar when uploading */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-stone-700">
                      <span>Uploading directly to Amazon S3 bucket...</span>
                      <span className="font-mono">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-stone-300 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#C5A059] to-[#996515] h-2 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Status Confirmation */}
                {uploadStatus === 'uploaded' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span>
                        Photograph successfully stored in private archive bucket. S3 Key: <code className="font-mono text-[11px]">{uploadedS3Key || 'verified'}</code>
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-900">Ready for Analysis</span>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center justify-between">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="font-bold ml-2 text-red-900"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#C89D66]/20">
                  {uploadStatus !== 'uploaded' ? (
                    <button
                      type="button"
                      onClick={handleUploadToS3}
                      disabled={uploadStatus === 'uploading'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1F1813] hover:bg-[#2C221A] text-[#FBF8F2] text-xs font-bold tracking-wider transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      <Upload size={15} />
                      <span>{uploadStatus === 'uploading' ? 'Uploading to S3...' : 'Upload to Heritage Archive'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold tracking-wider hover:brightness-110 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Sparkles size={15} />
                      <span>Analyze Change &rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
