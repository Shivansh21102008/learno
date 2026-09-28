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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        data-lenis-prevent 
        className="relative w-full max-w-lg bg-glitch-panel rounded-xl shadow-2xl border border-glitch-border overflow-y-auto max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Banner */}
        <div
          className={`p-6 text-center relative border-b ${
            isHighScorer 
              ? 'bg-glitch-panel border-glitch-green shadow-[0_0_15px_rgba(0,255,102,0.2)]' 
              : 'bg-glitch-surface border-glitch-border'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 border ${isHighScorer ? 'bg-glitch-green/10 border-glitch-green/30 text-glitch-green' : 'bg-glitch-card border-glitch-border text-text-primary'}`}>
            {isHighScorer ? (
              <Trophy className="w-7 h-7" />
            ) : (
              <Sparkles className="w-7 h-7" />
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary font-display">Test Completed 🎉</h2>
          <p className="text-text-secondary font-mono text-xs mt-1">
            {result.subject} • Chapter: {result.chapter} • Test 0{result.testNumber}
          </p>
        </div>

        {/* Score Card Display */}
        <div className="p-6 sm:p-8">
          <div className="bg-glitch-surface border border-glitch-border rounded-2xl p-6 text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-text-primary font-display">
                {result.score}
              </span>
              <span className="text-2xl font-bold text-text-secondary font-display">
                / {result.totalQuestions}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-glitch-green/10 border border-glitch-green/30 text-glitch-green font-mono text-sm">
              <Target className="w-4 h-4" />
              <span>{result.accuracy}% Accuracy</span>
            </div>

            {/* Performance Visual Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-text-secondary font-mono font-medium mb-1.5">
                <span>Performance</span>
                <span>
                  {result.accuracy >= 80
                    ? 'Mastery Level'
                    : result.accuracy >= 60
                    ? 'Good Progress'
                    : 'Needs Revision'}
                </span>
              </div>
              <div className="w-full h-3 bg-glitch-ink border border-glitch-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 bg-glitch-green shadow-[0_0_10px_rgba(0,255,102,0.5)]"
                  style={{ width: `${result.accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center mb-8">
            <div className="p-3 bg-glitch-card border border-glitch-border rounded-xl font-mono">
              <div className="flex items-center justify-center text-glitch-green mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-text-primary">{result.score}</div>
              <div className="text-[11px] text-text-secondary font-medium">Correct</div>
            </div>

            <div className="p-3 bg-glitch-card border border-glitch-border rounded-xl font-mono">
              <div className="flex items-center justify-center text-red-400 mb-1">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-text-primary">{incorrectCount}</div>
              <div className="text-[11px] text-text-secondary font-medium">Incorrect</div>
            </div>

            <div className="p-3 bg-glitch-card border border-glitch-border rounded-xl font-mono">
              <div className="flex items-center justify-center text-glitch-green mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-text-primary">
                {formatTime(result.timeTakenSeconds)}
              </div>
              <div className="text-[11px] text-text-secondary font-medium">Time Taken</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onReview(result)}
              className="w-full py-3 bg-glitch-green hover:brightness-110 text-glitch-ink rounded-xl text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>Review Detailed Answers</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onRetake(result.testId)}
                className="flex-1 py-2.5 border border-glitch-border bg-glitch-card hover:bg-glitch-surface text-text-primary rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-glitch-border bg-glitch-card hover:bg-glitch-surface text-text-primary rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
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
