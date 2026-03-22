interface TavilyResult {
  title: string;
  url: string;
  content: string;
  published_date?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
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
