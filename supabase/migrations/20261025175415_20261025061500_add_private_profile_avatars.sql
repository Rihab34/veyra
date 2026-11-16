/*
# Add private profile avatars

1. Purpose
   Adds an optional profile photo to each signed-in user's existing profile and
   creates a private Supabase Storage bucket for those photos. The photo is
   stored as an object path owned by the user, not as a public URL.

2. Modified Tables
   - `profiles`
     - `avatar_path` (text, nullable): the user's private object path in the
       `avatars` bucket. Existing profiles remain valid with NULL.

3. Storage
   - Creates the private `avatars` bucket if it does not already exist.
   - Restricts uploads to JPEG, PNG, and WebP images.
   - Limits each uploaded image to 5 MB.
   - Stores each avatar under a folder named with the authenticated user's id.

4. Security
   - Grants authenticated users access only to their own profile row's avatar
     path through the existing profile policies.
   - Adds storage policies for authenticated users to insert, read, update,
     and delete objects only inside their own user-id folder.
   - Anonymous users receive no avatar access.

5. Compatibility
   - The change is additive and preserves all existing profile data.
   - Re-running this migration is safe through idempotent column, bucket, and
     policy statements.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_path text;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[];

DROP POLICY IF EXISTS "avatars_select_own" ON storage.objects;
CREATE POLICY "avatars_select_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);