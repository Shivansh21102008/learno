export type StudentClass = 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9';

export const VALID_CLASSES: StudentClass[] = [
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
];

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string, string]; // Strictly 5 options A, B, C, D, E
  correctAnswer: number; // 0..4
  explanation: string;
  concept?: string;
  topic?: string;
}

export interface Test {
  id: string;
  class: StudentClass;
  subject: string;
  chapter: string;
  chapterNumber: number;
  testNumber: number;
  problemNumber?: number; // Sequential index 1..200
  title: string;
  topic?: string;
  concepts?: string[];
  questionsCount: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
  isMainExam?: boolean;
}

export interface TestResult {
  testId: string;
  class: StudentClass;
  subject: string;
  chapter: string;
  testNumber: number;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTakenSeconds: number;
  completedAt: string;
  answers: Record<number, number>; // index: optionIndex (0..4)
  isMainExam?: boolean;
}

export interface SubjectMeta {
  id: string;
  name: string;
  description: string;
  iconName: string;
  testCount: number;
  color: string;
  bgColor: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: string;
  icon: string;
  type: 'tests' | 'accuracy' | 'streak' | 'subject';
  threshold: number;
  unlockedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  class: StudentClass;
  avatar: string;
  testsCompleted: number;
  totalTests: number;
  averageAccuracy: number;
  streak: number;
  achievements: string[]; // list of unlocked achievement IDs
  selectedSubjects: string[];
  createdAt: string;
}

export type ActiveTab = 'home' | 'dashboard' | 'tests' | 'achievements' | 'profile';

export type AIVivaMode = 'easy' | 'intermediate' | 'hard';

export interface AIVivaQuestion {
  id: string;
  question: string;
  chapter: string;
  subject: string;
  difficulty: AIVivaMode;
  idealAnswer: string; // Sahi Version
  keyConcepts: string[];
  explanation?: string; // Step-by-step tutorial explanation if student asks 'mujhe nahi aata'
  explanationHindi?: string; // Hindi/Hinglish friendly explanation
  realWorldExample?: string; // Real-world example
  isCommunicationMode?: boolean; // Full professional English communication
}

export interface AIVivaAnswerEvaluation {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  isCorrect: boolean;
  scorePercentage: number; // 0..100
  feedback: string;
  sahiVersion: string; // The correct / ideal version
  detectedDeficiencies: ('reading' | 'writing' | 'conceptual' | 'articulation')[];
  fluencyScore?: number; // 0..100 for communication mode
  professionalToneScore?: number; // 0..100 for communication mode
}

export interface SkillDiagnostic {
  readingNeed: 'high' | 'moderate' | 'strong';
  readingAdvice: string;
  writingNeed: 'high' | 'moderate' | 'strong';
  writingAdvice: string;
  conceptualNeed: 'high' | 'moderate' | 'strong';
  conceptualAdvice: string;
  articulationNeed: 'high' | 'moderate' | 'strong';
  articulationAdvice: string;
  topActionSteps: string[];
}

export interface AIVivaResult {
  id: string;
  mode: AIVivaMode;
  chapter: string;
  studentClass: StudentClass;
  completedAt: string;
  overallAccuracy: number; // 0..100
  evaluations: AIVivaAnswerEvaluation[];
  diagnostic: SkillDiagnostic;
}
