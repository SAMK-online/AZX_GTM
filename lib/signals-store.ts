import type { SignalCache, SignalCacheEntry, SignalSource } from "@/types";
import { getContacts } from "./outreach-store";

const SIGNALS_CACHE_KEY = "azx-signals-cache";
const TRACKED_COMPANIES_KEY = "azx-tracked-companies";
const DISMISSED_DEFAULTS_KEY = "azx-dismissed-defaults";

// AZX's known category-leader customers — always pre-seeded
export const DEFAULT_COMPANIES: { name: string; sector: string }[] = [
  { name: "CBRE", sector: "Real Estate" },
  { name: "LevelTen Energy", sector: "Energy" },
  { name: "Flexe", sector: "Logistics" },
  { name: "Puget Sound Energy", sector: "Utilities" },
];

const SECTOR_MAP: Record<string, string> = Object.fromEntries(
  DEFAULT_COMPANIES.map((c) => [c.name.toLowerCase(), c.sector])
);

export function getCompanySector(name: string): string {
  return SECTOR_MAP[name.toLowerCase()] ?? "Enterprise";
}

export function isDefaultCompany(name: string): boolean {
  return DEFAULT_COMPANIES.some((c) => c.name.toLowerCase() === name.toLowerCase());
}

function getDismissedDefaults(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISMISSED_DEFAULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function dismissDefaultCompany(name: string): void {
  if (typeof window === "undefined") return;
  const dismissed = getDismissedDefaults();
  if (!dismissed.some((d) => d.toLowerCase() === name.toLowerCase())) {
    localStorage.setItem(DISMISSED_DEFAULTS_KEY, JSON.stringify([...dismissed, name]));
  }
}

export function getSignalCache(): SignalCache {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SIGNALS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCachedSignals(companyName: string): SignalCacheEntry | null {
  const cache = getSignalCache();
  return cache[companyName.toLowerCase()] ?? null;
}

export function setCachedSignals(
  companyName: string,
  content: string,
  sources: SignalSource[]
): void {
  if (typeof window === "undefined") return;
  const cache = getSignalCache();
  cache[companyName.toLowerCase()] = {
    content,
    fetchedAt: new Date().toISOString(),
    sources,
  };
  localStorage.setItem(SIGNALS_CACHE_KEY, JSON.stringify(cache));
}

export function getManuallyTracked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRACKED_COMPANIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTrackedCompany(name: string): void {
  if (typeof window === "undefined") return;
  const existing = getManuallyTracked();
  const normalized = name.trim();
  if (!existing.some((c) => c.toLowerCase() === normalized.toLowerCase())) {
    localStorage.setItem(TRACKED_COMPANIES_KEY, JSON.stringify([...existing, normalized]));
  }
}

export function removeTrackedCompany(name: string): void {
  if (typeof window === "undefined") return;
  // If it's a default, dismiss it; otherwise remove from manual list
  if (isDefaultCompany(name)) {
    dismissDefaultCompany(name);
  } else {
    const updated = getManuallyTracked().filter(
      (c) => c.toLowerCase() !== name.toLowerCase()
    );
    localStorage.setItem(TRACKED_COMPANIES_KEY, JSON.stringify(updated));
  }
}

/**
 * Returns all companies to monitor:
 * defaults (unless dismissed) + outreach contacts + manually tracked, deduplicated.
 */
export function getAllTrackedCompanies(): string[] {
  const dismissed = getDismissedDefaults().map((d) => d.toLowerCase());

  const all: string[] = [];
  const seen = new Set<string>();

  const add = (name: string) => {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      all.push(name);
    }
  };

  // 1. Default AZX customers (unless dismissed)
  for (const { name } of DEFAULT_COMPANIES) {
    if (!dismissed.includes(name.toLowerCase())) add(name);
  }

  // 2. Companies from outreach contacts
  for (const c of getContacts()) add(c.company);

  // 3. Manually tracked
  for (const name of getManuallyTracked()) add(name);

  return all;
}

export function isManuallyTracked(name: string): boolean {
  return getManuallyTracked().some((c) => c.toLowerCase() === name.toLowerCase());
}

export function isFromContacts(name: string): boolean {
  return getContacts().some((c) => c.company.toLowerCase() === name.toLowerCase());
}

export function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
