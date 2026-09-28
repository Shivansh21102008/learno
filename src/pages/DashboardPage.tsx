import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { ActiveTab, AIVivaMode } from '../types';
import { SUBJECT_METAS } from '../data/curriculumData';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { AIOralExaminerModal } from '../components/ai/AIOralExaminerModal';
import {
  Flame,
  Target,
  Trophy,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Eye,
  Play,
  GraduationCap,
  Bot,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSubjectFilter: (subject: string) => void;
  onOpenClassModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  onSelectSubjectFilter,
  onOpenClassModal,
}) => {
  const { user } = useAuth();
  const { tests, results, stats, startTest, openReviewAnswers } = useCurriculum();

  // AI Oral Viva Modal States
  const [isAIVivaModalOpen, setIsAIVivaModalOpen] = useState(false);
  const [selectedVivaMode, setSelectedVivaMode] = useState<AIVivaMode>('easy');

  // Dynamic greeting based on current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  // Overall progress percentage
  const overallPercentage = Math.round((stats.testsCompleted / stats.totalTests) * 100);

  // Find next unattempted test to continue learning
  const nextTest = tests.find((t) => !results[t.id] && !t.isMainExam) || tests[0];
  const mainExams = tests.filter((t) => t.isMainExam);

  // Recent completed tests
  const recentResults = Object.values(results)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 py-6">
      {/* HUD Telemetry Banner */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF66]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 rounded border border-[#00FF66]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                TELEMETRY CONSOLE // {user.class.toUpperCase()}
              </span>
              <button
                onClick={onOpenClassModal}
                className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 hover:text-[#00FF66] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-white/10 transition-colors"
                title="Switch Class Rig"
              >
                [ SWITCH RIG ]
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
              {greeting}, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
              Curriculum neural rigs loaded. All 200 syllabus modules, comprehensive examinations, and AI oral voice diagnostics active.
            </p>
          </div>

          {/* Next Test Quick Action Card */}
          {nextTest && (
            <div className="bg-[#050505] border border-white/10 hover:border-[#00FF66]/50 rounded-xl p-4 flex items-center justify-between gap-4 max-w-sm w-full transition-all group shadow-inner">
              <div className="flex flex-col truncate">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                  RECOMMENDED NEXT RIG
                </span>
                <span className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-[#00FF66] transition-colors">
                  {nextTest.subject} — {nextTest.chapter}
                </span>
                <span className="font-mono text-[10px] text-neutral-400 mt-0.5">
                  {nextTest.title} • {nextTest.durationMinutes} MINS
                </span>
              </div>
              <button
                onClick={() => startTest(nextTest.id)}
                className="px-3.5 py-2 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tests Completed */}
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-3.5 sm:p-5 hover:border-[#00FF66]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Tests Completed</span>
            <div className="w-8 h-8 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-white group-hover:text-[#00FF66] transition-colors">
                {stats.testsCompleted}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                / {stats.totalTests}
              </span>
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 mt-1">
              {stats.testsRemaining} remaining in syllabus
            </div>
          </div>
        </div>

        {/* Average Accuracy */}
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-3.5 sm:p-5 hover:border-[#00FF66]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Average Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-display font-black text-[#00FF66]">
              {stats.averageAccuracy}%
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 mt-1">
              {stats.testsCompleted} attempts recorded
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-3.5 sm:p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Active Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">
              {user.streak} DAYS 🔥
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-neutral-400 mt-1">Daily consistency active</div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-3.5 sm:p-5 hover:border-purple-500/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Achievements</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-white group-hover:text-purple-400 transition-colors">
                {user.achievements.length}
              </span>
              <span className="font-mono text-xs text-neutral-400">/ 9 Unlocked</span>
            </div>
            <button
              onClick={() => setActiveTab('achievements')}
              className="font-mono text-[11px] text-[#00FF66] hover:underline mt-1 inline-block"
            >
              [ VIEW BADGES → ]
            </button>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 transition-colors shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66]">
                OVERALL RIG PROGRESS
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              {user.class} Syllabus Telemetry — Total 200 Tests
            </h3>
          </div>
          <div className="font-mono text-xs font-bold text-[#00FF66]">
            {stats.testsCompleted} / {stats.totalTests} COMPLETE ({overallPercentage}%)
          </div>
        </div>

        {/* Cyber Visual Progress Bar */}
        <div className="w-full h-3 bg-[#050505] rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-[#00FF66] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(0,255,102,0.6)]"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Term Examinations Spotlight */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-card space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                  OFFICIAL MILESTONE ASSESSMENTS
                </span>
                <span className="font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-bold uppercase">
                  3 TERM RIGS
                </span>
              </div>
              <h3 className="text-base font-display font-bold text-white mt-0.5">
                Comprehensive Term Examinations for {user.class}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="font-mono text-xs font-bold text-[#00FF66] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>[ ALL EXAMS → ]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {mainExams.map((exam, idx) => {
            const isCompleted = !!results[exam.id];

            return (
              <div
                key={exam.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#050505] border-[#00FF66]/40 shadow-[0_0_15px_rgba(0,255,102,0.1)]'
                    : 'bg-[#050505] border-white/10 hover:border-[#00FF66]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                      TERM RIG 0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <span className="font-mono text-[10px] font-bold text-[#00FF66] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-neutral-500">Unattempted</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {exam.chapter}
                  </h4>
                  <p className="font-mono text-[11px] text-neutral-400 mt-1.5">
                    {exam.questionsCount} MCQs • {exam.durationMinutes} Mins • 5 Options
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startTest(exam.id)}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      : 'bg-[#00FF66] hover:bg-[#00FF66]/90 text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCompleted ? 'Retake Examination' : 'Launch Examination'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Oral Viva & Diagnostic Hub */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-card space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF66]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#00FF66]/10 text-[#00FF66] flex items-center justify-center border border-[#00FF66]/30 flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF66]">
                  NEURAL VOICE CONVERSATION
                </span>
                <span className="font-mono px-2 py-0.5 rounded bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 text-[9px] font-bold uppercase">
                  AI VIVA
                </span>
              </div>
              <h3 className="text-base font-display font-bold text-white mt-0.5">
                Learno AI Oral Examiner & Diagnostic Viva
              </h3>
            </div>
          </div>
          <div className="font-mono text-xs text-[#00FF66] flex items-center gap-1.5 self-start sm:self-auto font-medium">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Speaks & Evaluates Spoken Accuracy</span>
          </div>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed max-w-4xl">
          Practice your curriculum via direct oral conversation with the AI examiner. The AI speaks questions aloud, listens to your verbal response, diagnoses reading and writing competencies, and provides real-time model answers.
        </p>

        {/* 3 Interactive Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Easy (10 Chapters) */}
          <button
            type="button"
            onClick={() => {
              setSelectedVivaMode('easy');
              setIsAIVivaModalOpen(true);
            }}
            className="w-full text-left p-5 rounded-2xl bg-[#050505] hover:bg-[#050505]/80 border border-white/10 hover:border-[#00FF66] transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono px-2.5 py-0.5 rounded bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 text-[10px] font-bold uppercase">
                  EASY // सरल
                </span>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  10 Chapters
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#00FF66] transition-colors">
                Foundational Viva
              </h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Core definitions, factual checks, and everyday conceptual examples.
              </p>
            </div>
            <div className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/5 group-hover:bg-[#00FF66] group-hover:text-black border border-white/10 group-hover:border-[#00FF66] text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCH EASY VIVA</span>
            </div>
          </button>

          {/* Intermediate (20 Chapters) */}
          <button
            type="button"
            onClick={() => {
              setSelectedVivaMode('intermediate');
              setIsAIVivaModalOpen(true);
            }}
            className="w-full text-left p-5 rounded-2xl bg-[#050505] hover:bg-[#050505]/80 border border-white/10 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold uppercase">
                  INTERMEDIATE // मध्यम
                </span>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  20 Chapters
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Conceptual Competency
              </h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Application questions testing causal reasoning, comparisons, and error debugging.
              </p>
            </div>
            <div className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/5 group-hover:bg-amber-400 group-hover:text-black border border-white/10 group-hover:border-amber-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCH INTERMEDIATE VIVA</span>
            </div>
          </button>

          {/* Hard (40 Chapters) */}
          <button
            type="button"
            onClick={() => {
              setSelectedVivaMode('hard');
              setIsAIVivaModalOpen(true);
            }}
            className="w-full text-left p-5 rounded-2xl bg-[#050505] hover:bg-[#050505]/80 border border-white/10 hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase">
                  HARD // कठिन
                </span>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  40 Chapters
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                Rigorous Mastery
              </h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Challenging theoretical depth, multi-step problem explanations, and academic rigor.
              </p>
            </div>
            <div className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/5 group-hover:bg-rose-500 group-hover:text-white border border-white/10 group-hover:border-rose-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCH HARD VIVA</span>
            </div>
          </button>
        </div>
      </div>

      {/* Subject-wise Progress & Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66]">
                CURRICULUM MODULES
              </span>
            </div>
            <h3 className="text-base font-display font-bold text-white mt-0.5">
              Subject Rigs Performance
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="font-mono text-xs font-bold text-[#00FF66] hover:underline flex items-center gap-1"
          >
            <span>[ ALL TESTS → ]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(SUBJECT_METAS).map(([subjName, meta]) => {
            const subjStats = stats.subjectProgress[subjName] || {
              total: meta.testCount,
              completed: 0,
              percentage: 0,
            };

            return (
              <div
                key={subjName}
                className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-5 hover:border-[#00FF66]/50 transition-all flex flex-col justify-between group shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm border border-white/10 shadow-sm"
                        style={{ backgroundColor: `${meta.bgColor}30`, color: meta.color }}
                      >
                        <BadgeIcon name={meta.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#00FF66] transition-colors">{subjName}</h4>
                        <span className="font-mono text-[10px] text-neutral-400">
                          [ {subjStats.total} TESTS ]
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#00FF66]">
                      {subjStats.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden mb-3 border border-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-[#00FF66]"
                      style={{
                        width: `${subjStats.percentage}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 mb-4">
                    <span>{subjStats.completed} COMPLETE</span>
                    <span>{subjStats.total - subjStats.completed} REMAINING</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectSubjectFilter(subjName);
                    setActiveTab('tests');
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-[#00FF66] text-neutral-300 hover:text-black rounded-xl font-mono text-xs font-bold border border-white/10 hover:border-[#00FF66] transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>ENTER RIG</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Test Activity Table */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 shadow-card transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66]">
              AUDIT LOG
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">Recent Practice Telemetry</h3>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="font-mono text-xs font-semibold text-[#00FF66] hover:underline"
          >
            [ FULL LOG → ]
          </button>
        </div>

        {recentResults.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-neutral-400">
            NO TEST SESSIONS RECORDED YET. ENGAGE CHAPTER 1 TO INITIATE TELEMETRY.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {recentResults.map((item) => (
              <div
                key={item.testId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {item.subject} — {item.chapter} (TEST 0{item.testNumber})
                    </div>
                    <div className="font-mono text-[11px] text-neutral-400">
                      SCORE: <span className="text-[#00FF66] font-bold">{item.score}/{item.totalQuestions}</span> • {item.accuracy}% ACCURACY
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-11 sm:ml-0">
                  <span className="font-mono text-[11px] text-neutral-400">
                    {new Date(item.completedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => openReviewAnswers(item)}
                    className="px-2.5 py-1 text-xs font-mono font-semibold text-[#00FF66] bg-[#00FF66]/10 hover:bg-[#00FF66]/20 rounded-lg transition-colors flex items-center gap-1 border border-[#00FF66]/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>REVIEW</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive AI Oral Viva Examiner Modal */}
      {isAIVivaModalOpen && (
        <AIOralExaminerModal
          studentClass={user.class}
          initialMode={selectedVivaMode}
          onClose={() => setIsAIVivaModalOpen(false)}
        />
      )}
    </div>
  );
};
