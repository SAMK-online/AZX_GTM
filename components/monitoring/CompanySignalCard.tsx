"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignalStream } from "@/hooks/useSignalStream";
import { UrgencyBar, UrgencyPill } from "./SignalChart";
import { parseSignals, countByUrgency } from "@/lib/signal-parser";
import {
  getCachedSignals,
  setCachedSignals,
  formatTimeAgo,
  removeTrackedCompany,
  isDefaultCompany,
  getCompanySector,
} from "@/lib/signals-store";
import type { ParsedSignal, SignalSource } from "@/types";

interface CompanySignalCardProps {
  companyName: string;
  onRemove: (name: string) => void;
  defaultExpanded?: boolean;
}

export function CompanySignalCard({ companyName, onRemove, defaultExpanded = false }: CompanySignalCardProps) {
  const { content, isStreaming, error, sources, start, reset } = useSignalStream();
  const [cachedContent, setCachedContent] = useState("");
  const [cachedSources, setCachedSources] = useState<SignalSource[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedSignal, setExpandedSignal] = useState<number | null>(null);

  const sector = getCompanySector(companyName);

  useEffect(() => {
    const cached = getCachedSignals(companyName);
    if (cached) {
      setCachedContent(cached.content);
      setCachedSources(cached.sources);
      setFetchedAt(cached.fetchedAt);
    }
  }, [companyName]);

  useEffect(() => {
    if (!isStreaming && content) {
      setCachedSignals(companyName, content, sources);
      setCachedContent(content);
      setCachedSources(sources);
      setFetchedAt(new Date().toISOString());
    }
  }, [isStreaming, content, companyName, sources]);

  const handleRefresh = useCallback(() => {
    reset();
    setIsExpanded(true);
    setExpandedSignal(null);
    start("/api/signals", { companyName });
  }, [companyName, start, reset]);

  const handleRemove = useCallback(() => {
    removeTrackedCompany(companyName);
    onRemove(companyName);
  }, [companyName, onRemove]);

  const displayContent = content || cachedContent;
  const displaySources = sources.length ? sources : cachedSources;
  const signals: ParsedSignal[] = parseSignals(displayContent);
  const counts = countByUrgency(signals);
  const hasData = signals.length > 0;

  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      isExpanded ? "border-white/15 bg-azx-card" : "border-azx-border bg-azx-card hover:border-white/10"
    }`}>
      {/* ── Header ── */}
      <div
        className="flex items-start justify-between p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className="flex items-start gap-3 min-w-0">
          {isStreaming && (
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mt-1.5 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-white">{companyName}</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-azx-border text-azx-muted tracking-widest">
                {sector.toUpperCase()}
              </span>
              {fetchedAt && !isStreaming && (
                <span className="font-mono text-[10px] text-white/25">
                  {formatTimeAgo(fetchedAt)}
                </span>
              )}
            </div>

            {/* Signal count summary */}
            {hasData && !isStreaming && (
              <div className="flex items-center gap-2 mt-1.5">
                {counts.HIGH > 0 && (
                  <span className="font-mono text-[10px] text-white font-bold">{counts.HIGH} HIGH</span>
                )}
                {counts.MED > 0 && (
                  <span className="font-mono text-[10px] text-white/50">{counts.MED} MED</span>
                )}
                {counts.LOW > 0 && (
                  <span className="font-mono text-[10px] text-white/30">{counts.LOW} LOW</span>
                )}
              </div>
            )}

            {/* Urgency bar */}
            {hasData && !isStreaming && (
              <div className="mt-2 w-40">
                <UrgencyBar signals={signals} />
              </div>
            )}

            {isStreaming && (
              <span className="font-mono text-[10px] text-white/40 mt-1 block">
                Fetching live signals...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={(e) => { e.stopPropagation(); handleRefresh(); }}
            disabled={isStreaming}
            className="font-mono text-[10px] px-2.5 py-1 rounded border border-azx-border
                       text-azx-muted hover:text-white hover:border-white/20 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isStreaming ? "..." : hasData ? "Refresh" : "Fetch"}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="font-mono text-[10px] text-azx-muted hover:text-white transition-colors px-1"
            title={isDefaultCompany(companyName) ? "Remove from monitor" : "Stop tracking"}
          >
            ✕
          </button>
          <span className="font-mono text-[10px] text-white/25">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <AnimatePresence>
        {(isExpanded || isStreaming) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-azx-border pt-4 space-y-3">
              {error && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 font-mono text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Streaming skeleton */}
              {isStreaming && !signals.length && (
                <div className="space-y-3">
                  {[80, 65, 90].map((w, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-2 rounded bg-white/10 animate-skeleton-pulse" style={{ width: `${w}%` }} />
                      <div className="h-1.5 rounded bg-white/5 animate-skeleton-pulse" style={{ width: "100%", animationDelay: `${i * 0.1}s` }} />
                      <div className="h-1.5 rounded bg-white/5 animate-skeleton-pulse" style={{ width: "85%", animationDelay: `${i * 0.15}s` }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Parsed signal cards */}
              {signals.map((signal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-lg border p-3 cursor-pointer transition-colors duration-150 ${
                    signal.urgency === "HIGH"
                      ? "border-white/20 bg-white/[0.03] hover:bg-white/[0.05]"
                      : signal.urgency === "MED"
                      ? "border-white/10 bg-white/[0.015] hover:bg-white/[0.03]"
                      : "border-azx-border hover:border-white/10"
                  }`}
                  onClick={() => setExpandedSignal(expandedSignal === i ? null : i)}
                >
                  <div className="flex items-start gap-2.5">
                    <UrgencyPill urgency={signal.urgency} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-mono text-xs font-semibold leading-snug ${
                        signal.urgency === "HIGH" ? "text-white" : signal.urgency === "MED" ? "text-white/75" : "text-white/50"
                      }`}>
                        {signal.headline}
                      </p>

                      <AnimatePresence>
                        {expandedSignal === i && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-slate-400 text-xs leading-relaxed mt-2 overflow-hidden"
                          >
                            {signal.body}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="font-mono text-[9px] text-white/20 shrink-0 mt-0.5">
                      {expandedSignal === i ? "▲" : "▼"}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Empty state */}
              {!isStreaming && !hasData && !error && (
                <div className="text-center py-6 font-mono text-xs text-azx-muted tracking-widest">
                  NO SIGNALS YET — CLICK FETCH
                </div>
              )}

              {/* Sources */}
              {displaySources.length > 0 && !isStreaming && (
                <div className="pt-2 border-t border-azx-border space-y-1">
                  <div className="font-mono text-[9px] text-white/25 tracking-widest uppercase mb-1.5">
                    Sources
                  </div>
                  {displaySources.slice(0, 5).map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block font-mono text-[10px] text-azx-muted hover:text-white/70 transition-colors truncate"
                    >
                      → {src.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
