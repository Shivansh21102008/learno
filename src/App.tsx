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
import { TestScreen } from './components/test/TestScreen';
import { TestResultModal } from './components/test/TestResultModal';
import { ReviewAnswersModal } from './components/test/ReviewAnswersModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGateScreen } from './components/auth/AuthGateScreen';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ChangeClassModal } from './components/profile/ChangeClassModal';
import { ProctorPrecheckModal } from './components/proctor/ProctorPrecheckModal';
import { InstructionsModal } from './components/instructions/InstructionsModal';
import { AITutorSidebar } from './components/ai/AITutorSidebar';
import { Trophy, X, Bot } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);

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
    pendingProctorTest,
    startTest,
    closeProctorPrecheck,
    startProctoredExam,
    closeResultModal,
    openReviewAnswers,
    closeReviewAnswers,
    dismissBadgeToast,
  } = useCurriculum();

  // If student is not signed up / logged in, strictly enforce the Auth Gate Screen
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-text-primary dark:text-slate-100 transition-colors">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Floating Right-Edge Quick Trigger for AI Tutor Sidebar */}
      {!isAiTutorOpen && (
        <button
          onClick={() => setIsAiTutorOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-l from-indigo-600 to-primary text-white py-3 px-2 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 hover:px-2.5 hover:shadow-indigo-500/40 transition-all duration-200 border-y border-l border-indigo-400/30 group"
          title="Open AI Tutor Sidebar"
          aria-label="Open AI Tutor Sidebar"
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 text-white/95">
            AI Tutor
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Proctoring Pre-Check Device Gate */}
      {pendingProctorTest && (
        <ProctorPrecheckModal
          test={pendingProctorTest}
          isOpen={true}
          onClose={closeProctorPrecheck}
          onVerified={(stream, isSimulated) => {
            startProctoredExam(stream, isSimulated);
          }}
        />
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
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3.5 animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold flex-shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="pr-2">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Badge Unlocked! 🎉
            </div>
            <div className="text-sm font-bold text-white">{newBadgeUnlocked}</div>
          </div>
          <button
            onClick={dismissBadgeToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
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
