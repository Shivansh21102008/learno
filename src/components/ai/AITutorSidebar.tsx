import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Zap,
  Globe,
  Radio,
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
  isJarvis?: boolean;
}

export const AITutorSidebar: React.FC<AITutorSidebarProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const { user } = useAuth();
  const currentClass = user?.class || 'Class 8';

  // Modes: 'normal' (academic chat tutor) or 'jarvis' (continuous voice cyber assistant)
  const [aiMode, setAiMode] = useState<'normal' | 'jarvis'>('normal');

  // Languages for Voice / Mic: 'hi-IN' (Hindi) or 'en-IN' (English)
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');

  // 'sidebar' or 'fullscreen'
  const [viewMode, setViewMode] = useState<'sidebar' | 'fullscreen'>('sidebar');
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isJarvisContinuous, setIsJarvisContinuous] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // API Key & Model Configuration
  const rawKey = (import.meta as any).env?.VITE_AI_TUTOR_API_KEY || localStorage.getItem('learno_ai_tutor_api_key') || '';
  const apiKey = typeof rawKey === 'string' ? rawKey.trim().replace(/^["']|["']$/g, '') : '';
  const rawModel = (import.meta as any).env?.VITE_AI_TUTOR_MODEL || localStorage.getItem('learno_ai_tutor_model') || 'openai/gpt-oss-120b';
  const apiModel = typeof rawModel === 'string' ? rawModel.trim() : 'openai/gpt-oss-120b';
  const rawEndpoint = (import.meta as any).env?.VITE_AI_TUTOR_ENDPOINT || localStorage.getItem('learno_ai_tutor_api_endpoint') || '';
  const apiEndpoint = rawEndpoint.trim() || (apiKey.startsWith('gsk_') ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your 24/7 **Learno AI Academic Tutor & JARVIS Rig** for **${currentClass}**.\n\n🌐 **Bilingual Voice Active**: Speak in **Hindi (हिन्दी)** or **English** using the mic!\n\nSwitch anytime between:\n- 🤖 **NORMAL MODE**: Structured step-by-step syllabus explanations\n- ⚡ **JARVIS MODE**: Hands-free voice conversational assistant with auto-speech\n\nHow can I help you excel today?`,
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

  // Cleanup speech synthesis and mic on close
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      setIsAiSpeaking(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        setIsListening(false);
      }
    }
  }, [isOpen]);

  // Find appropriate TTS voice for language
  const getPreferredVoice = useCallback((isHindi: boolean): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (isHindi) {
      // Look for Hindi voice
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('lekha') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('hemant')
      );
      if (hindiVoice) return hindiVoice;
    }

    // Default to Indian English or UK/US English voice
    const englishVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('en-in') ||
        v.lang.toLowerCase().startsWith('en-gb') ||
        v.lang.toLowerCase().startsWith('en-us')
    );
    return englishVoice || voices[0] || null;
  }, []);

  // Speak AI text
  const speakText = useCallback(
    (text: string) => {
      if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      // Clean markdown and math symbols for smooth speech
      const cleanText = text
        .replace(/[*#_`$]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\\mathbf\{([^}]+)\}/g, '$1')
        .replace(/\\xrightarrow\[.*?\]\{.*?\}/g, 'gives')
        .replace(/\n+/g, '. ');

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Detect if text contains Devanagari Hindi characters
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      const isHindi = hasDevanagari || voiceLang === 'hi-IN';

      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      const voice = getPreferredVoice(isHindi);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => {
        setIsAiSpeaking(false);
        // In Jarvis mode, if continuous listening is on, automatically resume listening!
        if (aiMode === 'jarvis' && isJarvisContinuous && isOpen) {
          setTimeout(() => {
            startListening();
          }, 450);
        }
      };
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isVoiceEnabled, voiceLang, getPreferredVoice, aiMode, isJarvisContinuous, isOpen]
  );

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsAiSpeaking(false);
  };

  // Start speech recognition
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Stop speaking if currently speaking
    stopSpeaking();

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      // Set to currently selected language (hi-IN for Hindi, en-IN for English)
      recognition.lang = voiceLang;
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          // If in Jarvis mode, automatically send the recognized question
          if (aiMode === 'jarvis') {
            handleSendMessage(transcript);
          } else {
            setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition event:', event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Speech recognition initiation error:', err);
      setIsListening(false);
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      startListening();
    }
  };

  // Switch voice language
  const handleToggleLanguage = () => {
    const nextLang = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
    setVoiceLang(nextLang);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  };

  // Comprehensive Knowledge base generator supporting both Hindi and English
  const generateAiTutorResponse = (query: string): string => {
    const q = query.toLowerCase().trim();
    const hasDevanagari = /[\u0900-\u097F]/.test(query);

    // 0. Quick arithmetic calculation (e.g. 4 + 4, 15 * 6)
    const arithmeticMatch = q.match(/^(\d+(?:\.\d+)?)\s*([\+\-\*\/x×÷])\s*(\d+(?:\.\d+)?)$/);
    if (arithmeticMatch) {
      const num1 = parseFloat(arithmeticMatch[1]);
      const op = arithmeticMatch[2];
      const num2 = parseFloat(arithmeticMatch[3]);
      let result = 0;
      if (op === '+') result = num1 + num2;
      else if (op === '-') result = num1 - num2;
      else if (op === '*' || op === 'x' || op === '×') result = num1 * num2;
      else if (op === '/' || op === '÷') result = num2 !== 0 ? num1 / num2 : 0;

      if (aiMode === 'jarvis') {
        return voiceLang === 'hi-IN' || hasDevanagari
          ? `सर, ${num1} और ${num2} का परिणाम ${result} है। क्या कोई अन्य गणना करनी है?`
          : `Sir, ${num1} ${op} ${num2} is equal to ${result}. Shall I compute anything else?`;
      }
      return `**${num1} ${op} ${num2} = ${result}**\n\nNeed help with any other calculations, equations, or chapter doubts?`;
    }

    // 0.1 Friendly greetings in Hindi / English
    if (['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'प्रणाम', 'kaise ho', 'kya haal hai'].some(g => q.includes(g))) {
      if (voiceLang === 'hi-IN' || hasDevanagari) {
        return `नमस्ते ${user?.name || 'विद्यार्थी'}! 🙏 मैं आपका 24/7 **Learno AI Academic Tutor** हूँ।\n\nआप मुझसे गणित, विज्ञान, हिंदी व्याकरण, संस्कृत, अंग्रेजी, सामाजिक विज्ञान या कंप्यूटर का कोई भी प्रश्न पूछ सकते हैं। आप आज क्या पढ़ना चाहते हैं?`;
      }
      return `Hello ${user?.name || 'there'}! 👋 I am your 24/7 **Learno AI Academic Tutor** for **${currentClass}**.\n\nYou can ask me doubts in Mathematics, Science, English, SST, Computer, or Learno platform features!`;
    }

    // 1. Photosynthesis in Hindi / English
    if (q.includes('प्रकाश संश्लेषण') || q.includes('photosynthesis')) {
      if (voiceLang === 'hi-IN' || hasDevanagari || q.includes('hindi')) {
        return `### 🔬 प्रकाश संश्लेषण (Photosynthesis)
        
**परिभाषा**: हरे पौधे सूर्य के प्रकाश तथा पर्णहरिम (क्लोरोफिल) की उपस्थिति में कार्बन डाइऑक्साइड ($CO_2$) और जल ($H_2O$) की सहायता से ग्लूकोज (कार्बोहाइड्रेट) बनाते हैं और ऑक्सीजन गैस मुक्त करते हैं।

#### ⚗️ रासायनिक समीकरण:
$$\\mathbf{6CO_2 + 6H_2O \\xrightarrow[क्लोरोफिल]{सूर्य\\,का\\,प्रकाश} C_6H_{12}O_6 + 6O_2}$$

#### 🌿 मुख्य घटक:
1. **क्लोरोफिल**: पत्तियों के क्लोरोप्लास्ट में उपस्थित हरा वर्णक जो सौर ऊर्जा अवशोषित करता है।
2. **कार्बन डाइऑक्साइड ($CO_2$)**: पत्तियों के सूक्ष्म छिद्रों (रंध्र / रंध्र-द्वारों) द्वारा वायुमंडल से ग्रहण की जाती है।
3. **जल ($H_2O$)**: जड़ों द्वारा जाइलम ऊतक से अवशोषित होकर पत्तियों तक पहुँचता है।
4. **ऑक्सीजन ($O_2$)**: उप-उत्पाद के रूप में वायुमंडल में छोड़ी जाती है, जिससे सभी जीव श्वसन करते हैं!`;
      }

      return `### 🔬 Photosynthesis: The Plant Energy Engine

**Definition**: Photosynthesis is the biochemical process by which green plants synthesize glucose from carbon dioxide and water using sunlight and chlorophyll.

#### ⚗️ Chemical Equation:
$$\\mathbf{6CO_2 + 6H_2O \\xrightarrow[Chlorophyll]{Sunlight} C_6H_{12}O_6 + 6O_2}$$

1. **Chlorophyll**: Green pigment in chloroplasts absorbing solar photons.
2. **CO₂**: Absorbed via microscopic stomata pores.
3. **Water**: Absorbed by roots via xylem vessels.
4. **Oxygen**: Released into the atmosphere for aerobic respiration!`;
    }

    // 2. Sandhi and Samas in Hindi
    if (q.includes('sandhi') || q.includes('सन्धि') || q.includes('समास') || q.includes('samas')) {
      return `### 🇮🇳 हिन्दी व्याकरण: सन्धि और समास में अन्तर

#### 1. सन्धि (वर्णों का मेल):
दो समीपवर्ती **वर्णों** (ध्वनियों) के परस्पर मेल से जो विकार उत्पन्न होता है, उसे सन्धि कहते हैं।
- *उदाहरण*: विद्या + आलय = **विद्यालय** (दीर्घ स्वर सन्धि)
- *प्रकार*: स्वर सन्धि, व्यञ्जन सन्धि, विसर्ग सन्धि।

#### 2. समास (शब्दों का संक्षेप):
दो या दो से अधिक **शब्दों** (पदों) को मिलाकर एक नया सार्थक संक्षिप्त पद बनाने की प्रक्रिया को समास कहते हैं।
- *उदाहरण*: राजा का पुत्र = **राजपुत्र** (तत्पुरुष समास)
- *प्रकार*: अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वन्द्व, बहुव्रीहि।

#### 💡 मुख्य अन्तर:
- सन्धि में **वर्णों** का योग होता है, जबकि समास में **पदों** का योग होता है।
- सन्धि को तोड़ना **'सन्धि-विच्छेद'** कहलाता है; समास को अलग करना **'समास-विग्रह'** कहलाता है।`;
    }

    // 3. Pythagoras Theorem in Hindi / English
    if (q.includes('pythagor') || q.includes('पायथागोरस') || q.includes('कर्ण')) {
      if (voiceLang === 'hi-IN' || hasDevanagari || q.includes('hindi')) {
        return `### 📐 पायथागोरस प्रमेय (Pythagoras Theorem)

**कथन**: किसी समकोण त्रिभुज में, कर्ण का वर्ग शेष दोनों भुजाओं (आधार और लम्ब) के वर्गों के योग के बराबर होता है।

$$\\mathbf{कर्ण^2 = आधार^2 + लम्ब^2} \\quad (c^2 = a^2 + b^2)$$

#### 📝 उदाहरण:
यदि आधार $b = 3\\text{ सेमी}$ और लम्ब $a = 4\\text{ सेमी}$ है:
1. $c^2 = 3^2 + 4^2 = 9 + 16 = 25$
2. $c = \\sqrt{25} = 5\\text{ सेमी}$ (कर्ण की लम्बाई 5 सेमी होगी)।`;
      }

      return `### 📐 Pythagoras Theorem (Geometry)

In any right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the adjacent two sides:
$$\\mathbf{a^2 + b^2 = c^2}$$

For base $3\\text{ cm}$ and height $4\\text{ cm}$:
$c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5\\text{ cm}$.`;
    }

    // 4. Sanskrit Dhaturoop
    if (q.includes('sanskrit') || q.includes('संस्कृत') || q.includes('धातुरूप') || q.includes('पठ् धातु')) {
      return `### 📜 संस्कृतम्: पठ् धातु (लट् लकार - वर्तमान काल)

संस्कृत में क्रिया के मूल रूप को **धातु** कहते हैं। 'पठ्' धातु का अर्थ है **'पढ़ना'**।

#### 📖 रूप सारणी (लट् लकार):
| पुरुष | एकवचनम् | द्विवचनम् | बहुवचनम् |
|---|---|---|---|
| **प्रथम पुरुष** (He/They) | पठति *(वह पढ़ता है)* | पठतः *(वे दोनों पढ़ते हैं)* | पठन्ति *(वे सब पढ़ते हैं)* |
| **मध्यम पुरुष** (You) | पठसि *(तुम पढ़ते हो)* | पठथः *(तुम दोनों पढ़ते हो)* | पठथ *(तुम सब पढ़ते हो)* |
| **उत्तम पुरुष** (I/We) | पठामि *(मैं पढ़ता हूँ)* | पठावः *(हम दोनों पढ़ते हैं)* | पठामः *(हम सब पढ़ते हैं)* |`;
    }

    // 5. Python / Coding
    if (q.includes('python') || q.includes('code') || q.includes('loop')) {
      return `### 💻 Computer Science: Python For Loop vs While Loop

1. **For Loop**: Used for iterating over a sequence (list, range, string):
\`\`\`python
for i in range(1, 6):
    print(f"Number: {i}")
\`\`\`

2. **While Loop**: Runs as long as a condition is True:
\`\`\`python
count = 3
while count > 0:
    print(count)
    count -= 1
\`\`\``;
    }

    // Jarvis persona responses
    if (aiMode === 'jarvis') {
      if (voiceLang === 'hi-IN' || hasDevanagari) {
        return `जी हाँ, ${user?.name || 'सर'}। आपके प्रश्न "${query}" पर अध्ययन के अनुसार, ${currentClass} पाठ्यक्रम का मुख्य सिद्धांत यह है कि आप पहले मूल अवधारणा को समझें, फिर चरणबद्ध तरीके से अभ्यास करें। क्या आप इस पर अभ्यास प्रश्न चाहते हैं?`;
      }
      return `Sir, regarding "${query}": In ${currentClass} curriculum, the key objective is conceptual clarity followed by step-by-step problem verification. Would you like me to formulate a 5-option practice problem on this topic?`;
    }

    // Default Academic Response
    return `### 🎓 Academic Solution for ${currentClass}

Regarding your query: **"${query}"**

#### 💡 Core Concept:
In **${currentClass}**, this topic focuses on foundational understanding and practical application across the CBSE & NCERT curriculum.

#### 📝 Step-by-Step Breakdown:
1. **Identify the Core Principle**: Always clarify the governing law, formula, or grammar rule first.
2. **Apply the Rule**: Break the problem down into structured sub-steps rather than guessing.
3. **Verify the Result**: Double-check units, spelling, or mathematical constraints.

Feel free to ask for a practice problem or formula derivation!`;
  };

  const handleSendMessage = async (textToSend?: string) => {
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

    // Call live API if key is available
    if (apiKey) {
      try {
        const recentHistory = messages.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

        const endpoint = apiEndpoint || 'https://api.groq.com/openai/v1/chat/completions';

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        };
        if (endpoint.includes('openrouter.ai')) {
          headers['HTTP-Referer'] = window.location.origin;
          headers['X-Title'] = 'Learno AI Tutor';
        }

        const systemPrompt =
          aiMode === 'jarvis'
            ? `You are JARVIS, an advanced, highly intelligent voice AI assistant and academic copilot for ${currentClass} students following the CBSE/NCERT syllabus.
Answer concisely, directly, and conversationally in 2 to 4 crisp sentences so it sounds natural when spoken aloud.
If the student asks in Hindi, answer fluently in polite, clear Hindi.
Never use lengthy markdown bulleted textbook essays in Jarvis mode.`
            : `You are Learno's AI Academic Tutor for ${currentClass} students following the CBSE/NCERT curriculum.
Provide clear, structured explanations with formulas and examples.
If the user asks in Hindi, provide a high-quality Hindi explanation.
For simple arithmetic (e.g. 4 + 4), answer directly in one line.`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: apiModel || 'openai/gpt-oss-120b',
            messages: [
              { role: 'system', content: systemPrompt },
              ...recentHistory,
              { role: 'user', content: text },
            ],
            temperature: 0.7,
            max_tokens: aiMode === 'jarvis' ? 400 : 1200,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `API status code ${res.status}`);
        }

        const data = await res.json();
        const responseText =
          data.choices?.[0]?.message?.content || 'I could not generate an answer at this moment.';

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isJarvis: aiMode === 'jarvis',
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsThinking(false);

        if (isVoiceEnabled) {
          speakText(responseText);
        }
        return;
      } catch (err: any) {
        console.warn('API call failed, using local academic engine:', err);
      }
    }

    // Default fast local academic engine
    setTimeout(() => {
      const responseText = generateAiTutorResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isJarvis: aiMode === 'jarvis',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);

      if (isVoiceEnabled) {
        speakText(responseText);
      }
    }, 450);
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
        text: `Chat cleared! Ask me any doubt in Mathematics, Science, English, SST, Computer, Hindi, Sanskrit, or Communication in English or Hindi!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const suggestionChips =
    voiceLang === 'hi-IN'
      ? [
          '🔬 प्रकाश संश्लेषण का रासायनिक समीकरण समझाइए',
          '🇮🇳 सन्धि और समास में क्या अंतर है?',
          '📐 पायथागोरस प्रमेय और उदाहरण',
          '📜 संस्कृत: पठ् धातु रूप लट् लकार',
          '💻 Python में for loop और while loop',
          '⚡ 2x + 5 = 15 को हल करें',
        ]
      : [
          '📐 Solve 2x + 5 = 15 step-by-step',
          '🔬 Explain Photosynthesis equation',
          '🗣️ How to disagree politely in English?',
          '💻 Python for-loop vs while-loop',
          '📜 Sanskrit: पठ् धातु रूप लट् लकार',
          '🎯 How does Learno 200 Tests work?',
        ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          viewMode === 'fullscreen' ? 'hidden' : 'block'
        }`}
      />

      {/* Main Drawer / Fullscreen Panel */}
      <div
        className={`fixed z-50 bg-[#050505] border-l border-white/10 shadow-2xl flex flex-col transition-all duration-300 ease-out font-sans ${
          viewMode === 'fullscreen'
            ? 'inset-0 w-full h-full'
            : 'top-0 right-0 bottom-0 w-full sm:w-[500px] md:w-[540px] lg:w-[580px]'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-[#0A0D14] border-b border-white/10 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                aiMode === 'jarvis'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 shadow-[0_0_15px_rgba(0,255,102,0.2)]'
              }`}
            >
              {aiMode === 'jarvis' ? <Zap className="w-5 h-5 animate-pulse" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`font-mono text-[10px] font-black uppercase tracking-[0.18em] truncate ${
                    aiMode === 'jarvis' ? 'text-cyan-400' : 'text-[#00FF66]'
                  }`}
                >
                  {aiMode === 'jarvis' ? 'JARVIS // VOICE AI RIG' : 'LEARNO // NEURAL COPILOT'}
                </span>
                <span className="font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 text-[9px] font-bold uppercase flex-shrink-0">
                  {currentClass}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-display font-bold text-white flex items-center gap-1.5 truncate mt-0.5">
                <span>{aiMode === 'jarvis' ? 'Jarvis Conversational AI' : 'Academic Intelligence Rig'}</span>
                <span
                  className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${
                    aiMode === 'jarvis'
                      ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                      : 'bg-[#00FF66] shadow-[0_0_8px_#00FF66]'
                  }`}
                />
              </h3>
            </div>
          </div>

          {/* Action buttons: Mode Switcher, Language Toggle, Audio, Expand, Close */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 font-mono">
            {/* Language Switcher Pill: HI (Hindi) vs EN (English) */}
            <button
              onClick={handleToggleLanguage}
              className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                voiceLang === 'hi-IN'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              }`}
              title={`Active Voice & Mic Language: ${voiceLang === 'hi-IN' ? 'Hindi (हिन्दी)' : 'English'}. Click to toggle.`}
            >
              <Globe className="w-3 h-3" />
              <span>{voiceLang === 'hi-IN' ? '🇮🇳 HI' : '🇬🇧 EN'}</span>
            </button>

            {/* Audio Readout Toggle */}
            <button
              onClick={() => {
                if (isAiSpeaking) stopSpeaking();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`p-1.5 sm:p-2 rounded-lg transition-all border ${
                isVoiceEnabled
                  ? 'bg-[#00FF66]/10 border-[#00FF66]/40 text-[#00FF66]'
                  : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
              title={isVoiceEnabled ? 'AI Voice Enabled (Click to Mute)' : 'AI Voice Muted (Click to Enable)'}
            >
              {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* View Mode: Sidebar <-> Fullscreen */}
            <button
              onClick={() => setViewMode(viewMode === 'sidebar' ? 'fullscreen' : 'sidebar')}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
              title={viewMode === 'sidebar' ? 'Expand to Full Page Mode' : 'Collapse to Sidebar'}
            >
              {viewMode === 'sidebar' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Clear History */}
            <button
              onClick={handleClearHistory}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
              title="Clear chat history"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 text-neutral-400 transition-colors"
              title="Close AI Tutor"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Strip: NORMAL vs JARVIS */}
        <div className="px-4 py-2 bg-[#080B11] border-b border-white/10 flex items-center justify-between font-mono text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              OPERATING MODE:
            </span>
            <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setAiMode('normal')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  aiMode === 'normal'
                    ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Bot className="w-3 h-3" />
                <span>NORMAL</span>
              </button>
              <button
                type="button"
                onClick={() => setAiMode('jarvis')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  aiMode === 'jarvis'
                    ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'text-neutral-400 hover:text-cyan-300'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>⚡ JARVIS</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
            <span>MIC: {voiceLang === 'hi-IN' ? 'HINDI (हिन्दी)' : 'ENGLISH'}</span>
          </div>
        </div>

        {/* Suggestion Chips Banner */}
        <div className="px-4 py-2 bg-[#080B11] border-b border-white/10 flex items-center gap-2 overflow-x-auto flex-shrink-0 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#00FF66] flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
            TOPICS:
          </span>
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#00FF66]/10 hover:border-[#00FF66]/40 text-neutral-300 hover:text-[#00FF66] text-[10px] font-medium border border-white/10 whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* JARVIS MODE ACTIVE HERO PANEL (When Jarvis Mode is Selected) */}
        {aiMode === 'jarvis' && (
          <div className="p-4 sm:p-5 bg-cyan-950/20 border-b border-cyan-500/20 flex flex-col items-center justify-center text-center font-mono flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

            {/* Glowing Cyber Visualizer Core */}
            <div className="relative mb-3 flex items-center justify-center">
              <div
                className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse scale-110'
                    : isAiSpeaking
                    ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-spin'
                    : 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400'
                      : isAiSpeaking
                      ? 'bg-cyan-500/30 text-cyan-300'
                      : 'bg-cyan-950/40 text-cyan-400'
                  }`}
                >
                  <Zap className={`w-7 h-7 ${isListening || isAiSpeaking ? 'animate-bounce' : ''}`} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">
                {isListening
                  ? `[ LISTENING IN ${voiceLang === 'hi-IN' ? 'HINDI (हिन्दी)' : 'ENGLISH'}... ]`
                  : isAiSpeaking
                  ? '[ JARVIS IS SPEAKING... ]'
                  : isThinking
                  ? '[ NEURAL ENGINE PROCESSING... ]'
                  : '[ JARVIS READY // TAP MIC TO TALK ]'}
              </span>
              <p className="text-[11px] text-neutral-400 max-w-sm">
                Hands-free conversational tutor. Speak in <strong>Hindi</strong> or <strong>English</strong>. Jarvis answers and speaks back automatically!
              </p>
            </div>

            {/* Quick Action in Jarvis HUD */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'STOP LISTENING' : 'TALK TO JARVIS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsJarvisContinuous(!isJarvisContinuous)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isJarvisContinuous
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
                title="Continuous conversation automatically re-arms mic after speaking"
              >
                <Radio className={`w-3.5 h-3.5 ${isJarvisContinuous ? 'animate-pulse text-cyan-400' : ''}`} />
                <span>{isJarvisContinuous ? 'AUTO-LOOP: ON' : 'AUTO-LOOP: OFF'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Speech Error Banner if any */}
        {speechError && (
          <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 font-mono text-xs flex items-center justify-between">
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="text-white hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Chat Messages Container with isolated scroll */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#050505] bg-grid"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                    msg.isJarvis
                      ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400'
                      : 'bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]'
                  }`}
                >
                  {msg.isJarvis ? <Zap className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#00FF66]/15 border border-[#00FF66]/40 text-slate-900 dark:text-white font-medium rounded-tr-sm shadow-[0_0_15px_rgba(0,255,102,0.1)]'
                    : 'bg-white dark:bg-[#0A0D14]/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-card'
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
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span>{msg.timestamp}</span>
                      {msg.isJarvis && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 font-bold text-[9px]">
                          ⚡ JARVIS
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#00FF66]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                  aiMode === 'jarvis'
                    ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400'
                    : 'bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]'
                }`}
              >
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-[#0A0D14] rounded-2xl p-4 border border-slate-200 dark:border-white/10 rounded-tl-sm shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-bounce" />
                <span className="font-mono text-xs text-slate-800 dark:text-[#00FF66] font-bold pl-1">
                  {aiMode === 'jarvis' ? 'JARVIS EVALUATING VOICE TELEMETRY...' : 'COGNITIVE ENGINE EVALUATING PROMPT...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0A0D14] border-t border-white/10 flex-shrink-0 space-y-2">
          {/* Active Speaking Status Bar */}
          {isAiSpeaking && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#00FF66]/10 text-[#00FF66] text-xs border border-[#00FF66]/30 font-mono">
              <span className="flex items-center gap-1.5 font-bold">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>{aiMode === 'jarvis' ? 'JARVIS SPEAKING...' : 'NEURAL SYNTHESIZER SPEAKING...'}</span>
              </span>
              <button
                onClick={stopSpeaking}
                className="text-[10px] font-bold text-rose-400 hover:underline uppercase"
              >
                [ STOP AUDIO ]
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
            {/* Bilingual Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
              }`}
              title={`Ask by Voice (${voiceLang === 'hi-IN' ? 'Hindi / हिन्दी' : 'English'}). Click to speak.`}
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce text-white" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                voiceLang === 'hi-IN'
                  ? `हिंदी या अंग्रेजी में पूछें (Maths, Science, Hindi, English)...`
                  : `Ask doubt in ${currentClass} Maths, Science, English, SST, Hindi...`
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#050505] border border-white/15 text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] transition-all font-mono"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center ${
                aiMode === 'jarvis'
                  ? 'bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'bg-[#00FF66] hover:bg-[#00FF66]/90 disabled:opacity-40 text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]'
              }`}
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 dark:text-slate-400 px-1">
            <span>LEARNO // RIG ARCHITECTURE 5–9</span>
            <span>
              MODE: {aiMode === 'jarvis' ? 'JARVIS VOICE' : 'NORMAL'} • LANG: {voiceLang === 'hi-IN' ? 'HINDI' : 'ENGLISH'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
