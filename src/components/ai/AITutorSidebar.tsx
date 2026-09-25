import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bot,
  X,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface AITutorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  subject?: string;
  actionHint?: string;
}

export const AITutorSidebar: React.FC<AITutorSidebarProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const { user } = useAuth();
  const currentClass = user?.class || 'Class 8';

  // 'sidebar' or 'fullscreen'
  const [viewMode, setViewMode] = useState<'sidebar' | 'fullscreen'>('sidebar');
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your 24/7 **Learno AI Academic Tutor** for **${currentClass}**.\n\nYou can ask me **anything**:\n- 📐 **Mathematics**: Step-by-step problem solving & geometry proofs\n- 🔬 **Science**: Physics formulas, Biology concepts & Chemistry reactions\n- 📖 **English**: Grammar rules, active/passive voice, direct/indirect speech\n- 🌍 **Social Science**: History timelines, Civics & Geography\n- 💻 **Computer / Coding**: Python loops, HTML/CSS & algorithms\n- 🇮🇳 **Hindi & Sanskrit**: व्याकरण, सन्धि, समास व शब्दरूप\n- 🗣️ **Communication**: Fluency, public speaking & polite phrasing\n- 🛡️ **Learno Platform**: How the 200 tests, proctoring & AI Viva work\n\nHow can I help you excel today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  // Cleanup speech synthesis on close
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      setIsAiSpeaking(false);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        setIsListening(false);
      }
    }
  }, [isOpen]);

  // Handle Speech-to-Text Input
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Speak AI text
  const speakText = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown for speech
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsAiSpeaking(false);
  };

  // Knowledge base generator for any question
  const generateAiTutorResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. Math Questions
    if (q.includes('pythagor') || q.includes('triangle') || q.includes('hypotenuse')) {
      return `### 📐 Pythagoras Theorem (Geometry & Trigonometry)

**Statement**: In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.

$$\\mathbf{a^2 + b^2 = c^2}$$
*(Where $c$ is the hypotenuse opposite the $90^\\circ$ angle, and $a, b$ are the adjacent sides)*

#### 📝 Step-by-Step Example:
If a right triangle has base $b = 3\\text{ cm}$ and perpendicular $a = 4\\text{ cm}$:
1. $c^2 = 3^2 + 4^2$
2. $c^2 = 9 + 16 = 25$
3. $c = \\sqrt{25} = 5\\text{ cm}$

#### 🌟 Real-Life Application:
Architects and carpenters use the **3-4-5 rule** to verify perfect $90^\\circ$ square corners when laying foundations or framing walls!`;
    }

    if (q.includes('linear equation') || q.includes('solve for x') || q.includes('2x + 5')) {
      return `### 📐 Solving Linear Equations Step-by-Step

Let's solve the equation: **$2x + 5 = 15$**

#### 📝 Steps:
1. **Isolate the variable term ($2x$)**:
   Subtract $5$ from both sides:
   $$2x + 5 - 5 = 15 - 5$$
   $$2x = 10$$
2. **Solve for $x$**:
   Divide both sides by the coefficient $2$:
   $$x = \\frac{10}{2} = 5$$

#### ✅ Verification:
Substitute $x = 5$ back into the original equation:
$$2(5) + 5 = 10 + 5 = 15 \\quad \\text{(LHS = RHS!)}$$

**Core Rule**: Whatever operation (addition, subtraction, multiplication, division) you do to one side of an equation, you must always do to the other side!`;
    }

    // 2. Science Questions
    if (q.includes('photosynthesis') || q.includes('plant') || q.includes('chlorophyll')) {
      return `### 🔬 Photosynthesis: The Plant Energy Engine

**Definition**: Photosynthesis is the biochemical process by which green plants synthesize glucose (food) from carbon dioxide and water in the presence of sunlight and chlorophyll.

#### ⚗️ Chemical Equation:
$$\\mathbf{6CO_2 + 6H_2O \\xrightarrow[Chlorophyll]{Sunlight} C_6H_{12}O_6 + 6O_2}$$

#### 🌿 Key Ingredients & Roles:
1. **Chlorophyll**: Green pigment located in the chloroplasts that absorbs solar photons.
2. **Carbon Dioxide ($CO_2$)**: Absorbed from the atmosphere through microscopic leaf pores called **stomata**.
3. **Water ($H_2O$)**: Absorbed from soil by roots through **xylem vessels**.
4. **Byproduct ($O_2$)**: Clean oxygen is released into the atmosphere for all aerobic life!`;
    }

    if (q.includes('cell') || q.includes('mitochondria') || q.includes('nucleus')) {
      return `### 🔬 Cell Biology: Plant Cells vs Animal Cells

The cell is the basic structural and functional unit of life.

#### 🆚 Key Differences:
| Feature | Plant Cell | Animal Cell |
|---|---|---|
| **Cell Wall** | Present (made of rigid cellulose) | Absent (only flexible cell membrane) |
| **Chloroplasts** | Present (performs photosynthesis) | Absent |
| **Vacuole** | One large central vacuole (90% volume) | Multiple small, temporary vacuoles |
| **Shape** | Fixed, rectangular/hexagonal | Irregular, rounded |

#### ⚡ Essential Organelles:
- **Mitochondria**: The *"Powerhouse of the Cell"* generating ATP energy.
- **Nucleus**: The *"Brain/Control Center"* storing DNA chromatin genetic material.
- **Ribosomes**: The cellular factories that synthesize proteins.`;
    }

    // 3. English Questions
    if (q.includes('active') || q.includes('passive') || q.includes('voice')) {
      return `### 📖 Active vs Passive Voice Rules

#### 🔹 Active Voice:
The subject **performs** the action.
> *Formula*: Subject + Verb + Object  
> *Example*: "Rohan wrote the research report."

#### 🔸 Passive Voice:
The action is **received** by the subject (emphasis on the object or action).
> *Formula*: Object + helping verb (to be) + Past Participle ($V_3$) + by + Subject  
> *Example*: "The research report was written by Rohan."

#### 🔑 Transformation Rules:
1. Present Simple: *writes* ➔ *is written*
2. Past Simple: *wrote* ➔ *was written*
3. Future Simple: *will write* ➔ *will be written*
4. Present Continuous: *is writing* ➔ *is being written*`;
    }

    // 4. Communication Questions
    if (q.includes('communication') || q.includes('disagree') || q.includes('prep') || q.includes('speak')) {
      return `### 🗣️ Professional Communication: How to Disagree Constructively

In academic and professional settings, disagreement should validate the other person's perspective before offering an alternative.

#### 🏆 The 3-Step "Validate - Pivot - Propose" Framework:
1. **Step 1: Validate**: Acknowledge their intention respectfully.
   > *"I appreciate that viewpoint, and I see why that approach makes sense..."*
2. **Step 2: Pivot**: Introduce another perspective with diplomatic transitions (avoid blunt words like 'No' or 'Wrong').
   > *"However, looking at the data from another angle..."*
3. **Step 3: Propose**: Suggest a concrete collaborative solution.
   > *"What if we combine both elements to test a pilot first?"*

#### 🎙️ Speaking Formula: The PREP Method:
- **P**oint: State your main thesis clearly.
- **R**eason: Give the rationale behind it.
- **E**xample: Provide a tangible illustration or fact.
- **P**oint: Reiterate your conclusion firmly.`;
    }

    // 5. Hindi & Sanskrit
    if (q.includes('sandhi') || q.includes('सन्धि') || q.includes('समास')) {
      return `### 🇮🇳 हिन्दी व्याकरण: सन्धि और समास में अन्तर

#### 1. सन्धि (वर्णों का मेल):
दो समीपवर्ती **वर्णों** (ध्वनियों) के परस्पर मेल से जो विकार या परिवर्तन उत्पन्न होता है, उसे सन्धि कहते हैं।
- *उदाहरण*: विद्या + आलय = **विद्यालय** (स्वर सन्धि)
- *प्रकार*: स्वर सन्धि, व्यञ्जन सन्धि, विसर्ग सन्धि।

#### 2. समास (शब्दों का संक्षेप):
दो या दो से अधिक **शब्दों** (पदों) को मिलाकर एक नया सार्थक संक्षिप्त शब्द बनाने की प्रक्रिया को समास कहते हैं।
- *उदाहरण*: राजा का पुत्र = **राजपुत्र** (तत्पुरुष समास)
- *प्रकार*: अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वन्द्व, बहुव्रीहि।

#### 💡 मुख्य अन्तर:
- सन्धि में **वर्णों** का योग होता है, जबकि समास में **पदों/शब्दों** का योग होता है।
- सन्धि को तोड़ना **'सन्धि-विच्छेद'** कहलाता है; समास को अलग करना **'समास-विग्रह'** कहलाता है।`;
    }

    if (q.includes('sanskrit') || q.includes('संस्कृत') || q.includes('धातुरूप') || q.includes('शब्दरूप')) {
      return `### 📜 संस्कृतम्: पठ् धातु (लट् लकार - वर्तमान काल)

संस्कृत भाषा में क्रियाओं के मूल रूप को **धातु** कहते हैं। 'पठ्' धातु का अर्थ है **'पढ़ना'**।

#### 📖 रूप सारणी (लट् लकार):
| पुरुष | एकवचनम् | द्विवचनम् | बहुवचनम् |
|---|---|---|---|
| **प्रथम पुरुष** (He/They) | पठति *(वह पढ़ता है)* | पठतः *(वे दोनों पढ़ते हैं)* | पठन्ति *(वे सब पढ़ते हैं)* |
| **मध्यम पुरुष** (You) | पठसि *(तुम पढ़ते हो)* | पठथः *(तुम दोनों पढ़ते हो)* | पठथ *(तुम सब पढ़ते हो)* |
| **उत्तम पुरुष** (I/We) | पठामि *(मैं पढ़ता हूँ)* | पठावः *(हम दोनों पढ़ते हैं)* | पठामः *(हम सब पढ़ते हैं)* |

#### 🌟 सरल अनुवाद:
- *सह पुस्तकं पठति।* (वह पुस्तक पढ़ता है।)
- *अहं विद्यालयं गच्छामि।* (मैं विद्यालय जाता हूँ।)`;
    }

    // 6. Computer / Coding Questions
    if (q.includes('python') || q.includes('code') || q.includes('loop') || q.includes('variable')) {
      return `### 💻 Computer Science: Python For Loop vs While Loop

In Python, loops allow us to repeat a block of code efficiently.

#### 1. For Loop (Definite Iteration):
Used when you know beforehand how many times you want to loop, or when iterating through a collection (list, string, range).
\`\`\`python
# Prints numbers 1 through 5
for i in range(1, 6):
    print(f"Count: {i}")
\`\`\`

#### 2. While Loop (Condition-Controlled Iteration):
Repeats as long as a Boolean condition remains \`True\`.
\`\`\`python
# Counts down until battery is depleted
battery = 3
while battery > 0:
    print(f"Device active, battery: {battery}")
    battery -= 1
print("Battery empty!")
\`\`\`

#### ⚠️ Pro Tip:
Always make sure the condition in a \`while\` loop eventually becomes \`False\`, otherwise it creates an **infinite loop** that can crash your program!`;
    }

    // 7. Learno Platform Questions
    if (q.includes('proctor') || q.includes('disqualif') || q.includes('violation')) {
      return `### 🛡️ Learno AI Proctoring Guard & Security Rules

Learno uses real-time computer vision and audio analysis to guarantee honest test performance:

#### 🚨 Monitored Anomalies:
1. **Head Turning**: Looking away from the screen for extended intervals.
2. **Leaving Frame**: Face moving completely out of camera view.
3. **Hand Raising / Gestures**: High hand movements or foreign device manipulation.
4. **Noise Detection**: Loud ambient speech or voices in the room.

#### 🔒 24-Hour Disqualification Lock:
If a student accumulates 3 critical violations in a proctored exam:
- The exam terminates immediately.
- The student is **disqualified** and locked from retaking that exam for **24 hours**.
- The disqualification screen displays an exact eligibility timer and a convenient *"Back to Home"* button!`;
    }

    if (q.includes('viva') || q.includes('mujhe nahi aata') || q.includes('oral')) {
      return `### 🎙️ Learno AI Viva Hub & "Mujhe Nahi Aata" Feature

The **AI Viva Hub** is an interactive verbal examiner on your Dashboard:

#### 🌟 Highlights:
1. **3 Tiers**: Easy (10 chapters), Intermediate (20 chapters), Hard (40 chapters).
2. **💡 "Mujhe Nahi Aata — AI Samjha Do"**:
   - If you don't know the answer, click the button or say *"mujhe nahi aata"*!
   - The AI teacher stops the countdown, speaks an encouraging voice explanation, displays the **Sahi Version (Ideal Answer)**, and lets you re-attempt or move to the next question with partial credit!
3. **Full Professional English**:
   - In Communication viva, the AI speaks in executive English and gives a 100% diagnostic with **Spoken Fluency Score** and **Professional Tone Score**.`;
    }

    if (q.includes('200') || q.includes('tests') || q.includes('chapter')) {
      return `### 📋 200 Problems Curriculum Directory

In Learno, every class (Classes 5 to 9) has **200 distinct problem tests** numbered from **#001 to #200**:
- **8 Subjects**: Mathematics, Science, English, Social Science, Computer, Hindi, Sanskrit, and Communication.
- **List View & Grid View**: Switch between the comprehensive 200-problem directory table or subject card grid.
- **Concept Tags**: Every test is tagged with syllabus concepts (e.g. \`#Algebra\`, \`#Photosynthesis\`).
- **5-Option Engine**: Every test features standard competitive 5 choices (A, B, C, D, E) with instant accuracy analytics!`;
    }

    // Default academic response
    return `### 🎓 Academic Solution for ${currentClass}

Regarding your query: **"${query}"**

#### 💡 Core Concept:
In **${currentClass}**, this topic focuses on foundational understanding and practical application across the CBSE & NCERT curriculum.

#### 📝 Step-by-Step Breakdown:
1. **Identify the Core Principle**: Always clarify the governing law, formula, or grammar rule first.
2. **Apply the Rule**: Break the problem down into structured sub-steps rather than guessing.
3. **Verify the Result**: Double-check units, spelling, or mathematical constraints.

#### 🌟 Practice Tip:
Would you like me to generate a 5-option practice MCQ on this concept, or break down a specific formula for you? Feel free to ask!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const responseText = generateAiTutorResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);

      if (isVoiceEnabled) {
        speakText(responseText);
      }
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Chat cleared! Ask me any doubt in Mathematics, Science, English, SST, Computer, Hindi, Sanskrit, Communication, or how to use Learno!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const suggestionChips = [
    '📐 Solve 2x + 5 = 15 step-by-step',
    '🔬 Explain Photosynthesis chemical equation',
    '🗣️ How to disagree politely in English?',
    '💻 Python for-loop vs while-loop',
    '🇮🇳 सन्धि और समास में क्या अंतर है?',
    '📜 संस्कृत: पठ् धातु रूप लट् लकार',
    '🛡️ How does AI Proctoring detect violations?',
    '🎙️ What is "Mujhe Nahi Aata" in AI Viva?',
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (Active in sidebar mode on mobile or when clicked) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          viewMode === 'fullscreen' ? 'hidden' : 'block'
        }`}
      />

      {/* Main Drawer / Fullscreen Panel */}
      <div
        className={`fixed z-50 bg-white dark:bg-slate-900 border-l border-border dark:border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ease-out ${
          viewMode === 'fullscreen'
            ? 'inset-0 w-full h-full'
            : 'top-0 right-0 bottom-0 w-full sm:w-[480px] md:w-[520px] lg:w-[560px]'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-primary text-white flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                  Learno AI Tutor
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  {currentClass} 24/7
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Academic Doubts & Guide</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
            </div>
          </div>

          {/* Action buttons: Speech, View Mode, Close */}
          <div className="flex items-center gap-1.5">
            {/* Audio Readout Toggle */}
            <button
              onClick={() => {
                if (isAiSpeaking) stopSpeaking();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`p-2 rounded-xl transition-colors border ${
                isVoiceEnabled
                  ? 'bg-white/20 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}
              title={isVoiceEnabled ? 'AI Voice Enabled (Click to Mute)' : 'AI Voice Muted (Click to Enable)'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Adjustable View Mode: Sidebar <-> Fullscreen */}
            <button
              onClick={() => setViewMode(viewMode === 'sidebar' ? 'fullscreen' : 'sidebar')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
              title={viewMode === 'sidebar' ? 'Expand to Full Page Mode' : 'Collapse to Sidebar'}
            >
              {viewMode === 'sidebar' ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>

            {/* Clear History */}
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
              title="Clear chat history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/80 border border-white/20 text-white transition-colors"
              title="Close AI Tutor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips Banner */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-border dark:border-slate-800 flex items-center gap-2 overflow-x-auto flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary dark:text-primary-light flex-shrink-0" />
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-text-secondary dark:text-slate-400 whitespace-nowrap">
            Quick Topics:
          </span>
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/60 hover:text-primary dark:hover:text-primary-light text-text-secondary dark:text-slate-300 text-[11px] font-medium border border-border dark:border-slate-700 whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Messages Container with isolated scroll */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-[#0B0F19]"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white font-medium rounded-tr-sm'
                    : 'bg-white dark:bg-slate-850 text-text-primary dark:text-slate-200 border border-border dark:border-slate-800 rounded-tl-sm'
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Footer bar for AI responses */}
                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Read answer aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-3 justify-start animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-850 rounded-2xl p-4 border border-border dark:border-slate-800 rounded-tl-sm shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="text-xs text-text-secondary dark:text-slate-400 font-medium pl-1">
                  AI Tutor is analyzing your question...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800 flex-shrink-0 space-y-2">
          {/* Active Speaking Status Bar */}
          {isAiSpeaking && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs border border-indigo-200 dark:border-indigo-800">
              <span className="flex items-center gap-1.5 font-bold">
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                AI Tutor is speaking aloud...
              </span>
              <button
                onClick={stopSpeaking}
                className="text-[11px] font-bold text-rose-500 hover:underline"
              >
                Stop Audio
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-border dark:border-slate-700'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Ask question by voice (Mic)'}
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask any doubt in ${currentClass} Maths, Science, English, SST, Hindi...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Powered by Learno Curriculum AI • Strict Classes 5 to 9 Alignment</span>
            <span>Mode: {viewMode === 'fullscreen' ? 'Full Page' : 'Sidebar'}</span>
          </div>
        </div>
      </div>
    </>
  );
};
