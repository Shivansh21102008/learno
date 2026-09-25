import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveTab } from '../../types';
import {
  GraduationCap,
  LayoutDashboard,
  FileCheck2,
  Trophy,
  User as UserIcon,
  ChevronDown,
  RotateCcw,
  LogOut,
  LogIn,
  Layers,
  Sparkles,
  BookOpen,
  Sun,
  Moon,
  HelpCircle,
  Bot,
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
  const { user, isAuthenticated, logout, openAuthModal, resetToDemo } = useAuth();
  const { stats } = useCurriculum();
  const { resolvedTheme, toggleTheme } = useTheme();
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
    { id: 'home', label: 'Home', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tests', label: 'Tests', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border dark:border-slate-800 shadow-subtle transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => setActiveTab('home')}
                className="focus:outline-none group text-left"
              >
                <LearnoLogo size="md" />
              </button>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light font-semibold'
                          : 'text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}

                {/* Instructions Guide Button */}
                <button
                  onClick={onOpenInstructions}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all"
                  title="Platform Instructions & Feature Guide"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  <span>Instructions</span>
                </button>
              </nav>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* AI Tutor Sidebar Button in Header */}
              <button
                onClick={onToggleAiTutor}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border ${
                  isAiTutorOpen
                    ? 'bg-primary text-white border-primary-light shadow-indigo-500/30 ring-2 ring-indigo-400/40'
                    : 'bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-primary dark:text-primary-light border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400'
                }`}
                title="Open 24/7 AI Tutor (Right Sidebar)"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI Tutor</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* Mobile Instructions Icon Button */}
              <button
                onClick={onOpenInstructions}
                className="md:hidden p-2 rounded-xl text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-border dark:border-slate-800 transition-colors"
                title="Learno Guide & Instructions"
              >
                <HelpCircle className="w-4 h-4 text-indigo-500" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-border dark:border-slate-800 transition-colors"
                title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle Theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Class Switcher Pill */}
              <button
                onClick={onOpenClassModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 dark:hover:bg-primary-900/60 text-primary dark:text-primary-light border border-primary-200 dark:border-primary-800 rounded-full text-xs font-semibold transition-colors shadow-sm"
                title="Change Syllabus Class"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{user.class}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Auth / Profile menu */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-border dark:hover:border-slate-800 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-slate-800 border border-primary-200 dark:border-slate-700 flex items-center justify-center text-base">
                      {user.avatar || '👨‍🎓'}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-bold text-text-primary dark:text-white leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[11px] text-text-secondary dark:text-slate-400">
                        {stats.testsCompleted}/200 Tests
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-text-secondary dark:text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-border dark:border-slate-800 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-border/80 dark:border-slate-800">
                        <p className="text-sm font-semibold text-text-primary dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                        <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light">
                          {user.class} Curriculum
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          Settings & Theme
                        </button>
                        <button
                          onClick={() => {
                            onOpenClassModal();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Layers className="w-4 h-4 text-primary" />
                          Switch Class (5–9)
                        </button>
                        <button
                          onClick={() => {
                            toggleTheme();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {resolvedTheme === 'dark' ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Moon className="w-4 h-4 text-slate-500" />
                          )}
                          <span>
                            Toggle {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            onOpenInstructions();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <HelpCircle className="w-4 h-4 text-indigo-500" />
                          Learno Instructions & Guide
                        </button>
                        <button
                          onClick={() => {
                            onToggleAiTutor();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Bot className="w-4 h-4 text-primary" />
                          Open 24/7 AI Tutor
                        </button>
                        <button
                          onClick={() => {
                            resetToDemo();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                          title="Restore default test data & progress"
                        >
                          <RotateCcw className="w-4 h-4 text-amber-500" />
                          Reset to Demo Progress
                        </button>
                      </div>

                      <div className="border-t border-border/80 dark:border-slate-800 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white rounded-lg transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800 px-2 py-1.5 flex justify-around items-center shadow-lg transition-colors">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.icon}
              </div>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
