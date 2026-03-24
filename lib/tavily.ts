interface TavilyResult {
  title: string;
  url: string;
  content: string;
  published_date?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
}

interface TavilyExtractResult {
  url: string;
  raw_content: string;
}

interface TavilyExtractResponse {
  results: TavilyExtractResult[];
}

export interface NewsArticle {
  title: string;
  url: string;
  content: string;
  published_date?: string;
}

export async function searchCompany(
  companyName: string,
  industry: string
): Promise<string | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${companyName} ${industry} AI strategy news initiatives 2025`,
        search_depth: "basic",
        max_results: 5,
        include_answer: false,
      }),
    });

    if (!response.ok) return null;

    const data: TavilyResponse = await response.json();

    if (!data.results?.length) return null;

    // Format results for injection into Claude prompt
    return data.results
      .slice(0, 5)
      .map((r, i) => {
        const date = r.published_date ? ` (${r.published_date})` : "";
        return `${i + 1}. ${r.title}${date}\n   ${r.content.slice(0, 200)}...`;
      })
      .join("\n\n");
  } catch {
    // Tavily failure is non-fatal — proceed without grounding
    return null;
  }
}

/**
 * Fetch recent news articles about a company.
 * Returns structured articles for signal extraction.
 */
export async function fetchRecentNews(
  companyName: string
): Promise<NewsArticle[] | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${companyName} news announcement strategy partnership 2025`,
        search_depth: "basic",
        max_results: 8,
        include_answer: false,
        days: 60,
      }),
    });

    if (!response.ok) return null;

    const data: TavilyResponse = await response.json();
    if (!data.results?.length) return null;

    return data.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
      published_date: r.published_date,
    }));
  } catch {
    return null;
  }
}

/**
 * Extract readable text content from a URL (for newsletter parsing).
 */
export async function extractFromUrl(url: string): Promise<string | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.tavily.com/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        urls: [url],
      }),
    });

    if (!response.ok) return null;

    const data: TavilyExtractResponse = await response.json();
    const result = data.results?.[0];
    if (!result?.raw_content) return null;

    return result.raw_content.slice(0, 8000);
  } catch {
    return null;
  }
}
