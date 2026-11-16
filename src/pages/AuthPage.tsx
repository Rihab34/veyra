import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabaseClient';

type Mode = 'signin' | 'signup';

interface AuthPageProps {
  initialMode?: Mode;
  onSuccess: () => void;
  onBack: () => void;
}

export function AuthPage({ initialMode = 'signin', onSuccess, onBack }: AuthPageProps) {
  const { enterGuest, session } = useApp();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const isSignup = mode === 'signup';

  // After Google OAuth, Supabase redirects back to the app root, restores the
  // session via onAuthStateChange, and then the session state updates here.
  // We watch for it and call onSuccess once.
  const didAutoNavigate = useRef(false);
  useEffect(() => {
    if (session && googleLoading && !didAutoNavigate.current) {
      didAutoNavigate.current = true;
      setGoogleLoading(false);
      onSuccess();
    }
  }, [session, googleLoading, onSuccess]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    // Redirect to the plain app origin — Supabase strips hash fragments.
    // onAuthStateChange picks up the session and the effect above fires.
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) {
      setGoogleLoading(false);
      setError(humanizeAuthError(oauthError.message));
    }
    // If no error the browser is being redirected — keep spinner up.
  };

  const handleGuest = () => {
    enterGuest();
    onSuccess();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message ? humanizeAuthError(message) : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-5 py-5 sm:px-8">
        <button onClick={onBack} aria-label="Back to home" className="transition-opacity hover:opacity-80">
          <Logo size="sm" />
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:text-charcoal-900"
        >
          <ArrowLeft size={14} /> Back home
        </button>
      </nav>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="grid w-full max-w-[900px] overflow-hidden rounded-[32px] border border-white/50 bg-[#fbf6ee]/80 shadow-[0_40px_120px_rgba(14,18,23,0.18)] backdrop-blur-2xl lg:grid-cols-[1fr_440px]">

          {/* Left panel — brand story */}
          <div className="relative hidden overflow-hidden bg-[#0e1217] p-10 lg:flex lg:flex-col lg:justify-between">
            {/* Decorative gradient orb */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#ff6a2b]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[#ff6a2b]/10 blur-2xl" />

            <div className="relative">
              <Logo size="sm" showText={false} />
              <p className="mt-2 text-base font-semibold tracking-[-0.01em] text-white">Veyra</p>
            </div>

            <div className="relative space-y-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a2b]">AI Interview Coach</p>
                <h2 className="mt-4 text-3xl font-medium leading-[1.08] tracking-[-0.05em] text-white">
                  Practice until it feels{' '}
                  <em className="font-serif font-normal text-[#ff8a57]">natural.</em>
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  Tailored questions, instant feedback, and a score you can download — all private to you.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Real questions tailored to your target',
                  'Honest AI feedback after every answer',
                  'Track progress across sessions',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6a2b]/15">
                      <CheckCircle2 size={12} className="text-[#ff6a2b]" />
                    </span>
                    <p className="text-sm text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="px-8 py-10 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">Welcome</p>
            <h1 className="mt-3 text-[2.2rem] font-medium leading-[1.04] tracking-[-0.06em] text-charcoal-900">
              {isSignup ? (
                <>Create your <em className="font-serif font-normal text-[#b85d38]">space.</em></>
              ) : (
                <>Sign <em className="font-serif font-normal text-[#b85d38]">in.</em></>
              )}
            </h1>
            <p className="mt-2.5 text-sm leading-6 text-charcoal-700">
              {isSignup
                ? 'Start practising with real interview questions.'
                : 'Pick up right where you left off.'}
            </p>

            {/* Social buttons */}
            <div className="mt-7 space-y-3">
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="group relative flex h-[50px] w-full items-center justify-center gap-3 rounded-2xl border border-charcoal-900/[0.12] bg-white text-sm font-medium text-charcoal-900 shadow-[0_2px_8px_rgba(14,18,23,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(14,18,23,0.12)] disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {googleLoading ? (
                  <Loader2 size={17} className="animate-spin text-charcoal-700" />
                ) : (
                  <GoogleMark />
                )}
                <span>{googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}</span>
              </button>

              <button
                onClick={handleGuest}
                className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-charcoal-900 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1b2129]"
              >
                <Sparkles size={15} className="text-[#ff6a2b]" />
                Continue as guest
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-charcoal-900/[0.08]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-charcoal-700/70">or email</span>
              <span className="h-px flex-1 bg-charcoal-900/[0.08]" />
            </div>

            {/* Mode toggle */}
            <div className="mb-5 flex rounded-xl bg-charcoal-900/[0.05] p-1 text-sm font-medium">
              <button
                onClick={() => switchMode('signin')}
                className={`flex-1 rounded-[10px] py-2 transition-all duration-200 ${
                  !isSignup
                    ? 'bg-white text-charcoal-900 shadow-[0_1px_4px_rgba(14,18,23,0.1)]'
                    : 'text-charcoal-700 hover:text-charcoal-900'
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-[10px] py-2 transition-all duration-200 ${
                  isSignup
                    ? 'bg-white text-charcoal-900 shadow-[0_1px_4px_rgba(14,18,23,0.1)]'
                    : 'text-charcoal-700 hover:text-charcoal-900'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-700"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address"
                  autoComplete="email"
                  className="h-[50px] w-full rounded-2xl border border-charcoal-900/[0.1] bg-white/80 pl-11 pr-4 text-sm text-charcoal-900 placeholder:text-charcoal-700/50 transition-colors focus:border-[#ff6a2b] focus:outline-none focus:ring-4 focus:ring-[#ff6a2b]/[0.12]"
                />
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-700"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  aria-label="Password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  className="h-[50px] w-full rounded-2xl border border-charcoal-900/[0.1] bg-white/80 pl-11 pr-4 text-sm text-charcoal-900 placeholder:text-charcoal-700/50 transition-colors focus:border-[#ff6a2b] focus:outline-none focus:ring-4 focus:ring-[#ff6a2b]/[0.12]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a2b] text-sm font-semibold text-charcoal-900 shadow-[0_8px_24px_-8px_rgba(255,106,43,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff7d42] disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <>
                    {isSignup ? 'Create account' : 'Sign in'}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-5 text-charcoal-700/70">
              Guest sessions are saved to this device only.{' '}
              <br className="hidden sm:block" />
              Sign in to sync everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function humanizeAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid credentials'))
    return 'Wrong email or password.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'An account with this email already exists. Try signing in.';
  if (m.includes('email') && m.includes('invalid'))
    return 'Please enter a valid email address.';
  if (m.includes('password') && m.includes('weak'))
    return 'That password is too weak. Try something longer.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a moment and try again.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Check your connection and try again.';
  return message;
}
