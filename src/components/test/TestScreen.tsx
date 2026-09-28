import React, { useState, useEffect } from 'react';
import { Test } from '../../types';
import { useCurriculum } from '../../context/CurriculumContext';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  X,
} from 'lucide-react';

interface TestScreenProps {
  test: Test;
  onBackToHome?: () => void;
  onBackToDashboard?: () => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({
  test,
  onBackToHome,
  onBackToDashboard,
}) => {
  const {
    submitTest,
    quitTest,
  } = useCurriculum();

  const handleAbortSession = () => {
    quitTest();
    if (onBackToDashboard) {
      onBackToDashboard();
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  // Test states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test.id, answers]);

  const currentQuestion = test.questions[currentIndex];
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  // Handle Option Select
  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentIndex];
      return updated;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const handleFinalSubmit = () => {
    const timeTaken = test.durationMinutes * 60 - timeLeft;
    submitTest(test.id, answers, timeTaken);
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Summary counts
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = test.questions.length - answeredCount;
  const markedCount = markedForReview.size;

  const isTimeCritical = timeLeft < 120; // < 2 mins

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between bg-grid">
      {/* Test Header */}
      <header className="sticky top-0 z-30 bg-[#0A0D14] border-b border-white/10 px-3 sm:px-8 py-3 flex items-center justify-between font-mono">
        {/* Left: Subject & Chapter */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setShowExitModal(true)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 border border-white/10"
            title="Exit Test"
            aria-label="Exit Test Session"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] sm:max-w-xs md:max-w-md">
                {test.subject} — {test.chapter}
              </span>
              {test.isMainExam && (
                <span className="px-2 py-0.5 rounded bg-[#00FF66]/20 text-[#00FF66] text-[9px] sm:text-[10px] font-bold uppercase border border-[#00FF66]/40 flex-shrink-0">
                  TERM RIG
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 truncate max-w-[150px] sm:max-w-none">
              {test.title} • {test.difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Center: Question Counter */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#050505] text-neutral-300 font-bold text-xs rounded-full border border-white/10">
            <span>QUESTION {currentIndex + 1} OF {test.questions.length}</span>
          </div>
        </div>

        {/* Right: Live Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold tracking-wider transition-colors ${
              isTimeCritical
                ? 'bg-rose-950/60 text-rose-400 border-rose-500 animate-pulse'
                : 'bg-[#050505] text-[#00FF66] border-[#00FF66]/40 shadow-[0_0_12px_rgba(0,255,102,0.2)]'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400' : 'text-[#00FF66]'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs sm:text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SUBMIT</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left: Question Box */}
        <section className="flex-1 bg-[#0A0D14]/90 rounded-2xl border border-white/10 shadow-card p-6 sm:p-8 flex flex-col justify-between transition-colors">
          <div>
            {/* Mobile Question Quick Navigator (< lg screens) */}
            <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-white/10 scrollbar-none font-mono">
              {test.questions.map((_, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[idx] !== undefined;
                const isMarked = markedForReview.has(idx);

                let badge = 'bg-white/5 text-neutral-400 border-white/10';
                if (isMarked) badge = 'bg-amber-400/20 text-amber-300 border-amber-400';
                else if (isAnswered) badge = 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]';
                if (isCurrent) badge += ' ring-2 ring-[#00FF66] font-bold text-white';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-lg border text-[11px] flex-shrink-0 flex items-center justify-center transition-all ${badge}`}
                    aria-label={`Jump to Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-xs font-bold">
                  QUESTION {currentIndex + 1}
                </span>
                <span className="text-xs text-neutral-400">SINGLE CHOICE (5 OPTIONS)</span>
              </div>

              {markedForReview.has(currentIndex) && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  REVIEW FLAGGED
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed mb-8">
              {currentQuestion.question}
            </h2>

            {/* Exactly 5 Options */}
            <div className="space-y-3" role="radiogroup" aria-label={`Options for question ${currentIndex + 1}`}>
              {currentQuestion.options.map((optText, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between group min-h-[44px] ${
                      isSelected
                        ? 'border-[#00FF66] bg-[#00FF66]/10 text-white shadow-[0_0_15px_rgba(0,255,102,0.15)] ring-1 ring-[#00FF66]'
                        : 'border-white/10 bg-[#050505] hover:border-[#00FF66]/50 hover:bg-white/5 text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-[#00FF66] text-black shadow-sm'
                            : 'bg-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white border border-white/10'
                        }`}
                      >
                        {optionLabels[optIdx]}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{optText}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#00FF66] bg-[#00FF66]' : 'border-white/20'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMarkForReview}
                className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                  markedForReview.has(currentIndex)
                    ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                    : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${markedForReview.has(currentIndex) ? 'fill-current' : ''}`} />
                <span>{markedForReview.has(currentIndex) ? 'UNMARK REVIEW' : 'MARK REVIEW'}</span>
              </button>

              {answers[currentIndex] !== undefined && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="px-3 py-2 min-h-[38px] text-xs font-medium text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  CLEAR SELECTION
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 min-h-[38px] rounded-lg border border-white/10 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS</span>
              </button>

              {currentIndex < test.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                  className="px-5 py-2 min-h-[38px] rounded-lg bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 min-h-[38px] rounded-lg bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT TEST</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right: Question Navigator Palette */}
        <aside className="w-full lg:w-80 bg-[#0A0D14]/90 rounded-2xl border border-white/10 shadow-card p-5 flex flex-col justify-between transition-colors font-mono">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00FF66] mb-3">
              QUESTION NAVIGATOR
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Marked ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-[#00FF66] bg-[#0A0D14]" />
                <span>Current</span>
              </div>
            </div>

            {/* 1..20 Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {test.questions.map((_, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[idx] !== undefined;
                const isMarked = markedForReview.has(idx);

                let stateClasses = 'bg-[#050505] border-white/10 text-neutral-400 hover:text-white hover:border-white/30';

                if (isMarked) {
                  stateClasses = 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold';
                } else if (isAnswered) {
                  stateClasses = 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-bold';
                }

                if (isCurrent) {
                  stateClasses += ' ring-2 ring-[#00FF66] border-[#00FF66] font-bold text-white shadow-[0_0_10px_rgba(0,255,102,0.3)]';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${stateClasses}`}
                    aria-label={`Question ${idx + 1}: ${isCurrent ? 'Current, ' : ''}${isMarked ? 'Marked for review, ' : ''}${isAnswered ? 'Answered' : 'Unanswered'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 min-h-[44px] bg-[#00FF66] hover:bg-[#00FF66]/90 text-black rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>REVIEW & SUBMIT</span>
            </button>
          </div>
        </aside>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="submit-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#0A0D14] rounded-2xl shadow-2xl border border-white/10 p-6 font-mono">
            <h3 id="submit-dialog-title" className="text-base font-bold text-white mb-2 uppercase">Submit Examination?</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Confirm submission of your session. Telemetry breakdown:
            </p>

            <div className="bg-[#050505] rounded-xl p-4 border border-white/10 space-y-2 mb-6 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Answered Questions:</span>
                <span className="font-bold text-[#00FF66]">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Unanswered Questions:</span>
                <span className="font-bold text-rose-400">{unansweredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Marked for Review:</span>
                <span className="font-bold text-amber-400">{markedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 min-h-[40px] border border-white/10 hover:bg-white/5 text-neutral-300 text-xs font-bold rounded-lg transition-colors"
              >
                RETURN TO RIG
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 min-h-[40px] bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-colors"
              >
                CONFIRM SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Test Warning Modal */}
      {showExitModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="exit-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#0A0D14] rounded-2xl shadow-2xl border border-white/10 p-6 font-mono">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 id="exit-dialog-title" className="text-sm font-bold text-white mb-1 uppercase">ABORT TEST SESSION?</h3>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              If you abort now, answers for this session will not be saved to your telemetry record.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 min-h-[40px] border border-white/10 hover:bg-white/5 text-neutral-300 text-xs font-bold rounded-lg transition-colors"
              >
                STAY IN TEST
              </button>
              <button
                type="button"
                onClick={handleAbortSession}
                className="flex-1 py-2 min-h-[40px] bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                ABORT SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
