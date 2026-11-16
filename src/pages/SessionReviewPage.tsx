import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Target,
  Lightbulb,
  TrendingUp,
  Repeat,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Badge } from '@/components/Badge';
import { ScoreRing, DimensionBar } from '@/components/Feedback';
import { useApp } from '@/context/AppContext';
import type { InterviewSession, InterviewCategory, Attempt, Comparison } from '@/types';

const CATEGORY_LABELS: Record<InterviewCategory, string> = {
  university: 'University',
  scholarship: 'Scholarship',
  job: 'Job',
  internship: 'Internship',
  competition: 'Competition',
  personal_intro: 'Personal Intro',
  custom: 'Custom',
};

export function SessionReviewPage({ sessionId }: { sessionId: string }) {
  const { sessions, navigate } = useApp();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="min-h-screen">
        <AppHeader showBack backPath="/dashboard" />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <AlertCircle size={32} className="mx-auto text-veyra-500" />
          <p className="mt-4 text-charcoal-700">Session not found. It may have been removed.</p>
          <button onClick={() => navigate('/progress')} className="btn-primary mt-4">
            Back to Progress
          </button>
        </div>
      </div>
    );
  }

  const lang = session.config.language;
  const answered = Object.keys(session.attempts).filter(
    (qid) => session.attempts[qid].length > 0
  );

  return (
    <div className="min-h-screen">
      <AppHeader showBack backPath="/progress" />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="veyra">{CATEGORY_LABELS[session.config.category]}</Badge>
            {session.config.target && <Badge>{session.config.target}</Badge>}
            <Badge>{session.config.difficulty}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900">Session Review</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal-700">
            <Clock size={14} /> {new Date(session.startedAt).toLocaleDateString()}
            <span className="mx-1">·</span>
            {answered.length} questions answered
          </p>
        </div>

        {/* Summary link */}
        {session.summary && (
          <button
            onClick={() => navigate(`/summary/${session.id}`)}
            className="btn-secondary mb-6 w-full"
          >
            <TrendingUp size={16} /> View Session Summary
          </button>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {session.questions.map((q, idx) => {
            const attempts = session.attempts[q.id] ?? [];
            const comparison = session.comparisons[q.id];
            return (
              <QuestionReview
                key={q.id}
                questionNumber={idx + 1}
                questionText={q.text}
                isFollowUp={q.isFollowUp}
                attempts={attempts}
                comparison={comparison}
                lang={lang}
              />
            );
          })}
        </div>

        {answered.length === 0 && (
          <div className="rounded-xl border border-dashed border-warm-300 bg-white/60 p-8 text-center">
            <MessageSquare size={28} className="mx-auto text-charcoal-700/40" />
            <p className="mt-3 text-sm text-charcoal-700">
              No questions were answered in this session.
            </p>
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate('/setup')} className="btn-primary flex-1">
            Start Another Interview
          </button>
          <button onClick={() => navigate('/progress')} className="btn-secondary flex-1">
            Back to Progress
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionReview({
  questionNumber,
  questionText,
  isFollowUp,
  attempts,
  comparison,
  lang,
}: {
  questionNumber: number;
  questionText: string;
  isFollowUp: boolean;
  attempts: Attempt[];
  comparison?: Comparison;
  lang: string;
}) {
  const [expanded, setExpanded] = useState(questionNumber === 1);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-5 text-left"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-veyra-100 text-xs font-bold text-veyra-600">
          {questionNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isFollowUp && (
              <Badge variant="info">
                <MessageSquare size={10} /> Follow-up
              </Badge>
            )}
            {attempts.length === 0 && <Badge variant="warning">Skipped</Badge>}
            {attempts.length > 1 && (
              <Badge variant="success">
                <Repeat size={10} /> {attempts.length} attempts
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm font-medium text-charcoal-900 line-clamp-2">
            {questionText}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="mt-1 shrink-0 text-charcoal-700/50" />
        ) : (
          <ChevronDown size={18} className="mt-1 shrink-0 text-charcoal-700/50" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-warm-200 p-5">
          {attempts.length === 0 ? (
            <p className="text-sm text-charcoal-700">This question was skipped.</p>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt, i) => (
                <AttemptReview
                  key={attempt.id}
                  attempt={attempt}
                  lang={lang}
                  isLast={i === attempts.length - 1}
                />
              ))}

              {/* Comparison */}
              {comparison && attempts.length >= 2 && (
                <div className="rounded-xl border border-veyra-200 bg-veyra-50/30 p-4">
                  <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-charcoal-900">
                    <TrendingUp size={15} className="text-veyra-500" />
                    Attempt Comparison
                  </h4>
                  {comparison.scoreDelta > 0 && (
                    <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                      +{comparison.scoreDelta.toFixed(1)} improvement
                    </span>
                  )}
                  {comparison.improvements.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-green-700">What improved:</p>
                      <ul className="mt-1 space-y-0.5">
                        {comparison.improvements.map((imp, i2) => (
                          <li key={i2} className="flex items-start gap-1.5 text-xs text-charcoal-800">
                            <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-green-500" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Remaining weakness:</p>
                    <p className="text-xs text-charcoal-800">{comparison.remainingWeakness}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AttemptReview({
  attempt,
  lang,
  isLast,
}: {
  attempt: Attempt;
  lang: string;
  isLast: boolean;
}) {
  const eval_ = attempt.evaluation;
  if (!eval_) {
    return (
      <div className="rounded-xl border border-warm-200 p-4">
        <p className="mb-1 text-xs font-semibold text-charcoal-700">
          Attempt {attempt.attemptNumber}
        </p>
        <p className="text-sm text-charcoal-800" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {attempt.answerText}
        </p>
        <p className="mt-2 text-xs text-charcoal-700/60">No evaluation available.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${isLast ? 'border-veyra-200' : 'border-warm-200'}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-charcoal-700">
          Attempt {attempt.attemptNumber}
          {attempt.voiceUsed && (
            <span className="ml-2 text-charcoal-700/60">voice input</span>
          )}
        </span>
        <ScoreRing score={eval_.overallScore} size={40} />
      </div>
      <p className="mb-3 rounded-lg bg-warm-50 p-3 text-sm text-charcoal-800" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {attempt.answerText}
      </p>

      <div className="space-y-2">
        {eval_.whatWorked && (
          <div className="flex gap-2 text-sm">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-500" />
            <div>
              <span className="text-xs font-semibold text-charcoal-700">What worked: </span>
              <span className="text-charcoal-800">{eval_.whatWorked}</span>
            </div>
          </div>
        )}
        {eval_.whatCouldImprove && (
          <div className="flex gap-2 text-sm">
            <Target size={14} className="mt-0.5 shrink-0 text-veyra-500" />
            <div>
              <span className="text-xs font-semibold text-charcoal-700">Improve: </span>
              <span className="text-charcoal-800">{eval_.whatCouldImprove}</span>
            </div>
          </div>
        )}
        {eval_.actionableSuggestion && (
          <div className="flex gap-2 text-sm">
            <Lightbulb size={14} className="mt-0.5 shrink-0 text-blue-500" />
            <div>
              <span className="text-xs font-semibold text-charcoal-700">Suggestion: </span>
              <span className="text-charcoal-800">{eval_.actionableSuggestion}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {eval_.dimensions.map((d) => (
          <DimensionBar key={d.dimension} label={d.dimension} score={d.score} note={d.note} />
        ))}
      </div>
    </div>
  );
}
