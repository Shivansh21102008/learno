import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Test, ProctorViolation, DisqualificationReport } from '../../types';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  AlertTriangle,
  Eye,
  EyeOff,
  Minimize2,
  Maximize2,
  Sliders,
  Hand,
  Activity,
  UserX,
} from 'lucide-react';

interface ProctorLiveOverlayProps {
  test: Test;
  stream: MediaStream | null;
  isSimulated: boolean;
  onDisqualified: (report: DisqualificationReport) => void;
}

export type ProctorPoseStatus =
  | 'Calibrating'
  | 'Centered'
  | 'Turned Left'
  | 'Turned Right'
  | 'Looking Down'
  | 'Looking Away / Eyes Diverted'
  | 'Out of Frame'
  | 'Hand Raised / Gesture'
  | 'Unusual Activity';

export const ProctorLiveOverlay: React.FC<ProctorLiveOverlayProps> = ({
  test,
  stream,
  isSimulated,
  onDisqualified,
}) => {
  const [strikes, setStrikes] = useState<number>(0);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [poseStatus, setPoseStatus] = useState<ProctorPoseStatus>('Calibrating');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<'normal' | 'high'>('high');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const violationsRef = useRef<ProctorViolation[]>([]);
  const lastStrikeTimeRef = useRef<number>(0);
  const isDisqualifiedRef = useRef<boolean>(false);

  // Optical Tracking Baseline & Calibration
  const baselineXRef = useRef<number>(80);
  const baselineYRef = useRef<number>(55);
  const baselineSkinRef = useRef<number>(250);
  const baselineGazeOffsetRef = useRef<number>(0);
  const baselineGazeOffsetYRef = useRef<number>(0);
  const calibrationFramesRef = useRef<number>(0);
  const isCalibratedRef = useRef<boolean>(false);

  // Consecutive violation counters
  const headViolationStreakRef = useRef<number>(0);
  const eyeGazeViolationStreakRef = useRef<number>(0);
  const faceMissingStreakRef = useRef<number>(0);
  const handGestureStreakRef = useRef<number>(0);
  const unusualActivityStreakRef = useRef<number>(0);
  const audioViolationStreakRef = useRef<number>(0);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  // Force calibration completion after 1.5 seconds unconditionally so detection is NEVER blocked
  useEffect(() => {
    const timer = setTimeout(() => {
      isCalibratedRef.current = true;
      setPoseStatus((prev) => (prev === 'Calibrating' ? 'Centered' : prev));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Play warning alert chime
  const playAlertChime = (frequency = 580, duration = 0.3) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio playback blocked or unsupported
    }
  };

  // Trigger final disqualification
  const triggerDisqualification = useCallback(
    (reason: string) => {
      if (isDisqualifiedRef.current) return;
      isDisqualifiedRef.current = true;

      playAlertChime(300, 0.5);

      const report: DisqualificationReport = {
        testId: test.id,
        testTitle: test.title,
        subject: test.subject,
        studentClass: test.class,
        reason,
        violations: violationsRef.current,
        disqualifiedAt: new Date().toISOString(),
      };

      onDisqualified(report);
    },
    [test, onDisqualified]
  );

  // Issue strike with 2.5s cooldown so candidate sees the warning and can correct posture
  const issueStrike = useCallback(
    (type: ProctorViolation['type'], detail: string) => {
      if (isDisqualifiedRef.current) return;

      const now = Date.now();
      if (now - lastStrikeTimeRef.current < 2500) return; // 2.5s cooldown between strikes
      lastStrikeTimeRef.current = now;

      const newViolation: ProctorViolation = {
        id: `viol-${now}`,
        type,
        timestamp: new Date().toLocaleTimeString(),
        detail,
        severity: strikes >= 2 ? 'critical' : 'warning',
      };

      violationsRef.current.push(newViolation);
      setActiveWarning(detail);
      playAlertChime(
        type === 'eye_gaze'
          ? 550
          : type === 'face_missing'
          ? 720
          : type === 'head_movement'
          ? 520
          : type === 'hand_gesture'
          ? 600
          : type === 'unusual_activity'
          ? 480
          : 680,
        0.35
      );

      setStrikes((prev) => {
        const updated = prev + 1;
        if (updated >= 3) {
          setTimeout(() => {
            let defaultReason =
              'Candidate exceeded maximum allowable academic integrity strikes during examination.';
            if (type === 'eye_gaze') {
              defaultReason =
                'Candidate repeatedly diverted eye gaze away from the examination screen (Aankhon Ki Palke Bhatki - Strike Limit Reached).';
            } else if (type === 'face_missing') {
              defaultReason =
                'Candidate repeatedly left the camera frame or was missing from view (User Hat Gaya - Strike Limit Reached).';
            } else if (type === 'hand_gesture') {
              defaultReason =
                'Candidate repeatedly raised hands or performed unauthorized gestures during examination (Integrity Strike Limit Reached).';
            } else if (type === 'unusual_activity') {
              defaultReason =
                'Candidate exhibited repetitive unusual physical body movements or suspicious activity (Integrity Strike Limit Reached).';
            } else if (type === 'head_movement') {
              defaultReason =
                'Candidate repeatedly moved head away from camera or looked down (Integrity Strike Limit Reached).';
            } else if (type === 'unusual_noise') {
              defaultReason =
                'Candidate produced or allowed excessive noise/speaking in examination room (Tez Aawaj - Strike Limit Reached).';
            }
            triggerDisqualification(defaultReason);
          }, 600);
        }
        return updated;
      });

      // Auto-dismiss warning banner after 3.2s
      setTimeout(() => {
        setActiveWarning(null);
      }, 3200);
    },
    [strikes, triggerDisqualification]
  );

  // Auto-resume AudioContext on any user interaction or touch
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    };
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // 1. Microphone Audio Monitor (Independent of video calibration)
  useEffect(() => {
    if (!stream) return;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }

    // Initialize Web Audio API
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      if (stream.getAudioTracks().length > 0) {
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.2;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const timeData = new Uint8Array(analyser.fftSize);
        const freqData = new Uint8Array(analyser.frequencyBinCount);

        const analyzeAudio = () => {
          if (isDisqualifiedRef.current) return;

          analyser.getByteTimeDomainData(timeData);
          analyser.getByteFrequencyData(freqData);

          // 1. Time-Domain RMS (waveform energy)
          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            const val = (timeData[i] - 128) / 128;
            sumSquares += val * val;
          }
          const rms = Math.sqrt(sumSquares / timeData.length);
          const rmsScore = Math.min(100, Math.round(rms * 280));

          // 2. Vocal Frequency Spectrum (150Hz - 3400Hz)
          let vocalSum = 0;
          const vocalBins = Math.min(38, freqData.length);
          for (let i = 2; i < vocalBins; i++) {
            vocalSum += freqData[i];
          }
          const vocalScore = Math.min(100, Math.round((vocalSum / ((vocalBins - 2) * 115)) * 100));

          const currentLevel = Math.max(rmsScore, vocalScore);
          setAudioLevel(currentLevel);

          // Audio Strike Trigger: Speaking or loud noise ("Tez Aawaj")
          const noiseThreshold = sensitivity === 'high' ? 30 : 38;

          if (currentLevel >= noiseThreshold) {
            audioViolationStreakRef.current += 1;
            // Triggers if sound persists for 2 check cycles (~100ms) or is a sudden loud spike (>= 48%)
            if (audioViolationStreakRef.current >= 2 || currentLevel >= 48) {
              issueStrike(
                'unusual_noise',
                `Warning: Tez Aawaj Detected (${currentLevel}% volume)! Exam room mein poori shaanti banaye rakhein.`
              );
              audioViolationStreakRef.current = 0;
            }
          } else {
            audioViolationStreakRef.current = Math.max(0, audioViolationStreakRef.current - 1);
          }

          animationFrameRef.current = requestAnimationFrame(analyzeAudio);
        };

        analyzeAudio();
      }
    } catch (e) {
      console.warn('Microphone audio analyser error:', e);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stream, issueStrike, sensitivity]);

  // 2. Optical Head Pose, Presence & Hand Movement Tracking (Runs 5 times per sec)
  useEffect(() => {
    const checkIntervalMs = 200; // 5 Hz
    const interval = setInterval(() => {
      if (isDisqualifiedRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      if (video.videoWidth === 0 || video.readyState < 2) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, 160, 120);

      const frame = ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;

      let detectedPixels = 0;
      let sumX = 0;
      let sumY = 0;
      let peripheralPixels = 0;

      // Sample every 2nd pixel (stride = 2 for high performance)
      for (let y = 10; y < 110; y += 2) {
        for (let x = 10; x < 150; x += 2) {
          const idx = (y * 160 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Universal human skin & face color detector
          const isSkinOrFace =
            (r > 40 && g > 25 && b > 15 && r > b && (r - g) >= 4) ||
            (0.299 * r + 0.587 * g + 0.114 * b >= 25 &&
              (b - (0.299 * r + 0.587 * g + 0.114 * b)) * 0.564 + 128 >= 65 &&
              (b - (0.299 * r + 0.587 * g + 0.114 * b)) * 0.564 + 128 <= 145 &&
              (r - (0.299 * r + 0.587 * g + 0.114 * b)) * 0.713 + 128 >= 125 &&
              (r - (0.299 * r + 0.587 * g + 0.114 * b)) * 0.713 + 128 <= 190);

          if (isSkinOrFace) {
            detectedPixels++;
            sumX += x;
            sumY += y;

            // Check if pixel is in upper/mid peripheral zone (indicates a raised hand or arm)
            const isPeripheral =
              x < baselineXRef.current - 32 ||
              x > baselineXRef.current + 32 ||
              (y < 75 && (x < baselineXRef.current - 22 || x > baselineXRef.current + 22));

            if (isPeripheral) {
              peripheralPixels++;
            }
          }
        }
      }

      // Optical Motion Delta
      let motionDelta = 0;
      if (prevFrameDataRef.current) {
        for (let i = 0; i < data.length; i += 16) {
          motionDelta += Math.abs(data[i] - prevFrameDataRef.current[i]);
        }
      }
      prevFrameDataRef.current = new Uint8ClampedArray(data);
      const avgMotion = motionDelta / (data.length / 16);

      // --- Fast Calibration in first 6 frames (~1.2s) ---
      if (!isCalibratedRef.current) {
        calibrationFramesRef.current += 1;
        if (detectedPixels >= 35) {
          const cx = sumX / detectedPixels;
          const cy = sumY / detectedPixels;
          const f = Math.min(8, calibrationFramesRef.current);
          baselineXRef.current = (baselineXRef.current * f + cx) / (f + 1);
          baselineYRef.current = (baselineYRef.current * f + cy) / (f + 1);
          baselineSkinRef.current = (baselineSkinRef.current * f + detectedPixels) / (f + 1);
        }
        if (calibrationFramesRef.current >= 6) {
          isCalibratedRef.current = true;
          setPoseStatus('Centered');
        }
        return;
      }

      // 1. CHECK: Candidate Out of Frame ("user hat gaya")
      // If student ducks, covers camera, or leaves frame: detectedPixels drops significantly (< 28)
      if (detectedPixels < 28) {
        faceMissingStreakRef.current += 1;
        if (faceMissingStreakRef.current >= 2) {
          setPoseStatus('Out of Frame');
          issueStrike(
            'face_missing',
            'Warning: User Hat Gaya Hai! Candidate camera frame se gayab hai. Turant screen ke saamne aaiye!'
          );
        }
        return;
      } else {
        faceMissingStreakRef.current = 0;
      }

      // 2. CHECK: Hand Raised / Hand Gesture ("haath utha diya")
      // A hand raised into the camera produces motion (avgMotion >= 7) AND peripheral skin pixels
      const isHandRaised =
        avgMotion >= 7 &&
        (peripheralPixels >= 25 || detectedPixels > baselineSkinRef.current * 1.32);

      if (isHandRaised) {
        handGestureStreakRef.current += 1;
        if (handGestureStreakRef.current >= 2) {
          setPoseStatus('Hand Raised / Gesture');
          issueStrike(
            'hand_gesture',
            'Suspicious activity detected! Hand raised or gesture in camera frame. Keep hands down on keyboard.'
          );
        }
        return;
      } else {
        handGestureStreakRef.current = Math.max(0, handGestureStreakRef.current - 1);
      }

      // 3. CHECK: Unusual Sudden Physical Movement (rapid pacing, erratic motion)
      const activityThreshold = sensitivity === 'high' ? 18 : 24;
      if (avgMotion >= activityThreshold) {
        unusualActivityStreakRef.current += 1;
        if (unusualActivityStreakRef.current >= 2) {
          setPoseStatus('Unusual Activity');
          issueStrike(
            'unusual_activity',
            'Unusual rapid physical movement in camera frame! Remain seated and still.'
          );
        }
        return;
      } else {
        unusualActivityStreakRef.current = Math.max(0, unusualActivityStreakRef.current - 1);
      }

      const cx = sumX / detectedPixels;
      const cy = sumY / detectedPixels;
      const dx = cx - baselineXRef.current;
      const dy = cy - baselineYRef.current;

      // 4. 👁️ Ocular Eye Gaze & Eyelid Tracking ("aankhon ki palke idhar udhar hona")
      let leftDarkSum = 0, leftDarkCount = 0, leftDarkSumX = 0, leftDarkSumY = 0;
      let rightDarkSum = 0, rightDarkCount = 0, rightDarkSumX = 0, rightDarkSumY = 0;

      const eyeYMin = Math.max(0, Math.round(cy - 16));
      const eyeYMax = Math.min(119, Math.round(cy - 3));
      const leftEyeXMin = Math.max(0, Math.round(cx - 22));
      const leftEyeXMax = Math.min(159, Math.round(cx - 4));
      const rightEyeXMin = Math.max(0, Math.round(cx + 4));
      const rightEyeXMax = Math.min(159, Math.round(cx + 22));

      for (let ey = eyeYMin; ey <= eyeYMax; ey++) {
        for (let ex = leftEyeXMin; ex <= leftEyeXMax; ex++) {
          const idx = (ey * 160 + ex) * 4;
          const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          const darkness = Math.max(0, 160 - lum);
          if (darkness > 30) {
            leftDarkSum += darkness;
            leftDarkCount++;
            leftDarkSumX += ex * darkness;
            leftDarkSumY += ey * darkness;
          }
        }
        for (let ex = rightEyeXMin; ex <= rightEyeXMax; ex++) {
          const idx = (ey * 160 + ex) * 4;
          const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          const darkness = Math.max(0, 160 - lum);
          if (darkness > 30) {
            rightDarkSum += darkness;
            rightDarkCount++;
            rightDarkSumX += ex * darkness;
            rightDarkSumY += ey * darkness;
          }
        }
      }

      let avgGazeDeltaX = 0;
      let avgGazeDeltaY = 0;
      let hasValidEyeTracking = false;

      if (leftDarkCount >= 5 && rightDarkCount >= 5 && leftDarkSum > 0 && rightDarkSum > 0) {
        const leftPupilX = leftDarkSumX / leftDarkSum;
        const leftPupilY = leftDarkSumY / leftDarkSum;
        const rightPupilX = rightDarkSumX / rightDarkSum;
        const rightPupilY = rightDarkSumY / rightDarkSum;

        const leftSocketCenterX = (leftEyeXMin + leftEyeXMax) / 2;
        const rightSocketCenterX = (rightEyeXMin + rightEyeXMax) / 2;
        const socketCenterY = (eyeYMin + eyeYMax) / 2;

        const leftEyeOffsetX = leftPupilX - leftSocketCenterX;
        const rightEyeOffsetX = rightPupilX - rightSocketCenterX;
        const currentGazeX = (leftEyeOffsetX + rightEyeOffsetX) / 2;
        const currentGazeY = ((leftPupilY - socketCenterY) + (rightPupilY - socketCenterY)) / 2;

        if (!isCalibratedRef.current) {
          baselineGazeOffsetRef.current = currentGazeX;
          baselineGazeOffsetYRef.current = currentGazeY;
        } else {
          avgGazeDeltaX = currentGazeX - baselineGazeOffsetRef.current;
          avgGazeDeltaY = currentGazeY - baselineGazeOffsetYRef.current;
          hasValidEyeTracking = true;
        }
      }

      const horizThreshold = sensitivity === 'high' ? 16 : 22;
      const vertThreshold = sensitivity === 'high' ? 18 : 24;
      const gazeThresholdX = sensitivity === 'high' ? 3.0 : 4.5;
      const gazeThresholdY = sensitivity === 'high' ? 3.2 : 4.8;

      const isGazeDiverted =
        hasValidEyeTracking &&
        (Math.abs(avgGazeDeltaX) > gazeThresholdX || Math.abs(avgGazeDeltaY) > gazeThresholdY);

      if (isGazeDiverted && Math.abs(dx) <= horizThreshold && Math.abs(dy) <= vertThreshold) {
        eyeGazeViolationStreakRef.current += 1;
        if (eyeGazeViolationStreakRef.current >= 2) {
          setPoseStatus('Looking Away / Eyes Diverted');
          const direction =
            avgGazeDeltaX < -gazeThresholdX
              ? 'baayi taraf (left)'
              : avgGazeDeltaX > gazeThresholdX
              ? 'daayi taraf (right)'
              : avgGazeDeltaY > gazeThresholdY
              ? 'neeche (downward)'
              : 'upar (upward)';
          issueStrike(
            'eye_gaze',
            `Warning: Aankhon ki palke ${direction} bhatak rahi hain! Keep your gaze locked on the examination screen.`
          );
        }
        return;
      } else {
        eyeGazeViolationStreakRef.current = Math.max(0, eyeGazeViolationStreakRef.current - 1);
      }

      // 5. CHECK: Head Turned Left, Right, or Looking Down ("head ghuma diya")
      if (dx < -horizThreshold) {
        // Head turned left
        headViolationStreakRef.current += 1;
        if (headViolationStreakRef.current >= 2) {
          setPoseStatus('Turned Left');
          issueStrike(
            'head_movement',
            'Warning: Head turned to the left! Keep your face and eyes facing straight at the screen.'
          );
        }
      } else if (dx > horizThreshold) {
        // Head turned right
        headViolationStreakRef.current += 1;
        if (headViolationStreakRef.current >= 2) {
          setPoseStatus('Turned Right');
          issueStrike(
            'head_movement',
            'Warning: Head turned to the right! Keep your face and eyes facing straight at the screen.'
          );
        }
      } else if (dy > vertThreshold) {
        // Looking down
        headViolationStreakRef.current += 1;
        if (headViolationStreakRef.current >= 2) {
          setPoseStatus('Looking Down');
          issueStrike(
            'head_movement',
            'Warning: Candidate looking down away from camera! Keep your head up facing the examination.'
          );
        }
      } else {
        headViolationStreakRef.current = 0;
        setPoseStatus('Centered');
      }
    }, checkIntervalMs);

    return () => clearInterval(interval);
  }, [issueStrike, sensitivity]);

  // Manual test trigger helpers
  const handleManualEyeGaze = () => {
    setPoseStatus('Looking Away / Eyes Diverted');
    issueStrike(
      'eye_gaze',
      'Warning: Aankhon ki palke/gaze bhatak rahi hain! (Simulated Eye Gaze Deviation).'
    );
  };

  const handleManualNoise = () => {
    setAudioLevel(88);
    issueStrike(
      'unusual_noise',
      'Warning: Tez Aawaj Detected (88% volume)! Exam room mein poori shaanti banaye rakhein.'
    );
  };

  const handleManualUserMissing = () => {
    setPoseStatus('Out of Frame');
    issueStrike(
      'face_missing',
      'Warning: User Hat Gaya Hai! Candidate camera frame se gayab hai. Turant screen ke saamne aaiye!'
    );
  };

  const handleManualHeadTurn = () => {
    setPoseStatus('Turned Left');
    issueStrike('head_movement', 'Simulated Head Turn: Student moved head away from camera.');
  };

  const handleManualHandRaised = () => {
    setPoseStatus('Hand Raised / Gesture');
    issueStrike(
      'hand_gesture',
      'Simulated Hand Movement: Candidate raised hand or gestured in front of camera.'
    );
  };

  const handleManualUnusualActivity = () => {
    setPoseStatus('Unusual Activity');
    issueStrike(
      'unusual_activity',
      'Simulated Activity: Rapid erratic movement or suspicious activity detected.'
    );
  };

  return (
    <>
      {/* Hidden processing canvas for optical analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Active Warning Alert Banner */}
      {activeWarning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-in slide-in-from-top-4 duration-200">
          <div className="p-3.5 bg-rose-600 text-white rounded-2xl shadow-2xl border-2 border-rose-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-rose-600 flex items-center justify-center font-extrabold flex-shrink-0 shadow">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-200">
                  AI Proctor Security Warning • Strike {strikes} of 3
                </div>
                <div className="text-xs font-bold leading-snug">{activeWarning}</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-800 text-[10px] font-black uppercase tracking-wide flex-shrink-0">
              {strikes >= 2 ? 'Final Strike' : 'Warning'}
            </span>
          </div>
        </div>
      )}

      {/* Persistent Corner Proctor HUD */}
      <aside
        className={`fixed bottom-4 right-4 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 transition-all ${
          strikes > 0
            ? 'border-rose-500 shadow-rose-500/20'
            : 'border-primary/60 dark:border-primary/40'
        } ${isMinimized ? 'w-64 p-3' : 'w-72 sm:w-84 p-3.5'}`}
      >
        {/* HUD Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold text-text-primary dark:text-white uppercase tracking-wider">
              AI Proctor Active
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Strike Badges */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-border dark:border-slate-700">
              <ShieldAlert className="w-3 h-3 text-rose-500" />
              <span className="text-[10px] font-bold text-text-secondary dark:text-slate-300">
                Strikes: <strong className={strikes > 0 ? 'text-rose-500' : ''}>{strikes}/3</strong>
              </span>
            </div>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
              title={isMinimized ? 'Expand Proctor HUD' : 'Minimize Proctor HUD'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="space-y-2.5">
            {/* Live Camera View with Face Reticle Target */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border dark:border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />

              {/* Activity tracking reticle box */}
              <div
                className={`absolute inset-3 border-2 rounded-lg pointer-events-none transition-all duration-200 flex items-center justify-center ${
                  poseStatus === 'Centered'
                    ? 'border-emerald-400/70 bg-emerald-500/5'
                    : poseStatus === 'Calibrating'
                    ? 'border-blue-400/80 bg-blue-500/10'
                    : poseStatus === 'Looking Away / Eyes Diverted'
                    ? 'border-amber-400/90 animate-pulse bg-amber-500/15'
                    : 'border-rose-500 animate-pulse bg-rose-500/20'
                }`}
              >
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-md shadow flex items-center gap-1 ${
                    poseStatus === 'Centered'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : poseStatus === 'Calibrating'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                      : poseStatus === 'Out of Frame'
                      ? 'bg-rose-950/95 text-rose-200 border-2 border-rose-500 animate-bounce'
                      : poseStatus === 'Looking Away / Eyes Diverted'
                      ? 'bg-amber-950/95 text-amber-200 border-2 border-amber-500/80 animate-pulse'
                      : poseStatus === 'Hand Raised / Gesture'
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-500/60'
                      : poseStatus === 'Unusual Activity'
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-500/60'
                      : 'bg-rose-950/90 text-rose-300 border border-rose-500/60'
                  }`}
                >
                  {poseStatus === 'Calibrating' ? (
                    <>● Calibrating AI Gaze & Audio...</>
                  ) : poseStatus === 'Centered' ? (
                    <>● Centered • Eyes On Screen</>
                  ) : poseStatus === 'Out of Frame' ? (
                    <>
                      <UserX className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                      🚨 User Hat Gaya (Out of Frame)
                    </>
                  ) : poseStatus === 'Looking Away / Eyes Diverted' ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      ⚠️ Palke Bhatki (Eyes Looking Away)
                    </>
                  ) : poseStatus === 'Hand Raised / Gesture' ? (
                    <>
                      <Hand className="w-3.5 h-3.5 text-rose-300 animate-bounce" />
                      Alert: Hand Raised
                    </>
                  ) : poseStatus === 'Unusual Activity' ? (
                    <>
                      <Activity className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                      Alert: Unusual Activity
                    </>
                  ) : (
                    <>⚠️ Alert: {poseStatus}</>
                  )}
                </span>
              </div>

              {isSimulated && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-blue-600/90 text-white text-[8px] font-bold">
                  Virtual Test Feed
                </div>
              )}

              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-300 text-[8px] font-mono">
                Auto-Scanning (5 Hz)
              </div>
            </div>

            {/* Audio Decibel Level Visualizer */}
            <div
              className={`p-2 rounded-xl transition-colors border ${
                audioLevel >= (sensitivity === 'high' ? 30 : 38)
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/60'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-border dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-text-secondary dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  {audioLevel >= (sensitivity === 'high' ? 30 : 38) ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  Room Audio Monitor
                </span>
                <span
                  className={
                    audioLevel >= (sensitivity === 'high' ? 30 : 38)
                      ? 'text-rose-600 dark:text-rose-400 font-extrabold animate-pulse'
                      : 'text-text-secondary dark:text-slate-400'
                  }
                >
                  {audioLevel}%{' '}
                  {audioLevel >= (sensitivity === 'high' ? 30 : 38)
                    ? '⚠️ TEZ AAWAJ DETECTED!'
                    : '(Silent)'}
                </span>
              </div>

              {/* Progress bar with threshold indicator */}
              <div className="relative w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    audioLevel >= (sensitivity === 'high' ? 30 : 38)
                      ? 'bg-rose-500'
                      : audioLevel > 22
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(4, audioLevel)}%` }}
                />
                {/* Red strike threshold tick */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-600 z-10 shadow"
                  style={{ left: `${sensitivity === 'high' ? 30 : 38}%` }}
                  title="Noise strike threshold"
                />
              </div>
              <div className="flex justify-between text-[8px] text-text-secondary dark:text-slate-400 mt-1">
                <span>0% Silence</span>
                <span className="text-rose-500 font-bold">
                  Strike Threshold ({sensitivity === 'high' ? '30%' : '38%'})
                </span>
                <span>100% Loud</span>
              </div>
            </div>

            {/* Sensitivity Selection */}
            <div className="flex items-center justify-between gap-1 text-[10px] px-1">
              <span className="text-[9px] text-text-secondary dark:text-slate-400 font-semibold flex items-center gap-1">
                <Sliders className="w-3 h-3 text-primary" /> Sensitivity:
              </span>
              <div className="flex gap-1 items-center">
                <button
                  type="button"
                  onClick={() => setSensitivity('normal')}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                    sensitivity === 'normal'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-slate-300'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setSensitivity('high')}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                    sensitivity === 'high'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-slate-300'
                  }`}
                >
                  High (Responsive)
                </button>
              </div>
            </div>

            {/* Manual Testing Toolbar */}
            <div className="pt-1.5 border-t border-border dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[9px] text-text-secondary dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold">
                  Manual Warning Test Controls:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    triggerDisqualification('Candidate Disqualified (Manual Test Demonstration)')
                  }
                  className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-200 transition-colors"
                >
                  Disqualify
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={handleManualEyeGaze}
                  className="py-1 px-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-950/60 text-text-primary dark:text-slate-200 text-[8.5px] font-bold transition-colors border border-border dark:border-slate-700 flex items-center justify-center gap-1"
                  title="Test: Aankhein/Palke idhar-udhar bhatakne par warning"
                >
                  <Eye className="w-2.5 h-2.5 text-amber-500" /> Palke Bhatki
                </button>
                <button
                  type="button"
                  onClick={handleManualNoise}
                  className="py-1 px-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-950/60 text-text-primary dark:text-slate-200 text-[8.5px] font-bold transition-colors border border-border dark:border-slate-700 flex items-center justify-center gap-1"
                  title="Test: Tez aawaj hone par warning"
                >
                  <Volume2 className="w-2.5 h-2.5 text-rose-500" /> Tez Aawaj
                </button>
                <button
                  type="button"
                  onClick={handleManualUserMissing}
                  className="py-1 px-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-950/60 text-text-primary dark:text-slate-200 text-[8.5px] font-bold transition-colors border border-border dark:border-slate-700 flex items-center justify-center gap-1"
                  title="Test: User camera frame se hatne par warning"
                >
                  <UserX className="w-2.5 h-2.5 text-rose-600" /> User Hat Gaya
                </button>
                <button
                  type="button"
                  onClick={handleManualHeadTurn}
                  className="py-1 px-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-800 text-text-primary dark:text-slate-200 text-[8.5px] font-bold transition-colors border border-border dark:border-slate-700 flex items-center justify-center gap-1"
                >
                  <EyeOff className="w-2.5 h-2.5 text-blue-500" /> Head Turn
                </button>
                <button
                  type="button"
                  onClick={handleManualHandRaised}
                  className="py-1 px-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 hover:text-purple-800 text-text-primary dark:text-slate-200 text-[8.5px] font-bold transition-colors border border-border dark:border-slate-700 flex items-center justify-center gap-1"
                >
                  <Hand className="w-2.5 h-2.5 text-purple-500" /> Hand Raised
                </button>
                <button
                  type="button"
                  onClick={handleManualUnusualActivity}
                  className="py-1 px-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 hover:text-orange-800 text-text-primary dark:text-slate-200 text-[8.5px] font-bold transition-colors border border-border dark:border-slate-700 flex items-center justify-center gap-1"
                >
                  <Activity className="w-2.5 h-2.5 text-orange-500" /> Motion
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
