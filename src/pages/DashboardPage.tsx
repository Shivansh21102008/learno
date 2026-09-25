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
  ShieldCheck,
  Camera,
  Mic,
  Bot,
  Sparkles,
  Volume2,
  Lock,
  Timer,
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
  const { tests, results, stats, startTest, openReviewAnswers, isExamLocked, getExamLockout } = useCurriculum();

  // AI Oral Viva Modal States
  const [isAIVivaModalOpen, setIsAIVivaModalOpen] = useState(false);
  const [selectedVivaMode, setSelectedVivaMode] = useState<AIVivaMode>('easy');

  // Dynamic greeting based on current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

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
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white">
              {greeting}, {user.name} 👋
            </span>
            <button
              onClick={onOpenClassModal}
              className="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 text-primary dark:text-primary-light border border-primary-200 dark:border-primary-800 text-xs font-bold transition-colors"
            >
              {user.class}
            </button>
          </div>
          <p className="text-sm text-text-secondary dark:text-slate-400">
            Ready to continue your learning? Practice your syllabus and master every chapter.
          </p>
        </div>

        {/* Next Test Quick Action Card */}
        {nextTest && (
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-border dark:border-slate-700/80 rounded-xl p-4 flex items-center justify-between gap-4 max-w-sm w-full">
            <div className="flex flex-col truncate">
              <span className="text-[10px] uppercase font-bold text-primary dark:text-primary-light tracking-wider">
                Recommended Next
              </span>
              <span className="text-xs font-bold text-text-primary dark:text-white truncate">
                {nextTest.subject} — {nextTest.chapter}
              </span>
              <span className="text-[11px] text-text-secondary dark:text-slate-400">
                {nextTest.title} • {nextTest.durationMinutes} Mins
              </span>
            </div>
            <button
              onClick={() => startTest(nextTest.id)}
              className="px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          </div>
        )}
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tests Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-5 shadow-subtle flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">Tests Completed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-text-primary dark:text-white">
                {stats.testsCompleted}
              </span>
              <span className="text-sm font-semibold text-text-secondary dark:text-slate-400">
                / {stats.totalTests}
              </span>
            </div>
            <div className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              {stats.testsRemaining} remaining to finish curriculum
            </div>
          </div>
        </div>

        {/* Average Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-5 shadow-subtle flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">Average Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-success dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary dark:text-white">
              {stats.averageAccuracy}%
            </div>
            <div className="text-xs text-success dark:text-emerald-400 font-medium mt-1">
              Based on {stats.testsCompleted} completed attempts
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-5 shadow-subtle flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">Current Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-warning dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary dark:text-white">
              {user.streak} Days 🔥
            </div>
            <div className="text-xs text-text-secondary dark:text-slate-400 mt-1">Keep practicing every day</div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-5 shadow-subtle flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">Badges Earned</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-text-primary dark:text-white">
                {user.achievements.length}
              </span>
              <span className="text-sm font-semibold text-text-secondary dark:text-slate-400">/ 9 Unlocked</span>
            </div>
            <button
              onClick={() => setActiveTab('achievements')}
              className="text-xs text-primary dark:text-primary-light font-semibold hover:underline mt-1 inline-block"
            >
              View all achievements →
            </button>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 shadow-subtle transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-text-primary dark:text-white">Curriculum Completion Progress</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              {user.class} Syllabus — Total 200 Tests
            </p>
          </div>
          <div className="text-sm font-extrabold text-primary dark:text-primary-light">
            {stats.testsCompleted} / {stats.totalTests} Tests Completed ({overallPercentage}%)
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border/80 dark:border-slate-700/80">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Proctored Examinations Spotlight */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/60 rounded-3xl border border-blue-800/60 p-6 sm:p-7 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300">
                  Official Academic Assessments
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  AI Proctored
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Main Examinations for {user.class}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Exams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {mainExams.map((exam) => {
            const isCompleted = !!results[exam.id];
            const isLocked = isExamLocked(exam.id);
            const lockout = isLocked ? getExamLockout(exam.id) : null;
            const remainingHours = lockout ? Math.ceil((lockout.lockedUntil - Date.now()) / (3600 * 1000)) : 24;

            return (
              <div
                key={exam.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-sm ${
                  isLocked
                    ? 'bg-rose-950/20 border-rose-800/60'
                    : 'bg-white/5 border-white/10 hover:border-blue-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Cam + Mic
                    </span>
                    {isLocked ? (
                      <span className="text-[10px] font-extrabold text-rose-400 flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/60">
                        <Lock className="w-3 h-3" /> Locked ({remainingHours}h)
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Not Attempted</span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {exam.chapter}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {exam.questionsCount} Questions • {exam.durationMinutes} Mins
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => !isLocked && startTest(exam.id)}
                  className={`mt-3.5 w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                    isLocked
                      ? 'bg-rose-950/60 border border-rose-800/80 text-rose-300 cursor-not-allowed opacity-80'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-rose-400" />
                      <span>Disqualified • Locked 24h</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isCompleted ? 'Retake Proctored Exam' : 'Start Proctored Exam'}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Oral Viva & Diagnostic Hub */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900/60 rounded-3xl border border-emerald-800/60 p-6 sm:p-7 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/40 flex-shrink-0 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Conversational Oral Assessment
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                  AI Viva Voice
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Learno AI Oral Examiner & Diagnostic Viva
              </h3>
            </div>
          </div>
          <div className="text-xs text-emerald-300 flex items-center gap-1.5 self-start sm:self-auto font-medium">
            <Volume2 className="w-3.5 h-3.5" />
            <span>AI Speaks with You & Evaluates Spoken Accuracy</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Practice your syllabus through a direct oral conversation with the AI examiner. The AI speaks questions out loud, listens to your answers, provides real-time correction ("Sahi Version"), and diagnoses your Reading & Writing skill needs!
        </p>

        {/* 3 Interactive Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Easy (10 Chapters) */}
          <div
            onClick={() => {
              setSelectedVivaMode('easy');
              setIsAIVivaModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-sm shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  Easy (सरल)
                </span>
                <span className="text-xs font-extrabold text-emerald-300">
                  10 Chapters
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Foundational Viva
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Friendly oral assessment testing core definitions, facts, and daily life examples.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Easy Viva (10 Ch)</span>
            </button>
          </div>

          {/* Intermediate (20 Chapters) */}
          <div
            onClick={() => {
              setSelectedVivaMode('intermediate');
              setIsAIVivaModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-sm shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Intermediate (मध्यम)
                </span>
                <span className="text-xs font-extrabold text-amber-300">
                  20 Chapters
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Conceptual Competency
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Application questions testing causal mechanisms, comparisons, and error debugging.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Launch Intermediate Viva (20 Ch)</span>
            </button>
          </div>

          {/* Hard (40 Chapters) */}
          <div
            onClick={() => {
              setSelectedVivaMode('hard');
              setIsAIVivaModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-sm shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
                  Hard (कठिन)
                </span>
                <span className="text-xs font-extrabold text-rose-300">
                  40 Chapters
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Rigorous Mastery
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Comprehensive viva challenging theoretical limits, complex multi-step reasoning, and academic rigor.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Hard Viva (40 Ch)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject-wise Progress & Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary dark:text-white">Subject-Wise Performance</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              Track completion across all core curriculum subjects
            </p>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1"
          >
            <span>View All Tests</span>
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
                className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-5 shadow-subtle hover:shadow-card hover:border-primary-200 dark:hover:border-primary-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-sm"
                        style={{ backgroundColor: meta.bgColor, color: meta.color }}
                      >
                        <BadgeIcon name={meta.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary dark:text-white">{subjName}</h4>
                        <span className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">
                          {subjStats.total} Tests
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-extrabold text-text-primary dark:text-white">
                      {subjStats.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${subjStats.percentage}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary dark:text-slate-400 mb-4">
                    <span>{subjStats.completed} Completed</span>
                    <span>{subjStats.total - subjStats.completed} Remaining</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectSubjectFilter(subjName);
                    setActiveTab('tests');
                  }}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-primary-50 dark:hover:bg-primary-950/60 text-text-primary dark:text-slate-200 hover:text-primary dark:hover:text-primary-light rounded-xl text-xs font-bold border border-border dark:border-slate-700/80 hover:border-primary-200 dark:hover:border-primary-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Tests</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Test Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 shadow-subtle transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary dark:text-white">Recent Practice Activity</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">Your latest test attempts and scores</p>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="text-xs font-semibold text-primary dark:text-primary-light hover:underline"
          >
            See all tests
          </button>
        </div>

        {recentResults.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary dark:text-slate-400">
            No tests taken yet. Start with Chapter 1 to build your learning record!
          </div>
        ) : (
          <div className="divide-y divide-border dark:divide-slate-800">
            {recentResults.map((item) => (
              <div
                key={item.testId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-success dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary dark:text-white">
                      {item.subject} — {item.chapter} (Test 0{item.testNumber})
                    </div>
                    <div className="text-[11px] text-text-secondary dark:text-slate-400">
                      Score: {item.score}/{item.totalQuestions} • {item.accuracy}% Accuracy
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-11 sm:ml-0">
                  <span className="text-[11px] text-text-secondary dark:text-slate-400">
                    {new Date(item.completedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => openReviewAnswers(item)}
                    className="px-2.5 py-1 text-xs font-semibold text-primary dark:text-primary-light bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 rounded-lg transition-colors flex items-center gap-1 border border-primary-200 dark:border-primary-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review</span>
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
