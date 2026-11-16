export interface PageContent {
  title: string;
  url: string;
  metaDescription: string;
  text: string;
  relevantContext: string;
}

export async function fetchPageContent(url: string): Promise<PageContent> {
  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-page-content`;
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Failed to fetch page content (status ${response.status})`);
  }

  const data = await response.json();
  if (!data || !data.text) {
    throw new Error('Page content was empty or invalid');
  }

  return data as PageContent;
}
