import { useEffect, useRef } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SetupPage } from '@/pages/SetupPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { SummaryPage } from '@/pages/SummaryPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { SessionReviewPage } from '@/pages/SessionReviewPage';
import { CoachMascot } from '@/components/CoachMascot';

function Router() {
  const { route, profile, session, guest, authReady, navigate } = useApp();
  const hasAccess = Boolean(session) || guest;

  // After a Google OAuth redirect, Supabase restores the session and returns
  // the user to the plain app origin (no hash). Detect this: if the route is
  // "/" and we now have a session, jump to dashboard automatically.
  // We use a ref so this only fires once per load, not on every re-render.
  const oauthNavigated = useRef(false);
  useEffect(() => {
    if (authReady && session && !oauthNavigated.current) {
      const currentHash = window.location.hash.slice(1) || '/';
      if (currentHash === '/' || currentHash === '') {
        oauthNavigated.current = true;
        navigate(profile ? '/dashboard' : '/onboarding');
      }
    }
  }, [authReady, session, profile, navigate]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-300 border-t-veyra-500" />
      </div>
    );
  }

  const parts = route.replace(/^\//, '').split('/');
  const segment = parts[0] || '';

  const protectedSegments = new Set([
    'dashboard',
    'setup',
    'interview',
    'summary',
    'progress',
    'session',
  ]);

  if (protectedSegments.has(segment) && !hasAccess) {
    return (
      <AuthPage
        initialMode="signin"
        onSuccess={() => navigate('/dashboard')}
        onBack={() => navigate('/')}
      />
    );
  }

  if (segment === 'auth') {
    return (
      <AuthPage
        initialMode={parts[1] === 'signup' ? 'signup' : 'signin'}
        onSuccess={() => navigate(profile ? '/dashboard' : '/onboarding')}
        onBack={() => navigate('/')}
      />
    );
  }

  if (segment === 'onboarding' && !hasAccess) {
    return (
      <AuthPage
        initialMode="signup"
        onSuccess={() => navigate('/onboarding')}
        onBack={() => navigate('/')}
      />
    );
  }

  if (segment === 'dashboard' && !profile) return <OnboardingPage />;
  if (segment === 'setup' && !profile) return <OnboardingPage />;

  switch (segment) {
    case '':
      return <LandingPage />;
    case 'onboarding':
      return <OnboardingPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'setup':
      return <SetupPage />;
    case 'interview':
      return <InterviewPage sessionId={parts[1]} />;
    case 'summary':
      return <SummaryPage sessionId={parts[1]} />;
    case 'progress':
      return <ProgressPage />;
    case 'session':
      return <SessionReviewPage sessionId={parts[1]} />;
    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <AppProvider>
      <div className="relative min-h-screen">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/__(6).jpeg')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#fbf6ee]/70 via-[#fbf6ee]/55 to-[#fbf6ee]/85"
        />
        <Router />
      </div>
      <CoachMascot />
    </AppProvider>
  );
}

export default App;
