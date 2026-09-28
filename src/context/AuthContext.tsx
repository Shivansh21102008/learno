import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentClass, VALID_CLASSES } from '../types';

interface RegisteredAccount {
  user: User;
  password?: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isOnboardingOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  login: (email: string, password?: string) => boolean;
  loginWithGoogle: (googleName?: string, googleEmail?: string) => void;
  loginAsGuest: () => void;
  signup: (name: string, email: string, password: string, studentClass?: StudentClass) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'class' | 'avatar'>>) => void;
  changeClass: (newClass: StudentClass) => void;
  completeOnboarding: (selectedClass: StudentClass, subjects: string[]) => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  resetToDemo: () => void;
  unlockAchievement: (badgeId: string) => void;
  accounts: Record<string, RegisteredAccount>;
}

const DEFAULT_USER: User = {
  id: 'user_student_01',
  name: 'Learno Student',
  email: 'student@learno.edu',
  class: 'Class 8',
  avatar: '👨‍🎓',
  testsCompleted: 27,
  totalTests: 200,
  averageAccuracy: 84,
  streak: 7,
  achievements: [
    'first-step',
    'getting-started',
    'consistent-learner',
    'dedicated-student',
    'accuracy-ace',
    'streak-star',
  ],
  selectedSubjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Computer', 'Hindi', 'Sanskrit', 'Communication'],
  createdAt: '2026-09-01T08:00:00.000Z',
};

const INITIAL_DEFAULT_ACCOUNTS: Record<string, RegisteredAccount> = {
  'student@learno.edu': {
    user: DEFAULT_USER,
    password: 'password123',
  },
  'student.google@gmail.com': {
    user: {
      ...DEFAULT_USER,
      id: 'google_student_01',
      name: 'My Google Account',
      email: 'student.google@gmail.com',
      avatar: '🌐',
    },
    password: 'password123',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Record<string, RegisteredAccount>>(() => {
    const saved = localStorage.getItem('learno_registered_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...INITIAL_DEFAULT_ACCOUNTS, ...parsed };
        }
      } catch (e) {
        console.error('Failed to parse registered accounts', e);
      }
    }
    return INITIAL_DEFAULT_ACCOUNTS;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('learno_student_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (VALID_CLASSES.includes(parsed.class)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('learno_is_authenticated');
    return saved === 'true';
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    localStorage.setItem('learno_student_user', JSON.stringify(user));
    if (user.email) {
      const normalized = user.email.toLowerCase();
      setAccounts((prev) => {
        const existing = prev[normalized];
        const updated = {
          ...prev,
          [normalized]: {
            password: existing?.password || 'password123',
            user,
          },
        };
        localStorage.setItem('learno_registered_accounts', JSON.stringify(updated));
        return updated;
      });
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('learno_is_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (email: string, password?: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts[normalizedEmail];

    if (!account) {
      // If matching current in-memory user
      if (normalizedEmail === user.email.toLowerCase()) {
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    }

    if (password && account.password && account.password !== password) {
      return false;
    }

    // Successfully authenticated
    setUser(account.user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithGoogle = (googleName = 'Student', googleEmail = 'student@gmail.com') => {
    const normalizedEmail = googleEmail.trim().toLowerCase();
    const existing = accounts[normalizedEmail];

    if (existing) {
      // Restore existing Google user data without overwriting progress
      setUser(existing.user);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      return;
    }

    const googleUser: User = {
      id: `google_user_${Date.now()}`,
      name: googleName.trim() || 'Google Student',
      email: normalizedEmail,
      class: 'Class 8',
      avatar: '🌐',
      testsCompleted: 27,
      totalTests: 200,
      averageAccuracy: 84,
      streak: 7,
      achievements: ['first-step', 'getting-started', 'consistent-learner', 'accuracy-ace', 'streak-star'],
      selectedSubjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Computer', 'Hindi', 'Sanskrit', 'Communication'],
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...accounts,
      [normalizedEmail]: {
        user: googleUser,
        password: '',
      },
    };

    setAccounts(updated);
    localStorage.setItem('learno_registered_accounts', JSON.stringify(updated));
    setUser(googleUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest_user_${Date.now()}`,
      name: 'Guest Student',
      email: 'guest@learno.edu',
      class: 'Class 8',
      avatar: '🎒',
      testsCompleted: 15,
      totalTests: 200,
      averageAccuracy: 80,
      streak: 4,
      achievements: ['first-step', 'getting-started', 'consistent-learner'],
      selectedSubjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Computer', 'Hindi', 'Sanskrit', 'Communication'],
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const signup = (name: string, email: string, password: string, studentClass: StudentClass = 'Class 8'): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) return false;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'Learno Student',
      email: normalizedEmail,
      class: studentClass || 'Class 8',
      avatar: '🎓',
      testsCompleted: 0,
      totalTests: 200,
      averageAccuracy: 0,
      streak: 1,
      achievements: ['first-step'],
      selectedSubjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Computer', 'Hindi', 'Sanskrit', 'Communication'],
      createdAt: new Date().toISOString(),
    };

    const updatedAccounts = {
      ...accounts,
      [normalizedEmail]: {
        user: newUser,
        password: password.trim(),
      },
    };

    setAccounts(updatedAccounts);
    localStorage.setItem('learno_registered_accounts', JSON.stringify(updatedAccounts));
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('learno_is_authenticated', 'false');
  };

  const updateProfile = (updates: Partial<Pick<User, 'name' | 'email' | 'class' | 'avatar'>>) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const changeClass = (newClass: StudentClass) => {
    setUser((prev) => ({
      ...prev,
      class: newClass,
    }));
  };

  const completeOnboarding = (selectedClass: StudentClass, subjects: string[]) => {
    setUser((prev) => ({
      ...prev,
      class: selectedClass,
      selectedSubjects: subjects,
    }));
    setIsOnboardingOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => setIsOnboardingOpen(false);

  const resetToDemo = () => {
    localStorage.removeItem('learno_student_results');
    localStorage.removeItem('learno_active_test_session');
    setUser(DEFAULT_USER);
    setIsAuthenticated(true);
  };

  const unlockAchievement = (badgeId: string) => {
    setUser((prev) => {
      if (prev.achievements.includes(badgeId)) return prev;
      return {
        ...prev,
        achievements: [...prev.achievements, badgeId],
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isOnboardingOpen,
        isAuthModalOpen,
        authModalMode,
        login,
        loginWithGoogle,
        loginAsGuest,
        signup,
        logout,
        updateProfile,
        changeClass,
        completeOnboarding,
        openAuthModal,
        closeAuthModal,
        openOnboarding,
        closeOnboarding,
        resetToDemo,
        unlockAchievement,
        accounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
