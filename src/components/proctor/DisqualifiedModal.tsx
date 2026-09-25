import React, { useState, useEffect } from 'react';
import { DisqualificationReport } from '../../types';
import {
  AlertOctagon,
  EyeOff,
  Eye,
  UserX,
  VolumeX,
  Clock,
  ShieldAlert,
  FileWarning,
  Hand,
  Activity,
  Home,
  LayoutDashboard,
  Timer,
  Lock,
} from 'lucide-react';

interface DisqualifiedModalProps {
  report: DisqualificationReport;
  onExit?: () => void;
  onBackToHome?: () => void;
  onBackToDashboard?: () => void;
}

export const DisqualifiedModal: React.FC<DisqualifiedModalProps> = ({
  report,
  onExit,
  onBackToHome,
  onBackToDashboard,
}) => {
  const lockedUntil = report.lockedUntil || (Date.now() + 24 * 60 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(Math.max(0, lockedUntil - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, lockedUntil - Date.now());
      setRemainingMs(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const formattedUnlockDate = new Date(lockedUntil).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div data-lenis-prevent className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Alert */}
        <div className="p-6 bg-gradient-to-r from-rose-600 to-red-700 text-white text-center space-y-2 flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center shadow-lg animate-bounce">
            <AlertOctagon className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/50 text-rose-200 text-xs font-extrabold uppercase tracking-widest border border-rose-400/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            Security & Integrity Violation
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            EXAMINATION DISQUALIFIED
          </h2>
          <p className="text-xs text-rose-100 max-w-sm mx-auto leading-relaxed">
            Your examination session has been terminated by the Learno AI Proctoring Guard for breach of examination rules.
          </p>
        </div>

        {/* Report Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* 24-Hour Academic Lockout Notice */}
          <div className="p-4 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-red-500/15 border-2 border-amber-500/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                24-Hour Academic Lockout Imposed
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                Strict Policy
              </span>
            </div>
            <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed">
              Under official proctored examination rules, disqualified candidates are <strong className="text-rose-600 dark:text-rose-400">ineligible to retake this examination for 24 hours</strong>.
            </p>
            <div className="p-3 bg-white/70 dark:bg-slate-800/80 rounded-xl border border-amber-300/50 dark:border-amber-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-secondary dark:text-slate-400 block">
                  Eligible to retake on
                </span>
                <span className="text-xs font-extrabold text-text-primary dark:text-white">
                  {formattedUnlockDate}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase text-text-secondary dark:text-slate-400 block flex items-center sm:justify-end gap-1">
                  <Timer className="w-3 h-3 text-amber-500" />
                  Time Remaining
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">
                  {hours}h {minutes}m {seconds}s
                </span>
              </div>
            </div>
          </div>

          {/* Incident Summary Card */}
          <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-rose-200 dark:border-rose-900">
              <span className="font-bold text-rose-900 dark:text-rose-300">Examination</span>
              <span className="font-extrabold text-text-primary dark:text-white">{report.testTitle}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-rose-200 dark:border-rose-900">
              <span className="font-bold text-rose-900 dark:text-rose-300">Academic Class</span>
              <span className="font-semibold text-text-primary dark:text-white">{report.studentClass}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-rose-200 dark:border-rose-900">
              <span className="font-bold text-rose-900 dark:text-rose-300">Incident Timestamp</span>
              <span className="font-semibold text-text-primary dark:text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                {new Date(report.disqualifiedAt).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-1">
                Primary Disqualification Reason
              </div>
              <div className="text-sm font-bold text-rose-700 dark:text-rose-400">
                {report.reason}
              </div>
            </div>
          </div>

          {/* Infractions Log */}
          <div>
            <h4 className="text-xs font-bold text-text-primary dark:text-white mb-2.5 flex items-center gap-1.5">
              <FileWarning className="w-4 h-4 text-amber-500" />
              <span>Proctoring Incident Log</span>
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {report.violations.map((v, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 flex items-start gap-2.5 text-xs"
                >
                  <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5">
                    {v.type === 'hand_gesture' ? (
                      <Hand className="w-3.5 h-3.5" />
                    ) : v.type === 'unusual_activity' ? (
                      <Activity className="w-3.5 h-3.5" />
                    ) : v.type === 'eye_gaze' ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : v.type === 'face_missing' ? (
                      <UserX className="w-3.5 h-3.5" />
                    ) : v.type === 'head_movement' ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-text-primary dark:text-white flex items-center justify-between">
                      <span className="capitalize">{v.type.replace('_', ' ')}</span>
                      <span className="text-[10px] text-text-secondary dark:text-slate-400 font-normal">
                        {v.timestamp}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary dark:text-slate-300 mt-0.5">
                      {v.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Warning Note */}
          <p className="text-[11px] text-text-secondary dark:text-slate-400 text-center leading-relaxed">
            Main Examinations are officially proctored. Candidates must maintain strict posture facing the camera with zero ambient noise. This incident has been logged.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onBackToHome || onExit}
              className="w-full sm:flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={onBackToDashboard || onExit || onBackToHome}
              className="w-full sm:flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-primary dark:text-slate-200 text-xs font-bold rounded-xl border border-border dark:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
