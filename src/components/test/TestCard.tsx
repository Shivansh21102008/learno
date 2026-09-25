import React from 'react';
import { Test, TestResult } from '../../types';
import { Clock, HelpCircle, CheckCircle2, Play, Eye, RotateCcw } from 'lucide-react';

interface TestCardProps {
  test: Test;
  result?: TestResult;
  onStart: (testId: string) => void;
  onReview: (result: TestResult) => void;
}

export const TestCard: React.FC<TestCardProps> = ({ test, result, onStart, onReview }) => {
  const isCompleted = !!result;

  const difficultyColors = {
    Easy: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Medium: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Hard: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  };

  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        isCompleted
          ? 'bg-white dark:bg-slate-900 border-border dark:border-slate-800 hover:shadow-card hover:border-emerald-300 dark:hover:border-emerald-700'
          : 'bg-white dark:bg-slate-900 border-border dark:border-slate-800 hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-700'
      }`}
    >
      <div>
        {/* Card Header: Subject, Problem Number & Difficulty */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-950/80 text-primary dark:text-primary-light text-[11px] font-black">
              #{test.problemNumber ? String(test.problemNumber).padStart(3, '0') : String(test.chapterNumber).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold text-primary dark:text-primary-light tracking-wide uppercase">
              {test.subject}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              difficultyColors[test.difficulty]
            }`}
          >
            {test.difficulty}
          </span>
        </div>

        {/* Chapter Title & Problem Name */}
        <div className="mb-2.5">
          <h4 className="text-sm sm:text-base font-bold text-text-primary dark:text-white line-clamp-2" title={test.chapter}>
            {test.chapter}
          </h4>
          <span className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">
            Chapter {test.chapterNumber} Practice Test
          </span>
        </div>

        {/* Concept Badges */}
        {test.concepts && test.concepts.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {test.concepts.map((c, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
              >
                #{c}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-text-secondary dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{test.questionsCount} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{test.durationMinutes} Minutes</span>
          </div>
        </div>
      </div>

      {/* Completion Details or Start CTA */}
      <div className="pt-3 border-t border-border dark:border-slate-800">
        {isCompleted ? (
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-text-secondary dark:text-slate-400">
                Score:{' '}
                <span className="font-bold text-text-primary dark:text-white">
                  {result.score}/{result.totalQuestions}
                </span>
              </div>
              <div className="text-xs font-semibold text-success dark:text-emerald-400">
                {result.accuracy}% Accuracy
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onReview(result)}
                className="px-2.5 py-1.5 text-xs font-semibold text-primary dark:text-primary-light bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 rounded-lg transition-colors flex items-center gap-1 border border-primary-100 dark:border-primary-800"
                title="Review Answers"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Review</span>
              </button>
              <button
                onClick={() => onStart(test.id)}
                className="p-1.5 text-xs text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Retake Test"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary dark:text-slate-400 font-medium">Status: Not Started</span>
            <button
              onClick={() => onStart(test.id)}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Test</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
