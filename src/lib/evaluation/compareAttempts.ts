import type { Attempt, AttemptComparison, CriterionComparison } from '@/types';
import { CRITERIA, SIGNIFICANT_DELTA, WEAK_THRESHOLD, criterionLabel } from './rubric';

const labelFor = criterionLabel;

export function compareAttempts(previous: Attempt, latest: Attempt): AttemptComparison | null {
  const before = previous.evaluation;
  const after = latest.evaluation;
  if (!before || !after) return null;

  const criteria: CriterionComparison[] = after.criteria.map((current) => {
    const prior = before.criteria.find((c) => c.key === current.key);
    const previousScore = prior?.score ?? 0;
    const delta = current.score - previousScore;
    const status =
      delta >= SIGNIFICANT_DELTA
        ? 'improved'
        : delta <= -SIGNIFICANT_DELTA
          ? 'needs_attention'
          : 'unchanged';
    return { key: current.key, previous: previousScore, latest: current.score, delta, status };
  });

  return {
    previousAttemptNumber: previous.attemptNumber,
    latestAttemptNumber: latest.attemptNumber,
    criteria,
    overallDelta: after.overallScore - before.overallScore,
    improvements: criteria
      .filter((c) => c.status === 'improved')
      .map((c) => `${labelFor(c.key)} rose from ${c.previous} to ${c.latest}.`),
    remainingWeaknesses: criteria
      .filter((c) => c.latest < WEAK_THRESHOLD)
      .map((c) => `${labelFor(c.key)} is still at ${c.latest}.`),
    recommendation: after.nextRecommendation,
  };
}

export function recurringWeaknesses(attempts: Attempt[]): { key: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const attempt of attempts) {
    for (const c of attempt.evaluation?.criteria ?? []) {
      if (c.score < WEAK_THRESHOLD) counts.set(c.key, (counts.get(c.key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: labelFor(key), count }));
}
