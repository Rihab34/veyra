import type { AnswerReview, CriterionScore } from '@/types';
import { CRITERION_KEYS, RUBRIC_VERSION } from './rubric';

export class EvaluationFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvaluationFormatError';
  }
}

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireText(obj: Json, field: string): string {
  const value = obj[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new EvaluationFormatError(`Missing text field: ${field}`);
  }
  return value.trim();
}

function requireScore(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new EvaluationFormatError(`Invalid score for ${label}`);
  }
  return Math.round(value);
}

function parseCriteria(raw: unknown): CriterionScore[] {
  if (!Array.isArray(raw) || raw.length !== CRITERION_KEYS.length) {
    throw new EvaluationFormatError('Criteria must contain exactly one entry per rubric criterion');
  }
  const byKey = new Map<string, CriterionScore>();
  for (const item of raw) {
    if (!isObject(item)) throw new EvaluationFormatError('Malformed criterion entry');
    const key = requireText(item, 'key');
    if (!CRITERION_KEYS.includes(key as (typeof CRITERION_KEYS)[number])) {
      throw new EvaluationFormatError(`Unknown criterion: ${key}`);
    }
    if (byKey.has(key)) throw new EvaluationFormatError(`Duplicate criterion: ${key}`);
    const note = typeof item.note === 'string' ? item.note.trim() : '';
    byKey.set(key, { key, score: requireScore(item.score, key), note });
  }
  return CRITERION_KEYS.map((key) => {
    const entry = byKey.get(key);
    if (!entry) throw new EvaluationFormatError(`Missing criterion: ${key}`);
    return entry;
  });
}

function parseStrengths(raw: unknown): string[] {
  if (!Array.isArray(raw)) throw new EvaluationFormatError('Strengths must be a list');
  const strengths = raw
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim());
  if (strengths.length < 2 || strengths.length > 3) {
    throw new EvaluationFormatError('Expected two or three strengths');
  }
  return strengths;
}

export function parseAnswerReview(raw: unknown, model: string, evaluatedAt: string): AnswerReview {
  if (!isObject(raw)) throw new EvaluationFormatError('Evaluation is not an object');
  const criteria = parseCriteria(raw.criteria);
  const overallScore = Math.round(criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length);
  return {
    assessment: requireText(raw, 'assessment'),
    criteria,
    overallScore,
    strengths: parseStrengths(raw.strengths),
    mainWeakness: requireText(raw, 'mainWeakness'),
    whyItMatters: requireText(raw, 'whyItMatters'),
    improvementSuggestion: requireText(raw, 'improvementSuggestion'),
    strongerStructure: requireText(raw, 'strongerStructure'),
    nextRecommendation: requireText(raw, 'nextRecommendation'),
    rubricVersion: RUBRIC_VERSION,
    model,
    evaluatedAt,
  };
}

export function isAnswerReview(value: unknown): value is AnswerReview {
  try {
    parseAnswerReview(
      isObject(value) ? value : null,
      isObject(value) && typeof value.model === 'string' ? value.model : '',
      isObject(value) && typeof value.evaluatedAt === 'string' ? value.evaluatedAt : ''
    );
    return true;
  } catch {
    return false;
  }
}
