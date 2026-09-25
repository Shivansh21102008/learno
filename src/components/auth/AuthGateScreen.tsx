import React, { useState } from 'react';
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
} from 'lucide-react';

export const AuthGateScreen: React.FC = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states - Strictly Name, Email, Password for Sign Up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Kripya apna poora naam darj karein (Please enter your full name).');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Kripya valid email address darj karein (Please enter a valid email).');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password kam se kam 6 aksharon ka hona chahiye (Min 6 characters).');
        return;
      }
      setIsLoading(true);
      signup(name, email, password);
      setIsLoading(false);
    } else {
      if (!email.trim()) {
        setErrorMessage('Kripya apna email darj karein (Please enter your email).');
        return;
      }
      if (!password) {
        setErrorMessage('Kripya apna password darj karein (Please enter your password).');
        return;
      }
      setIsLoading(true);
      login(email, password);
      setIsLoading(false);
    }
  };

  const handleSelectGoogleAccount = (googleName: string, googleEmail: string) => {
    setIsLoading(true);
    loginWithGoogle(googleName, googleEmail);
    setIsLoading(false);
    setIsGoogleChooserOpen(false);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    login('shivansh@example.com', 'demo1234');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Ambient Cyber Grid & Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Learno Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 shadow-xl shadow-primary/30 text-white mb-1 ring-4 ring-white/10">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Learno
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Classes 5 to 9 Academic Exam & Concept Portal
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" /> Mandatory Sign In
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <BookOpen className="w-3 h-3" /> 200 Tests
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
              <Bot className="w-3 h-3" /> AI Tutor
            </span>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-xl p-6 sm:p-7 transition-all">
          {/* Toggle Tabs */}
          <div className="flex p-1 bg-slate-800/80 rounded-xl mb-5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Prominent Continue with Google Button */}
          <button
            type="button"
            onClick={() => setIsGoogleChooserOpen(true)}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center gap-3 border border-slate-200 active:scale-[0.99] disabled:opacity-50"
          >
            {/* Official Multi-Color Google G SVG */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-slate-900 px-3 text-slate-500">
                Or Continue With Email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* SIGN UP STRICTLY: Name, Email, Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              <span>
                {mode === 'signup' ? 'Create Account & Start Learning' : 'Login to Learno'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          {mode === 'login' && (
            <div className="mt-4 pt-3.5 border-t border-slate-800">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-3 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Demo Login (Shivansh Giri — Class 8)</span>
              </button>
            </div>
          )}

          {/* Switch Prompt */}
          <div className="mt-4 text-center text-xs text-slate-400">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-primary-light font-bold hover:underline"
                >
                  Login here
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
                  className="text-primary-light font-bold hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Secure Encryption
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Classes 5–9 Curriculum
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Free Access
          </span>
        </div>
      </div>

      {/* Official Google Account Chooser Modal */}
      {isGoogleChooserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="flex justify-center mb-1">
                <svg className="w-9 h-9" viewBox="0 0 24 24">
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose an account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                to continue to <strong className="text-primary font-bold">Learno</strong>
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('Shivansh Giri', 'shivanshgiri@gmail.com')}
                className="w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                  SG
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                    Shivansh Giri
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] font-bold">
                      Primary
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    shivanshgiri@gmail.com
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('Learno Student', 'student.learno@gmail.com')}
                className="w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow">
                  LS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    Learno Student
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    student.learno@gmail.com
                  </div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('Guest Student', 'guest.student@gmail.com')}
                className="text-primary dark:text-primary-light hover:underline font-semibold"
              >
                Use another account
              </button>
              <button
                type="button"
                onClick={() => setIsGoogleChooserOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
