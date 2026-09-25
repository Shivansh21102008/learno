import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VALID_CLASSES } from '../../types';
import { LearnoLogo } from './LearnoLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800 mt-16 pb-20 md:pb-8 text-text-secondary dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <LearnoLogo size="md" />
            <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed max-w-md">
              A dedicated educational learning platform helping students practice their school
              syllabus through chapter-wise tests, monitor learning progress, and earn milestones.
              Designed specifically for middle and high-school students.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Aligned with NCERT & CBSE curriculum standards</span>
            </div>
          </div>

          {/* Supported Classes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary dark:text-white mb-3">
              Supported Classes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {VALID_CLASSES.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-text-primary dark:text-slate-200 font-medium border border-border dark:border-slate-700"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-text-secondary dark:text-slate-500 mt-2">
              Exclusively focused on Class 5 through Class 9.
            </p>
          </div>

          {/* Core Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary dark:text-white mb-3">
              Key Features
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>200 Chapter-wise Practice Tests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Examination Mode & Timer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Accuracy & Streak Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Badges & Achievements</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Learno Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-text-primary dark:hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-text-primary dark:hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-text-primary dark:hover:text-slate-300 transition-colors cursor-pointer">
              Syllabus Guidelines
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
