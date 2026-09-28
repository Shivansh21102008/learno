import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { VALID_CLASSES, StudentClass } from '../types';
import {
  User as UserIcon,
  Mail,
  Layers,
  CheckCircle2,
  Trophy,
  Target,
  Flame,
  RotateCcw,
  Save,
  AlertTriangle,
} from 'lucide-react';

interface ProfilePageProps {
  onOpenClassModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenClassModal }) => {
  const { user, updateProfile, resetToDemo } = useAuth();
  const { stats } = useCurriculum();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '👨‍🎓');
  const [pendingClass, setPendingClass] = useState<StudentClass>(user.class);
  const [showClassWarning, setShowClassWarning] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableAvatars = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '🦊', '🚀', '📚', '💡', '🌟'];

  const handleClassSelect = (c: StudentClass) => {
    if (c !== user.class) {
      setPendingClass(c);
      setShowClassWarning(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      avatar: selectedAvatar,
      class: pendingClass,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Profile Overview Card */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-4xl shadow-inner">
            {user.avatar || '👨‍🎓'}
          </div>
          <span className="font-mono absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-[#00FF66] text-black text-[10px] font-bold shadow-[0_0_10px_rgba(0,255,102,0.4)]">
            {user.class}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-display font-black text-white uppercase">{user.name}</h2>
            <span className="font-mono inline-block self-center sm:self-auto px-2.5 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-xs font-bold">
              [ ENROLLED: {user.class} ]
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-400">{user.email}</p>
          <p className="font-mono text-[11px] text-neutral-500 pt-1">
            MEMBER SINCE{' '}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              year: 'numeric',
            }).toUpperCase()}
          </p>
        </div>

        <button
          onClick={onOpenClassModal}
          className="px-4 py-2 border border-white/10 hover:border-[#00FF66] bg-[#050505] hover:bg-[#00FF66] text-neutral-300 hover:text-black rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4 text-[#00FF66]" />
          <span>[ SWITCH RIG ]</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-xl p-4 shadow-card text-center">
          <div className="flex items-center justify-center text-[#00FF66] mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-black text-white">
            {stats.testsCompleted}
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Tests Done</div>
        </div>

        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-xl p-4 shadow-card text-center">
          <div className="flex items-center justify-center text-[#00FF66] mb-1">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-black text-[#00FF66]">
            {stats.averageAccuracy}%
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Accuracy</div>
        </div>

        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-xl p-4 shadow-card text-center">
          <div className="flex items-center justify-center text-purple-400 mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-black text-white">
            {user.achievements.length}
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Trophies</div>
        </div>

        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-xl p-4 shadow-card text-center">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-black text-amber-400">
            {user.streak} DAYS
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Streak</div>
        </div>
      </div>

      {/* Edit Profile Section */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card">
        <div className="mb-6 pb-4 border-b border-white/10">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66]">
            STUDENT RECORD
          </div>
          <h3 className="text-base font-display font-bold text-white mt-0.5">Edit Profile Details</h3>
          <p className="text-xs text-neutral-400">
            Update personal name, academic class, and student avatar icon.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3 bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-mono font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>PROFILE TELEMETRY SUCCESSFULLY UPDATED & COMMITTED!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar selection */}
          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Choose Rig Avatar
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableAvatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all border ${
                    selectedAvatar === av
                      ? 'border-[#00FF66] bg-[#00FF66]/15 ring-2 ring-[#00FF66]/30 scale-105 shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                      : 'border-white/10 bg-[#050505] hover:border-white/30'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Academic Class (Classes 5 to 9 Only)
              </label>
              <select
                value={pendingClass}
                onChange={(e) => handleClassSelect(e.target.value as StudentClass)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none font-medium"
              >
                {VALID_CLASSES.map((c) => (
                  <option key={c} value={c} className="bg-[#050505]">
                    {c}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-neutral-500 mt-1">
                Changing your class will alter your syllabus and test bank.
              </p>
            </div>
          </div>

          {/* Class change notice inside edit form */}
          {showClassWarning && (
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300 font-mono">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">NOTICE: </span>
                You selected to switch from <strong>{user.class}</strong> to{' '}
                <strong>{pendingClass}</strong>. Saving will switch the academic modules to {pendingClass}.
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            <button
              type="button"
              onClick={resetToDemo}
              className="text-xs text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset demo state</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>COMMIT PROFILE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
