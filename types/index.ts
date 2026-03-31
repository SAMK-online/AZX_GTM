// ── Prospect Intelligence Engine ──────────────────────────────────────────

export type SectionKey =
  | "SIGNALS"
  | "KEY_STAKEHOLDERS"
  | "PAIN_POINTS"
  | "SOLUTION_FIT"
  | "OUTREACH_ANGLE"
  | "TIMING_SIGNALS"
  | "AI_OPPORTUNITIES"
  | "PROSPECTIVE_CONTACTS";

export type Industry =
  | "Energy & Utilities"
  | "Industrial"
  | "Finance"
  | "Healthcare"
  | "General";

export interface BriefSection {
  key: SectionKey;
  content: string;
  isActive: boolean;
  isComplete: boolean;
}

export type LoadingPhase = "idle" | "searching" | "synthesizing";

// ── GTM Architecture Diagram ──────────────────────────────────────────────

export interface GTMNode {
  id: string;
  label: string;
  layer: number;
  x: number;
  y: number;
  purpose: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  platformRole: string;
  color: string;
}

export interface GTMEdge {
  id: string;
  from: string;
  to: string;
  animated: boolean;
}

// ── AI Readiness Quiz ────────────────────────────────────────────────────

export interface QuizOption {
  label: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  category: string;
  text: string;
  options: QuizOption[];
}

export type QuizPhase = "idle" | "question" | "calculating" | "result";

export interface TierData {
  tier: number;
  label: string;
  color: string;
  description: string;
  recommendations: string[];
}

// ── Outreach Builder ─────────────────────────────────────────────────────────

export interface OutreachContact {
  id: string;
  name: string;
  title: string;
  company: string;
  description: string; // full line from PROSPECTIVE_CONTACTS
  addedAt: string;
  briefContext: {
    signals: string;
    painPoints: string;
    solutionFit: string;
  };
}

export type OutreachMessageType = "email" | "linkedin";

// ── Signal Monitor ────────────────────────────────────────────────────────

export interface SignalSource {
  title: string;
  url: string;
}

export interface SignalCacheEntry {
  content: string;
  fetchedAt: string;
  sources: SignalSource[];
}

export type SignalCache = Record<string, SignalCacheEntry>;

export type SignalUrgency = "HIGH" | "MED" | "LOW";

export interface ParsedSignal {
  urgency: SignalUrgency;
  headline: string;
  body: string;
}

// ── Churn Risk Analyzer ───────────────────────────────────────────────────

export type ChurnRiskLevel = "HIGH" | "LOW" | "WELL_PERFORMING";

export interface ChurnClient {
  riskLevel: ChurnRiskLevel;
  riskScore: number;
  reasoning: string;
  [key: string]: string | number;
}

export interface ChurnAnalysisResult {
  analyzed: ChurnClient[];
  summary: {
    highRisk: number;
    lowRisk: number;
    wellPerforming: number;
  };
}
