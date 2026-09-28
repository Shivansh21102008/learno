import { StudentClass, Achievement, Test, Question } from '../types';
import { CLASS_CHAPTERS } from './classChapters';
import { generateQuestionsForTest as generateQuestionsForTestEngine, getConceptsForChapter } from './chapterQuestionEngine';

export const SUBJECT_METAS: Record<string, { name: string; description: string; iconName: string; testCount: number; color: string; bgColor: string }> = {
  Mathematics: {
    name: 'Mathematics',
    description: 'Arithmetic, Algebra, Geometry, Mensuration & Number Sense',
    iconName: 'Calculator',
    testCount: 30,
    color: '#2563EB',
    bgColor: '#EFF6FF',
  },
  Science: {
    name: 'Science',
    description: 'Physics, Chemistry, Biology & Environmental Phenomena',
    iconName: 'Atom',
    testCount: 30,
    color: '#16A34A',
    bgColor: '#DCFCE7',
  },
  English: {
    name: 'English',
    description: 'Grammar, Reading Comprehension, Vocabulary & Writing',
    iconName: 'BookOpen',
    testCount: 25,
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
  },
  'Social Science': {
    name: 'Social Science',
    description: 'History, Civics, Geography & Environmental Awareness',
    iconName: 'Globe',
    testCount: 25,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  Computer: {
    name: 'Computer',
    description: 'Networks, Programming, Logic, Cyber Safety & IT Tools',
    iconName: 'Laptop',
    testCount: 25,
    color: '#06B6D4',
    bgColor: '#CFFAFE',
  },
  Hindi: {
    name: 'Hindi',
    description: 'Vyakaran, Sandhi, Samas, Muhavare va Sahitya Bodh',
    iconName: 'Languages',
    testCount: 25,
    color: '#EC4899',
    bgColor: '#FCE7F3',
  },
  Sanskrit: {
    name: 'Sanskrit',
    description: 'संस्कृत व्याकरण, शब्द रूपाणि, धातु रूपाणि, श्लोक बोधश्च',
    iconName: 'ScrollText',
    testCount: 20,
    color: '#D97706',
    bgColor: '#FEF3C7',
  },
  Communication: {
    name: 'Communication',
    description: 'Spoken English, Active Listening, Debate & Public Speaking',
    iconName: 'MessageSquare',
    testCount: 20,
    color: '#059669',
    bgColor: '#D1FAE5',
  },
};

export { CLASS_CHAPTERS };

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first practice test on Learno.',
    requirement: 'Complete 1 test',
    icon: 'Footprints',
    type: 'tests',
    threshold: 1,
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Build your learning momentum with 5 completed tests.',
    requirement: 'Complete 5 tests',
    icon: 'Sparkles',
    type: 'tests',
    threshold: 5,
  },
  {
    id: 'consistent-learner',
    name: 'Consistent Learner',
    description: 'Demonstrate dedication across multiple chapters.',
    requirement: 'Complete 10 tests',
    icon: 'Compass',
    type: 'tests',
    threshold: 10,
  },
  {
    id: 'dedicated-student',
    name: 'Dedicated Student',
    description: 'Reach a quarter century of focused practice tests.',
    requirement: 'Complete 25 tests',
    icon: 'Award',
    type: 'tests',
    threshold: 25,
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Master subjects by completing 50 rigorous tests.',
    requirement: 'Complete 50 tests',
    icon: 'BookMarked',
    type: 'tests',
    threshold: 50,
  },
  {
    id: 'test-master',
    name: 'Test Master',
    description: 'An elite milestone indicating deep conceptual clarity.',
    requirement: 'Complete 100 tests',
    icon: 'Medal',
    type: 'tests',
    threshold: 100,
  },
  {
    id: 'learno-champion',
    name: 'Learno Champion',
    description: 'Complete all 200 curriculum tests across 200 unique chapters. The pinnacle of academic excellence!',
    requirement: 'Complete all 200 tests',
    icon: 'Trophy',
    type: 'tests',
    threshold: 200,
  },
  {
    id: 'accuracy-ace',
    name: 'Accuracy Ace',
    description: 'Achieve an outstanding accuracy of 80% or higher.',
    requirement: 'Maintain >= 80% Average Accuracy',
    icon: 'Target',
    type: 'accuracy',
    threshold: 80,
  },
  {
    id: 'streak-star',
    name: '7-Day Scholar',
    description: 'Practice consistently every single day for an entire week.',
    requirement: 'Reach a 7-day streak',
    icon: 'Flame',
    type: 'streak',
    threshold: 7,
  },
];

// Delegated to chapterQuestionEngine with 200 authentic chapter-concept generators
export function generateQuestionsForTest(
  subject: string,
  chapter: string,
  testNumber: number,
  studentClass: StudentClass,
  problemNumber?: number
): Question[] {
  return generateQuestionsForTestEngine(subject, chapter, testNumber, studentClass, problemNumber || testNumber);
}

// Generate Main Integrated Comprehensive Examinations for Class
export function generateMainExaminationsForClass(studentClass: StudentClass): Test[] {
  const cNum = studentClass.replace(/\s+/g, '');

  return [
    {
      id: `${cNum}-Main-Term1`,
      class: studentClass,
      subject: 'All Subjects (Integrated)',
      chapter: 'Term 1 Mid-Term Board Assessment',
      chapterNumber: 1,
      testNumber: 1,
      title: 'Term 1 Official Board Assessment',
      questionsCount: 25,
      durationMinutes: 25,
      difficulty: 'Medium',
      isMainExam: true,
      questions: generateQuestionsForTest('Mathematics', 'Place Value', 1, studentClass).slice(0, 5)
        .concat(generateQuestionsForTest('Science', 'Plants', 1, studentClass).slice(0, 5))
        .concat(generateQuestionsForTest('Social Science', 'Maps', 1, studentClass).slice(0, 5))
        .concat(generateQuestionsForTest('English', 'Grammar', 1, studentClass).slice(0, 5))
        .concat(generateQuestionsForTest('Computer', 'Basics', 1, studentClass).slice(0, 5)),
    },
    {
      id: `${cNum}-Main-Annual`,
      class: studentClass,
      subject: 'All Subjects (Integrated)',
      chapter: 'Annual Board Final Comprehensive Exam',
      chapterNumber: 2,
      testNumber: 2,
      title: 'Annual Final Comprehensive Exam',
      questionsCount: 30,
      durationMinutes: 30,
      difficulty: 'Hard',
      isMainExam: true,
      questions: generateQuestionsForTest('Mathematics', 'Geometry', 2, studentClass).slice(0, 6)
        .concat(generateQuestionsForTest('Science', 'Heat', 2, studentClass).slice(0, 6))
        .concat(generateQuestionsForTest('Social Science', 'History', 2, studentClass).slice(0, 6))
        .concat(generateQuestionsForTest('English', 'Voice', 2, studentClass).slice(0, 6))
        .concat(generateQuestionsForTest('Hindi', 'Vyakaran', 2, studentClass).slice(0, 6)),
    },
    {
      id: `${cNum}-Main-Merit`,
      class: studentClass,
      subject: 'All Subjects (Integrated)',
      chapter: 'National Scholastic Merit Scholarship Exam',
      chapterNumber: 3,
      testNumber: 3,
      title: 'National Scholastic Merit Exam',
      questionsCount: 25,
      durationMinutes: 25,
      difficulty: 'Hard',
      isMainExam: true,
      questions: generateQuestionsForTest('Mathematics', 'Equations', 3, studentClass).slice(0, 5)
        .concat(generateQuestionsForTest('Science', 'Microorganisms', 3, studentClass).slice(0, 5))
        .concat(generateQuestionsForTest('Social Science', 'Constitution', 3, studentClass).slice(0, 5))
        .concat(generateQuestionsForTest('English', 'Tenses', 3, studentClass).slice(0, 5))
        .concat(generateQuestionsForTest('Computer', 'Python', 3, studentClass).slice(0, 5)),
    },
  ];
}

// Generate the complete set of tests per class (200 Unique Chapter Tests + 3 Main Examinations)
export function generateCurriculumTestsForClass(studentClass: StudentClass): Test[] {
  const tests: Test[] = [];
  const subjectChapters = CLASS_CHAPTERS[studentClass];

  // Subject test allocations summing strictly to 200 chapter tests across 200 unique chapters:
  // Mathematics: 30, Science: 30, English: 25, Social Science: 25, Computer: 25, Hindi: 25, Sanskrit: 20, Communication: 20
  const subjectOrder = [
    'Mathematics',
    'Science',
    'English',
    'Social Science',
    'Computer',
    'Hindi',
    'Sanskrit',
    'Communication',
  ];

  for (const subject of subjectOrder) {
    const chapters = subjectChapters[subject] || [];

    chapters.forEach((chapter, chIdx) => {
      const problemNumber = tests.length + 1;
      const testId = `${studentClass.replace(/\s+/g, '')}-${subject.replace(/\s+/g, '')}-P${problemNumber}`;
      const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard'];
      const diff = difficulties[chIdx % difficulties.length];
      const concepts = getConceptsForChapter(subject, chapter);

      tests.push({
        id: testId,
        class: studentClass,
        subject,
        chapter,
        chapterNumber: chIdx + 1,
        testNumber: chIdx + 1,
        problemNumber,
        title: `Problem #${problemNumber}: ${chapter}`,
        topic: chapter,
        concepts,
        questionsCount: 20,
        durationMinutes: 20,
        difficulty: diff,
        questions: generateQuestionsForTest(subject, chapter, chIdx + 1, studentClass, problemNumber),
      });
    });
  }

  // Also include the 3 Main Examinations
  const mainExams = generateMainExaminationsForClass(studentClass);
  tests.push(...mainExams);

  return tests;
}

// Pre-seeded initial results for "Shivansh Giri — Class 8" to give a rich, realistic startup state
// 27 tests completed, 84% average accuracy, 7-day streak, matching the prompt requirement
export function getInitialResultsForShivansh(tests: Test[]): Record<string, import('../types').TestResult> {
  const results: Record<string, import('../types').TestResult> = {};

  // Take the first 27 tests of Class 8 and mark them completed
  const completedSlice = tests.slice(0, 27);

  completedSlice.forEach((t, index) => {
    // Generate scores around 16 to 19 out of 20 (average ~84-85%)
    const scoreMap = [17, 18, 16, 17, 19, 16, 17, 18, 17, 16, 18, 17, 19, 17, 18, 16, 17, 18, 17, 16, 18, 17, 17, 18, 16, 17, 17];
    const score = scoreMap[index] || 17;
    const accuracy = Math.round((score / 20) * 100);
    const answers: Record<number, number> = {};

    t.questions.forEach((q, qIdx) => {
      if (qIdx < score) {
        answers[qIdx] = q.correctAnswer;
      } else {
        // Mistake
        answers[qIdx] = (q.correctAnswer + 1) % 5;
      }
    });

    results[t.id] = {
      testId: t.id,
      class: t.class,
      subject: t.subject,
      chapter: t.chapter,
      testNumber: t.testNumber,
      score,
      totalQuestions: 20,
      accuracy,
      timeTakenSeconds: 16 * 60 + 42 - (index % 5) * 40,
      completedAt: new Date(Date.now() - (27 - index) * 3600 * 1000 * 8).toISOString(),
      answers,
    };
  });

  return results;
}
