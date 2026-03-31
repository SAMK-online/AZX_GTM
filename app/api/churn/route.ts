import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const runtime = "edge";

const requestSchema = z.object({
  rows: z.array(z.record(z.string())).min(1).max(100),
  nameColumn: z.string().min(1),
  adoptionColumn: z.string().min(1),
  conversionColumn: z.string().min(1),
  adoptionThreshold: z.number().min(0).max(100),
  conversionThreshold: z.number().min(0).max(100),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Compact table format to minimise tokens
  const table = body.rows
    .map((row, i) => {
      const name = row[body.nameColumn] ?? `Client ${i + 1}`;
      const adoption = row[body.adoptionColumn] ?? "0";
      const conversion = row[body.conversionColumn] ?? "0";
      const extras = Object.entries(row)
        .filter(([k]) => k !== body.nameColumn && k !== body.adoptionColumn && k !== body.conversionColumn)
        .map(([k, v]) => `${k}:${v}`)
        .join(" ");
      return `${i}|${name}|${adoption}|${conversion}${extras ? ` [${extras}]` : ""}`;
    })
    .join("\n");

  const prompt = `You are a customer success analyst assessing churn risk.

Thresholds (values are percentages):
- Adoption Rate flag: below ${body.adoptionThreshold}%
- Conversion Rate flag: below ${body.conversionThreshold}%

Categorisation rules:
- HIGH: BOTH adoption AND conversion below threshold → high churn risk
- LOW: EITHER adoption OR conversion below threshold (not both) → moderate risk
- WELL_PERFORMING: BOTH above threshold → healthy

Data columns: index|name|adoption|conversion [extra fields]
${table}

For each client produce a risk score 0–100 (100 = most likely to churn) and one specific, actionable insight.

Return ONLY a JSON array — no prose, no markdown fences:
[{"i":0,"r":"HIGH","s":85,"note":"Adoption at 18% indicates the team hasn't onboarded — renewal at risk"},...]

Fields: i=row index, r=risk level (HIGH/LOW/WELL_PERFORMING), s=risk score 0-100, note=one specific insight`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";

    // Extract JSON array from response (Claude may wrap it in markdown fences)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Claude returned no results" }), { status: 500 });
    }

    type RawItem = { i: number; r: string; s: number; note: string };
    const raw: RawItem[] = JSON.parse(jsonMatch[0]);

    // Merge analysis back with original rows; fallback for any rows Claude missed
    const analyzed = body.rows.map((row, idx) => {
      const item = raw.find((x) => x.i === idx);
      if (!item) {
        // Client-side threshold fallback
        const a = parseFloat(String(row[body.adoptionColumn] ?? "0").replace(/[^0-9.-]/g, "")) || 0;
        const c = parseFloat(String(row[body.conversionColumn] ?? "0").replace(/[^0-9.-]/g, "")) || 0;
        const both = a < body.adoptionThreshold && c < body.conversionThreshold;
        const either = a < body.adoptionThreshold || c < body.conversionThreshold;
        return {
          ...row,
          riskLevel: both ? "HIGH" : either ? "LOW" : "WELL_PERFORMING",
          riskScore: both ? 75 : either ? 45 : 10,
          reasoning: "Threshold-based estimate",
        };
      }
      return {
        ...row,
        riskLevel: item.r as "HIGH" | "LOW" | "WELL_PERFORMING",
        riskScore: Math.max(0, Math.min(100, item.s)),
        reasoning: item.note,
      };
    });

    const summary = {
      highRisk: analyzed.filter((c) => c.riskLevel === "HIGH").length,
      lowRisk: analyzed.filter((c) => c.riskLevel === "LOW").length,
      wellPerforming: analyzed.filter((c) => c.riskLevel === "WELL_PERFORMING").length,
    };

    return new Response(JSON.stringify({ analyzed, summary }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Analysis failed — please try again" }), { status: 500 });
  }
}
