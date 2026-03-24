"use client";

import { useState } from "react";
import { MarkdownText } from "@/components/ui/MarkdownText";
import { useSignalStream } from "@/hooks/useSignalStream";

type InputMode = "url" | "text";

const FEATURED_NEWSLETTERS = [
  {
    name: "Utility Dive",
    tag: "Utilities",
    url: "https://www.utilitydive.com/",
    desc: "Daily utility & energy sector news",
  },
  {
    name: "TLDR AI",
    tag: "AI",
    url: "https://tldr.tech/ai",
    desc: "Top AI research & product stories",
  },
  {
    name: "Axios Generate",
    tag: "Energy & Climate",
    url: "https://www.axios.com/newsletters/axios-generate",
    desc: "Energy transition & climate policy",
  },
  {
    name: "The Rundown AI",
    tag: "AI",
    url: "https://www.therundown.ai/",
    desc: "AI news for enterprise teams",
  },
  {
    name: "Morning Brew",
    tag: "Business",
    url: "https://www.morningbrew.com/daily",
    desc: "Business & markets daily brief",
  },
  {
    name: "Wood Mackenzie",
    tag: "Energy Markets",
    url: "https://www.woodmac.com/news/",
    desc: "Energy & commodity market intelligence",
  },
];

export function NewsletterTab() {
  const [mode, setMode] = useState<InputMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const { content, isStreaming, error, start, reset } = useSignalStream();

  const runParse = (url: string) => {
    reset();
    setMode("url");
    setUrlInput(url);
    start("/api/newsletter", { url });
  };

  const handlePreset = (newsletter: typeof FEATURED_NEWSLETTERS[0]) => {
    setActivePreset(newsletter.name);
    runParse(newsletter.url);
  };

  const handleParse = () => {
    if (mode === "url" && !urlInput.trim()) return;
    if (mode === "text" && textInput.trim().length < 50) return;
    setActivePreset(null);
    reset();
    const payload =
      mode === "url"
        ? { url: urlInput.trim() }
        : { text: textInput.trim() };
    start("/api/newsletter", payload);
  };

  const canSubmit = mode === "url"
    ? urlInput.trim().length > 0 && !isStreaming
    : textInput.trim().length >= 50 && !isStreaming;

  return (
    <div className="space-y-5">

      {/* ── Featured newsletters ── */}
      <div>
        <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-3">
          Quick Parse · Popular Newsletters
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {FEATURED_NEWSLETTERS.map((nl) => (
            <button
              key={nl.name}
              onClick={() => handlePreset(nl)}
              disabled={isStreaming}
              className={`text-left p-3 rounded-lg border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                activePreset === nl.name && isStreaming
                  ? "border-white/30 bg-white/5"
                  : "border-azx-border bg-azx-card hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-mono text-xs font-bold text-white leading-tight">{nl.name}</span>
                {activePreset === nl.name && isStreaming && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0 mt-0.5" />
                )}
              </div>
              <div className="font-mono text-[9px] text-white/30 tracking-widest mb-1">{nl.tag.toUpperCase()}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{nl.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-azx-border" />
        <span className="font-mono text-[10px] text-white/20 tracking-widest">OR USE YOUR OWN</span>
        <div className="flex-1 h-px bg-azx-border" />
      </div>

      {/* ── Mode toggle ── */}
      <div className="flex items-center gap-1 p-1 rounded-lg border border-azx-border bg-azx-card w-fit">
        {(["url", "text"] as InputMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); setActivePreset(null); }}
            className={`px-4 py-1.5 rounded-md font-mono text-xs transition-colors ${
              mode === m
                ? "bg-white text-black"
                : "text-azx-muted hover:text-white"
            }`}
          >
            {m === "url" ? "◈ Paste URL" : "≡ Paste Text"}
          </button>
        ))}
      </div>

      {/* ── Custom input ── */}
      {mode === "url" ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setActivePreset(null); }}
            onKeyDown={(e) => e.key === "Enter" && canSubmit && handleParse()}
            placeholder="https://newsletter.substack.com/p/..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-azx-border bg-azx-dark
                       font-mono text-sm text-white placeholder:text-azx-muted
                       focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            onClick={handleParse}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-lg bg-white text-black font-mono text-sm font-bold
                       hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isStreaming && !activePreset ? "Parsing..." : "Parse →"}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste newsletter content here (min 50 characters)..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-azx-border bg-azx-dark
                       font-mono text-sm text-white placeholder:text-azx-muted resize-none
                       focus:outline-none focus:border-white/30 transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-azx-muted">
              {textInput.length} chars{textInput.length < 50 && textInput.length > 0 && " · need 50+"}
            </span>
            <button
              onClick={handleParse}
              disabled={!canSubmit}
              className="px-5 py-2 rounded-lg bg-white text-black font-mono text-sm font-bold
                         hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStreaming ? "Parsing..." : "Parse →"}
            </button>
          </div>
        </div>
      )}

      {/* ── Output ── */}
      {error && (
        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      {(content || isStreaming) && (
        <div className="rounded-xl border border-white/10 bg-azx-card p-5">
          {activePreset && isStreaming && !content && (
            <div className="flex items-center gap-2 font-mono text-xs text-azx-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Extracting GTM intelligence from {activePreset}...
            </div>
          )}
          {isStreaming && !content && !activePreset && (
            <div className="flex items-center gap-2 font-mono text-xs text-azx-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Extracting GTM intelligence...
            </div>
          )}
          {content && (
            <MarkdownText text={content} isActive={isStreaming} />
          )}
        </div>
      )}

      {!content && !isStreaming && !error && (
        <div className="rounded-xl border border-azx-border bg-azx-card/50 p-8 text-center">
          <div className="font-mono text-[10px] text-azx-muted tracking-widest mb-2">
            NEWSLETTER INTELLIGENCE
          </div>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Click any newsletter above for a one-click parse, or bring your own URL or text.
            Claude extracts companies signaling buying intent, market trends, and AZX actions.
          </p>
        </div>
      )}
    </div>
  );
}
