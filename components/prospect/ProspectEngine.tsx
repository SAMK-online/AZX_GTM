"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingPulse } from "@/components/ui/LoadingPulse";
import { ProspectInput } from "./ProspectInput";
import { ProspectStream } from "./ProspectStream";
import { useProspectStream } from "@/hooks/useProspectStream";
import { parseContactsFromText, addContacts } from "@/lib/outreach-store";
import type { Industry } from "@/types";

// Re-use the same section parser logic to extract section content
function extractSection(text: string, sectionHeader: string): string {
  const normalized = "\n" + text;
  const parts = normalized.split(/\n##\s+/);
  for (const part of parts) {
    const newlineIdx = part.indexOf("\n");
    if (newlineIdx === -1) continue;
    const header = part.slice(0, newlineIdx).trim().toUpperCase();
    if (header === sectionHeader) {
      return part.slice(newlineIdx + 1).trim();
    }
  }
  return "";
}

export function ProspectEngine() {
  const {
    streamContent,
    isStreaming,
    isComplete,
    loadingPhase,
    error,
    isGrounded,
    startStream,
    resetStream,
  } = useProspectStream();

  const [currentCompany, setCurrentCompany] = useState("");
  const [contactsSaved, setContactsSaved] = useState(0);

  const handleSubmit = (company: string, industry: Industry) => {
    setCurrentCompany(company);
    setContactsSaved(0);
    startStream(company, industry);
  };

  // When brief completes, parse and save contacts
  useEffect(() => {
    if (!isComplete || !streamContent || !currentCompany) return;

    const contactsText = extractSection(streamContent, "PROSPECTIVE CONTACTS");
    if (!contactsText) return;

    const briefContext = {
      signals: extractSection(streamContent, "SIGNALS"),
      painPoints: extractSection(streamContent, "PAIN POINTS"),
      solutionFit: extractSection(streamContent, "SOLUTION FIT"),
    };

    const parsed = parseContactsFromText(contactsText, currentCompany, briefContext);
    if (parsed.length > 0) {
      addContacts(parsed);
      setContactsSaved(parsed.length);
    }
  }, [isComplete, streamContent, currentCompany]);

  const isActive = isStreaming || loadingPhase !== "idle";

  return (
    <section id="prospect" className="section-anchor px-6 py-16 max-w-6xl mx-auto">

      <ProspectInput onSubmit={handleSubmit} isDisabled={isActive} />

      {/* Loading state */}
      {isActive && !streamContent && (
        <div className="mt-8 flex flex-col gap-3">
          {loadingPhase === "searching" && (
            <LoadingPulse message="Searching live signals..." />
          )}
          {loadingPhase === "synthesizing" && (
            <LoadingPulse message="Synthesizing intelligence brief..." />
          )}
        </div>
      )}

      {/* Two-phase indicator (while streaming) */}
      {isStreaming && streamContent && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-azx-muted">
            <span className="text-white/50">✓</span>
            <span>Live signals retrieved</span>
            {isGrounded && (
              <span className="ml-2 px-2 py-0.5 rounded bg-white/5 border border-white/15 text-white/50">
                web-grounded
              </span>
            )}
          </div>
          <div className="h-px flex-1 bg-azx-border" />
          <LoadingPulse message="Synthesizing..." />
        </div>
      )}

      {/* Grounding badge on complete */}
      {isComplete && isGrounded && (
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-azx-muted">
          <span className="text-white/50">✓</span>
          <span>Grounded with live web search</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/15 text-white/50">
            Tavily + Claude
          </span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mt-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm">
          {error}
        </div>
      )}

      {/* Stream output */}
      {(streamContent || isStreaming) && (
        <ProspectStream
          streamContent={streamContent}
          isStreaming={isStreaming}
          isComplete={isComplete}
        />
      )}

      {/* Post-completion actions */}
      {isComplete && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setContactsSaved(0); resetStream(); }}
            className="px-5 py-2 rounded-lg border border-azx-border text-azx-muted font-mono text-sm
                       hover:border-white/30 hover:text-white transition-colors duration-200"
          >
            ← New Company
          </button>

          {contactsSaved > 0 && (
            <Link
              href="/outreach"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black font-mono text-sm font-bold
                         hover:bg-white/90 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              {contactsSaved} contacts added → Open Outreach Builder
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
