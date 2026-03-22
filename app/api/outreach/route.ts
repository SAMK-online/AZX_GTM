import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const runtime = "edge";

const RequestSchema = z.object({
  name: z.string(),
  title: z.string(),
  company: z.string(),
  description: z.string(),
  messageType: z.enum(["email", "linkedin"]),
  briefContext: z.object({
    signals: z.string(),
    painPoints: z.string(),
    azxFit: z.string(),
  }),
});

export async function POST(request: Request) {
  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  const { name, title, company, description, messageType, briefContext } = body;

  const prompt = messageType === "email"
    ? `Write a personalized cold outreach email for ${name}, ${title} at ${company}.

Contact context:
${description}

Company intelligence:
- Signals: ${briefContext.signals}
- Pain points: ${briefContext.painPoints}
- AZX fit: ${briefContext.azxFit}

Write the email in this exact format:
SUBJECT: [specific subject line referencing their situation]

Hi ${name.split(" ")[0]},

[3-4 short sentences: hook referencing their specific initiative or challenge → connect to AZX's domain-specific AI → clear value proposition → CTA for a 20-minute call]

Best,
[Your Name]
AZX

Rules: executive peer tone, no generic AI pitches, reference something specific and observable about ${company}, scannable, under 150 words total.`
    : `Write a LinkedIn connection request message for ${name}, ${title} at ${company}.

Context: ${description}

Company context: ${briefContext.signals}

Rules:
- Under 280 characters
- Reference something specific to their role or company
- End with a soft CTA
- No generic "I'd love to connect" openers
- Peer tone

Output only the message, no labels or formatting.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      });
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
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
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
