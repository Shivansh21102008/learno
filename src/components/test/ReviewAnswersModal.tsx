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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div data-lenis-prevent className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary dark:text-white">Review Answers</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light border border-primary-200 dark:border-primary-800">
                  Score: {result.score}/{result.totalQuestions} ({result.accuracy}%)
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                {test.subject} • Chapter {test.chapterNumber}: {test.chapter} • {test.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with 2 Columns on Desktop */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary dark:text-primary-light px-2.5 py-1 rounded bg-primary-50 dark:bg-primary-950/60">
                  Question {currentIndex + 1} of {test.questions.length}
                </span>
              </div>

              {/* Status Pill */}
              {isCorrect ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  Correct (+1)
                </span>
              ) : isSkipped ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-border dark:border-slate-700">
                  <AlertCircle className="w-4 h-4" />
                  Skipped (0)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-danger dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                  <XCircle className="w-4 h-4" />
                  Incorrect (0)
                </span>
              )}
            </div>

            {/* Question Text */}
            <h4 className="text-base font-semibold text-text-primary dark:text-white leading-relaxed">
              {currentQ.question}
            </h4>

            {/* 5 Options Display */}
            <div className="space-y-2.5">
              {currentQ.options.map((optText, optIdx) => {
                const isSelectedByStudent = studentAnswer === optIdx;
                const isTheCorrectOption = currentQ.correctAnswer === optIdx;

                let optionStyle = 'border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-200';
                let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-text-secondary dark:text-slate-300';
                let statusLabel = null;

                if (isTheCorrectOption) {
                  optionStyle = 'border-success dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-300 dark:ring-emerald-700';
                  badgeStyle = 'bg-success text-white font-bold';
                  statusLabel = (
                    <span className="text-xs font-bold text-success dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct Answer
                    </span>
                  );
                } else if (isSelectedByStudent && !isCorrect) {
                  optionStyle = 'border-danger dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-300 dark:ring-rose-700';
                  badgeStyle = 'bg-danger text-white font-bold';
                  statusLabel = (
                    <span className="text-xs font-bold text-danger dark:text-rose-400 flex items-center gap-1">
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
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${badgeStyle}`}>
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
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-primary dark:text-blue-300">
                <HelpCircle className="w-4 h-4" />
                <span>Explanation & Solution</span>
              </div>
              <p className="text-xs sm:text-sm text-text-primary dark:text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="border-t lg:border-t-0 lg:border-l border-border dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
            <h5 className="text-xs font-bold uppercase tracking-wider text-text-primary dark:text-white mb-3">
              Questions ({test.questions.length})
            </h5>

            <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
              {test.questions.map((_, idx) => {
                const ans = result.answers[idx];
                const qIsCorrect = ans !== undefined && ans === test.questions[idx].correctAnswer;
                const qIsSkipped = ans === undefined;
                const isSelected = idx === currentIndex;

                let btnBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-danger dark:text-rose-400 font-bold';
                if (qIsCorrect) {
                  btnBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-success dark:text-emerald-400 font-bold';
                } else if (qIsSkipped) {
                  btnBg = 'bg-slate-100 dark:bg-slate-800 border-border dark:border-slate-700 text-slate-500 dark:text-slate-400';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-lg border text-xs flex items-center justify-center transition-all ${btnBg} ${
                      isSelected ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 shadow-sm' : ''
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
        <div className="px-6 py-3.5 border-t border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-3.5 py-1.5 rounded-lg border border-border dark:border-slate-700 text-xs font-semibold text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Question</span>
          </button>

          <button
            type="button"
            disabled={currentIndex === test.questions.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
