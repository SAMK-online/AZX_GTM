import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { searchCompany } from "@/lib/tavily";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import type { Industry } from "@/types";

export const runtime = "edge";

const RequestSchema = z.object({
  companyName: z.string().min(2).max(100),
  industry: z.enum([
    "Energy & Utilities",
    "Industrial",
    "Finance",
    "Healthcare",
    "General",
  ]),
});

export async function POST(request: Request) {
  // Validate input
  let body: { companyName: string; industry: Industry };
  try {
    const raw = await request.json();
    body = RequestSchema.parse(raw) as { companyName: string; industry: Industry };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { companyName, industry } = body;

  // Phase 1: Tavily search for live grounding (non-fatal if it fails)
  const tavilyResults = await searchCompany(companyName, industry);

  // Phase 2: Stream Claude response via custom TransformStream
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Run stream asynchronously, don't await
  (async () => {
    try {
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 2800,
        system: buildSystemPrompt(industry),
        messages: [
          {
            role: "user",
            content: buildUserPrompt(companyName, industry, tavilyResults),
          },
        ],
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          await writer.write(encoder.encode(event.delta.text));
        }
      }
    } catch (err) {
      // Write error marker that client can detect
      await writer.write(encoder.encode("\n__STREAM_ERROR__"));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Tavily-Grounded": tavilyResults ? "true" : "false",
    },
  });
}
