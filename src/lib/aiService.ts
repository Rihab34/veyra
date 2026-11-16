import type {
  Evaluation,
  AnswerReview,
  SessionSummary,
  Language,
  InterviewSession,
  InterviewConfig,
  UserProfile,
  Attempt,
  Comparison,
} from '@/types';
import { supabase } from './supabaseClient';
import { parseAnswerReview, isAnswerReview } from './evaluation/validateReview';
import { compareAttempts } from './evaluation/compareAttempts';
import {
  evaluateAnswer,
  generateFollowUp,
  generateSessionSummary,
} from './aiEngine';

export { isAnswerReview as validateEvaluation };

export interface CompareAttemptsParams {
  first: Attempt;
  second: Attempt;
  questionText: string;
  language: Language;
}

export async function compareAttemptsService(params: CompareAttemptsParams): Promise<Comparison | null> {
  await delay(400 + Math.random() * 300);
  const result = compareAttempts(params.first, params.second);
  if (!result) return null;
  return {
    scoreDelta: result.overallDelta,
    improvements: result.improvements,
    newStrengths: [],
    remainingWeakness: result.remainingWeaknesses[0] ?? '',
    recommendedAction: result.recommendation,
  };
}

import {
  QUESTION_BANK,
  pickQuestions,
  getQuestionText,
} from './questionBank';
import { generateLinkBasedQuestions } from './linkQuestions';

export type AIProvider = 'demo' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
}

let currentConfig: AIConfig = { provider: 'demo' };

export function configureAI(config: AIConfig): void {
  currentConfig = config;
}

export function getProvider(): AIProvider {
  return currentConfig.provider;
}

export function isDemoMode(): boolean {
  return currentConfig.provider === 'demo';
}

export interface GenerateQuestionParams {
  config: InterviewConfig;
  profile: UserProfile | null;
  questionIndex: number;
  previousQuestions: string[];
  previousAnswers: string[];
  usedFollowUps: string[];
  focusArea?: string;
  pageContext?: string;
}

export interface GenerateQuestionResult {
  questionId: string;
  questionText: string;
  isFollowUp: boolean;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// === Adaptive performance tracking ===

interface PerformanceState {
  recentScores: number[];
  avgScore: number;
  totalAnswered: number;
  followUpsUsed: number;
  weakDimensions: Map<string, number>;
  askedTagSet: Set<string>;
  askedTextSet: Set<string>;
}

function computePerformance(
  previousAnswers: string[],
  previousQuestions: string[],
  evaluations: Evaluation[]
): PerformanceState {
  const recentScores = evaluations.slice(-3).map((e) => e.overallScore);
  const avgScore = recentScores.length > 0
    ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    : 0;

  const weakDimensions = new Map<string, number>();
  evaluations.forEach((e) => {
    e.dimensions.forEach((d) => {
      if (d.score <= 2) {
        const raw = d.dimension;
        // Reverse-lookup the internal key from the label — we store the label
        // in the dimension. For weakness matching we use the label directly.
        weakDimensions.set(raw, (weakDimensions.get(raw) ?? 0) + 1);
      }
    });
  });

  const askedTagSet = new Set<string>();
  const askedTextSet = new Set<string>();
  previousQuestions.forEach((q) => {
    askedTextSet.add(q);
    // Resolve question id → tags
    const seed = QUESTION_BANK.find((s) => s.id === q);
    if (seed) seed.tags.forEach((t) => askedTagSet.add(t));
  });

  return {
    recentScores,
    avgScore,
    totalAnswered: previousAnswers.length,
    followUpsUsed: 0,
    weakDimensions,
    askedTagSet,
    askedTextSet,
  };
}

// === Adaptive difficulty ===

function effectiveDifficulty(
  base: InterviewConfig['difficulty'],
  perf: PerformanceState
): InterviewConfig['difficulty'] {
  if (perf.totalAnswered < 2) return base;
  const order: InterviewConfig['difficulty'][] = ['beginner', 'intermediate', 'advanced'];
  const idx = order.indexOf(base);

  // Doing well (avg >= 4) — escalate one level
  if (perf.avgScore >= 4 && idx < 2) {
    return order[idx + 1];
  }
  // Struggling (avg <= 2.2) — de-escalate one level if not already at floor
  if (perf.avgScore <= 2.2 && idx > 0) {
    return order[idx - 1];
  }
  return base;
}

// === Smart question selection: avoid topic repetition ===

function pickFreshQuestion(
  config: InterviewConfig,
  perf: PerformanceState,
  baseIds: string[],
  questionIndex: number
): string {
  const lang = config.language;

  // First, try the pre-picked ordered list
  const preferredId = baseIds[Math.min(questionIndex, baseIds.length - 1)] ?? baseIds[0];
  const preferredText = preferredId ? getQuestionText(preferredId, lang) : '';

  // If the preferred question's text hasn't been asked, use it
  if (preferredText && !perf.askedTextSet.has(preferredText)) {
    return preferredId;
  }

  // Otherwise, search the full bank for a fresh question at the effective difficulty
  const effDiff = effectiveDifficulty(config.difficulty, perf);
  const pool = QUESTION_BANK.filter(
    (q) =>
      q.category === config.category &&
      q.difficulty === effDiff &&
      !perf.askedTextSet.has(q.text[lang] || q.text.en)
  );

  if (pool.length > 0) {
    // Prefer questions whose tags haven't been covered yet
    const freshTag = pool.find((q) => q.tags.every((t) => !perf.askedTagSet.has(t)));
    return (freshTag ?? pool[0]).id;
  }

  // Fallback: any question in the category not yet asked
  const fallback = QUESTION_BANK.filter(
    (q) => q.category === config.category && !perf.askedTextSet.has(q.text[lang] || q.text.en)
  );
  if (fallback.length > 0) return fallback[0].id;

  // Last resort: reuse the ordered list
  return preferredId;
}

// === Decide whether a follow-up is warranted ===

function shouldFollowUp(
  lastEval: Evaluation | undefined,
  perf: PerformanceState
): { shouldFollowUp: boolean; reason: 'weak' | 'curious' | 'none' } {
  if (perf.totalAnswered === 0) return { shouldFollowUp: false, reason: 'none' };

  // Don't stack too many follow-ups in a row — keep the rhythm natural
  if (perf.followUpsUsed >= 2) return { shouldFollowUp: false, reason: 'none' };

  if (!lastEval) return { shouldFollowUp: false, reason: 'none' };

  // If the answer was weak or vague, probe deeper (high chance)
  if (lastEval.overallScore <= 2.5) {
    return { shouldFollowUp: Math.random() > 0.25, reason: 'weak' };
  }

  // If the answer was strong and substantive, a curiosity follow-up is natural
  if (lastEval.overallScore >= 3.8 && perf.totalAnswered >= 1) {
    return { shouldFollowUp: Math.random() > 0.45, reason: 'curious' };
  }

  // Mid-range: occasional follow-up
  return { shouldFollowUp: Math.random() > 0.6, reason: 'curious' };
}

// === Collect prior evaluations from attempts ===

function collectEvaluations(
  previousAnswers: string[],
  config: InterviewConfig,
  // We don't have direct access to attempts here; the caller passes answers.
  // Re-evaluate lightweight to inform adaptivity.
): Evaluation[] {
  const evals: Evaluation[] = [];
  for (let i = 0; i < previousAnswers.length; i++) {
    const ans = previousAnswers[i];
    if (!ans || ans.trim().length < 5) continue;
    // We don't know the exact question text, but we can pass a generic one.
    // The evaluation is only used for adaptivity heuristics, not shown to the user.
    const e = evaluateAnswer(ans, previousAnswers[i] || 'interview question', config.language);
    if (e.isComplete) evals.push(e);
  }
  return evals;
}

export async function generateInterviewQuestion(
  params: GenerateQuestionParams
): Promise<GenerateQuestionResult> {
  const { config, questionIndex, previousAnswers, previousQuestions, usedFollowUps, pageContext } = params;

  await delay(400 + Math.random() * 300);

  // Build performance state from prior answers
  const evaluations = collectEvaluations(previousAnswers, config);
  const perf = computePerformance(previousAnswers, previousQuestions, evaluations);

  // --- Follow-up logic ---
  if (questionIndex > 0 && previousAnswers.length > 0) {
    const lastAnswer = previousAnswers[previousAnswers.length - 1];
    const lastEval = evaluations[evaluations.length - 1];
    const followDecision = shouldFollowUp(lastEval, perf);

    if (followDecision.shouldFollowUp) {
      const followUp = generateFollowUp(lastAnswer, config.language, usedFollowUps);
      if (followUp) {
        return {
          questionId: `followup_${questionIndex}`,
          questionText: followUp,
          isFollowUp: true,
        };
      }
      // reason is either 'weak' or 'curious' — both fall through to a normal question
      void followDecision.reason;
    }
  }

  // --- Link-based questions ---
  if (pageContext) {
    const linkQuestions = generateLinkBasedQuestions(
      pageContext,
      config.category,
      config.language,
      Math.max(Math.floor(config.sessionLength / 2.5), 3)
    );
    const id = `link_${questionIndex}`;
    // Pick a link question that hasn't been asked yet
    const freshLink = linkQuestions.find((q) => q && !perf.askedTextSet.has(q));
    const text = freshLink ?? linkQuestions[Math.min(questionIndex, linkQuestions.length - 1)] ?? linkQuestions[0];
    if (text) {
      return { questionId: id, questionText: text, isFollowUp: false };
    }
  }

  // --- Adaptive question selection ---
  const questionCount = Math.max(Math.floor(config.sessionLength / 2.5), 3);
  const baseIds = pickQuestions(
    config.category,
    config.difficulty,
    config.language,
    questionCount,
    config.practiceMode,
    params.focusArea
  );

  const id = pickFreshQuestion(config, perf, baseIds, questionIndex);
  const text = getQuestionText(id, config.language);

  if (!text) {
    return {
      questionId: `fallback_${questionIndex}`,
      questionText:
        config.language === 'fr'
          ? 'Parlez-nous d\'une expérience qui vous a marqué.'
          : config.language === 'ar'
          ? 'حدثنا عن تجربة أثّرت فيك.'
          : 'Tell us about an experience that shaped you.',
      isFollowUp: false,
    };
  }

  return { questionId: id, questionText: text, isFollowUp: false };
}

export class EvaluationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'EvaluationError';
  }
}

export interface EvaluateParams {
  questionText: string;
  answer: string;
  context?: string;
  language: Language;
}

const EVALUATION_TIMEOUT_MS = 45000;

export async function evaluateAnswerService(params: EvaluateParams): Promise<AnswerReview> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new EvaluationError('Please sign in again to evaluate answers.', 'unauthorized');
  }

  let response: Response;
  try {
    response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-answer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: params.questionText,
        answer: params.answer,
        context: params.context ?? '',
        language: params.language,
      }),
      signal: AbortSignal.timeout(EVALUATION_TIMEOUT_MS),
    });
  } catch {
    throw new EvaluationError('Could not reach the evaluation service. Your answer is saved; please retry.', 'network');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof body?.error === 'string' ? body.error : 'Evaluation failed. Please retry.';
    throw new EvaluationError(message, typeof body?.code === 'string' ? body.code : 'http');
  }

  try {
    return parseAnswerReview(body?.review, String(body?.model ?? ''), String(body?.evaluatedAt ?? ''));
  } catch {
    throw new EvaluationError('The evaluation came back incomplete. Please retry.', 'invalid_output');
  }
}

export interface SummaryParams {
  session: InterviewSession;
  language: Language;
}

export async function generateSessionSummaryService(params: SummaryParams): Promise<SessionSummary> {
  await delay(600 + Math.random() * 400);
  return generateSessionSummary(params.session, params.language);
}
