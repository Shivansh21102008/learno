import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurriculumProvider, useCurriculum } from './context/CurriculumContext';
import { ThemeProvider } from './context/ThemeContext';
import { ActiveTab } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { TestsPage } from './pages/TestsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CommentsPage } from './pages/CommentsPage';
import { TestScreen } from './components/test/TestScreen';
import { TestResultModal } from './components/test/TestResultModal';
import { ReviewAnswersModal } from './components/test/ReviewAnswersModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGateScreen } from './components/auth/AuthGateScreen';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ChangeClassModal } from './components/profile/ChangeClassModal';
import { InstructionsModal } from './components/instructions/InstructionsModal';
import { AITutorSidebar } from './components/ai/AITutorSidebar';
import { CinematicIntroScreen } from './components/intro/CinematicIntroScreen';
import { Trophy, X, Bot } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);

  // When user authenticates, ensure active tab is 'home'
  React.useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('home');
    }
  }, [isAuthenticated]);

  // Reset scroll position to top whenever active tab changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const {
    tests,
    activeTest,
    activeResultModal,
    reviewTestResult,
    newBadgeUnlocked,
    startTest,
    closeResultModal,
    openReviewAnswers,
    closeReviewAnswers,
    dismissBadgeToast,
  } = useCurriculum();

  // 1. Cinematic Intro Screen on Website Open: "Made & Directed By Rudra Giri"
  if (showIntro) {
    return (
      <CinematicIntroScreen
        onComplete={() => {
          setShowIntro(false);
          setActiveTab('home');
        }}
      />
    );
  }

  // 2. If student is not signed up / logged in, strictly enforce the Auth Gate Screen
  if (!isAuthenticated) {
    return <AuthGateScreen />;
  }

  // If student is currently taking an exam, show full-screen examination interface!
  if (activeTest) {
    return (
      <TestScreen
        test={activeTest}
        onBackToHome={() => setActiveTab('home')}
        onBackToDashboard={() => setActiveTab('dashboard')}
      />
    );
  }

  // Find the test for the review modal
  const reviewTest = reviewTestResult
    ? tests.find((t) => t.id === reviewTestResult.testId) || tests[0]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-text-primary font-sans selection:bg-[#00FF66] selection:text-black">
      {/* Persistent Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenClassModal={() => setIsClassModalOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onToggleAiTutor={() => setIsAiTutorOpen((prev) => !prev)}
        isAiTutorOpen={isAiTutorOpen}
      />

      {/* Main View Port */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onOpenClassModal={() => setIsClassModalOpen(true)}
            onOpenInstructions={() => setIsInstructionsOpen(true)}
            onOpenAiTutor={() => setIsAiTutorOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={setActiveTab}
            onSelectSubjectFilter={(subj) => {
              setSelectedSubjectFilter(subj);
              setActiveTab('tests');
            }}
            onOpenClassModal={() => setIsClassModalOpen(true)}
          />
        )}

        {activeTab === 'tests' && (
          <TestsPage
            selectedSubjectFilter={selectedSubjectFilter}
            setSelectedSubjectFilter={setSelectedSubjectFilter}
            onOpenClassModal={() => setIsClassModalOpen(true)}
          />
        )}

        {activeTab === 'achievements' && <AchievementsPage />}

        {activeTab === 'comments' && <CommentsPage />}

        {activeTab === 'profile' && (
          <ProfilePage onOpenClassModal={() => setIsClassModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <AuthModal />
      <OnboardingModal />
      <ChangeClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />

      {/* Platform Instructions & Feature Guide Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsInstructionsOpen(false);
        }}
        onOpenAiTutor={() => {
          setIsInstructionsOpen(false);
          setIsAiTutorOpen(true);
        }}
        onOpenClassModal={() => {
          setIsInstructionsOpen(false);
          setIsClassModalOpen(true);
        }}
      />

      {/* 24/7 Adjustable AI Academic Tutor Sidebar */}
      <AITutorSidebar
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
      />

      {/* Floating Right-Edge Quick Trigger for AI Tutor (Normal & Jarvis Mode) */}
      {!isAiTutorOpen && (
        <button
          onClick={() => setIsAiTutorOpen(true)}
          className="flex fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-[#0A0D14] hover:bg-[#00FF66] text-white hover:text-black py-3 px-2 rounded-l-xl shadow-2xl flex-col items-center gap-2 hover:px-2.5 transition-all duration-200 border-y border-l border-white/10 hover:border-[#00FF66] group font-mono"
          title="Open AI Tutor (Normal & Jarvis Mode)"
          aria-label="Open AI Tutor"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-black/10 flex items-center justify-center transition-transform">
            <Bot className="w-4 h-4 text-[#00FF66] group-hover:text-black" />
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
            [ AI TUTOR ]
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_6px_#00FF66]" />
        </button>
      )}


      {/* Test Result Screen Modal */}
      {activeResultModal && (
        <TestResultModal
          result={activeResultModal}
          onClose={closeResultModal}
          onReview={(res) => {
            closeResultModal();
            openReviewAnswers(res);
          }}
          onRetake={(testId) => {
            closeResultModal();
            startTest(testId);
          }}
        />
      )}

      {/* Review Answers Modal */}
      {reviewTestResult && reviewTest && (
        <ReviewAnswersModal
          result={reviewTestResult}
          test={reviewTest}
          onClose={closeReviewAnswers}
        />
      )}

      {/* Badge Unlocked Notification Toast */}
      {newBadgeUnlocked && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 max-w-sm z-50 bg-[#0A0D14] text-white px-5 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(0,255,102,0.2)] border border-[#00FF66]/40 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 font-mono">
          <div className="w-10 h-10 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] flex items-center justify-center font-bold flex-shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="pr-2 flex-1">
            <div className="text-[10px] font-bold text-[#00FF66] uppercase tracking-wider">
              BADGE UNLOCKED // TELEMETRY UPDATED
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{newBadgeUnlocked}</div>
          </div>
          <button
            onClick={dismissBadgeToast}
            aria-label="Dismiss badge"
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurriculumProvider>
          <MainLayout />
        </CurriculumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
