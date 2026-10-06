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
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  Clock,
  Mic,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenClassModal: () => void;
}

interface FeatureGuideItem {
  id: string;
  category: 'core' | 'ai' | 'exam' | 'profile';
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
      icon: <BookOpen className="w-5 h-5 text-glitch-green" />,
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
      icon: <LayoutDashboard className="w-5 h-5 text-glitch-green" />,
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
      icon: <FileCheck2 className="w-5 h-5 text-glitch-green" />,
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
      icon: <Clock className="w-5 h-5 text-glitch-green" />,
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
      id: 'ai-viva',
      category: 'ai',
      title: 'AI Viva Hub ("Mujhe Nahi Aata" & Professional English)',
      location: 'Dashboard -> "Start AI Viva Hub"',
      icon: <Mic className="w-5 h-5 text-glitch-green" />,
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
      id: 'achievements',
      category: 'profile',
      title: 'Achievements & Milestones',
      location: 'Top Navbar -> "Achievements"',
      icon: <Trophy className="w-5 h-5 text-glitch-green" />,
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
      icon: <Layers className="w-5 h-5 text-glitch-green" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        className="relative w-full max-w-5xl max-h-[92vh] bg-glitch-panel rounded-xl border border-glitch-border flex flex-col overflow-hidden transition-colors"
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-glitch-panel border-b border-glitch-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-glitch-surface flex items-center justify-center text-glitch-green border border-glitch-border shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                  Learno Platform Guide
                </span>
                <span className="px-2 py-0.5 rounded-full bg-glitch-green/20 text-glitch-green text-[10px] font-mono font-bold uppercase border border-glitch-green/30">
                  Instructions
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">
                How Learno Works & Feature Directory
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-glitch-surface hover:bg-glitch-ink border border-glitch-border text-text-secondary hover:text-text-primary transition-colors"
            title="Close Instructions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader Search & Category Filters */}
        <div className="px-6 py-3.5 bg-glitch-surface border-b border-glitch-border flex flex-col sm:flex-row gap-3 items-center justify-between flex-shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. viva, tests)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-glitch-ink border border-glitch-border font-mono text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-glitch-green focus:border-glitch-green transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-2 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Features' },
              { id: 'core', label: 'Core & Home' },
              { id: 'exam', label: '200 Tests' },
              { id: 'ai', label: 'AI Viva' },
              { id: 'profile', label: 'Class & Profile' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-glitch-green text-glitch-ink'
                    : 'bg-glitch-surface text-text-secondary hover:text-text-primary border border-glitch-border'
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
          <div className="p-4 sm:p-5 rounded-xl bg-glitch-surface border border-glitch-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-glitch-green" />
                Complete Guide to the Learno Educational Ecosystem
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Learno provides an authentic NCERT/CBSE learning system exclusively for <strong>Classes 5 to 9</strong> across <strong>8 subjects</strong> with 200 sequential chapter tests, AI viva diagnostics, and comprehensive performance telemetry.
              </p>
            </div>
          </div>

          {/* Feature List Grid */}
          <div className="space-y-5">
            {filteredFeatures.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <HelpCircle className="w-10 h-10 text-text-muted mx-auto" />
                <h4 className="text-sm font-bold text-text-primary">
                  No features match "{searchQuery}"
                </h4>
                <p className="text-xs text-text-secondary">
                  Try searching for keywords like "test", "viva", "class", "profile", or reset category filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 p-2.5 min-h-[44px] bg-glitch-green text-glitch-ink rounded-xl text-xs font-bold"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              filteredFeatures.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-xl border border-glitch-border bg-glitch-surface hover:border-glitch-green/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-glitch-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-glitch-border text-glitch-green">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-text-primary">
                            {item.title}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-glitch-green/10 text-glitch-green text-[10px] font-mono font-bold border border-glitch-green/20">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-text-muted">
                          📍 Located at: <span className="text-text-secondary">{item.location}</span>
                        </span>
                      </div>
                    </div>

                    {item.actionLabel && item.onAction && (
                      <button
                        onClick={item.onAction}
                        className="self-start sm:self-auto px-3.5 p-2.5 min-h-[44px] border border-glitch-border bg-glitch-card hover:bg-glitch-surface text-text-primary text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* What happens when clicked */}
                  <div className="p-3.5 rounded-xl bg-glitch-ink border border-glitch-border space-y-2 mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-glitch-green" />
                      What happens when you click / use this:
                    </span>
                    <ul className="space-y-1.5 text-xs text-text-secondary pl-5 list-disc">
                      {item.whatHappensWhenClicked.map((action, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tip */}
                  {item.tips.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/30">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-amber-400">Pro Tip: </span>
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
        <div className="px-6 py-4 bg-glitch-surface border-t border-glitch-border flex items-center justify-between text-xs text-text-secondary font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-glitch-green animate-pulse" />
            <span>Learno Multi-Subject Interactive Platform • Classes 5 to 9</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] bg-[#00FF66] hover:bg-[#00FF66]/90 text-black rounded-xl font-mono text-xs font-black transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] active:scale-95 flex items-center gap-1.5"
          >
            <span>[ GOT IT, CLOSE ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
