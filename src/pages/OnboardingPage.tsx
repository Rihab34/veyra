import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Check,
  GraduationCap,
  Briefcase,
  Users,
  Compass,
  RefreshCw,
  Target,
  AlertCircle,
  Loader2,
  Camera,
  ImagePlus,
} from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { useApp } from '@/context/AppContext';
import { uid } from '@/lib/storage';
import { supabase } from '@/lib/supabaseClient';
import type {
  UserProfile,
  EducationStage,
  ExperienceLevel,
} from '@/types';

const STAGES: { value: EducationStage; label: string; icon: React.ReactNode }[] = [
  { value: 'high_school', label: 'High School Student', icon: <GraduationCap size={20} /> },
  { value: 'undergraduate', label: 'University Undergraduate', icon: <Users size={20} /> },
  { value: 'graduate', label: 'Graduate Student', icon: <GraduationCap size={20} /> },
  { value: 'early_career', label: 'Early Career Professional', icon: <Briefcase size={20} /> },
  { value: 'experienced', label: 'Experienced Professional', icon: <Briefcase size={20} /> },
  { value: 'career_change', label: 'Career Changer', icon: <RefreshCw size={20} /> },
  { value: 'other', label: 'Other', icon: <Compass size={20} /> },
];

const LEVELS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', desc: 'I have little or no interview experience' },
  { value: 'intermediate', label: 'Intermediate', desc: 'I have done a few interviews before' },
  { value: 'advanced', label: 'Advanced', desc: 'I am comfortable with interviews' },
];

const CONCERNS = [
  'Answering clearly',
  'Giving specific examples',
  'Structuring my answers',
  'Managing nervousness',
  'Speaking concisely',
  'Sounding persuasive',
  'Handling unexpected questions',
  'Explaining my motivation',
];

const TOTAL_STEPS = 5;

export function OnboardingPage() {
  const { setProfile, syncProfileToSupabase, session, navigate } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [stage, setStage] = useState<EducationStage | ''>('');
  const [goal, setGoal] = useState('');
  const [target, setTarget] = useState('');
  const [level, setLevel] = useState<ExperienceLevel | ''>('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [avatarPath, setAvatarPath] = useState<string | undefined>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 0:
        return true; // name is optional
      case 1:
        return stage !== '';
      case 2:
        return goal.trim().length > 0;
      case 3:
        return level !== '';
      case 4:
        return true; // concerns optional
      default:
        return true;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = async () => {
    if (submitting) return;
    setSubmitting(true);

    // Use the authenticated user's id when available so the profile row is
    // owned by their account. Fall back to a local id if somehow missing.
    const userId = session?.user?.id ?? uid('user');
    const profile: UserProfile = {
      id: userId,
      name: name.trim(),
      educationStage: (stage || 'other') as EducationStage,
      goal: goal.trim(),
      target: target.trim(),
      experienceLevel: (level || 'beginner') as ExperienceLevel,
      language: 'en',
      concerns,
      avatarPath,
      createdAt: new Date().toISOString(),
    };
    setProfile(profile);

    if (session?.user) {
      try {
        await syncProfileToSupabase(profile);
      } catch {
        // The local profile is still set; Supabase sync can retry later.
      }
    }
    setSubmitting(false);
    navigate('/dashboard');
  };

  const toggleConcern = (c: string) => {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <div className="relative min-h-screen">
      <AppHeader showBack backPath="/" />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-charcoal-700">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-charcoal-700/70">
              {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-warm-200">
            <div
              className="h-full rounded-full bg-veyra-500 transition-all duration-300"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        <div className="card p-7 sm:p-9">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">Onboarding</p>
          </div>
          {step === 0 && (
            <StepWrapper title="Welcome to Veyra" subtitle="Let's personalize your practice. What should we call you?">
              <div className="flex items-center gap-4 rounded-2xl border border-charcoal-900/[0.08] bg-white p-4">
                <label className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-veyra-50 text-veyra-500 ring-4 ring-veyra-100/50">
                  {avatarPreview ? <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" /> : <Camera size={22} />}
                  <span className="absolute inset-0 flex items-center justify-center bg-charcoal-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100"><ImagePlus size={18} /></span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file || !session?.user) return;
                      if (file.size > 5 * 1024 * 1024) { setAvatarError('Please choose an image smaller than 5 MB.'); return; }
                      setAvatarError(null);
                      setUploadingAvatar(true);
                      const path = `${session.user.id}/avatar`;
                      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
                      if (error) setAvatarError('Could not upload that image. Please try another one.');
                      else { setAvatarPath(path); setAvatarPreview(URL.createObjectURL(file)); }
                      setUploadingAvatar(false);
                    }}
                  />
                </label>
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">Add a profile photo <span className="font-normal text-charcoal-700/60">(optional)</span></p>
                  <p className="mt-1 text-xs leading-5 text-charcoal-700/70">A clear photo helps make your practice space feel like yours.</p>
                  {uploadingAvatar && <p className="mt-1 text-xs font-medium text-veyra-600">Uploading…</p>}
                  {avatarError && <p className="mt-1 text-xs font-medium text-red-600">{avatarError}</p>}
                </div>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name (optional)"
                className="input-field"
                autoFocus
              />
              <p className="text-xs text-charcoal-700/70">You can skip this — we'll just say "there" instead.</p>
            </StepWrapper>
          )}

          {step === 1 && (
            <StepWrapper title="Where are you in your journey?" subtitle="This helps us tailor questions to your stage.">
              <div className="grid gap-2 sm:grid-cols-2">
                {STAGES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStage(s.value)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-medium transition-all ${
                      stage === s.value
                        ? 'border-veyra-500 bg-veyra-50 text-charcoal-900 shadow-[0_0_0_3px_rgba(255,106,43,0.12)]'
                        : 'border-charcoal-900/[0.08] bg-white text-charcoal-800 hover:-translate-y-0.5 hover:border-charcoal-900/20'
                    }`}
                  >
                    <span className="text-veyra-600">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper title="What are you preparing for?" subtitle="Tell us your main goal so we can ask the right questions.">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. University admission interview, scholarship application, first job..."
                className="input-field"
                autoFocus
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Target institution, role, or competition <span className="text-charcoal-700/50">(optional)</span>
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. MIT, Google internship, Rhodes Scholarship..."
                  className="input-field"
                />
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper title="How experienced are you with interviews?" subtitle="We'll adjust the difficulty accordingly.">
              <div className="space-y-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      level === l.value
                        ? 'border-veyra-500 bg-veyra-50 shadow-[0_0_0_3px_rgba(255,106,43,0.12)]'
                        : 'border-charcoal-900/[0.08] bg-white hover:-translate-y-0.5 hover:border-charcoal-900/20'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-charcoal-900">{l.label}</p>
                      <p className="text-sm text-charcoal-700">{l.desc}</p>
                    </div>
                    {level === l.value && <Check size={20} className="text-veyra-600" />}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper title="What do you want to improve?" subtitle="Pick any areas you're concerned about. You can change these later.">
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleConcern(c)}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                      concerns.includes(c)
                        ? 'border-veyra-500 bg-veyra-50 text-veyra-700'
                        : 'border-charcoal-900/[0.08] bg-white text-charcoal-700 hover:border-charcoal-900/20'
                    }`}
                  >
                    {concerns.includes(c) && <Check size={14} />}
                    {c}
                  </button>
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-xs text-charcoal-700/70">
                <AlertCircle size={14} /> Optional — you can skip this step entirely.
              </p>
            </StepWrapper>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={back} className="btn-ghost">
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              {canProceed() ? null : (
                <button
                  onClick={() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))}
                  className="btn-ghost"
                >
                  <SkipForward size={16} /> Skip
                </button>
              )}
              <button onClick={next} disabled={!canProceed() || submitting} className="btn-primary">
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving…
                  </>
                ) : step === TOTAL_STEPS - 1 ? (
                  <>
                    <Target size={16} /> Start Practicing
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h2 className="font-serif text-2xl font-medium leading-tight tracking-[-0.03em] text-charcoal-900">{title}</h2>
        <p className="mt-1.5 text-sm leading-6 text-charcoal-700">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
