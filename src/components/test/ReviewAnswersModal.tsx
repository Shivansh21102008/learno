import React, { useState } from 'react';
import { TestResult, Test } from '../../types';
import { X, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface ReviewAnswersModalProps {
  result: TestResult;
  test: Test;
  onClose: () => void;
}

export const ReviewAnswersModal: React.FC<ReviewAnswersModalProps> = ({
  result,
  test,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQ = test.questions[currentIndex];
  const studentAnswer = result.answers[currentIndex];
  const isCorrect = studentAnswer !== undefined && studentAnswer === currentQ.correctAnswer;
  const isSkipped = studentAnswer === undefined;

  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true"
        data-lenis-prevent 
        className="relative w-full max-w-4xl max-h-[92vh] bg-glitch-panel rounded-xl shadow-2xl border border-glitch-border flex flex-col overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-glitch-border bg-glitch-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary">Review Answers</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-glitch-green/10 text-glitch-green border border-glitch-green/30">
                  Score: {result.score}/{result.totalQuestions} ({result.accuracy}%)
                </span>
              </div>
              <p className="text-xs text-text-secondary font-mono mt-1">
                {test.subject} • Chapter {test.chapterNumber}: {test.chapter} • {test.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close review"
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-glitch-surface rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with 2 Columns on Desktop */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-glitch-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-glitch-green px-2.5 py-1 rounded bg-glitch-green/10 border border-glitch-green/30">
                  Question {currentIndex + 1} of {test.questions.length}
                </span>
              </div>

              {/* Status Pill */}
              {isCorrect ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-glitch-green bg-glitch-green/10 px-2.5 py-1 rounded-md border border-glitch-green/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Correct (+1)
                </span>
              ) : isSkipped ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary bg-glitch-surface px-2.5 py-1 rounded-md border border-glitch-border">
                  <AlertCircle className="w-4 h-4" />
                  Skipped (0)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 bg-red-950/20 px-2.5 py-1 rounded-md border border-red-500/50">
                  <XCircle className="w-4 h-4" />
                  Incorrect (0)
                </span>
              )}
            </div>

            {/* Question Text */}
            <h4 className="text-base font-semibold text-text-primary leading-relaxed">
              {currentQ.question}
            </h4>

            {/* 5 Options Display */}
            <div className="space-y-2.5">
              {currentQ.options.map((optText, optIdx) => {
                const isSelectedByStudent = studentAnswer === optIdx;
                const isTheCorrectOption = currentQ.correctAnswer === optIdx;

                let optionStyle = 'border-glitch-border bg-glitch-card text-text-primary';
                let badgeStyle = 'bg-glitch-surface border border-glitch-border text-text-secondary';
                let statusLabel = null;

                if (isTheCorrectOption) {
                  optionStyle = 'border-glitch-green/50 bg-glitch-green/10 text-glitch-green ring-1 ring-glitch-green/30';
                  badgeStyle = 'bg-glitch-green text-glitch-ink font-bold';
                  statusLabel = (
                    <span className="text-xs font-mono text-glitch-green flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct Answer
                    </span>
                  );
                } else if (isSelectedByStudent && !isCorrect) {
                  optionStyle = 'border-red-500/50 bg-red-950/20 text-red-400 ring-1 ring-red-500/30';
                  badgeStyle = 'bg-red-500 text-glitch-ink font-bold';
                  statusLabel = (
                    <span className="text-xs font-mono text-red-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Your Choice
                    </span>
                  );
                }

                return (
                  <div
                    key={optIdx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono ${badgeStyle}`}>
                        {optionLabels[optIdx]}
                      </span>
                      <span>{optText}</span>
                    </div>

                    {statusLabel}
                  </div>
                );
              })}
            </div>

            {/* Explanation Card */}
            <div className="p-4 rounded-xl bg-glitch-surface border border-glitch-border">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-text-primary">
                <HelpCircle className="w-4 h-4 text-glitch-green" />
                <span>Explanation & Solution</span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="border-t lg:border-t-0 lg:border-l border-glitch-border pt-4 lg:pt-0 lg:pl-6">
            <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary mb-3">
              Questions ({test.questions.length})
            </h5>

            <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
              {test.questions.map((_, idx) => {
                const ans = result.answers[idx];
                const qIsCorrect = ans !== undefined && ans === test.questions[idx].correctAnswer;
                const qIsSkipped = ans === undefined;
                const isSelected = idx === currentIndex;

                let btnBg = 'bg-red-950/20 border-red-500/50 text-red-400 font-mono';
                if (qIsCorrect) {
                  btnBg = 'bg-glitch-green/10 border-glitch-green/30 text-glitch-green font-mono';
                } else if (qIsSkipped) {
                  btnBg = 'bg-glitch-surface border-glitch-border text-text-secondary font-mono';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-lg border text-xs flex items-center justify-center transition-all min-h-[44px] min-w-[44px] ${btnBg} ${
                      isSelected ? 'ring-1 ring-glitch-green shadow-[0_0_8px_rgba(0,255,102,0.3)]' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-glitch-border bg-glitch-surface flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 min-h-[44px] rounded-lg border border-glitch-border bg-glitch-card hover:bg-glitch-surface text-xs font-semibold text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Question</span>
          </button>

          <button
            type="button"
            disabled={currentIndex === test.questions.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
            className="px-4 py-2 min-h-[44px] rounded-lg bg-glitch-green hover:brightness-110 text-glitch-ink text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] transition-colors flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
