import React, { useState, useEffect, useRef } from 'react';
import { StudentClass, AIVivaMode, AIVivaQuestion, AIVivaAnswerEvaluation, SkillDiagnostic } from '../../types';
import {
 getAIVivaChapters,
 getAIVivaQuestionsForChapter,
 evaluateAIVivaAnswer,
 generateSkillDiagnostic,
} from '../../data/aiVivaData';
import {
 Sparkles,
 Bot,
 Volume2,
 VolumeX,
 Mic,
 MicOff,
 Send,
 CheckCircle2,
 AlertTriangle,
 BookOpen,
 PenTool,
 Brain,
 MessageSquare,
 ArrowRight,
 RotateCcw,
 X,
} from 'lucide-react';

interface AIOralExaminerModalProps {
 studentClass: StudentClass;
 initialMode?: AIVivaMode;
 onClose: () => void;
}

export const AIOralExaminerModal: React.FC<AIOralExaminerModalProps> = ({
 studentClass,
 initialMode = 'easy',
 onClose,
}) => {
 // Phase state: 'chapter_select' -> 'viva_active' -> 'diagnostic_report'
 const [phase, setPhase] = useState<'chapter_select' | 'viva_active' | 'diagnostic_report'>('chapter_select');
 const [selectedMode, setSelectedMode] = useState<AIVivaMode>(initialMode);
 const [selectedChapter, setSelectedChapter] = useState<string>('');

 // Viva Session State
 const [questions, setQuestions] = useState<AIVivaQuestion[]>([]);
 const [currentQIndex, setCurrentQIndex] = useState<number>(0);
 const [currentAnswer, setCurrentAnswer] = useState<string>('');
 const [evaluations, setEvaluations] = useState<AIVivaAnswerEvaluation[]>([]);
 const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
 const [isListening, setIsListening] = useState<boolean>(false);
 const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
 const [diagnostic, setDiagnostic] = useState<SkillDiagnostic | null>(null);
 const [isExplaining, setIsExplaining] = useState<boolean>(false);

 // Speech Recognition ref
 const recognitionRef = useRef<any>(null);

 // Chapters available for the selected mode
 const modeChapters = getAIVivaChapters(studentClass, selectedMode);

 // Set default selected chapter when mode changes
 useEffect(() => {
 if (modeChapters.length > 0 && !modeChapters.includes(selectedChapter)) {
 setSelectedChapter(modeChapters[0]);
 }
 }, [selectedMode, modeChapters, selectedChapter]);

 // Speech Synthesis Helper
 const speakText = (text: string, onEnd?: () => void) => {
 if (isAudioMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
 if (onEnd) onEnd();
 return;
 }

 try {
 window.speechSynthesis.cancel();
 const utterance = new SpeechSynthesisUtterance(text);
 utterance.rate = 0.95;
 utterance.pitch = 1.05;

 utterance.onstart = () => setIsAiSpeaking(true);
 utterance.onend = () => {
 setIsAiSpeaking(false);
 if (onEnd) onEnd();
 };
 utterance.onerror = () => {
 setIsAiSpeaking(false);
 if (onEnd) onEnd();
 };

 window.speechSynthesis.speak(utterance);
 } catch (e) {
 console.warn('Speech synthesis error', e);
 setIsAiSpeaking(false);
 if (onEnd) onEnd();
 }
 };

 // Stop speaking when unmounting or changing
 useEffect(() => {
 return () => {
 if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
 window.speechSynthesis.cancel();
 }
 if (recognitionRef.current) {
 recognitionRef.current.abort();
 }
 };
 }, []);

 // Initialize Speech Recognition
 const toggleSpeechRecognition = () => {
 const SpeechRecognition =
 (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

 if (!SpeechRecognition) {
 alert('Speech Recognition is not supported by your browser. You can type your answer below!');
 return;
 }

 if (isListening) {
 if (recognitionRef.current) {
 recognitionRef.current.stop();
 }
 setIsListening(false);
 return;
 }

 try {
 const recognition = new SpeechRecognition();
 recognition.continuous = true;
 recognition.interimResults = true;
 recognition.lang = 'en-IN';

 recognition.onstart = () => {
 setIsListening(true);
 };

 recognition.onresult = (event: any) => {
 let transcript = '';
 for (let i = 0; i < event.results.length; i++) {
 transcript += event.results[i][0].transcript + ' ';
 }
 setCurrentAnswer((prev) => {
 const base = prev.trim() ? prev.trim() + ' ' : '';
 return (base + transcript).trim();
 });
 };

 recognition.onerror = (event: any) => {
 console.warn('Speech recognition error:', event.error);
 setIsListening(false);
 };

 recognition.onend = () => {
 setIsListening(false);
 };

 recognitionRef.current = recognition;
 recognition.start();
 } catch (e) {
 console.error('Failed to start speech recognition', e);
 setIsListening(false);
 }
 };

 // Start the oral viva test
 const handleStartViva = (chapterToUse?: string) => {
 const chapter = chapterToUse || selectedChapter || modeChapters[0];
 const qList = getAIVivaQuestionsForChapter(studentClass, selectedMode, chapter);

 setQuestions(qList);
 setCurrentQIndex(0);
 setCurrentAnswer('');
 setEvaluations([]);
 setIsExplaining(false);
 setPhase('viva_active');

 // AI Introduces the test and reads Question 1
 const isComm = qList[0]?.isCommunicationMode;
 const greeting = isComm
 ? `Welcome to your Professional English Communication Assessment for ${studentClass}. Let us commence your oral viva on ${chapter}. Question 1: ${qList[0].question}`
 : `Welcome! I am your AI Examiner for ${studentClass}. Let's begin your oral viva on ${chapter}. Question 1: ${qList[0].question}`;
 speakText(greeting);
 };

 // Triggered when student says"mujhe nahi aata","I don't know", or clicks the button
 const handleAskAiToExplain = () => {
 if (recognitionRef.current && isListening) {
 recognitionRef.current.stop();
 setIsListening(false);
 }

 const currentQ = questions[currentQIndex];
 if (!currentQ) return;

 setIsExplaining(true);

 if (currentQ.isCommunicationMode) {
 const speech = `No worries at all! Effective communication is developed through structured practice. Let me explain this communication scenario: ${currentQ.explanation || ''} In a professional setting, the ideal response would be: ${currentQ.idealAnswer}. You may now practice delivering this response, or proceed to the next question.`;
 speakText(speech);
 } else {
 const speech = `Koi baat nahi! Seekhna hi sabse zaroori hai. Chalo main aapko ye concept aasaani se samjhata hoon: ${currentQ.explanationHindi || currentQ.explanation || ''} Iska sahi version ye hai: ${currentQ.idealAnswer}. Ab samajh aaya? Aap abhi try kar sakte hain ya agle question par chal sakte hain.`;
 speakText(speech);
 }
 };

 // Advance to next question after reviewing AI explanation
 const handleSkipAfterExplain = () => {
 const currentQ = questions[currentQIndex];
 if (!currentQ) return;

 const evalResult: AIVivaAnswerEvaluation = {
 questionId: currentQ.id,
 questionText: currentQ.question,
 studentAnswer: currentAnswer.trim() || 'Requested AI Teacher Explanation ("Mujhe nahi aata")',
 isCorrect: false,
 scorePercentage: 45, // Partial credit for engaging with tutorial explanation
 feedback: 'Concept explained by AI Teacher during the session. Reviewed ideal model answer and core mechanism.',
 sahiVersion: currentQ.idealAnswer,
 detectedDeficiencies: ['conceptual', 'articulation'],
 fluencyScore: currentQ.isCommunicationMode ? 55 : undefined,
 professionalToneScore: currentQ.isCommunicationMode ? 60 : undefined,
 };

 const updatedEvaluations = [...evaluations, evalResult];
 setEvaluations(updatedEvaluations);
 setIsExplaining(false);

 const nextIndex = currentQIndex + 1;
 if (nextIndex < questions.length) {
 setCurrentQIndex(nextIndex);
 setCurrentAnswer('');
 const nextQ = questions[nextIndex];
 const spokenNext = `Great! Let's proceed to the next question: ${nextQ.question}`;
 speakText(spokenNext);
 } else {
 const diag = generateSkillDiagnostic(updatedEvaluations);
 setDiagnostic(diag);
 setPhase('diagnostic_report');

 const totalScore = Math.round(
 updatedEvaluations.reduce((sum, e) => sum + e.scorePercentage, 0) / updatedEvaluations.length
 );
 const conclusionSpeech = `Oral viva complete! Your overall accuracy is ${totalScore} percent. Let's examine your performance report and key areas of improvement.`;
 speakText(conclusionSpeech);
 }
 };

 // Submit answer for current question and advance
 const handleSubmitAnswer = () => {
 if (recognitionRef.current && isListening) {
 recognitionRef.current.stop();
 setIsListening(false);
 }

 const currentQ = questions[currentQIndex];
 if (!currentQ) return;

 // Detect if student expressed not knowing the answer
 const notKnowingRegex = /(mujhe\s*nahi\s*aata|nahi\s*aata|nahi\s*pata|mujhe\s*nahi\s*pata|don'?t\s*know|do\s*not\s*know|samjha\s*do|explain\s*(karo|please|this)?|no\s*idea|samajh\s*nahi\s*aaya|i\s*don'?t\s*understand)/i;
 if (notKnowingRegex.test(currentAnswer.trim())) {
 handleAskAiToExplain();
 return;
 }

 // Evaluate answer
 const evalResult = evaluateAIVivaAnswer(currentQ, currentAnswer);
 const updatedEvaluations = [...evaluations, evalResult];
 setEvaluations(updatedEvaluations);
 setIsExplaining(false);

 const nextIndex = currentQIndex + 1;
 if (nextIndex < questions.length) {
 setCurrentQIndex(nextIndex);
 setCurrentAnswer('');
 const nextQ = questions[nextIndex];
 const spokenNext = `Thank you. Next Question: ${nextQ.question}`;
 speakText(spokenNext);
 } else {
 // Completed all questions -> Generate Diagnostic Progress Report
 const diag = generateSkillDiagnostic(updatedEvaluations);
 setDiagnostic(diag);
 setPhase('diagnostic_report');

 const totalScore = Math.round(
 updatedEvaluations.reduce((sum, e) => sum + e.scorePercentage, 0) / updatedEvaluations.length
 );
 const conclusionSpeech = `Oral viva complete! Your overall accuracy is ${totalScore} percent. Let's examine your performance report and key areas of improvement.`;
 speakText(conclusionSpeech);
 }
 };

 // Overall accuracy calculation for the diagnostic report
 const overallAccuracy =
 evaluations.length > 0
 ? Math.round(evaluations.reduce((sum, e) => sum + e.scorePercentage, 0) / evaluations.length)
 : 0;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
 <div role="dialog" aria-modal="true" data-lenis-prevent className="relative w-full max-w-4xl bg-glitch-panel rounded-3xl shadow-2xl border border-white/10 overflow-hidden max-h-[92vh] flex flex-col transition-colors">
 {/* Top App Header Bar */}
 <div className="px-6 py-4 bg-glitch-panel border-b border-white/10 text-white flex items-center justify-between shadow-sm flex-shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-glitch-panel/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
 <Bot className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-black uppercase tracking-wider text-blue-200">
 Learno AI Viva Hub
 </span>
 <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
 Oral Examiner
 </span>
 </div>
 <h2 className="text-sm sm:text-base font-bold text-white">
 Interactive Oral Diagnostic Assessment
 </h2>
 </div>
 </div>

 <div className="flex items-center gap-2">
 {/* Audio Toggle */}
 <button
 onClick={() => {
 if (isAiSpeaking) {
 window.speechSynthesis.cancel();
 setIsAiSpeaking(false);
 }
 setIsAudioMuted(!isAudioMuted);
 }}
 className={`p-2 rounded-xl text-white/90 hover:text-white transition-colors border ${
 isAudioMuted
 ? 'bg-glitch-surface/30 border-rose-400/50'
 : 'bg-glitch-panel/10 hover:bg-glitch-panel/20 border-white/20'
 }`}
 title={isAudioMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
 >
 {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
 </button>

 {/* Close Modal */}
 <button
 onClick={onClose}
 className="p-2 rounded-xl bg-glitch-panel/10 hover:bg-glitch-panel/20 border border-white/20 text-white transition-colors"
 title="Close"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* ------------------------------------------------------------- */}
 {/* PHASE 1: DIFFICULTY & CHAPTER SELECTOR */}
 {/* ------------------------------------------------------------- */}
 {phase === 'chapter_select' && (
 <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
 <div className="text-center max-w-2xl mx-auto space-y-2">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-extrabold uppercase tracking-wide border border-primary-200">
 <Sparkles className="w-3.5 h-3.5" />
 Select Viva Mode for {studentClass}
 </span>
 <h3 className="text-xl sm:text-2xl font-black text-white">
 Choose Your Oral Test Difficulty Tier
 </h3>
 <p className="text-xs sm:text-sm text-neutral-400">
 Learno AI will converse with you out loud, test your spoken understanding, and evaluate your accuracy with a comprehensive skill diagnosis.
 </p>
 </div>

 {/* 3 Difficulty Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {/* Easy Card (10 Chapters) */}
 <div
 onClick={() => setSelectedMode('easy')}
 className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
 selectedMode === 'easy'
 ? 'border-emerald-500 bg-glitch-surface shadow-md ring-2 ring-emerald-500/20'
 : 'border-white/10 bg-glitch-panel hover:border-emerald-400'
 }`}
 >
 <div>
 <div className="flex items-center justify-between mb-3">
 <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase">
 Easy (सरल)
 </span>
 <span className="text-xs font-bold text-emerald-600">
 10 Chapters
 </span>
 </div>
 <h4 className="text-base font-bold text-white">
 Foundational Viva
 </h4>
 <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
 Conversational oral assessment testing basic facts, definitions, and real-world examples.
 </p>
 </div>
 <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-emerald-600 flex items-center justify-between">
 <span>10 Curated Chapters</span>
 <span className="font-mono">🟢 Level 1</span>
 </div>
 </div>

 {/* Intermediate Card (20 Chapters) */}
 <div
 onClick={() => setSelectedMode('intermediate')}
 className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
 selectedMode === 'intermediate'
 ? 'border-amber-500 bg-glitch-surface shadow-md ring-2 ring-amber-500/20'
 : 'border-white/10 bg-glitch-panel hover:border-amber-400'
 }`}
 >
 <div>
 <div className="flex items-center justify-between mb-3">
 <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-black uppercase">
 Intermediate (मध्यम)
 </span>
 <span className="text-xs font-bold text-amber-600">
 20 Chapters
 </span>
 </div>
 <h4 className="text-base font-bold text-white">
 Conceptual Competency
 </h4>
 <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
 Higher-order questions testing mechanisms, comparisons, and structured problem solving.
 </p>
 </div>
 <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-amber-600 flex items-center justify-between">
 <span>20 Curated Chapters</span>
 <span className="font-mono">🟡 Level 2</span>
 </div>
 </div>

 {/* Hard Card (40 Chapters) */}
 <div
 onClick={() => setSelectedMode('hard')}
 className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
 selectedMode === 'hard'
 ? 'border-rose-500 bg-glitch-surface shadow-md ring-2 ring-rose-500/20'
 : 'border-white/10 bg-glitch-panel hover:border-rose-400'
 }`}
 >
 <div>
 <div className="flex items-center justify-between mb-3">
 <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase">
 Hard (कठिन)
 </span>
 <span className="text-xs font-bold text-rose-600">
 40 Chapters
 </span>
 </div>
 <h4 className="text-base font-bold text-white">
 Rigorous Mastery
 </h4>
 <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
 Advanced critical thinking viva analyzing edge cases, theoretical axioms, and deep terminology.
 </p>
 </div>
 <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-rose-600 flex items-center justify-between">
 <span>40 Curated Chapters</span>
 <span className="font-mono">🔴 Level 3</span>
 </div>
 </div>
 </div>

 {/* Chapters Grid for Selected Mode */}
 <div className="space-y-3 pt-2">
 <div className="flex items-center justify-between">
 <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
 <BookOpen className="w-4 h-4 text-primary" />
 <span>
 Select Chapter to Begin ({modeChapters.length} Chapters Available in{' '}
 <span className="capitalize">{selectedMode}</span> Mode)
 </span>
 </h4>
 <span className="text-[11px] text-neutral-400">
 Click any chapter to test
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
 {modeChapters.map((ch, idx) => {
 const isSelected = ch === selectedChapter;
 return (
 <button
 key={idx}
 type="button"
 onClick={() => setSelectedChapter(ch)}
 className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 ${
 isSelected
 ? 'border-primary bg-primary-50 text-primary shadow-sm ring-1 ring-primary'
 : 'border-white/10 bg-glitch-panel text-white hover:border-primary-300'
 }`}
 >
 <div className="flex items-center gap-2 truncate">
 <span className="w-5 h-5 rounded-md bg-slate-100 text-neutral-400 text-[10px] flex items-center justify-center flex-shrink-0 font-bold">
 {idx + 1}
 </span>
 <span className="truncate">{ch}</span>
 </div>
 {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
 </button>
 );
 })}
 </div>
 </div>

 {/* Launch Action */}
 <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
 <div className="text-xs text-neutral-400">
 Ready to be tested on: <strong className="text-white">{selectedChapter}</strong>
 </div>
 <button
 onClick={() => handleStartViva()}
 className="w-full sm:w-auto px-7 py-3 bg-glitch-green hover:brightness-110 text-glitch-ink font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
 >
 <Sparkles className="w-4 h-4 text-amber-300" />
 <span>Start AI Oral Viva ({selectedMode.toUpperCase()})</span>
 </button>
 </div>
 </div>
 )}

 {/* ------------------------------------------------------------- */}
 {/* PHASE 2: ACTIVE AI CONVERSATION (SPEAK & LISTEN) */}
 {/* ------------------------------------------------------------- */}
 {phase === 'viva_active' && questions.length > 0 && (
 <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
 {/* Top Progress & Chapter Status */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
 <div>
 <span className="text-[10px] uppercase font-black tracking-wider text-primary">
 {studentClass} • {selectedMode.toUpperCase()} Oral Viva
 </span>
 <h3 className="text-base font-extrabold text-white mt-0.5">
 {questions[currentQIndex]?.chapter}
 </h3>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-bold text-neutral-400">
 Question {currentQIndex + 1} of {questions.length}
 </span>
 <div className="flex gap-1">
 {questions.map((_, i) => (
 <div
 key={i}
 className={`w-6 h-1.5 rounded-full ${
 i === currentQIndex
 ? 'bg-primary'
 : i < currentQIndex
 ? 'bg-glitch-surface'
 : 'bg-slate-200 '
 }`}
 />
 ))}
 </div>
 </div>
 </div>

 {/* AI Examiner Presence Card */}
 <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-3xl p-6 shadow-sm space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div
 className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all ${
 isAiSpeaking
 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-4 ring-blue-400/40 animate-pulse'
 : 'bg-glitch-panel text-primary '
 }`}
 >
 <Bot className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-sm font-bold text-white">
 Dr. Arya — Learno AI Oral Examiner
 </h4>
 <div className="flex items-center gap-2 text-xs mt-0.5">
 {isAiSpeaking ? (
 <span className="text-blue-600 font-bold flex items-center gap-1.5 animate-pulse">
 <Volume2 className="w-3.5 h-3.5" />
 Speaking Question...
 </span>
 ) : (
 <span className="text-neutral-400 flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
 Listening for your response
 </span>
 )}
 </div>
 </div>
 </div>

 <button
 onClick={() => speakText(questions[currentQIndex]?.question)}
 className="px-3 py-1.5 rounded-xl bg-glitch-panel hover:bg-slate-100 text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
 title="Listen again"
 >
 <Volume2 className="w-3.5 h-3.5" />
 <span>Repeat Question</span>
 </button>
 </div>

 {/* Spoken Question Box */}
 <div className="p-4 bg-glitch-panel rounded-2xl border border-blue-100 shadow-sm">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[10px] uppercase font-black tracking-widest text-primary">
 {questions[currentQIndex]?.isCommunicationMode
 ? '🎙️ Professional English Question'
 : 'Question Prompt'}
 </span>
 {questions[currentQIndex]?.isCommunicationMode && (
 <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase border border-indigo-200">
 Formal English Diction
 </span>
 )}
 </div>
 <p className="text-base sm:text-lg font-bold text-white leading-snug">
"{questions[currentQIndex]?.question}"
 </p>
 </div>
 </div>

 {/* ------------------------------------------------------------- */}
 {/* AI TEACHER CONCEPT EXPLANATION CARD (WHEN STUDENT DOESN'T KNOW) */}
 {/* ------------------------------------------------------------- */}
 {isExplaining && (
 <div className="bg-gradient-to-br from-amber-50 via-yellow-50/40 to-orange-50 border-2 border-amber-400 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
 <div className="flex items-center justify-between pb-3 border-b border-amber-200">
 <div className="flex items-center gap-2.5">
 <div className="w-10 h-10 rounded-2xl bg-glitch-surface text-white flex items-center justify-center font-black shadow-md text-lg">
 🎓
 </div>
 <div>
 <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
 Learno AI Teacher Concept Explanation
 </span>
 <h4 className="text-base font-extrabold text-white">
 {questions[currentQIndex]?.isCommunicationMode
 ? 'Professional Communication Technique & Model Phrasing'
 : 'Concept Breakdown & Sahi Version'}
 </h4>
 </div>
 </div>
 <button
 type="button"
 onClick={() => {
 const speech = questions[currentQIndex]?.isCommunicationMode
 ? `${questions[currentQIndex]?.explanation} In a formal setting, an ideal response would be: ${questions[currentQIndex]?.idealAnswer}`
 : `${questions[currentQIndex]?.explanationHindi || questions[currentQIndex]?.explanation} Iska sahi version ye hai: ${questions[currentQIndex]?.idealAnswer}`;
 speakText(speech);
 }}
 className="px-3 py-1.5 rounded-xl bg-glitch-panel hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
 >
 <Volume2 className="w-3.5 h-3.5 text-amber-600" />
 <span>Listen Again</span>
 </button>
 </div>

 {/* Explanation Details */}
 <div className="space-y-3">
 {/* Step-by-Step Breakdown */}
 <div className="p-3.5 rounded-2xl bg-glitch-panel/85 border border-amber-200 space-y-1">
 <span className="text-[10px] uppercase font-black text-amber-800 block">
 💡 Step-by-Step Explanation:
 </span>
 <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
 {questions[currentQIndex]?.explanationHindi || questions[currentQIndex]?.explanation}
 </p>
 {questions[currentQIndex]?.explanationHindi && (
 <p className="text-[11px] text-neutral-400 italic pt-1 border-t border-slate-100">
 Formal Note: {questions[currentQIndex]?.explanation}
 </p>
 )}
 </div>

 {/* Sahi Version (Ideal Model Answer) */}
 <div className="p-4 rounded-2xl bg-glitch-surface border border-emerald-300">
 <span className="text-[10px] uppercase font-black text-emerald-800 block mb-1">
 🌟 Sahi Version (Ideal Model Answer):
 </span>
 <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
"{questions[currentQIndex]?.idealAnswer}"
 </p>
 </div>

 {/* Real-world practical example */}
 {questions[currentQIndex]?.realWorldExample && (
 <div className="text-xs text-neutral-400 flex items-center gap-2 px-1">
 <span className="font-bold text-amber-700">Context Example:</span>
 <span>{questions[currentQIndex]?.realWorldExample}</span>
 </div>
 )}
 </div>

 {/* Actions inside explanation */}
 <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200">
 <button
 type="button"
 onClick={() => {
 setIsExplaining(false);
 setCurrentAnswer('');
 }}
 className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-glitch-green hover:brightness-110 text-glitch-ink font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
 >
 <span>✍️ Ab Main Try Karunga (Attempt Answer Now)</span>
 </button>

 <button
 type="button"
 onClick={handleSkipAfterExplain}
 className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-glitch-panel hover:bg-slate-100 text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
 >
 <span>Samajh Gaya — Agle Question Par Chalein</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}

 {/* Student Oral / Text Response Input */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-white flex items-center gap-1.5">
 <MessageSquare className="w-3.5 h-3.5 text-primary" />
 <span>
 {questions[currentQIndex]?.isCommunicationMode
 ? 'Your Professional English Answer (Speak into microphone or type):'
 : 'Your Spoken Answer (Speak into microphone or type below):'}
 </span>
 </span>
 <span className="text-[11px] text-neutral-400">
 {currentAnswer ? `${currentAnswer.split(/\s+/).filter(Boolean).length} words` : 'Waiting for voice'}
 </span>
 </div>

 <div className="relative">
 <textarea
 rows={4}
 value={currentAnswer}
 onChange={(e) => setCurrentAnswer(e.target.value)}
 placeholder={
 questions[currentQIndex]?.isCommunicationMode
 ? 'Click the microphone to speak in clear professional English, or type your answer... (Or click"Mujhe Nahi Aata" below)'
 : 'Click the microphone to speak your answer, or type your response here... (Or click"Mujhe Nahi Aata" below)'
 }
 className="w-full p-4 pr-14 text-xs sm:text-sm rounded-2xl border border-white/10 bg-glitch-panel text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none shadow-inner"
 />

 {/* Big Microphone Action Button */}
 <button
 type="button"
 onClick={toggleSpeechRecognition}
 className={`absolute right-3.5 bottom-3.5 p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
 isListening
 ? 'bg-glitch-surface text-white ring-4 ring-rose-400/40 animate-pulse'
 : 'bg-glitch-green text-glitch-ink font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] hover:bg-primary-dark active:scale-95'
 }`}
 title={isListening ? 'Stop recording' : 'Click to speak your answer'}
 >
 {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
 </button>
 </div>

 {isListening && (
 <div className="flex items-center gap-2 text-xs font-bold text-rose-600 animate-pulse">
 <span className="w-2 h-2 rounded-full bg-glitch-surface animate-ping" />
 <span>Microphone active: Speak clearly into your device microphone...</span>
 </div>
 )}
 </div>

 {/* Action Bar: Back,"Mujhe Nahi Aata", and Submit */}
 <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
 <button
 type="button"
 onClick={() => setPhase('chapter_select')}
 className="text-xs font-semibold text-neutral-400 hover:text-white"
 >
 ← Back to Mode Select
 </button>

 <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
 {/* Dedicated"Mujhe Nahi Aata" button */}
 <button
 type="button"
 onClick={handleAskAiToExplain}
 className="px-4 py-2.5 rounded-xl bg-glitch-surface hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
 >
 <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
 <span>💡 Mujhe Nahi Aata — AI Samjha Do</span>
 </button>

 <button
 type="button"
 onClick={handleSubmitAnswer}
 disabled={!currentAnswer.trim()}
 className="px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
 >
 <span>{currentQIndex + 1 < questions.length ? 'Submit Answer & Next' : 'Finalize & View Progress'}</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 )}

 {/* ------------------------------------------------------------- */}
 {/* PHASE 3: COMPREHENSIVE PROGRESS & COMPETENCY REPORT */}
 {/* ------------------------------------------------------------- */}
 {phase === 'diagnostic_report' && diagnostic && (
 <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
 {/* Header Score Badge */}
 <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
 AI Diagnostic Report
 </span>
 <span className="text-xs text-blue-200">
 {studentClass} • {selectedMode.toUpperCase()} Oral Viva
 </span>
 </div>
 <h3 className="text-xl sm:text-2xl font-black text-white">
 {selectedChapter}
 </h3>
 <p className="text-xs text-slate-300 max-w-md leading-relaxed">
 Detailed evaluation of your spoken responses, mistake breakdown with the correct version, and skill needs assessment.
 </p>
 </div>

 {/* Overall Accuracy Gauge */}
 <div className="p-5 rounded-2xl bg-glitch-panel/10 border border-white/20 backdrop-blur-sm text-center flex flex-col items-center justify-center min-w-[170px]">
 <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
 Overall Accuracy
 </span>
 <span className="text-3xl sm:text-4xl font-black text-white my-1 font-mono">
 {overallAccuracy}%
 </span>
 <span
 className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
 overallAccuracy >= 75
 ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
 : overallAccuracy >= 50
 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
 : 'bg-rose-400/20 text-rose-300 border border-rose-400/30'
 }`}
 >
 {overallAccuracy >= 75
 ? 'Excellent Articulation'
 : overallAccuracy >= 50
 ? 'Good Competency'
 : 'Foundational Review Needed'}
 </span>
 </div>
 </div>

 {/* --------------------------------------------------------- */}
 {/* PROFESSIONAL ENGLISH COMMUNICATION METRICS (IF COMMUNICATION MODE) */}
 {/* --------------------------------------------------------- */}
 {evaluations.some((e) => e.fluencyScore !== undefined) && (
 <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-900 border border-indigo-500/50 shadow-card space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-black text-lg border border-indigo-400/30">
 🎙️
 </div>
 <div>
 <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300">
 Professional English Assessment
 </span>
 <h4 className="text-base font-bold text-white">
 Executive Fluency & Tone Diagnostic (100% Evaluation)
 </h4>
 </div>
 </div>
 <span className="px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 text-xs font-bold border border-indigo-400/30">
 Full Professional English Standard
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
 <div className="p-4 rounded-2xl bg-glitch-panel/5 border border-white/10 text-center">
 <span className="text-[11px] font-bold text-slate-300 uppercase">Spoken Fluency</span>
 <div className="text-2xl font-black text-indigo-300 my-1 font-mono">
 {Math.round(
 evaluations.reduce((sum, e) => sum + (e.fluencyScore || 60), 0) / evaluations.length
 )}%
 </div>
 <span className="text-[10px] text-slate-400">Coherence, Cadence & Pacing</span>
 </div>

 <div className="p-4 rounded-2xl bg-glitch-panel/5 border border-white/10 text-center">
 <span className="text-[11px] font-bold text-slate-300 uppercase">Professional Tone</span>
 <div className="text-2xl font-black text-purple-300 my-1 font-mono">
 {Math.round(
 evaluations.reduce((sum, e) => sum + (e.professionalToneScore || 65), 0) / evaluations.length
 )}%
 </div>
 <span className="text-[10px] text-slate-400">Diplomatic Register & Formality</span>
 </div>

 <div className="p-4 rounded-2xl bg-glitch-panel/5 border border-white/10 text-center">
 <span className="text-[11px] font-bold text-slate-300 uppercase">Overall Accuracy</span>
 <div className="text-2xl font-black text-emerald-300 my-1 font-mono">
 {overallAccuracy}%
 </div>
 <span className="text-[10px] text-slate-400">Communication Technique Mastery</span>
 </div>
 </div>
 </div>
 )}

 {/* --------------------------------------------------------- */}
 {/* SKILL DEFICIENCY DIAGNOSTIC (Reading, Writing, Conceptual) */}
 {/* --------------------------------------------------------- */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <h4 className="text-sm font-bold text-white flex items-center gap-2">
 <Brain className="w-4 h-4 text-primary" />
 <span>Skill Needs Diagnostic (तुम्हें किसकी ज़रूरत है?)</span>
 </h4>
 <span className="text-xs text-neutral-400">
 Targeted Learning Prescriptions
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
 {/* Reading Comprehension Need */}
 <div className="p-4 rounded-2xl bg-glitch-surface border border-white/10 space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <BookOpen className="w-4 h-4 text-blue-500" />
 <span className="text-xs font-bold text-white">
 Reading & Information Retention
 </span>
 </div>
 <span
 className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
 diagnostic.readingNeed === 'high'
 ? 'bg-rose-100 text-rose-700 '
 : diagnostic.readingNeed === 'moderate'
 ? 'bg-amber-100 text-amber-700 '
 : 'bg-emerald-100 text-emerald-700 '
 }`}
 >
 {diagnostic.readingNeed} Need
 </span>
 </div>
 <p className="text-[11px] text-neutral-400 leading-relaxed">
 {diagnostic.readingAdvice}
 </p>
 </div>

 {/* Writing & Structuring Need */}
 <div className="p-4 rounded-2xl bg-glitch-surface border border-white/10 space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <PenTool className="w-4 h-4 text-purple-500" />
 <span className="text-xs font-bold text-white">
 Writing & Formulation Structure
 </span>
 </div>
 <span
 className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
 diagnostic.writingNeed === 'high'
 ? 'bg-rose-100 text-rose-700 '
 : diagnostic.writingNeed === 'moderate'
 ? 'bg-amber-100 text-amber-700 '
 : 'bg-emerald-100 text-emerald-700 '
 }`}
 >
 {diagnostic.writingNeed} Need
 </span>
 </div>
 <p className="text-[11px] text-neutral-400 leading-relaxed">
 {diagnostic.writingAdvice}
 </p>
 </div>

 {/* Conceptual Reasoning Need */}
 <div className="p-4 rounded-2xl bg-glitch-surface border border-white/10 space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Brain className="w-4 h-4 text-emerald-500" />
 <span className="text-xs font-bold text-white">
 Conceptual Reasoning & Formulas
 </span>
 </div>
 <span
 className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
 diagnostic.conceptualNeed === 'high'
 ? 'bg-rose-100 text-rose-700 '
 : diagnostic.conceptualNeed === 'moderate'
 ? 'bg-amber-100 text-amber-700 '
 : 'bg-emerald-100 text-emerald-700 '
 }`}
 >
 {diagnostic.conceptualNeed} Need
 </span>
 </div>
 <p className="text-[11px] text-neutral-400 leading-relaxed">
 {diagnostic.conceptualAdvice}
 </p>
 </div>

 {/* Verbal Articulation Need */}
 <div className="p-4 rounded-2xl bg-glitch-surface border border-white/10 space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <MessageSquare className="w-4 h-4 text-amber-500" />
 <span className="text-xs font-bold text-white">
 Verbal Cadence & Terminology
 </span>
 </div>
 <span
 className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
 diagnostic.articulationNeed === 'high'
 ? 'bg-rose-100 text-rose-700 '
 : diagnostic.articulationNeed === 'moderate'
 ? 'bg-amber-100 text-amber-700 '
 : 'bg-emerald-100 text-emerald-700 '
 }`}
 >
 {diagnostic.articulationNeed} Need
 </span>
 </div>
 <p className="text-[11px] text-neutral-400 leading-relaxed">
 {diagnostic.articulationAdvice}
 </p>
 </div>
 </div>

 {/* Recommended Top Action Steps */}
 <div className="p-4 rounded-2xl bg-primary-50/60 border border-primary-200 space-y-2">
 <span className="text-xs font-bold text-primary flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5" />
 Recommended Action Plan for You:
 </span>
 <div className="space-y-1.5">
 {diagnostic.topActionSteps.map((step, sIdx) => (
 <div key={sIdx} className="text-xs text-white font-medium">
 {step}
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* --------------------------------------------------------- */}
 {/* MISTAKE ANALYSIS &"SAHI VERSION" (IDEAL ANSWER) */}
 {/* --------------------------------------------------------- */}
 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-white flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
 <span>Mistake Breakdown & Sahi Version (सही उत्तर और सुधार)</span>
 </h4>

 <div className="space-y-4">
 {evaluations.map((ev, eIdx) => (
 <div
 key={eIdx}
 className="p-5 rounded-2xl bg-glitch-panel border border-white/10 space-y-3.5 shadow-sm"
 >
 {/* Question Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
 <span className="text-xs font-bold text-white">
 Question {eIdx + 1}: {ev.questionText}
 </span>
 <span
 className={`text-xs font-black px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
 ev.scorePercentage >= 70
 ? 'bg-emerald-100 text-emerald-700 '
 : ev.scorePercentage >= 40
 ? 'bg-amber-100 text-amber-700 '
 : 'bg-rose-100 text-rose-700 '
 }`}
 >
 {ev.scorePercentage}% Score
 </span>
 </div>

 {/* What You Answered */}
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-neutral-400">
 What You Answered:
 </span>
 <div className="p-3 bg-glitch-surface rounded-xl border border-white/10 text-xs text-white">
 {ev.studentAnswer}
 </div>
 </div>

 {/* Feedback on Mistake */}
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-amber-600 flex items-center gap-1">
 <AlertTriangle className="w-3 h-3" />
 AI Analysis & What was Missing:
 </span>
 <p className="text-xs text-neutral-400">
 {ev.feedback}
 </p>
 </div>

 {/* Sahi Version (Ideal Answer) */}
 <div className="space-y-1 p-3.5 bg-glitch-surface rounded-xl border border-emerald-300">
 <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
 Sahi Version (सही उत्तर / Ideal Academic Answer):
 </span>
 <p className="text-xs font-semibold text-emerald-900 leading-relaxed mt-1">
 {ev.sahiVersion}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Action Bar */}
 <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
 <button
 type="button"
 onClick={() => setPhase('chapter_select')}
 className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10 hover:bg-slate-100 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span>Take Another Oral Viva</span>
 </button>

 <button
 type="button"
 onClick={onClose}
 className="w-full sm:w-auto px-7 py-2.5 bg-glitch-green hover:brightness-110 text-glitch-ink font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
 >
 <span>Return to Dashboard</span>
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};
