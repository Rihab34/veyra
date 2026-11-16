import { supabase } from './supabaseClient';
import type { UserProfile } from '@/types';

// Shape stored in the profiles table (no local id/createdAt; those come from auth).
interface ProfileRow {
  id: string;
  name: string;
  education_stage: string;
  goal: string;
  target: string;
  experience_level: string;
  language: string;
  concerns: string[];
  avatar_path: string | null;
  created_at: string;
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, education_stage, goal, target, experience_level, language, concerns, avatar_path, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('fetchProfile error:', error.message);
    return null;
  }
  if (!data) return null;

  return rowToProfile(data as ProfileRow);
}

export async function upsertProfile(profile: UserProfile): Promise<void> {
  const row = {
    id: profile.id,
    name: profile.name,
    education_stage: profile.educationStage,
    goal: profile.goal,
    target: profile.target,
    experience_level: profile.experienceLevel,
    language: profile.language,
    concerns: profile.concerns,
    avatar_path: profile.avatarPath ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(row);
  if (error) {
    console.warn('upsertProfile error:', error.message);
    throw error;
  }
}

export async function signOutAuth(): Promise<void> {
  await supabase.auth.signOut();
}

function rowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name ?? '',
    educationStage: (row.education_stage as UserProfile['educationStage']) ?? 'other',
    goal: row.goal ?? '',
    target: row.target ?? '',
    experienceLevel: (row.experience_level as UserProfile['experienceLevel']) ?? 'beginner',
    language: (row.language as UserProfile['language']) ?? 'en',
    concerns: Array.isArray(row.concerns) ? row.concerns : [],
    avatarPath: row.avatar_path ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}
