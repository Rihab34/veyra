import {
  BarChart3,
  Clock,
  MessageSquare,
  Repeat,
  TrendingUp,
  Target,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/Feedback';
import { useApp } from '@/context/AppContext';
import type { InterviewSession, InterviewCategory } from '@/types';

const CATEGORY_LABELS: Record<InterviewCategory, string> = {
  university: 'University',
  scholarship: 'Scholarship',
  job: 'Job',
  internship: 'Internship',
  competition: 'Competition',
  personal_intro: 'Personal Intro',
  custom: 'Custom',
};

export function ProgressPage() {
  const { sessions, navigate, profile } = useApp();
  const completed = sessions.filter((s) => s.status === 'completed');

  // Aggregate weakness data
  const weaknessCounts: Record<string, number> = {};
  completed.forEach((s) => {
    if (s.summary) {
      s.summary.recurringWeaknesses.forEach((w) => {
        weaknessCounts[w] = (weaknessCounts[w] ?? 0) + 1;
      });
    }
  });
  const sortedWeaknesses = Object.entries(weaknessCounts).sort((a, b) => b[1] - a[1]);

  // Aggregate strength data
  const strengthCounts: Record<string, number> = {};
  completed.forEach((s) => {
    if (s.summary) {
      s.summary.strongestAspects.forEach((st) => {
        strengthCounts[st] = (strengthCounts[st] ?? 0) + 1;
      });
    }
  });
  const sortedStrengths = Object.entries(strengthCounts).sort((a, b) => b[1] - a[1]);

  // Retry improvement data
  const allComparisons = completed.flatMap((s) => Object.values(s.comparisons));
  const positiveDeltas = allComparisons.filter((c) => c.scoreDelta > 0);
  const avgDelta =
    allComparisons.length > 0
      ? allComparisons.reduce((s, c) => s + c.scoreDelta, 0) / allComparisons.length
      : 0;

  const totalAnswers = completed.reduce(
    (sum, s) => sum + Object.values(s.attempts).flat().length,
    0
  );
  const totalRetries = completed.reduce(
    (sum, s) => sum + Object.values(s.attempts).filter((a) => a.length > 1).length,
    0
  );

  // Recommended next practice
  const topWeakness = sortedWeaknesses[0]?.[0];
  const recentSession = completed[0];

  return (
    <div className="min-h-screen">
      <AppHeader showBack backPath="/dashboard" />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">Your Progress</h1>
          <p className="mt-1 text-sm text-charcoal-700">
            Track your practice history and identify areas to focus on.
          </p>
        </div>

        {completed.length === 0 ? (
          <EmptyState
            icon={<BarChart3 size={26} />}
            title="No progress data yet"
            description="Complete a practice interview to start tracking your improvement over time. More sessions will reveal patterns in your strengths and weaknesses."
            action={
              <button onClick={() => navigate('/setup')} className="btn-primary">
                <Plus size={16} /> Start your first interview
              </button>
            }
          />
        ) : (
          <div className="space-y-6">
            {/* Overview stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                icon={<MessageSquare size={18} />}
                label="Sessions"
                value={completed.length}
              />
              <StatCard icon={<Clock size={18} />} label="Total Answers" value={totalAnswers} />
              <StatCard icon={<Repeat size={18} />} label="Retries" value={totalRetries} />
              <StatCard
                icon={<TrendingUp size={18} />}
                label="Avg Improvement"
                value={avgDelta > 0 ? `+${avgDelta.toFixed(1)}` : '—'}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Weaknesses */}
              <div className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-charcoal-900">
                  <Target size={18} className="text-amber-500" />
                  Frequently Identified Weaknesses
                </h2>
                {sortedWeaknesses.length > 0 ? (
                  <div className="space-y-3">
                    {sortedWeaknesses.map(([skill, count]) => (
                      <div key={skill}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-charcoal-800">{skill}</span>
                          <Badge variant="warning">
                            {count} session{count > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-warm-200">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all duration-500"
                            style={{ width: `${Math.min((count / completed.length) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {topWeakness && (
                      <button
                        onClick={() => navigate('/setup')}
                        className="btn-secondary mt-3 w-full text-sm"
                      >
                        <Target size={15} /> Practice: {topWeakness}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-charcoal-700">
                    No recurring weaknesses detected yet. Keep practicing!
                  </p>
                )}
              </div>

              {/* Strengths */}
              <div className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-charcoal-900">
                  <TrendingUp size={18} className="text-green-500" />
                  Your Growing Strengths
                </h2>
                {sortedStrengths.length > 0 ? (
                  <div className="space-y-3">
                    {sortedStrengths.map(([skill, count]) => (
                      <div key={skill}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-charcoal-800">{skill}</span>
                          <Badge variant="success">
                            {count} session{count > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-warm-200">
                          <div
                            className="h-full rounded-full bg-green-500 transition-all duration-500"
                            style={{ width: `${Math.min((count / completed.length) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-charcoal-700">
                    Strengths will appear as you practice more and score higher.
                  </p>
                )}
              </div>
            </div>

            {/* Retry improvement summary */}
            {allComparisons.length > 0 && (
              <div className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-charcoal-900">
                  <Repeat size={18} className="text-veyra-500" />
                  Retry Improvement History
                </h2>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-xl bg-green-50 px-4 py-3">
                    <p className="text-2xl font-bold text-green-700">{positiveDeltas.length}</p>
                    <p className="text-xs text-green-700">questions improved through retry</p>
                  </div>
                  <div className="rounded-xl bg-warm-50 px-4 py-3">
                    <p className="text-2xl font-bold text-charcoal-900">
                      {avgDelta > 0 ? `+${avgDelta.toFixed(1)}` : avgDelta.toFixed(1)}
                    </p>
                    <p className="text-xs text-charcoal-700">average score change per retry</p>
                  </div>
                  <div className="rounded-xl bg-warm-50 px-4 py-3">
                    <p className="text-2xl font-bold text-charcoal-900">{allComparisons.length}</p>
                    <p className="text-xs text-charcoal-700">total retry comparisons</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended next */}
            {topWeakness && (
              <div className="card border-veyra-200 bg-veyra-50/40 p-6">
                <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-charcoal-900">
                  <Sparkles size={18} className="text-veyra-500" />
                  Recommended Next Practice
                </h2>
                <p className="text-sm text-charcoal-700">
                  Your most frequent weakness is <strong>{topWeakness}</strong>. Consider a focused
                  practice session targeting this area.
                </p>
                <button
                  onClick={() => navigate('/setup')}
                  className="btn-primary mt-4"
                >
                  <Target size={16} /> Start a focused session
                </button>
              </div>
            )}

            {/* All sessions */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-charcoal-900">All Sessions</h2>
              <div className="space-y-3">
                {completed.map((s) => (
                  <SessionListItem
                    key={s.id}
                    session={s}
                    onClick={() => navigate(`/session/${s.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-veyra-50 text-veyra-500">
        {icon}
      </div>
      <p className="text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-charcoal-700">{label}</p>
    </div>
  );
}

function SessionListItem({
  session,
  onClick,
}: {
  session: InterviewSession;
  onClick: () => void;
}) {
  const date = new Date(session.startedAt);
  const answered = Object.keys(session.attempts).filter(
    (qid) => session.attempts[qid].length > 0
  ).length;
  const retries = Object.values(session.attempts).filter((a) => a.length > 1).length;
  const evaluated = Object.values(session.attempts)
    .flat()
    .filter((a) => a.evaluation);
  const avgScore =
    evaluated.length > 0
      ? evaluated.reduce((s, a) => s + a.evaluation!.overallScore, 0) / evaluated.length
      : 0;

  return (
    <button
      onClick={onClick}
      className="card flex w-full items-center justify-between p-4 text-left transition-all hover:shadow-cardHover"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="veyra">{CATEGORY_LABELS[session.config.category]}</Badge>
          {retries > 0 && <Badge variant="info">{retries} retries</Badge>}
        </div>
        <p className="mt-2 truncate text-sm font-medium text-charcoal-900">
          {session.config.target || CATEGORY_LABELS[session.config.category]}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-charcoal-700">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {date.toLocaleDateString()}
          </span>
          <span>{answered} questions</span>
        </div>
      </div>
      <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
        {avgScore > 0 && (
          <span className="text-sm font-bold text-charcoal-900">{avgScore.toFixed(1)}/5</span>
        )}
        <ChevronRight size={18} className="text-charcoal-700/50" />
      </div>
    </button>
  );
}
