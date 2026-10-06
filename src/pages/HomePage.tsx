import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ActiveTab, VALID_CLASSES, StudentClass } from '../types';
import { SUBJECT_METAS, CLASS_CHAPTERS } from '../data/curriculumData';
import { BadgeIcon } from '../components/common/BadgeIcon';
import {
  ArrowRight,
  Trophy,
  Target,
  Flame,
  Layers,
  BookOpen,
  Sparkles,
  Mic,
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenClassModal?: () => void;
  onOpenInstructions?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onOpenClassModal,
  onOpenInstructions,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [previewClass, setPreviewClass] = useState<StudentClass>(user.class || 'Class 8');

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
    <div className="space-y-16 py-6 sm:py-10 text-white relative">
      {/* Background Cyber Grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-20 z-0" />

      {/* Glitch9 Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0A0D14]/90 border border-white/10 p-8 sm:p-14 lg:p-20 shadow-2xl backdrop-blur-2xl z-10">
        {/* Ambient Aurora Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[radial-gradient(ellipse_at_top,rgba(0,255,102,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
          {/* Glitch9 Telemetry Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_#00FF66]" />
            <span>CLOUD ACADEMIC RIGS // CLASSES 5–9</span>
          </div>

          {/* Glitch9 Massive Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase font-display leading-[1.05]">
            Master Any Subject.{' '}
            <span className="text-[#00FF66] drop-shadow-[0_0_35px_rgba(0,255,102,0.65)]">
              Zero Limits.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
            High-performance chapter test rigs, AI Viva oral diagnostics, and 24/7 neural doubt solving.
            Experience school curriculum transformed into an instant, lag-free academic mastery engine.
          </p>

          {/* Glitch9 Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={handleStartLearning}
              className="w-full sm:w-auto px-8 py-4 bg-[#00FF66] hover:bg-[#2eff7d] text-black font-black font-mono uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(0,255,102,0.5)] hover:shadow-[0_0_40px_rgba(0,255,102,0.7)] transition-all flex items-center justify-center gap-2.5 text-sm active:scale-95 group"
            >
              <span>[ LAUNCH ACADEMIC RIG ]</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleExploreTests}
              className="w-full sm:w-auto px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/15 hover:border-[#00FF66]/50 backdrop-blur-md active:scale-95"
            >
              <span>EXPLORE 200 TESTS</span>
              <BookOpen className="w-4 h-4 text-[#00FF66]" />
            </button>
          </div>

          {/* Glitch9 Telemetry Chips */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              <span className="tracking-widest uppercase">200 CHAPTER TESTS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              <span className="tracking-widest uppercase">ZERO HARDWARE LAG</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              <span className="tracking-widest uppercase">100% CBSE // NCERT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Glitch9 Telemetry Status Bar */}
      <section id="stats-bar" className="grid grid-cols-2 lg:grid-cols-4 gap-4 z-10 relative">
        <div className="p-5 bg-[#0A0D14]/90 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-[#00FF66]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-[#00FF66] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-white">200 TESTS</div>
            <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">RIG DIRECTORY</div>
          </div>
        </div>

        <div className="p-5 bg-[#0A0D14]/90 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-[#00FF66]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-[#00FF66] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-white">INSTANT FPS</div>
            <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">REAL-TIME ACCURACY</div>
          </div>
        </div>

        <div className="p-5 bg-[#0A0D14]/90 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-[#00FF66]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-[#00FF66] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-white">DAILY STREAK</div>
            <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">COMBO MULTIPLIER</div>
          </div>
        </div>

        <div className="p-5 bg-[#0A0D14]/90 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-[#00FF66]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-[#00FF66] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-white">ACHIEVEMENTS</div>
            <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">MEDALS & REPUTATION</div>
          </div>
        </div>
      </section>

      {/* Glitch9 Feature Showcase: Academic Engines */}
      <section id="features-showcase" className="space-y-6 z-10 relative">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FF66] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30">
            <Sparkles className="w-3.5 h-3.5" />
            INTELLIGENT CLOUD RIGS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
            Engineered For Pure Performance
          </h2>
          <p className="font-mono text-xs text-neutral-400 tracking-wider">
            Zero friction learning ecosystem built exclusively for Classes 5 to 9.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: 200 Problems Rig */}
          <div className="p-6 rounded-2xl bg-[#0A0D14]/90 border border-white/10 hover:border-[#00FF66] shadow-xl hover:shadow-[0_0_30px_rgba(0,255,102,0.15)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 group-hover:border-[#00FF66] transition-all">
                📋
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">200 Tests Rig</h3>
                <span className="px-2 py-0.5 rounded font-mono bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-[9px] font-bold">
                  #001–#200
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                200 chapter assessment rigs per class. Instant switch between List Directory and Subject Rig View.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tests')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-[#00FF66] text-neutral-200 hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all border border-white/15 hover:border-[#00FF66] flex items-center justify-center gap-1.5"
            >
              <span>[ RUN TESTS ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: AI Viva Hub */}
          <div className="p-6 rounded-2xl bg-[#0A0D14]/90 border border-white/10 hover:border-[#00FF66] shadow-xl hover:shadow-[0_0_30px_rgba(0,255,102,0.15)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 group-hover:border-[#00FF66] transition-all">
                🎙️
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">AI Viva Hub</h3>
                <span className="px-2 py-0.5 rounded font-mono bg-violet-500/10 text-violet-400 border border-violet-500/30 text-[9px] font-bold">
                  VOICE RIG
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Interactive voice examiner with instant diagnostic evaluation and full executive English fluency scoring.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-[#00FF66] text-neutral-200 hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all border border-white/15 hover:border-[#00FF66] flex items-center justify-center gap-1.5"
            >
              <span>[ START VIVA ]</span>
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Term Exams */}
          <div className="p-6 rounded-2xl bg-[#0A0D14]/90 border border-white/10 hover:border-[#00FF66] shadow-xl hover:shadow-[0_0_30px_rgba(0,255,102,0.15)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-black border border-white/15 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 group-hover:border-[#00FF66] transition-all">
                🏆
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Term Exams</h3>
                <span className="px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                  TERMS 1–3
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Full-length term assessment rigs covering all core curriculum subjects in one single assessment.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tests')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-[#00FF66] text-neutral-200 hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all border border-white/15 hover:border-[#00FF66] flex items-center justify-center gap-1.5"
            >
              <span>[ TAKE EXAM ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Glitch9 Subject Rig Library */}
      <section id="curriculum-explorer" className="space-y-8 z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="font-mono text-[10px] text-[#00FF66] tracking-[0.3em] uppercase mb-1">
              [ ACADEMIC RIG LIBRARY ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans">
              Supported Subject Rigs
            </h2>
          </div>

          {/* Class Switcher Buttons in Glitch9 Style */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-white/15">
            {VALID_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setPreviewClass(cls)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                  previewClass === cls
                    ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cls.replace('Class ', 'C')}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Rig Grid (styled as AAA game cards on Glitch9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.values(SUBJECT_METAS).map((subj) => {
            const count = CLASS_CHAPTERS[previewClass]?.[subj.name]?.length || 0;
            return (
              <div
                key={subj.name}
                onClick={() => setActiveTab('tests')}
                className="group relative overflow-hidden rounded-2xl bg-[#0A0D14]/90 border border-white/10 hover:border-[#00FF66] p-5 shadow-xl hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Ambient glow on card hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#00FF66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66] group-hover:scale-110 transition-transform">
                      <BadgeIcon name={subj.iconName} className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-white/15 bg-black/60 text-[#00FF66]">
                      {count} RIGS
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans font-bold text-base text-white group-hover:text-[#00FF66] transition-colors">
                      {subj.name}
                    </h3>
                    <p className="font-mono text-[10px] text-neutral-400 tracking-wider mt-0.5">
                      NCERT // CBSE SYLLABUS
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 mt-4 flex items-center justify-between font-mono text-xs text-neutral-400 group-hover:text-white relative z-10">
                  <span className="text-[10px] tracking-wider uppercase">[ LAUNCH RIG ]</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-[#00FF66] transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
