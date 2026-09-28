import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Bot,
  Plus,
  Trash2,
  UserCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { StudentClass, VALID_CLASSES } from '../../types';

interface SavedGoogleAccount {
  name: string;
  email: string;
}

const DEFAULT_ACCOUNTS_STORAGE_KEY = 'learno_google_accounts';

export const AuthGateScreen: React.FC = () => {
  const { login, signup, loginWithGoogle, loginAsGuest, accounts } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedClass, setSelectedClass] = useState<StudentClass>('Class 8');
  const [showPassword, setShowPassword] = useState(false);

  // Form states - Strictly Name, Email, Password for Sign Up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Google Account Chooser
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedGoogleAccount[]>(() => {
    const saved = localStorage.getItem(DEFAULT_ACCOUNTS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved accounts', e);
      }
    }
    return [
      { name: 'My Google Account', email: 'student.google@gmail.com' },
    ];
  });

  const [isAddingNewAccount, setIsAddingNewAccount] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [accError, setAccError] = useState('');

  useEffect(() => {
    localStorage.setItem(DEFAULT_ACCOUNTS_STORAGE_KEY, JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (accounts[trimmedEmail]) {
        setErrorMessage('An account with this email already exists. Please switch to Login above.');
        return;
      }
      setIsLoading(true);
      const success = signup(name, trimmedEmail, password, selectedClass);
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Could not create account. Please check your details.');
      }
    } else {
      if (!trimmedEmail) {
        setErrorMessage('Please enter your email.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
      setIsLoading(true);
      const success = login(trimmedEmail, password);
      setIsLoading(false);
      if (!success) {
        const acc = accounts[trimmedEmail];
        if (!acc) {
          setErrorMessage('No student account found with this email. Please click [Sign Up] above or continue as Guest.');
        } else {
          setErrorMessage('Incorrect password. Please verify and try again.');
        }
      }
    }
  };

  const handleSelectGoogleAccount = (googleName: string, googleEmail: string) => {
    setIsLoading(true);
    loginWithGoogle(googleName, googleEmail);
    setIsLoading(false);
    setIsGoogleChooserOpen(false);
  };

  const handleAddNewAccountAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAccError('');
    if (!newAccName.trim()) {
      setAccError('Please enter your name.');
      return;
    }
    if (!newAccEmail.trim() || !newAccEmail.includes('@')) {
      setAccError('Please enter a valid Gmail / Google email address.');
      return;
    }

    const trimmedName = newAccName.trim();
    const trimmedEmail = newAccEmail.trim().toLowerCase();

    // Avoid duplicates
    const exists = savedAccounts.some((a) => a.email.toLowerCase() === trimmedEmail);
    if (!exists) {
      setSavedAccounts((prev) => [...prev, { name: trimmedName, email: trimmedEmail }]);
    }

    handleSelectGoogleAccount(trimmedName, trimmedEmail);
  };

  const handleDeleteAccount = (e: React.MouseEvent, emailToDelete: string) => {
    e.stopPropagation();
    setSavedAccounts((prev) => prev.filter((a) => a.email !== emailToDelete));
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase() || 'ST';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col justify-center items-center p-3 sm:p-6 relative overflow-hidden bg-grid selection:bg-[#00FF66] selection:text-black">
      {/* Cyber Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00FF66]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Learno Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.3)] mb-1">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              LEARN<span className="text-[#00FF66]">O</span>.AI
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-[#00FF66]/15 text-[#00FF66] px-2 py-0.5 rounded border border-[#00FF66]/30">
              GATEWAY
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-400">
            [ RIG 5–9 ] CURRICULUM INTELLIGENCE PORTAL
          </p>

          <div className="flex items-center justify-center gap-2 pt-1 font-mono text-[10px] flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
              <ShieldCheck className="w-3 h-3 text-[#00FF66]" /> SECURE AUTH
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
              <BookOpen className="w-3 h-3 text-[#00FF66]" /> 200 RIGS
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
              <Bot className="w-3 h-3 text-[#00FF66]" /> NEURAL COPILOT
            </span>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl p-5 sm:p-7 transition-all">
          {/* Toggle Tabs */}
          <div className="flex p-1 bg-[#050505] rounded-xl mb-5 border border-white/10 font-mono">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              [ LOGIN ]
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              [ SIGN UP ]
            </button>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={() => {
              setIsAddingNewAccount(false);
              setAccError('');
              setIsGoogleChooserOpen(true);
            }}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-50 font-sans"
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Sign In As Guest Button */}
          <div className="mt-2.5">
            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full py-2.5 px-3 bg-white/5 hover:bg-[#00FF66]/10 text-[#00FF66] hover:text-white text-xs sm:text-sm font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-[#00FF66]/30 hover:border-[#00FF66]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>[ GUEST BYPASS // 1-CLICK ]</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center font-mono text-[9px] uppercase tracking-wider">
              <span className="bg-[#0A0D14] px-3 text-slate-500">
                OR CREDENTIAL LOGIN
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3.5 p-3 bg-rose-950/60 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
            {/* SIGN UP STRICTLY: Name, Email, Password */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-gate-name" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input
                    id="auth-gate-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-gate-email" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  id="auth-gate-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-gate-password" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  id="auth-gate-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-neutral-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Target Class Selection for Signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Target Class Syllabus
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {VALID_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold transition-all border text-center ${
                        selectedClass === cls
                          ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.4)]'
                          : 'bg-[#050505] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {cls.replace('Class ', 'C')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,102,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              <span>
                {mode === 'signup' ? '[ CREATE ACCOUNT ]' : '[ AUTHORIZE LOGIN ]'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-4 text-center font-mono text-xs text-neutral-400">
            {mode === 'signup' ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-[#00FF66] font-bold hover:underline"
                >
                  [ Login Here ]
                </button>
              </p>
            ) : (
              <p>
                New student?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-[#00FF66] font-bold hover:underline"
                >
                  [ Create Account ]
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[10px] text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#00FF66]" /> 256-BIT ENCRYPTION
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#00FF66]" /> RIGS 5–9 SYLLABUS
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#00FF66]" /> 100% UNRESTRICTED
          </span>
        </div>
      </div>

      {/* Dynamic Google Account Chooser Modal */}
      {isGoogleChooserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#0A0D14] text-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 border border-white/10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="flex justify-center mb-1">
                <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white uppercase">Choose an account</h3>
              <p className="font-mono text-xs text-slate-400">
                to link to <strong className="text-[#00FF66] font-bold">LEARNO.AI</strong>
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              {savedAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#050505] hover:bg-white/5 border border-white/10 hover:border-[#00FF66]/50 transition-all flex items-center justify-between group"
                >
                  <button
                    type="button"
                    className="flex items-center gap-3 min-w-0 flex-1 text-left"
                    onClick={() => handleSelectGoogleAccount(acc.name, acc.email)}
                    aria-label={`Sign in with Google account ${acc.name} (${acc.email})`}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] font-mono font-bold flex items-center justify-center text-xs sm:text-sm shadow flex-shrink-0">
                      {getInitials(acc.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-[#00FF66] transition-colors truncate">
                        {acc.name}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-400 truncate">
                        {acc.email}
                      </div>
                    </div>
                  </button>

                  {savedAccounts.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteAccount(e, acc.email)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors ml-2 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Remove account from device list"
                      aria-label={`Remove Google account ${acc.email} from saved list`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Another Account Section */}
            {isAddingNewAccount ? (
              <form onSubmit={handleAddNewAccountAndLogin} className="p-3 bg-[#050505] rounded-2xl border border-white/10 space-y-2.5 font-mono text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>ADD GOOGLE ACCOUNT</span>
                </div>

                {accError && (
                  <div className="text-[11px] text-rose-400 font-semibold">{accError}</div>
                )}

                <input
                  type="text"
                  placeholder="Your Full Name (e.g. Rudra Giri)"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0A0D14] text-white outline-none focus:border-[#00FF66]"
                />

                <input
                  type="email"
                  placeholder="Your Gmail (e.g. rudragiri@gmail.com)"
                  value={newAccEmail}
                  onChange={(e) => setNewAccEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0A0D14] text-white outline-none focus:border-[#00FF66]"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    ADD & SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAccount(false);
                      setAccError('');
                    }}
                    className="py-2 px-3 border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-medium rounded-xl"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingNewAccount(true)}
                className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-white/20 hover:border-[#00FF66] text-slate-300 hover:text-[#00FF66] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 hover:bg-[#00FF66]/5"
              >
                <Plus className="w-4 h-4" />
                <span>[ ADD ANOTHER GOOGLE ACCOUNT ]</span>
              </button>
            )}

            {/* Guest Sign In Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsGoogleChooserOpen(false);
                  loginAsGuest();
                }}
                className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>SIGN IN AS GUEST (BYPASS)</span>
              </button>
            </div>

            {/* Footer */}
            <div className="pt-1 flex justify-end items-center font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsGoogleChooserOpen(false)}
                className="text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 min-h-[36px]"
                aria-label="Close Google account chooser"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
