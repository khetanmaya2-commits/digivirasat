import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react';

/**
 * LiveCameraModal Component
 * Implements real-time browser camera capture via navigator.mediaDevices.getUserMedia
 */
export default function LiveCameraModal({ isOpen, onClose, onPhotoCaptured }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // environment (rear) or user (front)

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Primary camera error, trying fallback:', err);
      // Fallback to generic video
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr) {
        console.error('Camera fallback failed:', fallbackErr);
        setCameraError(
          fallbackErr.name === 'NotAllowedError'
            ? 'Camera access was denied. Please permit camera permissions in your browser.'
            : 'Unable to connect to camera device. Ensure no other application is using it.'
        );
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedBlob) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [isOpen, facingMode]);

  // Capture current video frame to canvas
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setPreviewUrl(url);
        stopCamera();
      },
      'image/jpeg',
      0.92
    );
  };

  // Retake photo
  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCapturedBlob(null);
    setPreviewUrl(null);
    startCamera();
  };

  // Confirm photo usage
  const handleUsePhoto = () => {
    if (!capturedBlob) return;
    const file = new File([capturedBlob], `sheesh-mahal-visitor-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    onPhotoCaptured(file, previewUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md no-print select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Live camera capture"
    >
      <div className="relative w-full max-w-2xl bg-[#1F1813] text-white rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C5A059]/30 bg-[#16120E]">
          <div className="flex items-center gap-2.5">
            <Camera size={18} className="text-[#C5A059]" />
            <span className="font-serif font-bold text-sm sm:text-base text-white">
              Live Heritage Camera &bull; Sheesh Mahal
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!capturedBlob && stream && (
              <button
                type="button"
                onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 transition-colors"
                title="Switch Camera"
              >
                Flip
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close camera"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 max-w-sm">
              <AlertCircle size={32} className="text-amber-500 mx-auto" />
              <p className="text-sm text-stone-300 leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#16120E] text-xs font-bold"
              >
                Retry Camera
              </button>
            </div>
          ) : !capturedBlob ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Target Focus Overlay */}
              <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between text-[10px] font-mono text-[#E9D7A5]">
                  <span>[ ALIGN WALL FAÇADE ]</span>
                  <span>DIFFUSE LIGHT</span>
                </div>
                <div className="text-center text-[11px] font-hindi text-white/70">
                  दीवार के दर्पण अलंकरण को फ्रेम में सीधा रखें
                </div>
              </div>
            </>
          ) : (
            <img
              src={previewUrl}
              alt="Captured observation"
              className="w-full h-full object-contain"
            />
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#16120E] border-t border-[#C5A059]/30 flex items-center justify-between gap-4">
          {!capturedBlob ? (
            <>
              <span className="text-xs text-stone-400">Position camera steadily</span>
              <button
                type="button"
                onClick={handleCapture}
                disabled={!stream}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] font-bold text-xs hover:brightness-110 shadow-lg disabled:opacity-50 transition-transform active:scale-95 cursor-pointer"
              >
                <Camera size={16} />
                <span>Capture Photograph</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleUsePhoto}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#16120E] font-bold text-xs transition-colors cursor-pointer"
              >
                <Check size={16} />
                <span>Use This Photograph</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
