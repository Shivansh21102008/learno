import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { TestCard } from '../components/test/TestCard';
import { SUBJECT_METAS } from '../data/curriculumData';
import {
  Search,
  RotateCcw,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  List,
  LayoutGrid,
  GraduationCap,
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
  const { tests, results, stats, startTest, openReviewAnswers } = useCurriculum();

  // Tab: Chapter Tests (200) vs Main Examinations (3 Term Exams)
  const [examCategory, setExamCategory] = useState<'chapter_tests' | 'main_exams'>('chapter_tests');

  // View Mode: List View (Sequential 200 Problems) vs Subject Grid View
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filters for chapter tests
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Completed' | 'Not Started'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Separate main exams from chapter tests
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
      {/* Top Telemetry Banner */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 rounded border border-[#00FF66]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
              ASSESSMENT RIG // {user.class.toUpperCase()}
            </span>
            <button
              onClick={onOpenClassModal}
              className="font-mono text-[10px] uppercase tracking-wider text-slate-300 hover:text-[#00FF66] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-white/10 transition-colors"
              title="Click to switch class"
            >
              [ SWITCH CLASS ]
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
            {examCategory === 'main_exams' ? 'Comprehensive Term Examinations' : 'Curriculum Practice Modules'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            {examCategory === 'main_exams'
              ? 'Multi-subject milestone assessments covering full syllabus across core academic disciplines.'
              : 'Structured syllabus test bank: Class → Subject → Chapter → Problem Rig.'}
          </p>
        </div>

        {/* Total Tests Counter Box */}
        <div className="flex items-center gap-4 bg-[#050505] border border-white/10 px-5 py-3 rounded-xl shadow-inner font-mono">
          <div className="text-center pr-4 border-r border-white/10">
            <div className="text-xl sm:text-2xl font-display font-black text-white">
              {stats.totalTests}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Chapter Tests</div>
          </div>
          <div className="text-center pr-4 border-r border-white/10">
            <div className="text-xl sm:text-2xl font-display font-black text-[#00FF66]">
              {stats.testsCompleted}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-display font-black text-blue-400">
              {mainExams.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Term Rigs</div>
          </div>
        </div>
      </div>

      {/* Category Tabs: Chapter Practice Tests vs Main Examinations */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0A0D14]/90 rounded-2xl border border-white/10 w-full sm:w-fit font-mono">
        <button
          onClick={() => setExamCategory('chapter_tests')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            examCategory === 'chapter_tests'
              ? 'bg-[#00FF66] text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>[ CHAPTER TESTS // 200 ]</span>
        </button>

        <button
          onClick={() => setExamCategory('main_exams')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            examCategory === 'main_exams'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>[ TERM EXAMINATIONS // 3 RIGS ]</span>
        </button>
      </div>

      {/* View Switcher: Main Examinations vs Chapter Practice Tests */}
      {examCategory === 'main_exams' ? (
        <div className="space-y-8">
          {/* Examination Overview Banner */}
          <div className="p-6 sm:p-8 bg-[#0A0D14]/90 rounded-3xl border border-white/10 shadow-card space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-mono inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                    OFFICIAL TERM ENVIRONMENT
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-white mt-1">
                    Integrated Full-Syllabus Term Assessments
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instant Direct Launch
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Timed Assessment
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
              Main Examinations are comprehensive assessments designed to evaluate your syllabus mastery in <strong>{user.class}</strong> across all core subjects: Mathematics, Science, Social Science, English, and Computer. Launch any examination directly with 1-click.
            </p>
          </div>

          {/* 3 Main Examination Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mainExams.map((exam, idx) => {
              const res = results[exam.id];
              const isCompleted = !!res;

              return (
                <div
                  key={exam.id}
                  className={`rounded-3xl border transition-all p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group ${
                    isCompleted
                      ? 'bg-[#0A0D14]/90 border-[#00FF66]/40 shadow-[0_0_20px_rgba(0,255,102,0.1)]'
                      : 'bg-[#0A0D14]/90 border-white/10 hover:border-[#00FF66]/50 shadow-card'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono px-3 py-1 rounded bg-blue-500/10 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                        OFFICIAL RIG 0{idx + 1}
                      </span>
                      {isCompleted ? (
                        <span className="font-mono px-3 py-1 rounded bg-[#00FF66]/10 text-[#00FF66] text-xs font-bold flex items-center gap-1 border border-[#00FF66]/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="font-mono px-3 py-1 rounded bg-white/5 text-slate-400 text-xs font-bold flex items-center gap-1 border border-white/10">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Full Syllabus
                        </span>
                      )}
                    </div>

                    {/* Title & Subject */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00FF66] transition-colors leading-snug">
                        {exam.chapter}
                      </h4>
                      <div className="font-mono text-xs text-slate-400 mt-1 font-medium">
                        {exam.subject} • {user.class}
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#050505] border border-white/10 text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase">Questions</div>
                        <div className="font-bold text-white mt-0.5">{exam.questionsCount} MCQs (5 Opt)</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase">Time Limit</div>
                        <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#00FF66]" /> {exam.durationMinutes} Mins
                        </div>
                      </div>
                    </div>

                    {/* Syllabus Coverage Notice */}
                    <div className="p-3 rounded-xl bg-[#050505] border border-white/10 text-[11px] text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white font-mono">
                        <BookOpen className="w-3.5 h-3.5 text-[#00FF66]" /> Examination Structure
                      </div>
                      <div>• Balanced multi-subject questions covering {user.class}</div>
                      <div>• Instant telemetry evaluation and detailed answer keys</div>
                    </div>

                    {/* Completed Result Summary if attempted */}
                    {isCompleted && (
                      <div className="p-3.5 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-between">
                        <div>
                          <div className="font-mono text-[10px] uppercase font-bold text-slate-400">Score Telemetry</div>
                          <div className="font-display text-base font-black text-[#00FF66]">
                            {res.score} / {res.totalQuestions} ({res.accuracy}%)
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openReviewAnswers(res)}
                          className="px-3 py-1.5 bg-[#0A0D14] hover:bg-[#00FF66] hover:text-black text-xs font-mono font-bold rounded-lg border border-[#00FF66]/40 text-[#00FF66] transition-colors shadow-sm"
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
                      onClick={() => startTest(exam.id)}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        isCompleted
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                          : 'bg-[#00FF66] hover:bg-[#00FF66]/90 text-black shadow-[0_0_20px_rgba(0,255,102,0.3)]'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isCompleted ? 'RETAKE EXAMINATION' : 'LAUNCH EXAMINATION'}</span>
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
          <div className="bg-[#0A0D14]/90 rounded-2xl border border-white/10 p-5 shadow-card space-y-4 transition-colors">
            {/* Subject Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono">
              {subjectList.map((subj) => {
                const isSelected = selectedSubjectFilter === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubjectFilter(subj)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                        : 'bg-[#050505] text-slate-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {subj.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Search & Secondary Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-white/10">
              {/* Search box */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by chapter, concept or problem #..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white placeholder-slate-500 focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none transition-all font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono">
                {/* View Switcher: List vs Grid */}
                <div className="flex items-center bg-[#050505] p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      viewMode === 'list'
                        ? 'bg-[#00FF66] text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">List View (200)</span>
                    <span className="sm:hidden">List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      viewMode === 'grid'
                        ? 'bg-[#00FF66] text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
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
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-[#050505] text-slate-300 outline-none focus:border-[#00FF66]"
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
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-[#050505] text-slate-300 outline-none focus:border-[#00FF66]"
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
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/10"
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
            <div className="bg-[#0A0D14]/90 rounded-2xl border border-white/10 p-12 text-center shadow-card font-mono">
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 mx-auto flex items-center justify-center mb-3 border border-white/10">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white uppercase">No matching problems found</h4>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search query or reset filters.
              </p>
              <button
                onClick={() => {
                  setSelectedSubjectFilter('All');
                  setSelectedDifficulty('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#00FF66] text-black text-xs font-bold rounded-lg shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* ==================================================== */
            /* 1. LIST-WISE DIRECTORY VIEW (200 SEQUENTIAL PROBLEMS) */
            /* ==================================================== */
            <div className="bg-[#0A0D14]/90 rounded-2xl border border-white/10 overflow-hidden shadow-card">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#050505] border-b border-white/10 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <div className="col-span-1">Problem #</div>
                <div className="col-span-2">Subject</div>
                <div className="col-span-4">Chapter & Concept Focus</div>
                <div className="col-span-1">Difficulty</div>
                <div className="col-span-1">Questions</div>
                <div className="col-span-1">Duration</div>
                <div className="col-span-2 text-right">Status & Action</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/10">
                {filteredTests.map((test) => {
                  const res = results[test.id];
                  const isCompleted = !!res;

                  return (
                    <div
                      key={test.id}
                      className="p-4 sm:px-6 hover:bg-[#050505]/60 transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-start lg:items-center group"
                    >
                      {/* Problem Number */}
                      <div className="col-span-1 flex items-center gap-2">
                        <span className="font-mono w-10 h-7 rounded-lg bg-[#00FF66]/10 text-[#00FF66] font-bold text-xs flex items-center justify-center border border-[#00FF66]/30">
                          #{test.problemNumber ? String(test.problemNumber).padStart(3, '0') : '001'}
                        </span>
                      </div>

                      {/* Subject */}
                      <div className="col-span-2 flex items-center gap-2">
                        <span
                          className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap bg-white/5 text-slate-300 border-white/10"
                        >
                          {test.subject}
                        </span>
                      </div>

                      {/* Chapter & Concepts */}
                      <div className="col-span-4 min-w-0">
                        <h5 className="text-sm font-bold text-white group-hover:text-[#00FF66] transition-colors truncate" title={test.chapter}>
                          {test.chapter}
                        </h5>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className="font-mono text-[10px] text-slate-400">
                            Ch {test.chapterNumber}
                          </span>
                          {test.concepts?.map((c, i) => (
                            <span
                              key={i}
                              className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10"
                            >
                              #{c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="col-span-1">
                        <span
                          className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                            test.difficulty === 'Easy'
                              ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30'
                              : test.difficulty === 'Medium'
                              ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {test.difficulty}
                        </span>
                      </div>

                      {/* Questions Count */}
                      <div className="col-span-1 font-mono text-xs text-slate-400">
                        {test.questionsCount} Qs
                      </div>

                      {/* Duration */}
                      <div className="col-span-1 font-mono text-xs text-slate-400">
                        {test.durationMinutes} mins
                      </div>

                      {/* Status & CTA */}
                      <div className="col-span-2 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 font-mono">
                        {isCompleted ? (
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-xs font-bold text-[#00FF66]">
                                {res.score}/{res.totalQuestions} ({res.accuracy}%)
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => openReviewAnswers(res)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-[#00FF66] hover:text-black text-white border border-white/15 transition-colors"
                            >
                              Review
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startTest(test.id)}
                            className="w-full lg:w-auto px-4 py-1.5 rounded-lg text-xs font-bold bg-[#00FF66] hover:bg-[#00FF66]/90 text-black shadow-[0_0_12px_rgba(0,255,102,0.3)] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>SOLVE</span>
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
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg font-bold text-white uppercase">
                          {subjectName}
                        </span>
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
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
                            className="bg-[#050505] rounded-2xl border border-white/10 p-5 sm:p-6 transition-colors shadow-card"
                          >
                            {/* Chapter Title Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono w-6 h-6 rounded-lg bg-[#00FF66]/10 text-[#00FF66] font-bold text-xs flex items-center justify-center border border-[#00FF66]/30">
                                  {chIdx + 1}
                                </span>
                                <h4 className="text-sm sm:text-base font-bold text-white">
                                  Chapter {chIdx + 1} — {chapterName}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                                <span>
                                  {chCompletedCount} of {chapterTests.length} Tests Completed
                                </span>
                                <div className="w-20 h-2 bg-[#0A0D14] rounded-full overflow-hidden border border-white/10">
                                  <div
                                    className="h-full bg-[#00FF66]"
                                    style={{
                                      width: `${Math.round((chCompletedCount / chapterTests.length) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Chapter Test Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
