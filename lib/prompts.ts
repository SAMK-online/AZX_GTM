import type { Industry } from "@/types";

export function buildSystemPrompt(industry: Industry): string {
  return `You are an expert AI GTM strategist specializing in enterprise ${industry} technology sales.

You produce precise, specific, research-grounded GTM intelligence briefs. Never generic. Cite observable facts and strategic signals. Output must follow the exact section headers provided.`;
}

export function buildUserPrompt(
  companyName: string,
  industry: Industry,
  tavilyResults: string | null
): string {
  const groundingSection = tavilyResults
    ? `\nGROUNDING DATA (from live search — use this to inform the SIGNALS section):
${tavilyResults}\n`
    : "";

  return `Generate a GTM intelligence brief for: ${companyName}
Industry focus: ${industry}
${groundingSection}
Structure your response with exactly these sections in order, using ## headers:

## SIGNALS
3-5 current signals: hiring patterns, strategic initiatives, partnerships, regulatory exposure, or financial signals that indicate buying intent or urgency. Be specific — cite observable facts, not platitudes.

## KEY STAKEHOLDERS
3 relevant executives: Name, Title, and one specific sentence about their priorities or recent public statements relevant to AI/digital transformation.

## PAIN POINTS
3 specific pain points this company faces that an AI GTM solution addresses. Tie each to their current stage of transformation.

## SOLUTION FIT
2-3 sentences on why AI-powered GTM tooling maps precisely to this company's current priorities. Reference specific capabilities relevant to their situation.

## OUTREACH ANGLE
One specific first email hook (2-3 sentences) that references something observable about this company. Include a subject line suggestion. Avoid generic AI pitches.

## TIMING SIGNALS
Why now? 2-3 specific reasons: regulatory deadlines, budget cycles, competitive pressure, or recent events that create urgency.

## AI OPPORTUNITIES
3 concrete AI use cases that can create measurable GTM impact for this specific company right now. For each: name the use case, the specific operational problem it solves, and the business outcome it drives. Be precise — reference their actual infrastructure, products, or initiatives. Format: numbered list with **Use Case Name**: explanation.

## PROSPECTIVE CONTACTS
4 specific people at this company who are the most relevant outreach targets for AI GTM conversations. For each person include: full name, exact title, why they are the right contact, and one personalized outreach angle based on their role or recent activity. Format as a numbered list: **Full Name**, Title — reason they matter + outreach angle.

Keep every section tight — 2-4 sentences or items max per section. No filler, no restating the company name. The reader is an enterprise AE who needs actionable intelligence, not summaries. Complete ALL 8 sections.

Formatting rules:
- Use numbered lists (1. 2. 3.) for SIGNALS, PAIN POINTS, TIMING SIGNALS, AI OPPORTUNITIES, PROSPECTIVE CONTACTS
- Use bullet points (- Name, Title: description) for KEY STAKEHOLDERS
- Use plain prose for SOLUTION FIT and OUTREACH ANGLE
- Use **bold** only for the name/title of each item, not for entire sentences
- Do NOT use --- separators or horizontal rules
- Do NOT add extra headers or sub-headers within sections`;
}
