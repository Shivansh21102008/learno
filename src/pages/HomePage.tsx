import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ActiveTab, VALID_CLASSES, StudentClass } from '../types';
import { SUBJECT_METAS, CLASS_CHAPTERS } from '../data/curriculumData';
import { BadgeIcon } from '../components/common/BadgeIcon';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Target,
  Flame,
  Layers,
  BookOpen,
  Bot,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Compass,
  Mic,
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenClassModal: () => void;
  onOpenInstructions?: () => void;
  onOpenAiTutor?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onOpenClassModal,
  onOpenInstructions,
  onOpenAiTutor,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [previewClass, setPreviewClass] = useState<StudentClass>(user.class || 'Class 8');

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartLearning = () => {
    if (!isAuthenticated) {
      openAuthModal('signup');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleExploreTests = () => {
    setActiveTab('tests');
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-card transition-colors">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Target Audience Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary dark:text-primary-light text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Exclusively Built for Classes 5, 6, 7, 8 & 9</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary dark:text-white tracking-tight leading-tight">
            Learn Smarter. <span className="text-primary dark:text-primary-light">Practice Better.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master your school syllabus through chapter-wise tests and track your progress with
            Learno. Designed to make academic practice consistent, structured, and rewarding.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleStartLearning}
              className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm hover:shadow-lg active:scale-95"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleExploreTests}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-text-primary dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-border dark:border-slate-700"
            >
              <span>Explore Tests</span>
              <BookOpen className="w-4 h-4 text-primary dark:text-primary-light" />
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-6 border-t border-border dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success dark:text-emerald-400" />
              <span>200 Tests Per Curriculum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success dark:text-emerald-400" />
              <span>5-Option Exam Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success dark:text-emerald-400" />
              <span>NCERT & CBSE Aligned</span>
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => scrollToSection('#features-showcase')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all border border-border dark:border-slate-700 shadow-sm hover:scale-105 active:scale-95 group"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Explore Platform Features</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-indigo-500" />
            </button>

            <button
              onClick={() => scrollToSection('#curriculum-explorer')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all border border-border dark:border-slate-700 shadow-sm hover:scale-105 active:scale-95 group"
            >
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>View Syllabus (Classes 5–9)</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-primary" />
            </button>
          </div>
        </div>

        {/* Ambient Gradient Orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-500/15 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />
      </section>

      {/* Highlights Bar */}
      <section id="stats-bar" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-subtle flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-text-primary dark:text-white">200 Tests</div>
            <div className="text-xs text-text-secondary dark:text-slate-400">Chapter-wise curriculum</div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-subtle flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-success dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-text-primary dark:text-white">Instant Accuracy</div>
            <div className="text-xs text-text-secondary dark:text-slate-400">Real-time performance analytics</div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-subtle flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-warning dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-text-primary dark:text-white">Daily Streaks</div>
            <div className="text-xs text-text-secondary dark:text-slate-400">Habit-building practice</div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-subtle flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-text-primary dark:text-white">Achievement Badges</div>
            <div className="text-xs text-text-secondary dark:text-slate-400">Milestones & rewards</div>
          </div>
        </div>
      </section>

      {/* 🌟 Interactive Feature Showcase */}
      <section id="features-showcase" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light text-xs font-extrabold uppercase tracking-wide border border-primary-200 dark:border-primary-800">
            <Sparkles className="w-3.5 h-3.5" />
            Learno Intelligent Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary dark:text-white">
            Built for Academic Excellence
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
            Discover the comprehensive suite of educational tools built exclusively for Classes 5 to 9.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: 200 Problems Engine */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-card hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                📋
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary dark:text-white">200 Problems</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                  #001–#200
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed">
                200 distinct chapter tests per class. Switch between the sequential List View and Subject Grid View with concept tags.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tests')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-primary text-primary dark:text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-900 flex items-center justify-center gap-1.5"
            >
              <span>Solve Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: AI Viva Hub */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-card hover:border-violet-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary dark:text-white">AI Viva Hub</h3>
                <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase">
                  Oral Viva
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed">
                Interactive voice examiner. Includes 💡 "Mujhe Nahi Aata" concept teacher explanation and full professional English oral diagnostics.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-600 text-violet-700 dark:text-violet-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-violet-200 dark:border-violet-900 flex items-center justify-center gap-1.5"
            >
              <span>Launch AI Viva</span>
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: 24/7 AI Tutor Sidebar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-card hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary dark:text-white">AI Tutor Sidebar</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                  Adjustable
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed">
                Ask any doubt across all 8 subjects. Expand into Full Page mode or use as a right-side drawer with voice read-aloud and mic input.
              </p>
            </div>
            <button
              onClick={() => onOpenAiTutor?.()}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-200 dark:border-emerald-900 flex items-center justify-center gap-1.5"
            >
              <span>Ask AI Tutor</span>
              <Bot className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Platform Guide & Instructions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-card hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                🧭
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary dark:text-white">Instructions</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase">
                  Guide
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed">
                Complete searchable guide explaining every feature, proctoring security rules, and what happens when you click any button.
              </p>
            </div>
            <button
              onClick={() => onOpenInstructions?.()}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-amber-200 dark:border-amber-900 flex items-center justify-center gap-1.5"
            >
              <span>Open Guide</span>
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Curriculum Explorer: Interactive Preview for Classes 5 to 9 */}
      <section id="curriculum-explorer" className="bg-white dark:bg-slate-900 rounded-3xl border border-border dark:border-slate-800 p-6 sm:p-10 shadow-card transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light">
              Curriculum Explorer
            </span>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
              Explore Syllabus for Classes 5–9
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
              See the exact chapters and subjects available for each class.
            </p>
          </div>

          {/* Class Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 overflow-x-auto">
            {VALID_CLASSES.map((c) => {
              const isSelected = previewClass === c;
              return (
                <button
                  key={c}
                  onClick={() => setPreviewClass(c)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subjects Grid for Selected Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(CLASS_CHAPTERS[previewClass]).map(([subjName, chapters]) => {
            const meta = SUBJECT_METAS[subjName];
            return (
              <div
                key={subjName}
                className="p-5 rounded-2xl border border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-card hover:border-primary-200 dark:hover:border-primary-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-sm"
                      style={{ backgroundColor: meta.bgColor, color: meta.color }}
                    >
                      <BadgeIcon name={meta.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary dark:text-white">{subjName}</h3>
                      <span className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">
                        {meta.testCount} Practice Tests • {chapters.length} Chapters
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary dark:text-slate-400 mb-3 leading-relaxed">
                    {meta.description}
                  </p>

                  <div className="space-y-1.5">
                    {chapters.slice(0, 3).map((ch, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-text-primary dark:text-slate-200 flex items-center gap-2 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-border/80 dark:border-slate-700/80"
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-text-secondary dark:text-slate-300 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="truncate">{ch}</span>
                      </div>
                    ))}
                    {chapters.length > 3 && (
                      <div className="text-[11px] text-primary dark:text-primary-light font-semibold pl-2">
                        + {chapters.length - 3} more chapters in {previewClass}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary dark:text-slate-400">NCERT Aligned</span>
                  <button
                    onClick={() => {
                      if (user.class !== previewClass) {
                        onOpenClassModal();
                      } else {
                        setActiveTab('tests');
                      }
                    }}
                    className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1"
                  >
                    <span>Practice Tests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Learno Works */}
      <section id="how-it-works" className="bg-slate-900 dark:bg-slate-900 border border-transparent dark:border-slate-800 text-white rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-200">
            Structured Learning Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1">How Learno Helps You Excel</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            A scientifically designed practice cycle that turns school lessons into mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-200 flex items-center justify-center text-sm font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Select Your Class & Chapter</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Choose your school class (Class 5 to 9) and navigate chapter-by-chapter according to
              your school syllabus.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-200 flex items-center justify-center text-sm font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Timed 5-Option Tests</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Take realistic 20-question examinations under timed conditions with 5 multiple-choice
              options and question navigator.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-200 flex items-center justify-center text-sm font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Analyze & Earn Badges</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Review full step-by-step solutions, inspect accuracy rates, build daily streaks, and
              unlock achievement badges.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleStartLearning}
            className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <span>Start Practice Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
