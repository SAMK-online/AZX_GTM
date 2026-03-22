import type { QuizQuestion, TierData } from "@/types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "Prospect Identification",
    text: "How does your sales team currently identify high-intent prospects?",
    options: [
      { label: "Rep intuition and relationship networks", score: 1 },
      { label: "Basic CRM activity and lead scoring", score: 2 },
      { label: "Intent data tools combined with manual review", score: 3 },
      { label: "Automated signal scoring with AI prioritization", score: 4 },
    ],
  },
  {
    id: 2,
    category: "Outreach Personalization",
    text: "How personalized is your outbound outreach today?",
    options: [
      { label: "Same message with name/company swap", score: 1 },
      { label: "Light persona-based customization by segment", score: 2 },
      { label: "Reps manually research and write custom first lines", score: 3 },
      { label: "AI generates hyper-personalized sequences from live research", score: 4 },
    ],
  },
  {
    id: 3,
    category: "Competitive Intelligence",
    text: "How does your team use competitive intelligence?",
    options: [
      { label: "Tribal knowledge — reps know competitors informally", score: 1 },
      { label: "Static battle cards updated quarterly", score: 2 },
      { label: "Dynamic battle cards updated monthly from win/loss data", score: 3 },
      { label: "Real-time AI-synthesized competitive positioning", score: 4 },
    ],
  },
  {
    id: 4,
    category: "Trigger Response Speed",
    text: "How quickly can your GTM team respond to a trigger event (funding round, exec hire, etc.)?",
    options: [
      { label: "Days to weeks", score: 1 },
      { label: "Same day if a rep catches it", score: 2 },
      { label: "Hours, via alert tools", score: 3 },
      { label: "Minutes, via automated workflow", score: 4 },
    ],
  },
  {
    id: 5,
    category: "Revenue Attribution",
    text: "How mature is your revenue attribution model?",
    options: [
      { label: "Last-touch only", score: 1 },
      { label: "First/last touch with some middle-touch", score: 2 },
      { label: "Multi-touch with manual analysis", score: 3 },
      { label: "AI-powered attribution with predictive modeling", score: 4 },
    ],
  },
  {
    id: 6,
    category: "Content Personalization",
    text: "How does content get personalized for different buyer personas?",
    options: [
      { label: "One deck for everything", score: 1 },
      { label: "Segment-level versions (industry/size)", score: 2 },
      { label: "Role-based versions created manually", score: 3 },
      { label: "Dynamic content assembly based on account data", score: 4 },
    ],
  },
  {
    id: 7,
    category: "Conversation Intelligence",
    text: "How does your team learn from sales conversations?",
    options: [
      { label: "Manager reviews some calls occasionally", score: 1 },
      { label: "Conversation recording with manual review", score: 2 },
      { label: "Structured call review with coaching frameworks", score: 3 },
      { label: "AI analyzes all calls, surfaces patterns, auto-coaches", score: 4 },
    ],
  },
  {
    id: 8,
    category: "Stack Integration",
    text: "How integrated is your GTM tech stack?",
    options: [
      { label: "Siloed tools, lots of manual data entry", score: 1 },
      { label: "Some integrations but data sync is unreliable", score: 2 },
      { label: "Core stack integrated with some gaps", score: 3 },
      { label: "Fully connected, real-time bidirectional data flows", score: 4 },
    ],
  },
];

export const TIER_DATA: TierData[] = [
  {
    tier: 1,
    label: "Manual Operator",
    color: "#FF4444",
    description:
      "Your target account's GTM motion is people-powered and relationship-driven. That's a foundation — but in competitive markets with 10x more accounts to cover, it's a ceiling. The unlock is instrumenting what their best reps do naturally.",
    recommendations: [
      "Implement an intent data layer to surface in-market accounts automatically",
      "Deploy AI-assisted outreach to scale personalization without adding headcount",
      "Build basic signal alerting for trigger events (exec hires, funding, news)",
    ],
  },
  {
    tier: 2,
    label: "Emerging Stack",
    color: "#FF8C42",
    description:
      "They've made the right early bets on technology, but the tools aren't talking to each other yet. Fragmented data means AI investments can't compound. The unlock is orchestration.",
    recommendations: [
      "Unify the data layer — CRM, intent, and engagement data in one place",
      "Automate cross-tool workflows to eliminate manual handoffs between systems",
      "Add AI personalization at scale to close the gap between tech spend and output",
    ],
  },
  {
    tier: 3,
    label: "AI-Assisted",
    color: "#FFD700",
    description:
      "They're using AI as a co-pilot. The next step is making it the engine — shifting from AI that augments rep effort to AI that generates qualified pipeline autonomously.",
    recommendations: [
      "Close attribution gaps to understand which AI-driven motions actually drive revenue",
      "Deploy autonomous prospecting to identify and engage accounts without rep initiation",
      "Build feedback loops so model outputs improve from every closed deal and lost opportunity",
    ],
  },
  {
    tier: 4,
    label: "AI-Native GTM",
    color: "#00D4FF",
    description:
      "Your target account is operating at the frontier. The question isn't whether they use AI — it's whether they're capturing the proprietary data those AI systems produce. That data is the next competitive moat. Are they building it, or feeding someone else's model?",
    recommendations: [
      "Map what proprietary data their AI stack generates today — and where it's leaking to vendors",
      "Identify gaps in the feedback loop between sales outcomes and model retraining",
      "Build the case for a unified data layer before the next budget cycle locks spend",
    ],
  },
];

export function getTierForScore(score: number): TierData {
  if (score <= 13) return TIER_DATA[0];
  if (score <= 19) return TIER_DATA[1];
  if (score <= 25) return TIER_DATA[2];
  return TIER_DATA[3];
}
