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
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight uppercase">
              Trophy & Achievement Matrix
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-400">
            [ RIG 5–9 ] UNLOCK BADGES BY MASTERING TESTS, MAINTAINING STREAKS, AND ELEVATING ACCURACY.
          </p>
        </div>

        {/* Badges Counter Pill */}
        <div className="flex items-center gap-3 bg-[#050505] border border-white/10 px-5 py-3 rounded-xl font-mono">
          <div>
            <div className="text-xl sm:text-2xl font-display font-black text-[#00FF66]">
              {unlockedCount} / {totalBadges}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Badges Unlocked</div>
          </div>
          <div className="w-20 h-2 bg-[#0A0D14] rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-[#00FF66] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,255,102,0.5)]"
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
              className={`relative rounded-2xl border transition-all p-6 flex flex-col justify-between group ${
                isUnlocked
                  ? 'bg-[#0A0D14]/90 border-[#00FF66]/40 shadow-[0_0_20px_rgba(0,255,102,0.1)]'
                  : 'bg-[#050505] border-white/10 opacity-70'
              }`}
            >
              <div>
                {/* Top Row: Icon & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                      isUnlocked
                        ? 'bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                        : 'bg-white/5 border border-white/10 text-slate-500'
                    }`}
                  >
                    <BadgeIcon name={badge.icon} className="w-6 h-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="font-mono inline-flex items-center gap-1 text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 rounded-full border border-[#00FF66]/30 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="font-mono inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 uppercase">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Badge Name & Description */}
                <h3 className="text-base font-bold text-white group-hover:text-[#00FF66] transition-colors mb-1.5">
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              {/* Requirement & Progress Footer */}
              <div className="pt-4 border-t border-white/10 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="truncate pr-2 text-[11px]">{badge.requirement}</span>
                  <span className="font-bold text-white flex-shrink-0">
                    {currentProgress}/{maxProgress}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isUnlocked ? 'bg-[#00FF66]' : 'bg-white/20'
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
