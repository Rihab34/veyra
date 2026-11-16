import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import type { UserProfile, InterviewSession, Language } from '@/types';
import {
  loadProfile,
  saveProfile,
  clearProfile,
} from '@/lib/storage';
import { fetchProfile, upsertProfile, signOutAuth } from '@/lib/profiles';
import {
  fetchSessions,
  upsertSessionRow,
  deleteSessionRow,
} from '@/lib/sessionsDb';
import { supabase } from '@/lib/supabaseClient';
import { isDemoMode, configureAI } from '@/lib/aiService';
import { sendLoginEmail } from '@/lib/loginEmail';

interface AppState {
  authReady: boolean;
  session: Session | null;
  profile: UserProfile | null;
  sessions: InterviewSession[];
  sessionsLoading: boolean;
  demoMode: boolean;
  guest: boolean;
  enterGuest: () => void;
  setProfile: (p: UserProfile | null) => void;
  syncProfileToSupabase: (p: UserProfile) => Promise<void>;
  upsertSession: (s: InterviewSession) => Promise<void>;
  refreshSessions: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  navigate: (path: string) => void;
  route: string;
  language: Language;
}

const GUEST_KEY = 'veyra-guest';

function readStoredGuest(): boolean {
  return window.localStorage.getItem(GUEST_KEY) === 'true';
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [route, setRoute] = useState<string>(
    window.location.hash.slice(1) || '/'
  );

  const [guest, setGuest] = useState<boolean>(readStoredGuest);

  // Track the user id we have already loaded profile + sessions for, so we
  // don't refetch on every auth state tick (e.g. token refresh).
  const loadedForUserId = useRef<string | null>(null);

  // Restore session + listen for auth changes.
  // onAuthStateChange runs its callback synchronously; async work is wrapped
  // in an IIFE to avoid deadlocking on subsequent supabase calls.
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      (async () => {
        setSession(newSession);

        if (newSession?.user) {
          const userId = newSession.user.id;

          // Only load profile + sessions when the user actually changes, not
          // on every token refresh event.
          if (loadedForUserId.current !== userId) {
            loadedForUserId.current = userId;

            const [remote, userSessions] = await Promise.all([
              fetchProfile(userId),
              fetchSessions(userId),
            ]);

            if (!mounted) return;

            if (remote) {
              setProfileState(remote);
              saveProfile(remote);
            } else {
              setProfileState(null);
              clearProfile();
            }
            setSessions(userSessions);

            const emailAddress = newSession.user.email ?? '';
            const displayName = remote?.name ?? '';
            if (emailAddress) {
              sendLoginEmail(userId, emailAddress, displayName);
            }
          }
        } else {
          loadedForUserId.current = null;
          setProfileState(null);
          clearProfile();
          setSessions([]);
        }
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // If a session exists but no profile is loaded yet, try fetching once after
  // auth is ready (covers the initial getSession path that doesn't always fire
  // onAuthStateChange with the right timing).
  useEffect(() => {
    if (!authReady || !session?.user) return;
    const userId = session.user.id;
    if (loadedForUserId.current === userId) return;

    let cancelled = false;
    (async () => {
      loadedForUserId.current = userId;
      setSessionsLoading(true);
      const [remote, userSessions] = await Promise.all([
        fetchProfile(userId),
        fetchSessions(userId),
      ]);
      if (cancelled) return;
      if (remote) {
        setProfileState(remote);
        saveProfile(remote);
      }
      setSessions(userSessions);
      setSessionsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, session]);

  // Configure AI engine once on mount.
  useEffect(() => {
    configureAI({ provider: 'demo' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const language: Language = 'en';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  const enterGuest = useCallback(() => {
    window.localStorage.setItem(GUEST_KEY, 'true');
    setGuest(true);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  const setProfile = useCallback((p: UserProfile | null) => {
    setProfileState(p);
    if (p) saveProfile(p);
  }, []);

  const syncProfileToSupabase = useCallback(async (p: UserProfile) => {
    await upsertProfile(p);
    saveProfile(p);
    setProfileState(p);
  }, []);

  const upsertSession = useCallback(async (s: InterviewSession) => {
    // Optimistically update local state for a snappy UI, then persist.
    setSessions((prev) => {
      const idx = prev.findIndex((x) => x.id === s.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = s;
        return next;
      }
      return [s, ...prev];
    });
    await upsertSessionRow(s);
  }, []);

  const refreshSessions = useCallback(async () => {
    if (!session?.user) return;
    setSessionsLoading(true);
    const userSessions = await fetchSessions(session.user.id);
    setSessions(userSessions);
    setSessionsLoading(false);
  }, [session]);

  const deleteSession = useCallback(async (id: string) => {
    if (!session?.user) return;
    setSessions((prev) => prev.filter((x) => x.id !== id));
    await deleteSessionRow(session.user.id, id);
  }, [session]);

  const signOut = useCallback(async () => {
    await signOutAuth();
    window.localStorage.removeItem(GUEST_KEY);
    setGuest(false);
    loadedForUserId.current = null;
    setProfileState(null);
    clearProfile();
    setSessions([]);
    window.location.hash = '/';
    setRoute('/');
  }, []);

  return (
    <AppContext.Provider
      value={{
        authReady,
        session,
        profile,
        sessions,
        sessionsLoading,
        demoMode: isDemoMode(),
        guest,
        enterGuest,
        setProfile,
        syncProfileToSupabase,
        upsertSession,
        refreshSessions,
        deleteSession,
        signOut,
        navigate,
        route,
        language,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Re-export for any callers that imported from storage previously.
export { loadProfile };
