import type { UserProfile, Language } from '@/types';

const PROFILE_KEY = 'veyra:profile';

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

export function getPreferredLang(): Language {
  const p = loadProfile();
  if (p) return p.language;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('fr')) return 'fr';
  if (browser.startsWith('ar')) return 'ar';
  return 'en';
}
