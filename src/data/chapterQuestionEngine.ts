import { StudentClass, Question } from '../types';

/**
 * Extracts key conceptual tags for any given chapter
 */
export function getConceptsForChapter(subject: string, chapter: string): string[] {
  const c = chapter.toLowerCase();
  const tags: string[] = [];

  if (subject === 'Mathematics') {
    if (c.includes('number') || c.includes('place value')) tags.push('Number Systems', 'Place Values');
    if (c.includes('fraction') || c.includes('decimal')) tags.push('Fractions', 'Decimals');
    if (c.includes('factor') || c.includes('multiple') || c.includes('hcf') || c.includes('lcm')) tags.push('Factors & Multiples', 'Primes');
    if (c.includes('equation') || c.includes('variable')) tags.push('Algebra', 'Linear Equations');
    if (c.includes('square') || c.includes('cube') || c.includes('root') || c.includes('exponent')) tags.push('Exponents & Powers', 'Roots');
    if (c.includes('ratio') || c.includes('percent') || c.includes('interest') || c.includes('profit')) tags.push('Commercial Math', 'Percentages');
    if (c.includes('geometry') || c.includes('angle') || c.includes('triangle') || c.includes('quadrilateral') || c.includes('circle')) tags.push('Geometry', 'Theorems');
    if (c.includes('perimeter') || c.includes('area') || c.includes('volume') || c.includes('mensuration')) tags.push('Mensuration', 'Formulas');
    if (c.includes('graph') || c.includes('data') || c.includes('probability') || c.includes('stat')) tags.push('Statistics', 'Data Handling');
    if (tags.length === 0) tags.push('Mathematical Reasoning', 'Calculations');
  } else if (subject === 'Science') {
    if (c.includes('plant') || c.includes('crop') || c.includes('seed') || c.includes('photosynthesis')) tags.push('Botany', 'Plant Physiology');
    if (c.includes('animal') || c.includes('reproduction') || c.includes('organism')) tags.push('Zoology', 'Adaptations');
    if (c.includes('cell') || c.includes('tissue') || c.includes('microorganism')) tags.push('Cell Biology', 'Microbiology');
    if (c.includes('human') || c.includes('bone') || c.includes('digestive') || c.includes('circulatory') || c.includes('nerve') || c.includes('skeleton')) tags.push('Human Anatomy', 'Physiology');
    if (c.includes('food') || c.includes('nutrient') || c.includes('disease')) tags.push('Nutrition', 'Health Science');
    if (c.includes('matter') || c.includes('chemical') || c.includes('metal') || c.includes('acid') || c.includes('base') || c.includes('reaction')) tags.push('Chemistry', 'Reactions');
    if (c.includes('force') || c.includes('pressure') || c.includes('friction') || c.includes('motion') || c.includes('gravitation')) tags.push('Mechanics', 'Physics');
    if (c.includes('light') || c.includes('sound') || c.includes('heat') || c.includes('electric') || c.includes('magnet')) tags.push('Optics & Waves', 'Electromagnetism');
    if (c.includes('air') || c.includes('water') || c.includes('soil') || c.includes('environment') || c.includes('pollution')) tags.push('Ecology', 'Environmental Science');
    if (tags.length === 0) tags.push('Scientific Inquiry', 'Empirical Laws');
  } else if (subject === 'English') {
    if (c.includes('noun') || c.includes('pronoun') || c.includes('adjective') || c.includes('adverb')) tags.push('Parts of Speech', 'Grammar');
    if (c.includes('tense') || c.includes('verb') || c.includes('agreement')) tags.push('Verb Tenses', 'Subject-Verb Syntax');
    if (c.includes('voice') || c.includes('speech') || c.includes('narration')) tags.push('Active/Passive Voice', 'Direct/Indirect Speech');
    if (c.includes('clause') || c.includes('sentence') || c.includes('conjunction') || c.includes('preposition')) tags.push('Syntax', 'Connectors');
    if (c.includes('vocabulary') || c.includes('idiom') || c.includes('synonym') || c.includes('antonym')) tags.push('Lexicon', 'Vocabulary Building');
    if (c.includes('comprehension') || c.includes('reading') || c.includes('passage')) tags.push('Reading Skills', 'Inference');
    if (c.includes('writing') || c.includes('letter') || c.includes('essay') || c.includes('notice')) tags.push('Written Composition', 'Formats');
    if (tags.length === 0) tags.push('English Language', 'Applied Grammar');
  } else if (subject === 'Social Science') {
    if (c.includes('empire') || c.includes('ruler') || c.includes('battle') || c.includes('revolt') || c.includes('revolution') || c.includes('civilization') || c.includes('history')) tags.push('Historical Chronicles', 'World History');
    if (c.includes('constitution') || c.includes('parliament') || c.includes('judiciary') || c.includes('democracy') || c.includes('rights') || c.includes('civic')) tags.push('Civics', 'Indian Constitution');
    if (c.includes('earth') || c.includes('globe') || c.includes('map') || c.includes('climate') || c.includes('resource') || c.includes('agriculture') || c.includes('soil')) tags.push('Physical Geography', 'Resource Economics');
    if (tags.length === 0) tags.push('Social Analysis', 'Heritage & Society');
  } else if (subject === 'Computer') {
    if (c.includes('hardware') || c.includes('memory') || c.includes('input') || c.includes('cpu') || c.includes('storage')) tags.push('Computer Architecture', 'Hardware');
    if (c.includes('scratch') || c.includes('algorithm') || c.includes('flowchart') || c.includes('logic')) tags.push('Computational Logic', 'Algorithms');
    if (c.includes('python') || c.includes('programming') || c.includes('code') || c.includes('variable') || c.includes('loop')) tags.push('Python 3', 'Syntax & Control Flow');
    if (c.includes('html') || c.includes('css') || c.includes('web')) tags.push('Web Development', 'Semantic Markup');
    if (c.includes('network') || c.includes('internet') || c.includes('cyber') || c.includes('security') || c.includes('data')) tags.push('Networking', 'Cybersecurity');
    if (tags.length === 0) tags.push('Information Technology', 'Digital Tools');
  } else if (subject === 'Hindi') {
    if (c.includes('वर्ण') || c.includes('ध्वनि')) tags.push('वर्ण विचार', 'ध्वनिविज्ञान');
    if (c.includes('संज्ञा') || c.includes('सर्वनाम') || c.includes('विशेषण') || c.includes('क्रिया')) tags.push('पद परिचय', 'व्याकरण भेद');
    if (c.includes('सन्धि') || c.includes('समास') || c.includes('उपसर्ग') || c.includes('प्रत्यय')) tags.push('शब्द रचना', 'व्याकरण नियम');
    if (c.includes('मुहावरे') || c.includes('लोकोक्तियाँ') || c.includes('पर्यायवाची') || c.includes('विलोम')) tags.push('शब्दावली', 'लोकोक्तियाँ');
    if (c.includes('अलंकार') || c.includes('रस') || c.includes('काव्य')) tags.push('काव्य सौंदर्य', 'अलंकार शास्त्र');
    if (tags.length === 0) tags.push('हिंदी व्याकरण', 'भाषा कौशल');
  } else if (subject === 'Sanskrit') {
    if (c.includes('वर्णमाला') || c.includes('उच्चारण')) tags.push('वर्णमाला', 'उच्चारण-स्थानम्');
    if (c.includes('शब्दरूपाणि') || c.includes('विभक्ति') || c.includes('अकारान्त')) tags.push('शब्दरूपाणि', 'विभक्तयः');
    if (c.includes('धातुरूपाणि') || c.includes('लकार') || c.includes('लट्') || c.includes('लृट्')) tags.push('धातुरूपाणि', 'लकार-प्रकरणम्');
    if (c.includes('सन्धिः') || c.includes('स्वरसन्धि') || c.includes('व्यञ्जन')) tags.push('सन्धि-नियमः', 'संहिता');
    if (c.includes('कारकाणि') || c.includes('कारक') || c.includes('उपपद')) tags.push('कारक-विचारः', 'वाक्य-संरचना');
    if (c.includes('सूक्तयः') || c.includes('सुभाषितानि') || c.includes('कथा')) tags.push('सुभाषितानि', 'नीति-कथा');
    if (tags.length === 0) tags.push('संस्कृत-व्याकरणम्', 'देववाणी');
  } else if (subject === 'Communication') {
    if (c.includes('listening') || c.includes('comprehension')) tags.push('Active Listening', 'Retention');
    if (c.includes('speaking') || c.includes('fluency') || c.includes('pronunciation') || c.includes('phonetic')) tags.push('Spoken Fluency', 'Phonetics & Diction');
    if (c.includes('public') || c.includes('presentation') || c.includes('stage')) tags.push('Public Speaking', 'Audience Engagement');
    if (c.includes('debate') || c.includes('argument') || c.includes('discussion')) tags.push('Critical Debate', 'Persuasion');
    if (c.includes('non-verbal') || c.includes('body language') || c.includes('gesture')) tags.push('Body Language', 'Presence');
    if (c.includes('formal') || c.includes('business') || c.includes('email') || c.includes('interview')) tags.push('Professional Register', 'Workplace Etiquette');
    if (tags.length === 0) tags.push('Verbal Articulation', 'Interpersonal Skills');
  }

  return tags.slice(0, 3);
}

interface QuestionBlueprint {
  questionText: string;
  options: [string, string, string, string, string];
  correctIndex: number;
  explanation: string;
  concept: string;
}

// ==========================================
// 1. MATHEMATICS QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getMathQuestion(chapter: string, i: number, problemNumber: number): QuestionBlueprint {
  const c = chapter.toLowerCase();
  const qIdx = (i - 1) % 20;

  // Number Systems & Place Value
  if (c.includes('number') || c.includes('place value') || c.includes('factor') || c.includes('multiple') || c.includes('prime')) {
    const p1 = (i * 3 + 2);
    const p2 = (i * 4 + 7);
    const num = 1200000 + i * 45000 + problemNumber * 123;
    const base = (i % 6) + 3;

    const mathNumberBlueprints: QuestionBlueprint[] = [
      {
        questionText: `In the numeral ${num.toLocaleString()}, what is the place value of the leftmost non-zero digit?`,
        options: ['1,000,000 (One Million / Ten Lakhs)', '100,000 (One Lakh)', '10,000 (Ten Thousand)', '10,000,000 (One Crore)', '1,000 (One Thousand)'],
        correctIndex: 0,
        explanation: `In standard base-10 positional notation, the leftmost digit occupies the millions/ten-lakhs place, representing 1 × 10^6.`,
        concept: 'Place Value Identification',
      },
      {
        questionText: `Which of the following numbers is a prime number?`,
        options: [`${p1 * 2}`, `${p2 * 3}`, '29', `${(i + 2) * 4}`, '51'],
        correctIndex: 2,
        explanation: `29 has exactly two positive factors: 1 and 29 itself. 51 = 3 × 17, so it is composite.`,
        concept: 'Prime and Composite Numbers',
      },
      {
        questionText: `What is the Highest Common Factor (HCF) of ${base * 4} and ${base * 6}?`,
        options: [`${base}`, `${base * 2}`, `${base * 3}`, `${base * 4}`, `${base * 12}`],
        correctIndex: 1,
        explanation: `The greatest common divisor dividing both ${base * 4} and ${base * 6} is exactly ${base * 2}.`,
        concept: 'Highest Common Factor (HCF)',
      },
      {
        questionText: `What is the Lowest Common Multiple (LCM) of 6 and 8?`,
        options: ['12', '16', '24', '48', '36'],
        correctIndex: 2,
        explanation: `Multiples of 6 are 6, 12, 18, 24... Multiples of 8 are 8, 16, 24... The smallest common multiple is 24.`,
        concept: 'Lowest Common Multiple (LCM)',
      },
      {
        questionText: `According to the divisibility rules, which of the following is divisible by 9?`,
        options: ['3,456 (Sum of digits = 18)', '2,345 (Sum = 14)', '5,671 (Sum = 19)', '4,321 (Sum = 10)', '7,811 (Sum = 17)'],
        correctIndex: 0,
        explanation: `A number is divisible by 9 if and only if the sum of its digits is divisible by 9. For 3456, 3+4+5+6 = 18, which is divisible by 9.`,
        concept: 'Divisibility Criterion',
      },
      {
        questionText: `What is the value of the integer expression: (-15) + (+28) - (-12)?`,
        options: ['+1', '+25', '+43', '-1', '+13'],
        correctIndex: 1,
        explanation: `(-15) + 28 - (-12) = -15 + 28 + 12 = 13 + 12 = 25.`,
        concept: 'Integer Arithmetic',
      },
      {
        questionText: `Which property of multiplication is illustrated by: a × (b + c) = (a × b) + (a × c)?`,
        options: ['Commutative Property', 'Associative Property', 'Distributive Property of Multiplication over Addition', 'Identity Property', 'Closure Property'],
        correctIndex: 2,
        explanation: `The distributive property states that multiplying a sum by a number gives the same result as multiplying each addend separately and adding the products.`,
        concept: 'Properties of Operations',
      },
      {
        questionText: `Express the Roman numeral 'CDXLIV' in standard Hindu-Arabic numeral system:`,
        options: ['444', '644', '464', '544', '446'],
        correctIndex: 0,
        explanation: `CD = 400, XL = 40, IV = 4. CDXLIV = 400 + 40 + 4 = 444.`,
        concept: 'Roman Numerals',
      },
      {
        questionText: `What is the predecessor of the smallest 6-digit natural number (100,000)?`,
        options: ['99,999', '100,001', '90,000', '99,990', '999,999'],
        correctIndex: 0,
        explanation: `The predecessor of an integer n is n - 1. Thus 100,000 - 1 = 99,999.`,
        concept: 'Successor and Predecessor',
      },
      {
        questionText: `If two numbers are co-prime, what is their Highest Common Factor (HCF)?`,
        options: ['0', '1', 'Their product', 'Their sum', '2'],
        correctIndex: 1,
        explanation: `By definition, two numbers are co-prime (relatively prime) if their only positive common factor is 1.`,
        concept: 'Co-prime Properties',
      },
      {
        questionText: `Round off the number 84,763 to the nearest thousand:`,
        options: ['84,000', '85,000', '84,800', '80,000', '85,700'],
        correctIndex: 1,
        explanation: `The hundreds digit is 7 (≥ 5), so the thousands digit rounds up from 4 to 5, giving 85,000.`,
        concept: 'Estimation and Rounding',
      },
      {
        questionText: `What is the additive inverse of -47?`,
        options: ['-47', '0', '+47', '1/47', '-1/47'],
        correctIndex: 2,
        explanation: `The additive inverse of a number x is -x such that x + (-x) = 0. The additive inverse of -47 is +47.`,
        concept: 'Additive Inverse',
      },
      {
        questionText: `Using the formula: HCF(a, b) × LCM(a, b) = a × b. If HCF = 6, LCM = 36, and a = 12, what is b?`,
        options: ['12', '18', '24', '36', '6'],
        correctIndex: 1,
        explanation: `b = (HCF × LCM) / a = (6 × 36) / 12 = 216 / 12 = 18.`,
        concept: 'HCF and LCM Product Relation',
      },
      {
        questionText: `What is the absolute value of the expression: | -18 - 7 |?`,
        options: ['-25', '+25', '-11', '+11', '0'],
        correctIndex: 1,
        explanation: `|-18 - 7| = |-25| = 25. Absolute value is always non-negative.`,
        concept: 'Absolute Value',
      },
      {
        questionText: `Which of the following is the prime factorization of 72?`,
        options: ['2 × 3 × 12', '2³ × 3² (8 × 9)', '2² × 3³', '2⁴ × 3', '8 × 9'],
        correctIndex: 1,
        explanation: `72 = 8 × 9 = 2³ × 3². Prime factorization requires all factors to be prime numbers.`,
        concept: 'Prime Factorization',
      },
      {
        questionText: `Evaluate using order of operations (BODMAS): 24 - 4 × (3 + 2) + 8 ÷ 2 = ?`,
        options: ['8', '14', '20', '104', '2'],
        correctIndex: 0,
        explanation: `Parentheses: 3 + 2 = 5. Multiply/Divide: 4 × 5 = 20, 8 ÷ 2 = 4. Add/Subtract left to right: 24 - 20 + 4 = 4 + 4 = 8.`,
        concept: 'BODMAS Order of Operations',
      },
      {
        questionText: `Find the difference between the greatest and smallest 4-digit numbers formed using digits 7, 2, 0, 9 without repetition:`,
        options: ['7,641', '7,668', '7,209', '9,720', '2,079'],
        correctIndex: 0,
        explanation: `Greatest number is 9720; smallest is 2079. 9720 - 2079 = 7641.`,
        concept: 'Digit Recombination',
      },
      {
        questionText: `If a number is divisible by both 4 and 6, what is the smallest non-zero number it must always be divisible by?`,
        options: ['24', '12', '2', '8', '10'],
        correctIndex: 1,
        explanation: `The number must be a multiple of LCM(4, 6) = 12.`,
        concept: 'Common Divisibility',
      },
      {
        questionText: `What is the value of 1000 × 0.001?`,
        options: ['0.01', '0.1', '1', '10', '100'],
        correctIndex: 2,
        explanation: `1000 × (1/1000) = 1.`,
        concept: 'Powers of Ten',
      },
      {
        questionText: `Find the sum of all prime numbers between 10 and 20:`,
        options: ['48', '56', '60', '64', '50'],
        correctIndex: 2,
        explanation: `The prime numbers between 10 and 20 are 11, 13, 17, and 19. Sum = 11 + 13 + 17 + 19 = 60.`,
        concept: 'Primes in an Interval',
      },
    ];

    return mathNumberBlueprints[qIdx];
  }

  // Fractions & Decimals
  if (c.includes('fraction') || c.includes('decimal')) {
    const mathFractionBlueprints: QuestionBlueprint[] = [
      {
        questionText: `Which of the following fractions is in its simplest (irreducible) form?`,
        options: ['15/25', '18/24', '11/17', '14/21', '22/33'],
        correctIndex: 2,
        explanation: `11 and 17 are co-prime with no common factors other than 1, so 11/17 is in lowest terms.`,
        concept: 'Simplest Form of Fractions',
      },
      {
        questionText: `Calculate the sum: 3/4 + 2/5 = ?`,
        options: ['5/9', '23/20 (1 3/20)', '15/20', '6/20', '1 1/4'],
        correctIndex: 1,
        explanation: `LCM of 4 and 5 is 20. 3/4 = 15/20, 2/5 = 8/20. 15/20 + 8/20 = 23/20 = 1 3/20.`,
        concept: 'Fraction Addition',
      },
      {
        questionText: `Calculate the product: (5/8) × (16/25) = ?`,
        options: ['2/5', '1/2', '4/5', '8/15', '2/3'],
        correctIndex: 0,
        explanation: `(5 × 16) / (8 × 25) = (1 × 2) / (1 × 5) = 2/5.`,
        concept: 'Fraction Multiplication',
      },
      {
        questionText: `Divide: (7/12) ÷ (14/36) = ?`,
        options: ['1/2', '3/2 (1.5)', '2/3', '4/3', '7/24'],
        correctIndex: 1,
        explanation: `Multiply by reciprocal: (7/12) × (36/14) = (7/14) × (36/12) = (1/2) × 3 = 3/2.`,
        concept: 'Fraction Division',
      },
      {
        questionText: `Convert the improper fraction 29/6 into a mixed numeral:`,
        options: ['4 5/6', '5 1/6', '4 1/6', '5 5/6', '3 5/6'],
        correctIndex: 0,
        explanation: `29 ÷ 6 = 4 with a remainder of 5, which equals 4 5/6.`,
        concept: 'Mixed Numerals',
      },
      {
        questionText: `Which of the following decimals has the greatest value?`,
        options: ['0.405', '0.450', '0.045', '0.455', '0.4505'],
        correctIndex: 3,
        explanation: `Comparing decimal places: 0.455 > 0.4505 > 0.450 > 0.405 > 0.045.`,
        concept: 'Comparing Decimals',
      },
      {
        questionText: `Evaluate: 14.75 - 6.892 = ?`,
        options: ['7.858', '8.142', '7.958', '8.858', '7.862'],
        correctIndex: 0,
        explanation: `14.750 - 6.892 = 7.858.`,
        concept: 'Decimal Subtraction',
      },
      {
        questionText: `Multiply: 0.25 × 0.04 = ?`,
        options: ['0.1', '0.01', '0.001', '0.0001', '1.0'],
        correctIndex: 1,
        explanation: `25 × 4 = 100. There are 2 + 2 = 4 decimal places, giving 0.0100 = 0.01.`,
        concept: 'Decimal Multiplication',
      },
      {
        questionText: `Evaluate: 4.8 ÷ 0.06 = ?`,
        options: ['8', '80', '800', '0.8', '0.08'],
        correctIndex: 1,
        explanation: `Multiply both numerator and denominator by 100: 480 ÷ 6 = 80.`,
        concept: 'Decimal Division',
      },
      {
        questionText: `Convert 0.375 into a fraction in lowest terms:`,
        options: ['3/8', '7/16', '3/7', '375/100', '5/12'],
        correctIndex: 0,
        explanation: `375/1000. Dividing both by 125 gives 3/8.`,
        concept: 'Decimal to Fraction Conversion',
      },
      {
        questionText: `What is the reciprocal (multiplicative inverse) of 4 2/3?`,
        options: ['3/14', '14/3', '-14/3', '4 3/2', '-3/14'],
        correctIndex: 0,
        explanation: `4 2/3 = 14/3. Its reciprocal is 3/14.`,
        concept: 'Multiplicative Reciprocal',
      },
      {
        questionText: `A ribbon is 7.5 meters long. How many pieces of length 0.25 meters can be cut from it?`,
        options: ['25', '30', '35', '28', '15'],
        correctIndex: 1,
        explanation: `Number of pieces = 7.5 ÷ 0.25 = 750 ÷ 25 = 30 pieces.`,
        concept: 'Fraction Word Problem',
      },
      {
        questionText: `What is 3/5 of 150 kg?`,
        options: ['60 kg', '75 kg', '90 kg', '100 kg', '45 kg'],
        correctIndex: 2,
        explanation: `(3/5) × 150 = 3 × 30 = 90 kg.`,
        concept: 'Fractional Part of a Whole',
      },
      {
        questionText: `Which of the following is equivalent to 5/8?`,
        options: ['0.58', '0.625', '0.65', '0.525', '0.85'],
        correctIndex: 1,
        explanation: `5 ÷ 8 = 0.625.`,
        concept: 'Decimal Representation',
      },
      {
        questionText: `Evaluate: 1/2 + 1/4 + 1/8 + 1/16 = ?`,
        options: ['15/16', '7/8', '31/32', '1', '13/16'],
        correctIndex: 0,
        explanation: `Common denominator 16: (8 + 4 + 2 + 1)/16 = 15/16.`,
        concept: 'Geometric Fraction Sum',
      },
      {
        questionText: `If 2/3 of a number is 48, what is the complete number?`,
        options: ['64', '72', '32', '96', '54'],
        correctIndex: 1,
        explanation: `Number = 48 × (3/2) = 24 × 3 = 72.`,
        concept: 'Inverse Fractional Problem',
      },
      {
        questionText: `Express 35 mm in meters as a decimal:`,
        options: ['0.35 m', '0.035 m', '0.0035 m', '3.5 m', '0.00035 m'],
        correctIndex: 1,
        explanation: `1 m = 1000 mm. 35 mm = 35 / 1000 m = 0.035 m.`,
        concept: 'Metric Decimal Conversion',
      },
      {
        questionText: `A car travels 89.1 km in 2.2 hours. What is its average speed in km/h?`,
        options: ['40.5 km/h', '42.0 km/h', '39.5 km/h', '41.2 km/h', '45.0 km/h'],
        correctIndex: 0,
        explanation: `Speed = Distance ÷ Time = 89.1 ÷ 2.2 = 891 ÷ 22 = 40.5 km/h.`,
        concept: 'Decimal Speed Calculation',
      },
      {
        questionText: `Evaluate: (3/7) + (2/7) × (7/4) = ?`,
        options: ['5/7', '13/14', '11/14', '7/8', '15/14'],
        correctIndex: 1,
        explanation: `Multiplication first: (2/7) × (7/4) = 2/4 = 1/2. Then add: 3/7 + 1/2 = 6/14 + 7/14 = 13/14.`,
        concept: 'Fraction Order of Operations',
      },
      {
        questionText: `Which fraction lies strictly between 1/3 and 1/2?`,
        options: ['1/4', '5/12', '2/7', '7/12', '3/10'],
        correctIndex: 1,
        explanation: `1/3 = 4/12 (approx 0.333), 1/2 = 6/12 (0.500). 5/12 = approx 0.417, which lies strictly between them.`,
        concept: 'Fractions on the Number Line',
      },
    ];

    return mathFractionBlueprints[qIdx];
  }

  // Linear Equations & Algebra
  if (c.includes('equation') || c.includes('variable') || c.includes('algebra') || c.includes('polynomial')) {
    const mathAlgebraBlueprints: QuestionBlueprint[] = [
      {
        questionText: `Solve the linear equation for x: 3x - 7 = 14`,
        options: ['x = 5', 'x = 7', 'x = 9', 'x = 6', 'x = 8'],
        correctIndex: 1,
        explanation: `3x = 14 + 7 = 21. x = 21 / 3 = 7.`,
        concept: 'Linear Equations in One Variable',
      },
      {
        questionText: `Solve the equation: 5x + 3 = 2x + 18`,
        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6', 'x = 7'],
        correctIndex: 2,
        explanation: `5x - 2x = 18 - 3 => 3x = 15 => x = 5.`,
        concept: 'Variables on Both Sides',
      },
      {
        questionText: `What is the degree of the polynomial: 4x³y² - 7x²y⁴ + 9xy - 5?`,
        options: ['3', '5', '6', '7', '4'],
        correctIndex: 2,
        explanation: `Degree is determined by the term with the highest sum of exponents. For -7x²y⁴, degree = 2 + 4 = 6.`,
        concept: 'Degree of Polynomial',
      },
      {
        questionText: `Simplify the algebraic expression: (3x² - 5x + 7) + (2x² + 8x - 11)`,
        options: ['5x² + 3x - 4', '5x² - 3x - 4', '5x² + 13x + 18', '6x² + 3x - 4', 'x² + 3x - 4'],
        correctIndex: 0,
        explanation: `Combine like terms: (3+2)x² + (-5+8)x + (7-11) = 5x² + 3x - 4.`,
        concept: 'Polynomial Addition',
      },
      {
        questionText: `Expand using the standard algebraic identity: (2x + 3)² = ?`,
        options: ['4x² + 9', '4x² + 12x + 9', '4x² + 6x + 9', '2x² + 12x + 9', '4x² + 12x + 6'],
        correctIndex: 1,
        explanation: `(a + b)² = a² + 2ab + b² = (2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9.`,
        concept: 'Algebraic Identities',
      },
      {
        questionText: `Factorize completely: x² - 49 = ?`,
        options: ['(x - 7)²', '(x + 7)²', '(x - 7)(x + 7)', '(x - 49)(x + 1)', '(x - 14)(x + 14)'],
        correctIndex: 2,
        explanation: `Difference of squares: a² - b² = (a - b)(a + b). x² - 7² = (x - 7)(x + 7).`,
        concept: 'Difference of Two Squares',
      },
      {
        questionText: `The sum of three consecutive integers is 72. What is the largest integer?`,
        options: ['23', '24', '25', '26', '27'],
        correctIndex: 2,
        explanation: `Let integers be n, n+1, n+2. 3n + 3 = 72 => 3n = 69 => n = 23. Largest is n + 2 = 25.`,
        concept: 'Word Problems on Numbers',
      },
      {
        questionText: `Solve the fractional equation: x/3 + x/4 = 14`,
        options: ['x = 12', 'x = 24', 'x = 28', 'x = 32', 'x = 36'],
        correctIndex: 1,
        explanation: `LCM is 12: (4x + 3x)/12 = 14 => 7x = 168 => x = 24.`,
        concept: 'Fractional Linear Equations',
      },
      {
        questionText: `If x = -2 and y = 3, evaluate: 2x² - 3xy + y²`,
        options: ['35', '23', '17', '-1', '31'],
        correctIndex: 0,
        explanation: `2(-2)² - 3(-2)(3) + 3² = 2(4) - (-18) + 9 = 8 + 18 + 9 = 35.`,
        concept: 'Evaluation of Expressions',
      },
      {
        questionText: `A father is currently 3 times as old as his son. In 12 years, he will be twice as old as his son. How old is the son now?`,
        options: ['10 years', '12 years', '14 years', '15 years', '8 years'],
        correctIndex: 1,
        explanation: `Let son = s, father = 3s. In 12 years: 3s + 12 = 2(s + 12) => 3s + 12 = 2s + 24 => s = 12 years.`,
        concept: 'Age Problems',
      },
      {
        questionText: `Subtract (4a - 7b + 9) from (2a + 3b - 5):`,
        options: ['-2a + 10b - 14', '2a - 10b + 14', '-2a - 4b + 4', '6a - 4b + 4', '-2a + 4b - 14'],
        correctIndex: 0,
        explanation: `(2a + 3b - 5) - (4a - 7b + 9) = (2-4)a + (3+7)b + (-5-9) = -2a + 10b - 14.`,
        concept: 'Polynomial Subtraction',
      },
      {
        questionText: `What is the coefficient of x in the expression: 7 - 5x + 3x²?`,
        options: ['5', '-5', '3', '7', '-3'],
        correctIndex: 1,
        explanation: `The numerical factor multiplying x is -5.`,
        concept: 'Coefficients of Terms',
      },
      {
        questionText: `Factorize by grouping terms: xy + 3y + 2x + 6 = ?`,
        options: ['(x + 2)(y + 3)', '(x + 3)(y + 2)', '(xy + 6)(1 + y)', '(x - 2)(y - 3)', '(x + 6)(y + 1)'],
        correctIndex: 1,
        explanation: `Grouping: y(x + 3) + 2(x + 3) = (x + 3)(y + 2).`,
        concept: 'Factorization by Grouping',
      },
      {
        questionText: `Expand: (x - 4)(x + 5) = ?`,
        options: ['x² + x - 20', 'x² - x - 20', 'x² + 9x - 20', 'x² - 20', 'x² + 20'],
        correctIndex: 0,
        explanation: `x(x + 5) - 4(x + 5) = x² + 5x - 4x - 20 = x² + x - 20.`,
        concept: 'Binomial Multiplication',
      },
      {
        questionText: `Solve: (2x + 1) / (3x - 2) = 5/7`,
        options: ['x = 12', 'x = 15', 'x = 17', 'x = 19', 'x = 21'],
        correctIndex: 2,
        explanation: `Cross-multiply: 7(2x + 1) = 5(3x - 2) => 14x + 7 = 15x - 10 => 15x - 14x = 7 + 10 => x = 17.`,
        concept: 'Cross Multiplication Method',
      },
      {
        questionText: `The perimeter of a rectangle is 60 cm. Its length is 6 cm more than its breadth. What is the breadth?`,
        options: ['10 cm', '12 cm', '14 cm', '16 cm', '18 cm'],
        correctIndex: 1,
        explanation: `2(l + b) = 60 => l + b = 30. (b + 6) + b = 30 => 2b = 24 => b = 12 cm.`,
        concept: 'Geometric Linear Modeling',
      },
      {
        questionText: `If (a + b) = 9 and ab = 20, what is the value of (a² + b²)?`,
        options: ['41', '61', '81', '21', '51'],
        correctIndex: 0,
        explanation: `a² + b² = (a + b)² - 2ab = 9² - 2(20) = 81 - 40 = 41.`,
        concept: 'Identity Manipulation',
      },
      {
        questionText: `Divide the polynomial: (12x³ - 8x² + 4x) ÷ (4x) = ?`,
        options: ['3x² - 2x + 1', '3x² - 2x', '3x² - 4x + 1', '3x³ - 2x² + x', '12x² - 8x + 4'],
        correctIndex: 0,
        explanation: `Divide each term by 4x: (12x³/4x) - (8x²/4x) + (4x/4x) = 3x² - 2x + 1.`,
        concept: 'Monomial Division',
      },
      {
        questionText: `Solve for y: 0.3(y - 2) = 0.2(y + 3)`,
        options: ['y = 6', 'y = 8', 'y = 10', 'y = 12', 'y = 14'],
        correctIndex: 3,
        explanation: `Multiply by 10: 3(y - 2) = 2(y + 3) => 3y - 6 = 2y + 6 => y = 12.`,
        concept: 'Decimal Linear Equations',
      },
      {
        questionText: `Which value of k makes (x + 3) a factor of x² + 7x + k?`,
        options: ['10', '12', '14', '6', '16'],
        correctIndex: 1,
        explanation: `If (x + 3) is a factor, x = -3 must make expression 0: (-3)² + 7(-3) + k = 0 => 9 - 21 + k = 0 => k = 12.`,
        concept: 'Factor Theorem Application',
      },
    ];

    return mathAlgebraBlueprints[qIdx];
  }

  // Commercial Math & Percentages
  if (c.includes('percent') || c.includes('interest') || c.includes('profit') || c.includes('ratio')) {
    const mathCommercialBlueprints: QuestionBlueprint[] = [
      {
        questionText: `Convert 3/8 into a percentage:`,
        options: ['32.5%', '35.0%', '37.5%', '40.0%', '42.5%'],
        correctIndex: 2,
        explanation: `(3/8) × 100% = 300/8% = 37.5%.`,
        concept: 'Percentage Conversion',
      },
      {
        questionText: `Find the Simple Interest on ₹5,000 at 8% per annum for 3 years:`,
        options: ['₹1,000', '₹1,200', '₹1,400', '₹1,500', '₹800'],
        correctIndex: 1,
        explanation: `SI = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = ₹1,200.`,
        concept: 'Simple Interest',
      },
      {
        questionText: `An article bought for ₹400 is sold for ₹480. What is the profit percentage?`,
        options: ['15%', '18%', '20%', '25%', '12%'],
        correctIndex: 2,
        explanation: `Profit = 480 - 400 = ₹80. Profit% = (80 / 400) × 100 = 20%.`,
        concept: 'Profit Percentage',
      },
      {
        questionText: `A shopkeeper marks an item at ₹800 and gives a 15% discount. What is the selling price?`,
        options: ['₹650', '₹680', '₹700', '₹720', '₹640'],
        correctIndex: 1,
        explanation: `Discount = 15% of 800 = ₹120. SP = 800 - 120 = ₹680.`,
        concept: 'Discount and Marked Price',
      },
      {
        questionText: `If 24 : x :: 36 : 48, find the value of x:`,
        options: ['28', '30', '32', '34', '36'],
        correctIndex: 2,
        explanation: `Product of extremes = Product of means: 24 × 48 = x × 36 => x = (24 × 48) / 36 = 32.`,
        concept: 'Proportions and Extremes',
      },
      {
        questionText: `The population of a town increased from 40,000 to 46,000. What is the percentage increase?`,
        options: ['12%', '14%', '15%', '16%', '18%'],
        correctIndex: 2,
        explanation: `Increase = 6,000. Percentage increase = (6,000 / 40,000) × 100 = 15%.`,
        concept: 'Percentage Increase',
      },
      {
        questionText: `Divide ₹1,500 between Alice and Bob in the ratio 2 : 3. What is Bob's share?`,
        options: ['₹600', '₹750', '₹900', '₹1,000', '₹800'],
        correctIndex: 2,
        explanation: `Total parts = 2 + 3 = 5. Bob's share = (3/5) × 1500 = ₹900.`,
        concept: 'Ratio Division',
      },
      {
        questionText: `At what annual rate of interest will ₹2,000 amount to ₹2,600 in 5 years under simple interest?`,
        options: ['5%', '6%', '7%', '8%', '4%'],
        correctIndex: 1,
        explanation: `SI = 2600 - 2000 = ₹600. R = (SI × 100) / (P × T) = (600 × 100) / (2000 × 5) = 60000 / 10000 = 6%.`,
        concept: 'Rate of Interest Inversion',
      },
      {
        questionText: `If the cost price of 10 pens equals the selling price of 8 pens, what is the profit percentage?`,
        options: ['20%', '25%', '30%', '15%', '22.5%'],
        correctIndex: 1,
        explanation: `Let CP of 1 pen = ₹1. CP of 8 pens = ₹8. SP of 8 pens = CP of 10 pens = ₹10. Profit = ₹2. Profit% = (2/8) × 100 = 25%.`,
        concept: 'CP vs SP Equivalence',
      },
      {
        questionText: `A bicycle is sold for ₹2,700 at a loss of 10%. What was its cost price?`,
        options: ['₹2,970', '₹3,000', '₹3,100', '₹3,200', '₹2,950'],
        correctIndex: 1,
        explanation: `SP = 90% of CP => 2700 = 0.9 × CP => CP = 2700 / 0.9 = ₹3,000.`,
        concept: 'Loss and Original Cost',
      },
      {
        questionText: `What is the Compound Interest on ₹10,000 for 2 years at 10% per annum, compounded annually?`,
        options: ['₹2,000', '₹2,100', '₹2,200', '₹1,900', '₹2,050'],
        correctIndex: 1,
        explanation: `A = P(1 + r/100)² = 10000 × (1.1)² = 10000 × 1.21 = ₹12,100. CI = 12100 - 10000 = ₹2,100.`,
        concept: 'Compound Interest',
      },
      {
        questionText: `If 15 workers can build a wall in 48 hours, how many workers are required to do the same work in 30 hours?`,
        options: ['20 workers', '24 workers', '25 workers', '28 workers', '18 workers'],
        correctIndex: 1,
        explanation: `Inverse proportion: 15 × 48 = w × 30 => w = 720 / 30 = 24 workers.`,
        concept: 'Inverse Variation',
      },
      {
        questionText: `A dealer sells two items for ₹1,200 each, making a 20% gain on one and a 20% loss on the other. What is the net result?`,
        options: ['No profit no loss', '4% loss', '4% profit', '2% loss', '1% loss'],
        correctIndex: 1,
        explanation: `When two items are sold at the same price with equal % gain and loss, there is always a net loss of (x/10)²% = (20/10)²% = 4% loss.`,
        concept: 'Dual Transaction Net Result',
      },
      {
        questionText: `What single discount is equivalent to two successive discounts of 20% and 10%?`,
        options: ['30%', '28%', '25%', '27%', '29%'],
        correctIndex: 1,
        explanation: `Equivalent discount = d1 + d2 - (d1 × d2)/100 = 20 + 10 - 2 = 28%.`,
        concept: 'Successive Discounts',
      },
      {
        questionText: `The ratio of boys to girls in a school of 720 students is 7 : 5. How many girls are there?`,
        options: ['300', '320', '420', '280', '350'],
        correctIndex: 0,
        explanation: `Total parts = 12. Girls = (5/12) × 720 = 5 × 60 = 300 girls.`,
        concept: 'Ratio Distribution',
      },
      {
        questionText: `In what time will a principal of ₹4,000 double itself at 10% simple interest per annum?`,
        options: ['8 years', '10 years', '12 years', '15 years', '5 years'],
        correctIndex: 1,
        explanation: `SI = ₹4,000. T = (SI × 100) / (P × R) = (4000 × 100) / (4000 × 10) = 10 years.`,
        concept: 'Doubling Period Formula',
      },
      {
        questionText: `A watch bought for ₹2,400 includes 20% VAT. What was the original price before tax?`,
        options: ['₹1,920', '₹2,000', '₹2,100', '₹1,980', '₹2,050'],
        correctIndex: 1,
        explanation: `Price with tax = 120% of original. Original = 2400 / 1.2 = ₹2,000.`,
        concept: 'Value Added Tax (VAT)',
      },
      {
        questionText: `If 12 kg of sugar costs ₹480, what is the cost of 5 kg of sugar?`,
        options: ['₹180', '₹200', '₹220', '₹240', '₹160'],
        correctIndex: 1,
        explanation: `Cost per kg = 480 / 12 = ₹40. Cost of 5 kg = 5 × 40 = ₹200.`,
        concept: 'Unitary Method',
      },
      {
        questionText: `What percentage of 2 hours is 18 minutes?`,
        options: ['12%', '15%', '18%', '9%', '20%'],
        correctIndex: 1,
        explanation: `2 hours = 120 minutes. (18 / 120) × 100% = (3/20) × 100% = 15%.`,
        concept: 'Time Percentage',
      },
      {
        questionText: `A sum amounts to ₹7,200 in 2 years and ₹8,100 in 3 years under simple interest. What is the annual interest?`,
        options: ['₹800', '₹900', '₹1,000', '₹850', '₹950'],
        correctIndex: 1,
        explanation: `1 year simple interest = 8100 - 7200 = ₹900.`,
        concept: 'Step-wise Interest Extraction',
      },
    ];

    return mathCommercialBlueprints[qIdx];
  }

  // Geometry & Mensuration (Fallback / General Math)
  const mathGeometryBlueprints: QuestionBlueprint[] = [
    {
      questionText: `What is the sum of the interior angles of a convex hexagon (6 sides)?`,
      options: ['540°', '720°', '900°', '1080°', '360°'],
      correctIndex: 1,
      explanation: `Sum of interior angles = (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°.`,
      concept: 'Polygon Angle Sum Theorem',
    },
    {
      questionText: `What is the area of a circle whose radius is 7 cm? (Take π = 22/7)`,
      options: ['44 cm²', '154 cm²', '144 cm²', '88 cm²', '196 cm²'],
      correctIndex: 1,
      explanation: `Area = πr² = (22/7) × 7 × 7 = 154 cm².`,
      concept: 'Circle Area Formula',
    },
    {
      questionText: `In a right-angled triangle, the legs measure 6 cm and 8 cm. What is the length of the hypotenuse?`,
      options: ['9 cm', '10 cm', '12 cm', '14 cm', '11 cm'],
      correctIndex: 1,
      explanation: `Pythagoras Theorem: h² = 6² + 8² = 36 + 64 = 100 => h = 10 cm.`,
      concept: 'Pythagorean Theorem',
    },
    {
      questionText: `What is the total surface area of a cube of edge length 5 cm?`,
      options: ['125 cm²', '150 cm²', '100 cm²', '175 cm²', '75 cm²'],
      correctIndex: 1,
      explanation: `Total surface area = 6a² = 6 × (5)² = 6 × 25 = 150 cm².`,
      concept: 'Total Surface Area of Cube',
    },
    {
      questionText: `Two complementary angles are in the ratio 2 : 3. What is the measure of the smaller angle?`,
      options: ['30°', '36°', '45°', '54°', '24°'],
      correctIndex: 1,
      explanation: `Complementary angles add to 90°. Total parts = 5. Smaller angle = (2/5) × 90° = 36°.`,
      concept: 'Complementary Angles',
    },
    {
      questionText: `What is the volume of a cylinder with radius 7 cm and height 10 cm? (Take π = 22/7)`,
      options: ['1,440 cm³', '1,540 cm³', '1,640 cm³', '2,200 cm³', '1,280 cm³'],
      correctIndex: 1,
      explanation: `Volume = πr²h = (22/7) × 7 × 7 × 10 = 1,540 cm³.`,
      concept: 'Cylinder Volume Formula',
    },
    {
      questionText: `The perimeter of a square is 48 cm. What is its area?`,
      options: ['96 cm²', '120 cm²', '144 cm²', '196 cm²', '169 cm²'],
      correctIndex: 2,
      explanation: `Side = 48 / 4 = 12 cm. Area = side² = 12² = 144 cm².`,
      concept: 'Square Area and Perimeter',
    },
    {
      questionText: `What is the sum of the exterior angles of ANY convex polygon?`,
      options: ['180°', '360°', '540°', 'Depends on sides', '720°'],
      correctIndex: 1,
      explanation: `The sum of exterior angles of any convex polygon is universally 360°.`,
      concept: 'Exterior Angle Theorem',
    },
    {
      questionText: `What is the area of a trapezium with parallel sides 12 cm and 18 cm, and height 8 cm?`,
      options: ['100 cm²', '120 cm²', '140 cm²', '160 cm²', '90 cm²'],
      correctIndex: 1,
      explanation: `Area = (1/2) × (a + b) × h = (1/2) × (12 + 18) × 8 = (1/2) × 30 × 8 = 120 cm².`,
      concept: 'Trapezium Area',
    },
    {
      questionText: `If each interior angle of a regular polygon is 108°, how many sides does it have?`,
      options: ['4 sides', '5 sides (Pentagon)', '6 sides', '8 sides', '10 sides'],
      correctIndex: 1,
      explanation: `Exterior angle = 180° - 108° = 72°. Number of sides = 360° / 72° = 5 sides.`,
      concept: 'Regular Polygon Symmetry',
    },
    {
      questionText: `What is the circumference of a circular wheel with diameter 28 cm? (Take π = 22/7)`,
      options: ['44 cm', '88 cm', '176 cm', '154 cm', '66 cm'],
      correctIndex: 1,
      explanation: `Circumference = πd = (22/7) × 28 = 88 cm.`,
      concept: 'Circumference of a Circle',
    },
    {
      questionText: `What is the volume of a cuboid with dimensions 8 cm × 5 cm × 3 cm?`,
      options: ['100 cm³', '120 cm³', '140 cm³', '150 cm³', '90 cm³'],
      correctIndex: 1,
      explanation: `Volume = l × b × h = 8 × 5 × 3 = 120 cm³.`,
      concept: 'Volume of Cuboid',
    },
    {
      questionText: `Two supplementary angles differ by 40°. What is the measure of the larger angle?`,
      options: ['100°', '110°', '120°', '130°', '90°'],
      correctIndex: 1,
      explanation: `x + y = 180 and x - y = 40. Adding: 2x = 220 => x = 110°.`,
      concept: 'Supplementary Angles System',
    },
    {
      questionText: `What is the area of a rhombus whose diagonals measure 16 cm and 12 cm?`,
      options: ['84 cm²', '96 cm²', '108 cm²', '192 cm²', '72 cm²'],
      correctIndex: 1,
      explanation: `Area = (1/2) × d1 × d2 = (1/2) × 16 × 12 = 96 cm².`,
      concept: 'Rhombus Area Calculation',
    },
    {
      questionText: `How many edges does a standard cuboid (rectangular prism) have?`,
      options: ['6 edges', '8 edges', '12 edges', '16 edges', '10 edges'],
      correctIndex: 2,
      explanation: `A cuboid has 6 rectangular faces, 8 vertices, and 12 straight edges.`,
      concept: '3D Solid Euler Attributes',
    },
    {
      questionText: `What is the curved surface area of a cone with base radius 7 cm and slant height 25 cm? (Take π = 22/7)`,
      options: ['500 cm²', '550 cm²', '600 cm²', '650 cm²', '450 cm²'],
      correctIndex: 1,
      explanation: `CSA = πrl = (22/7) × 7 × 25 = 550 cm².`,
      concept: 'Cone Curved Surface Area',
    },
    {
      questionText: `If a running track of width 7 m surrounds a circular park of radius 21 m, what is the outer radius?`,
      options: ['25 m', '28 m', '30 m', '35 m', '26 m'],
      correctIndex: 1,
      explanation: `Outer radius R = inner radius r + track width = 21 + 7 = 28 m.`,
      concept: 'Concentric Circular Tracks',
    },
    {
      questionText: `In an equilateral triangle of side length 10 cm, what is the measure of each interior angle?`,
      options: ['45°', '60°', '90°', '120°', '30°'],
      correctIndex: 1,
      explanation: `All three sides and angles of an equilateral triangle are equal: 180° / 3 = 60°.`,
      concept: 'Equilateral Triangle Properties',
    },
    {
      questionText: `How many liters of water can a rectangular water tank of dimensions 2 m × 1.5 m × 1 m hold?`,
      options: ['1,500 L', '2,000 L', '3,000 L', '3,500 L', '2,500 L'],
      correctIndex: 2,
      explanation: `Volume = 2 × 1.5 × 1 = 3 m³. Since 1 m³ = 1,000 Liters, capacity = 3 × 1,000 = 3,000 Liters.`,
      concept: 'Capacity Unit Conversion',
    },
    {
      questionText: `According to Euler's formula for convex polyhedra, F + V - E = ?`,
      options: ['0', '1', '2', '3', '4'],
      correctIndex: 2,
      explanation: `Euler's formula states that for any convex polyhedron: Faces (F) + Vertices (V) - Edges (E) = 2.`,
      concept: 'Euler Polyhedral Formula',
    },
  ];

  return mathGeometryBlueprints[qIdx];
}

// ==========================================
// 2. SCIENCE QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getScienceQuestion(chapter: string, i: number): QuestionBlueprint {
  const c = chapter.toLowerCase();
  const qIdx = (i - 1) % 20;

  // Botany & Plants
  if (c.includes('plant') || c.includes('crop') || c.includes('seed') || c.includes('photosynthesis')) {
    const scienceBotanyBlueprints: QuestionBlueprint[] = [
      {
        questionText: `Which cellular organelle in plant cells is the primary site of photosynthesis?`,
        options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi apparatus', 'Vacuole'],
        correctIndex: 1,
        explanation: `Chloroplasts contain green chlorophyll pigments that absorb photon energy for photosynthesis.`,
        concept: 'Photosynthesis Site',
      },
      {
        questionText: `Which vascular plant tissue is responsible for transporting water and dissolved minerals upwards from roots to leaves?`,
        options: ['Phloem', 'Xylem', 'Cortex', 'Epidermis', 'Pith'],
        correctIndex: 1,
        explanation: `Xylem conducts water and inorganic minerals unidirectionally from the roots to the aerial parts of the plant.`,
        concept: 'Plant Vascular Transport',
      },
      {
        questionText: `What specialized cells regulate the opening and closing of microscopic stomata on the leaf surface?`,
        options: ['Epithelial cells', 'Guard cells', 'Sclerenchyma cells', 'Cambium cells', 'Root hair cells'],
        correctIndex: 1,
        explanation: `Bean-shaped guard cells swell when turgid to open stomata and shrink when flaccid to close them.`,
        concept: 'Stomatal Regulation',
      },
      {
        questionText: `Which essential condition is NOT strictly required for seeds to undergo initial germination?`,
        options: ['Moisture (Water)', 'Continuous sunlight', 'Adequate oxygen', 'Suitable warm temperature', 'Viable seed embryo'],
        correctIndex: 1,
        explanation: `Most seeds germinate underground in darkness; they rely on stored cotyledon nutrients and only need water, oxygen, and warmth.`,
        concept: 'Seed Germination Factors',
      },
      {
        questionText: `In which part of the Bryophyllum plant do adventitious vegetative buds develop for reproduction?`,
        options: ['Root tips', 'Leaf margins', 'Stem internodes', 'Petals', 'Underground rhizome'],
        correctIndex: 1,
        explanation: `Bryophyllum reproduces vegetatively via adventitious buds formed along the serrated notches of its leaves.`,
        concept: 'Vegetative Propagation',
      },
      {
        questionText: `Which symbiotic bacteria reside in root nodules of leguminous plants to fix atmospheric nitrogen gas?`,
        options: ['Lactobacillus', 'Rhizobium', 'Streptococcus', 'E. coli', 'Spirillum'],
        correctIndex: 1,
        explanation: `Rhizobium bacteria convert inert atmospheric N₂ into bioavailable nitrates for the host legume.`,
        concept: 'Biological Nitrogen Fixation',
      },
      {
        questionText: `What type of root system and leaf venation are typically found in monocotyledonous plants (e.g. wheat, maize)?`,
        options: ['Taproot system with reticulate venation', 'Fibrous root system with parallel venation', 'Taproot system with parallel venation', 'Aerial roots with reticulate venation', 'Tuberous roots with palmate venation'],
        correctIndex: 1,
        explanation: `Monocots have fibrous root clusters and parallel veins running along the blade of the leaf.`,
        concept: 'Monocot Characteristics',
      },
      {
        questionText: `Which plant hormone is primarily responsible for phototropism (bending towards sunlight)?`,
        options: ['Ethylene', 'Auxin', 'Abscisic acid', 'Gibberellin', 'Cytokinin'],
        correctIndex: 1,
        explanation: `Auxin accumulates on the shaded side of stems, causing cellular elongation that bends the shoot towards the light source.`,
        concept: 'Plant Tropisms & Hormones',
      },
      {
        questionText: `What is the primary organic molecule that constitutes the rigid structural cell wall of plants?`,
        options: ['Glycogen', 'Cellulose', 'Chitin', 'Keratin', 'Collagen'],
        correctIndex: 1,
        explanation: `Cellulose is a tough, insoluble structural polysaccharide forming the cell wall matrix.`,
        concept: 'Cell Wall Composition',
      },
      {
        questionText: `By which mechanism do dandelion seeds achieve widespread ecological seed dispersal?`,
        options: ['Explosive mechanical burst', 'Wind dispersal via parachutelike pappus hairs', 'Water floating via fibrous husks', 'Animal ingestion with sticky hooks', 'Ant seed carrying'],
        correctIndex: 1,
        explanation: `Dandelion seeds possess light, feathery parachutes (pappus) designed for long-distance wind dispersal.`,
        concept: 'Seed Dispersal Adaptations',
      },
      {
        questionText: `Why do insectivorous plants like the Pitcher Plant and Venus Flytrap capture and digest small insects?`,
        options: ['To obtain carbohydrates when sunlight is low', 'To obtain vital nitrogen from soils deficient in nitrates', 'To absorb extra water during droughts', 'To prevent insect pests from eating flower petals', 'To generate body warmth'],
        correctIndex: 1,
        explanation: `Insectivorous plants grow in acidic, nitrogen-poor bogs and digest insects to fulfill their nitrogen requirements.`,
        concept: 'Insectivorous Adaptations',
      },
      {
        questionText: `What major physiological process creates the negative hydrostatic pull that elevates sap in tall forest trees?`,
        options: ['Guttation', 'Transpiration pull', 'Phloem translocation', 'Cellular respiration', 'Fermentation'],
        correctIndex: 1,
        explanation: `Transpiration (evaporation of water from leaf stomata) generates high suction tension in xylem vessels.`,
        concept: 'Transpiration Stream',
      },
      {
        questionText: `Which part of a flower develops into a fruit after successful double fertilization?`,
        options: ['Ovule', 'Ovary', 'Stigma', 'Anther', 'Sepal'],
        correctIndex: 1,
        explanation: `Following fertilization, the ovary enlarges and ripens into the fruit, while ovules mature into seeds.`,
        concept: 'Flower Fertilization & Fruit',
      },
      {
        questionText: `Which gas is absorbed by green plants during the daylight photosynthetic light reactions?`,
        options: ['Nitrogen gas (N₂)', 'Carbon Dioxide (CO₂)', 'Oxygen gas (O₂)', 'Argon gas (Ar)', 'Methane (CH₄)'],
        correctIndex: 1,
        explanation: `Plants absorb CO₂ through leaf stomata and react it with H₂O in the presence of light to make glucose.`,
        concept: 'Photosynthetic Reactants',
      },
      {
        questionText: `What happens to plant stomata during severe drought conditions to prevent fatal dehydration?`,
        options: ['They open wider to absorb atmospheric humidity', 'Guard cells lose turgidity and close stomatal pores', 'Stomata permanently drop off the leaves', 'They multiply rapidly on the upper epidermis', 'They secrete sugary wax'],
        correctIndex: 1,
        explanation: `Under water deficit, abscisic acid triggers guard cells to release water and close the pores, halting transpiration.`,
        concept: 'Drought Defense Mechanisms',
      },
      {
        questionText: `Which of the following is a non-flowering vascular plant that reproduces via spores?`,
        options: ['Sunflower', 'Fern', 'Mango tree', 'Pea plant', 'Rose'],
        correctIndex: 1,
        explanation: `Ferns (pteridophytes) possess vascular xylem and phloem but do not produce flowers; they reproduce using microscopic spores.`,
        concept: 'Pteridophyte Biology',
      },
      {
        questionText: `What is the primary function of cotyledons within a mature seed?`,
        options: ['To anchor the root deeply', 'To store reserve food nutrients for the developing embryo', 'To attract pollinating insects', 'To absorb light before the seed sprouts', 'To produce floral nectar'],
        correctIndex: 1,
        explanation: `Cotyledons (seed leaves) store starch, protein, or lipid reserves that nourish the germinating embryo until true leaves form.`,
        concept: 'Seed Anatomy & Cotyledons',
      },
      {
        questionText: `Which chemical reagent is used in the laboratory to confirm the presence of starch in a destarched leaf?`,
        options: ['Benedict solution', 'Dilute Iodine solution (turns blue-black)', 'Biuret reagent', 'Litmus paper', 'Methyl orange'],
        correctIndex: 1,
        explanation: `Iodine reacts specifically with starch polymers to form a distinctive dark blue-black complex.`,
        concept: 'Starch Iodine Test',
      },
      {
        questionText: `Which modified stem grows horizontally under the soil and stores nutrients (e.g. Ginger)?`,
        options: ['Taproot', 'Rhizome', 'Tuberous root', 'Tendril', 'Runner'],
        correctIndex: 1,
        explanation: `A rhizome is a modified underground stem with nodes, internodes, and buds that stores reserve nutrients.`,
        concept: 'Plant Stem Modifications',
      },
      {
        questionText: `Which process occurs in plant cells continuously both day and night?`,
        options: ['Photosynthesis', 'Cellular respiration', 'Phototropism', 'Seed germination', 'Pollination'],
        correctIndex: 1,
        explanation: `Cellular respiration (consuming glucose and oxygen to generate ATP energy) occurs 24 hours a day in all living plant cells.`,
        concept: 'Plant Cellular Respiration',
      },
    ];

    return scienceBotanyBlueprints[qIdx];
  }

  // Zoology, Cells, Human Body, Microorganisms
  if (c.includes('cell') || c.includes('animal') || c.includes('human') || c.includes('micro') || c.includes('nutrient') || c.includes('food')) {
    const scienceBioBlueprints: QuestionBlueprint[] = [
      {
        questionText: `Which cellular organelle is recognized as the "Powerhouse of the Cell" for generating ATP energy?`,
        options: ['Endoplasmic reticulum', 'Mitochondria', 'Golgi apparatus', 'Lysosome', 'Centrosome'],
        correctIndex: 1,
        explanation: `Mitochondria carry out aerobic cellular respiration, generating adenosine triphosphate (ATP) molecules.`,
        concept: 'Cell Powerhouse (Mitochondria)',
      },
      {
        questionText: `Which cellular structure is present in plant cells but completely absent in animal cells?`,
        options: ['Plasma membrane', 'Cell wall composed of cellulose', 'Ribosomes', 'Nuclear membrane', 'Cytoplasm'],
        correctIndex: 1,
        explanation: `Animal cells are bounded only by a flexible plasma membrane, lacking the rigid cellulose cell wall of plants.`,
        concept: 'Plant vs Animal Cell Structures',
      },
      {
        questionText: `What type of movable joint is found at the human shoulder and hip, permitting motion in all directions?`,
        options: ['Hinge joint', 'Ball-and-socket joint', 'Pivot joint', 'Gliding joint', 'Fixed suture joint'],
        correctIndex: 1,
        explanation: `Ball-and-socket joints permit rotational movement in multiple planes around a central axis.`,
        concept: 'Human Skeletal Articulations',
      },
      {
        questionText: `Which deficiency disease is caused by an acute lack of Vitamin C in the daily human diet?`,
        options: ['Rickets', 'Scurvy (bleeding gums & poor wound healing)', 'Beriberi', 'Night blindness', 'Goitre'],
        correctIndex: 1,
        explanation: `Vitamin C (ascorbic acid) deficiency impairs collagen synthesis, leading to scurvy with fragile capillaries.`,
        concept: 'Vitamin Deficiency Pathologies',
      },
      {
        questionText: `Which component of human blood is primarily responsible for clotting and preventing excessive hemorrhage?`,
        options: ['Red Blood Cells (Erythrocytes)', 'Platelets (Thrombocytes)', 'White Blood Cells (Leukocytes)', 'Blood Plasma', 'Hemoglobin'],
        correctIndex: 1,
        explanation: `Platelets adhere to damaged vessel walls and release coagulation factors to form fibrin blood clots.`,
        concept: 'Hematology & Hemostasis',
      },
      {
        questionText: `Which organ in the human digestive tract is the principal site for the chemical absorption of digested nutrients?`,
        options: ['Stomach', 'Small intestine (Villi)', 'Large intestine', 'Esophagus', 'Gallbladder'],
        correctIndex: 1,
        explanation: `The small intestine's inner lining possesses millions of microscopic finger-like projections (villi) maximizing nutrient absorption.`,
        concept: 'Digestive System Physiology',
      },
      {
        questionText: `Which microorganism is used in the commercial bakery and brewing industries for alcoholic and carbon dioxide fermentation?`,
        options: ['Amoeba', 'Yeast (Saccharomyces cerevisiae)', 'Paramecium', 'Penicillium', 'Blue-green algae'],
        correctIndex: 1,
        explanation: `Yeast ferments sugars anaerobically to yield ethanol and CO₂ gas, which causes bread dough to rise.`,
        concept: 'Industrial Microbiology',
      },
      {
        questionText: `What type of pathogen causes Malaria in humans, transmitted via the bite of the female Anopheles mosquito?`,
        options: ['Bacterium', 'Protozoan (Plasmodium parasite)', 'Virus', 'Fungus', 'Helminth worm'],
        correctIndex: 1,
        explanation: `Malaria is caused by the unicellular protozoan parasite Plasmodium, vectored by female Anopheles mosquitoes.`,
        concept: 'Vector-Borne Pathologies',
      },
      {
        questionText: `Which endocrine gland in the human body is known as the "Master Gland" for controlling other hormone glands?`,
        options: ['Thyroid gland', 'Pituitary gland', 'Adrenal gland', 'Pancreas', 'Thymus'],
        correctIndex: 1,
        explanation: `The pituitary gland, located at the base of the brain, secretes trophic hormones regulating thyroid, adrenals, and gonads.`,
        concept: 'Endocrine Coordination',
      },
      {
        questionText: `What is the normal resting breathing rate of an adult human at rest?`,
        options: ['6 to 8 breaths per minute', '12 to 18 breaths per minute', '30 to 40 breaths per minute', '60 to 80 breaths per minute', '2 to 4 breaths per minute'],
        correctIndex: 1,
        explanation: `A healthy resting adult breathes approximately 12 to 18 cycles per minute under basal conditions.`,
        concept: 'Respiratory Physiology',
      },
      {
        questionText: `Which organelle contains powerful digestive hydrolytic enzymes to degrade worn-out cellular waste ("Suicide Bags")?`,
        options: ['Peroxisome', 'Lysosome', 'Centriole', 'Vacuole', 'Ribosome'],
        correctIndex: 1,
        explanation: `Lysosomes contain acid hydrolases that digest cellular debris and can trigger autolysis if ruptured.`,
        concept: 'Lysosome Function',
      },
      {
        questionText: `Which mineral is critically essential for the synthesis of thyroid hormones (Thyroxine) in humans?`,
        options: ['Calcium', 'Iodine', 'Iron', 'Sodium', 'Phosphorus'],
        correctIndex: 1,
        explanation: `Iodine is an essential micronutrient incorporated into thyroxine; deficiency causes thyroid enlargement (goitre).`,
        concept: 'Trace Minerals & Metabolism',
      },
      {
        questionText: `Which chamber of the four-chambered human heart pumps oxygenated blood directly into the systemic Aorta?`,
        options: ['Right atrium', 'Left ventricle', 'Right ventricle', 'Left atrium', 'Pulmonary artery'],
        correctIndex: 1,
        explanation: `The muscular left ventricle contracts forcefully to propel oxygenated blood through the aortic valve to the entire body.`,
        concept: 'Cardiovascular Circulatory Mechanics',
      },
      {
        questionText: `Which of the following organisms reproduces asexually through the process of binary fission?`,
        options: ['Hydra', 'Amoeba', 'Planaria', 'Spirogyra', 'Yeast'],
        correctIndex: 1,
        explanation: `Amoeba replicates its genetic material and divides its single cell symmetrically into two daughter organisms via binary fission.`,
        concept: 'Asexual Binary Fission',
      },
      {
        questionText: `What primary structural protein forms human hair, fingernails, and animal hooves?`,
        options: ['Collagen', 'Keratin', 'Actin', 'Myosin', 'Fibrin'],
        correctIndex: 1,
        explanation: `Keratin is a tough fibrous structural protein that protects epithelial cells from mechanical stress.`,
        concept: 'Biomolecules & Proteins',
      },
      {
        questionText: `Which respiratory pigment inside human red blood cells binds reversibly with oxygen molecules?`,
        options: ['Chlorophyll', 'Hemoglobin', 'Myoglobin', 'Carotene', 'Bilirubin'],
        correctIndex: 1,
        explanation: `Hemoglobin is an iron-containing metalloprotein in red blood cells that transports oxygen from lungs to tissues.`,
        concept: 'Oxygen Transport Dynamics',
      },
      {
        questionText: `What is the functional structural filtration unit of the human kidney called?`,
        options: ['Neuron', 'Nephron', 'Alveolus', 'Hepatocyte', 'Axon'],
        correctIndex: 1,
        explanation: `Nephrons are microscopic tubular structures in the kidney cortex and medulla that filter blood and produce urine.`,
        concept: 'Renal Excretory Biology',
      },
      {
        questionText: `Which category of nutrient is the human body's primary and most rapid source of energy?`,
        options: ['Proteins', 'Carbohydrates', 'Fats / Lipids', 'Vitamins', 'Dietary Minerals'],
        correctIndex: 1,
        explanation: `Carbohydrates are rapidly broken down into glucose, the primary metabolic fuel for cellular ATP generation.`,
        concept: 'Macronutrient Energetics',
      },
      {
        questionText: `What is the specialized junction across which an electrical or chemical nerve impulse passes between two neurons?`,
        options: ['Axon hillock', 'Synapse', 'Myelin sheath', 'Dendrite tip', 'Nodes of Ranvier'],
        correctIndex: 1,
        explanation: `A synapse is the microscopic gap across which neurotransmitters diffuse to transmit signals from one neuron to the next.`,
        concept: 'Neurobiology & Synaptic Transmission',
      },
      {
        questionText: `Which antibiotic was famously discovered in 1928 by Alexander Fleming from a Penicillium mold contamination?`,
        options: ['Streptomycin', 'Penicillin', 'Tetracycline', 'Amoxicillin', 'Erythromycin'],
        correctIndex: 1,
        explanation: `Alexander Fleming discovered penicillin produced by the fungus Penicillium notatum, revolutionizing antibacterial medicine.`,
        concept: 'Pharmacology & Historical Science',
      },
    ];

    return scienceBioBlueprints[qIdx];
  }

  // Physics, Mechanics, Chemistry, Electricity & Environment (General Science)
  const sciencePhysicsChemBlueprints: QuestionBlueprint[] = [
    {
      questionText: `What is the standard SI unit of Force?`,
      options: ['Joule', 'Newton (N)', 'Pascal', 'Watt', 'Kilogram'],
      correctIndex: 1,
      explanation: `The SI unit of force is the Newton (N), defined as 1 kg·m/s².`,
      concept: 'SI Units of Mechanics',
    },
    {
      questionText: `How is physical pressure mathematically defined in terms of applied thrust force (F) and contact surface area (A)?`,
      options: ['Pressure = Force × Area', 'Pressure = Force ÷ Area (P = F / A)', 'Pressure = Area ÷ Force', 'Pressure = Force + Area', 'Pressure = (Force)² / Area'],
      correctIndex: 1,
      explanation: `Pressure is perpendicular force per unit area: P = F / A, measured in Pascals (N/m²).`,
      concept: 'Fluid & Solid Pressure',
    },
    {
      questionText: `Which gas is briskly released when active metals (such as Zinc) react with dilute Hydrochloric acid?`,
      options: ['Oxygen gas', 'Hydrogen gas (H₂)', 'Carbon dioxide', 'Nitrogen dioxide', 'Chlorine gas'],
      correctIndex: 1,
      explanation: `Metals displace hydrogen from dilute acids: Zn + 2HCl -> ZnCl₂ + H₂↑ (burns with a pop sound).`,
      concept: 'Metal Acid Reactivity',
    },
    {
      questionText: `Under which environmental condition can sound waves NEVER travel?`,
      options: ['Dense steel solids', 'Pure vacuum (Empty space)', 'Deep ocean water', 'Hot compressed air', 'Liquid mercury'],
      correctIndex: 1,
      explanation: `Sound is a mechanical pressure wave requiring a material medium; it cannot propagate through a vacuum.`,
      concept: 'Acoustics & Wave Propagation',
    },
    {
      questionText: `What is the pH value of pure neutral distilled water at 25°C?`,
      options: ['0', '7.0', '14.0', '1.0', '5.5'],
      correctIndex: 1,
      explanation: `On the logarithmic pH scale, a value of 7.0 represents exact neutrality where [H⁺] = [OH⁻].`,
      concept: 'Acid-Base Neutrality',
    },
    {
      questionText: `According to the law of reflection of light, how does the angle of incidence (i) compare to the angle of reflection (r)?`,
      options: ['i > r always', 'Angle of Incidence equals Angle of Reflection (i = r)', 'i + r = 180°', 'i = 2r', 'i < r always'],
      correctIndex: 1,
      explanation: `The fundamental law of reflection states that the angle of incidence strictly equals the angle of reflection: ∠i = ∠r.`,
      concept: 'Geometric Optics Laws',
    },
    {
      questionText: `Which type of mirror is utilized as the side rear-view mirror in motor automobiles to provide a wide field of view?`,
      options: ['Concave mirror', 'Convex mirror', 'Plane mirror', 'Parabolic mirror', 'Cylindrical mirror'],
      correctIndex: 1,
      explanation: `Convex mirrors always produce erect, virtual, and diminished images, providing a wide rearward visual field.`,
      concept: 'Optical Mirrors in Technology',
    },
    {
      questionText: `What physical electrical property is measured using an Ammeter connected in series within a circuit?`,
      options: ['Electrical potential difference (Voltage)', 'Electric current (Amperes)', 'Electrical resistance (Ohms)', 'Power consumed (Watts)', 'Capacitance'],
      correctIndex: 1,
      explanation: `An ammeter measures electric current (rate of flow of charge) and is wired in series.`,
      concept: 'Electrical Instrumentation',
    },
    {
      questionText: `What type of chemical change occurs when iron metal is exposed to moist atmospheric oxygen and forms rust (Fe₂O₃·xH₂O)?`,
      options: ['Physical change', 'Oxidation reaction (Corrosion)', 'Thermal decomposition', 'Endothermic sublimation', 'Neutralization'],
      correctIndex: 1,
      explanation: `Rusting is a slow exothermic chemical oxidation where iron combines with oxygen and water vapor.`,
      concept: 'Chemical Oxidation of Metals',
    },
    {
      questionText: `Which method of heat transfer does NOT require any physical medium and allows solar energy to reach the Earth across space?`,
      options: ['Conduction', 'Thermal Radiation', 'Convection', 'Advection', 'Evaporation'],
      correctIndex: 1,
      explanation: `Thermal radiation travels via electromagnetic waves (infrared and light) and propagates unimpeded through empty vacuum.`,
      concept: 'Thermal Energy Transfer',
    },
    {
      questionText: `What is the chemical formula for common baking soda used in cooking?`,
      options: ['Sodium carbonate (Na₂CO₃)', 'Sodium hydrogen carbonate (NaHCO₃)', 'Sodium hydroxide (NaOH)', 'Calcium carbonate (CaCO₃)', 'Sodium chloride (NaCl)'],
      correctIndex: 1,
      explanation: `Baking soda is sodium hydrogen carbonate (sodium bicarbonate), formula NaHCO₃.`,
      concept: 'Household Chemical Compounds',
    },
    {
      questionText: `Which layer of the Earth's atmosphere contains the vital Ozone Layer that shields terrestrial life from harmful solar UV radiation?`,
      options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere', 'Exosphere'],
      correctIndex: 1,
      explanation: `The stratosphere (approx 15 to 35 km above sea level) houses the ozone layer (O₃) which absorbs solar ultraviolet-B radiation.`,
      concept: 'Atmospheric Layers & Ozone',
    },
    {
      questionText: `Which fundamental law of physics states that "An object will remain at rest or in uniform straight motion unless acted upon by an external net force"?`,
      options: ['Newton’s Third Law', 'Newton’s First Law of Motion (Inertia)', 'Newton’s Second Law of Motion', 'Law of Universal Gravitation', 'Ohm’s Law'],
      correctIndex: 1,
      explanation: `Newton's First Law describes inertia: matter resists changes to its state of rest or uniform motion.`,
      concept: 'Classical Laws of Dynamics',
    },
    {
      questionText: `Which non-metal is an exceptional conductor of electricity due to free delocalized valence electrons?`,
      options: ['Diamond', 'Graphite (Allotrope of Carbon)', 'Sulphur', 'Phosphorus', 'Iodine'],
      correctIndex: 1,
      explanation: `Graphite has planar hexagonal carbon sheets with delocalized pi electrons that drift freely to conduct current.`,
      concept: 'Allotropes & Conductivity',
    },
    {
      questionText: `What is the SI unit of Electrical Resistance?`,
      options: ['Volt', 'Ohm (Ω)', 'Ampere', 'Coulomb', 'Farad'],
      correctIndex: 1,
      explanation: `Electrical resistance is measured in Ohms (Ω), representing the ratio of potential difference to current (V / I).`,
      concept: 'Ohmic Circuit Theory',
    },
    {
      questionText: `What optical phenomenon causes white sunlight passing through a triangular glass prism to split into seven rainbow spectrum colors?`,
      options: ['Total internal reflection', 'Dispersion of light', 'Polarization', 'Diffraction', 'Absorption'],
      correctIndex: 1,
      explanation: `Dispersion occurs because different wavelengths of light travel at different speeds through glass and refract at varying angles.`,
      concept: 'Dispersion of Light',
    },
    {
      questionText: `Which greenhouse gas, emitted from fossil fuel combustion and deforestation, is the chief driver of anthropogenic global warming?`,
      options: ['Argon (Ar)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Oxygen (O₂)', 'Helium (He)'],
      correctIndex: 1,
      explanation: `Carbon dioxide absorbs and re-emits infrared heat energy radiated from Earth's surface, enhancing the greenhouse effect.`,
      concept: 'Environmental Greenhouse Dynamics',
    },
    {
      questionText: `What type of friction opposes the initiation of motion between two touching surfaces before sliding commences?`,
      options: ['Rolling friction', 'Static friction', 'Sliding friction', 'Fluid friction (drag)', 'Viscous friction'],
      correctIndex: 1,
      explanation: `Static friction acts between stationary surfaces to balance applied force until the threshold of limiting friction is surpassed.`,
      concept: 'Tribology & Types of Friction',
    },
    {
      questionText: `What is the chemical name of rust?`,
      options: ['Ferrous sulphate', 'Hydrated Iron(III) oxide (Fe₂O₃·xH₂O)', 'Iron sulphide', 'Iron carbonate', 'Ferric chloride'],
      correctIndex: 1,
      explanation: `Rust is chemically hydrated iron(III) oxide with varying molecules of water crystallization: Fe₂O₃·xH₂O.`,
      concept: 'Corrosion Chemistry',
    },
    {
      questionText: `Which physical process describes the direct phase transition of a substance from solid directly into gas without passing through liquid?`,
      options: ['Condensation', 'Sublimation (e.g. Camphor, Dry Ice)', 'Evaporation', 'Deposition', 'Liquefaction'],
      correctIndex: 1,
      explanation: `Sublimation is the direct endothermic phase transformation from solid to vapor phase (seen in camphor, ammonium chloride, and solid CO₂).`,
      concept: 'States of Matter & Phase Changes',
    },
  ];

  return sciencePhysicsChemBlueprints[qIdx];
}

// ==========================================
// 3. ENGLISH QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getEnglishQuestion(chapter: string, i: number): QuestionBlueprint {
  const qIdx = (i - 1) % 20;

  const englishBlueprints: QuestionBlueprint[] = [
    {
      questionText: `Identify the collective noun in the sentence: "A pride of lions rested under the acacia tree."`,
      options: ['lions', 'pride', 'acacia', 'tree', 'rested'],
      correctIndex: 1,
      explanation: `'Pride' is the specific collective noun designated for a family group of lions.`,
      concept: 'Parts of Speech: Collective Nouns',
    },
    {
      questionText: `Choose the verb that correctly agrees with the compound subject: "Neither the teacher nor the students ______ in favor of postponing the exam."`,
      options: ['is', 'were', 'was', 'has been', 'be'],
      correctIndex: 1,
      explanation: `With correlative conjunctions 'neither... nor...', the verb agrees in number with the closer subject ('students' = plural, hence 'were').`,
      concept: 'Subject-Verb Concord',
    },
    {
      questionText: `Convert to passive voice: "The architect designed an innovative eco-friendly campus."`,
      options: [
        'An innovative eco-friendly campus is designed by the architect.',
        'An innovative eco-friendly campus was designed by the architect.',
        'An innovative eco-friendly campus had been designed by the architect.',
        'The architect had been designed by an innovative eco-friendly campus.',
        'An innovative eco-friendly campus will be designed by architect.',
      ],
      correctIndex: 1,
      explanation: `Past simple active ('designed') converts to past simple passive ('was designed') followed by the agent.`,
      concept: 'Active and Passive Voice',
    },
    {
      questionText: `Convert to indirect reported speech: Rohan said, "I am studying for my scholarship test."`,
      options: [
        'Rohan said that he is studying for his scholarship test.',
        'Rohan said that he was studying for his scholarship test.',
        'Rohan said that I was studying for my scholarship test.',
        'Rohan told that he had studied for his scholarship test.',
        'Rohan says that he will study for scholarship test.',
      ],
      correctIndex: 1,
      explanation: `Present continuous ('am studying') shifts back to past continuous ('was studying') with first-person pronoun shifted to third person.`,
      concept: 'Direct and Indirect Speech',
    },
    {
      questionText: `Identify the tense of the verb in: "By next December, we will have completed our high school coursework."`,
      options: ['Future Continuous Tense', 'Future Perfect Tense', 'Simple Future Tense', 'Future Perfect Continuous', 'Present Perfect Tense'],
      correctIndex: 1,
      explanation: `'Will have completed' utilizes will + have + past participle, denoting the Future Perfect tense.`,
      concept: 'Verb Tenses Identification',
    },
    {
      questionText: `Choose the appropriate modal auxiliary indicating strong personal obligation or necessity: "You ______ wear a protective helmet when riding a motorized scooter."`,
      options: ['might', 'must', 'could', 'may', 'would'],
      correctIndex: 1,
      explanation: `'Must' communicates mandatory obligation or legal necessity.`,
      concept: 'Modal Auxiliaries',
    },
    {
      questionText: `Choose the correct preposition to complete the phrase: "She has been proficient in classical piano ______ she was six years old."`,
      options: ['for', 'since', 'from', 'during', 'by'],
      correctIndex: 1,
      explanation: `'Since' specifies a definite starting point in past time with the perfect tense.`,
      concept: 'Prepositions of Time',
    },
    {
      questionText: `Which subordinating conjunction best connects these clauses expressing concession: "______ it was raining heavily, the soccer match went ahead as scheduled."`,
      options: ['Because', 'Although', 'Since', 'Unless', 'Therefore'],
      correctIndex: 1,
      explanation: `'Although' introduces a concessive subordinate clause showing an unexpected outcome despite opposing conditions.`,
      concept: 'Conjunctions & Connectors',
    },
    {
      questionText: `Which word is the most precise synonym for the academic term "meticulous"?`,
      options: ['Hasty', 'Thorough and painstaking', 'Indifferent', 'Superficial', 'Reluctant'],
      correctIndex: 1,
      explanation: `'Meticulous' means showing extreme care, rigorous precision, and painstaking attention to details.`,
      concept: 'Academic Vocabulary: Synonyms',
    },
    {
      questionText: `Select the word that is an exact antonym of "ephemeral" (short-lived):`,
      options: ['Fleeting', 'Permanent (Enduring)', 'Transient', 'Fragile', 'Momentary'],
      correctIndex: 1,
      explanation: `'Ephemeral' means lasting for a very brief time; its true antonym is 'permanent' or 'enduring'.`,
      concept: 'Academic Vocabulary: Antonyms',
    },
    {
      questionText: `What is the meaning of the common English idiom: "to burn the midnight oil"?`,
      options: ['To waste electrical power unnecessarily', 'To study or work diligently late into the night', 'To cause an accidental kitchen fire', 'To wake up before sunrise', 'To give up on an assignment'],
      correctIndex: 1,
      explanation: `'Burn the midnight oil' is an idiomatic metaphor meaning to work or study late into the night.`,
      concept: 'Idioms and Figurative Phrases',
    },
    {
      questionText: `Identify the relative pronoun in the complex sentence: "The scientist whose research won the prestigious award gave a memorable keynote."`,
      options: ['award', 'whose', 'keynote', 'scientist', 'gave'],
      correctIndex: 1,
      explanation: `'Whose' is a possessive relative pronoun connecting the dependent adjectival clause to the antecedent noun 'scientist'.`,
      concept: 'Relative Pronouns & Clauses',
    },
    {
      questionText: `Which figure of speech is demonstrated in: "The autumn leaves danced gracefully in the howling wind"?`,
      options: ['Hyperbole', 'Personification', 'Simile', 'Irony', 'Oxymoron'],
      correctIndex: 1,
      explanation: `Personification attributes human qualities (dancing gracefully) to non-human inanimate objects (leaves).`,
      concept: 'Figures of Speech & Literary Devices',
    },
    {
      questionText: `Which sentence is punctuated with complete grammatical accuracy?`,
      options: [
        'Its a shame that the dog hurt it\'s paw.',
        'It\'s a shame that the dog hurt its paw.',
        'Its a shame that the dog hurt its\' paw.',
        'It\'s a shame that the dog hurt its\' paw.',
        'Its\' a shame that the dog hurt it paw.',
      ],
      correctIndex: 1,
      explanation: `'It's' is the contraction for 'it is', whereas 'its' is the possessive pronoun without an apostrophe.`,
      concept: 'Punctuation & Apostrophe Precision',
    },
    {
      questionText: `Identify the dependent adverbial clause of condition: "You will achieve mastery provided that you practice with disciplined focus."`,
      options: ['"You will achieve mastery"', '"provided that you practice with disciplined focus"', '"achieve mastery provided"', '"with disciplined focus"', '"You will achieve"'],
      correctIndex: 1,
      explanation: `'Provided that you practice with disciplined focus' expresses the conditional circumstance under which mastery occurs.`,
      concept: 'Adverbial Clauses',
    },
    {
      questionText: `What is the correct plural spelling for the singular noun "hypothesis"?`,
      options: ['Hypothesises', 'Hypotheses', 'Hypothesis\'s', 'Hypotheticals', 'Hypothesi'],
      correctIndex: 1,
      explanation: `Words of Greek origin ending in '-is' change to '-es' in the plural: crisis -> crises, hypothesis -> hypotheses.`,
      concept: 'Irregular Plural Morphology',
    },
    {
      questionText: `In professional email communication, what does the acronym "FYI" stand for?`,
      options: ['For Your Instruction', 'For Your Information', 'Follow Your Instinct', 'File Your Invoice', 'Fast Yearly Index'],
      correctIndex: 1,
      explanation: `FYI stands for 'For Your Information', used when sharing contextual details that do not require urgent action.`,
      concept: 'Written Register & Acronyms',
    },
    {
      questionText: `Which of the following sentences contains a dangling modifier error?`,
      options: [
        'Walking into the laboratory, the scientist observed the reaction.',
        'Walking into the laboratory, the test tubes fell on the floor.',
        'The scientist observed the reaction while walking into the laboratory.',
        'As the scientist walked into the laboratory, the reaction occurred.',
        'Upon entering the laboratory, the team observed the reaction.',
      ],
      correctIndex: 1,
      explanation: `In option B, the participle phrase 'Walking into the laboratory' illogically modifies 'the test tubes' (test tubes cannot walk).`,
      concept: 'Syntax & Modifier Errors',
    },
    {
      questionText: `Identify the tone of an author who writes: "While the hypothesis is ambitious, the empirical methodology suffers from fatal sampling bias."`,
      options: ['Enthusiastic and celebratory', 'Critical and analytical', 'Indifferent and bored', 'Sarcastic and humorous', 'Nostalgic'],
      correctIndex: 1,
      explanation: `The author evaluates the claims objectively while pointing out analytical methodology flaws, displaying a critical tone.`,
      concept: 'Comprehension & Tone Analysis',
    },
    {
      questionText: `Which prefix when added to the root word "competent" creates an antonym signifying lack of required capability?`,
      options: ['Dis-', 'In- (Incompetent)', 'Un-', 'Mis-', 'Il-'],
      correctIndex: 1,
      explanation: `The prefix 'in-' combines with 'competent' to form 'incompetent', meaning lacking adequate skill or qualification.`,
      concept: 'Morphological Derivation: Prefixes',
    },
  ];

  return englishBlueprints[qIdx];
}

// ==========================================
// 4. SOCIAL SCIENCE QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getSocialScienceQuestion(chapter: string, i: number): QuestionBlueprint {
  const qIdx = (i - 1) % 20;

  const sstBlueprints: QuestionBlueprint[] = [
    {
      questionText: `Which remarkable public architecture discovered at Mohenjo-daro indicates advanced sanitary and civic engineering in the Indus Valley?`,
      options: ['The Royal Amphitheater', 'The Great Bath', 'The Iron Pillar', 'The Sun Temple', 'The Grand Pyramid'],
      correctIndex: 1,
      explanation: `The Great Bath at Mohenjo-daro featured water-tight baked brick lining with gypsum mortar and sophisticated drainage channels.`,
      concept: 'Indus Valley Urban Civilizations',
    },
    {
      questionText: `Who was the renowned prime advisor and political strategist behind Emperor Chandragupta Maurya and author of the 'Arthashastra'?`,
      options: ['Megasthenes', 'Chanakya (Kautilya)', 'Banabhatta', 'Harishena', 'Patanjali'],
      correctIndex: 1,
      explanation: `Chanakya (Kautilya) authored the 'Arthashastra', a comprehensive treatise on statecraft, economic policy, and military strategy.`,
      concept: 'Mauryan Imperial Administration',
    },
    {
      questionText: `Which tragic military confrontation prompted Emperor Ashoka to renounce warfare and adopt the policy of 'Dharmavijaya' (conquest through righteousness)?`,
      options: ['Battle of Panipat', 'Kalinga War (circa 261 BCE)', 'Battle of Tarain', 'Battle of Plassey', 'Battle of Hydaspes'],
      correctIndex: 1,
      explanation: `The horrific slaughter and grief witnessed during the Kalinga War led Ashoka to embrace Buddhism and preach peace.`,
      concept: 'Ashoka & Buddhist Edicts',
    },
    {
      questionText: `Which Mughal ruler introduced the administrative 'Mansabdari System' and the syncretic ethical philosophy 'Din-i-Ilahi'?`,
      options: ['Babur', 'Akbar the Great', 'Jahangir', 'Aurangzeb', 'Shah Jahan'],
      correctIndex: 1,
      explanation: `Akbar instituted the Mansabdari rank system for civil-military administration and promoted universal tolerance (Sulh-i-Kul).`,
      concept: 'Mughal Governance Systems',
    },
    {
      questionText: `The decisive victory of the British East India Company under Robert Clive in which 1757 battle laid the foundation of British dominion in Bengal?`,
      options: ['Battle of Buxar', 'Battle of Plassey (1757)', 'Battle of Wandiwash', 'Battle of Assaye', 'Battle of Seringapatam'],
      correctIndex: 1,
      explanation: `In the Battle of Plassey (23 June 1757), Clive defeated Nawab Siraj-ud-Daulah, seizing fiscal dominance over Bengal.`,
      concept: 'Colonial Expansion in India',
    },
    {
      questionText: `Who is revered as the "Father of the Indian Constitution" and served as Chairman of the Drafting Committee?`,
      options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel', 'Dr. Rajendra Prasad'],
      correctIndex: 1,
      explanation: `Dr. B.R. Ambedkar guided the drafting of the Constitution and championed fundamental social and civil liberties.`,
      concept: 'Indian Constitutional History',
    },
    {
      questionText: `Which Fundamental Right in the Indian Constitution (Article 32) was described by Dr. Ambedkar as the "Heart and Soul of the Constitution"?`,
      options: ['Right to Equality', 'Right to Constitutional Remedies (Article 32)', 'Right to Freedom of Speech', 'Right to Education', 'Cultural and Educational Rights'],
      correctIndex: 1,
      explanation: `Article 32 guarantees direct access to the Supreme Court to issue writs (Habeas Corpus, Mandamus, etc.) enforcing Fundamental Rights.`,
      concept: 'Fundamental Rights & Judicial Writs',
    },
    {
      questionText: `What is the minimum qualifying age for an Indian citizen to vote under Universal Adult Suffrage?`,
      options: ['16 years', '18 years', '21 years', '25 years', '20 years'],
      correctIndex: 1,
      explanation: `The 61st Constitutional Amendment Act lowered the voting age for all citizens from 21 to 18 years.`,
      concept: 'Universal Adult Suffrage',
    },
    {
      questionText: `What is the upper constitutional limit of total elected members in the Lok Sabha (House of the People)?`,
      options: ['250 members', '543 elected members', '600 members', '450 members', '300 members'],
      correctIndex: 1,
      explanation: `The Lok Sabha currently consists of 543 elected constituencies directly chosen by the electorate across Indian states and UTs.`,
      concept: 'Parliamentary Architecture',
    },
    {
      questionText: `Which type of soil, predominantly distributed across the volcanic Deccan Trap, is also known as 'Regur' and is ideal for cotton cultivation?`,
      options: ['Alluvial soil', 'Black soil (Regur)', 'Laterite soil', 'Arid desert soil', 'Peaty soil'],
      correctIndex: 1,
      explanation: `Black soil, formed by weathered basaltic lava, has high clay content and moisture retention, making it prime for cotton.`,
      concept: 'Pedology & Agricultural Soils',
    },
    {
      questionText: `Which imaginary line of latitude at approximately 23° 30′ N divides India almost equally into two climatic halves?`,
      options: ['Equator', 'Tropic of Cancer (23°30′ N)', 'Tropic of Capricorn', 'Arctic Circle', 'Prime Meridian'],
      correctIndex: 1,
      explanation: `The Tropic of Cancer passes through 8 Indian states, demarcating tropical southern India from sub-tropical northern India.`,
      concept: 'Physical Geography of India',
    },
    {
      questionText: `Which perennial Himalayan river originates near Lake Mansarovar in Tibet (known as Tsangpo) before entering India through Arunachal Pradesh?`,
      options: ['Ganga', 'Brahmaputra', 'Yamuna', 'Godavari', 'Narmada'],
      correctIndex: 1,
      explanation: `The Brahmaputra originates in Tibet as the Yarlung Tsangpo and enters northeast India through the Dihang gorge.`,
      concept: 'Major River Drainages of India',
    },
    {
      questionText: `Which agricultural cropping season in India coincides with the arrival of the southwest monsoon (sown in June/July and harvested in autumn)?`,
      options: ['Rabi season', 'Kharif season', 'Zaid season', 'Fallow season', 'Perennial season'],
      correctIndex: 1,
      explanation: `Kharif crops (e.g. paddy rice, maize, cotton, groundnut) depend heavily on monsoon rains between June and October.`,
      concept: 'Agricultural Cropping Calendars',
    },
    {
      questionText: `Which mineral resource is famously extracted from the offshore 'Mumbai High' geological field in the Arabian Sea?`,
      options: ['Bauxite', 'Petroleum (Crude Oil)', 'Manganese', 'Coal', 'Mica'],
      correctIndex: 1,
      explanation: `Mumbai High is an offshore oilfield operated by ONGC off the coast of Maharashtra producing substantial domestic crude petroleum.`,
      concept: 'Energy Resources & Mining',
    },
    {
      questionText: `Which tier of the Indian economy includes agriculture, forestry, dairy farming, and fishing?`,
      options: ['Secondary sector', 'Primary sector', 'Tertiary sector', 'Quaternary sector', 'Industrial sector'],
      correctIndex: 1,
      explanation: `The Primary sector directly extracts and harvests natural resources from land, forests, and oceans.`,
      concept: 'Economic Sectors',
    },
    {
      questionText: `What landmark 1973 legal doctrine was established by the Supreme Court of India in the 'Kesavananda Bharati' case?`,
      options: ['Absolute parliamentary supremacy', 'Basic Structure Doctrine', 'Abolition of judicial review', 'Executive supremacy', 'Dual citizenship'],
      correctIndex: 1,
      explanation: `The Supreme Court ruled that Parliament cannot alter the basic structural foundations (secularism, democracy, judicial independence) of the Constitution.`,
      concept: 'Judicial Review & Jurisprudence',
    },
    {
      questionText: `What is the term for a democratic local self-government institution operating at the village level in India?`,
      options: ['Municipal Corporation', 'Gram Panchayat', 'Legislative Council', 'Zila Parishad', 'Rajya Sabha'],
      correctIndex: 1,
      explanation: `The 73rd Constitutional Amendment recognized the Gram Panchayat as the basic grassroots unit of local rural governance.`,
      concept: 'Panchayati Raj & Local Governance',
    },
    {
      questionText: `Which biosphere reserve in West Bengal features the world's largest mangrove forest delta and the Royal Bengal Tiger habitat?`,
      options: ['Kaziranga', 'Sundarbans Biosphere Reserve', 'Nilgiri', 'Nanda Devi', 'Gulf of Mannar'],
      correctIndex: 1,
      explanation: `The Sundarbans delta, formed by the Ganga and Brahmaputra, is a UNESCO World Heritage site and mangrove ecosystem.`,
      concept: 'Biodiversity & Conservation',
    },
    {
      questionText: `Which historic civil disobedience march was led by Mahatma Gandhi in 1930 against the British tax on a basic household necessity?`,
      options: ['Non-Cooperation Movement', 'Dandi Salt March (1930)', 'Chauri Chaura', 'Champaran Satyagraha', 'Quit India Movement'],
      correctIndex: 1,
      explanation: `Gandhi walked 240 miles from Sabarmati to Dandi to break the colonial salt monopoly, sparking nationwide defiance.`,
      concept: 'Indian Independence Struggle',
    },
    {
      questionText: `In democratic economics, what does the 'Human Development Index' (HDI) measure beyond pure economic income?`,
      options: ['Military weapons and budget', 'Life expectancy (health) and literacy/education standards', 'Gold reserves and bullion', 'Stock market capitalization', 'Import tariffs'],
      correctIndex: 1,
      explanation: `The UN's HDI composite index evaluates nations based on decent standard of living (GNI), life expectancy, and mean years of schooling.`,
      concept: 'Development Economics & HDI',
    },
  ];

  return sstBlueprints[qIdx];
}

// ==========================================
// 5. COMPUTER QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getComputerQuestion(chapter: string, i: number): QuestionBlueprint {
  const qIdx = (i - 1) % 20;

  const compBlueprints: QuestionBlueprint[] = [
    {
      questionText: `Which component of the Central Processing Unit (CPU) performs arithmetic computations (+, -, *, /) and logical comparisons?`,
      options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'Cache Memory', 'System Clock', 'Random Access Memory'],
      correctIndex: 1,
      explanation: `The ALU executes all arithmetic operations and boolean decision comparisons within the CPU core.`,
      concept: 'Computer Architecture: ALU',
    },
    {
      questionText: `What is the primary difference between Random Access Memory (RAM) and Read-Only Memory (ROM)?`,
      options: [
        'RAM is permanent storage, whereas ROM is deleted when power turns off',
        'RAM is volatile temporary memory, whereas ROM is non-volatile permanent firmware',
        'RAM cannot be read by the CPU',
        'ROM holds active operating system application tabs',
        'RAM is slower than optical disc media',
      ],
      correctIndex: 1,
      explanation: `RAM loses its stored data when power is disconnected (volatile), while ROM retains firmware instructions permanently (non-volatile).`,
      concept: 'Memory Systems: RAM vs ROM',
    },
    {
      questionText: `Convert the 4-bit binary numeral '1011' into its decimal equivalent:`,
      options: ['9', '11', '13', '15', '7'],
      correctIndex: 1,
      explanation: `Binary 1011 = (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 8 + 0 + 2 + 1 = 11.`,
      concept: 'Binary to Decimal Conversion',
    },
    {
      questionText: `In Python programming, what data type is returned by the expression: type( (1, 2, 3) ) ?`,
      options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>", "<class 'array'>"],
      correctIndex: 1,
      explanation: `Parentheses (1, 2, 3) define an immutable, ordered sequence of type 'tuple'.`,
      concept: 'Python Data Structures: Tuples',
    },
    {
      questionText: `What is the output of the Python integer floor division: 17 // 4 ?`,
      options: ['4.25', '4', '1', '4.0', '5'],
      correctIndex: 1,
      explanation: `The // operator performs floor division, truncating the fractional part and returning the integer quotient 4.`,
      concept: 'Python Arithmetic Operators',
    },
    {
      questionText: `What will the Python expression: '15 % 4' evaluate to?`,
      options: ['3.75', '3', '0', '4', '1'],
      correctIndex: 1,
      explanation: `The % modulo operator yields the integer remainder: 15 = (3 × 4) + 3, so remainder = 3.`,
      concept: 'Modulo Remainder Operations',
    },
    {
      questionText: `What output is generated by the Python code: list(range(2, 10, 3)) ?`,
      options: ['[2, 3, 4, 5, 6, 7, 8, 9]', '[2, 5, 8]', '[2, 5, 8, 11]', '[3, 6, 9]', '[2, 4, 6, 8]'],
      correctIndex: 1,
      explanation: `range(start=2, stop=10, step=3) generates 2, 2+3=5, 5+3=8. 8+3=11 exceeds the stop threshold 10.`,
      concept: 'Python Range Iteration',
    },
    {
      questionText: `In Python, which built-in string method removes all leading and trailing whitespace characters?`,
      options: ['.trim()', '.strip()', '.clean()', '.deleteSpace()', '.chomp()'],
      correctIndex: 1,
      explanation: `In Python, the .strip() string method strips away whitespace and newline characters from both ends of a string.`,
      concept: 'Python String Methods',
    },
    {
      questionText: `What keyword is used in Python to define a reusable custom function?`,
      options: ['function', 'def', 'fn', 'define', 'subroutine'],
      correctIndex: 1,
      explanation: `The 'def' keyword introduces a function definition in Python: def function_name(parameters):`,
      concept: 'Python Function Declarations',
    },
    {
      questionText: `Which semantic HTML5 tag is designed to enclose independent, self-contained syndicateable content (such as a news article or blog post)?`,
      options: ['<section>', '<article>', '<div>', '<aside>', '<header>'],
      correctIndex: 1,
      explanation: `The <article> element specifies self-contained composition intended for independent distribution.`,
      concept: 'Semantic HTML5 Elements',
    },
    {
      questionText: `In the CSS Box Model, which layer immediately surrounds the inner content before the border?`,
      options: ['Margin', 'Padding', 'Outline', 'Border', 'Gutter'],
      correctIndex: 1,
      explanation: `From inside out: Content -> Padding -> Border -> Margin. Padding provides clearance around content inside borders.`,
      concept: 'CSS Box Model Structure',
    },
    {
      questionText: `Which network topology connects all client computers to a central hub, switch, or router?`,
      options: ['Bus topology', 'Star topology', 'Ring topology', 'Mesh topology', 'Linear topology'],
      correctIndex: 1,
      explanation: `In a Star topology, each network host connects to a central multiport switch; failure of one cable does not disable the whole network.`,
      concept: 'Computer Network Topologies',
    },
    {
      questionText: `Which communication protocol secures and encrypts data transmitted between a web browser and a website using SSL/TLS?`,
      options: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'Telnet'],
      correctIndex: 1,
      explanation: `HTTPS (Hypertext Transfer Protocol Secure) encrypts bidirectional communications using SSL/TLS cryptographic keys.`,
      concept: 'Internet Protocols & Encryption',
    },
    {
      questionText: `What is the primary role of the Domain Name System (DNS) on the global Internet?`,
      options: [
        'To scan downloads for computer viruses',
        'To translate human-friendly domain names (e.g. google.com) into numerical IP addresses',
        'To speed up local computer CPU clock frequency',
        'To compress video files for streaming',
        'To store user password cookies',
      ],
      correctIndex: 1,
      explanation: `DNS functions as the Internet's address directory, translating human hostnames into routable IP addresses.`,
      concept: 'DNS Resolution Dynamics',
    },
    {
      questionText: `What type of malicious software deceptively masquerades as a legitimate, harmless application to breach user security?`,
      options: ['Ransomware', 'Trojan Horse', 'Spyware worm', 'Adware banner', 'Denial of Service'],
      correctIndex: 1,
      explanation: `A Trojan horse disguises itself as genuine software to mislead users into installing covert backdoor malware.`,
      concept: 'Cybersecurity Threat Vectors',
    },
    {
      questionText: `In standard flowchart iconography, what geometrical shape represents a conditional decision node (e.g. Yes/No)?`,
      options: ['Oval / Rounded Capsule (Terminal)', 'Diamond / Rhombus (Decision)', 'Rectangle (Process)', 'Parallelogram (Input/Output)', 'Circle (Connector)'],
      correctIndex: 1,
      explanation: `A diamond (rhombus) denotes a conditional branching decision having two or more alternative exit paths.`,
      concept: 'Flowchart Iconography & Logic',
    },
    {
      questionText: `What is the worst-case time complexity of Binary Search on a sorted array of n elements?`,
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'O(n log n)'],
      correctIndex: 1,
      explanation: `Binary search halves the search interval at each step, achieving logarithmic time complexity O(log n).`,
      concept: 'Algorithm Complexity & Search',
    },
    {
      questionText: `Which of the following creates an empty Python dictionary?`,
      options: ['d = []', 'd = {}', 'd = set()', 'd = ()', 'd = dict([])'],
      correctIndex: 1,
      explanation: `Empty curly braces {} instantiate an empty dictionary in Python.`,
      concept: 'Python Dictionaries',
    },
    {
      questionText: `What is the output of the Python string slicing: "LEARNO"[1:4] ?`,
      options: ['"LEA"', '"EAR"', '"ARN"', '"EARN"', '"LE"'],
      correctIndex: 1,
      explanation: `Index 1 is 'E', index 2 is 'A', index 3 is 'R'. The stop index 4 is exclusive, yielding "EAR".`,
      concept: 'Python String Slicing',
    },
    {
      questionText: `What cybersecurity defense requires a user to enter both a password and a secondary verification code from their phone?`,
      options: ['Single Sign-On (SSO)', 'Two-Factor Authentication (2FA / MFA)', 'Data Encryption Standard', 'Symmetric Hashing', 'CAPTCHA puzzle'],
      correctIndex: 1,
      explanation: `Two-Factor Authentication (2FA) enhances security by requiring two distinct evidence factors: knowledge (password) and possession (phone OTP).`,
      concept: 'Two-Factor Authentication (2FA)',
    },
  ];

  return compBlueprints[qIdx];
}

// ==========================================
// 6. HINDI QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getHindiQuestion(chapter: string, i: number): QuestionBlueprint {
  const qIdx = (i - 1) % 20;

  const hindiBlueprints: QuestionBlueprint[] = [
    {
      questionText: `हिंदी वर्णमाला में 'क' वर्ग (क, ख, ग, घ, ङ) के व्यंजनों का उच्चारण-स्थान क्या है?`,
      options: ['तालु', 'कंठ (कण्ठ्य)', 'मूर्धा', 'दंत', 'ओष्ठ'],
      correctIndex: 1,
      explanation: `'अकुहविसर्जनीयानां कण्ठः' सूत्रानुसार क-वर्ग का उच्चारण कंठ से होता है।`,
      concept: 'उच्चारण स्थान',
    },
    {
      questionText: `निम्न में से कौन-सा शब्द 'भाववाचक संज्ञा' का सही उदाहरण है?`,
      options: ['हिमालय', 'मिठास', 'नदी', 'मोहन', 'पुस्तक'],
      correctIndex: 1,
      explanation: `'मिठास' किसी वस्तु के गुण, धर्म या भाव का बोध कराती है, अतः यह भाववाचक संज्ञा है।`,
      concept: 'संज्ञा के भेद',
    },
    {
      questionText: `'सूर्योदय' शब्द का शुद्ध सन्धि-विच्छेद क्या होगा?`,
      options: ['सूर्य + उदय', 'सूर्यो + दय', 'सूर्य + दय', 'सूर्या + उदय', 'सूर्यो + उदय'],
      correctIndex: 0,
      explanation: `अ + उ = ओ (गुण स्वर सन्धि) नियम से 'सूर्य + उदय = सूर्योदय' बनता है।`,
      concept: 'गुण स्वर सन्धि',
    },
    {
      questionText: `'दशानन' (दस हैं आनन जिसके अर्थात् रावण) में कौन-सा समास है?`,
      options: ['तत्पुरुष समास', 'बहुव्रीहि समास', 'द्विगु समास', 'द्वन्द्व समास', 'कर्मधारय समास'],
      correctIndex: 1,
      explanation: `जहाँ दोनों पद प्रधान न होकर किसी अन्य तीसरे अर्थ (रावण) का बोध कराते हैं, वहाँ बहुव्रीहि समास होता है।`,
      concept: 'समास विचार',
    },
    {
      questionText: `'प्राचीन' शब्द का सही विलोम शब्द क्या है?`,
      options: ['पुरातन', 'अर्वाचीन (नवीन)', 'ऐतिहासिक', 'पुराना', 'समीचीन'],
      correctIndex: 1,
      explanation: `'प्राचीन' का अर्थ पुराना होता है और इसका सटीक विलोम 'अर्वाचीन' (आधुनिक/नवीन) है।`,
      concept: 'विलोम शब्द',
    },
    {
      questionText: `निम्न में से कौन-सा समूह 'कमल' के पर्यायवाची शब्दों का शुद्ध समूह है?`,
      options: ['जलज, पंकज, नीरज', 'वारि, तोय, सलिल', 'दिनकर, दिवाकर, भानु', 'पवन, समीर, अनिल', 'तरु, विटप, पादप'],
      correctIndex: 0,
      explanation: `'जलज', 'पंकज' और 'नीरज' कमल के मानक पर्यायवाची शब्द हैं।`,
      concept: 'पर्यायवाची शब्द',
    },
    {
      questionText: `मुहावरे "आँखों का तारा होना" का सटीक अर्थ क्या है?`,
      options: ['बहुत दूर होना', 'अत्यधिक प्रिय होना', 'कम दिखाई देना', 'रात में जागना', 'गुस्सा होना'],
      correctIndex: 1,
      explanation: `'आँखों का तारा होना' का अर्थ बहुत प्यारा या अत्यधिक प्रिय होना है।`,
      concept: 'मुहावरे एवं अर्थ',
    },
    {
      questionText: `"चारु चंद्र की चंचल किरणें, खेल रहीं हैं जल-थल में"—इस काव्य-पंक्ति में कौन-सा अलंकार है?`,
      options: ['यमक अलंकार', 'अनुप्रास अलंकार', 'उपमा अलंकार', 'रूपक अलंकार', 'श्लेष अलंकार'],
      correctIndex: 1,
      explanation: `'च' वर्ण की सुंदर एवं बारंबार आवृत्ति होने से यहाँ अनुप्रास अलंकार है।`,
      concept: 'काव्य सौंदर्य: अनुप्रास अलंकार',
    },
    {
      questionText: `जिस क्रिया का फल सीधा कर्म पर पड़ता है, उसे कौन-सी क्रिया कहते हैं?`,
      options: ['अकर्मक क्रिया', 'सकर्मक क्रिया', 'प्रेरणार्थक क्रिया', 'द्विकर्मक क्रिया', 'संयुक्त क्रिया'],
      correctIndex: 1,
      explanation: `जिस क्रिया में कर्म की अपेक्षा होती है तथा कार्य का फल कर्म पर पड़ता है, उसे सकर्मक क्रिया कहते हैं।`,
      concept: 'क्रिया के भेद',
    },
    {
      questionText: `'प्रत्येक' शब्द में कौन-सा उपसर्ग प्रयुक्त हुआ है?`,
      options: ['प्र', 'प्रति', 'प्रा', 'प्रत्य', 'एक'],
      correctIndex: 1,
      explanation: `'प्रति + एक = प्रत्येक' में 'प्रति' उपसर्ग प्रयुक्त हुआ है (यण् सन्धि)।`,
      concept: 'उपसर्ग विचार',
    },
    {
      questionText: `'यथाशक्ति' (शक्ति के अनुसार) में कौन-सा समास मान्य है?`,
      options: ['तत्पुरुष समास', 'अव्ययीभाव समास', 'द्विगु समास', 'कर्मधारय समास', 'बहुव्रीहि समास'],
      correctIndex: 1,
      explanation: `जिसका पहला पद अव्यय हो और वही प्रधान हो, वहाँ अव्ययीभाव समास होता है।`,
      concept: 'अव्ययीभाव समास',
    },
    {
      questionText: `'कनक कनक ते सौ गुनी, मादकता अधिकाय'—यहाँ 'कनक' शब्द दो बार भिन्न अर्थों (सोना और धतूरा) में आया है, अतः कौन-सा अलंकार है?`,
      options: ['अनुप्रास अलंकार', 'यमक अलंकार', 'श्लेष अलंकार', 'उपमा अलंकार', 'उत्प्रेक्षा अलंकार'],
      correctIndex: 1,
      explanation: `एक ही शब्द की आवृत्ति हो और प्रत्येक बार अर्थ भिन्न हो, वहाँ यमक अलंकार होता है।`,
      concept: 'यमक अलंकार',
    },
    {
      questionText: `निम्न में से शुद्ध वर्तनी वाला शब्द छाँटिए:`,
      options: ['उज्वल', 'उज्ज्वल', 'उजवल', 'उज्वल्ल', 'उज्जवल'],
      correctIndex: 1,
      explanation: `'उत् + ज्वल = उज्ज्वल' में दोनों 'ज' आधे होते हैं, अतः 'उज्ज्वल' शुद्ध है।`,
      concept: 'वर्तनी शुद्धि',
    },
    {
      questionText: `पेड़ से पत्ता गिरता है—इस वाक्य में 'पेड़ से' में कौन-सा कारक है?`,
      options: ['करण कारक', 'अपादान कारक (अलग होने के अर्थ में)', 'कर्म कारक', 'संबोधन कारक', 'अधिकरण कारक'],
      correctIndex: 1,
      explanation: `जहाँ किसी वस्तु का किसी स्थान से अलग होना पाया जाए, वहाँ अपादान कारक (पंचमी विभक्ति) होता है।`,
      concept: 'कारक एवं विभक्तियाँ',
    },
    {
      questionText: `'अत्यधिक' शब्द का शुद्ध सन्धि-विच्छेद क्या होगा?`,
      options: ['अति + अधिक', 'अत्य + अधिक', 'अत + अधिक', 'अत्या + अधिक', 'अति + आधिक'],
      correctIndex: 0,
      explanation: `इ + अ = य (यण् स्वर सन्धि) नियम से 'अति + अधिक = अत्यधिक' बनता है।`,
      concept: 'यण् स्वर सन्धि',
    },
    {
      questionText: `जो सब कुछ जानता हो—इस वाक्यांश के लिए एक उपयुक्त शब्द क्या है?`,
      options: ['अल्पज्ञ', 'सर्वज्ञ', 'विद्वान', 'सर्वव्यापी', 'अज्ञानी'],
      correctIndex: 1,
      explanation: `'सर्वज्ञ' का अर्थ है जो सब कुछ जानने वाला हो। कम जानने वाले को 'अल्पज्ञ' कहते हैं।`,
      concept: 'अनेक शब्दों के लिए एक शब्द',
    },
    {
      questionText: `'माता-पिता' शब्द में कौन-सा समास है?`,
      options: ['द्विगु समास', 'द्वन्द्व समास', 'तत्पुरुष समास', 'कर्मधारय समास', 'अव्ययीभाव समास'],
      correctIndex: 1,
      explanation: `जहाँ दोनों पद समान रूप से प्रधान हों और विग्रह करने पर 'और' आए, वहाँ द्वन्द्व समास होता है।`,
      concept: 'द्वन्द्व समास',
    },
    {
      questionText: `लोकोक्ति "अधजल गगरी छलकत जाए" का क्या आशय है?`,
      options: ['गगरी का फूटा होना', 'कम ज्ञान वाला व्यक्ति अधिक दिखावा करता है', 'पानी कम होना', 'विद्वान का मौन रहना', 'मटकी संभालना'],
      correctIndex: 1,
      explanation: `यह लोकोक्ति इंगित करती है कि अल्प ज्ञानी या ओछा व्यक्ति अहंकार में अत्यधिक आडंबर करता है।`,
      concept: 'लोकोक्तियाँ',
    },
    {
      questionText: `निम्न में से कौन-सा शब्द 'स्त्रीलिंग' है?`,
      options: ['दूध', 'नदी', 'पहाड़', 'दिन', 'समुद्र'],
      correctIndex: 1,
      explanation: `'नदी बहती है'—यह स्त्रीलिंग शब्द है, जबकि दूध, पहाड़, समुद्र पुल्लिंग हैं।`,
      concept: 'लिंग विचार',
    },
    {
      questionText: `'सज्जन' का शुद्ध सन्धि-विच्छेद क्या होगा?`,
      options: ['सज + जन', 'सत् + जन', 'सद + जन', 'स + जन', 'सन् + जन'],
      correctIndex: 1,
      explanation: `व्यंजन सन्धि नियम से त् के बाद ज् आने पर त् का ज् हो जाता है: 'सत् + जन = सज्जन'।`,
      concept: 'व्यंजन सन्धि',
    },
  ];

  return hindiBlueprints[qIdx];
}

// ==========================================
// 7. SANSKRIT QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getSanskritQuestion(chapter: string, i: number): QuestionBlueprint {
  const qIdx = (i - 1) % 20;

  const sanskritBlueprints: QuestionBlueprint[] = [
    {
      questionText: `संस्कृत व्याकरणे 'क' वर्गस्य (क, ख, ग, घ, ङ) उच्चारण-स्थानं किम् अस्ति?`,
      options: ['तालु', 'कण्ठः (अकुहविसर्जनीयानां कण्ठः)', 'मूर्धा', 'दन्ताः', 'ओष्ठौ'],
      correctIndex: 1,
      explanation: `पाणिनीय-शिक्षायाम् उक्तम्—"अकुहविसर्जनीयानां कण्ठः", अतः क-वर्गस्य उच्चारण-स्थानं कण्ठः अस्ति।`,
      concept: 'उच्चारण-स्थानानि',
    },
    {
      questionText: `'बालक' शब्दस्य तृतीया-विभक्ति-एकवचने शुद्धं रूपं किम् अस्ति?`,
      options: ['बालकाय', 'बालकेन', 'बालकात्', 'बालकस्य', 'बालके'],
      correctIndex: 1,
      explanation: `अकारान्त-पुँल्लिङ्ग बालक शब्दस्य तृतीया-विभक्तौ रूपाणि भवन्ति: बालकेन, बालकाभ्याम्, बालकैः।`,
      concept: 'अकारान्त पुँल्लिङ्ग शब्दरूपाणि',
    },
    {
      questionText: `'पठ्' धातोः लट्-लकारस्य (वर्तमानकालस्य) प्रथम-पुरुष-बहुवचने रूपं किम्?`,
      options: ['पठति', 'पठन्ति', 'पठतः', 'पठामि', 'अपठन्'],
      correctIndex: 1,
      explanation: `लट्-लकारस्य रूपाणि: पठति (एकवचनम्), पठतः (द्विवचनम्), पठन्ति (बहुवचनम्)।`,
      concept: 'धातुरूपाणि: लट् लकार',
    },
    {
      questionText: `'विद्या + आलयः' इत्यस्य सन्धिपदं किम् भविष्यति?`,
      options: ['विद्योदयः', 'विद्यालयः', 'विद्यालः', 'विद्यलयः', 'विध्यलयः'],
      correctIndex: 1,
      explanation: `'अकः सवर्णे दीर्घः' सूत्रेण आ + आ मिलित्वा दीर्घ 'आ' भवति, अतः 'विद्यालयः' दीर्घ-स्वरसन्धिः अस्ति।`,
      concept: 'दीर्घ स्वर सन्धिः',
    },
    {
      questionText: `'सह' अव्ययस्य योगे का विभक्तिः प्रयुज्यते? (यथा—रामेण सह सीता अगच्छत्)`,
      options: ['द्वितीया', 'तृतीया विभक्तिः', 'चतुर्थी', 'पञ्चमी', 'षष्ठी'],
      correctIndex: 1,
      explanation: `'सहयुक्तेऽप्रधाने' सूत्रानुसारं 'सह', 'साकम्', 'सार्धम्' योगे तृतीया विभक्तिः भवति।`,
      concept: 'उपपद-विभक्तयः: सह योगे',
    },
    {
      questionText: `'नमः' शब्दस्य योगे का विभक्तिः विधीयते? (यथा—शिवाय नमः)`,
      options: ['तृतीया', 'चतुर्थी विभक्तिः', 'पञ्चमी', 'षष्ठी', 'सप्तमी'],
      correctIndex: 1,
      explanation: `'नमःस्वस्तिस्वाहास्वधाऽलंवषड्योगाच्च' सूत्रेण 'नमः' योगे चतुर्थी विभक्तिः भवति।`,
      concept: 'उपपद-विभक्तयः: नमः योगे',
    },
    {
      questionText: `'गम्' धातोः 'क्त्वा' प्रत्यये योजिते किं रूपं निष्पद्यते?`,
      options: ['गमत्वा', 'गत्वा', 'गमित्वा', 'गन्तुम्', 'गच्छित्वा'],
      correctIndex: 1,
      explanation: `गम् + क्त्वा = गत्वा (गत्वा = जाकर)। मकारस्य लोपः भवति।`,
      concept: 'कृत् प्रत्ययाः: क्त्वा प्रत्ययः',
    },
    {
      questionText: `'पठ्' धातोः 'तुमुन्' प्रत्यययोगे किं रूपं सिध्यति? (पढने के लिए)`,
      options: ['पठित्वा', 'पठितुम्', 'पठनीयम्', 'पाठकः', 'पठितव्यम्'],
      correctIndex: 1,
      explanation: `पठ् + तुमुन् = पठितुम् (पठितुम् = पठनाय/पढने के लिए)।`,
      concept: 'तुमुन् प्रत्ययः',
    },
    {
      questionText: `'लता' शब्दस्य प्रथमा-विभक्ति-बहुवचने रूपं किम् अस्ति?`,
      options: ['लते', 'लताः', 'लताम्', 'लतायाः', 'लतासु'],
      correctIndex: 1,
      explanation: `आकारान्त-स्त्रीलिङ्ग 'लता' शब्दस्य रूपाणि: लता, लते, लताः (बहुवचनम्)।`,
      concept: 'आकारान्त स्त्रीलिङ्ग रूपाणि',
    },
    {
      questionText: `'गम्' धातोः लृट्-लकारस्य (भविष्यत्कालस्य) प्रथम-पुरुष-एकवचने रूपं किम्?`,
      options: ['गच्छति', 'गमिष्यति', 'अगच्छत्', 'गच्छतु', 'गमिष्यामि'],
      correctIndex: 1,
      explanation: `गम् धातोः भविष्यत्काले (लृट्-लकारे) रूपं 'गमिष्यति' भवति।`,
      concept: 'धातुरूपाणि: लृट् लकार',
    },
    {
      questionText: `प्रसिद्धां नीति-सूक्तिं पूरयत: "विद्या ददाति ______ |"`,
      options: ['धनम्', 'विनयम्', 'क्रोधम्', 'अहङ्कारम्', 'कलहम्'],
      correctIndex: 1,
      explanation: `सुभाषितम्: "विद्या ददाति विनयं विनयाद्याति पात्रताम् | पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ||"`,
      concept: 'संस्कृत सूक्तयः',
    },
    {
      questionText: `संस्कृत-भाषायां कति कारकाणि सन्ति?`,
      options: ['पञ्च (5)', 'षट् (6 कारकाणि)', 'सप्त (7)', 'अष्ट (8)', 'नव (9)'],
      correctIndex: 1,
      explanation: `संस्कृत व्याकरणे क्रियाजनकत्वं कारकत्वम्—अतः षट् कारकाणि सन्ति (कर्ता, कर्म, करणं, सम्प्रदानं, अपादानम्, अधिकरणम्)।`,
      concept: 'कारक प्रकरणम्',
    },
    {
      questionText: `'सूर्य + उदयः' अत्र सन्धिः कृत्वा पदं किम् भविष्यति?`,
      options: ['सूर्यादयः', 'सूर्योदयः', 'सूर्यदौयः', 'सूर्यदयः', 'सूर्येदयः'],
      correctIndex: 1,
      explanation: `'आद्गुणः' सूत्रेण अ + उ मिलित्वा 'ओ' गुणः भवति, अतः 'सूर्योदयः'।`,
      concept: 'गुण सन्धिः',
    },
    {
      questionText: `संस्कृत संख्यायां 'पंचदश' इत्यस्य कः अर्थः अस्ति?`,
      options: ['5', '15', '50', '25', '10'],
      correctIndex: 1,
      explanation: `पञ्च + दश = पञ्चदश अर्थात् पन्द्रह (15)।`,
      concept: 'संस्कृत संख्यावाचक शब्दाः',
    },
    {
      questionText: `'फलम्' शब्दस्य द्वितीया-विभक्ति-एकवचने रूपं किम् अस्ति?`,
      options: ['फलेन', 'फलम्', 'फलाय', 'फलात्', 'फले'],
      correctIndex: 1,
      explanation: `नपुंसकलिङ्ग 'फल' शब्दस्य प्रथमा द्वितीया च समाना भवति: फलम्, फले, फलानि।`,
      concept: 'अकारान्त नपुंसकलिङ्ग रूपाणि',
    },
    {
      questionText: `'अद्य' अव्ययपदस्य हिन्दी-भाषायां कः अर्थः अस्ति?`,
      options: ['कल (आने वाला)', 'आज', 'कल (बीता हुआ)', 'कहाँ', 'यहाँ'],
      correctIndex: 1,
      explanation: `'अद्य' इत्यस्य अर्थः 'आज' (Today) अस्ति। 'श्वः' = आने वाला कल, 'ह्यः' = बीता हुआ कल।`,
      concept: 'अव्ययपदानि',
    },
    {
      questionText: `'पठ्' धातोः लङ्-लकारस्य (भूतकालस्य) प्रथम-पुरुष-एकवचने रूपं किम्?`,
      options: ['पठति', 'अपठत्', 'अपठन्', 'अपठताम्', 'पठेत्'],
      correctIndex: 1,
      explanation: `लङ्-लकारस्य (भूतकालस्य) रूपाणि: अपठत्, अपठताम्, अपठन्।`,
      concept: 'धातुरूपाणि: लङ् लकार',
    },
    {
      questionText: `उपसर्गयुक्तं पदं चिन्वन्तु: 'आगच्छति' पदे कः उपसर्गः अस्ति?`,
      options: ['अति', 'आङ् (आ)', 'अनु', 'अप', 'अभि'],
      correctIndex: 1,
      explanation: `'आ + गच्छति = आगच्छति' (आता है)। अत्र 'आङ्' (आ) उपसर्गः अस्ति।`,
      concept: 'उपसर्ग प्रकरणम्',
    },
    {
      questionText: `सुभाषितम् पूरयत: "सत्यमेव ______ नानृतम् |"`,
      options: ['नश्यति', 'जयते', 'भवति', 'गच्छति', 'पतति'],
      correctIndex: 1,
      explanation: `मुण्डकोपनिषदः प्रसिद्धं राष्ट्रियवाक्यम्: "सत्यमेव जयते नानृतम्" (सत्य की ही विजय होती है)।`,
      concept: 'उपनिषद् सूक्तयः',
    },
    {
      questionText: `'इचुयशानां ______' रिक्तस्थानं पूरयत:`,
      options: ['कण्ठः', 'तालु', 'मूर्धा', 'दन्ताः', 'नासिका'],
      correctIndex: 1,
      explanation: `पाणिनीय सूत्रम्: "इचुयशानां तालु" अर्थात् इ/ई, च-वर्ग, य, श वर्णानाम् उच्चारणस्थानं तालु अस्ति।`,
      concept: 'उच्चारण सूत्रम्: तालु',
    },
  ];

  return sanskritBlueprints[qIdx];
}

// ==========================================
// 8. COMMUNICATION QUESTION BLUEPRINTS (20 DISTINCT TYPES)
// ==========================================
function getCommunicationQuestion(chapter: string, i: number): QuestionBlueprint {
  const qIdx = (i - 1) % 20;

  const commBlueprints: QuestionBlueprint[] = [
    {
      questionText: `In the established "7 Cs of Professional Communication", which principle dictates avoiding unnecessary verbosity and expressing ideas directly?`,
      options: ['Courtesy', 'Conciseness', 'Creativity', 'Complexity', 'Concreteness'],
      correctIndex: 1,
      explanation: `'Conciseness' emphasizes communicating the complete message in the fewest possible clear words without filler.`,
      concept: '7 Cs of Communication: Conciseness',
    },
    {
      questionText: `What is the key functional difference between "Active Listening" and merely "Hearing"?`,
      options: [
        'Hearing requires intense mental effort, while listening is involuntary sound reception',
        'Hearing is physical sound reception, while active listening requires cognitive focus, empathy, and verified comprehension',
        'Active listening means interrupting immediately to prove your point',
        'Active listening is strictly non-verbal without speaking',
        'Hearing is superior for professional meetings',
      ],
      correctIndex: 1,
      explanation: `Hearing is passive auditory reception; active listening requires intentional cognitive effort to decode, evaluate, and reflect meaning.`,
      concept: 'Active Listening vs Passive Hearing',
    },
    {
      questionText: `What is the primary objective of "Reflective Paraphrasing" during a technical or client consultation?`,
      options: [
        'To demonstrate superior vocabulary and correct grammar',
        'To mirror back the speaker’s core message in your own words to confirm mutual alignment before responding',
        'To delay answering while searching online',
        'To conclude the meeting ahead of schedule',
        'To change the topic to your preferred agenda',
      ],
      correctIndex: 1,
      explanation: `Reflective paraphrasing verifies comprehension and validates the speaker's points before advancing to solutions.`,
      concept: 'Paraphrasing & Feedback Loops',
    },
    {
      questionText: `Which non-verbal posture communicates confidence, attentiveness, and professional openness during a presentation?`,
      options: [
        'Slouching backward with tightly crossed arms and averted gaze',
        'An upright, relaxed posture, balanced eye contact, and open, uncrossed hand gestures',
        'Constantly checking smartphone notifications',
        'Staring aggressively at one individual without blinking',
        'Pacing erratically back and forth with hands deep in pockets',
      ],
      correctIndex: 1,
      explanation: `Upright posture combined with natural eye contact and open gestures projects authoritative confidence and engagement.`,
      concept: 'Non-Verbal Demeanor & Posture',
    },
    {
      questionText: `In vocal paralanguage, what does "modulation" refer to?`,
      options: [
        'Speaking in a steady, unvarying monotone at maximum volume',
        'Varying pitch, volume, and speaking tempo dynamically to emphasize key concepts and maintain interest',
        'Whispering throughout the entire speech',
        'Using synthetic AI audio voice filters',
        'Mumbling words quickly to save time',
      ],
      correctIndex: 1,
      explanation: `Vocal modulation varies tone, pitch, pace, and volume to keep audiences engaged and highlight core arguments.`,
      concept: 'Paralanguage & Vocal Dynamics',
    },
    {
      questionText: `What type of communication barrier arises from jargon, ambiguous acronyms, or language dialect differences?`,
      options: ['Physical barrier', 'Semantic barrier', 'Physiological barrier', 'Environmental barrier', 'Organizational barrier'],
      correctIndex: 1,
      explanation: `Semantic barriers occur when symbols, words, or specialized jargon carry conflicting or confusing meanings between sender and receiver.`,
      concept: 'Semantic Communication Barriers',
    },
    {
      questionText: `In professional managerial feedback, what does the SBI feedback model stand for?`,
      options: ['System-Budget-Impact', 'Situation-Behavior-Impact', 'Speech-Body-Interaction', 'Strict-Balanced-Instruction', 'Summary-Brief-Inspection'],
      correctIndex: 1,
      explanation: `The SBI framework grounds feedback in objective facts: Describe the Situation, specify the observable Behavior, and explain the measurable Impact.`,
      concept: 'SBI Constructive Feedback Model',
    },
    {
      questionText: `According to speechcraft principles, what constitutes the most compelling opening "hook" for an audience presentation?`,
      options: [
        'Apologizing for being nervous or unprepared',
        'Opening with a striking relevant statistic, thought-provoking question, or brief poignant anecdote',
        'Reading thirty dense slide bullet points verbatim',
        'Clearing your throat and asking someone to check the projector',
        'Staring at notes in silence for two minutes',
      ],
      correctIndex: 1,
      explanation: `A compelling hook immediately seizes cognitive interest through surprising data, an intriguing question, or a brief narrative.`,
      concept: 'Presentation Hooks & Openings',
    },
    {
      questionText: `According to Aristotle’s classical rhetoric, which mode of persuasion appeals to logic, empirical data, and reasoning?`,
      options: ['Ethos (Credibility)', 'Logos (Logic & Evidence)', 'Pathos (Emotional Appeal)', 'Kairos (Timing)', 'Mythos (Tradition)'],
      correctIndex: 1,
      explanation: `Logos represents rational argumentation backed by sound logic, empirical data, and structured evidence.`,
      concept: 'Aristotelian Rhetoric: Logos',
    },
    {
      questionText: `What is the most constructive response when an audience member asks a challenging or hostile question during a live presentation?`,
      options: [
        'Insulting their intelligence and dismissing their question immediately',
        'Acknowledging the validity of their concern, clarifying the underlying point calmly, and addressing it with objective facts',
        'Leaving the stage abruptly without replying',
        'Pretending not to hear the question and skipping to applause',
        'Arguing emotionally and raising your voice',
      ],
      correctIndex: 1,
      explanation: `Professional decorum involves validating the concern, maintaining composure, and responding with grounded empirical evidence.`,
      concept: 'Handling Hostile Objections',
    },
    {
      questionText: `What executive writing approach places the Bottom Line Up Front (BLUF) in professional emails?`,
      options: [
        'Burying the core request in paragraph 7 after rambling introductory prose',
        'Stating the primary conclusion, recommendation, or action item directly in the opening sentences',
        'Writing the entire email in capital letters',
        'Attaching huge uncompressed raw data files without any text',
        'Sending blank emails with urgent subject titles',
      ],
      correctIndex: 1,
      explanation: `BLUF (Bottom Line Up Front) delivers the essential takeaway and action request immediately to save executive reading time.`,
      concept: 'Executive Email Drafting (BLUF)',
    },
    {
      questionText: `Which closing salutation is universally accepted for formal academic or institutional correspondence?`,
      options: ['Catch ya later!', 'Sincerely yours,', 'Cheers buddy,', 'Sent from my iPhone,', 'Peace out,'],
      correctIndex: 1,
      explanation: `'Sincerely yours,' and 'Respectfully yours,' adhere to formal etiquette standards for professional correspondence.`,
      concept: 'Formal Correspondence Salutations',
    },
    {
      questionText: `What essential document should always be circulated to participants prior to conducting a formal business meeting?`,
      options: ['A catering lunch menu', 'A structured meeting agenda with clear objectives and time allocations', 'A transcript of previous social conversations', 'An invoice for room rental', 'A list of office sports scores'],
      correctIndex: 1,
      explanation: `An advance agenda defines objectives, expected outputs, and timeframes, ensuring focused and productive discussion.`,
      concept: 'Meeting Protocols & Agendas',
    },
    {
      questionText: `In Harvard's principled negotiation framework, what is the core tenet of collaborative (Win-Win) bargaining?`,
      options: [
        'Stubbornly defending fixed personal positions until the other side yields',
        'Focusing on underlying interests and mutually beneficial options rather than rigid positions',
        'Deceiving the counterparty about your true budget',
        'Walking out of every meeting after 5 minutes',
        'Refusing to make any concessions whatsoever',
      ],
      correctIndex: 1,
      explanation: `Principled negotiation uncovers underlying needs and crafts creative solutions that deliver value to all parties.`,
      concept: 'Collaborative Negotiation Strategies',
    },
    {
      questionText: `What is the psychological term for mirroring another person’s posture and energy to build rapid interpersonal rapport?`,
      options: ['Gaslighting', 'Limbic mirroring (Chameleon effect)', 'Cognitive dissonance', 'Projection', 'Counter-transference'],
      correctIndex: 1,
      explanation: `Subtle behavioral mirroring signals empathy and subconscious similarity, fostering connection and rapport.`,
      concept: 'Rapport Building & Mirroring',
    },
    {
      questionText: `How should a speaker handle verbal speech fillers such as "um", "uh", "like", and "you know"?`,
      options: [
        'Speak twice as fast so nobody notices them',
        'Embrace deliberate, comfortable silence (pauses) instead of vocalizing fillers while gathering thoughts',
        'Shout every fourth word',
        'Use filler words intentionally to sound casual',
        'Repeat each sentence three times',
      ],
      correctIndex: 1,
      explanation: `A purposeful silent pause projects poise and executive authority while replacing reflexive filler vocalizations.`,
      concept: 'Eliminating Speech Fillers',
    },
    {
      questionText: `Which communication style respects both one’s own rights and opinions while equally respecting the rights and perspectives of others?`,
      options: ['Aggressive style', 'Assertive communication style', 'Passive style', 'Passive-aggressive style', 'Authoritarian style'],
      correctIndex: 1,
      explanation: `Assertive communication balances direct honesty and boundary defense with empathy and mutual respect.`,
      concept: 'Communication Styles: Assertiveness',
    },
    {
      questionText: `When presenting complex technical architecture to non-technical executive stakeholders, what is the best strategy?`,
      options: [
        'Read complex source code line-by-line for 45 minutes',
        'Use intuitive analogies, focus on strategic business outcomes, and avoid unnecessary implementation jargon',
        'Refuse to answer questions about budget impact',
        'Present thirty detailed database schema diagrams',
        'Speak exclusively in internal team slang',
      ],
      correctIndex: 1,
      explanation: `Tailoring communication requires translating technical complexity into strategic value, business metrics, and relatable analogies.`,
      concept: 'Audience Adaptation & Executive Briefing',
    },
    {
      questionText: `What physiological technique helps reduce sympathetic nervous system adrenaline and stage anxiety prior to speaking?`,
      options: [
        'Consuming multiple energy drinks',
        'Slow, deep diaphragmatic box breathing (inhale 4s, hold 4s, exhale 4s)',
        'Holding your breath until lightheaded',
        'Pacing rapidly around the room while clenching teeth',
        'Skipping all meals for 24 hours',
      ],
      correctIndex: 1,
      explanation: `Deep diaphragmatic breathing activates the parasympathetic vagus nerve, reducing heart rate and calming physiological tremors.`,
      concept: 'Managing Performance Anxiety',
    },
    {
      questionText: `In non-violent communication (NVC), which sequence describes the core 4-step framework?`,
      options: [
        'Accuse - Argue - Demand - Leave',
        'Observations - Feelings - Needs - Specific Requests',
        'Opinion - Counter-opinion - Ultimatum - Agreement',
        'Silence - Resentment - Explosion - Apology',
        'Critique - Defend - Rationalize - Settle',
      ],
      correctIndex: 1,
      explanation: `Marshall Rosenberg's NVC model follows: state objective Observations, express Feelings, identify core Needs, and make actionable Requests.`,
      concept: 'Non-Violent Communication (NVC)',
    },
  ];

  return commBlueprints[qIdx];
}

/**
 * Generates 20 authentic, 100% distinct questions tailored to the chapter topic
 */
export function generateQuestionsForTest(
  subject: string,
  chapter: string,
  testNumber: number,
  studentClass: StudentClass,
  problemNumber: number = 1
): Question[] {
  const questions: Question[] = [];
  const qCount = 20;

  for (let i = 1; i <= qCount; i++) {
    const qId = `${studentClass.replace(/\s+/g, '')}-${subject.replace(/\s+/g, '')}-P${problemNumber}-Q${i}`;

    let blueprint: QuestionBlueprint;

    if (subject === 'Mathematics') {
      blueprint = getMathQuestion(chapter, i, problemNumber);
    } else if (subject === 'Science') {
      blueprint = getScienceQuestion(chapter, i);
    } else if (subject === 'English') {
      blueprint = getEnglishQuestion(chapter, i);
    } else if (subject === 'Social Science') {
      blueprint = getSocialScienceQuestion(chapter, i);
    } else if (subject === 'Computer') {
      blueprint = getComputerQuestion(chapter, i);
    } else if (subject === 'Hindi') {
      blueprint = getHindiQuestion(chapter, i);
    } else if (subject === 'Sanskrit') {
      blueprint = getSanskritQuestion(chapter, i);
    } else {
      blueprint = getCommunicationQuestion(chapter, i);
    }

    // Ensure options array has exactly 5 items and rotate answer position cleanly
    // Target correct answer position rotates cleanly across 0, 1, 2, 3, 4 based on (i + problemNumber) % 5
    const targetCorrectIndex = (i + problemNumber) % 5;
    const currentCorrectText = blueprint.options[blueprint.correctIndex];
    const otherOptions = blueprint.options.filter((_, idx) => idx !== blueprint.correctIndex);

    // Reconstruct options array with correct answer placed at targetCorrectIndex
    const rotatedOptions: string[] = [];
    let otherIdx = 0;
    for (let pos = 0; pos < 5; pos++) {
      if (pos === targetCorrectIndex) {
        rotatedOptions.push(currentCorrectText);
      } else {
        rotatedOptions.push(otherOptions[otherIdx] || `Option ${pos + 1}`);
        otherIdx++;
      }
    }

    questions.push({
      id: qId,
      question: blueprint.questionText,
      options: rotatedOptions as [string, string, string, string, string],
      correctAnswer: targetCorrectIndex,
      explanation: blueprint.explanation,
      concept: blueprint.concept,
      topic: chapter,
    });
  }

  return questions;
}
