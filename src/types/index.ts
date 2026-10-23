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

export type ActiveTab = 'home' | 'dashboard' | 'tests' | 'achievements' | 'profile' | 'pdf-exam';

export interface PDFQuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // 4 options
  correctAnswer: number; // 0..3
  explanation: string;
  topic?: string;
}

export interface PDFQuizExam {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  extractedTextLength: number;
  questions: PDFQuizQuestion[];
  createdAt: string;
  durationMinutes: number;
}

export interface PDFQuizResult {
  examId: string;
  title: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTakenSeconds: number;
  answers: Record<number, number>;
  completedAt: string;
}

export type CommentCategory = 'experience' | 'problem' | 'question' | 'suggestion';
export type CommentChannel = 'user' | 'admin';

export interface CommentItem {
  id: string;
  channel: CommentChannel; // 'user' (community) or 'admin' (official announcement)
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  authorClass?: string;
  isAdmin: boolean;
  category: CommentCategory;
  title: string;
  content: string;
  rating?: number; // 1 to 5 stars for experience
  date: string; // e.g. "02 Oct 2026"
  time: string; // e.g. "09:05 PM"
  timestamp: string; // Combined formatted date/time
  likes: number;
  likedByMe?: boolean;
  isAccepted: boolean; // Accepted / Verified by Admin
  acceptedAt?: string;
  adminNote?: string;
}


