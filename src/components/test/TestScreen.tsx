import React, { useState, useEffect } from 'react';
import { Test } from '../../types';
import { useCurriculum } from '../../context/CurriculumContext';
import { ProctorLiveOverlay } from '../proctor/ProctorLiveOverlay';
import { DisqualifiedModal } from '../proctor/DisqualifiedModal';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  X,
  ShieldCheck,
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
    proctorStream,
    isSimulatedProctor,
    disqualificationReport,
    handleDisqualification,
    clearDisqualification,
  } = useCurriculum();

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

  // If student was disqualified by AI Proctor Guard, show official incident report!
  if (disqualificationReport) {
    return (
      <DisqualifiedModal
        report={disqualificationReport}
        onExit={clearDisqualification}
        onBackToHome={() => {
          clearDisqualification();
          if (onBackToHome) onBackToHome();
        }}
        onBackToDashboard={() => {
          clearDisqualification();
          if (onBackToDashboard) onBackToDashboard();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-text-primary dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Test Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-border dark:border-slate-800 shadow-subtle px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        {/* Left: Subject & Chapter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitModal(true)}
            className="p-1.5 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Exit Test"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-text-primary dark:text-white">
                {test.subject} — {test.chapter}
              </span>
              {test.isMainExam && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase border border-amber-300 dark:border-amber-700">
                  Main Exam
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-secondary dark:text-slate-400">
              {test.title} • {test.difficulty} Difficulty
            </span>
          </div>
        </div>

        {/* Center: Question Counter & Proctor Status */}
        <div className="flex items-center gap-2">
          {test.requiresProctoring && (
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-primary dark:text-blue-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>AI Proctor Monitored (Cam & Mic Active)</span>
            </div>
          )}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-text-primary dark:text-slate-200 font-semibold text-xs rounded-full border border-border dark:border-slate-700">
            <span>Question {currentIndex + 1} of {test.questions.length}</span>
          </div>
        </div>

        {/* Right: Live Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-bold tracking-wider transition-colors ${
              isTimeCritical
                ? 'bg-red-50 dark:bg-red-950/50 text-danger border-red-200 dark:border-red-800 animate-pulse'
                : 'bg-slate-50 dark:bg-slate-800 text-text-primary dark:text-slate-200 border-border dark:border-slate-700'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-danger' : 'text-primary'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left: Question Box */}
        <section className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-card p-6 sm:p-8 flex flex-col justify-between transition-colors">
          <div>
            {/* Question Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light text-xs font-bold">
                  Question {currentIndex + 1}
                </span>
                <span className="text-xs text-text-secondary dark:text-slate-400">Single Choice</span>
              </div>

              {markedForReview.has(currentIndex) && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-warning dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  Marked for Review
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-medium text-text-primary dark:text-white leading-relaxed mb-8">
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
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-primary bg-primary-50/80 dark:bg-primary-950/60 text-text-primary dark:text-white ring-2 ring-primary/20 shadow-sm'
                        : 'border-border dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-primary dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                        }`}
                      >
                        {optionLabels[optIdx]}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{optText}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-border dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMarkForReview}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  markedForReview.has(currentIndex)
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-warning dark:text-amber-400'
                    : 'border-border dark:border-slate-700 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${markedForReview.has(currentIndex) ? 'fill-current' : ''}`} />
                <span>{markedForReview.has(currentIndex) ? 'Unmark Review' : 'Mark for Review'}</span>
              </button>

              {answers[currentIndex] !== undefined && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="px-3 py-2 text-xs font-medium text-text-secondary dark:text-slate-400 hover:text-danger dark:hover:text-red-400 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-lg border border-border dark:border-slate-700 text-xs font-semibold text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < test.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 rounded-lg bg-success hover:bg-success-dark text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Test</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right: Question Navigator Palette */}
        <aside className="w-full lg:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-card p-5 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary dark:text-white mb-3">
              Question Navigator
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 pb-3 border-b border-border dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border border-border dark:border-slate-600" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Marked ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400">
                <span className="w-3 h-3 rounded-full border-2 border-primary bg-white dark:bg-slate-800" />
                <span>Current</span>
              </div>
            </div>

            {/* 1..20 Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {test.questions.map((_, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[idx] !== undefined;
                const isMarked = markedForReview.has(idx);

                let stateClasses = 'bg-white dark:bg-slate-800 border-border dark:border-slate-700 text-text-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700';

                if (isMarked) {
                  stateClasses = 'bg-amber-500 border-amber-600 text-white font-bold';
                } else if (isAnswered) {
                  stateClasses = 'bg-primary border-primary text-white font-bold';
                }

                if (isCurrent) {
                  stateClasses += ' ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 border-primary font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${stateClasses}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-border dark:border-slate-800 mt-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Review & Submit</span>
            </button>
          </div>
        </aside>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">Submit Test?</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mb-4">
              Are you sure you want to submit your test? Here is your question summary:
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-border dark:border-slate-700 space-y-2 mb-6 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary dark:text-slate-400">Answered Questions:</span>
                <span className="font-bold text-success dark:text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary dark:text-slate-400">Unanswered Questions:</span>
                <span className="font-bold text-danger dark:text-rose-400">{unansweredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary dark:text-slate-400">Marked for Review:</span>
                <span className="font-bold text-warning dark:text-amber-400">{markedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Test Warning Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 p-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-danger flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary dark:text-white mb-1">Exit Active Test?</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mb-5 leading-relaxed">
              If you leave now, your answers for this attempt will not be recorded and your test
              session will be discarded.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Stay in Test
              </button>
              <button
                type="button"
                onClick={quitTest}
                className="flex-1 py-2 bg-danger hover:bg-danger-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Proctoring Live HUD Overlay */}
      {test.requiresProctoring && !disqualificationReport && (
        <ProctorLiveOverlay
          test={test}
          stream={proctorStream}
          isSimulated={isSimulatedProctor}
          onDisqualified={handleDisqualification}
        />
      )}

      {/* Official Academic Integrity Disqualification Modal */}
      {disqualificationReport && (
        <DisqualifiedModal
          report={disqualificationReport}
          onBackToHome={() => {
            clearDisqualification();
            if (onBackToHome) onBackToHome();
          }}
          onBackToDashboard={() => {
            clearDisqualification();
            if (onBackToDashboard) onBackToDashboard();
          }}
        />
      )}
    </div>
  );
};
