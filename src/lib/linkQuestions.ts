import type { InterviewCategory, Language } from '@/types';

interface ExtractedInfo {
  programs: string[];
  values: string[];
  requirements: string[];
  opportunities: string[];
  orgName: string;
}

function extractInfo(context: string): ExtractedInfo {
  const lower = context.toLowerCase();

  const programs: string[] = [];
  const valueKeywords = ['mission', 'values', 'vision', 'commitment', 'excellence', 'innovation', 'diversity', 'community', 'leadership', 'integrity', 'collaboration', 'impact'];
  const values = valueKeywords.filter((kw) => lower.includes(kw));

  const reqKeywords = ['requirement', 'eligibility', 'criteria', 'prerequisite', 'minimum', 'gpa', 'deadline', 'apply', 'application'];
  const requirements = reqKeywords.filter((kw) => lower.includes(kw));

  const oppKeywords = ['research', 'internship', 'funding', 'scholarship', 'fellowship', 'mentorship', 'exchange', 'laboratory', 'project', 'fieldwork', 'workshop'];
  const opportunities = oppKeywords.filter((kw) => lower.includes(kw));

  // Try to find program/degree mentions
  const programPatterns = [
    /\b(master|phd|doctorate|bachelor|undergraduate|graduate)\s+(?:of\s+)?(\w+)/gi,
    /\b(program|course|degree)\s+in\s+([\w\s]+)/gi,
  ];
  for (const pattern of programPatterns) {
    let match;
    while ((match = pattern.exec(context)) !== null && programs.length < 5) {
      programs.push(match[0].trim());
    }
  }

  // Extract organization name from title or first meaningful sentence
  const firstSentence = context.split(/[.!?]/)[0]?.trim() || '';
  const orgName = firstSentence.split(/\s+/).slice(0, 5).join(' ');

  return { programs, values, requirements, opportunities, orgName };
}

const QUESTION_TEMPLATES: Record<Language, {
  motivation: (ctx: string) => string;
  values: (ctx: string, vals: string[]) => string;
  program: (ctx: string, programs: string[]) => string;
  requirement: (ctx: string, reqs: string[]) => string;
  opportunity: (ctx: string, opps: string[]) => string;
  contribution: (ctx: string) => string;
  challenge: (ctx: string) => string;
  fit: (ctx: string) => string;
  categoryQuestions: (ctx: string) => string[];
}> = {
  en: {
    motivation: (ctx) => `Based on what you know about ${ctx}, what specifically draws you to this opportunity, and how does it connect to your long-term goals?`,
    values: (_ctx, vals) => `This organization emphasizes ${vals.slice(0, 3).join(', ')}. Tell us about a time you demonstrated one of these values in a concrete situation.`,
    program: (_ctx, programs) => `You're applying to ${programs.slice(0, 2).join(' or ') || 'this program'}. What specific aspect of the curriculum or research focus excites you most, and why?`,
    requirement: (_ctx, reqs) => `The selection criteria mention ${reqs.slice(0, 2).join(' and ') || 'specific requirements'}. How does your background prepare you to meet these expectations?`,
    opportunity: (_ctx, opps) => `This opportunity offers chances for ${opps.slice(0, 3).join(', ') || 'research and growth'}. How would you take advantage of these during your time there?`,
    contribution: (ctx) => `What unique perspective or experience would you bring to ${ctx} that other candidates might not?`,
    challenge: (ctx) => `If you were selected by ${ctx}, what do you think would be your biggest challenge in the first year, and how would you address it?`,
    fit: (ctx) => `Why are you a stronger fit for ${ctx} than other candidates with similar qualifications?`,
    categoryQuestions: (ctx) => [
      `You have reviewed ${ctx}. Which course, faculty, research group, or student community would you seek out first, and what would you contribute there?`,
      `Imagine you receive an offer from ${ctx} but your first-choice program is unavailable. What would you do, and what would that reveal about your academic priorities?`,
      `What question would you ask an admissions tutor at ${ctx} to decide whether this is the right environment for you?`,
    ],
  },
  fr: {
    motivation: (ctx) => `D'après ce que vous savez de ${ctx}, qu'est-ce qui vous attire spécifiquement dans cette opportunité, et comment cela se relie-t-il à vos objectifs à long terme ?`,
    values: (_ctx, vals) => `Cette organisation met l'accent sur ${vals.slice(0, 3).join(', ')}. Parlez-nous d'une fois où vous avez démontré l'une de ces valeurs dans une situation concrète.`,
    program: (_ctx, programs) => `Vous postulez à ${programs.slice(0, 2).join(' ou ') || 'ce programme'}. Quel aspect spécifique du cursus ou de la recherche vous enthousiasme le plus, et pourquoi ?`,
    requirement: (_ctx, reqs) => `Les critères de sélection mentionnent ${reqs.slice(0, 2).join(' et ') || 'des exigences spécifiques'}. Comment votre parcours vous prépare-t-il à répondre à ces attentes ?`,
    opportunity: (_ctx, opps) => `Cette opportunité offre des chances de ${opps.slice(0, 3).join(', ') || 'recherche et de croissance'}. Comment en profitez-vous pendant votre séjour ?`,
    contribution: (ctx) => `Quelle perspective ou expérience unique apporterez-vous à ${ctx} que d'autres candidats pourraient ne pas avoir ?`,
    challenge: (ctx) => `Si vous étiez sélectionné par ${ctx}, quel serait votre plus grand défi la première année, et comment y feriez-vous face ?`,
    fit: (ctx) => `Pourquoi êtes-vous plus adapté à ${ctx} que d'autres candidats aux qualifications similaires ?`,
    categoryQuestions: (ctx) => [
      `Vous avez étudié ${ctx}. Quel cours, quelle faculté ou quelle communauté étudiante chercheriez-vous en premier, et qu'y apporteriez-vous ?`,
      `Imaginez que ${ctx} vous accepte dans un programme différent de votre premier choix. Que feriez-vous et que cela révélerait-il sur vos priorités académiques ?`,
      `Quelle question poseriez-vous à un responsable des admissions de ${ctx} pour savoir si cet environnement vous convient ?`,
    ],
  },
  ar: {
    motivation: (ctx) => `بناءً على ما تعرفه عن ${ctx}، ما الذي يجذبك تحديداً إلى هذه الفرصة، وكيف ترتبط بأهدافك طويلة المدى؟`,
    values: (_ctx, vals) => `تؤمن هذه المؤسسة بـ ${vals.slice(0, 3).join('، ')}. حدثنا عن موقف أظهرت فيه إحدى هذه القيم بشكل ملموس.`,
    program: (_ctx, programs) => `تتقدم إلى ${programs.slice(0, 2).join(' أو ') || 'هذا البرنامج'}. ما الجانب المحدد في المنهج أو البحث الذي يثير حماسك أكثر، ولماذا؟`,
    requirement: (_ctx, reqs) => `تذكر معايير الاختيار ${reqs.slice(0, 2).join(' و ') || 'متطلبات محددة'}. كيف تعدك خلفيتك للوفاء بهذه التوقعات؟`,
    opportunity: (_ctx, opps) => `تتيح هذه الفرصة فرصاً لـ ${opps.slice(0, 3).join('، ') || 'البحث والنمو'}. كيف ستستفيد منها خلال فترتك هناك؟`,
    contribution: (ctx) => `ما المنظور أو الخبرة الفريدة التي ستجلبها إلى ${ctx} وقد لا يمتلكها المرشحون الآخرون؟`,
    challenge: (ctx) => `لو تم اختيارك من قبل ${ctx}، ما الذي سيكون أكبر تحدٍ لك في السنة الأولى، وكيف ستواجهه؟`,
    fit: (ctx) => `لماذا أنت أكثر ملاءمة لـ ${ctx} من المرشحين الآخرين ذوي المؤهلات المشابهة؟`,
    categoryQuestions: (ctx) => [
      `لقد درست معلومات عن ${ctx}. أي مقرر أو كلية أو مجتمع طلابي ستسعى إليه أولاً، وماذا ستضيف إليه؟`,
      `تخيل أن ${ctx} قدم لك قبولاً في برنامج مختلف عن خيارك الأول. ماذا ستفعل، وماذا يكشف ذلك عن أولوياتك الأكاديمية؟`,
      `ما السؤال الذي ستطرحه على مسؤول القبول في ${ctx} لتقرر إن كانت هذه البيئة مناسبة لك؟`,
    ],
  },
};

export function generateLinkBasedQuestions(
  pageContext: string,
  category: InterviewCategory,
  language: Language,
  count: number
): string[] {
  const info = extractInfo(pageContext);
  const t = QUESTION_TEMPLATES[language] || QUESTION_TEMPLATES.en;
  const ctxLabel = info.orgName || (category === 'scholarship'
    ? 'this scholarship'
    : category === 'job'
    ? 'this company'
    : category === 'internship'
    ? 'this internship program'
    : category === 'competition'
    ? 'this competition'
    : category === 'personal_intro'
    ? 'this opportunity'
    : 'this institution');

  const categoryQuestions: Record<InterviewCategory, string[]> = {
    university: t.categoryQuestions(ctxLabel),
    scholarship: [
      `The ${ctxLabel} selection panel asks for evidence of impact. What changed for the people you served, and how do you know?`,
      `If you received the ${ctxLabel} award, what would you do in your first 90 days to turn the opportunity into measurable progress?`,
      `What would your referee say is the strongest evidence that you will use the ${ctxLabel} opportunity responsibly?`,
    ],
    job: [
      `Imagine you join ${ctxLabel} and your manager gives you an unclear problem on your first week. What would you clarify, and what would you deliver first?`,
      `Tell me about a decision you made with competing customer, team, or business priorities. What trade-off did you make and what was the result?`,
      `What would you want to understand about ${ctxLabel}'s customers before proposing your first improvement?`,
    ],
    internship: [
      `In the first two weeks of this internship at ${ctxLabel}, how would you learn the team's workflow and find a useful task you could own?`,
      `Tell me about a time you received feedback on work that was not finished. What did you change before submitting it again?`,
      `If your mentor gave you a task using a tool you have never used, what would you do in the first two hours?`,
    ],
    competition: [
      `In the ${ctxLabel} competition, how would you divide your preparation time between fundamentals, timed practice, and reviewing mistakes?`,
      `Your first solution fails during the ${ctxLabel} event and you have limited time left. How would you diagnose the failure and choose what to try next?`,
      `What would you want the judges or your teammates to remember about your contribution after the ${ctxLabel} final?`,
    ],
    personal_intro: [
      `You have 60 seconds to introduce yourself to someone who could open your next opportunity. What story would you choose and why?`,
      `What is the connection between the experience on your profile and the kind of person you are becoming?`,
      `Tell me about a recent conversation that changed the way you explain your work or goals.`,
    ],
    custom: [
      `What is the most important decision you would make in the first month of ${ctxLabel}, and what evidence would guide it?`,
      `Tell me about a moment that tested whether your actions matched the values you claim to hold.`,
      `What would success look like after six months in ${ctxLabel}, and how would you measure it?`,
    ],
  };

  const candidates: string[] = [
    t.motivation(ctxLabel),
    t.contribution(ctxLabel),
    t.fit(ctxLabel),
    t.challenge(ctxLabel),
    ...categoryQuestions[category],
  ];

  if (info.values.length > 0) {
    candidates.push(t.values(ctxLabel, info.values));
  }
  if (info.programs.length > 0) {
    candidates.push(t.program(ctxLabel, info.programs));
  }
  if (info.requirements.length > 0) {
    candidates.push(t.requirement(ctxLabel, info.requirements));
  }
  if (info.opportunities.length > 0) {
    candidates.push(t.opportunity(ctxLabel, info.opportunities));
  }

  // Deduplicate and trim to count
  const unique = [...new Set(candidates)];
  return unique.slice(0, Math.max(count, 3));
}
