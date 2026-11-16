# Veyra

Veyra is an AI interview practice app for university, scholarship, internship, and competition interviews. The frontend uses React, TypeScript, and Vite. The `supabase/` directory contains database migrations and Edge Functions.

## Run locally

Create a `.env` file at the project root and set `VITE_SUPABASE_URL` to your Supabase project URL and `VITE_SUPABASE_ANON_KEY` to its client-side anon key. Keep the Supabase service-role key and other server credentials in the Edge Function environment.

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Run `npm run build` to create a production build.
