/*
# Create sessions table + updated_at trigger on profiles

## Purpose
Move interview practice sessions out of browser localStorage into the
database so they are:
  - Isolated per authenticated user (each user sees only their own sessions)
  - Available across devices and browsers
  - Durable and backed up with the database
  - Able to scale to 500+ concurrent users without per-client storage limits

## 1. New Tables

### `sessions`
Stores one row per interview practice session. The full session object
(config, questions, attempts, comparisons, summary) is stored as JSONB so
the existing client-side data shape is preserved without a sprawling
relational decomposition.

  - `id`           text primary key (matches the client-generated session id)
  - `user_id`      uuid NOT NULL, defaults to auth.uid(), references
                   auth.users ON DELETE CASCADE
  - `data`         jsonb NOT NULL — the full InterviewSession object
  - `status`       text NOT NULL DEFAULT 'active' (denormalized from data
                   for fast filtering without unpacking JSONB)
  - `category`     text NOT NULL DEFAULT '' (denormalized for filtering)
  - `started_at`   timestamptz NOT NULL DEFAULT now()
  - `ended_at`     timestamptz
  - `created_at`   timestamptz NOT NULL DEFAULT now()
  - `updated_at`   timestamptz NOT NULL DEFAULT now()

Indexes (support 500+ users with efficient list/detail queries):
  - `sessions_user_id_idx`          on (user_id) — every list query filters by owner
  - `sessions_user_status_idx`      on (user_id, status) — dashboard filters active vs completed
  - `sessions_user_updated_idx`     on (user_id, updated_at DESC) — recent-first ordering

## 2. Updated trigger on `profiles`
Add a `profiles_updated_at` trigger so the `updated_at` column tracks
edits automatically. This keeps profile sync honest across devices.

## 3. Security

### sessions
  - RLS enabled.
  - GRANT SELECT, INSERT, UPDATE, DELETE to `authenticated` only.
  - Four owner-scoped policies (select/insert/update/delete) using
    `auth.uid() = user_id`. `user_id` defaults to `auth.uid()` so client
    inserts that omit it still satisfy the WITH CHECK.

### profiles
  - No structural change; the trigger is added but existing policies remain.
*/
CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'active',
  category text NOT NULL DEFAULT '',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO authenticated;

DROP POLICY IF EXISTS "select_own_sessions" ON sessions;
CREATE POLICY "select_own_sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON sessions;
CREATE POLICY "insert_own_sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON sessions;
CREATE POLICY "update_own_sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON sessions;
CREATE POLICY "delete_own_sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_user_status_idx ON sessions (user_id, status);
CREATE INDEX IF NOT EXISTS sessions_user_updated_idx ON sessions (user_id, updated_at DESC);

-- === updated_at triggers ===

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS set_profiles_updated_at();

CREATE OR REPLACE FUNCTION set_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_profiles_updated_at();

DROP TRIGGER IF EXISTS sessions_updated_at ON sessions;
DROP FUNCTION IF EXISTS set_sessions_updated_at();

CREATE OR REPLACE FUNCTION set_sessions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_sessions_updated_at();
