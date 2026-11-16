import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FROM_ADDRESS = "Veyra <veyrai.inter@gmail.com>";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

interface SendRequestBody {
  email?: string;
  name?: string;
  userId?: string;
}

function htmlEmail(name: string): string {
  const greeting = name ? `Hi ${name},` : `Hi there,`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#faf7f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#0f766e;padding:28px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:0.2px;">Veyra</h1>
          <p style="margin:4px 0 0;color:#ccfbf1;font-size:13px;">Interview coaching that adapts to you</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${greeting}</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Your Veyra account is ready. You now have a private practice space to sharpen your answers, build confidence, and walk into important conversations prepared.</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Start building momentum:</p>
          <ul style="margin:0 0 24px 16px;padding:0;font-size:15px;line-height:1.8;">
            <li>Start a new interview session tailored to your goal</li>
            <li>Review feedback from your previous attempts</li>
            <li>Track your improvement across practice sessions</li>
          </ul>
          <a href="https://veyra.com" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 24px;border-radius:10px;">Go to your dashboard</a>
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid #f1ede7;">
          <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">You received this email because you created a Veyra account. This is an automated confirmation message.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function textEmail(name: string): string {
  const greeting = name ? `Hi ${name},` : `Hi there,`;
  return `${greeting}

Your Veyra account is ready. You now have a private practice space to sharpen your answers, build confidence, and walk into important conversations prepared.

Start building momentum:
- Start a new interview session tailored to your goal
- Review feedback from your previous attempts
- Track your improvement across practice sessions

Go to your dashboard to get started.

You received this email because you created a Veyra account. This is an automated confirmation message.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service is not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body: SendRequestBody = await req.json();
    const email = body.email?.trim();
    const name = body.name?.trim() ?? "";
    const userId = body.userId?.trim();

    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: "Email and user id are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const authorization = req.headers.get("Authorization");
    const accessToken = authorization?.replace(/^Bearer\\s+/i, "");
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } },
    );
    const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

    if (userError || !userData.user || userData.user.id !== userId || userData.user.email?.toLowerCase() !== email.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Unable to send confirmation email." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const sentDay = new Date().toISOString().slice(0, 10);

    // Insert a dedup row; the unique constraint on (user_id, sent_day)
    // means only one pilot email per user per UTC day. If the row already
    // exists we treat this as "already sent" and return 200 without resending.
    const { error: dedupError } = await supabase
      .from("login_emails")
      .insert({ user_id: userId, email, name, sent_day: sentDay });

    if (dedupError) {
      if (dedupError.code === "23505") {
        return new Response(
          JSON.stringify({ ok: true, alreadySent: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "Could not record the send." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: "veyrai.inter@gmail.com",
        reply_to: email,
        subject: "Your Veyra practice space is ready",
        html: htmlEmail(name),
        text: textEmail(name),
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend error:", resendError.status, resendError);
      return new Response(
        JSON.stringify({ error: "Email delivery failed. Please try again later." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, alreadySent: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-login-email error:", message);
    return new Response(
      JSON.stringify({ error: "Something went wrong while sending the email." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
