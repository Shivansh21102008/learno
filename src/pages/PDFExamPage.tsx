import React, { useState, useRef, useEffect } from 'react';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { generateExamFromPDFText } from '../utils/aiPdfQuizEngine';
import { PDFQuizExam, PDFQuizResult } from '../types';
import {
  FileText,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Trophy,
  BrainCircuit,
  Eye,
  FileCheck2,
  XCircle,
  FileUp,
} from 'lucide-react';

interface PDFExamPageProps {
  onBackToHome?: () => void;
}

const MAX_ALLOWED_ATTEMPTS = 3;

export const PDFExamPage: React.FC<PDFExamPageProps> = ({ onBackToHome }) => {
  // Page mode: 'upload' | 'analyzing' | 'exam' | 'result'
  const [mode, setMode] = useState<'upload' | 'analyzing' | 'exam' | 'result'>('upload');

  // Attempt & Warning Tracking
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(() => {
    const saved = sessionStorage.getItem('learno_pdf_attempts_remaining');
    return saved !== null ? parseInt(saved, 10) : MAX_ALLOWED_ATTEMPTS;
  });

  const [warningModal, setWarningModal] = useState<{
    title: string;
    description: string;
    attemptDeducted: boolean;
    fileInfo?: string;
  } | null>(null);

  // Active Exam State
  const [activeExam, setActiveExam] = useState<PDFQuizExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(600);
  const [examResult, setExamResult] = useState<PDFQuizResult | null>(null);

  // User Settings for generation
  const [questionCountPref, setQuestionCountPref] = useState<number>(10);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [analyzingProgress, setAnalyzingProgress] = useState<string>('Initializing AI Engine...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save attempts remaining in session storage
  useEffect(() => {
    sessionStorage.setItem('learno_pdf_attempts_remaining', String(attemptsRemaining));
  }, [attemptsRemaining]);

  // Exam Timer Countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (mode === 'exam' && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, timeRemainingSeconds]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reset Security Attempts
  const handleResetAttempts = () => {
    setAttemptsRemaining(MAX_ALLOWED_ATTEMPTS);
    setWarningModal(null);
  };

  // Process File Upload
  const handleProcessFile = async (file: File) => {
    // 1. Check if user has exceeded attempts
    if (attemptsRemaining <= 0) {
      setWarningModal({
        title: '⛔ MAXIMUM ATTEMPTS EXCEEDED',
        description:
          'You have exhausted all 3 upload attempts due to invalid files or PDFs with no readable questions. Click "Reset Attempts" below to try again with a valid study PDF.',
        attemptDeducted: false,
      });
      return;
    }

    setMode('analyzing');
    setAnalyzingProgress('Scanning document headers & verifying PDF structure...');

    // Simulate cyber telemetry analysis stage
    await new Promise((r) => setTimeout(r, 600));

    // 2. Extract Text from PDF
    const result = await extractTextFromPDF(file);

    // 3. Handle Failure Cases (Non-PDF or No Questions/Content)
    if (!result.success) {
      const nextAttempts = Math.max(0, attemptsRemaining - 1);
      setAttemptsRemaining(nextAttempts);

      if (result.errorType === 'INVALID_FORMAT') {
        setWarningModal({
          title: '⚠️ SECURITY WARNING: INVALID FILE TYPE',
          description:
            result.errorMessage ||
            'Learno AI strictly requires a .pdf document. Images, spreadsheets, and other files cannot be parsed into study questions.',
          attemptDeducted: true,
          fileInfo: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        });
      } else {
        // No questions or extractable academic text
        setWarningModal({
          title: '⚠️ WARNING: NO QUESTIONS OR CONTENT FOUND',
          description:
            result.errorMessage ||
            'The uploaded PDF contains no readable questions, notes, or chapter content. Please upload a study PDF with legible text or exercises.',
          attemptDeducted: true,
          fileInfo: `PDF name: ${file.name} (${result.numPages || 0} pages)`,
        });
      }

      setMode('upload');
      return;
    }

    // 4. Successful PDF Verification & Text Extraction
    setAnalyzingProgress('Analyzing concepts & formulating exam questions...');
    await new Promise((r) => setTimeout(r, 800));

    // Generate Custom Exam Object
    const exam = generateExamFromPDFText(
      result.text || '',
      result.fileName || file.name,
      result.fileSize || file.size,
      questionCountPref
    );

    // If somehow 0 questions were generated, trigger warning
    if (!exam.questions || exam.questions.length === 0) {
      const nextAttempts = Math.max(0, attemptsRemaining - 1);
      setAttemptsRemaining(nextAttempts);
      setWarningModal({
        title: '⚠️ WARNING: INSUFFICIENT QUESTION DATA',
        description:
          'Could not synthesize questions from the extracted PDF text. Please ensure the PDF has educational paragraphs, exercises, or chapter notes.',
        attemptDeducted: true,
      });
      setMode('upload');
      return;
    }

    // Success! Reset attempts back to 3 on successful PDF verification
    setAttemptsRemaining(MAX_ALLOWED_ATTEMPTS);
    setWarningModal(null);
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemainingSeconds(exam.durationMinutes * 60);
    setMode('exam');
  };

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input so the same file can be re-selected if desired
    if (e.target) e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Option select in exam
  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  // Finish exam and compute score
  const handleFinishExam = () => {
    if (!activeExam) return;

    let score = 0;
    activeExam.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });

    const totalQuestions = activeExam.questions.length;
    const accuracy = Math.round((score / totalQuestions) * 100);
    const timeSpent = activeExam.durationMinutes * 60 - timeRemainingSeconds;

    const result: PDFQuizResult = {
      examId: activeExam.id,
      title: activeExam.title,
      score,
      totalQuestions,
      accuracy,
      timeTakenSeconds: Math.max(1, timeSpent),
      answers: selectedAnswers,
      completedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setExamResult(result);
    setMode('result');
  };

  // Sample study material generator for students without a PDF ready
  const handleLoadSamplePDF = (topicName: string, sampleText: string) => {
    setMode('analyzing');
    setAnalyzingProgress(`Loading sample study notes on "${topicName}"...`);
    setTimeout(() => {
      const exam = generateExamFromPDFText(
        sampleText,
        `Sample_${topicName.replace(/\s+/g, '_')}.pdf`,
        sampleText.length * 2,
        questionCountPref
      );
      setActiveExam(exam);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeRemainingSeconds(exam.durationMinutes * 60);
      setAttemptsRemaining(MAX_ALLOWED_ATTEMPTS);
      setWarningModal(null);
      setMode('exam');
    }, 700);
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto font-sans text-white">
      {/* ========================================================================= */}
      {/* 1. UPLOAD & SCANNER VIEW                                                  */}
      {/* ========================================================================= */}
      {mode === 'upload' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Card */}
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF66]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00FF66] font-bold px-2.5 py-0.5 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30">
                    AI PDF EXAM GENERATOR
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                      attemptsRemaining > 1
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : attemptsRemaining === 1
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                        : 'bg-rose-900/40 border-rose-500 text-rose-200'
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    ATTEMPTS: {attemptsRemaining} / {MAX_ALLOWED_ATTEMPTS}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
                  Upload PDF → Instant AI Exam
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Upload any NCERT chapter, school assignment, or revision notes in PDF format.
                  Our AI scanner analyzes the text and creates a custom chapter examination with instant scoring.
                </p>
              </div>

              {/* Attempts Reset Button if attempts depleted */}
              {attemptsRemaining < MAX_ALLOWED_ATTEMPTS && (
                <button
                  type="button"
                  onClick={handleResetAttempts}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>Reset Attempts ({attemptsRemaining}/{MAX_ALLOWED_ATTEMPTS})</span>
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE WARNING BANNER (If non-pdf or no questions uploaded) */}
          {warningModal && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/40 shadow-[0_0_25px_rgba(239,68,68,0.2)] animate-in fade-in space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-rose-300 uppercase font-mono tracking-wider">
                      {warningModal.title}
                    </h3>
                    <span className="font-mono text-[10px] text-rose-400 font-bold bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40">
                      {attemptsRemaining} ATTEMPTS REMAINING
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {warningModal.description}
                  </p>
                  {warningModal.fileInfo && (
                    <p className="font-mono text-[11px] text-neutral-400 pt-1">
                      File Telemetry: {warningModal.fileInfo}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-xs font-mono">
                <span className="text-[11px] text-rose-400">
                  {attemptsRemaining === 0
                    ? 'Security Lock: You have 0 attempts left. Reset below to try again.'
                    : `Warning: You have ${attemptsRemaining} attempt(s) remaining.`}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setWarningModal(null)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                  >
                    Dismiss
                  </button>
                  {attemptsRemaining === 0 && (
                    <button
                      type="button"
                      onClick={handleResetAttempts}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold"
                    >
                      Reset Attempts Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAIN UPLOAD ZONE (Drag & Drop or File Picker) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-[#0A0D14]/80 shadow-2xl relative ${
              isDragging
                ? 'border-[#00FF66] bg-[#00FF66]/10 scale-[1.01]'
                : attemptsRemaining === 0
                ? 'border-rose-500/50 bg-rose-950/10'
                : 'border-white/15 hover:border-[#00FF66]/60 hover:bg-white/[0.02]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-4">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-transform ${
                  isDragging
                    ? 'scale-110 bg-[#00FF66] text-black'
                    : 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30'
                }`}
              >
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-wide">
                  Drag & Drop Your Study PDF Here
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Only documents ending with <span className="text-[#00FF66] font-mono font-bold">.pdf</span> are accepted. Max size 25MB.
                </p>
              </div>

              {/* Upload Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={attemptsRemaining <= 0}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3.5 rounded-2xl bg-[#00FF66] hover:bg-[#2eff7d] disabled:opacity-40 disabled:hover:bg-[#00FF66] text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all inline-flex items-center gap-2"
                >
                  <FileUp className="w-4 h-4" />
                  <span>SELECT STUDY PDF FROM DEVICE</span>
                </button>
              </div>

              {/* Security Policy Reminder */}
              <div className="pt-3 text-[11px] font-mono text-neutral-500 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Non-PDF files or PDFs without readable questions will trigger an attempt warning.</span>
              </div>
            </div>
          </div>

          {/* QUESTION COUNT PREFERENCE */}
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-neutral-400 font-bold uppercase tracking-wider block">
                Exam Configuration
              </span>
              <span className="text-[11px] text-neutral-500">
                Choose how many multiple choice questions to synthesize from your PDF:
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCountPref(cnt)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                    questionCountPref === cnt
                      ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          {/* SAMPLE TEST SHORTCUTS (For immediate testing if user doesn't have a PDF ready) */}
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                  FAST DEMO RIGS
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Don't have a PDF ready? Test with Instant Sample Study Material:
                </h3>
              </div>
              <Sparkles className="w-4 h-4 text-[#00FF66]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() =>
                  handleLoadSamplePDF(
                    'Photosynthesis & Cell Energy',
                    'Photosynthesis is defined as the biochemical process by which green plants, algae, and certain bacteria convert sunlight energy into chemical energy in the form of glucose. The primary function of chlorophyll pigment in the thylakoid membranes is the absorption of photons. Stomata are microscopic pores located primarily on the lower epidermis of leaves that regulate carbon dioxide intake and oxygen transpiration. Unlike animal cellular respiration which consumes oxygen and releases carbon dioxide, photosynthesis consumes carbon dioxide and produces oxygen. The light-independent reactions, known as the Calvin cycle, occur within the stroma of the chloroplast.'
                  )
                }
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#00FF66] bg-[#050505] hover:bg-[#00FF66]/5 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-[#00FF66] mb-1">
                  🌿 Science: Photosynthesis
                </div>
                <p className="text-[10px] text-neutral-400 font-sans leading-tight">
                  Sample biology notes on chlorophyll, Calvin cycle, and chloroplasts.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleLoadSamplePDF(
                    'Linear Equations in Two Variables',
                    'A linear equation in two variables is defined as an equation that can be put in the form ax + by + c = 0, where a, b, and c are real numbers, and a and b are not both zero. The graph of every linear equation in two variables is a straight line. Every point whose coordinates satisfy the equation lies on this line. A pair of linear equations in two variables can be solved algebraically using the substitution method or the elimination method. If the lines intersect at a single point, the system has exactly one unique solution and is called consistent.'
                  )
                }
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#00FF66] bg-[#050505] hover:bg-[#00FF66]/5 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-[#00FF66] mb-1">
                  📐 Math: Linear Equations
                </div>
                <p className="text-[10px] text-neutral-400 font-sans leading-tight">
                  Sample algebra material on consistent systems and substitution.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleLoadSamplePDF(
                    'Indian Constitution & Fundamental Rights',
                    'The Constitution of India is the supreme legal charter of the Republic of India. Part III of the Constitution guarantees Fundamental Rights to all citizens, including the Right to Equality and the Right to Freedom of Speech. Dr. B.R. Ambedkar is known as the Chief Architect of the Indian Constitution. The Preamble declares India to be a Sovereign, Socialist, Secular, and Democratic Republic. The judiciary acts as the guardian of the Constitution with power of judicial review.'
                  )
                }
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#00FF66] bg-[#050505] hover:bg-[#00FF66]/5 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-[#00FF66] mb-1">
                  🏛️ SST: Constitution Rights
                </div>
                <p className="text-[10px] text-neutral-400 font-sans leading-tight">
                  Sample civics notes on Part III Fundamental Rights and Preamble.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ANALYZING / EXTRACTING VIEW                                            */}
      {/* ========================================================================= */}
      {mode === 'analyzing' && (
        <div className="bg-[#0A0D14]/90 border border-[#00FF66]/40 rounded-3xl p-12 text-center shadow-2xl max-w-lg mx-auto space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] mx-auto flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(0,255,102,0.3)]">
            <BrainCircuit className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FF66] font-bold">
              NEURAL TELEMETRY SCAN
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              Synthesizing Questions
            </h2>
            <p className="font-mono text-xs text-neutral-400 animate-pulse">
              {analyzingProgress}
            </p>
          </div>

          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-[#00FF66]/30">
            <div className="h-full bg-[#00FF66] animate-pulse w-3/4 shadow-[0_0_10px_#00FF66]" />
          </div>

          <p className="text-[11px] font-mono text-neutral-500">
            Validating questions, options, and explanations from document context...
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LIVE EXAMINATION VIEW                                                  */}
      {/* ========================================================================= */}
      {mode === 'exam' && activeExam && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Exam HUD: Title, Timer, Progress */}
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#00FF66] font-bold px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30">
                  PDF EXAM ACTIVE
                </span>
                <span className="font-mono text-xs text-neutral-400 truncate max-w-[250px]">
                  {activeExam.fileName}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-bold text-white truncate max-w-xl">
                {activeExam.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 font-mono">
              {/* Timer HUD */}
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
                  timeRemainingSeconds < 120
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-white/5 border-white/15 text-[#00FF66]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>

              {/* Submit Early Button */}
              <button
                type="button"
                onClick={handleFinishExam}
                className="px-4 py-1.5 rounded-xl bg-[#00FF66] hover:bg-[#2eff7d] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(0,255,102,0.3)] transition-all"
              >
                SUBMIT EXAM
              </button>
            </div>
          </div>

          {/* Question Palette / Quick Jump Matrix */}
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-3.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-neutral-500 uppercase mr-2">
              JUMP:
            </span>
            {activeExam.questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentQuestionIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#00FF66] text-black ring-2 ring-[#00FF66] ring-offset-2 ring-offset-[#0A0D14]'
                      : isAnswered
                      ? 'bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66]'
                      : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Card */}
          {activeExam.questions[currentQuestionIndex] && (
            <div className="bg-[#0A0D14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs text-[#00FF66] font-bold">
                  QUESTION {currentQuestionIndex + 1} OF {activeExam.questions.length}
                </span>
                {activeExam.questions[currentQuestionIndex].topic && (
                  <span className="font-mono text-[10px] uppercase text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Topic: {activeExam.questions[currentQuestionIndex].topic}
                  </span>
                )}
              </div>

              {/* Question Statement */}
              <h3 className="text-base sm:text-xl font-display font-bold text-white leading-relaxed">
                {activeExam.questions[currentQuestionIndex].question}
              </h3>

              {/* 4 Multiple Choice Options (A, B, C, D) */}
              <div className="space-y-3 pt-2">
                {activeExam.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const labelLetter = ['A', 'B', 'C', 'D'][optIdx];

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all font-sans text-xs sm:text-sm ${
                        isSelected
                          ? 'bg-[#00FF66]/15 border-[#00FF66] text-white shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                          : 'bg-[#050505] border-white/10 hover:border-white/30 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#00FF66] text-black font-black'
                            : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        {labelLetter}
                      </div>
                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-neutral-300 font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>PREVIOUS</span>
                </button>

                {currentQuestionIndex < activeExam.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-[#00FF66] hover:bg-[#2eff7d] text-black font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,102,0.3)]"
                  >
                    <span>NEXT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishExam}
                    className="px-6 py-2 rounded-xl bg-[#00FF66] hover:bg-[#2eff7d] text-black font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                  >
                    <span>SUBMIT FINAL EXAM</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RESULTS & FULL REVIEW VIEW                                             */}
      {/* ========================================================================= */}
      {mode === 'result' && examResult && activeExam && (
        <div className="space-y-6 animate-in fade-in">
          {/* Result Score Card */}
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] mb-1">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00FF66] font-bold">
                EXAMINATION TELEMETRY COMPLETE
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
                {examResult.title}
              </h2>
            </div>

            {/* Score Numbers */}
            <div className="flex items-center justify-center gap-6 py-3 font-mono">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-black text-[#00FF66]">
                  {examResult.score} / {examResult.totalQuestions}
                </span>
                <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">
                  CORRECT ANSWERS
                </span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {examResult.accuracy}%
                </span>
                <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">
                  ACCURACY RATE
                </span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-black text-neutral-300">
                  {formatTime(examResult.timeTakenSeconds)}
                </span>
                <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">
                  TIME TAKEN
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setTimeRemainingSeconds(activeExam.durationMinutes * 60);
                  setMode('exam');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 border border-white/15"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>RETAKE THIS EXAM</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveExam(null);
                  setExamResult(null);
                  setMode('upload');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00FF66] hover:bg-[#2eff7d] text-black flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>UPLOAD ANOTHER PDF</span>
              </button>

              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                >
                  Return Home
                </button>
              )}
            </div>
          </div>

          {/* Full Question-by-Question Review with PDF Explanations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display font-bold text-base uppercase text-white tracking-wide">
                Detailed Answer Review & PDF Explanations
              </h3>
              <span className="font-mono text-xs text-neutral-400">
                {examResult.totalQuestions} Questions Evaluated
              </span>
            </div>

            {activeExam.questions.map((q, idx) => {
              const studentChoice = examResult.answers[idx];
              const isCorrect = studentChoice === q.correctAnswer;
              const isUnanswered = studentChoice === undefined;

              return (
                <div
                  key={idx}
                  className={`bg-[#0A0D14]/90 border rounded-2xl p-5 sm:p-6 shadow-card space-y-3 transition-all ${
                    isCorrect
                      ? 'border-[#00FF66]/30 bg-gradient-to-r from-[#00FF66]/[0.02] to-transparent'
                      : 'border-rose-500/30 bg-gradient-to-r from-rose-500/[0.02] to-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-xs">
                    <span className="font-bold text-white">Question {idx + 1}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/40'
                          : isUnanswered
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Correct (+1)
                        </>
                      ) : isUnanswered ? (
                        <>
                          <HelpCircle className="w-3 h-3" /> Unanswered (0)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Incorrect (0)
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {q.question}
                  </h4>

                  {/* Options review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctAnswer;
                      const isOptionChosen = optIdx === studentChoice;

                      let badgeClass = 'bg-[#050505] border-white/10 text-neutral-400';
                      if (isOptionCorrect) {
                        badgeClass = 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] font-bold';
                      } else if (isOptionChosen && !isOptionCorrect) {
                        badgeClass = 'bg-rose-500/15 border-rose-500 text-rose-300 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-start gap-2 ${badgeClass}`}
                        >
                          <span className="font-mono font-bold text-[10px]">
                            {['A', 'B', 'C', 'D'][optIdx]}.
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed PDF Excerpt Explanation */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-neutral-300 space-y-1">
                    <span className="font-bold text-[10px] uppercase text-[#00FF66] block">
                      SOURCE EVIDENCE & EXPLANATION:
                    </span>
                    <p className="text-neutral-300 text-xs leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
