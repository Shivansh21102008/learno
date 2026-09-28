import React from 'react';
import { Test, TestResult } from '../../types';
import { Clock, HelpCircle, Play, Eye, RotateCcw } from 'lucide-react';

interface TestCardProps {
  test: Test;
  result?: TestResult;
  onStart: (testId: string) => void;
  onReview: (result: TestResult) => void;
}

export const TestCard: React.FC<TestCardProps> = ({ test, result, onStart, onReview }) => {
  const isCompleted = !!result;

  const difficultyColors = {
    Easy: 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30',
    Medium: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group ${
        isCompleted
          ? 'bg-[#0A0D14]/90 border-[#00FF66]/40 hover:shadow-[0_0_20px_rgba(0,255,102,0.15)]'
          : 'bg-[#0A0D14]/90 border-white/10 hover:border-[#00FF66]/50 hover:shadow-[0_0_20px_rgba(0,255,102,0.1)]'
      }`}
    >
      <div>
        {/* Card Header: Subject, Problem Number & Difficulty */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
              #{test.problemNumber ? String(test.problemNumber).padStart(3, '0') : String(test.chapterNumber).padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
              {test.subject}
            </span>
          </div>

          <span
            className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
              difficultyColors[test.difficulty]
            }`}
          >
            {test.difficulty}
          </span>
        </div>

        {/* Chapter Title & Problem Name */}
        <div className="mb-2.5">
          <h4 className="text-sm font-bold text-white group-hover:text-[#00FF66] transition-colors line-clamp-2" title={test.chapter}>
            {test.chapter}
          </h4>
          <span className="font-mono text-[10px] text-neutral-400">
            Ch {test.chapterNumber} • Module Test
          </span>
        </div>

        {/* Concept Badges */}
        {test.concepts && test.concepts.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {test.concepts.map((c, i) => (
              <span
                key={i}
                className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10"
              >
                #{c}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-neutral-400 mb-4">
          <div className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-neutral-500" />
            <span>{test.questionsCount} Qs</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span>{test.durationMinutes} Mins</span>
          </div>
        </div>
      </div>

      {/* Completion Details or Start CTA */}
      <div className="pt-3 border-t border-white/10">
        {isCompleted ? (
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-mono text-[10px] text-neutral-400">
                Score: <span className="font-bold text-white">{result.score}/{result.totalQuestions}</span>
              </div>
              <div className="font-mono text-[10px] font-bold text-[#00FF66]">
                {result.accuracy}% ACCURACY
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onReview(result)}
                className="min-h-[36px] px-2.5 py-1 text-xs font-mono font-semibold text-[#00FF66] bg-[#00FF66]/10 hover:bg-[#00FF66]/20 rounded-lg transition-colors flex items-center gap-1 border border-[#00FF66]/30"
                title="Review Answers"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>REVIEW</span>
              </button>
              <button
                onClick={() => onStart(test.id)}
                className="min-h-[36px] p-1.5 text-xs text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                title="Retake Test"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500 uppercase">UNATTEMPTED</span>
            <button
              onClick={() => onStart(test.id)}
              className="min-h-[36px] px-3.5 py-1.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(0,255,102,0.3)] flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>START</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
