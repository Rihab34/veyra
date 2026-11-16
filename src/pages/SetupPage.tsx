import { useState } from 'react';
import { ArrowRight, Award, Briefcase, ChevronDown, Compass, GraduationCap, Heart, Trophy } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { DemoBanner } from '@/components/DemoBanner';
import { LinkContent, SourcePicker } from '@/components/setup/SourcePicker';
import { useApp } from '@/context/AppContext';
import { generateInterviewQuestion } from '@/lib/aiService';
import type { Institution, InstitutionCategory } from '@/lib/institutions';
import { fetchPageContent } from '@/lib/pageFetcher';
import { uid } from '@/lib/storage';
import type {
  Difficulty,
  InterviewCategory,
  InterviewConfig,
  InterviewSession,
  Language,
  SessionLength,
} from '@/types';

const CATEGORIES: { value: InterviewCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'university', label: 'University', icon: <GraduationCap size={18} /> },
  { value: 'scholarship', label: 'Scholarship', icon: <Award size={18} /> },
  { value: 'job', label: 'Job', icon: <Briefcase size={18} /> },
  { value: 'internship', label: 'Internship', icon: <Briefcase size={18} /> },
  { value: 'competition', label: 'Competition', icon: <Trophy size={18} /> },
  { value: 'personal_intro', label: 'Personal intro', icon: <Heart size={18} /> },
  { value: 'custom', label: 'Custom', icon: <Compass size={18} /> },
];

const LENGTHS: { value: SessionLength; label: string; desc: string }[] = [
  { value: 10, label: '10 min', desc: 'Quick practice' },
  { value: 20, label: '20 min', desc: 'Standard' },
  { value: 25, label: '25 min', desc: 'Deep dive' },
];

const INSTITUTION_TABS: InstitutionCategory[] = [
  'university',
  'scholarship',
  'job',
  'internship',
  'competition',
  'personal_intro',
];

export function SetupPage() {
  const { profile, navigate, upsertSession } = useApp();

  const [category, setCategory] = useState<InterviewCategory>('university');
  const [target, setTarget] = useState(profile?.target || '');
  const [sessionLength, setSessionLength] = useState<SessionLength>(10);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [starting, setStarting] = useState(false);

  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [customLink, setCustomLink] = useState('');
  const [linkFetching, setLinkFetching] = useState(false);
  const [linkContent, setLinkContent] = useState<LinkContent | null>(null);
  const [linkError, setLinkError] = useState('');

  const language: Language = 'en';
  const difficulty: Difficulty =
    profile?.experienceLevel === 'advanced'
      ? 'advanced'
      : profile?.experienceLevel === 'beginner'
        ? 'beginner'
        : 'intermediate';

  const sourceUrl = selectedInstitution?.url || (linkContent ? customLink : '');
  const pageContext = linkContent
    ? `${linkContent.title || customLink.trim()}. ${linkContent.context}`
    : selectedInstitution
      ? `${selectedInstitution.name}. ${selectedInstitution.description} Focus areas: ${selectedInstitution.tags.join(', ')}.`
      : '';
  const sourceName = selectedInstitution?.name || linkContent?.title || '';
  const defaultTab: InstitutionCategory = (INSTITUTION_TABS as InterviewCategory[]).includes(category)
    ? (category as InstitutionCategory)
    : 'university';
  const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? '';

  const handleSelectInstitution = (inst: Institution) => {
    if (selectedInstitution?.id === inst.id) {
      setSelectedInstitution(null);
      return;
    }
    setSelectedInstitution(inst);
    setLinkContent(null);
    setCustomLink('');
    setLinkError('');
    if (!target) setTarget(inst.name);
  };

  const handleFetchLink = async () => {
    if (!customLink.trim()) return;
    setLinkFetching(true);
    setLinkError('');
    setLinkContent(null);
    setSelectedInstitution(null);

    try {
      const content = await fetchPageContent(customLink.trim());
      setLinkContent({ title: content.title, context: content.relevantContext || content.text });
      if (!target) setTarget(content.title);
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Could not read this page. Try another link.');
    } finally {
      setLinkFetching(false);
    }
  };

  const handleClearSource = () => {
    setSelectedInstitution(null);
    setLinkContent(null);
    setCustomLink('');
    setLinkError('');
  };

  const startInterview = async () => {
    setStarting(true);
    const config: InterviewConfig = {
      category,
      target: target.trim(),
      language,
      difficulty,
      sessionLength,
      practiceMode: 'general',
      background: '',
      sourceUrl: sourceUrl || undefined,
      pageContext: pageContext || undefined,
    };

    const sessionId = uid('session');
    const session: InterviewSession = {
      id: sessionId,
      config,
      status: 'active',
      questions: [],
      attempts: {},
      comparisons: {},
      summary: null,
      startedAt: new Date().toISOString(),
      endedAt: null,
      userId: profile?.id || 'anonymous',
    };

    try {
      const firstQ = await generateInterviewQuestion({
        config,
        profile,
        questionIndex: 0,
        previousQuestions: [],
        previousAnswers: [],
        usedFollowUps: [],
        pageContext: config.pageContext,
      });
      session.questions.push({
        id: firstQ.questionId,
        text: firstQ.questionText,
        type: 'opening',
        attemptCount: 0,
        isFollowUp: firstQ.isFollowUp,
      });
    } catch {
      session.questions.push({
        id: 'fallback_0',
        text: 'Tell us about yourself and why you are preparing for this opportunity.',
        type: 'opening',
        attemptCount: 0,
        isFollowUp: false,
      });
    }

    upsertSession(session);
    navigate(`/interview/${sessionId}`);
  };

  return (
    <div className="min-h-screen">
      <AppHeader showBack backPath="/dashboard" />

      <main className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-6">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">New session</p>
          <h1 className="mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.05em] text-[#0e1217]">
            Set up your interview
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5e6670]">Three quick choices. That is all it takes.</p>
        </header>

        <div className="mb-6">
          <DemoBanner />
        </div>

        <div className="space-y-4">
          <Step number="1" title="What is it for?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.map((c) => {
                const selected = category === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    aria-pressed={selected}
                    className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left text-sm font-medium text-[#0e1217] transition-all ${
                      selected
                        ? 'border-[#ff6a2b] bg-[#fff3ec] shadow-[0_0_0_3px_rgba(255,106,43,0.12)]'
                        : 'border-[#0e1217]/10 bg-white hover:-translate-y-0.5 hover:border-[#0e1217]/25'
                    }`}
                  >
                    <span className="text-[#c4501c]">{c.icon}</span>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </Step>

          <Step number="2" title="Who is it with?" optional>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. MIT, Google, Rhodes Scholarship"
              aria-label="Target name"
              className="h-12 w-full rounded-xl border border-[#0e1217]/12 bg-white px-4 text-sm text-[#0e1217] placeholder:text-[#5e6670]/70 focus:border-[#ff6a2b] focus:outline-none focus:ring-2 focus:ring-[#ff6a2b]/20"
            />

            <button
              onClick={() => setSourceOpen((open) => !open)}
              aria-expanded={sourceOpen}
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-dashed border-[#0e1217]/20 px-4 py-3 text-left text-sm font-medium text-[#0e1217] transition-colors hover:border-[#ff6a2b] hover:bg-[#fff3ec]/60"
            >
              <span className="truncate">
                {sourceName ? `Source: ${sourceName}` : 'Pick a school or scholarship, or paste a link'}
              </span>
              <ChevronDown size={18} className={`shrink-0 transition-transform ${sourceOpen ? 'rotate-180' : ''}`} />
            </button>

            {sourceOpen && (
              <SourcePicker
                key={category}
                initialTab={defaultTab}
                selected={selectedInstitution}
                linkContent={linkContent}
                customLink={customLink}
                linkFetching={linkFetching}
                linkError={linkError}
                onSelectInstitution={handleSelectInstitution}
                onCustomLinkChange={(value) => {
                  setCustomLink(value);
                  setLinkError('');
                }}
                onFetchLink={handleFetchLink}
                onClear={handleClearSource}
              />
            )}
          </Step>

          <Step number="3" title="How long?">
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((l) => {
                const selected = sessionLength === l.value;
                return (
                  <button
                    key={l.value}
                    onClick={() => setSessionLength(l.value)}
                    aria-pressed={selected}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all ${
                      selected
                        ? 'border-[#ff6a2b] bg-[#fff3ec] shadow-[0_0_0_3px_rgba(255,106,43,0.12)]'
                        : 'border-[#0e1217]/10 bg-white hover:-translate-y-0.5 hover:border-[#0e1217]/25'
                    }`}
                  >
                    <span className="text-lg font-semibold text-[#0e1217]">{l.label}</span>
                    <span className="text-xs text-[#5e6670]">{l.desc}</span>
                  </button>
                );
              })}
            </div>
          </Step>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#5e6670]">
            {categoryLabel} practice · {sessionLength} minutes
          </p>
          <button
            onClick={startInterview}
            disabled={starting}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff6a2b] px-7 text-sm font-semibold text-[#0e1217] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          >
            {starting ? 'Starting' : 'Start interview'} <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}

function Step({
  number,
  title,
  optional,
  children,
}: {
  number: string;
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#0e1217]/10 bg-white/85 p-6 shadow-[0_18px_40px_rgba(14,18,23,0.06)] backdrop-blur-sm sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e1217] text-xs font-semibold text-white">
          {number}
        </span>
        <h2 className="text-base font-semibold text-[#0e1217]">{title}</h2>
        {optional && <span className="text-xs text-[#5e6670]">Optional</span>}
      </div>
      {children}
    </section>
  );
}
