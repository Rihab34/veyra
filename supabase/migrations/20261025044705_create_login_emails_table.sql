/*
# Create login_emails table (retail pilot email tracking)

## Purpose
Track which users have already received the Veyra retail-pilot login email,
so the edge function can deduplicate sends (one per user per UTC day) instead
of emailing on every token-refresh event. This keeps the pilot from spamming
users while still reaching "everyone who logs in".

## 1. New Tables

### `login_emails`
  - `id`          uuid primary key
  - `user_id`     uuid NOT NULL, references auth.users ON DELETE CASCADE
  - `email`       text NOT NULL — the recipient address at send time
  - `name`        text NOT NULL DEFAULT '' — recipient display name
  - `sent_day`    date NOT NULL — UTC day of the send (used for dedup)
  - `created_at`  timestamptz NOT NULL DEFAULT now()
  - Unique constraint on (user_id, sent_day) so only one pilot email per user per day.

Indexes:
  - `login_emails_user_day_idx` on (user_id, sent_day) — dedup lookup

## 2. Security
  - RLS enabled.
  - The frontend never reads or writes this table directly; only the
    `send-login-email` edge function (using the service role key) touches it.
    Therefore NO grants are given to `anon` or `authenticated` — the service
    role bypasses RLS and is the only caller. This keeps send history private.
*/

CREATE TABLE IF NOT EXISTS login_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL DEFAULT '',
  sent_day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE login_emails ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS login_emails_user_day_idx
  ON login_emails (user_id, sent_day);
