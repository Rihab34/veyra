import { createClient } from "npm:@supabase/supabase-js@2.57.4";
// Veyra page content fetcher — extracts text from URLs for question generation

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function extractTextFromHtml(html: string): string {
  // Remove script and style blocks
  let cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, " ");
  cleaned = cleaned.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  // Replace tags with spaces
  cleaned = cleaned.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  cleaned = cleaned.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Validate URL format
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return new Response(
        JSON.stringify({ error: "Only http and https URLs are supported" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VeyraBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch page (status ${response.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return new Response(
        JSON.stringify({ error: "URL does not return an HTML page" }),
        { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const html = await response.text();
    const text = extractTextFromHtml(html);

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : parsed.hostname;

    // Extract meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const metaDescription = descMatch ? descMatch[1].trim() : "";

    // Limit text to first 5000 chars to keep payload manageable
    const truncatedText = text.slice(0, 5000);

    // Extract key phrases — look for sentences containing interview-relevant keywords
    const keywords = [
      "interview", "admission", "apply", "applicant", "requirement",
      "program", "course", "degree", "scholarship", "funding",
      "research", "faculty", "campus", "student", "criteria",
      "selection", "eligibility", "deadline", "mission", "values",
      "community", "leadership", "excellence", "innovation",
    ];

    const sentences = truncatedText.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);
    const relevantSentences = sentences.filter((s) =>
      keywords.some((kw) => s.toLowerCase().includes(kw))
    ).slice(0, 30);

    return new Response(
      JSON.stringify({
        title,
        url: parsed.href,
        metaDescription,
        text: truncatedText,
        relevantContext: relevantSentences.join(". "),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
