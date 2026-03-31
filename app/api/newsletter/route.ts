import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { extractFromUrl } from "@/lib/tavily";

export const runtime = "edge";

const RequestSchema = z
  .object({
    url: z.string().url().optional(),
    text: z.string().min(50).max(20000).optional(),
  })
  .refine((d) => d.url || d.text, {
    message: "Provide either a URL or pasted text",
  });

export async function POST(request: Request) {
  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Provide a URL or pasted newsletter text (min 50 chars)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let content: string | null = null;

  if (body.url) {
    content = await extractFromUrl(body.url);
    if (!content) {
      return new Response(
        JSON.stringify({ error: "Could not extract content from that URL. Try pasting the text directly." }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    content = body.text!;
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a GTM intelligence analyst. Your job is to extract actionable intelligence from newsletters and articles for enterprise sales teams.

Parse the following newsletter or article and extract actionable GTM intelligence. Focus on signals relevant to enterprise AI adoption, digital transformation, and strategic moves across any sector.

CONTENT:
${content}

Structure your response with exactly these sections:

## COMPANIES SIGNALING

For each company mentioned that shows buying signals or strategic moves relevant to AI/digital transformation:
**Company Name** — What they announced and why it matters for outreach. One sentence on the specific angle.

If no companies with clear signals, state: "No direct target companies identified — see market trends below."

## MARKET TRENDS

3 key themes from this content that affect the GTM motion. Each as a bolded trend name followed by one sentence of implication.

## RECOMMENDED ACTIONS

3 specific next steps a sales team should take based on this intelligence. Numbered list. Be concrete — name companies, reference specific signals.

Start immediately with ## COMPANIES SIGNALING. No preamble.`;

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
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

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
