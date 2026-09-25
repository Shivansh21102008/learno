import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentClass, VALID_CLASSES } from '../types';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isOnboardingOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  login: (email: string, password?: string) => boolean;
  loginWithGoogle: (googleName?: string, googleEmail?: string) => void;
  signup: (name: string, email: string, password: string, studentClass?: StudentClass) => void;
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
}

const DEFAULT_USER: User = {
  id: 'user_shivansh_01',
  name: 'Shivansh Giri',
  email: 'shivansh@example.com',
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    // If user has not signed up or logged in, app strictly requires authentication first
    return saved === 'true';
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    localStorage.setItem('learno_student_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('learno_is_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (email: string) => {
    setUser((prev) => ({
      ...prev,
      email: email.trim() || prev.email,
    }));
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithGoogle = (googleName = 'Shivansh Giri', googleEmail = 'shivansh.giri@gmail.com') => {
    const googleUser: User = {
      id: `google_user_${Date.now()}`,
      name: googleName,
      email: googleEmail,
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
    setUser(googleUser);
    setIsAuthenticated(true);
    localStorage.setItem('learno_student_user', JSON.stringify(googleUser));
    localStorage.setItem('learno_is_authenticated', 'true');
    setIsAuthModalOpen(false);
  };

  const signup = (name: string, email: string, _password: string, studentClass: StudentClass = 'Class 8') => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'Learno Student',
      email: email.trim(),
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
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
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
