import type { ParsedSignal, SignalUrgency } from "@/types";

export function parseSignals(text: string): ParsedSignal[] {
  if (!text) return [];
  const signals: ParsedSignal[] = [];
  const parts = ("\n" + text).split(/\n##\s+/);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const newlineIdx = part.indexOf("\n");
    if (newlineIdx === -1) continue;

    const header = part.slice(0, newlineIdx).trim();
    const body = part.slice(newlineIdx + 1).trim();

    const match = header.match(/^\[(HIGH|MED|LOW)\]\s+(.+)$/i);
    if (!match) continue;

    signals.push({
      urgency: match[1].toUpperCase() as SignalUrgency,
      headline: match[2].trim(),
      body,
    });
  }
  return signals;
}

export function countByUrgency(
  signals: ParsedSignal[]
): Record<SignalUrgency, number> {
  return signals.reduce(
    (acc, s) => {
      acc[s.urgency] = (acc[s.urgency] ?? 0) + 1;
      return acc;
    },
    { HIGH: 0, MED: 0, LOW: 0 } as Record<SignalUrgency, number>
  );
}

/**
 * Signal intensity score 0–100.
 * HIGH=100pts, MED=60pts, LOW=30pts, averaged.
 */
export function getSignalIntensity(signals: ParsedSignal[]): number {
  if (!signals.length) return 0;
  const total = signals.reduce((acc, s) => {
    return acc + (s.urgency === "HIGH" ? 100 : s.urgency === "MED" ? 60 : 30);
  }, 0);
  return Math.round(total / signals.length);
}
