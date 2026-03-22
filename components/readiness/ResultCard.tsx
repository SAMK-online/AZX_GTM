"use client";

import { useState } from "react";
import { ScoreAnimation } from "./ScoreAnimation";
import type { TierData } from "@/types";

interface ResultCardProps {
  score: number;
  tier: TierData;
  onRetake: () => void;
}

export function ResultCard({ score, tier, onRetake }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I scored ${score}/32 on the AZX GTM Intelligence Assessment: ${tier.label}

"${tier.description}"

Take the 2-minute assessment: ${typeof window !== "undefined" ? window.location.href : ""}#readiness`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Score */}
      <div className="text-center mb-8">
        <ScoreAnimation targetScore={score} tierColor={tier.color} />
        <div
          className="mt-4 inline-block px-4 py-1.5 rounded-full font-mono text-sm font-bold tracking-widest"
          style={{
            color: tier.color,
            backgroundColor: `${tier.color}15`,
            border: `1px solid ${tier.color}40`,
          }}
        >
          {tier.label.toUpperCase()}
        </div>
      </div>

      {/* Description */}
      <div
        className="p-5 rounded-lg border mb-6"
        style={{
          borderColor: `${tier.color}30`,
          backgroundColor: `${tier.color}08`,
        }}
      >
        <p className="text-slate-300 text-base leading-relaxed italic">
          &ldquo;{tier.description}&rdquo;
        </p>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <div className="font-mono text-xs text-azx-muted uppercase tracking-widest mb-4">
          Unlock Recommendations
        </div>
        <div className="space-y-3">
          {tier.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="font-mono text-sm mt-0.5 shrink-0"
                style={{ color: tier.color }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 px-5 py-3 rounded-lg border border-azx-border font-mono text-sm
                     text-slate-300 hover:border-white/30 hover:text-white transition-colors"
        >
          {copied ? "✓ Copied to clipboard" : "⎘ Share Result"}
        </button>
        <button
          onClick={onRetake}
          className="flex-1 px-5 py-3 rounded-lg bg-azx-card border border-azx-border
                     font-mono text-sm text-azx-muted hover:text-white transition-colors"
        >
          ↺ Retake Assessment
        </button>
      </div>
    </div>
  );
}
