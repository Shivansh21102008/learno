import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  FileCheck2,
  Trophy,
  User as UserIcon,
  ChevronDown,
  RotateCcw,
  LogOut,
  Layers,
  BookOpen,
  HelpCircle,
  Bot,
  Terminal,
} from 'lucide-react';
import { LearnoLogo } from './LearnoLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenClassModal: () => void;
  onOpenInstructions: () => void;
  onToggleAiTutor: () => void;
  isAiTutorOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenClassModal,
  onOpenInstructions,
  onToggleAiTutor,
  isAiTutorOpen = false,
}) => {
  const { user, isAuthenticated, logout, resetToDemo } = useAuth();
  const { stats } = useCurriculum();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'tests', label: 'Tests', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      {/* Glitch9 Style Cyber Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 min-w-0">
            {/* Logo & Desktop Navigation */}
            <div className="flex items-center gap-3 xl:gap-8 min-w-0">
              <button
                onClick={() => setActiveTab('home')}
                className="focus-visible:ring-2 focus-visible:ring-[#00FF66] focus:outline-none rounded-xl group text-left flex-shrink-0"
                aria-label="Learno Home"
              >
                <LearnoLogo size="md" />
              </button>

              {/* Desktop Nav Items (visible on lg and above) */}
              <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 min-w-0">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider uppercase transition-all whitespace-nowrap flex-shrink-0 border ${
                        isActive
                          ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/40 shadow-[0_0_15px_rgba(0,255,102,0.2)] font-bold'
                          : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border-transparent hover:border-white/10'
                      }`}
                    >
                      <span className={isActive ? 'text-[#00FF66]' : 'text-neutral-500'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Instructions Guide Button (visible on xl and above) */}
                <button
                  onClick={onOpenInstructions}
                  className="hidden xl:flex items-center gap-2 px-3 xl:px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider uppercase text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all whitespace-nowrap flex-shrink-0"
                  title="Platform Instructions & Feature Guide"
                >
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Guide</span>
                </button>
              </nav>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 flex-shrink-0">
              {/* AI Tutor Button: Glitch9 Neon Launch Button */}
              <button
                onClick={onToggleAiTutor}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 flex-shrink-0 ${
                  isAiTutorOpen
                    ? 'bg-[#00FF66] text-black shadow-[0_0_20px_rgba(0,255,102,0.6)] ring-2 ring-[#00FF66]/50'
                    : 'bg-[#00FF66] hover:bg-[#2eff7d] text-black shadow-[0_0_15px_rgba(0,255,102,0.4)] hover:shadow-[0_0_25px_rgba(0,255,102,0.6)] active:scale-95'
                }`}
                title="Launch 24/7 Neural AI Tutor"
              >
                <Bot className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span className="hidden min-[420px]:inline">AI Tutor</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse flex-shrink-0" />
              </button>

              {/* Guide Icon Button for medium/tablet screens */}
              <button
                onClick={onOpenInstructions}
                className="hidden sm:flex xl:hidden p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-white/10 transition-colors flex-shrink-0"
                title="Learno Guide & Instructions"
                aria-label="Learno Guide & Instructions"
              >
                <HelpCircle className="w-4 h-4 text-neutral-300" />
              </button>

              {/* Class Switcher Pill: Glitch9 Hardware Rig Pill */}
              <button
                onClick={onOpenClassModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-black hover:bg-white/[0.05] text-neutral-200 border border-white/15 hover:border-[#00FF66]/50 rounded-lg font-mono text-xs tracking-wider uppercase transition-all shadow-sm flex-shrink-0"
                title="Switch Syllabus Rig"
              >
                <Layers className="w-3 h-3 text-[#00FF66] flex-shrink-0" />
                <span className="hidden min-[380px]:inline">{user.class}</span>
                <span className="min-[380px]:hidden">{user.class.replace('Class ', 'C')}</span>
                <ChevronDown className="w-3 h-3 opacity-60 flex-shrink-0" />
              </button>

              {/* User Rig Profile Menu */}
              {isAuthenticated && (
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all flex-shrink-0"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-neutral-900 border border-white/15 flex items-center justify-center text-sm flex-shrink-0">
                      {user.avatar || '👨‍🎓'}
                    </div>
                    <div className="hidden xl:flex flex-col text-left max-w-[120px] 2xl:max-w-[150px] min-w-0">
                      <span className="font-mono text-xs font-bold text-white leading-tight truncate">
                        {user.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#00FF66] uppercase tracking-wider truncate">
                        {stats.testsCompleted}/200 RIGS
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block flex-shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-[#0A0D14] rounded-xl shadow-2xl border border-white/15 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 backdrop-blur-2xl">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-mono text-xs font-bold text-white truncate">
                          {user.name}
                        </p>
                        <p className="font-mono text-[10px] text-neutral-400 truncate">
                          {user.email}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                          {user.class} RIG ACTIVE
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 font-mono text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                          Profile & Rigs
                        </button>
                        <button
                          onClick={() => {
                            onOpenClassModal();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 font-mono text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#00FF66]" />
                          Switch Class (5–9)
                        </button>
                        <button
                          onClick={() => {
                            onOpenInstructions();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 font-mono text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                          Platform Docs & Guide
                        </button>
                        <button
                          onClick={() => {
                            resetToDemo();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 font-mono text-xs text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/20 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          Reset Progress
                        </button>
                      </div>

                      <div className="border-t border-white/10 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 font-mono text-xs text-rose-400 hover:bg-rose-950/20 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Disconnect Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation: Glitch9 Cyber HUD Bar */}
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center shadow-2xl transition-colors">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all ${
                isActive
                  ? 'text-[#00FF66] font-bold drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30'
                    : 'text-neutral-500'
                }`}
              >
                {item.icon}
              </div>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
        {/* Mobile Guide Shortcut */}
        <button
          onClick={onOpenInstructions}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg font-mono text-[9px] uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <div className="p-1 rounded-md text-neutral-500">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="mt-0.5">Guide</span>
        </button>
      </nav>
    </>
  );
};
