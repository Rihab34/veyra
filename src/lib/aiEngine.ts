import type {
  Evaluation,
  SessionSummary,
  Language,
  InterviewSession,
} from '@/types';
import { DIMENSION_LABELS, FOLLOW_UP_TEMPLATES } from './questionBank';
import { SIGNIFICANT_DELTA, STRONG_THRESHOLD, WEAK_THRESHOLD, criterionLabel } from './evaluation/rubric';

// ============================================================================
// Deep answer analysis
// ============================================================================

interface AnalyzedAnswer {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  // Signal detection
  hasSpecificNumbers: boolean;
  hasExampleMarkers: boolean;
  hasStructureMarkers: boolean;
  hasHedging: boolean;
  hasSelfReflection: boolean;
  hasImpactStatement: boolean;
  hasLeadershipSignal: boolean;
  hasOwnership: boolean;
  hasQuantifiedResults: boolean;
  hasActionVerbs: boolean;
  hasSTAR: boolean;
  // Quality signals
  isVague: boolean;
  isRelevant: boolean;
  isGenericCliché: boolean;
  hasFiller: boolean;
  // Content clues
  keywordOverlap: number;
  questionType: QuestionType;
}

type QuestionType = 'behavioral' | 'motivation' | 'technical' | 'self_intro' | 'ethical' | 'hypothetical' | 'general';

function detectQuestionType(questionText: string): QuestionType {
  const q = questionText.toLowerCase();
  if (/\b(tell me about|describe a time|give an example|share a situation|walk me through)\b/.test(q)) return 'behavioral';
  if (/\b(why (are|do|did)|what motivat|what draws|what excites)\b/.test(q)) return 'motivation';
  if (/\b(how (would|do|did) you (approach|solve|handle|design))\b/.test(q) && /\b(system|algorithm|architect|debug|scale|implement)\b/.test(q)) return 'technical';
  if (/\b(introduce yourself|tell us about yourself|who are you)\b/.test(q)) return 'self_intro';
  if (/\b(ethical|dilemma|right thing|integrity|moral)\b/.test(q)) return 'ethical';
  if (/\b(if you|imagine|suppose|hypothetical|unlimited|could redesign)\b/.test(q)) return 'hypothetical';
  return 'general';
}

function analyzeAnswer(answer: string, questionText: string): AnalyzedAnswer {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = answer.toLowerCase();
  const qLower = questionText.toLowerCase();
  const questionType = detectQuestionType(questionText);

  // --- Signal detection ---
  const hasSpecificNumbers = /\b\d+[\d,.%]*\b/.test(answer) || /\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty|fifty|hundred|thousand|million)\b/i.test(answer);
  const hasQuantifiedResults = /\b\d+[%\s]*(increase|decrease|growth|reduction|improvement|faster|earlier|higher|lower|saved|revenue|cost|users|students|hours|days|weeks|months)\b/i.test(lower) || /\b\d+[\d,.]*\s*(%|percent|x|times)\b/i.test(lower);

  const hasExampleMarkers = /\b(for example|for instance|such as|like when|specifically|in particular|e\.g\.|to illustrate|in my|during my|when i|at one point|one time)\b/i.test(answer);
  const hasStructureMarkers = /\b(first|second|third|finally|in addition|moreover|as a result|consequently|therefore|however|next|then|after that|step (one|two|three))\b/i.test(answer);

  // Hedging — weak language that undermines confidence
  const hasHedging = /\b(maybe|perhaps|i guess|i think maybe|sort of|kind of|i would say maybe|i'm not sure but|i suppose|probably|i hope|i would like to think)\b/i.test(answer);

  // Self-reflection — shows growth mindset
  const hasSelfReflection = /\b(i learned|taught me|made me realize|changed how|helped me understand|showed me that|i realized|i discovered|what i took away|reflected on|looking back|in retrospect|taught me to)\b/i.test(answer);

  // Impact statement — talks about results or outcomes
  const hasImpactStatement = /\b(result|outcome|impact|led to|resulted in|achieved|delivered|increased|decreased|reduced|improved|saved|generated|launched|shipped)\b/i.test(lower);

  // Leadership signals
  const hasLeadershipSignal = /\b(led|lead|led a team|managed|directed|organized|initiated|founded|coordinated|drove|spearheaded|championed|mentored|guided|took charge|took ownership)\b/i.test(lower);

  // Ownership — uses first person action verbs
  const hasOwnership = /\b(i (led|built|created|designed|implemented|launched|started|drove|decided|chose|proposed|initiated|solved|fixed|improved|delivered|managed|organized|wrote|developed))\b/i.test(lower);

  // Action verbs
  const hasActionVerbs = /\b(achieved|built|created|designed|implemented|launched|solved|improved|delivered|managed|organized|developed|established|transformed|streamlined|pioneered|negotiated|presented|published|awarded)\b/i.test(lower);

  // STAR detection
  const hasSituation = /\b(in my|during my|when i|at (my|the|that)|in (my|the|that)|while (i|working|studying)|my (team|project|role|company|school|university))\b/i.test(lower);
  const hasTask = /\b(needed to|had to|was responsible for|my (goal|task|job|role) was|task was|objective was|problem was|challenge was)\b/i.test(lower);
  const hasAction = hasOwnership || hasActionVerbs;
  const hasResult = hasImpactStatement || hasQuantifiedResults || hasSelfReflection;
  const hasSTAR = hasSituation && hasTask && hasAction && hasResult;

  // --- Quality issues ---
  const vagueMarkers = /\b(stuff|things|a lot|many|some|good|bad|nice|great|okay|fine|very good|really good|kind of|sort of|you know|etc|and so on|and stuff)\b/i.test(answer);
  const isVague = wordCount > 0 && vagueMarkers && !hasSpecificNumbers && !hasExampleMarkers;

  const clichéPhrases = /\b(team player|hard worker|fast learner|passionate about|give 110|think outside the box|go above and beyond|people person|results-driven|detail-oriented|self-starter|synergy|leverage|dynamic)\b/i.test(answer);
  const isGenericCliché = wordCount > 0 && clichéPhrases && !hasExampleMarkers && !hasSpecificNumbers;

  const fillerPatterns = /\b(um|uh|like you know|i mean|basically|literally|honestly|actually|right|so yeah|well um)\b/i.test(answer);
  const hasFiller = fillerPatterns && wordCount < 80;

  // Relevance — keyword overlap with question
  const questionKeywords = qLower.match(/\b[a-z]{4,}\b/g) ?? [];
  const stopWords = new Set(['that', 'this', 'with', 'from', 'have', 'your', 'about', 'would', 'could', 'they', 'them', 'what', 'when', 'which', 'their', 'there', 'where', 'were', 'been', 'then', 'than', 'also', 'more', 'some', 'such']);
  const meaningfulKeywords = questionKeywords.filter((k) => !stopWords.has(k));
  const overlap = meaningfulKeywords.filter((k) => lower.includes(k)).length;
  const keywordOverlap = meaningfulKeywords.length > 0 ? overlap / meaningfulKeywords.length : 0;
  const isRelevant = wordCount > 0 && keywordOverlap > 0.12;

  // Sentences
  const sentences = answer.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(sentences.length, 1);
  const avgSentenceLength = wordCount / sentenceCount;

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength,
    hasSpecificNumbers,
    hasExampleMarkers,
    hasStructureMarkers,
    hasHedging,
    hasSelfReflection,
    hasImpactStatement,
    hasLeadershipSignal,
    hasOwnership,
    hasQuantifiedResults,
    hasActionVerbs,
    hasSTAR,
    isVague,
    isRelevant,
    isGenericCliché,
    hasFiller,
    keywordOverlap,
    questionType,
  };
}

// ============================================================================
// Enhanced scoring with question-type awareness
// ============================================================================

function score(a: AnalyzedAnswer): Record<string, number> {
  const s: Record<string, number> = {
    clarity: 3,
    structure: 3,
    specificity: 3,
    relevance: 3,
    examples: 3,
    reasoning: 3,
    persuasiveness: 3,
    conciseness: 3,
    impact: 3,
    authenticity: 3,
  };

  if (a.wordCount === 0) {
    Object.keys(s).forEach((k) => (s[k] = 1));
    return s;
  }

  // --- Clarity ---
  if (a.avgSentenceLength > 0 && a.avgSentenceLength < 20) s.clarity = 4;
  if (a.avgSentenceLength > 0 && a.avgSentenceLength < 14) s.clarity = 5;
  if (a.avgSentenceLength > 35) s.clarity = 2;
  if (a.hasFiller) s.clarity = Math.min(s.clarity, 2);

  // --- Structure ---
  if (a.hasStructureMarkers) s.structure = 4;
  if (a.sentenceCount >= 3 && a.avgSentenceLength < 25) s.structure = Math.max(s.structure, 4);
  if (a.hasSTAR) s.structure = 5;
  if (a.sentenceCount === 1 && a.wordCount > 40) s.structure = 2;
  if (a.sentenceCount >= 4 && a.hasStructureMarkers) s.structure = 5;

  // --- Specificity ---
  if (a.hasQuantifiedResults) s.specificity = 5;
  else if (a.hasSpecificNumbers) s.specificity = 4;
  else if (a.hasExampleMarkers) s.specificity = 4;
  else if (a.isVague) s.specificity = 2;
  if (a.isGenericCliché) s.specificity = Math.min(s.specificity, 2);

  // --- Relevance ---
  if (a.keywordOverlap > 0.3) s.relevance = 5;
  else if (a.keywordOverlap > 0.15) s.relevance = 4;
  else if (a.keywordOverlap < 0.05) s.relevance = 2;
  else s.relevance = 3;

  // --- Examples ---
  if (a.hasSTAR) s.examples = 5;
  else if (a.hasExampleMarkers && a.hasSpecificNumbers) s.examples = 5;
  else if (a.hasExampleMarkers) s.examples = 4;
  else if (a.wordCount < 30) s.examples = 2;

  // --- Reasoning ---
  if (a.hasSelfReflection && a.wordCount > 30) s.reasoning = 5;
  else if (a.wordCount > 20 && a.isRelevant) s.reasoning = 4;
  else if (a.wordCount < 15) s.reasoning = 2;
  if (a.questionType === 'hypothetical' && a.hasStructureMarkers) s.reasoning = Math.max(s.reasoning, 4);
  if (a.questionType === 'ethical' && a.hasSelfReflection) s.reasoning = Math.max(s.reasoning, 5);

  // --- Persuasiveness ---
  if (a.wordCount > 40 && a.isRelevant && a.hasExampleMarkers && !a.hasHedging) s.persuasiveness = 5;
  else if (a.wordCount > 40 && a.isRelevant && (a.hasExampleMarkers || a.hasActionVerbs)) s.persuasiveness = 4;
  else if (a.wordCount < 20) s.persuasiveness = 2;
  if (a.hasHedging) s.persuasiveness = Math.min(s.persuasiveness, 3);
  if (a.hasOwnership && a.isRelevant) s.persuasiveness = Math.max(s.persuasiveness, 4);

  // --- Conciseness ---
  if (a.wordCount > 0 && a.wordCount < 200 && a.wordCount > 40) s.conciseness = 5;
  if (a.wordCount > 0 && a.wordCount < 250) s.conciseness = 4;
  if (a.wordCount > 400) s.conciseness = 2;
  if (a.wordCount > 500) s.conciseness = 1;
  if (a.wordCount < 20) s.conciseness = 3;

  // --- Impact ---
  if (a.hasQuantifiedResults) s.impact = 5;
  else if (a.hasImpactStatement && a.hasSpecificNumbers) s.impact = 5;
  else if (a.hasImpactStatement) s.impact = 4;
  else if (a.hasSelfReflection) s.impact = 3;
  else if (a.wordCount < 20) s.impact = 2;
  if (a.questionType === 'behavioral' && !a.hasImpactStatement) s.impact = Math.min(s.impact, 2);

  // --- Authenticity ---
  if (a.hasSelfReflection && !a.isGenericCliché) s.authenticity = 5;
  else if (a.hasSelfReflection) s.authenticity = 4;
  else if (a.isGenericCliché) s.authenticity = 2;
  else if (!a.hasHedging && a.wordCount > 30) s.authenticity = 4;
  if (a.hasHedging) s.authenticity = Math.min(s.authenticity, 3);

  return s;
}

// ============================================================================
// Evaluation
// ============================================================================

export function evaluateAnswer(
  answer: string,
  questionText: string,
  language: Language
): Evaluation {
  const a = analyzeAnswer(answer, questionText);
  const scores = score(a);

  if (a.wordCount === 0 || answer.trim().length < 5) {
    return emptyEvaluation(language, scores);
  }

  const dims = Object.entries(scores).map(([key, val]) => ({
    dimension: DIMENSION_LABELS[language]?.[key] ?? key,
    score: val,
    note: dimensionNote(key, val, language),
  }));

  const sorted = [...dims].sort((x, y) => x.score - y.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  const overall = Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length) * 10) / 10;

  const { whatWorked, whatCouldImprove, whyItMatters, actionable, example } = buildFeedback(
    a,
    strongest,
    weakest,
    language
  );

  return {
    whatWorked,
    whatCouldImprove,
    whyItMatters,
    actionableSuggestion: actionable,
    exampleImprovement: example,
    dimensions: dims,
    overallScore: overall,
    isComplete: true,
  };
}

function emptyEvaluation(language: Language, scores: Record<string, number>): Evaluation {
  const dims = Object.entries(scores).map(([key, val]) => ({
    dimension: DIMENSION_LABELS[language]?.[key] ?? key,
    score: val,
    note: '',
  }));
  const empty = language === 'fr' ? '' : language === 'ar' ? '' : '';
  return {
    whatWorked: empty,
    whatCouldImprove: language === 'fr'
      ? "Votre réponse est trop courte pour être évaluée. Essayez d'élaborer davantage."
      : language === 'ar'
      ? 'إجابتك قصيرة جداً للتقييم. حاول التوسع أكثر.'
      : 'Your answer is too short to evaluate meaningfully. Try to elaborate more.',
    whyItMatters: '',
    actionableSuggestion: '',
    exampleImprovement: '',
    dimensions: dims,
    overallScore: 1,
    isComplete: true,
  };
}

function dimensionNote(key: string, val: number, language: Language): string {
  if (val >= 4) return '';
  const notes: Record<string, Record<Language, string>> = {
    specificity: {
      en: 'Add concrete numbers, names, or dates to make your answer tangible.',
      fr: 'Ajoutez des chiffres, noms ou dates concrètes pour rendre votre réponse tangible.',
      ar: 'أضف أرقاماً أو أسماء أو تواريخ ملموسة لتجعل إجابتك محسوسة.',
    },
    structure: {
      en: 'Signal your steps with words like "first", "then", "finally".',
      fr: 'Signalez vos étapes avec des mots comme "d\'abord", "ensuite", "enfin".',
      ar: 'وضح خطواتك بكلمات مثل "أولاً"، "ثم"، "أخيراً".',
    },
    examples: {
      en: 'Include a specific example or story with details.',
      fr: 'Incluez un exemple ou une histoire spécifique avec des détails.',
      ar: 'اذرح مثالاً أو قصة محددة بالتفاصيل.',
    },
    clarity: {
      en: 'Use shorter, clearer sentences. Avoid filler words.',
      fr: 'Utilisez des phrases plus courtes et plus claires. Évitez les mots de remplissage.',
      ar: 'استخدم جملاً أقصر وأوضح. تجنب الكلمات الزائدة.',
    },
    relevance: {
      en: 'Connect your answer more directly to the question.',
      fr: 'Reliez votre réponse plus directement à la question.',
      ar: 'اربط إجابتك أكثر بالسؤال.',
    },
    reasoning: {
      en: 'Explain the thinking behind your choices. Show your reasoning.',
      fr: 'Expliquez le raisonnement derrière vos choix. Montrez votre réflexion.',
      ar: 'اشرح وراء اختياراتك. أظهر تفكيرك.',
    },
    persuasiveness: {
      en: 'Make a clearer, more confident case for why you fit.',
      fr: 'Faites un argument plus clair et plus confiant pour votre adéquation.',
      ar: 'قدّم حججاً أوضح وأكثر ثقة لملاءمتك.',
    },
    conciseness: {
      en: 'Tighten your answer to the essential points.',
      fr: 'Resserez votre réponse sur l\'essentiel.',
      ar: 'اقصر إجابتك على النقاط الأساسية.',
    },
    impact: {
      en: 'Describe the outcome or result of your actions. What changed because of what you did?',
      fr: 'Décrivez le résultat de vos actions. Qu\'est-ce qui a changé grâce à vous ?',
      ar: 'صف نتيجة أفعالك. ما الذي تغير بفضلك؟',
    },
    authenticity: {
      en: 'Speak in your own voice. Avoid clichés and rehearsed phrases.',
      fr: 'Parlez de votre propre voix. Évitez les clichés et les phrases préparées.',
      ar: 'تحدث بصوتك الخاص. تجنب العبارات المحفوظة والمبتذلة.',
    },
  };
  return notes[key]?.[language] ?? notes[key]?.en ?? '';
}

// ============================================================================
// Rich feedback builder
// ============================================================================

function buildFeedback(
  a: AnalyzedAnswer,
  strongest: { dimension: string; score: number },
  weakest: { dimension: string; score: number },
  language: Language
) {
  const L = language;
  const en = L === 'en';

  // --- What worked ---
  let whatWorked: string;
  if (a.hasSTAR && a.hasQuantifiedResults) {
    whatWorked = en
      ? 'Excellent — your answer follows the STAR structure (Situation, Task, Action, Result) and includes quantified outcomes. This is exactly how strong interview answers are built.'
      : L === 'fr'
      ? 'Excellent — votre réponse suit la structure STAR (Situation, Tâche, Action, Résultat) et inclut des résultats quantifiés. C\'est exactement ainsi que se construisent les réponses solides.'
      : 'ممتاز — إجابتك تتبع بنية STAR (الموقف، المهمة، الإجراء، النتيجة) وتتضمن نتائج قابلة للقياس. هذا بالضبط كيف تُبنى الإجابات القوية.';
  } else if (a.hasSTAR) {
    whatWorked = en
      ? 'Your answer follows the STAR structure (Situation, Task, Action, Result), which makes it easy to follow and credible.'
      : L === 'fr'
      ? 'Votre réponse suit la structure STAR (Situation, Tâche, Action, Résultat), ce qui la rend facile à suivre et crédible.'
      : 'إجابتك تتبع بنية STAR (الموقف، المهمة، الإجراء، النتيجة)، مما يجعلها سهلة المتابعة وموثوقة.';
  } else if (a.hasExampleMarkers && a.hasQuantifiedResults) {
    whatWorked = en
      ? 'You backed your answer with a concrete example and quantified results, which makes it credible and memorable.'
      : L === 'fr'
      ? 'Vous avez étayé votre réponse avec un exemple concret et des résultats quantifiés, ce qui la rend crédible et mémorable.'
      : 'دعمت إجابتك بمثال ملموس ونتائج قابلة للقياس، مما يجعلها موثوقة ولا تُنسى.';
  } else if (a.hasExampleMarkers && a.hasSpecificNumbers) {
    whatWorked = en
      ? 'You included a specific example with concrete details — this makes your answer memorable and credible.'
      : L === 'fr'
      ? 'Vous avez inclus un exemple spécifique avec des détails concrets — cela rend votre réponse mémorable et crédible.'
      : 'أدرجت مثالاً محدداً بتفاصيل ملموسة — هذا يجعل إجابتك لا تُنسى وموثوقة.';
  } else if (a.hasSelfReflection && a.hasLeadershipSignal) {
    whatWorked = en
      ? 'You combined leadership experience with genuine self-reflection, showing both initiative and growth mindset.'
      : L === 'fr'
      ? 'Vous avez combiné une expérience de leadership avec une véritable auto-réflexion, montrant à la fois l\'initiative et l\'esprit de croissance.'
      : 'جمعت بين خبرة القيادة والتأمل الذاتي الحقيقي، مما يظهر المبادرة وعقلية النمو.';
  } else if (a.hasSelfReflection) {
    whatWorked = en
      ? 'You showed genuine self-reflection — mentioning what you learned or how the experience changed you. This signals maturity and a growth mindset.'
      : L === 'fr'
      ? 'Vous avez montré une véritable auto-réflexion — en mentionnant ce que vous avez appris ou comment l\'expérience vous a changé. Cela signale la maturité et l\'esprit de croissance.'
      : 'أظهرت تأملاً ذاتياً حقيقياً — بذكر ما تعلمته أو كيف غيّرت التجربة نظرتك. هذا يدل على النضج وعقلية النمو.';
  } else if (a.hasExampleMarkers) {
    whatWorked = en
      ? 'You included a specific example rather than speaking only in generalities — that is a strong habit.'
      : L === 'fr'
      ? 'Vous avez inclus un exemple spécifique plutôt que de parler en généralités — c\'est une bonne habitude.'
      : 'أدرجت مثالاً محدداً بدلاً من التحدث بشكل عام فقط — هذه عادة قوية.';
  } else if (a.hasOwnership && a.hasActionVerbs) {
    whatWorked = en
      ? 'You used strong action verbs and took clear ownership of your work ("I led", "I built", "I improved"), which projects confidence.'
      : L === 'fr'
      ? 'Vous avez utilisé des verbes d\'action forts et pris clairement la responsabilité de votre travail (« j\'ai dirigé », « j\'ai construit », « j\'ai amélioré »), ce qui projette de la confiance.'
      : 'استخدمت أفعالاً قوية وتحملت مسؤولية عملك بوضوح ("قمت"، "بنيت"، "حسنت")، مما يعكس الثقة.';
  } else if (a.hasStructureMarkers) {
    whatWorked = en
      ? 'Your answer has a clear structure with logical steps that are easy to follow.'
      : L === 'fr'
      ? 'Votre réponse a une structure claire avec des étapes logiques faciles à suivre.'
      : 'إجابتك ذات بنية واضحة بخطوات منطقية يسهل متابعتها.';
  } else if (a.isRelevant && a.wordCount > 30) {
    whatWorked = en
      ? 'You stayed on topic and gave a substantive answer rather than dodging the question.'
      : L === 'fr'
      ? 'Vous êtes resté sur le sujet et avez donné une réponse substantielle.'
      : 'التزمت بالموضوع وأعطيت إجابة جوهرية.';
  } else if (a.wordCount > 0) {
    whatWorked = en
      ? 'You attempted to answer the question directly, which is a good starting point.'
      : L === 'fr'
      ? 'Vous avez tenté de répondre directement à la question, ce qui est un bon point de départ.'
      : 'حاولت الإجابة على السؤال مباشرة، وهي نقطة بداية جيدة.';
  } else {
    whatWorked = en ? 'You engaged with the question.' : 'Vous avez abordé la question.';
  }

  // --- What could improve ---
  let whatCouldImprove: string;
  if (a.isGenericCliché) {
    whatCouldImprove = en
      ? 'Your answer relies on clichéd phrases ("team player", "passionate about", "hard worker") that every candidate uses. These don\'t distinguish you. Replace them with a specific story that proves the quality.'
      : L === 'fr'
      ? 'Votre réponse utilise des phrases clichées (« esprit d\'équipe », « passionné par », « travailleur acharné ») que chaque candidat utilise. Elles ne vous distinguent pas. Remplacez-les par une histoire spécifique qui prouve la qualité.'
      : 'إجابتك تعتمد على عبارات مبتذلة ("لاعب فريق"، "شغوف بـ"، "عامل مجتهد") يستخدمها كل مرشح. هذه لا تميزك. استبدلها بقصة محددة تثبت السمة.';
  } else if (a.hasHedging && a.wordCount > 15) {
    whatCouldImprove = en
      ? 'Your answer contains hedging language ("maybe", "I guess", "sort of") that undermines your credibility. Speak with conviction — you are the expert on your own experience.'
      : L === 'fr'
      ? 'Votre réponse contient un langage d\'esquive (« peut-être », « je suppose », « en quelque sorte ») qui sape votre crédibilité. Parlez avec conviction — vous êtes l\'expert de votre propre expérience.'
      : 'إجابتك تحتوي على لغة مترددة ("ربما"، "أعتقد"، "نوعاً ما") تضعف مصداقيتك. تحدث بثقة — أنت الخبير بتجربتك الخاصة.';
  } else if (a.isVague) {
    whatCouldImprove = en
      ? 'Your answer relies on vague language ("things", "a lot", "good") instead of concrete details. Replace each vague word with something specific — a number, a name, a date.'
      : L === 'fr'
      ? 'Votre réponse utilise un langage vague (« choses », « beaucoup », « bien ») au lieu de détails concrets. Remplacez chaque mot vague par quelque chose de spécifique — un chiffre, un nom, une date.'
      : 'إجابتك تعتمد على لغة غامضة ("أشياء"، "كثير"، "جيد") بدلاً من تفاصيل ملموسة. استبدل كل كلمة غامضة بشيء محدد — رقم، اسم، تاريخ.';
  } else if (!a.hasExampleMarkers && a.wordCount > 20) {
    whatCouldImprove = en
      ? 'Your answer lacks a concrete example. General statements are hard to remember and trust. Bring one specific story with a beginning, middle, and end.'
      : L === 'fr'
      ? 'Votre réponse manque d\'un exemple concret. Les affirmations générales sont difficiles à retenir et à croire. Apportez une histoire spécifique avec un début, un milieu et une fin.'
      : 'إجابتك تفتقر لمثال ملموس. العبارات العامة يصعب تذكرها وتصديقها. اطرح قصة محددة ببداية ووسط ونهاية.';
  } else if (a.questionType === 'behavioral' && !a.hasImpactStatement) {
    whatCouldImprove = en
      ? 'For behavioral questions, interviewers expect to hear the outcome of your actions. You described what you did but not what changed because of it. Add the result.'
      : L === 'fr'
      ? 'Pour les questions comportementales, les évaluateurs s\'attendent à entendre le résultat de vos actions. Vous avez décrit ce que vous avez fait mais pas ce qui a changé. Ajoutez le résultat.'
      : 'للأسئلة السلوكية، يتوقع المقابلون سماع نتيجة أفعالك. وصفت ما فعلته لكن لم تذكر ما تغير بسببه. أضف النتيجة.';
  } else if (!a.hasStructureMarkers && a.sentenceCount > 2) {
    whatCouldImprove = en
      ? 'Your ideas run together without clear signposts, making the answer harder to follow. Use transition words like "first", "then", "as a result".'
      : L === 'fr'
      ? 'Vos idées s\'enchaînent sans repères clairs, ce qui rend la réponse plus difficile à suivre. Utilisez des mots de transition comme « d\'abord », « ensuite », « en résultat ».'
      : 'أفكارك متسلسلة دون علامات واضحة، مما يجعل الإجابة أصعب في المتابعة. استخدم كلمات انتقالية مثل "أولاً"، "ثم"، "ونتيجة لذلك".';
  } else if (a.wordCount < 20) {
    whatCouldImprove = en
      ? 'Your answer is too brief. Interviewers cannot evaluate depth from one or two sentences. Aim for 3–5 sentences with a specific example.'
      : L === 'fr'
      ? 'Votre réponse est trop brève. Les évaluateurs ne peuvent pas juger la profondeur en une ou deux phrases. Visez 3–5 phrases avec un exemple spécifique.'
      : 'إجابتك قصيرة جداً. لا يستطيع المقابلون تقييم العمق من جملة أو جملتين. استهدف 3-5 جمل مع مثال محدد.';
  } else if (!a.isRelevant) {
    whatCouldImprove = en
      ? 'Your answer drifts from the actual question being asked. Re-read the question and make sure every sentence connects back to it.'
      : L === 'fr'
      ? 'Votre réponse s\'éloigne de la question posée. Relisez la question et assurez-vous que chaque phrase s\'y rapporte.'
      : 'إجابتك تبتعد عن السؤال المطروح. أعد قراءة السؤال وتأكد أن كل جملة ترتبط به.';
  } else if (a.wordCount > 400) {
    whatCouldImprove = en
      ? 'Your answer is quite long. In a real interview, you risk losing the interviewer\'s attention. Aim for 150–250 words — enough to tell a complete story, no more.'
      : L === 'fr'
      ? 'Votre réponse est assez longue. Vous risquez de perdre l\'attention de l\'évaluateur. Visez 150–250 mots — assez pour raconter une histoire complète, pas plus.'
      : 'إجابتك طويلة جداً. قد تفقد انتباه المقابل. استهدف 150-250 كلمة — تكفي لسرد قصة كاملة، لا أكثر.';
  } else if (!a.hasSelfReflection && (a.questionType === 'behavioral' || a.questionType === 'motivation')) {
    whatCouldImprove = en
      ? 'You described what happened but not what you learned. Interviewers look for self-awareness — add a sentence about how the experience changed or taught you.'
      : L === 'fr'
      ? 'Vous avez décrit ce qui s\'est passé mais pas ce que vous avez appris. Les évaluateurs cherchent la conscience de soi — ajoutez une phrase sur ce que l\'expérience vous a appris.'
      : 'وصفت ما حدث لكن لم تذكر ما تعلمته. يبحث المقابلون عن الوعي الذاتي — أضف جملة عن كيف غيّرتك التجربة أو علمتك.';
  } else {
    whatCouldImprove = en
      ? `Your strongest area to improve is ${weakest.dimension.toLowerCase()}. Focus your next attempt on that dimension.`
      : `Votre point d\'amélioration principal est ${weakest.dimension.toLowerCase()}. Concentrez votre prochaine tentative sur ce point.`;
  }

  // --- Why it matters ---
  const whyMap: Record<Language, string> = {
    en: 'Interviewers use your answer to picture how you would act in their environment. Without specifics and outcomes, they have nothing concrete to remember you by — and they will remember the candidate who told a vivid story over the one who gave safe generalities.',
    fr: 'Les évaluateurs utilisent votre réponse pour imaginer comment vous agiriez dans leur environnement. Sans précisions et résultats, ils n\'ont rien de concret pour se souvenir de vous — et ils se souviendront du candidat qui a raconté une histoire vivante plutôt que celui qui a donné des généralités prudentes.',
    ar: 'يستخدم المقابلون إجابتك لتخيل كيف ستتصرف في بيئتهم. بدون تفاصيل ونتائج، ليس لديهم شيء ملموس يتذكرونك به — وسيتذكرون المرشح الذي روى قصة حية على من أعطى عمومات حذرة.',
  };
  const whyItMatters = whyMap[L];

  // --- Actionable suggestion ---
  let actionable: string;
  if (a.isGenericCliché) {
    actionable = en
      ? 'Pick one cliché you used (e.g. "team player") and replace it with a 2-sentence story that proves it: "On my project team, two members disagreed on the approach. I mediated by..." — let the story do the work.'
      : L === 'fr'
      ? 'Choisissez un cliché que vous avez utilisé (ex. « esprit d\'équipe ») et remplacez-le par une histoire de 2 phrases qui le prouve : « Dans mon projet, deux membres étaient en désaccord. J\'ai médéié en... » — laissez l\'histoire faire le travail.'
      : 'اختر عبارة مبتذلة استخدمتها (مثل "لاعب فريق") واستبدلها بقصة من جملتين تثبتها: "في فريق مشروعي، اختلف عضوان على المنهج. توسطت بالطرق التالية..." — دع القصة تقوم بالعمل.';
  } else if (a.hasHedging) {
    actionable = en
      ? 'Find every hedging word ("maybe", "I guess", "sort of") and either remove it or replace it with a confident statement. "I guess I led the team" becomes "I led the team of five."'
      : L === 'fr'
      ? 'Trouvez chaque mot d\'esquive (« peut-être », « je suppose ») et supprimez-le ou remplacez-le par une affirmation confiante. « Je suppose que j\'ai dirigé l\'équipe » devient « J\'ai dirigé l\'équipe de cinq. »'
      : 'ابحث عن كل كلمة مترددة ("ربما"، "أعتقد") واحذفها أو استبدلها بعبارة واثقة. "أعتقد أنني قُدت الفريق" تصبح "قُدت الفريق المكون من خمسة."';
  } else if (a.isVague || (!a.hasExampleMarkers && !a.hasQuantifiedResults)) {
    actionable = en
      ? 'Re-answer using the STAR method: state the Situation, the Task you faced, the Action you took, and the Result. Include at least one number or named detail.'
      : L === 'fr'
      ? 'Reformulez en utilisant la méthode STAR : Situation, Tâche, Action, Résultat. Incluez au moins un chiffre ou un détail nommé.'
      : 'أجب من جديد باستخدام طريقة STAR: الموقف، المهمة، الإجراء، النتيجة. أدرج رقماً أو تفصيلاً مسمى واحداً على الأقل.';
  } else if (!a.hasStructureMarkers) {
    actionable = en
      ? 'Break your answer into 2–3 clear parts. Start with "First…", continue with "Then…", and finish with "As a result…". This makes your answer 50% easier to follow.'
      : L === 'fr'
      ? 'Divisez votre réponse en 2–3 parties claires. Commencez par « D\'abord… », continuez par « Ensuite… » et terminez par « En résultat… ». Cela rend votre réponse 50% plus facile à suivre.'
      : 'قسّم إجابتك إلى 2-3 أجزاء واضحة. ابدأ بـ "أولاً..."، ثم "ثم..."، وانتهِ بـ "ونتيجة لذلك...". هذا يجعل إجابتك أسهل بنسبة 50% في المتابعة.';
  } else if (a.wordCount < 20) {
    actionable = en
      ? 'Aim for 3–5 sentences. State your main point, give one supporting example with a specific detail, and close with the outcome or lesson learned.'
      : L === 'fr'
      ? 'Visez 3–5 phrases. Énoncez votre point principal, donnez un exemple à l\'appui avec un détail spécifique, et concluez par le résultat ou l\'enseignement.'
      : 'استهدف 3-5 جمل. اذكر فكرتك الرئيسية، أعطِ مثالاً داعماً بتفصيل محدد، واختم بالنتيجة أو الدرس.';
  } else if (a.questionType === 'behavioral' && !a.hasImpactStatement) {
    actionable = en
      ? 'Add one final sentence about the outcome: "As a result, we delivered the project two weeks early" or "This led to a 20% increase in engagement." The result is what interviewers remember.'
      : L === 'fr'
      ? 'Ajoutez une dernière phrase sur le résultat : « En résultat, nous avons livré le projet deux semaines en avance » ou « Cela a conduit à une augmentation de 20% de l\'engagement. » Le résultat est ce que les évaluateurs retiennent.'
      : 'أضف جملة أخيرة عن النتيجة: "ونتيجة لذلك، سلمنا المشروع قبل أسبوعين" أو "أدى ذلك إلى زيادة 20% في التفاعل." النتيجة هي ما يتذكره المقابلون.';
  } else if (!a.hasSelfReflection && (a.questionType === 'behavioral' || a.questionType === 'motivation')) {
    actionable = en
      ? 'Close with a reflection: "What I learned from this was..." or "This experience taught me that..." One sentence of self-awareness lifts your answer from good to memorable.'
      : L === 'fr'
      ? 'Concluez par une réflexion : « Ce que j\'ai appris de cela était... » ou « Cette expérience m\'a appris que... » Une phrase de conscience de soi élève votre réponse de bonne à mémorable.'
      : 'اختم بتأمل: "ما تعلمته من هذا كان..." أو "علمتني هذه التجربة أن..." جملة واحدة من الوعي الذاتي ترفع إجابتك من جيدة إلى لا تُنسى.';
  } else {
    actionable = en
      ? `Focus on ${weakest.dimension.toLowerCase()}: review your answer and strengthen that specific aspect. Try again with that improvement in mind.`
      : L === 'fr'
      ? `Concentrez-vous sur ${weakest.dimension.toLowerCase()} : relisez votre réponse et renforcez cet aspect spécifique. Réessayez avec cette amélioration en tête.`
      : `ركّز على ${weakest.dimension}: راجع إجابتك وقوِّ هذا الجانب تحديداً. حاول مجدداً مع هذا التحسين في ذهنك.`;
  }

  // --- Example improvement ---
  const exampleMap: Record<Language, string> = {
    en: 'Example (illustrative, not your experience): "In my final year project, I led a team of four students building a web app. I broke the work into weekly milestones, which let us finish two days early and earn a 95% grade. What I learned from this was that clear deadlines and check-ins matter more than talent alone."',
    fr: 'Exemple (illustratif, pas votre expérience) : « Dans mon projet de fin d\'études, j\'ai dirigé une équipe de quatre étudiants construisant une application web. J\'ai divisé le travail en étapes hebdomadaires, ce qui nous a permis de terminer deux jours en avance et d\'obtenir une note de 95%. Ce que j\'en ai appris, c\'est que des échéances claires et des points réguliers comptent plus que le talent seul. »',
    ar: 'مثال (توضيحي وليس تجربتك): "في مشروع تخرجي، قُدت فريقاً من أربعة طلاب يبنون تطبيق ويب. قسّمت العمل إلى مراحل أسبوعية، مما سمح لنا بالانتهاء قبل يومين والحصول على درجة 95%. ما تعلمته من هذا هو أن المواعيد الواضحة والمتابعة المنتظمة تهم أكثر من الموهبة وحدها."',
  };

  return {
    whatWorked,
    whatCouldImprove,
    whyItMatters: whyItMatters,
    actionable,
    example: exampleMap[L],
  };
}

// ============================================================================
// Contextual follow-up generation
// ============================================================================

export function generateFollowUp(
  lastAnswer: string,
  language: Language,
  usedFollowUps: string[]
): string | null {
  const a = analyzeAnswer(lastAnswer, '');
  if (a.wordCount < 15) return null;

  // Build contextual follow-ups based on what the answer contained
  const contextual: string[] = [];
  const lower = lastAnswer.toLowerCase();

  const ctxEn: { test: boolean; q: string }[] = [
    { test: !a.hasSpecificNumbers, q: 'Can you put a number to that? What was the measurable outcome?' },
    { test: !a.hasImpactStatement, q: 'What was the result or outcome of what you did?' },
    { test: !a.hasSelfReflection, q: 'What did you learn from that experience?' },
    { test: a.hasExampleMarkers, q: 'You mentioned a specific situation — what would you do differently if it happened again?' },
    { test: /\b(led|managed|organized|team)\b/.test(lower), q: 'How did the people on your team respond to your approach?' },
    { test: /\b(failed|mistake|wrong|didn't|struggled)\b/.test(lower), q: 'What did that setback teach you about yourself?' },
    { test: /\b(learned|realized|discovered|changed)\b/.test(lower), q: 'How has that realization affected what you do now?' },
    { test: a.hasLeadershipSignal, q: 'What was the hardest part of leading that effort?' },
    { test: a.wordCount > 100 && !a.hasStructureMarkers, q: 'You covered a lot — which part of that experience was most important, and why?' },
    { test: true, q: 'How does that experience prepare you for this specific opportunity?' },
  ];

  const ctxFr: { test: boolean; q: string }[] = [
    { test: !a.hasSpecificNumbers, q: 'Pouvez-vous quantifier cela ? Quel était le résultat mesurable ?' },
    { test: !a.hasImpactStatement, q: 'Quel a été le résultat de ce que vous avez fait ?' },
    { test: !a.hasSelfReflection, q: 'Qu\'avez-vous appris de cette expérience ?' },
    { test: a.hasExampleMarkers, q: 'Vous avez mentionné une situation spécifique — que feriez-vous différemment si cela se reproduisait ?' },
    { test: /\b(led|managed|organized|team)\b/.test(lower), q: 'Comment les membres de votre équipe ont-ils réagi à votre approche ?' },
    { test: /\b(failed|mistake|wrong|struggled)\b/.test(lower), q: 'Que vous a appris cet échec sur vous-même ?' },
    { test: /\b(learned|realized|discovered|changed)\b/.test(lower), q: 'Comment cette prise de conscience affecte-t-elle ce que vous faites maintenant ?' },
    { test: a.hasLeadershipSignal, q: 'Quelle a été la partie la plus difficile de cette initiative ?' },
    { test: a.wordCount > 100 && !a.hasStructureMarkers, q: 'Vous avez couvert beaucoup — quelle partie de cette expérience était la plus importante, et pourquoi ?' },
    { test: true, q: 'Comment cette expérience vous prépare-t-elle à cette opportunité spécifique ?' },
  ];

  const ctxAr: { test: boolean; q: string }[] = [
    { test: !a.hasSpecificNumbers, q: 'هل يمكنك وضع رقم لذلك؟ ماذا كانت النتيجة القابلة للقياس؟' },
    { test: !a.hasImpactStatement, q: 'ماذا كانت نتيجة ما فعلته؟' },
    { test: !a.hasSelfReflection, q: 'ماذا تعلمت من تلك التجربة؟' },
    { test: a.hasExampleMarkers, q: 'ذكرت موقفاً محدداً — ماذا ستفعل بشكل مختلف لو تكرر؟' },
    { test: /\b(led|managed|organized|team)\b/.test(lower), q: 'كيف استجاب أعضاء فريقك لطريقتك؟' },
    { test: /\b(failed|mistake|wrong|struggled)\b/.test(lower), q: 'ماذا علمك ذلك النكس عن نفسك؟' },
    { test: /\b(learned|realized|discovered|changed)\b/.test(lower), q: 'كيف أثرت تلك الفكرة على ما تفعله الآن؟' },
    { test: a.hasLeadershipSignal, q: 'ما كان أصعب جزء في قيادة ذلك الجهد؟' },
    { test: a.wordCount > 100 && !a.hasStructureMarkers, q: 'تغطيت كثيراً — أي جزء من تلك التجربة كان الأهم، ولماذا؟' },
    { test: true, q: 'كيف تعدك تلك التجربة لهذه الفرصة تحديداً؟' },
  ];

  const ctxMap = { en: ctxEn, fr: ctxFr, ar: ctxAr };
  const ctx = ctxMap[language] ?? ctxEn;

  // Add contextual follow-ups first (in priority order), then fall back to generic templates
  const candidates: string[] = [];
  for (const c of ctx) {
    if (c.test && !usedFollowUps.includes(c.q) && !candidates.includes(c.q)) {
      candidates.push(c.q);
    }
  }

  // Fill remaining slots with generic templates
  const templates = FOLLOW_UP_TEMPLATES[language] ?? FOLLOW_UP_TEMPLATES.en;
  for (const t of templates) {
    if (candidates.length >= 4) break;
    if (!usedFollowUps.includes(t) && !candidates.includes(t)) {
      candidates.push(t);
    }
  }

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * Math.min(candidates.length, 3))];
}

// ============================================================================
// Session summary
// ============================================================================

export function generateSessionSummary(session: InterviewSession, language: Language): SessionSummary {
  const allAttempts = Object.values(session.attempts).flat();
  const evaluated = allAttempts.filter((a) => a.evaluation);

  const dimensionWeaknesses: Record<string, number> = {};
  evaluated.forEach((a) => {
    a.evaluation!.dimensions.forEach((d) => {
      if (d.score <= 2) {
        dimensionWeaknesses[d.dimension] = (dimensionWeaknesses[d.dimension] ?? 0) + 1;
      }
    });
  });

  const recurringWeaknesses = Object.entries(dimensionWeaknesses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([d]) => d);

  const dimensionStrengths: Record<string, number> = {};
  evaluated.forEach((a) => {
    a.evaluation!.dimensions.forEach((d) => {
      if (d.score >= 4) {
        dimensionStrengths[d.dimension] = (dimensionStrengths[d.dimension] ?? 0) + 1;
      }
    });
  });

  const strongestAspects = Object.entries(dimensionStrengths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([d]) => d);

  const improvementsAchieved = Object.values(session.comparisons).filter(
    (c) => c.scoreDelta > 0
  ).length;

  const questionsAnswered = Object.keys(session.attempts).filter(
    (qid) => session.attempts[qid].length > 0
  ).length;

  const avgScore =
    evaluated.length > 0
      ? Math.round((evaluated.reduce((s, a) => s + a.evaluation!.overallScore, 0) / evaluated.length) * 10) / 10
      : 0;

  const weakestArea = recurringWeaknesses[0] ?? '';

  const recommendedNext = recurringWeaknesses.length > 0
    ? language === 'en'
      ? [`Practice ${recurringWeaknesses[0].toLowerCase()} with focused exercises`, 'Try a harder difficulty level', 'Do a longer session to build endurance']
      : language === 'fr'
      ? [`Pratiquez ${recurringWeaknesses[0].toLowerCase()} avec des exercices ciblés`, 'Essayez un niveau de difficulté supérieur', 'Faites une session plus longue']
      : [`تدرب على ${recurringWeaknesses[0]} بتمارين مركزة`, 'جرّب مستوى صعوبة أعلى', 'قم بجلسة أطول لبناء التحمل']
    : language === 'en'
    ? ['Continue regular practice', 'Try a new interview category', 'Challenge yourself with advanced questions']
    : language === 'fr'
    ? ['Continuez la pratique régulière', 'Essayez une nouvelle catégorie d\'entretien', 'Défiez-vous avec des questions avancées']
    : ['ممارسة منتظمة', 'جرّب فئة مقابلة جديدة', 'تحدَّ نفسك بأسئلة متقدمة'];

  const overallAssessment = buildOverallAssessment(avgScore, improvementsAchieved, questionsAnswered, language);

  return {
    overallAssessment,
    strongestAspects,
    recurringWeaknesses,
    questionsAnswered,
    improvementsAchieved,
    recommendedNext,
    weakestArea,
  };
}

function buildOverallAssessment(
  avgScore: number,
  improvements: number,
  questions: number,
  language: Language
): string {
  if (questions === 0) {
    return language === 'en'
      ? 'No questions were answered in this session. Try starting another interview.'
      : language === 'fr'
      ? 'Aucune question n\'a été répondue dans cette session. Essayez de démarrer un autre entretien.'
      : 'لم تتم الإجابة على أي سؤال في هذه الجلسة. حاول بدء مقابلة أخرى.';
  }

  const level = avgScore >= 4 ? 'strong' : avgScore >= 3 ? 'solid' : 'developing';
  const en = language === 'en';

  if (en) {
    const base = `You answered ${questions} question${questions > 1 ? 's' : ''} with an average quality of ${avgScore}/5 — a ${level} performance.`;
    const retry = improvements > 0
      ? ` Notably, you improved on ${improvements} question${improvements > 1 ? 's' : ''} through retry, which shows real willingness to grow.`
      : ' You did not retry any questions this session — retrying is where the fastest improvement happens.';
    return base + retry;
  }
  if (language === 'fr') {
    const base = `Vous avez répondu à ${questions} question${questions > 1 ? 's' : ''} avec une qualité moyenne de ${avgScore}/5 — une performance ${level === 'strong' ? 'forte' : level === 'solid' ? 'solide' : 'en développement'}.`;
    const retry = improvements > 0
      ? ` Vous vous êtes amélioré sur ${improvements} question${improvements > 1 ? 's' : ''} en réessayant.`
      : ' Vous n\'avez pas réessayé de questions cette session.';
    return base + retry;
  }
  const base = `أجبت على ${questions} سؤالاً بمتوسط جودة ${avgScore}/5 — أداءً ${level === 'strong' ? 'قوياً' : level === 'solid' ? 'متيناً' : 'تطورياً'}.`;
  const retry = improvements > 0
    ? ` تحسنت في ${improvements} سؤالاً عبر إعادة المحاولة.`
    : ' لم تعد محاولة أي سؤال في هذه الجلسة.';
  return base + retry;
}
