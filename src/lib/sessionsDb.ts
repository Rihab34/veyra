import { supabase } from './supabaseClient';
import type { InterviewSession } from '@/types';

interface SessionRow {
  id: string;
  data: InterviewSession;
  status: string;
  category: string;
  started_at: string;
  ended_at: string | null;
}

function toRow(session: InterviewSession): Omit<SessionRow, 'started_at'> {
  return {
    id: session.id,
    data: session,
    status: session.status,
    category: session.config?.category ?? '',
    ended_at: session.endedAt ?? null,
  };
}

function rowToSession(row: SessionRow): InterviewSession {
  // The authoritative payload is `data`. The denormalized columns are only
  // for filtering; trust the JSONB for the full shape.
  return row.data;
}

export async function fetchSessions(userId: string): Promise<InterviewSession[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, data, status, category, started_at, ended_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.warn('fetchSessions error:', error.message);
    return [];
  }
  if (!data) return [];

  return (data as SessionRow[]).map(rowToSession);
}

export async function fetchSessionById(
  userId: string,
  sessionId: string
): Promise<InterviewSession | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, data, status, category, started_at, ended_at')
    .eq('user_id', userId)
    .eq('id', sessionId)
    .maybeSingle();

  if (error) {
    console.warn('fetchSessionById error:', error.message);
    return null;
  }
  if (!data) return null;
  return rowToSession(data as SessionRow);
}

export async function upsertSessionRow(session: InterviewSession): Promise<void> {
  const row = toRow(session);
  const { error } = await supabase.from('sessions').upsert({
    id: row.id,
    data: row.data,
    status: row.status,
    category: row.category,
    ended_at: row.ended_at,
  });
  if (error) {
    console.warn('upsertSessionRow error:', error.message);
    throw error;
  }
}

export async function deleteSessionRow(userId: string, sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('user_id', userId)
    .eq('id', sessionId);
  if (error) {
    console.warn('deleteSessionRow error:', error.message);
    throw error;
  }
}
