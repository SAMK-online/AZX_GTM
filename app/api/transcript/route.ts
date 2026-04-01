export const runtime = "edge";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const BodySchema = z.object({ text: z.string().min(50).max(30000) });

const SYSTEM = `You are a meeting intelligence assistant. Extract clear, prioritized weekly action plans for each participant from meeting transcripts. Return ONLY valid JSON. No markdown, no explanation, no code fences.`;

function buildPrompt(transcript: string) {
  return `Parse this meeting transcript and produce a weekly action plan for every participant who has been assigned tasks.

TRANSCRIPT:
${transcript}

Return EXACTLY this JSON structure:
{
  "meeting": "concise meeting title",
  "date": "date if mentioned, otherwise omit",
  "participants": [
    {
      "name": "Full Name",
      "role": "Job Title",
      "initials": "2-letter initials uppercase",
      "todos": [
        {
          "id": 1,
          "priority": "HIGH",
          "task": "Specific, actionable task description",
          "due": "Due timing e.g. Today, Wednesday EOD, Thursday 2PM, This week",
          "context": "One sentence explaining why this task matters"
        }
      ]
    }
  ]
}

Rules:
- Only include participants who have explicit tasks assigned to them in the transcript
- Priority HIGH = due today or tomorrow, or blocking another person
- Priority MED = due mid-week
- Priority LOW = due by end of week or no urgency mentioned
- 3 to 6 todos per person
- Tasks must be specific and actionable, not generic
- Sort each person's todos by priority descending (HIGH first)
- Initials = first letter of first name + first letter of last name`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid input — need at least 50 characters of transcript" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const stream = client.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        system: SYSTEM,
        messages: [{ role: "user", content: buildPrompt(parsed.data.text) }],
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
