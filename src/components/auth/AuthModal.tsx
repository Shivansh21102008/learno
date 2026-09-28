import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, GraduationCap, ArrowRight, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, signup, loginWithGoogle, loginAsGuest, accounts } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();

    if (authModalMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        setErrorMessage('Please enter a valid school email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password should be at least 6 characters.');
        return;
      }
      if (accounts[trimmedEmail]) {
        setErrorMessage('An account with this email is already registered. Please login.');
        return;
      }
      const ok = signup(name, trimmedEmail, password);
      if (!ok) {
        setErrorMessage('Could not create account. Please check your details.');
      }
    } else {
      if (!trimmedEmail) {
        setErrorMessage('Please enter your email.');
        return;
      }
      const ok = login(trimmedEmail, password);
      if (!ok) {
        const acc = accounts[trimmedEmail];
        if (!acc) {
          setErrorMessage('No student account found with this email. Please sign up first.');
        } else {
          setErrorMessage('Incorrect password. Please verify and try again.');
        }
      }
    }
  };

  const handleDemoLogin = () => {
    loginAsGuest();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        role="dialog" 
        aria-modal="true" 
        data-lenis-prevent 
        className="relative w-full max-w-md bg-glitch-panel border border-glitch-border rounded-xl shadow-2xl overflow-y-auto max-h-[92vh] transition-colors"
      >
        {/* Modal Header */}
        <div className="bg-glitch-surface px-6 py-5 border-b border-glitch-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-glitch-green/10 border border-glitch-green/30 flex items-center justify-center text-glitch-green">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                {authModalMode === 'signup' ? 'Create Student Account' : 'Welcome Back to Learno'}
              </h3>
              <p className="text-xs text-text-secondary">
                {authModalMode === 'signup'
                  ? 'Join thousands of students practicing daily'
                  : 'Log in to continue your test streak'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-glitch-surface rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/40 text-red-400 font-mono text-xs rounded-lg font-medium">
              {errorMessage}
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full mb-4 py-2.5 px-4 bg-glitch-surface hover:bg-glitch-card text-text-primary text-xs sm:text-sm font-bold rounded-xl shadow-sm border border-glitch-border transition-all flex items-center justify-center gap-3 active:scale-[0.99] min-h-[44px]"
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
              <div className="w-full border-t border-glitch-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-glitch-panel px-3 text-text-secondary">
                Or Continue With Email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shivansh Giri"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-glitch-border bg-glitch-ink text-text-primary focus:border-glitch-green focus:ring-1 focus:ring-glitch-green font-mono outline-none transition-all min-h-[44px]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-glitch-border bg-glitch-ink text-text-primary focus:border-glitch-green focus:ring-1 focus:ring-glitch-green font-mono outline-none transition-all min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-glitch-border bg-glitch-ink text-text-primary focus:border-glitch-green focus:ring-1 focus:ring-glitch-green font-mono outline-none transition-all min-h-[44px]"
                />
              </div>
            </div>

            {authModalMode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-mono">Demo Password: any</span>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-glitch-green hover:brightness-110 hover:underline font-medium p-2.5 -m-2.5"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-glitch-green hover:brightness-110 text-glitch-ink text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>{authModalMode === 'signup' ? 'Complete Registration' : 'Login to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Login Shortcut */}
          <div className="mt-4 pt-4 border-t border-glitch-border">
            <button
               type="button"
               onClick={handleDemoLogin}
               className="w-full py-2 px-3 bg-glitch-surface border border-glitch-border hover:bg-glitch-card text-text-primary text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
               <Sparkles className="w-3.5 h-3.5 text-glitch-green" />
               <span>Sign in as a Guest (1-Click Instant Access)</span>
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-text-secondary">
            {authModalMode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-glitch-green font-semibold hover:underline p-2.5 -m-2.5"
                >
                  Login
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="text-glitch-green font-semibold hover:underline p-2.5 -m-2.5"
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
