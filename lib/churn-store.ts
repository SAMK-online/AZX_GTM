import type { ChurnAnalysisResult } from "@/types";

const KEY = "gtm-churn-analysis";

export interface ChurnSession {
  result: ChurnAnalysisResult;
  fileName: string;
  nameCol: string;
  adoptionCol: string;
  conversionCol: string;
  adoptionThresh: number;
  conversionThresh: number;
  analyzedAt: string; // ISO string
}

export function getChurnSession(): ChurnSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChurnSession) : null;
  } catch {
    return null;
  }
}

export function saveChurnSession(session: ChurnSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Storage full — fail silently
  }
}

export function clearChurnSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
