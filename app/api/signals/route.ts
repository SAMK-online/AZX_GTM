import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { fetchRecentNews } from "@/lib/tavily";

export const runtime = "edge";

const RequestSchema = z.object({
  companyName: z.string().min(2).max(100),
});

export async function POST(request: Request) {
  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { companyName } = body;

  const articles = await fetchRecentNews(companyName);

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const newsContext = articles?.length
    ? articles
        .map(
          (a, i) =>
            `${i + 1}. ${a.title}${a.published_date ? ` (${a.published_date})` : ""}\n   ${a.content.slice(0, 300)}`
        )
        .join("\n\n")
    : "No recent news found. Use your training knowledge to identify likely current signals.";

  const prompt = `You are an AI GTM signal analyst. Your job is to extract actionable buying signals from news for enterprise sales teams.

Analyze the following recent news about ${companyName} and extract 3-5 GTM buying signals. Each signal should tell an enterprise AE exactly what is happening and what it means for an outreach conversation.

NEWS:
${newsContext}

Output each signal in this exact format (maintain the ## headers):

## [URGENCY] Signal headline

One paragraph: what happened, why it creates a buying window, and the specific outreach angle this enables. Be concrete — reference the actual news. No generic "this company is investing in AI" statements.

URGENCY levels:
- HIGH: Active initiative, imminent budget cycle, regulatory deadline, or competitive threat within 90 days
- MED: Strategic direction set, buying likely in 6-12 months
- LOW: Background context, watch signal

Output 3-5 signals. Start immediately with the first ## header. No preamble.`;

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          await writer.write(encoder.encode(event.delta.text));
        }
      }
    } catch {
      await writer.write(encoder.encode("\n__STREAM_ERROR__"));
    } finally {
      await writer.close();
    }
  })();

  const sources = articles
    ? JSON.stringify(articles.map((a) => ({ title: a.title, url: a.url })))
    : "[]";

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Sources": sources,
    },
  });
}
