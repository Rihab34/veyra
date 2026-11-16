import {
  Plus,
  Target,
  TrendingUp,
  Clock,
  MessageSquare,
  Repeat,
  ChevronRight,
  Sparkles,
  Award,
  BarChart3,
  RotateCcw,
} from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { DemoBanner } from '@/components/DemoBanner';
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

export function DashboardPage() {
  const { profile, sessions, navigate } = useApp();
  const completed = sessions.filter((s) => s.status === 'completed');

  const allWeaknesses: Record<string, number> = {};
  completed.forEach((s) => {
    if (s.summary) {
      s.summary.recurringWeaknesses.forEach((w) => {
        allWeaknesses[w] = (allWeaknesses[w] ?? 0) + 1;
      });
    }
  });
  const topWeaknesses = Object.entries(allWeaknesses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const totalAttempts = sessions.reduce(
    (sum, s) => sum + Object.values(s.attempts).flat().length,
    0
  );
  const totalRetries = sessions.reduce(
    (sum, s) => sum + Object.values(s.attempts).filter((a) => a.length > 1).length,
    0
  );

  const firstName = profile?.name?.split(' ')[0];

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">Dashboard</p>
            <h1 className="mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.05em] text-charcoal-900 sm:text-5xl">
              {firstName ? (
                <>
                  Welcome back, <em className="font-serif font-normal text-[#b85d38]">{firstName}.</em>
                </>
              ) : (
                'Welcome back.'
              )}
            </h1>
            {profile?.goal && (
              <p className="mt-3 flex items-center gap-2 text-sm text-charcoal-700">
                <Target size={15} className="text-veyra-600" />
                Preparing for <span className="font-medium text-charcoal-900">{profile.goal}</span>
              </p>
            )}
          </div>
          <button onClick={() => navigate('/setup')} className="btn-primary shrink-0">
            <Plus size={18} /> Start an interview
          </button>
        </header>

        <div className="mt-8">
          <DemoBanner />
        </div>

        {completed.length > 0 && (
          <section className="card mt-8 grid grid-cols-2 divide-x divide-y divide-charcoal-900/[0.08] overflow-hidden sm:grid-cols-4 sm:divide-y-0">
            <Stat icon={<Award size={16} />} label="Sessions" value={completed.length} />
            <Stat icon={<MessageSquare size={16} />} label="Answers" value={totalAttempts} />
            <Stat icon={<Repeat size={16} />} label="Retries" value={totalRetries} />
            <Stat icon={<TrendingUp size={16} />} label="Avg score" value={`${getAvgScore(sessions).toFixed(1)}/5`} />
          </section>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-charcoal-900">Recent sessions</h2>
              {completed.length > 0 && (
                <button onClick={() => navigate('/progress')} className="btn-ghost">
                  View all <ChevronRight size={14} />
                </button>
              )}
            </div>

            {completed.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={26} />}
                title="No sessions yet"
                description="Your practice sessions will appear here. Start your first interview to see your progress."
                action={
                  <button onClick={() => navigate('/setup')} className="btn-primary">
                    <Plus size={16} /> Start your first interview
                  </button>
                }
              />
            ) : (
              <div className="card divide-y divide-charcoal-900/[0.08] overflow-hidden p-0">
                {completed.slice(0, 5).map((s) => (
                  <SessionRow key={s.id} session={s} onClick={() => navigate(`/session/${s.id}`)} />
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="text-base font-semibold text-charcoal-900">Skills you're building</h2>
              {topWeaknesses.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {topWeaknesses.map(([skill, count]) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-charcoal-800">{skill}</span>
                        <span className="text-xs text-charcoal-700">{count}x flagged</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-200">
                        <div
                          className="h-full rounded-full bg-veyra-500 transition-all duration-700"
                          style={{ width: `${Math.min(count * 25, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => navigate('/setup')} className="btn-secondary mt-2 w-full">
                    <RotateCcw size={15} /> Practice a weak area
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-charcoal-700">
                  Complete a session to see which skills you are working on.
                </p>
              )}
            </div>

            {profile?.concerns && profile.concerns.length > 0 && (
              <div className="card p-6">
                <h3 className="text-base font-semibold text-charcoal-900">Your focus areas</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.concerns.map((c) => (
                    <Badge key={c} variant="veyra" size="md">{c}</Badge>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/progress')}
              className="card flex w-full items-center justify-between p-5 text-left text-sm font-medium text-charcoal-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cardHover"
            >
              <span className="flex items-center gap-3">
                <BarChart3 size={18} className="text-veyra-600" /> View full progress
              </span>
              <ChevronRight size={16} className="text-charcoal-700" />
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:p-6">
      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-charcoal-700">
        <span className="text-veyra-600">{icon}</span>
        {label}
      </span>
      <p className="text-3xl font-medium tracking-[-0.04em] text-charcoal-900">{value}</p>
    </div>
  );
}

function SessionRow({ session, onClick }: { session: InterviewSession; onClick: () => void }) {
  const date = new Date(session.startedAt);
  const answered = Object.keys(session.attempts).filter(
    (qid) => session.attempts[qid].length > 0
  ).length;
  const retries = Object.values(session.attempts).filter((a) => a.length > 1).length;
  const scored = Object.values(session.attempts).flat().filter((a) => a.evaluation);
  const avgScore = scored.length
    ? scored.reduce((s, a) => s + a.evaluation!.overallScore, 0) / scored.length
    : 0;

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 p-5 text-left transition-colors duration-200 hover:bg-warm-50/70 sm:p-6"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="veyra">{CATEGORY_LABELS[session.config.category]}</Badge>
          {session.config.difficulty && <Badge>{session.config.difficulty}</Badge>}
        </div>
        <p className="mt-2.5 truncate text-base font-semibold text-charcoal-900">
          {session.config.target || CATEGORY_LABELS[session.config.category]}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-700">
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {date.toLocaleDateString()}
          </span>
          <span>{answered} questions</span>
          {retries > 0 && <span>{retries} retries</span>}
        </div>
      </div>
      {avgScore > 0 && (
        <span className="shrink-0 rounded-2xl bg-warm-100 px-3 py-2 text-center">
          <span className="block text-lg font-semibold leading-none text-charcoal-900">{avgScore.toFixed(1)}</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-charcoal-700">of 5</span>
        </span>
      )}
      <ChevronRight size={18} className="shrink-0 text-charcoal-700/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-charcoal-900" />
    </button>
  );
}

function getAvgScore(sessions: InterviewSession[]): number {
  const all = sessions
    .flatMap((s) => Object.values(s.attempts).flat())
    .filter((a) => a.evaluation);
  if (all.length === 0) return 0;
  return all.reduce((s, a) => s + a.evaluation!.overallScore, 0) / all.length;
}
