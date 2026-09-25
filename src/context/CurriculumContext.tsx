import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Test, TestResult, DisqualificationReport, ProctorLockout } from '../types';
import { useAuth } from './AuthContext';
import {
  generateCurriculumTestsForClass,
  getInitialResultsForShivansh,
  ACHIEVEMENTS_LIST,
} from '../data/curriculumData';
import confetti from 'canvas-confetti';

interface CurriculumContextType {
  tests: Test[];
  results: Record<string, TestResult>;
  lockouts: Record<string, ProctorLockout>;
  isExamLocked: (testId: string) => boolean;
  getExamLockout: (testId: string) => ProctorLockout | null;
  activeTest: Test | null;
  activeResultModal: TestResult | null;
  reviewTestResult: TestResult | null;
  newBadgeUnlocked: string | null;
  pendingProctorTest: Test | null;
  proctorStream: MediaStream | null;
  isSimulatedProctor: boolean;
  disqualificationReport: DisqualificationReport | null;
  stats: {
    testsCompleted: number;
    testsRemaining: number;
    totalTests: number;
    averageAccuracy: number;
    subjectProgress: Record<string, { total: number; completed: number; percentage: number }>;
  };
  startTest: (testId: string, forceProctor?: boolean) => void;
  quitTest: () => void;
  closeProctorPrecheck: () => void;
  startProctoredExam: (stream: MediaStream | null, isSimulated: boolean) => void;
  handleDisqualification: (report: DisqualificationReport) => void;
  clearDisqualification: () => void;
  submitTest: (
    testId: string,
    answers: Record<number, number>,
    timeTakenSeconds: number
  ) => TestResult;
  closeResultModal: () => void;
  openReviewAnswers: (result: TestResult) => void;
  closeReviewAnswers: () => void;
  dismissBadgeToast: () => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export const CurriculumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, unlockAchievement } = useAuth();

  // Generate the 200 tests for the currently selected class
  const tests = useMemo(() => {
    return generateCurriculumTestsForClass(user.class);
  }, [user.class]);

  // Load results from localStorage
  const [results, setResults] = useState<Record<string, TestResult>>(() => {
    const saved = localStorage.getItem('learno_student_results');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved results', e);
      }
    }
    // Default pre-seeded state for Shivansh Giri - Class 8 (27 tests completed)
    const initialTests = generateCurriculumTestsForClass('Class 8');
    return getInitialResultsForShivansh(initialTests);
  });

  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [activeResultModal, setActiveResultModal] = useState<TestResult | null>(null);
  const [reviewTestResult, setReviewTestResult] = useState<TestResult | null>(null);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);
  const [pendingProctorTest, setPendingProctorTest] = useState<Test | null>(null);
  const [proctorStream, setProctorStream] = useState<MediaStream | null>(null);
  const [isSimulatedProctor, setIsSimulatedProctor] = useState<boolean>(false);
  const [disqualificationReport, setDisqualificationReport] = useState<DisqualificationReport | null>(null);

  // 24-Hour Proctor Disqualification Lockouts
  const [lockouts, setLockouts] = useState<Record<string, ProctorLockout>>(() => {
    const saved = localStorage.getItem('learno_proctor_lockouts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved lockouts', e);
      }
    }
    return {};
  });

  // Save lockouts whenever they change
  useEffect(() => {
    localStorage.setItem('learno_proctor_lockouts', JSON.stringify(lockouts));
  }, [lockouts]);

  const isExamLocked = (testId: string): boolean => {
    const lockout = lockouts[testId];
    if (!lockout) return false;
    return Date.now() < lockout.lockedUntil;
  };

  const getExamLockout = (testId: string): ProctorLockout | null => {
    const lockout = lockouts[testId];
    if (!lockout) return null;
    if (Date.now() >= lockout.lockedUntil) return null;
    return lockout;
  };

  // Save results whenever they change
  useEffect(() => {
    localStorage.setItem('learno_student_results', JSON.stringify(results));
  }, [results]);

  // Compute stats dynamically for current class
  const stats = useMemo(() => {
    // Tests belonging to current class that have results
    const classTestIds = new Set(tests.map((t) => t.id));
    const completedForClass = Object.values(results).filter((r) => classTestIds.has(r.testId));

    const totalTests = 200;
    const testsCompleted = completedForClass.length;
    const testsRemaining = Math.max(0, totalTests - testsCompleted);

    const averageAccuracy =
      testsCompleted > 0
        ? Math.round(
            completedForClass.reduce((sum, r) => sum + r.accuracy, 0) / testsCompleted
          )
        : 0;

    // Subject-wise progress
    const subjectMap: Record<string, { total: number; completed: number; percentage: number }> = {};
    tests.forEach((t) => {
      if (!subjectMap[t.subject]) {
        subjectMap[t.subject] = { total: 0, completed: 0, percentage: 0 };
      }
      subjectMap[t.subject].total += 1;
      if (results[t.id]) {
        subjectMap[t.subject].completed += 1;
      }
    });

    Object.keys(subjectMap).forEach((subj) => {
      const item = subjectMap[subj];
      item.percentage = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
    });

    return {
      testsCompleted,
      testsRemaining,
      totalTests,
      averageAccuracy,
      subjectProgress: subjectMap,
    };
  }, [tests, results]);

  const startTest = (testId: string, forceProctor?: boolean) => {
    if (isExamLocked(testId)) {
      const lockout = getExamLockout(testId);
      const remainingHours = lockout
        ? Math.ceil((lockout.lockedUntil - Date.now()) / (3600 * 1000))
        : 24;
      alert(`Academic Lockout Active: This proctored examination is locked for 24 hours following a recent disqualification. You are eligible to retake in approximately ${remainingHours} hours.`);
      return;
    }

    const target = tests.find((t) => t.id === testId);
    if (target) {
      if (target.requiresProctoring || forceProctor) {
        setPendingProctorTest(target);
      } else {
        setProctorStream(null);
        setIsSimulatedProctor(false);
        setActiveTest(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const closeProctorPrecheck = () => {
    setPendingProctorTest(null);
  };

  const startProctoredExam = (stream: MediaStream | null, isSimulated: boolean) => {
    if (pendingProctorTest) {
      if (isExamLocked(pendingProctorTest.id)) {
        alert('This proctored examination is locked due to an active 24-hour disqualification.');
        setPendingProctorTest(null);
        return;
      }
      setProctorStream(stream);
      setIsSimulatedProctor(isSimulated);
      setActiveTest(pendingProctorTest);
      setPendingProctorTest(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDisqualification = (report: DisqualificationReport) => {
    const lockedUntil = Date.now() + 24 * 60 * 60 * 1000;
    const updatedReport: DisqualificationReport = {
      ...report,
      lockedUntil,
    };
    const newLockout: ProctorLockout = {
      testId: report.testId,
      testTitle: report.testTitle,
      lockedAt: report.disqualifiedAt,
      lockedUntil,
      reason: report.reason,
    };

    setLockouts((prev) => {
      const next = { ...prev, [report.testId]: newLockout };
      localStorage.setItem('learno_proctor_lockouts', JSON.stringify(next));
      return next;
    });

    setDisqualificationReport(updatedReport);
  };

  const clearDisqualification = () => {
    setDisqualificationReport(null);
    quitTest();
  };

  const quitTest = () => {
    if (proctorStream) {
      proctorStream.getTracks().forEach((t) => t.stop());
    }
    setProctorStream(null);
    setIsSimulatedProctor(false);
    setActiveTest(null);
  };

  const submitTest = (
    testId: string,
    answers: Record<number, number>,
    timeTakenSeconds: number
  ): TestResult => {
    const test = tests.find((t) => t.id === testId);
    if (!test) throw new Error('Test not found');

    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const totalQuestions = test.questions.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const newResult: TestResult = {
      testId,
      class: test.class,
      subject: test.subject,
      chapter: test.chapter,
      testNumber: test.testNumber,
      score: correctCount,
      totalQuestions,
      accuracy,
      timeTakenSeconds,
      completedAt: new Date().toISOString(),
      answers,
    };

    setResults((prev) => ({
      ...prev,
      [testId]: newResult,
    }));

    if (proctorStream) {
      proctorStream.getTracks().forEach((t) => t.stop());
    }
    setProctorStream(null);
    setIsSimulatedProctor(false);

    setActiveTest(null);
    setActiveResultModal(newResult);

    // Confetti on good score
    if (accuracy >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Check achievement milestones
    const newCompletedCount = stats.testsCompleted + (results[testId] ? 0 : 1);
    ACHIEVEMENTS_LIST.forEach((badge) => {
      if (badge.type === 'tests' && newCompletedCount >= badge.threshold) {
        if (!user.achievements.includes(badge.id)) {
          unlockAchievement(badge.id);
          setNewBadgeUnlocked(badge.name);
        }
      } else if (badge.type === 'accuracy' && accuracy >= badge.threshold) {
        if (!user.achievements.includes(badge.id)) {
          unlockAchievement(badge.id);
          setNewBadgeUnlocked(badge.name);
        }
      }
    });

    return newResult;
  };

  const closeResultModal = () => {
    setActiveResultModal(null);
  };

  const openReviewAnswers = (result: TestResult) => {
    setReviewTestResult(result);
  };

  const closeReviewAnswers = () => {
    setReviewTestResult(null);
  };

  const dismissBadgeToast = () => {
    setNewBadgeUnlocked(null);
  };

  return (
    <CurriculumContext.Provider
      value={{
        tests,
        results,
        lockouts,
        isExamLocked,
        getExamLockout,
        activeTest,
        activeResultModal,
        reviewTestResult,
        newBadgeUnlocked,
        pendingProctorTest,
        proctorStream,
        isSimulatedProctor,
        disqualificationReport,
        stats,
        startTest,
        quitTest,
        closeProctorPrecheck,
        startProctoredExam,
        handleDisqualification,
        clearDisqualification,
        submitTest,
        closeResultModal,
        openReviewAnswers,
        closeReviewAnswers,
        dismissBadgeToast,
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (!context) throw new Error('useCurriculum must be used within a CurriculumProvider');
  return context;
};
