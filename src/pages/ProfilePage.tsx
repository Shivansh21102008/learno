import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useTheme, Theme } from '../context/ThemeContext';
import { VALID_CLASSES, StudentClass } from '../types';
import {
  User as UserIcon,
  Mail,
  Lock,
  Layers,
  CheckCircle2,
  Trophy,
  Target,
  Flame,
  RotateCcw,
  Save,
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

interface ProfilePageProps {
  onOpenClassModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenClassModal }) => {
  const { user, updateProfile, resetToDemo } = useAuth();
  const { stats } = useCurriculum();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '👨‍🎓');
  const [pendingClass, setPendingClass] = useState<StudentClass>(user.class);
  const [showClassWarning, setShowClassWarning] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableAvatars = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '🦊', '🚀', '📚', '💡', '🌟'];

  const themeOptions: { id: Theme; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Clean, high-clarity daylight theme for daytime study',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'Deep contrast dark theme for low-light & night study sessions',
      icon: <Moon className="w-5 h-5 text-primary" />,
    },
    {
      id: 'system',
      label: 'System Preference',
      description: 'Automatically synchronizes with your device operating system settings',
      icon: <Laptop className="w-5 h-5 text-text-secondary" />,
    },
  ];

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-primary-50 dark:bg-slate-800 border-2 border-primary-200 dark:border-slate-700 flex items-center justify-center text-4xl shadow-subtle">
            {user.avatar || '👨‍🎓'}
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm">
            {user.class}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">{user.name}</h2>
            <span className="inline-block self-center sm:self-auto px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-primary dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
              Enrolled: {user.class}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">{user.email}</p>
          <p className="text-xs text-text-secondary dark:text-slate-400 pt-1">
            Student on Learno since{' '}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <button
          onClick={onOpenClassModal}
          className="px-4 py-2 border border-border dark:border-slate-700 hover:border-primary text-text-primary dark:text-white hover:text-primary rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4 text-primary" />
          <span>Switch Class</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-4 shadow-subtle text-center">
          <div className="flex items-center justify-center text-primary mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-text-primary dark:text-white">
            {stats.testsCompleted}
          </div>
          <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Tests Completed</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-4 shadow-subtle text-center">
          <div className="flex items-center justify-center text-success mb-1">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-text-primary dark:text-white">
            {stats.averageAccuracy}%
          </div>
          <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Average Accuracy</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-4 shadow-subtle text-center">
          <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-text-primary dark:text-white">
            {user.achievements.length}
          </div>
          <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Badges Earned</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-4 shadow-subtle text-center">
          <div className="flex items-center justify-center text-warning mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-text-primary dark:text-white">
            {user.streak} Days
          </div>
          <div className="text-[11px] text-text-secondary dark:text-slate-400 font-medium">Current Streak</div>
        </div>
      </div>

      {/* Appearance & Theme Settings Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-border dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-text-primary dark:text-white">
              Appearance & Theme Settings
            </h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
              Choose between clean daylight white or deep night-mode dark styling across all pages.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-text-secondary dark:text-slate-300 self-start sm:self-auto">
            <span>Currently:</span>
            <span className="text-primary dark:text-primary-light font-bold capitalize">
              {theme === 'system' ? `System (${resolvedTheme})` : `${theme} Mode`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'border-primary bg-primary-50/70 dark:bg-primary-950/40 ring-2 ring-primary/30 shadow-sm'
                    : 'border-border dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {opt.icon}
                  </div>
                  {isSelected ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-primary dark:text-white flex items-center justify-between">
                    <span>{opt.label}</span>
                  </h4>
                  <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="mb-6 pb-4 border-b border-border dark:border-slate-800">
          <h3 className="text-base font-bold text-text-primary dark:text-white">Edit Profile Details</h3>
          <p className="text-xs text-text-secondary dark:text-slate-400">
            Update your personal details, academic class, and student avatar.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-success text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile successfully updated and saved!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar selection */}
          <div>
            <label className="block text-xs font-bold text-text-primary dark:text-white mb-2">
              Choose Profile Avatar
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableAvatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all border ${
                    selectedAvatar === av
                      ? 'border-primary bg-primary-50 dark:bg-primary-950/60 ring-2 ring-primary/20 scale-105'
                      : 'border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-white mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-text-secondary dark:text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-white mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-text-secondary dark:text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-white mb-1">
                Academic Class (Classes 5 to 9 Only)
              </label>
              <select
                value={pendingClass}
                onChange={(e) => handleClassSelect(e.target.value as StudentClass)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none font-medium"
              >
                {VALID_CLASSES.map((c) => (
                  <option key={c} value={c} className="dark:bg-slate-800">
                    {c}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-1">
                Changing your class will alter your syllabus and tests.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-white mb-1">
                New Password (Optional)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-text-secondary dark:text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Class change notice inside edit form */}
          {showClassWarning && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Notice: </span>
                You have selected to switch from <strong>{user.class}</strong> to{' '}
                <strong>{pendingClass}</strong>. When you save, your syllabus and tests will
                update to {pendingClass}.
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-border dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetToDemo}
              className="text-xs text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset to default demo data (Shivansh Giri - Class 8)</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
