import React, { useState, useEffect, useRef } from 'react';
import { Test } from '../../types';
import {
  Camera,
  Mic,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Video,
  Volume2,
  ArrowRight,
  X,
  Sparkles,
  Hand,
  EyeOff,
  UserX,
  MonitorX,
  VolumeX,
} from 'lucide-react';

interface ProctorPrecheckModalProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
  onVerified: (stream: MediaStream | null, isSimulated: boolean) => void;
}

export const ProctorPrecheckModal: React.FC<ProctorPrecheckModalProps> = ({
  test,
  isOpen,
  onClose,
  onVerified,
}) => {
  const [cameraStatus, setCameraStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [micStatus, setMicStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isSimulated, setIsSimulated] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isTransferredRef = useRef<boolean>(false);

  // Clean up media streams
  const stopTracks = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (!isTransferredRef.current && mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const requestPermissions = async () => {
    setErrorMessage(null);
    setCameraStatus('pending');
    setMicStatus('pending');
    stopTracks();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support webcam or microphone media devices.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: true,
      });

      mediaStreamRef.current = stream;
      setCameraStatus('granted');
      setMicStatus('granted');
      setIsSimulated(false);

      // Attach video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Setup audio analyzer
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Camera/Mic permission rejected or unavailable:', error);
      setCameraStatus('denied');
      setMicStatus('denied');
      setErrorMessage(
        error.name === 'NotAllowedError'
          ? 'Permission denied. Please allow camera and microphone access in your browser address bar to unlock this Main Examination.'
          : error.message || 'Unable to access camera or microphone device. Please check your connections.'
      );
    }
  };

  // Virtual simulator mode if user is testing without physical webcam
  const enableSimulatorMode = () => {
    stopTracks();
    setIsSimulated(true);
    setCameraStatus('granted');
    setMicStatus('granted');
    setErrorMessage(null);

    // Create synthetic canvas video stream
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const drawSimulatedFrame = () => {
        // Draw dark proctoring background
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, 320, 240);

        // Draw natural stylized student face
        ctx.fillStyle = '#E2A166';
        ctx.beginPath();
        ctx.arc(160, 110, 50, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(160, 95, 50, Math.PI, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(142, 105, 5, 0, Math.PI * 2);
        ctx.arc(178, 105, 5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#9A3412';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(160, 125, 18, 0.2, Math.PI - 0.2);
        ctx.stroke();

        ctx.fillStyle = '#22C55E';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('● VIRTUAL STUDENT CAMERA FEED', 15, 25);
      };
      drawSimulatedFrame();
      const canvasStream = canvas.captureStream(15);
      mediaStreamRef.current = canvasStream;

      // Add synthetic audio track to canvas stream so AudioContext doesn't fail
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const simAudioCtx = new AudioCtx();
        const osc = simAudioCtx.createOscillator();
        const dst = simAudioCtx.createMediaStreamDestination();
        const gain = simAudioCtx.createGain();
        gain.gain.value = 0.0001;
        osc.connect(gain);
        gain.connect(dst);
        osc.start();
        if (dst.stream.getAudioTracks().length > 0) {
          canvasStream.addTrack(dst.stream.getAudioTracks()[0]);
        }
      } catch {
        // Fallback if AudioContext unavailable
      }

      if (videoRef.current) {
        videoRef.current.srcObject = canvasStream;
        videoRef.current.play().catch(() => {});
      }
    }

    // Simulate gentle breathing audio level
    const timer = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 15) + 5);
    }, 200);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    if (isOpen) {
      isTransferredRef.current = false;
      requestPermissions();
    } else {
      stopTracks();
    }

    return () => {
      stopTracks();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAllGranted = cameraStatus === 'granted' && micStatus === 'granted';

  const handleStartExam = () => {
    if (!isAllGranted) return;
    isTransferredRef.current = true;
    onVerified(mediaStreamRef.current, isSimulated);
  };

  const handleClose = () => {
    isTransferredRef.current = false;
    stopTracks();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div data-lenis-prevent className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-200">
                  Learno AI Proctor Guard
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                  Official Main Exam
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight mt-0.5">
                Device Verification & Examination Instructions
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Exam Summary Pill */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-border dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                Examination Selected
              </div>
              <div className="text-sm font-extrabold text-text-primary dark:text-white">
                {test.title} • {test.class}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-primary dark:text-primary-light">
                {test.questionsCount} Multiple Choice Questions
              </div>
              <div className="text-[11px] text-text-secondary dark:text-slate-400">
                {test.durationMinutes} Minutes Time Allowed
              </div>
            </div>
          </div>

          {/* Full Instructions & Code of Conduct Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border dark:border-slate-700">
              <div className="font-extrabold text-xs text-text-primary dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Mandatory Examination Rules & Code of Conduct</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                Strict Proctoring
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="block text-text-primary dark:text-white font-bold">Eyes & Face Centered (Palke Screen Par)</strong>
                  <span className="text-text-secondary dark:text-slate-400 text-[10px] leading-snug">
                    Aankhon ki palke aur face screen par focused honi chahiye. Palke idhar-udhar bhatakne ya head turn hone par warning aayegi.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="block text-text-primary dark:text-white font-bold">User Frame Se Hatne Par Warning</strong>
                  <span className="text-text-secondary dark:text-slate-400 text-[10px] leading-snug">
                    Candidate camera frame se hatna nahi chahiye. Camera se hatne ya face gayab hone par turant security warning aayegi.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="block text-text-primary dark:text-white font-bold">Tez Aawaj Par Warning (Silence Required)</strong>
                  <span className="text-text-secondary dark:text-slate-400 text-[10px] leading-snug">
                    Exam room mein poori shaanti banaye rakhein. Bolna, aawaj aana ya tez aawaj hone par instant warning trigger hogi.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="block text-text-primary dark:text-white font-bold">Hands on Desk / Keyboard</strong>
                  <span className="text-text-secondary dark:text-slate-400 text-[10px] leading-snug">
                    Both hands must stay on desk. Raising hands, gestures, or covering face/mouth is strictly flagged.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <strong className="block text-text-primary dark:text-white font-bold">Candidate Must Be Alone</strong>
                  <span className="text-text-secondary dark:text-slate-400 text-[10px] leading-snug">
                    Only the candidate is permitted in the camera view. No second person or outside devices allowed.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-200 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                  6
                </span>
                <div>
                  <strong className="block text-rose-900 dark:text-rose-300 font-bold">3 Strikes = Disqualified</strong>
                  <span className="text-rose-800 dark:text-rose-400 text-[10px] leading-snug">
                    Strikes 1 & 2 are audio warnings. Strike 3 instantly terminates the exam with a permanent incident report.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Feeds & Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera Box */}
            <div className="flex flex-col items-center justify-center p-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-border dark:border-slate-700 relative overflow-hidden min-h-[160px]">
              {cameraStatus === 'granted' ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Camera Active
                  </div>
                  {isSimulated && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[9px] font-bold">
                      Virtual Feed
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-500 mx-auto flex items-center justify-center mb-2">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-text-primary dark:text-white">
                    {cameraStatus === 'pending' ? 'Detecting Camera...' : 'Camera Access Required'}
                  </div>
                  <div className="text-[11px] text-text-secondary dark:text-slate-400 mt-0.5">
                    {cameraStatus === 'pending' ? 'Please grant permission when prompted' : 'Camera is blocked or turned off'}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Box */}
            <div className="flex flex-col justify-between p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-border dark:border-slate-700 min-h-[160px]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-400">
                      <Mic className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-text-primary dark:text-white">
                      Microphone Status
                    </span>
                  </div>
                  {micStatus === 'granted' ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Not Connected
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-text-secondary dark:text-slate-400 leading-relaxed">
                  Real-time ambient noise analyzer. Speak to test your audio input.
                </p>
              </div>

              {/* Volume VU Meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-text-secondary dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Live Audio Level
                  </span>
                  <span>{audioLevel}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      audioLevel > 50
                        ? 'bg-rose-500'
                        : audioLevel > 25
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(4, audioLevel)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Banner if Permission Denied */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>Examination Blocked: Camera & Microphone Permission Denied</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {errorMessage}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={requestPermissions}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Retry Device Check
                </button>
                <button
                  type="button"
                  onClick={enableSimulatorMode}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Virtual Camera & Mic Simulator (Test Mode)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-border dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-text-secondary dark:text-slate-400 text-center sm:text-left">
            {isAllGranted ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 inline" /> All security checks passed. Ready to begin!
              </span>
            ) : (
              <span className="text-rose-500 dark:text-rose-400 font-semibold">
                ⚠️ Camera and audio must be active before opening the exam.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-border dark:border-slate-700 text-text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartExam}
              disabled={!isAllGranted}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Enter Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
