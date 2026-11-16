/*
# Create profiles table (multi-user, owner-scoped)

1. Purpose
   Adds per-user profile storage so each signed-in user keeps their own
   Veyra coaching profile (name, education stage, goal, target, experience
   level, language, concerns) tied to their auth identity. This enables
   email/password and Google sign-in, with profiles scoped to each account.

2. New Tables
   - `profiles`
     - `id` (uuid, primary key, references auth.users on delete cascade)
     - `name` (text, default '')
     - `education_stage` (text, default 'other')
     - `goal` (text, default '')
     - `target` (text, default '')
     - `experience_level` (text, default 'beginner')
     - `language` (text, default 'en')
     - `concerns` (jsonb, default '[]')
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())

3. Security
   - Enable RLS on `profiles`.
   - Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only (sign-in app).
   - Owner-scoped CRUD: each authenticated user can only access the row whose
     id matches their auth.uid(). The profile row id equals the auth user id,
     so no separate `user_id` column is needed.
   - `REVOKE EXECUTE` is not needed — no SECURITY DEFINER functions are created.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  education_stage text NOT NULL DEFAULT 'other',
  goal text NOT NULL DEFAULT '',
  target text NOT NULL DEFAULT '',
  experience_level text NOT NULL DEFAULT 'beginner',
  language text NOT NULL DEFAULT 'en',
  concerns jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);
