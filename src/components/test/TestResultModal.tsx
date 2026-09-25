import React from 'react';
import { TestResult } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  ArrowRight,
  Eye,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface TestResultModalProps {
  result: TestResult;
  onClose: () => void;
  onReview: (result: TestResult) => void;
  onRetake: (testId: string) => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  result,
  onClose,
  onReview,
  onRetake,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const incorrectCount = result.totalQuestions - result.score;
  const isHighScorer = result.accuracy >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div data-lenis-prevent className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Banner */}
        <div
          className={`p-6 text-center text-white relative ${
            isHighScorer ? 'bg-primary' : 'bg-slate-800 dark:bg-slate-850'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20">
            {isHighScorer ? (
              <Trophy className="w-7 h-7 text-amber-300" />
            ) : (
              <Sparkles className="w-7 h-7 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Test Completed 🎉</h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            {result.subject} • Chapter: {result.chapter} • Test 0{result.testNumber}
          </p>
        </div>

        {/* Score Card Display */}
        <div className="p-6 sm:p-8">
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-border dark:border-slate-700/80 rounded-2xl p-6 text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-text-primary dark:text-white">
                {result.score}
              </span>
              <span className="text-2xl font-bold text-text-secondary dark:text-slate-400">
                / {result.totalQuestions}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light font-bold text-sm">
              <Target className="w-4 h-4" />
              <span>{result.accuracy}% Accuracy</span>
            </div>

            {/* Performance Visual Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-text-secondary dark:text-slate-400 font-medium mb-1.5">
                <span>Performance</span>
                <span>
                  {result.accuracy >= 80
                    ? 'Mastery Level'
                    : result.accuracy >= 60
                    ? 'Good Progress'
                    : 'Needs Revision'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.accuracy >= 80
                      ? 'bg-success'
                      : result.accuracy >= 60
                      ? 'bg-primary'
                      : 'bg-warning'
                  }`}
                  style={{ width: `${result.accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center mb-8">
            <div className="p-3 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl">
              <div className="flex items-center justify-center text-success dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-text-primary dark:text-white">{result.score}</div>
              <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Correct</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl">
              <div className="flex items-center justify-center text-danger dark:text-rose-400 mb-1">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-text-primary dark:text-white">{incorrectCount}</div>
              <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Incorrect</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl">
              <div className="flex items-center justify-center text-primary dark:text-primary-light mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-text-primary dark:text-white">
                {formatTime(result.timeTakenSeconds)}
              </div>
              <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Time Taken</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onReview(result)}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Review Detailed Answers</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onRetake(result.testId)}
                className="flex-1 py-2.5 border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-text-primary dark:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Back to Tests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
