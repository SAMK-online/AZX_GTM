"use client";

import { motion } from "framer-motion";
import type { ParsedSignal, SignalUrgency } from "@/types";
import { countByUrgency, getSignalIntensity } from "@/lib/signal-parser";

interface UrgencyBarProps {
  signals: ParsedSignal[];
  animate?: boolean;
}

/** Horizontal stacked bar: HIGH (bright) / MED (mid) / LOW (dim) */
export function UrgencyBar({ signals, animate = true }: UrgencyBarProps) {
  const counts = countByUrgency(signals);
  const total = signals.length;
  if (!total) return null;

  const allSegments: { urgency: SignalUrgency; pct: number; bg: string }[] = [
    { urgency: "HIGH" as SignalUrgency, pct: (counts.HIGH / total) * 100, bg: "bg-white" },
    { urgency: "MED"  as SignalUrgency, pct: (counts.MED  / total) * 100, bg: "bg-white/45" },
    { urgency: "LOW"  as SignalUrgency, pct: (counts.LOW  / total) * 100, bg: "bg-white/18" },
  ];
  const segments = allSegments.filter((s) => s.pct > 0);

  return (
    <div className="flex h-1 rounded-full overflow-hidden gap-px">
      {segments.map(({ urgency, pct, bg }) => (
        <motion.div
          key={urgency}
          className={`h-full ${bg}`}
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: urgency === "HIGH" ? 0.1 : urgency === "MED" ? 0.2 : 0.3 }}
          style={animate ? undefined : { width: `${pct}%` }}
        />
      ))}
    </div>
  );
}

interface IntensityBarProps {
  signals: ParsedSignal[];
  label?: string;
  showScore?: boolean;
}

/** Single horizontal intensity bar for cross-company comparison */
export function IntensityBar({ signals, label, showScore = true }: IntensityBarProps) {
  const score = getSignalIntensity(signals);
  const counts = countByUrgency(signals);

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="font-mono text-[11px] text-white/70 w-36 truncate shrink-0">{label}</span>
      )}
      <div className="flex-1 h-1.5 rounded-full bg-azx-border overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showScore && (
        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
          {counts.HIGH > 0 && <span className="text-white">{counts.HIGH}H</span>}
          {counts.MED  > 0 && <span className="text-white/50">{counts.MED}M</span>}
          {counts.LOW  > 0 && <span className="text-white/30">{counts.LOW}L</span>}
          {!signals.length && <span className="text-azx-muted">—</span>}
        </div>
      )}
    </div>
  );
}

interface UrgencyPillProps {
  urgency: SignalUrgency;
}

export function UrgencyPill({ urgency }: UrgencyPillProps) {
  const styles: Record<SignalUrgency, string> = {
    HIGH: "bg-white text-black font-bold",
    MED:  "border border-white/30 text-white/60",
    LOW:  "border border-azx-border text-azx-muted",
  };
  return (
    <span className={`inline-block font-mono text-[9px] px-1.5 py-0.5 rounded tracking-widest ${styles[urgency]}`}>
      {urgency}
    </span>
  );
}

interface ComparisonChartProps {
  data: { name: string; signals: ParsedSignal[] }[];
}

/** Cross-company signal intensity comparison chart */
export function ComparisonChart({ data }: ComparisonChartProps) {
  const maxScore = Math.max(...data.map((d) => getSignalIntensity(d.signals)), 1);

  return (
    <div className="rounded-xl border border-azx-border bg-azx-card p-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
          Signal Intensity · All Accounts
        </span>
        <span className="font-mono text-[9px] text-white/20">HIGH · MED · LOW</span>
      </div>

      {data.map(({ name, signals }, i) => {
        const score = getSignalIntensity(signals);
        const counts = countByUrgency(signals);
        const relativePct = maxScore > 0 ? (score / maxScore) * 100 : 0;

        return (
          <div key={name} className="flex items-center gap-3">
            <div className="w-36 shrink-0">
              <div className="font-mono text-[11px] text-white/80 truncate">{name}</div>
              <div className="font-mono text-[9px] text-azx-muted">{signals.length ? `${signals.length} signals` : "no data"}</div>
            </div>

            <div className="flex-1 flex items-center gap-px h-5">
              {/* Stacked segment bar */}
              <div className="flex-1 flex h-2 rounded-full overflow-hidden gap-px bg-azx-border">
                {counts.HIGH > 0 && (
                  <motion.div
                    className="bg-white h-full"
                    initial={{ flex: 0 }}
                    animate={{ flex: counts.HIGH }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  />
                )}
                {counts.MED > 0 && (
                  <motion.div
                    className="bg-white/40 h-full"
                    initial={{ flex: 0 }}
                    animate={{ flex: counts.MED }}
                    transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                  />
                )}
                {counts.LOW > 0 && (
                  <motion.div
                    className="bg-white/15 h-full"
                    initial={{ flex: 0 }}
                    animate={{ flex: counts.LOW }}
                    transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                  />
                )}
                {!signals.length && (
                  <div className="flex-1 h-full bg-azx-border/50 rounded-full" />
                )}
              </div>
            </div>

            {/* Score */}
            <div className="w-8 text-right font-mono text-[10px] text-white/40 shrink-0">
              {signals.length ? score : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
