export const RUBRIC_VERSION = 'v1';

export const CRITERIA = [
  {
    key: 'relevance',
    label: 'Relevance',
    question: 'Does the answer address the question that was asked?',
  },
  {
    key: 'clarity',
    label: 'Clarity',
    question: 'Is the message easy to understand on first hearing?',
  },
  {
    key: 'structure',
    label: 'Structure',
    question: 'Is the answer logically organized from start to finish?',
  },
  {
    key: 'specificity',
    label: 'Specificity',
    question: 'Does the answer include concrete examples, details, or evidence?',
  },
  {
    key: 'reasoning',
    label: 'Reasoning',
    question: 'Does the answer explain the thinking behind the points made?',
  },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]['key'];

export const CRITERION_KEYS: readonly CriterionKey[] = CRITERIA.map((c) => c.key);

export const WEAK_THRESHOLD = 60;
export const STRONG_THRESHOLD = 80;
export const SIGNIFICANT_DELTA = 5;

export function criterionLabel(key: string): string {
  return CRITERIA.find((c) => c.key === key)?.label ?? key;
}
