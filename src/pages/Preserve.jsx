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
  // Observation Context
const [observationType, setObservationType] = useState('Tourist');
const [observationNote, setObservationNote] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | uploaded | error
  const [uploadedS3Key, setUploadedS3Key] = useState(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
const [cameraError, setCameraError] = useState(null);
const videoRef = useRef(null);
const cameraStreamRef = useRef(null);

  const selectedElement = PRESERVATION_ELEMENTS.find((e) => e.id === selectedElementId) || PRESERVATION_ELEMENTS[0];
  const apiConnected = isApiConfigured();

  // Cleanup object URL
 useEffect(() => {
  return () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());
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

  const stopCamera = () => {
  if (cameraStreamRef.current) {
    cameraStreamRef.current.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
  }

  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }

  setIsCameraOpen(false);
};

const openCamera = async () => {
  try {
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error(
        'Camera access is not supported by this browser. Please use a modern browser or upload a photograph instead.'
      );
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environment',
        },
        width: {
          ideal: 1280,
        },
        height: {
          ideal: 720,
        },
      },
      audio: false,
    });

    cameraStreamRef.current = stream;
    setIsCameraOpen(true);

    // Wait until the modal/video element exists.
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.error('Camera playback error:', err);
        });
      }
    });
  } catch (error) {
    console.error('Camera error:', error);

    setCameraError(
      error?.name === 'NotAllowedError'
        ? 'Camera permission was denied. Please allow camera access in your browser settings.'
        : error?.message ||
            'Unable to open the camera. Please upload a photograph instead.'
    );

    setIsCameraOpen(false);
  }
};

const captureCameraPhoto = () => {
  const video = videoRef.current;

  if (!video || !video.videoWidth || !video.videoHeight) {
    setCameraError('Camera is still starting. Please wait a moment and try again.');
    return;
  }

  const canvas = document.createElement('canvas');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    setCameraError('Unable to capture the camera frame.');
    return;
  }

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        setCameraError('Unable to create the captured photograph.');
        return;
      }

      const capturedFile = new File(
        [blob],
        `digivirasat-${selectedElement.id}-${Date.now()}.jpg`,
        {
          type: 'image/jpeg',
        }
      );

      stopCamera();
      handleFileSelect(capturedFile);
    },
    'image/jpeg',
    0.92
  );
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
  observationType,
  observationNote: observationNote.trim(),
  captureMode: 'guided',
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
  Record a Heritage Observation.
</h1>

<p className="text-lg sm:text-xl font-hindi text-[#996515]">
  विरासत अवलोकन दर्ज करें।
</p>

<p className="text-xs sm:text-sm text-[#5C5042] max-w-xl mx-auto">
  Upload a clear photograph of the selected heritage element.
  Your observation is compared with its reference photograph to support
  remote heritage monitoring.
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
            <span className="text-xs font-semibold">Record Observation</span>
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
            <span className="text-xs font-semibold">Review Observation</span>
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

            {/* Reference Photograph */}
<div className="rounded-2xl bg-[#1F1813] border border-[#C89D66]/40 overflow-hidden shadow-md">
  <div className="p-5 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
          Reference Photograph
        </p>
        <h4 className="text-lg font-serif font-bold text-[#FBF8F2]">
          Operational Baseline
        </h4>
        <p className="text-xs font-hindi text-[#E9D7A5] mt-1">
          संदर्भ छायाचित्र
        </p>
      </div>

      <div className="px-3 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#E9D7A5] text-[10px] font-mono">
        {selectedElement.s3ReferenceKey?.match(/(19|20)\d{2}/)?.[0] || 'Reference'}
      </div>
    </div>

    <div className="relative rounded-xl overflow-hidden bg-black/40 border border-[#C89D66]/20">
      <img
        src={selectedElement.historicalImage}
        alt={`${selectedElement.name} reference photograph`}
        className="w-full h-[220px] sm:h-[280px] object-cover"
      />

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
        <span className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-[#FBF8F2] text-[10px] font-medium">
          {selectedElement.name}
        </span>

        <span className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-[#E9D7A5] text-[10px]">
          {selectedElement.category}
        </span>
      </div>
    </div>

    <div className="mt-4 flex items-start gap-2.5">
      <ImageIcon size={15} className="text-[#C5A059] flex-shrink-0 mt-0.5" />

      <p className="text-xs text-[#D8C7B2] leading-relaxed">
        Use this reference photograph to understand the monitored element
        and, when possible, record your observation from a comparable viewpoint.
      </p>
    </div>
  </div>
</div>
{/* Observation Context */}
<div className="rounded-2xl bg-white border border-[#C89D66]/30 p-5 sm:p-6 shadow-sm">
  <div className="mb-5">
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#996515] font-semibold">
      Observation Context
    </p>

    <h4 className="text-lg font-serif font-bold text-[#1F1813]">
      Who is recording this observation?
    </h4>

    <p className="text-xs font-hindi text-[#996515] mt-1">
      यह अवलोकन कौन दर्ज कर रहा है?
    </p>
  </div>

  {/* Observation Type */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
    {[
      'Tourist',
      'Volunteer',
      'Researcher',
      'Authorized Observer',
    ].map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => setObservationType(type)}
        className={`px-3 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
          observationType === type
            ? 'bg-[#1F1813] text-[#FBF8F2] border-[#C5A059] shadow-sm'
            : 'bg-[#F5EFE6] text-[#5C5042] border-[#C89D66]/30 hover:border-[#C5A059] hover:bg-[#FBF8F2]'
        }`}
      >
        {type}
      </button>
    ))}
  </div>

  {/* Optional Note */}
  <div className="mt-5">
    <label
      htmlFor="observation-note"
      className="block text-xs font-semibold text-[#3A2F25] mb-2"
    >
      Observation Note
      <span className="font-hindi text-[#996515] ml-2">
        वैकल्पिक टिप्पणी
      </span>
    </label>

    <textarea
      id="observation-note"
      value={observationNote}
      onChange={(e) => setObservationNote(e.target.value)}
      maxLength={500}
      rows={3}
      placeholder="Optional: describe anything noticeable in the photograph..."
      className="w-full px-4 py-3 rounded-xl bg-[#FBF8F2] border border-[#C89D66]/30 text-sm text-[#1F1813] placeholder:text-[#9A8B7A] focus:outline-none focus:border-[#C5A059] resize-none"
    />

    <div className="flex justify-end mt-1">
      <span className="text-[10px] text-[#8A7A68] font-mono">
        {observationNote.length}/500
      </span>
    </div>
  </div>
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
  Record a heritage observation
</h4>
                   <p className="text-xs text-[#7D6E5D] mt-1">
  Upload a clear, unedited photograph &bull; JPG, PNG, WEBP &bull; Max 12MB
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
  onClick={openCamera}
  className="px-5 py-2.5 rounded-xl bg-[#C89D66]/20 hover:bg-[#C89D66]/30 text-[#1F1813] text-xs font-semibold tracking-wider transition-colors inline-flex items-center gap-1.5 border border-[#C89D66]/40 cursor-pointer"
>
  <Camera size={14} />
  <span>Record with Camera</span>
</button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
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
                   Heritage Observation &bull; {selectedElement.id}
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
  Heritage observation securely recorded. S3 Key:{' '}
  <code className="font-mono text-[11px]">
    {uploadedS3Key || 'verified'}
  </code>
</span>
                    </div>
                   <span className="font-semibold text-emerald-900">
  Ready for Review
</span>
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
<span>
  {uploadStatus === 'uploading'
    ? 'Saving Observation...'
    : 'Save Heritage Observation'}
</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-xs font-bold tracking-wider hover:brightness-110 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Sparkles size={15} />
                     <span>Review Observation &rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Camera Modal */}
{isCameraOpen && (
  <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-4xl bg-[#1F1813] rounded-3xl overflow-hidden border border-[#C89D66]/40 shadow-2xl">

      {/* Camera Header */}
      <div className="px-5 py-4 border-b border-[#C89D66]/20 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
            Guided Heritage Observation
          </p>

          <h3 className="text-lg font-serif font-bold text-[#FBF8F2]">
            Align the {selectedElement.name}
          </h3>

          <p className="text-xs font-hindi text-[#E9D7A5] mt-1">
            संदर्भ छायाचित्र से दृश्य मिलाएँ
          </p>
        </div>

        <button
          type="button"
          onClick={stopCamera}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Camera View */}
      <div className="relative bg-black aspect-video overflow-hidden">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Guide Frame */}
        <div className="absolute inset-0 pointer-events-none">

          {/* Dark guidance overlay */}
          <div className="absolute inset-0 bg-black/15" />

          {/* Alignment frame */}
          <div className="absolute inset-[10%] border-2 border-[#E9D7A5]/80 rounded-2xl">

            {/* Corners */}
            <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-[#C5A059] rounded-tl-xl" />
            <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-4 border-r-4 border-[#C5A059] rounded-tr-xl" />
            <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-4 border-l-4 border-[#C5A059] rounded-bl-xl" />
            <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-[#C5A059] rounded-br-xl" />

            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#E9D7A5]/30" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E9D7A5]/30" />
          </div>

          {/* Instruction */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2">
            <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-[#C89D66]/40 text-[#FBF8F2] text-xs text-center whitespace-nowrap">
              Keep the element centered and capture a comparable view
            </div>
          </div>

          {/* Element label */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            <div className="px-4 py-2 rounded-xl bg-[#1F1813]/85 backdrop-blur-md border border-[#C5A059]/40 text-[#E9D7A5] text-xs font-mono">
              {selectedElement.id} • {selectedElement.name}
            </div>
          </div>
        </div>

        {/* Camera Error */}
        {cameraError && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 rounded-xl bg-red-950/90 border border-red-400/40 text-red-100 text-xs">
              {cameraError}
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="text-xs text-[#B8A895] text-center sm:text-left">
          <span className="text-[#C5A059] font-semibold">
            Observation guide
          </span>
          <br />
          Match the reference viewpoint where possible.
        </div>

        <button
          type="button"
          onClick={captureCameraPhoto}
          className="w-16 h-16 rounded-full bg-[#FBF8F2] border-4 border-[#C5A059] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Capture heritage observation"
        >
          <div className="w-11 h-11 rounded-full bg-[#C5A059]" />
        </button>

        <button
          type="button"
          onClick={stopCamera}
          className="px-5 py-2.5 rounded-xl border border-[#C89D66]/40 text-[#E9D7A5] text-xs font-semibold hover:bg-white/10"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
}
