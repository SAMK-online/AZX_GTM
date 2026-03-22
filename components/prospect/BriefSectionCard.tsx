"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownText } from "@/components/ui/MarkdownText";
import type { SectionKey } from "@/types";

const SECTION_META: Record<
  SectionKey,
  { label: string; icon: string; color: string }
> = {
  SIGNALS: { label: "Signals", icon: "◎", color: "rgba(255,255,255,0.9)" },
  KEY_STAKEHOLDERS: { label: "Key Stakeholders", icon: "◈", color: "rgba(255,255,255,0.75)" },
  PAIN_POINTS: { label: "Pain Points", icon: "⚡", color: "rgba(255,255,255,0.9)" },
  AZX_FIT: { label: "AZX Fit", icon: "◎", color: "rgba(255,255,255,0.75)" },
  OUTREACH_ANGLE: { label: "Outreach Angle", icon: "✦", color: "rgba(255,255,255,0.9)" },
  TIMING_SIGNALS: { label: "Timing Signals", icon: "◷", color: "rgba(255,255,255,0.75)" },
  AZX_AI_OPPORTUNITIES: { label: "AZX AI Opportunities", icon: "⬡", color: "rgba(255,255,255,0.9)" },
  PROSPECTIVE_CONTACTS: { label: "Prospective Contacts", icon: "◈", color: "rgba(255,255,255,0.75)" },
};

interface BriefSectionCardProps {
  sectionKey: SectionKey;
  content: string;
  isActive: boolean;
  isComplete: boolean;
  isEmpty: boolean;
}

export function BriefSectionCard({
  sectionKey,
  content,
  isActive,
  isComplete,
  isEmpty,
}: BriefSectionCardProps) {
  const [copied, setCopied] = useState(false);
  const meta = SECTION_META[sectionKey];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all duration-500 min-h-[160px]",
        "bg-azx-card",
        isEmpty && "border-azx-border animate-skeleton-pulse",
        isActive && "border-white/30 animate-glow-pulse",
        isComplete && "border-azx-border/60"
      )}
      style={
        isActive
          ? { boxShadow: `0 0 16px ${meta.color}30` }
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ color: meta.color }} className="text-sm">
            {meta.icon}
          </span>
          <span className="font-mono text-xs tracking-widest uppercase text-azx-muted">
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: meta.color }}
            />
          )}
          {isComplete && (
            <button
              onClick={handleCopy}
              className="text-azx-muted hover:text-white transition-colors text-xs font-mono"
              title="Copy section"
            >
              {copied ? "✓ copied" : "⎘ copy"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="space-y-2">
          {[80, 60, 90].map((w, i) => (
            <div
              key={i}
              className="h-2 rounded bg-azx-border"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ) : (
        <MarkdownText text={content} isActive={isActive} />
      )}
    </div>
  );
}
