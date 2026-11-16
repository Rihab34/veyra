import { supabase } from './supabaseClient';

export async function sendLoginEmail(
  userId: string,
  email: string,
  name: string,
): Promise<void> {
  try {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) return;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-login-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ userId, email, name }),
      },
    );

    if (!response.ok) {
      console.warn('sendLoginEmail failed:', response.status);
    }
  } catch (err) {
    console.warn('sendLoginEmail error:', err);
  }
}
