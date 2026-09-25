import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VALID_CLASSES, StudentClass } from '../../types';
import { X, GraduationCap, ArrowRight, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, signup, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authModalMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid school email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password should be at least 6 characters.');
        return;
      }
      signup(name, email, password);
    } else {
      if (!email.trim()) {
        setErrorMessage('Please enter your email.');
        return;
      }
      login(email, password);
    }
  };

  const handleDemoLogin = () => {
    login('shivansh@example.com', 'password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div data-lenis-prevent className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-850 px-6 py-5 border-b border-border dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary dark:text-white">
                {authModalMode === 'signup' ? 'Create Student Account' : 'Welcome Back to Learno'}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                {authModalMode === 'signup'
                  ? 'Join thousands of students practicing daily'
                  : 'Log in to continue your test streak'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-danger dark:text-rose-400 rounded-lg text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full mb-4 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-100 text-xs sm:text-sm font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white dark:bg-slate-900 px-3 text-text-secondary dark:text-slate-400">
                Or Continue With Email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-text-primary dark:text-white mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-text-secondary dark:text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shivansh Giri"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-primary dark:text-white mb-1">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-text-secondary dark:text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary dark:text-white mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-text-secondary dark:text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all"
                />
              </div>
            </div>

            {authModalMode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary dark:text-slate-400">Demo Password: any</span>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-primary dark:text-primary-light hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{authModalMode === 'signup' ? 'Complete Registration' : 'Login to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Login Shortcut */}
          <div className="mt-4 pt-4 border-t border-border dark:border-slate-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-text-primary dark:text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-border dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary dark:text-primary-light" />
              <span>One-Click Demo Login (Shivansh Giri — Class 8)</span>
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-text-secondary dark:text-slate-400">
            {authModalMode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-primary dark:text-primary-light font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="text-primary dark:text-primary-light font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
