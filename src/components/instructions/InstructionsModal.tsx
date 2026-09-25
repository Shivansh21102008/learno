import React, { useState } from 'react';
import { ActiveTab } from '../../types';
import {
  Compass,
  X,
  Search,
  BookOpen,
  LayoutDashboard,
  FileCheck2,
  Trophy,
  User as UserIcon,
  ShieldCheck,
  Bot,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  Clock,
  Mic,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAiTutor: () => void;
  onOpenClassModal: () => void;
}

interface FeatureGuideItem {
  id: string;
  category: 'core' | 'ai' | 'proctor' | 'exam' | 'profile';
  title: string;
  location: string;
  icon: React.ReactNode;
  badge: string;
  summary: string;
  whatHappensWhenClicked: string[];
  tips: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAiTutor,
  onOpenClassModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const features: FeatureGuideItem[] = [
    {
      id: 'home',
      category: 'core',
      title: 'Home Page & Curriculum Explorer',
      location: 'Top Navbar -> "Home"',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      badge: 'Classes 5–9 Gateway',
      summary: 'The main introductory portal introducing Learno, its NCERT/CBSE curriculum mapping, and interactive previews.',
      whatHappensWhenClicked: [
        'Switches to the interactive Home page showcasing learning metrics and syllabus previews.',
        'Lets you toggle between Classes 5, 6, 7, 8, and 9 to see all 8 subjects and preview their first few chapters.',
        'Clicking "Start Learning" or "Explore Tests" guides you straight to your personalized dashboard or the 200 problem directory.',
      ],
      tips: [
        'Scroll down on the Home page to explore subject curricula, class overviews, and interactive learning features.',
      ],
      actionLabel: 'Go to Home',
      onAction: () => {
        onClose();
        onNavigate('home');
      },
    },
    {
      id: 'dashboard',
      category: 'core',
      title: 'Dashboard & Mission Control',
      location: 'Top Navbar -> "Dashboard"',
      icon: <LayoutDashboard className="w-5 h-5 text-indigo-500" />,
      badge: 'Daily Command Hub',
      summary: 'Your daily study center showing your active syllabus class, accuracy dial, streak counter, and rapid test launchers.',
      whatHappensWhenClicked: [
        'Displays your overall Accuracy % gauge, total solved tests (out of 200), and current study streak in days.',
        'Displays subject-wise progress bars showing how many tests you have completed in each subject.',
        'Features the primary launcher for the "Learno AI Viva Hub" oral examiner.',
      ],
      tips: [
        'Clicking any subject card on the dashboard directly filters the 200 problem tests for that subject.',
      ],
      actionLabel: 'Go to Dashboard',
      onAction: () => {
        onClose();
        onNavigate('dashboard');
      },
    },
    {
      id: 'tests-200',
      category: 'exam',
      title: '200 Problems Directory (List View & Grid View)',
      location: 'Top Navbar -> "Tests"',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-500" />,
      badge: '200 Distinct Chapters',
      summary: 'Every student gets 200 distinct problem tests numbered sequentially from #001 to #200 covering all 8 school subjects without duplicate fallbacks.',
      whatHappensWhenClicked: [
        'Defaults to the "📋 List View (200 Problems)" table showing Problem Number (#001–#200), Subject, Chapter Name, Concept Tags (#LinearEquations, #Photosynthesis), and Difficulty.',
        'Click the "🗂️ Grid View" toggle to switch to an accordion layout grouped by subject and chapter cards.',
        'Clicking the "Solve" button starts that specific chapter test in an immersive exam environment.',
      ],
      tips: [
        'Use the top search bar in Tests to search by problem number (e.g., "#045"), concept tag, or chapter keyword.',
      ],
      actionLabel: 'Go to 200 Tests Directory',
      onAction: () => {
        onClose();
        onNavigate('tests');
      },
    },
    {
      id: 'test-engine',
      category: 'exam',
      title: '5-Option Examination Engine',
      location: 'Tests Directory -> Click "Solve"',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      badge: '5 Options: A, B, C, D, E',
      summary: 'Full-screen examination interface strictly adhering to standard competitive and school testing rules.',
      whatHappensWhenClicked: [
        'Opens the test in dedicated full-screen mode with question navigator palette (1–20), countdown timer, and "Mark for Review" button.',
        'Each question strictly features 5 distinct answer choices (A, B, C, D, E) preventing simple 50/50 guessing.',
        'Submitting calculates instant accuracy %, awards bonus XP, updates badges, and offers a comprehensive "Review Answers" sheet with step-by-step solutions.',
      ],
      tips: [
        'You can flag tough questions with "Mark for Review" and jump back to them via the 20-number grid at any time before submitting.',
      ],
      actionLabel: 'Open Tests',
      onAction: () => {
        onClose();
        onNavigate('tests');
      },
    },
    {
      id: 'proctor-guard',
      category: 'proctor',
      title: 'AI Proctor Guard & 24-Hour Security Lock',
      location: 'Dashboard or Tests -> Proctored Exam',
      icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
      badge: 'Security & Integrity',
      summary: 'Real-time multi-sensor artificial intelligence proctoring ensuring 100% genuine student test results.',
      whatHappensWhenClicked: [
        'Opens the Device Pre-Check Gate to verify camera permissions, face framing, and microphone audio level.',
        'During the exam, AI monitors for: head turning sideways, moving out of frame, raising hands/unusual movements, and elevated room noise.',
        'If a student accumulates 3 critical violations, they are Disqualified and locked out from retaking that exam for 24 Hours.',
        'The disqualification modal includes a countdown timer until eligibility restores and a "Back to Home" button for clean exit.',
      ],
      tips: [
        'Take proctored exams in a well-lit, quiet room and keep your face centered in the camera feed.',
      ],
    },
    {
      id: 'ai-viva',
      category: 'ai',
      title: 'AI Viva Hub ("Mujhe Nahi Aata" & Professional English)',
      location: 'Dashboard -> "Start AI Viva Hub"',
      icon: <Mic className="w-5 h-5 text-violet-500" />,
      badge: 'Oral Diagnostic Examiner',
      summary: 'Interactive verbal examination where the AI teacher talks directly with the student, asks oral questions, evaluates answers, and explains difficult concepts.',
      whatHappensWhenClicked: [
        'Select between 3 Difficulty Modes: Easy (10 chapters), Intermediate (20 chapters), or Hard (40 chapters).',
        'Speak your answer via microphone or type it in. The AI responds with voice speech and real-time evaluation.',
        '💡 "Mujhe Nahi Aata — AI Samjha Do": If you don\'t know an answer, click this button or say "mujhe nahi aata". The AI speaks out an encouraging explanation, displays a green "Sahi Version" card with real-world examples, and lets you re-try or advance!',
        'Full Professional English for Communication: For Communication chapters, the AI speaks in high-level executive English and gives a 100% diagnostic report with Spoken Fluency Score and Professional Tone Score.',
      ],
      tips: [
        'Use headphones for the clearest voice speech recognition and audio output.',
      ],
      actionLabel: 'Go to Dashboard for AI Viva',
      onAction: () => {
        onClose();
        onNavigate('dashboard');
      },
    },
    {
      id: 'ai-tutor',
      category: 'ai',
      title: 'Adjustable AI Tutor Right-Sidebar Drawer',
      location: 'Top Navbar -> "AI Tutor" Button',
      icon: <Bot className="w-5 h-5 text-primary" />,
      badge: '24/7 Academic Study Assistant',
      summary: 'A resizable, adjustable educational companion on the right edge of your screen that answers any doubt in school subjects or Learno platform features.',
      whatHappensWhenClicked: [
        'Slides in smoothly as a dedicated study sidebar on the right side of the screen.',
        'Adjustable Modes: Use it as a convenient sidebar drawer OR click the Maximize button to expand it into a Full-Page interactive learning studio!',
        'Ask anything: Step-by-step Math problem solving, Science explanations, English grammar rules, Coding snippets, Hindi & Sanskrit vyakaran, or platform help.',
        'Features voice read-aloud (SpeechSynthesis), microphone speech recognition, quick suggestion chips, and instant copy buttons.',
        'Close anytime with the "X" button or by clicking outside.',
      ],
      tips: [
        'Click the expand icon in the top header of the AI Tutor to study in full-page mode when reviewing long explanations!',
      ],
      actionLabel: 'Open AI Tutor Now',
      onAction: () => {
        onClose();
        onOpenAiTutor();
      },
    },
    {
      id: 'achievements',
      category: 'profile',
      title: 'Achievements & Milestones',
      location: 'Top Navbar -> "Achievements"',
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      badge: 'Badges & Streaks',
      summary: 'Earn badges for consistency, precision, test completion, and speed.',
      whatHappensWhenClicked: [
        'Shows your unlocked achievement badges (e.g., Century Solver, Perfectionist, Early Bird, Streak Master).',
        'When you unlock a new badge during a test, an animated golden toast notification celebrates your milestone!',
      ],
      tips: [
        'Maintain a 3-day and 7-day test streak to unlock the exclusive Consistency Champion badges.',
      ],
      actionLabel: 'View Achievements',
      onAction: () => {
        onClose();
        onNavigate('achievements');
      },
    },
    {
      id: 'profile-class',
      category: 'profile',
      title: 'Profile & Class Switcher (Classes 5 to 9)',
      location: 'Top Navbar -> Class Pill or "Profile"',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      badge: 'Classes 5, 6, 7, 8, 9',
      summary: 'Customize your academic profile and instantly switch your active curriculum syllabus between Classes 5, 6, 7, 8, and 9.',
      whatHappensWhenClicked: [
        'Clicking the Class Pill in the navbar (e.g. "Class 8") opens the Academic Class Switcher modal.',
        'Selecting a new class immediately reconfigures all 200 chapters, subject topics, and tests to match that class\'s official syllabus.',
      ],
      tips: [
        'You can switch classes at any time without losing your general account profile.',
      ],
      actionLabel: 'Change Academic Class',
      onAction: () => {
        onClose();
        onOpenClassModal();
      },
    },
  ];

  // Filtering
  const filteredFeatures = features.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query) ||
      item.whatHappensWhenClicked.some((s) => s.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent
        className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border dark:border-slate-800 flex flex-col overflow-hidden transition-colors"
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-primary text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                  Learno Platform Guide
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  Instructions
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                How Learno Works & Feature Directory
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            title="Close Instructions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader Search & Category Filters */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-b border-border dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between flex-shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. proctor, viva, 200, tests)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-700 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Features' },
              { id: 'core', label: 'Core & Home' },
              { id: 'exam', label: '200 Tests' },
              { id: 'ai', label: 'AI Viva & Tutor' },
              { id: 'proctor', label: 'Proctor Guard' },
              { id: 'profile', label: 'Class & Profile' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white border border-border dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-text-primary dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Complete Guide to the Learno Educational Ecosystem
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed">
                Learno provides an authentic NCERT/CBSE learning system exclusively for <strong>Classes 5 to 9</strong> across <strong>8 subjects</strong> with 200 sequential chapter tests, AI viva diagnostics, 24/7 AI tutor sidebar, and proctoring security.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onOpenAiTutor();
                }}
                className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                Ask AI Tutor
              </button>
            </div>
          </div>

          {/* Feature List Grid */}
          <div className="space-y-5">
            {filteredFeatures.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  No features match "{searchQuery}"
                </h4>
                <p className="text-xs text-text-secondary dark:text-slate-400">
                  Try searching for keywords like "test", "viva", "proctor", "class", or reset category filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              filteredFeatures.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-primary-300 dark:hover:border-primary-700 shadow-subtle transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-text-primary dark:text-white">
                            {item.title}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light text-[10px] font-extrabold border border-primary-200 dark:border-primary-800">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          📍 Located at: <span className="text-primary dark:text-primary-light">{item.location}</span>
                        </span>
                      </div>
                    </div>

                    {item.actionLabel && item.onAction && (
                      <button
                        onClick={item.onAction}
                        className="self-start sm:self-auto px-3.5 py-2 bg-primary-50 dark:bg-primary-950/60 hover:bg-primary dark:hover:bg-primary text-primary dark:text-primary-light hover:text-white dark:hover:text-white rounded-xl text-xs font-bold transition-all border border-primary-200 dark:border-primary-800 flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* What happens when clicked */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/80 dark:border-slate-800 space-y-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      What happens when you click / use this:
                    </span>
                    <ul className="space-y-1.5 text-xs text-text-secondary dark:text-slate-300 pl-5 list-disc">
                      {item.whatHappensWhenClicked.map((action, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tip */}
                  {item.tips.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/70 dark:border-amber-900/50">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">Pro Tip: </span>
                        {item.tips[0]}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-border dark:border-slate-800 flex items-center justify-between text-xs text-text-secondary dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Learno Multi-Subject Interactive Platform • Classes 5 to 9</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
};
