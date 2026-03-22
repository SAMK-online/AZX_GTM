"use client";

import { useMemo } from "react";
import { BriefSectionCard } from "./BriefSectionCard";
import type { SectionKey } from "@/types";

const SECTION_ORDER: SectionKey[] = [
  "SIGNALS",
  "KEY_STAKEHOLDERS",
  "PAIN_POINTS",
  "AZX_FIT",
  "OUTREACH_ANGLE",
  "TIMING_SIGNALS",
  "AZX_AI_OPPORTUNITIES",
  "PROSPECTIVE_CONTACTS",
];

const HEADER_MAP: Record<string, SectionKey> = {
  SIGNALS: "SIGNALS",
  "KEY STAKEHOLDERS": "KEY_STAKEHOLDERS",
  "PAIN POINTS": "PAIN_POINTS",
  "AZX FIT": "AZX_FIT",
  "OUTREACH ANGLE": "OUTREACH_ANGLE",
  "TIMING SIGNALS": "TIMING_SIGNALS",
  "AZX AI OPPORTUNITIES": "AZX_AI_OPPORTUNITIES",
  "PROSPECTIVE CONTACTS": "PROSPECTIVE_CONTACTS",
};

function parseSections(
  text: string
): Record<SectionKey, { content: string; isComplete: boolean }> {
  const result: Record<SectionKey, { content: string; isComplete: boolean }> =
    {} as Record<SectionKey, { content: string; isComplete: boolean }>;

  // Initialize all sections as empty
  for (const key of SECTION_ORDER) {
    result[key] = { content: "", isComplete: false };
  }

  // Prepend \n so the first ## header is always captured by the split
  const parts = ("\n" + text).split(/\n##\s+/);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const newlineIdx = part.indexOf("\n");
    if (newlineIdx === -1) {
      // Header arrived but no content yet
      const headerRaw = part.trim().toUpperCase();
      const key = HEADER_MAP[headerRaw];
      if (key) result[key] = { content: "", isComplete: false };
      continue;
    }

    const headerRaw = part.slice(0, newlineIdx).trim().toUpperCase();
    const content = part.slice(newlineIdx + 1).trim();
    const key = HEADER_MAP[headerRaw];

    if (key) {
      // All previous sections are complete if we've moved past them
      const isLast = i === parts.length - 1;
      result[key] = { content, isComplete: !isLast };
    }
  }

  return result;
}

interface ProspectStreamProps {
  streamContent: string;
  isStreaming: boolean;
  isComplete: boolean;
}

export function ProspectStream({
  streamContent,
  isStreaming,
  isComplete,
}: ProspectStreamProps) {
  const sections = useMemo(
    () => parseSections(streamContent),
    [streamContent]
  );

  // Determine which section is currently active (last one with content that isn't complete)
  const activeSection = useMemo<SectionKey | null>(() => {
    if (!isStreaming) return null;
    for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
      const key = SECTION_ORDER[i];
      if (sections[key].content.length > 0 && !sections[key].isComplete) {
        return key;
      }
    }
    return null;
  }, [sections, isStreaming]);

  const FULL_WIDTH_SECTIONS: SectionKey[] = ["AZX_AI_OPPORTUNITIES", "PROSPECTIVE_CONTACTS"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {SECTION_ORDER.map((key) => {
        const { content, isComplete: sectionComplete } = sections[key];
        const isEmpty = content.length === 0 && key !== activeSection;
        const isFullWidth = FULL_WIDTH_SECTIONS.includes(key);

        return (
          <div key={key} className={isFullWidth ? "md:col-span-2" : ""}>
            <BriefSectionCard
              sectionKey={key}
              content={content}
              isActive={activeSection === key}
              isComplete={sectionComplete || (isComplete && content.length > 0)}
              isEmpty={isEmpty && !isStreaming ? false : isEmpty}
            />
          </div>
        );
      })}
    </div>
  );
}
