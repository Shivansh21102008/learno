import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { ACHIEVEMENTS_LIST } from '../data/curriculumData';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useCurriculum();

  const unlockedIds = new Set(user.achievements);
  const unlockedCount = ACHIEVEMENTS_LIST.filter((b) => unlockedIds.has(b.id)).length;
  const totalBadges = ACHIEVEMENTS_LIST.length;

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white">
              Your Achievements
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
            Earn official badges as you conquer tests, maintain consistency, and master your syllabus.
          </p>
        </div>

        {/* Badges Counter Pill */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 border border-border dark:border-slate-700/80 px-5 py-3 rounded-xl">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-primary dark:text-primary-light">
              {unlockedCount} / {totalBadges}
            </div>
            <div className="text-[11px] font-semibold text-text-secondary dark:text-slate-400">Badges Unlocked</div>
          </div>
          <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.round((unlockedCount / totalBadges) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACHIEVEMENTS_LIST.map((badge) => {
          const isUnlocked = unlockedIds.has(badge.id);

          // Calculate badge progress
          let currentProgress = 0;
          let maxProgress = badge.threshold;

          if (badge.type === 'tests') {
            currentProgress = Math.min(stats.testsCompleted, badge.threshold);
          } else if (badge.type === 'accuracy') {
            currentProgress = Math.min(stats.averageAccuracy, badge.threshold);
          } else if (badge.type === 'streak') {
            currentProgress = Math.min(user.streak, badge.threshold);
          }

          const progressPercent = Math.min(100, Math.round((currentProgress / maxProgress) * 100));

          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-border dark:border-slate-800 shadow-subtle hover:shadow-card'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-80'
              }`}
            >
              <div>
                {/* Top Row: Icon & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                      isUnlocked
                        ? 'bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light shadow-sm ring-2 ring-primary/20 dark:ring-primary/40'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <BadgeIcon name={badge.icon} className="w-6 h-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-text-secondary dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Badge Name & Description */}
                <h3 className="text-base font-bold text-text-primary dark:text-white mb-1.5">
                  {badge.name}
                </h3>
                <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              {/* Requirement & Progress Footer */}
              <div className="pt-4 border-t border-border/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-text-secondary dark:text-slate-400 font-medium mb-1.5">
                  <span className="truncate pr-2">{badge.requirement}</span>
                  <span className="font-bold text-text-primary dark:text-white flex-shrink-0">
                    {currentProgress}/{maxProgress}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border/60 dark:border-slate-700/60">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isUnlocked ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
