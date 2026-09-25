import { StudentClass, AIVivaMode, AIVivaQuestion, AIVivaAnswerEvaluation, SkillDiagnostic } from '../types';
import { CLASS_CHAPTERS } from './classChapters';

/**
 * Returns the exact list of chapters for each AI Viva difficulty mode:
 * - Easy: Exactly 10 curated foundational chapters
 * - Intermediate: Exactly 20 curated application-focused chapters
 * - Hard: Exactly 40 curated advanced mastery chapters
 */
export function getAIVivaChapters(studentClass: StudentClass, mode: AIVivaMode): string[] {
  const allSubjects = CLASS_CHAPTERS[studentClass];
  if (!allSubjects) return [];

  // Gather all 200 chapters for this class in subject order
  const allChaptersList: { subject: string; chapter: string }[] = [];
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

  for (const subj of subjectOrder) {
    const list = allSubjects[subj] || [];
    list.forEach((ch) => {
      allChaptersList.push({ subject: subj, chapter: ch });
    });
  }

  if (mode === 'easy') {
    // 10 foundational chapters across core subjects
    // 2 Math, 2 Science, 2 English, 1 Social Science, 1 Computer, 1 Hindi, 1 Sanskrit
    return [
      allChaptersList[0]?.chapter || 'Basic Numbers & Operations',
      allChaptersList[6]?.chapter || 'Elementary Fractions',
      allChaptersList[30]?.chapter || 'Living Organisms & Nutrition',
      allChaptersList[34]?.chapter || 'Human Body Systems & Bones',
      allChaptersList[60]?.chapter || 'Reading Comprehension & Words',
      allChaptersList[63]?.chapter || 'Nouns & Sentence Structures',
      allChaptersList[85]?.chapter || 'Understanding Maps & Earth',
      allChaptersList[110]?.chapter || 'Computer Hardware & Input Devices',
      allChaptersList[135]?.chapter || 'भाषा एवं व्याकरण परिचय',
      allChaptersList[160]?.chapter || 'संस्कृत वर्णमाला एवं शब्दरूपाणि',
    ].slice(0, 10);
  }

  if (mode === 'intermediate') {
    // 20 chapters evenly sampled across the 8 subjects
    // 3 Math, 3 Science, 3 English, 3 Social Science, 2 Computer, 2 Hindi, 2 Sanskrit, 2 Communication
    const selected: string[] = [];
    const pickIndices = [2, 7, 14, 32, 38, 45, 62, 68, 74, 87, 94, 102, 112, 119, 137, 144, 162, 169, 182, 189];
    pickIndices.forEach((idx) => {
      if (allChaptersList[idx]) {
        selected.push(allChaptersList[idx].chapter);
      }
    });

    // Ensure strictly 20 unique chapters
    if (selected.length < 20) {
      for (const item of allChaptersList) {
        if (!selected.includes(item.chapter)) {
          selected.push(item.chapter);
          if (selected.length === 20) break;
        }
      }
    }
    return selected.slice(0, 20);
  }

  // Hard mode: Exactly 40 advanced chapters (5 from each of the 8 subjects)
  const hardSelected: string[] = [];
  const hardIndices = [
    4, 8, 12, 18, 24, // Math (5)
    35, 42, 48, 54, 58, // Science (5)
    65, 71, 77, 80, 83, // English (5)
    90, 96, 101, 105, 108, // Social Science (5)
    115, 120, 124, 128, 133, // Computer (5)
    140, 145, 150, 153, 158, // Hindi (5)
    165, 170, 173, 176, 179, // Sanskrit (5)
    184, 188, 192, 195, 198, // Communication (5)
  ];

  hardIndices.forEach((idx) => {
    if (allChaptersList[idx]) {
      hardSelected.push(allChaptersList[idx].chapter);
    }
  });

  // Ensure strictly 40 unique chapters
  if (hardSelected.length < 40) {
    for (const item of allChaptersList) {
      if (!hardSelected.includes(item.chapter)) {
        hardSelected.push(item.chapter);
        if (hardSelected.length === 40) break;
      }
    }
  }

  return hardSelected.slice(0, 40);
}

/**
 * Returns structured oral questions for a given chapter and difficulty mode
 */
export function getAIVivaQuestionsForChapter(
  studentClass: StudentClass,
  mode: AIVivaMode,
  chapter: string
): AIVivaQuestion[] {
  // Infer subject from chapter keywords or position
  let subject = 'General Academic';
  const cLower = chapter.toLowerCase();

  if (
    cLower.includes('number') ||
    cLower.includes('fraction') ||
    cLower.includes('equation') ||
    cLower.includes('angle') ||
    cLower.includes('triangle') ||
    cLower.includes('algebra') ||
    cLower.includes('ratio') ||
    cLower.includes('mensuration')
  ) {
    subject = 'Mathematics';
  } else if (
    cLower.includes('plant') ||
    cLower.includes('animal') ||
    cLower.includes('motion') ||
    cLower.includes('cell') ||
    cLower.includes('acid') ||
    cLower.includes('matter') ||
    cLower.includes('force') ||
    cLower.includes('tissue') ||
    cLower.includes('nutrition') ||
    cLower.includes('heat')
  ) {
    subject = 'Science';
  } else if (
    cLower.includes('comprehension') ||
    cLower.includes('noun') ||
    cLower.includes('verb') ||
    cLower.includes('tense') ||
    cLower.includes('clause') ||
    cLower.includes('voice') ||
    cLower.includes('speech') ||
    cLower.includes('sentence')
  ) {
    subject = 'English';
  } else if (
    cLower.includes('map') ||
    cLower.includes('earth') ||
    cLower.includes('history') ||
    cLower.includes('constitution') ||
    cLower.includes('government') ||
    cLower.includes('revolution') ||
    cLower.includes('revolt') ||
    cLower.includes('democracy')
  ) {
    subject = 'Social Science';
  } else if (
    cLower.includes('computer') ||
    cLower.includes('python') ||
    cLower.includes('html') ||
    cLower.includes('network') ||
    cLower.includes('scratch') ||
    cLower.includes('cyber') ||
    cLower.includes('binary') ||
    cLower.includes('database')
  ) {
    subject = 'Computer';
  } else if (
    cLower.includes('भाषा') ||
    cLower.includes('वर्ण') ||
    cLower.includes('संज्ञा') ||
    cLower.includes('संधि') ||
    cLower.includes('समास') ||
    cLower.includes('क्रिया') ||
    cLower.includes('मुहावरे') ||
    cLower.includes('अलंकार')
  ) {
    subject = 'Hindi';
  } else if (
    cLower.includes('संस्कृत') ||
    cLower.includes('शब्दाः') ||
    cLower.includes('रूपाणि') ||
    cLower.includes('लकार') ||
    cLower.includes('विभक्ति') ||
    cLower.includes('सुभाषितानि') ||
    cLower.includes('प्रत्यय')
  ) {
    subject = 'Sanskrit';
  } else if (
    cLower.includes('communication') ||
    cLower.includes('listening') ||
    cLower.includes('speaking') ||
    cLower.includes('speech') ||
    cLower.includes('debate') ||
    cLower.includes('interview') ||
    cLower.includes('rhetoric')
  ) {
    subject = 'Communication';
  }

  const isCommunication = subject === 'Communication';

  // -------------------------------------------------------------------------
  // SPECIALIZED PROFESSIONAL ENGLISH COMMUNICATION VIVA QUESTIONS
  // -------------------------------------------------------------------------
  if (isCommunication) {
    if (mode === 'easy') {
      return [
        {
          id: `viva-${studentClass}-comm-easy-q1`,
          chapter,
          subject,
          difficulty: 'easy',
          isCommunicationMode: true,
          question: `Professional Self-Introduction: Deliver a formal, structured 60-second self-introduction in professional English, stating your name, academic focus, and key collaborative strengths.`,
          idealAnswer: `Good day! My name is [Name], and I am currently pursuing my secondary academic curriculum with a specialized interest in analytical subjects. A primary strength of mine is effective verbal articulation combined with active collaborative teamwork. I take pride in clear communication, attention to detail, and a constructive attitude toward complex group projects.`,
          keyConcepts: ['good day', 'name', 'academic focus', 'collaborative', 'strengths', 'articulation', 'teamwork'],
          explanation: `A formal English self-introduction uses the 'Present-Past-Future' structure: 1) Professional greeting ('Good day' or 'Good morning'), 2) Current academic focus, 3) Key personal competencies (e.g. problem-solving, collaboration), and 4) Forward-looking aspirations.`,
          explanationHindi: `Professional English mein self-introduction ke liye: Pehle formal greeting karein ('Good day'), fir apna naam aur class batayein, aur apni 2 main strengths (jaise teamwork, problem solving) ko confident aur clear voice mein present karein.`,
          realWorldExample: `Introducing yourself during an academic admission interview or opening an executive presentation to a judging panel.`,
        },
        {
          id: `viva-${studentClass}-comm-easy-q2`,
          chapter,
          subject,
          difficulty: 'easy',
          isCommunicationMode: true,
          question: `Constructive Professional Disagreement: In an academic project meeting, how would you politely and professionally disagree with a colleague's proposal without causing interpersonal friction?`,
          idealAnswer: `I would utilize diplomatic, constructive phrasing: "I truly appreciate your perspective on this proposal and see the merit in your rationale; however, considering our target timeline and resource constraints, might I suggest we also evaluate an alternative approach to optimize our outcomes?"`,
          keyConcepts: ['appreciate your perspective', 'rationale', 'however', 'suggest', 'alternative approach', 'optimize'],
          explanation: `Professional disagreement follows the 'Validate-Pivot-Propose' technique: Never say 'You are wrong'. Instead, acknowledge their point ('I appreciate your perspective'), introduce the pivot with evidence ('however, based on data...'), and propose a constructive alternative.`,
          explanationHindi: `Formal meeting mein seedhe 'You are wrong' kehna unprofessional hota hai. Pehle unke vichar ki taareef karein ('I appreciate your perspective...'), fir 'However' bolkar apna alternative reason aur data ke saath polite bhasha mein rakhein.`,
          realWorldExample: `Suggesting a different approach during a group science exhibition project meeting without offending your teammates.`,
        },
        {
          id: `viva-${studentClass}-comm-easy-q3`,
          chapter,
          subject,
          difficulty: 'easy',
          isCommunicationMode: true,
          question: `Active Listening & Non-Verbal Attentiveness: What are the three non-negotiable principles of active listening during an executive or formal academic dialogue?`,
          idealAnswer: `The three fundamental pillars of active listening are: 1) Maintaining focused, natural eye contact with affirmative nods to convey attentiveness, 2) Refraining completely from premature verbal interruptions while the speaker develops their point, and 3) Reflective paraphrasing, such as summarizing: "If I understand correctly, your primary concern is..." before delivering a response.`,
          keyConcepts: ['eye contact', 'attentiveness', 'refraining from interruption', 'reflective paraphrasing', 'summarizing'],
          explanation: `Active listening is an active cognitive discipline. It requires physiological presence (eye contact, nodding), cognitive restraint (no interruptions), and verbal verification (paraphrasing).`,
          explanationHindi: `Active listening ke 3 niyam: 1) Eye contact aur nodding se attention show karein, 2) Speaker ko beech mein na tokein, 3) Speaker ki baat samajhne ke baad unhe summarize karke confirm karein: "If I understand correctly..."`,
          realWorldExample: `Listening carefully to a teacher's debate instructions before answering questions.`,
        },
      ];
    }

    if (mode === 'intermediate') {
      return [
        {
          id: `viva-${studentClass}-comm-inter-q1`,
          chapter,
          subject,
          difficulty: 'intermediate',
          isCommunicationMode: true,
          question: `Executive Impromptu Speaking: Using the PREP framework (Point, Reason, Example, Point), deliver a structured argument on why structured communication is crucial in modern teams.`,
          idealAnswer: `Point: Structured communication is the single most critical driver of high-performing teams. Reason: It eliminates ambiguities, minimizes repetitive friction, and aligns collective focus toward shared deadlines. Example: For instance, in our group robotics project, implementing daily 5-minute structured scrums reduced integration errors by over 40 percent. Point: Therefore, disciplined, structured communication consistently guarantees project excellence and operational success.`,
          keyConcepts: ['point', 'reason', 'example', 'eliminates ambiguity', 'collective focus', 'therefore'],
          explanation: `The PREP model is the gold standard for executive impromptu speaking: State your main Point, provide your compelling Reason, substantiate with a vivid Example, and conclude by restating your Point with authority.`,
          explanationHindi: `PREP framework impromptu bolne ka best formula hai: P (Point/Mukhya mudda), R (Reason/Karan), E (Example/Udaharan), aur fir P (Point ko summarize karke conclusion).`,
          realWorldExample: `Answering an unexpected question during a debate or panel interview in front of a live audience.`,
        },
        {
          id: `viva-${studentClass}-comm-inter-q2`,
          chapter,
          subject,
          difficulty: 'intermediate',
          isCommunicationMode: true,
          question: `Conflict Resolution & De-escalation: When an interpersonal disagreement becomes tense during a group discussion, what specific verbal and tonal strategies restore productive collaboration?`,
          idealAnswer: `To de-escalate tension, I lower my vocal pitch and decelerate my speech rate, which physically calms the room. Verbally, I shift from accusatory 'you' language to collaborative 'we' statements: "Let us pause and refocus on our shared objective. Both perspectives raise valid considerations; what common ground can we establish right now?" This validates emotions while refocusing cognitive energy toward problem-solving.`,
          keyConcepts: ['vocal pitch', 'decelerate', 'collaborative we statements', 'shared objective', 'common ground'],
          explanation: `De-escalation relies on vocal pacing (lowering pitch, unhurried cadence), substituting accusatory pronouns ('You said') with collective pronouns ('We are aiming for'), and explicitly identifying common ground.`,
          explanationHindi: `Debate ya meeting mein ladai ya tension hone par: Apni aawaz ko dheema aur shant karein, 'Tumne aisa kaha' ke bajay 'Hamara common goal kya hai' bolein, aur common ground dhoondhein.`,
          realWorldExample: `Calming two heated speakers during an inter-school parliamentary debate.`,
        },
        {
          id: `viva-${studentClass}-comm-inter-q3`,
          chapter,
          subject,
          difficulty: 'intermediate',
          isCommunicationMode: true,
          question: `Audience Engagement & Vocal Dynamics: Explain how an orator strategically utilizes vocal pitch, pacing, and strategic silence (pauses) to command executive attention.`,
          idealAnswer: `An accomplished orator uses vocal modulation as an instrument: pitch is elevated to emphasize pivotal breakthroughs, while pacing is deliberately slowed to deliver weighty conclusions. Crucially, strategic pauses of two to three seconds after a profound statement allow the audience cognitive space to absorb the insight, commanding profound executive gravity far more effectively than continuous speech.`,
          keyConcepts: ['vocal modulation', 'pitch', 'pacing', 'strategic pauses', 'deliberate silence', 'commanding gravity'],
          explanation: `Vocal dynamics avoid monotone delivery. A well-timed silence or pause creates anticipation and signals confidence, allowing deep ideas to resonate.`,
          explanationHindi: `Accha orator hamesha ek hi speed mein nahi bolta. Important points par aawaz ko thoda uncha karein, important line ke baad 2 second ka pause lein taaki audience us baat ko mehsoos kare.`,
          realWorldExample: `A memorable speech by Martin Luther King Jr. or APJ Abdul Kalam utilizing deliberate pauses.`,
        },
      ];
    }

    // Hard Mode Communication
    return [
      {
        id: `viva-${studentClass}-comm-hard-q1`,
        chapter,
        subject,
        difficulty: 'hard',
        isCommunicationMode: true,
        question: `Strategic Persuasion: Formulate an argument synthesizing Aristotelian Ethos (credibility), Logos (logic & empirical proof), and Pathos (emotional resonance) to pitch a high-impact initiative.`,
        idealAnswer: `Ethos: Having spearheaded academic STEM initiatives for two years, I have witnessed first-hand the transformative potential of inquiry-driven learning. Logos: Empirical research across 50 institutions indicates that peer-led problem labs boost subject mastery by 38 percent while decreasing academic attrition. Pathos: Every student in our institution deserves to experience the exhilaration of intellectual discovery rather than passive rote memorization. Therefore, I respectfully urge this committee to champion our interdisciplinary research incubator.`,
        keyConcepts: ['ethos', 'credibility', 'logos', 'empirical', 'pathos', 'emotional resonance', 'persuasion'],
        explanation: `Aristotle's rhetorical triangle combines Ethos (speaker credibility), Logos (objective facts, data, deductive logic), and Pathos (human empathy, shared mission) to construct unassailable persuasive arguments.`,
        explanationHindi: `Rhetorical persuasion mein teen cheezein zaroori hain: Ethos (aapki credibility), Logos (facts aur logic), aur Pathos (emotion aur shared values). Teenon milkar ek powerful pitch banate hain.`,
        realWorldExample: `Pitching a major student scholarship program to an executive board of trustees.`,
      },
      {
        id: `viva-${studentClass}-comm-hard-q2`,
        chapter,
        subject,
        difficulty: 'hard',
        isCommunicationMode: true,
        question: `Crisis Communication & Executive Decorum: During an institutional crisis or public controversy, what four core protocols ensure authoritative, ethical, and calm communication?`,
        idealAnswer: `In crisis communication, the four essential protocols are: 1) Radical transparency and accountability—acknowledging verified facts without defensive evasion, 2) Rapidity with accuracy—establishing an initial verified statement to prevent misinformation, 3) Empathetic stakeholder prioritization—addressing human welfare before financial or legal interests, and 4) Clear, actionable next steps—providing a definitive roadmap of corrective measures and next scheduled briefing milestones.`,
        keyConcepts: ['transparency', 'accountability', 'accuracy', 'empathy', 'actionable roadmap', 'stakeholder prioritization'],
        explanation: `Crisis leadership demands immediate acknowledgment of facts, sincere empathy for affected parties, rejection of speculation, and a transparent plan of action.`,
        explanationHindi: `Crisis ke samay 4 baatein zaroori hain: Sach batayein (transparency), jaldi aur sahi facts dein, logo ke prati empathy dikhayein, aur aage kya step utha rahe hain uska clear roadmap dein.`,
        realWorldExample: `A school principal addressing parents during an unexpected campus safety event.`,
      },
      {
        id: `viva-${studentClass}-comm-hard-q3`,
        chapter,
        subject,
        difficulty: 'hard',
        isCommunicationMode: true,
        question: `Cross-Cultural Communication & High-Context vs. Low-Context Pragmatics: How do nuanced cultural communication styles influence international negotiations and team synergy?`,
        idealAnswer: `Low-context cultures (such as North American and Germanic traditions) prioritize direct, explicit verbal accuracy where agreements are codified literally. Conversely, high-context cultures (including East Asian, Middle Eastern, and Mediterranean traditions) rely profoundly on implicit cues, relational hierarchy, and unspoken contextual trust. Global communicators bridge this divide by adapting their directness, practicing active empathetic listening, and confirming mutual consensus without causing cultural loss of face.`,
        keyConcepts: ['low-context', 'high-context', 'explicit accuracy', 'implicit cues', 'relational trust', 'global synergy'],
        explanation: `Understanding high-context vs low-context communication prevents cultural misunderstandings and builds resilient cross-border alliances.`,
        explanationHindi: `Alag-alag cultures mein baat karne ka dhang alag hota hai. Low-context cultures mein seedhi aur direct baat hoti hai, jabki high-context cultures mein relation aur body language zyada matter karti hai. Dono ko samajhna global leader banne ke liye zaroori hai.`,
        realWorldExample: `Leading a Model United Nations (MUN) delegation representing different countries.`,
      },
    ];
  }

  // -------------------------------------------------------------------------
  // GENERAL ACADEMIC SUBJECTS (Math, Science, English, SST, Computer, etc.)
  // -------------------------------------------------------------------------
  if (mode === 'easy') {
    return [
      {
        id: `viva-${studentClass}-easy-q1`,
        chapter,
        subject,
        difficulty: 'easy',
        question: `Explain the fundamental concept of "${chapter}" in simple terms, using an everyday example.`,
        idealAnswer: `In "${chapter}", the core concept revolves around foundational principles observed in daily life. A student should clearly define the central term, explain how it operates (such as cause and effect or structure), and cite a real-world example illustrating the concept accurately.`,
        keyConcepts: ['definition', 'example', 'basic principle', 'daily life'],
        explanation: `The fundamental idea behind "${chapter}" is to understand its basic definition, observe how it works around us, and connect it to familiar physical or logical examples.`,
        explanationHindi: `"${chapter}" ka main concept ye hai ki hum iski basic definition ko samjhein aur dekhein ki ye hamari aam zindagi me kahan use hota hai.`,
        realWorldExample: `Think of how this concept applies in your classroom, home gadgets, or daily routine.`,
      },
      {
        id: `viva-${studentClass}-easy-q2`,
        chapter,
        subject,
        difficulty: 'easy',
        question: `What is the most important rule or fact to remember when working with "${chapter}"?`,
        idealAnswer: `The primary rule in "${chapter}" is to identify the fundamental properties accurately and follow standard conventions without skipping preliminary steps. Precision in terminology and recognizing the primary classification is crucial.`,
        keyConcepts: ['rule', 'property', 'terminology', 'steps'],
        explanation: `When studying "${chapter}", always memorize the primary rule or formula and apply each step in sequential order.`,
        explanationHindi: `"${chapter}" mein sabse zaroori baat ye hai ki hum basic rules aur formulas ko step-by-step follow karein, koi step skip na karein.`,
        realWorldExample: `Like following a recipe step-by-step to get the perfect result every time.`,
      },
      {
        id: `viva-${studentClass}-easy-q3`,
        chapter,
        subject,
        difficulty: 'easy',
        question: `Why is learning "${chapter}" beneficial for your academic understanding in ${subject}?`,
        idealAnswer: `Mastering "${chapter}" establishes the conceptual bedrock required for advanced topics. It develops logical reasoning, clarifies connections between theory and practical applications, and prevents misconceptions in subsequent grades.`,
        keyConcepts: ['importance', 'foundation', 'connection', 'application'],
        explanation: `This chapter forms the cornerstone for higher concepts in ${subject}. Without mastering it, advanced problem solving becomes confusing.`,
        explanationHindi: `Ye chapter aage aane wale sabhi chapters ki neenv (foundation) hai. Isko samajhne se aapke basic concepts crystal clear ho jaate hain.`,
        realWorldExample: `Like building a strong foundation of a skyscraper before constructing the upper floors.`,
      },
    ];
  }

  if (mode === 'intermediate') {
    return [
      {
        id: `viva-${studentClass}-inter-q1`,
        chapter,
        subject,
        difficulty: 'intermediate',
        question: `Analyze the core mechanism of "${chapter}". How do its key components interact with one another?`,
        idealAnswer: `In "${chapter}", the mechanism involves structured interactions where input variables or components directly influence subsequent outcomes. For example, altering one factor produces measurable shifts according to governing laws and definitions.`,
        keyConcepts: ['mechanism', 'interaction', 'components', 'relationship', 'cause and effect'],
        explanation: `Focus on cause and effect: When component A changes, how does component B respond under the governing laws of ${subject}?`,
        explanationHindi: `Isme cause and effect samjhein: Jab ek part badalta hai, toh dusre part par kya asar padta hai aur kyun.`,
        realWorldExample: `Like gears inside a clock, where each gear rotates the next to keep accurate time.`,
      },
      {
        id: `viva-${studentClass}-inter-q2`,
        chapter,
        subject,
        difficulty: 'intermediate',
        question: `Suppose a student makes a common error while solving or analyzing "${chapter}". What is that mistake and how should it be corrected?`,
        idealAnswer: `A widespread misconception in "${chapter}" occurs when students confuse underlying definitions or overlook boundary conditions. The correct approach is to systematically verify definitions, apply the relevant formula or grammatical rule, and cross-check against benchmark criteria.`,
        keyConcepts: ['misconception', 'correction', 'verification', 'systematic approach'],
        explanation: `Most mistakes happen when students rush into calculations without checking units or basic conditions. Cross-checking prevents errors.`,
        explanationHindi: `Students aksar jaldbazi mein basic conditions ya units bhool jaate hain. Hamesha answer nikaalne ke baad ek baar verify karein.`,
        realWorldExample: `Forgetting negative signs in algebra or mixing up units of measurement like cm and meters.`,
      },
      {
        id: `viva-${studentClass}-inter-q3`,
        chapter,
        subject,
        difficulty: 'intermediate',
        question: `How would you compare or connect "${chapter}" with another related topic in ${studentClass} ${subject}?`,
        idealAnswer: `"${chapter}" directly complements related curriculum topics by providing necessary analytical frameworks. While earlier topics focus on basic identification, "${chapter}" introduces functional dependencies and quantitative or qualitative synthesis.`,
        keyConcepts: ['comparison', 'synthesis', 'framework', 'progression'],
        explanation: `Connect the dots between this topic and previous chapters you have studied to build a holistic mental model.`,
        explanationHindi: `Is topic ko purane chapters ke saath jodiye taaki aapko pura subject ek interconnected story ki tarah samajh aaye.`,
        realWorldExample: `Like linking addition to multiplication, or cell structure to complex organ systems.`,
      },
    ];
  }

  // Hard Mode
  return [
    {
      id: `viva-${studentClass}-hard-q1`,
      chapter,
      subject,
      difficulty: 'hard',
      question: `Present a rigorous, in-depth evaluation of the theoretical framework behind "${chapter}". What are its foundational assumptions and limitations?`,
      idealAnswer: `The advanced theoretical framework of "${chapter}" rests on specific axiomatic assumptions and rigorous principles. Its validity relies on controlled boundary conditions, outside of which edge-case anomalies or corrections must be introduced. A complete answer demonstrates precision in technical vocabulary, causal derivation, and critical awareness of limitations.`,
      keyConcepts: ['theoretical framework', 'assumptions', 'limitations', 'axiomatic', 'derivation', 'edge-case'],
      explanation: `Analyze the boundaries of the theory: Under what specific conditions does this scientific or mathematical model hold true, and where does it fail?`,
      explanationHindi: `Deep analysis karein: Ye theory kin conditions mein bilkul sahi kaam karti hai, aur kin conditions mein iske limitations samne aate hain.`,
      realWorldExample: `Like Newtonian physics working perfectly in daily life, but requiring Einstein's relativity at speeds near light.`,
    },
    {
      id: `viva-${studentClass}-hard-q2`,
      chapter,
      subject,
      difficulty: 'hard',
      question: `Evaluate a complex problem or real-world scenario involving "${chapter}". Formulate a multi-step strategy to resolve it with mathematical or conceptual rigor.`,
      idealAnswer: `Resolving high-order problems in "${chapter}" requires a structured 3-phase methodology: 1) Precise parameter identification and assumption declaration, 2) Step-by-step application of governing theorems or structural models, and 3) Quantitative verification and sensitivity analysis of the outcome.`,
      keyConcepts: ['methodology', 'rigor', 'parameter identification', 'verification', 'governing theorems'],
      explanation: `Break the problem down: 1) Identify given variables, 2) Choose the appropriate theorem or model, 3) Solve and test the solution under edge cases.`,
      explanationHindi: `Mushkil sawal ko 3 steps me todein: Pehle given values likhein, sahi formula lagayein, aur final result ko dobara verify karein.`,
      realWorldExample: `Architects calculating load stress on bridges to ensure safety under extreme wind.`,
    },
    {
      id: `viva-${studentClass}-hard-q3`,
      chapter,
      subject,
      difficulty: 'hard',
      question: `Defend how recent developments or advanced applications of "${chapter}" have reshaped our modern understanding in ${subject}.`,
      idealAnswer: `Modern developments stemming from "${chapter}" have transitioned classical paradigms toward contemporary analytical and computational models. By challenging older oversimplifications, this topic enables advanced real-world implementations, from technological efficiency to institutional design.`,
      keyConcepts: ['modern understanding', 'paradigms', 'applications', 'contemporary', 'implications'],
      explanation: `Look at modern industry or academia: How does this fundamental school concept enable cutting-edge technology or research today?`,
      explanationHindi: `Dekhein ki ye concept aaj ki modern technology (AI, space research, modern economics) mein kitna bada role play karta hai.`,
      realWorldExample: `How basic boolean algebra powers modern quantum computing and artificial intelligence processors.`,
    },
  ];
}

/**
 * Evaluates the student's spoken/typed answer against the ideal viva answer
 */
export function evaluateAIVivaAnswer(
  question: AIVivaQuestion,
  studentAnswer: string
): AIVivaAnswerEvaluation {
  const trimmed = studentAnswer.trim();
  const lowerAnswer = trimmed.toLowerCase();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  // Keyword / Concept matching
  let matchedConcepts = 0;
  question.keyConcepts.forEach((kc) => {
    if (lowerAnswer.includes(kc.toLowerCase())) {
      matchedConcepts++;
    }
  });

  const conceptCoverage = question.keyConcepts.length > 0 ? matchedConcepts / question.keyConcepts.length : 0.5;

  // Determine score based on concept coverage, length, and coherence
  let score = 0;
  const deficiencies: ('reading' | 'writing' | 'conceptual' | 'articulation')[] = [];

  if (wordCount < 4) {
    score = 15;
    deficiencies.push('writing', 'articulation', 'conceptual');
  } else if (wordCount < 12) {
    score = Math.round(30 + conceptCoverage * 40);
    deficiencies.push('writing');
    if (conceptCoverage < 0.5) deficiencies.push('reading', 'conceptual');
  } else {
    score = Math.min(100, Math.round(45 + conceptCoverage * 50 + Math.min(10, wordCount / 5)));
    if (conceptCoverage < 0.3) {
      deficiencies.push('conceptual', 'reading');
    }
  }

  // Communication Specific Scores
  let fluencyScore = 0;
  let professionalToneScore = 0;

  if (question.isCommunicationMode) {
    const professionalKeywords = [
      'good day', 'respectfully', 'perspective', 'proposal', 'collaborative', 'objective',
      'appreciate', 'consider', 'alternative', 'therefore', 'empirical', 'evidence',
      'paraphrasing', 'articulation', 'furthermore', 'merit', 'rationale', 'optimize'
    ];
    let proKeywordsFound = 0;
    professionalKeywords.forEach((kw) => {
      if (lowerAnswer.includes(kw)) proKeywordsFound++;
    });

    fluencyScore = Math.min(100, Math.max(30, Math.round(40 + (wordCount / 2) + conceptCoverage * 30)));
    professionalToneScore = Math.min(100, Math.max(35, Math.round(45 + proKeywordsFound * 15)));

    // Weighted composite score for Professional English
    score = Math.round((conceptCoverage * 40) + (fluencyScore * 0.3) + (professionalToneScore * 0.3));
    score = Math.min(100, Math.max(20, score));
  }

  const isCorrect = score >= 60;

  // Constructive feedback explaining mistakes and areas to strengthen
  let feedback = '';
  if (question.isCommunicationMode) {
    if (score >= 85) {
      feedback = 'Outstanding executive presence! Your spoken English was polished, articulate, and diplomatically structured with formal diction.';
    } else if (score >= 65) {
      feedback = 'Good professional delivery. You communicated the main intent clearly; to reach senior executive standard, practice using formal transitions (e.g. "Furthermore", "In summary") and expanding on your examples.';
      if (!deficiencies.includes('articulation')) deficiencies.push('articulation');
    } else if (score >= 40) {
      feedback = 'Developing speaker. Your answer had relevant ideas, but lacked formal vocabulary and structured delivery. Try following the PREP framework (Point, Reason, Example, Point).';
      if (!deficiencies.includes('articulation')) deficiencies.push('articulation');
      if (!deficiencies.includes('writing')) deficiencies.push('writing');
    } else {
      feedback = 'Needs professional practice. Avoid casual phrasing or one-word answers. Speak in complete, formal sentences with active voice.';
      if (!deficiencies.includes('articulation')) deficiencies.push('articulation');
      if (!deficiencies.includes('writing')) deficiencies.push('writing');
      if (!deficiencies.includes('reading')) deficiencies.push('reading');
    }
  } else {
    if (score >= 85) {
      feedback = 'Outstanding articulate response! You covered the core principles with clarity and academic precision.';
    } else if (score >= 65) {
      feedback = 'Good response. You captured the primary idea, but your explanation could be enhanced by incorporating formal subject terminology and complete justification.';
      if (!deficiencies.includes('writing')) deficiencies.push('writing');
    } else if (score >= 40) {
      feedback = 'Partially correct. You identified some surface details, but missed the essential causal mechanism and foundational keywords.';
      if (!deficiencies.includes('reading')) deficiencies.push('reading');
      if (!deficiencies.includes('conceptual')) deficiencies.push('conceptual');
    } else {
      feedback = 'Incomplete response. Your answer lacked necessary depth, structured phrasing, and key conceptual terms.';
      if (!deficiencies.includes('reading')) deficiencies.push('reading');
      if (!deficiencies.includes('writing')) deficiencies.push('writing');
      if (!deficiencies.includes('conceptual')) deficiencies.push('conceptual');
      if (!deficiencies.includes('articulation')) deficiencies.push('articulation');
    }
  }

  return {
    questionId: question.id,
    questionText: question.question,
    studentAnswer: trimmed || '(No response provided)',
    isCorrect,
    scorePercentage: score,
    feedback,
    sahiVersion: question.idealAnswer,
    detectedDeficiencies: deficiencies,
    fluencyScore: question.isCommunicationMode ? fluencyScore : undefined,
    professionalToneScore: question.isCommunicationMode ? professionalToneScore : undefined,
  };
}

/**
 * Generates the complete Skill Diagnostic Report highlighting needs in Reading, Writing, etc.
 */
export function generateSkillDiagnostic(evaluations: AIVivaAnswerEvaluation[]): SkillDiagnostic {
  let readingCount = 0;
  let writingCount = 0;
  let conceptualCount = 0;
  let articulationCount = 0;

  const total = evaluations.length || 1;
  evaluations.forEach((ev) => {
    if (ev.detectedDeficiencies.includes('reading')) readingCount++;
    if (ev.detectedDeficiencies.includes('writing')) writingCount++;
    if (ev.detectedDeficiencies.includes('conceptual')) conceptualCount++;
    if (ev.detectedDeficiencies.includes('articulation')) articulationCount++;
  });

  const getNeedLevel = (count: number): 'high' | 'moderate' | 'strong' => {
    const ratio = count / total;
    if (ratio >= 0.6) return 'high';
    if (ratio >= 0.3) return 'moderate';
    return 'strong'; // 'strong' means strong competency, low need
  };

  const readingNeed = getNeedLevel(readingCount);
  const writingNeed = getNeedLevel(writingCount);
  const conceptualNeed = getNeedLevel(conceptualCount);
  const articulationNeed = getNeedLevel(articulationCount);

  // Diagnostic advice tailored to user findings
  const readingAdvice =
    readingNeed === 'high'
      ? 'High Need: Review the NCERT chapter paragraphs carefully. You missed core factual points and technical terminology that come from textbook reading.'
      : readingNeed === 'moderate'
      ? 'Moderate Need: Spend 15 minutes skimming chapter summaries and highlighted vocabulary terms before taking tests.'
      : 'Proficient: Solid information recall and strong retention of chapter facts.';

  const writingAdvice =
    writingNeed === 'high'
      ? 'High Need: Practice structuring answers into complete, well-reasoned sentences (Assertion → Reason → Example) instead of fragmented short phrases.'
      : writingNeed === 'moderate'
      ? 'Moderate Need: Work on expressing arguments with greater precision and formal sentence connectors (Therefore, Because, Consequently).'
      : 'Proficient: Clean sentence formulation and articulate textual expression.';

  const conceptualAdvice =
    conceptualNeed === 'high'
      ? 'High Need: Focus on fundamental concepts and definitions. Understand the "why" behind formulas and principles rather than rote memorization.'
      : conceptualNeed === 'moderate'
      ? 'Moderate Need: Practice 2-marker and 3-marker conceptual questions to solidify connections between sub-topics.'
      : 'Proficient: Deep conceptual clarity and accurate logical reasoning demonstrated.';

  const articulationAdvice =
    articulationNeed === 'high'
      ? 'High Need: Speak your answers out loud in complete sentences. Practice pausing to organize your thoughts before speaking.'
      : articulationNeed === 'moderate'
      ? 'Moderate Need: Reduce hesitation and filler words by practicing 1-minute oral summaries of each chapter.'
      : 'Proficient: Confident, steady verbal cadence and clear academic articulation.';

  const topActionSteps: string[] = [];
  if (readingNeed === 'high') {
    topActionSteps.push('1. Re-read the assigned chapter in your textbook, highlighting all bold definitions and diagrams.');
  } else {
    topActionSteps.push('1. Review chapter revision notes and formula cheat-sheets.');
  }

  if (writingNeed === 'high' || writingNeed === 'moderate') {
    topActionSteps.push('2. Write out 3 long-form answers by hand each evening using standard scientific / mathematical terms.');
  } else {
    topActionSteps.push('2. Solve 5 multi-step practice questions to maintain speed.');
  }

  if (conceptualNeed === 'high') {
    topActionSteps.push('3. Retake this AI Viva at Easy level to build rock-solid conceptual confidence.');
  } else {
    topActionSteps.push('3. Challenge yourself with the Intermediate or Hard AI Viva assessment to master higher-order thinking.');
  }

  return {
    readingNeed,
    readingAdvice,
    writingNeed,
    writingAdvice,
    conceptualNeed,
    conceptualAdvice,
    articulationNeed,
    articulationAdvice,
    topActionSteps,
  };
}
