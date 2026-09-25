import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { TestCard } from '../components/test/TestCard';
import { SUBJECT_METAS } from '../data/curriculumData';
import {
  Search,
  RotateCcw,
  ShieldCheck,
  Camera,
  Mic,
  AlertTriangle,
  BookOpen,
  Play,
  CheckCircle2,
  Trophy,
  Clock,
  Sparkles,
  Lock,
  Timer,
  List,
  LayoutGrid,
} from 'lucide-react';

interface TestsPageProps {
  selectedSubjectFilter: string;
  setSelectedSubjectFilter: (subject: string) => void;
  onOpenClassModal: () => void;
}

export const TestsPage: React.FC<TestsPageProps> = ({
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  onOpenClassModal,
}) => {
  const { user } = useAuth();
  const { tests, results, stats, startTest, openReviewAnswers, isExamLocked, getExamLockout } = useCurriculum();

  // Tab: Chapter Tests (200) vs Main Examinations (3 Proctored)
  const [examCategory, setExamCategory] = useState<'chapter_tests' | 'main_exams'>('chapter_tests');

  // View Mode: List View (Sequential 200 Problems) vs Subject Grid View
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filters for chapter tests
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Completed' | 'Not Started'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Separate main proctored exams from chapter tests
  const mainExams = useMemo(() => tests.filter((t) => t.isMainExam), [tests]);
  const chapterTests = useMemo(() => tests.filter((t) => !t.isMainExam), [tests]);

  // Group and filter chapter tests
  const filteredTests = useMemo(() => {
    return chapterTests.filter((test) => {
      // Subject filter
      if (selectedSubjectFilter !== 'All' && test.subject !== selectedSubjectFilter) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && test.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status filter
      const isCompleted = !!results[test.id];
      if (selectedStatus === 'Completed' && !isCompleted) return false;
      if (selectedStatus === 'Not Started' && isCompleted) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesChapter = test.chapter.toLowerCase().includes(query);
        const matchesSubject = test.subject.toLowerCase().includes(query);
        const matchesTitle = test.title.toLowerCase().includes(query);
        const matchesProblemNum = test.problemNumber && String(test.problemNumber).includes(query);
        const matchesConcept = test.concepts && test.concepts.some((c) => c.toLowerCase().includes(query));
        if (!matchesChapter && !matchesSubject && !matchesTitle && !matchesProblemNum && !matchesConcept) return false;
      }

      return true;
    });
  }, [chapterTests, results, selectedSubjectFilter, selectedDifficulty, selectedStatus, searchQuery]);

  // Group by Subject and then Chapter
  const groupedStructure = useMemo(() => {
    const map: Record<string, Record<string, typeof tests>> = {};

    filteredTests.forEach((test) => {
      if (!map[test.subject]) {
        map[test.subject] = {};
      }
      if (!map[test.subject][test.chapter]) {
        map[test.subject][test.chapter] = [];
      }
      map[test.subject][test.chapter].push(test);
    });

    return map;
  }, [filteredTests]);

  const subjectList = ['All', ...Object.keys(SUBJECT_METAS)];

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white">
              {examCategory === 'main_exams' ? 'Main Proctored Examinations' : 'Chapter-Wise Practice Tests'}
            </span>
            <button
              onClick={onOpenClassModal}
              className="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light border border-primary-200 dark:border-primary-800 text-xs font-bold"
              title="Click to switch class"
            >
              {user.class}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
            {examCategory === 'main_exams'
              ? 'Official comprehensive examinations with AI proctoring (Camera & Microphone security)'
              : 'Structured syllabus practice: Class → Subject → Chapter → Test'}
          </p>
        </div>

        {/* Total Tests Counter Box */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 border border-border dark:border-slate-700/80 px-5 py-3 rounded-xl">
          <div className="text-center pr-4 border-r border-border dark:border-slate-700">
            <div className="text-xl sm:text-2xl font-extrabold text-primary dark:text-primary-light">
              {stats.totalTests}
            </div>
            <div className="text-[11px] font-semibold text-text-secondary dark:text-slate-400">Chapter Tests</div>
          </div>
          <div className="text-center pr-4 border-r border-border dark:border-slate-700">
            <div className="text-xl sm:text-2xl font-extrabold text-success dark:text-emerald-400">
              {stats.testsCompleted}
            </div>
            <div className="text-[11px] font-semibold text-text-secondary dark:text-slate-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {mainExams.length}
            </div>
            <div className="text-[11px] font-semibold text-text-secondary dark:text-slate-400">Main Exams</div>
          </div>
        </div>
      </div>

      {/* Category Tabs: Chapter Practice Tests vs Main Examinations */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 w-full sm:w-fit">
        <button
          onClick={() => setExamCategory('chapter_tests')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            examCategory === 'chapter_tests'
              ? 'bg-primary text-white shadow-md'
              : 'text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapter Practice Tests (200)</span>
        </button>

        <button
          onClick={() => setExamCategory('main_exams')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            examCategory === 'main_exams'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>Main Examinations (3 Board Exams)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
            AI Proctored
          </span>
        </button>
      </div>

      {/* View Switcher: Main Examinations vs Chapter Practice Tests */}
      {examCategory === 'main_exams' ? (
        <div className="space-y-8">
          {/* Proctoring Warning & Rules Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/60 rounded-3xl border border-blue-800/60 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/40 shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
                    Official Proctored Exam Environment
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Learno AI Proctor Guard Security Protocol
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Camera Mandatory
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> Microphone Active
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Main Examinations are comprehensive assessments designed to evaluate your syllabus mastery in <strong>{user.class}</strong>.
              Before entering, your browser will request <strong>camera and microphone access</strong>. The examination will <u>not open</u> unless both devices are authorized.
              During the examination, the AI Proctor continuously monitors your head orientation and room audio.
              <strong> Turning your head away or producing unusual noise will issue strikes and disqualify your examination session.</strong>
            </p>
          </div>

          {/* 3 Main Examination Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mainExams.map((exam, idx) => {
              const res = results[exam.id];
              const isCompleted = !!res;
              const isLocked = isExamLocked(exam.id);
              const lockout = isLocked ? getExamLockout(exam.id) : null;
              const remainingHours = lockout ? Math.ceil((lockout.lockedUntil - Date.now()) / (3600 * 1000)) : 24;

              return (
                <div
                  key={exam.id}
                  className={`rounded-3xl border transition-all p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden ${
                    isLocked
                      ? 'bg-white dark:bg-slate-900 border-rose-500/60 dark:border-rose-700/60 shadow-card'
                      : isCompleted
                      ? 'bg-white dark:bg-slate-900 border-emerald-500/50 dark:border-emerald-700/60 shadow-card'
                      : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-card hover:shadow-xl hover:border-primary transition-all'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-primary dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                        Official Assessment 0{idx + 1}
                      </span>
                      {isLocked ? (
                        <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                          <Lock className="w-3.5 h-3.5" /> Locked ({remainingHours}h)
                        </span>
                      ) : isCompleted ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                          <ShieldCheck className="w-3.5 h-3.5" /> AI Proctored
                        </span>
                      )}
                    </div>

                    {/* Title & Subject */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-text-primary dark:text-white leading-snug">
                        {exam.chapter}
                      </h4>
                      <div className="text-xs text-text-secondary dark:text-slate-400 mt-1 font-medium">
                        {exam.subject} • {user.class}
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-border dark:border-slate-800 text-xs">
                      <div>
                        <div className="text-[10px] text-text-secondary dark:text-slate-400 font-semibold">Questions</div>
                        <div className="font-bold text-text-primary dark:text-white">{exam.questionsCount} MCQs (5 Options)</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-text-secondary dark:text-slate-400 font-semibold">Time Limit</div>
                        <div className="font-bold text-text-primary dark:text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" /> {exam.durationMinutes} Minutes
                        </div>
                      </div>
                    </div>

                    {/* Security Rules Notice */}
                    <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-border/80 dark:border-slate-700/80 text-[11px] text-text-secondary dark:text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-text-primary dark:text-slate-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Proctor Rules
                      </div>
                      <div>• Camera access mandatory — Face straight ahead</div>
                      <div>• Zero tolerance: Head turn or noise triggers disqualification</div>
                    </div>

                    {/* Academic Lockout Alert if disqualified */}
                    {isLocked && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-700 dark:text-rose-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-200">
                          <Lock className="w-3.5 h-3.5 text-rose-500" />
                          <span>24-Hour Disqualification Lockout Active</span>
                        </div>
                        <div>You were disqualified from this proctored examination. Retake is eligible in approximately {remainingHours} hours.</div>
                      </div>
                    )}

                    {/* Completed Result Summary if attempted */}
                    {isCompleted && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Your Score</div>
                          <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
                            {res.score} / {res.totalQuestions} ({res.accuracy}%)
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openReviewAnswers(res)}
                          className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-bold rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 transition-colors shadow-sm"
                        >
                          Review Answers
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action CTA */}
                  <div className="pt-6">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => !isLocked && startTest(exam.id)}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                        isLocked
                          ? 'bg-rose-950/70 border border-rose-800 text-rose-300 cursor-not-allowed opacity-80'
                          : isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-white active:scale-95'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 active:scale-95'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 text-rose-400" />
                          <span>Exam Locked (24h Disqualification)</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-amber-300" />
                          <span>{isCompleted ? 'Retake Proctored Exam' : 'Launch Proctored Exam'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-5 shadow-subtle space-y-4 transition-colors">
            {/* Subject Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {subjectList.map((subj) => {
                const isSelected = selectedSubjectFilter === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubjectFilter(subj)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-text-secondary dark:text-slate-400 border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

            {/* Search & Secondary Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-border dark:border-slate-800">
              {/* Search box */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-text-secondary dark:text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by chapter, concept or test number..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* View Switcher: List vs Grid */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-primary-light shadow-sm'
                        : 'text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">List View (200 Problems)</span>
                    <span className="sm:hidden">List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-primary-light shadow-sm'
                        : 'text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                </div>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white outline-none focus:border-primary"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white outline-none focus:border-primary"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">✓ Completed</option>
                  <option value="Not Started">Not Started</option>
                </select>

                {(selectedDifficulty !== 'All' || selectedStatus !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedDifficulty('All');
                      setSelectedStatus('All');
                      setSearchQuery('');
                      setSelectedSubjectFilter('All');
                    }}
                    className="p-2 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                    title="Reset filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tests Hierarchy View or List-Wise Directory */}
          {filteredTests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-12 text-center shadow-subtle">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-text-primary dark:text-white">No matching problems found</h4>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
                Try adjusting your search terms or filters above.
              </p>
              <button
                onClick={() => {
                  setSelectedSubjectFilter('All');
                  setSelectedDifficulty('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* ==================================================== */
            /* 1. LIST-WISE DIRECTORY VIEW (200 SEQUENTIAL PROBLEMS) */
            /* ==================================================== */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 overflow-hidden shadow-card">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-border dark:border-slate-700 text-[11px] font-extrabold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                <div className="col-span-1">Problem #</div>
                <div className="col-span-2">Subject</div>
                <div className="col-span-4">Chapter & Concept Focus</div>
                <div className="col-span-1">Difficulty</div>
                <div className="col-span-1">Questions</div>
                <div className="col-span-1">Duration</div>
                <div className="col-span-2 text-right">Status & Action</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border dark:divide-slate-800">
                {filteredTests.map((test) => {
                  const res = results[test.id];
                  const isCompleted = !!res;

                  return (
                    <div
                      key={test.id}
                      className="p-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-start lg:items-center"
                    >
                      {/* Problem Number */}
                      <div className="col-span-1 flex items-center gap-2">
                        <span className="w-10 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/80 text-primary dark:text-primary-light font-black text-xs flex items-center justify-center border border-primary-200 dark:border-primary-800">
                          #{test.problemNumber ? String(test.problemNumber).padStart(3, '0') : '001'}
                        </span>
                      </div>

                      {/* Subject */}
                      <div className="col-span-2 flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap"
                          style={{
                            backgroundColor: `${SUBJECT_METAS[test.subject]?.bgColor || '#EFF6FF'}`,
                            color: `${SUBJECT_METAS[test.subject]?.color || '#2563EB'}`,
                            borderColor: `${SUBJECT_METAS[test.subject]?.color || '#2563EB'}33`,
                          }}
                        >
                          {test.subject}
                        </span>
                      </div>

                      {/* Chapter & Concepts */}
                      <div className="col-span-4 min-w-0">
                        <h5 className="text-sm font-bold text-text-primary dark:text-white truncate" title={test.chapter}>
                          {test.chapter}
                        </h5>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">
                            Ch {test.chapterNumber}
                          </span>
                          {test.concepts?.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                            >
                              #{c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="col-span-1">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            test.difficulty === 'Easy'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                              : test.difficulty === 'Medium'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {test.difficulty}
                        </span>
                      </div>

                      {/* Questions Count */}
                      <div className="col-span-1 text-xs font-semibold text-text-secondary dark:text-slate-400">
                        {test.questionsCount} Qs (5 Opt)
                      </div>

                      {/* Duration */}
                      <div className="col-span-1 text-xs font-semibold text-text-secondary dark:text-slate-400">
                        {test.durationMinutes} mins
                      </div>

                      {/* Status & CTA */}
                      <div className="col-span-2 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3">
                        {isCompleted ? (
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-xs font-bold text-success dark:text-emerald-400">
                                {res.score}/{res.totalQuestions} ({res.accuracy}%)
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => openReviewAnswers(res)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-text-primary dark:text-white border border-border dark:border-slate-700 transition-colors"
                            >
                              Review
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startTest(test.id)}
                            className="w-full lg:w-auto px-4 py-1.5 rounded-lg text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Solve</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ==================================================== */
            /* 2. SUBJECT GRID CARDS VIEW                           */
            /* ==================================================== */
            <div className="space-y-10">
              {Object.entries(groupedStructure).map(([subjectName, chaptersMap]) => {
                return (
                  <div key={subjectName} className="space-y-6">
                    {/* Subject Header */}
                    <div className="flex items-center justify-between border-b border-border dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-text-primary dark:text-white">
                          {subjectName}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-slate-400 border border-border dark:border-slate-700">
                          {Object.values(chaptersMap).reduce((acc, tList) => acc + tList.length, 0)} Tests
                        </span>
                      </div>
                    </div>

                    {/* Chapters within this Subject */}
                    <div className="space-y-8">
                      {Object.entries(chaptersMap).map(([chapterName, chapterTests], chIdx) => {
                        const chCompletedCount = chapterTests.filter((t) => results[t.id]).length;

                        return (
                          <div
                            key={chapterName}
                            className="bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border border-border dark:border-slate-800 p-5 sm:p-6 transition-colors"
                          >
                            {/* Chapter Title Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/70 dark:border-slate-800">
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-950/80 text-primary dark:text-primary-light font-bold text-xs flex items-center justify-center">
                                  {chIdx + 1}
                                </span>
                                <h4 className="text-sm sm:text-base font-bold text-text-primary dark:text-white">
                                  Chapter {chIdx + 1} — {chapterName}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-medium text-text-secondary dark:text-slate-400">
                                <span>
                                  {chCompletedCount} of {chapterTests.length} Tests Completed
                                </span>
                                <div className="w-20 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-success rounded-full"
                                    style={{
                                      width: `${Math.round((chCompletedCount / chapterTests.length) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Chapter Test Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                              {chapterTests.map((test) => (
                                <TestCard
                                  key={test.id}
                                  test={test}
                                  result={results[test.id]}
                                  onStart={startTest}
                                  onReview={openReviewAnswers}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
