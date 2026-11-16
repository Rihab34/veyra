import {
  CheckCircle2,
  AlertTriangle,
  Target,
  Repeat,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Home,
  Plus,
  AlertCircle,
  Loader2,
  Download,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/Feedback';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { downloadScoreCard } from '@/lib/scoreCard';
import { generateSessionSummaryService } from '@/lib/aiService';
import type { InterviewSession, InterviewCategory, SessionSummary } from '@/types';

const CATEGORY_LABELS: Record<InterviewCategory, string> = {
  university: 'University',
  scholarship: 'Scholarship',
  job: 'Job',
  internship: 'Internship',
  competition: 'Competition',
  personal_intro: 'Personal Intro',
  custom: 'Custom',
};

export function SummaryPage({ sessionId }: { sessionId: string }) {
  const { sessions, navigate, upsertSession } = useApp();
  const session = sessions.find((s) => s.id === sessionId);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(false);

  const lang = session?.config.language || 'en';

  useEffect(() => {
    if (session && session.status === 'completed' && !session.summary && !generating && !genError) {
      setGenerating(true);
      generateSessionSummaryService({ session, language: lang })
        .then((summary) => {
          upsertSession({ ...session, summary });
        })
        .catch(() => {
          setGenError(true);
        })
        .finally(() => setGenerating(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  if (!session) {
    return (
      <div className="min-h-screen">
        <AppHeader showBack backPath="/dashboard" />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <AlertCircle size={32} className="mx-auto text-veyra-500" />
          <p className="mt-4 text-charcoal-700">Session not found.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const summary = session.summary;

  if (generating && !summary) {
    return (
      <div className="min-h-screen">
        <AppHeader showBack backPath="/dashboard" />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-warm-200" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-veyra-500" />
          </div>
          <p className="mt-5 text-sm font-medium text-charcoal-900">Generating your session summary</p>
        </div>
      </div>
    );
  }

  const allAttempts = Object.values(session.attempts).flat();
  const evaluated = allAttempts.filter((a) => a.evaluation);
  const avgScore =
    evaluated.length > 0
      ? evaluated.reduce((s, a) => s + a.evaluation!.overallScore, 0) / evaluated.length
      : 0;

  const answeredCount = Object.keys(session.attempts).filter(
    (qid) => session.attempts[qid].length > 0
  ).length;
  const retryCount = Object.values(session.attempts).filter((a) => a.length > 1).length;

  return (
    <div className="min-h-screen">
      <AppHeader showBack backPath="/dashboard" />

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
        {/* Hero score section */}
        <div className="card overflow-hidden p-0">
          <div className="bg-[#0e1217] px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {CATEGORY_LABELS[session.config.category]}
              </span>
              {session.config.target && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {session.config.target}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a2b]">
                  Session complete
                </p>
                <h1 className="mt-2 text-3xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  {t(lang, 'summary.title')}
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  {new Date(session.startedAt).toLocaleDateString()} · {answeredCount} questions ·{' '}
                  {retryCount} retries
                </p>
              </div>

              {avgScore > 0 && (
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-medium text-[#ff6a2b] sm:text-6xl">
                    {avgScore.toFixed(1)}
                  </span>
                  <span className="text-sm text-white/40">/ 5</span>
                </div>
              )}
            </div>
          </div>

          {summary && (
            <div className="border-t border-white/10 bg-[#fbf6ee] px-6 py-4 sm:px-8">
              <button
                onClick={() =>
                  downloadScoreCard({
                    title: CATEGORY_LABELS[session.config.category],
                    subtitle:
                      session.config.target || new Date(session.startedAt).toLocaleDateString(),
                    score: avgScore,
                    answered: answeredCount,
                    retries: retryCount,
                    weaknesses: summary.recurringWeaknesses,
                  })
                }
                disabled={evaluated.length === 0}
                className="flex items-center gap-2 text-sm font-semibold text-charcoal-900 transition-colors hover:text-veyra-600 disabled:opacity-50"
              >
                <Download size={15} /> Download your score
              </button>
            </div>
          )}
        </div>

        {genError && !summary && (
          <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span className="flex-1">
              Could not generate a full summary. Your answers and feedback are still saved.
              <button
                onClick={() => {
                  setGenError(false);
                  setGenerating(false);
                }}
                className="ml-2 font-semibold underline"
              >
                Try again
              </button>
            </span>
          </div>
        )}

        {summary ? (
          <div className="mt-5 space-y-4">
            {/* Overall assessment */}
            <div className="card p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-charcoal-900">
                <Target size={17} className="text-veyra-500" />
                {t(lang, 'summary.overall')}
              </h2>
              <p className="text-sm leading-7 text-charcoal-800">{summary.overallAssessment}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <MessageSquare size={17} />
                </div>
                <p className="text-3xl font-medium tracking-[-0.04em] text-charcoal-900">
                  {summary.questionsAnswered}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-700">{t(lang, 'summary.answered')}</p>
              </div>
              <div className="card p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-500">
                  <Repeat size={17} />
                </div>
                <p className="text-3xl font-medium tracking-[-0.04em] text-charcoal-900">
                  {summary.improvementsAchieved}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-700">{t(lang, 'summary.improvements')}</p>
              </div>
            </div>

            {/* Strongest */}
            {summary.strongestAspects.length > 0 && (
              <div className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-charcoal-900">
                  <CheckCircle2 size={17} className="text-green-500" />
                  {t(lang, 'summary.strongest')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {summary.strongestAspects.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {summary.recurringWeaknesses.length > 0 && (
              <div className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-charcoal-900">
                  <AlertTriangle size={17} className="text-amber-500" />
                  {t(lang, 'summary.weaknesses')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {summary.recurringWeaknesses.map((w) => (
                    <span
                      key={w}
                      className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next steps */}
            <div className="card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-charcoal-900">
                <TrendingUp size={17} className="text-veyra-500" />
                {t(lang, 'summary.nextSteps')}
              </h2>
              <ul className="space-y-3">
                {summary.recommendedNext.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-charcoal-800">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0e1217] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="leading-6">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {summary.weakestArea && (
                <button onClick={() => navigate('/setup')} className="btn-secondary w-full">
                  <Target size={16} /> {t(lang, 'summary.practiceWeakest')}: {summary.weakestArea}
                </button>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate('/setup')} className="btn-primary flex-1">
                  <Plus size={16} /> {t(lang, 'summary.anotherInterview')}
                </button>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1">
                  <Home size={16} /> {t(lang, 'summary.dashboard')}
                </button>
              </div>
              <button
                onClick={() => navigate(`/session/${session.id}`)}
                className="flex w-full items-center justify-center gap-1.5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:text-veyra-600"
              >
                Review all questions and answers <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          !generating &&
          !genError && (
            <EmptyState
              icon={<MessageSquare size={26} />}
              title="No summary available"
              description="This session ended without a generated summary. You can still review the questions and answers."
              action={
                <button onClick={() => navigate(`/session/${session.id}`)} className="btn-primary">
                  Review session
                </button>
              }
            />
          )
        )}
      </div>
    </div>
  );
}
