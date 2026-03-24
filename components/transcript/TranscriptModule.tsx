"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Zap, RotateCcw } from "lucide-react";
import { PersonCard, type Person } from "./PersonCard";

const DEMO_TRANSCRIPT = `MEETING: Q2 GTM Strategy & Account Expansion Planning
DATE: March 24, 2026 | TIME: 10:00 AM – 11:18 AM PST
ATTENDEES: Sarah Chen (VP Sales), Marcus Rivera (Head of Partnerships), Priya Patel (Marketing Manager), Jordan Kim (Business Development Rep), Alex Torres (Customer Success Manager)

SARAH CHEN: Good morning everyone. Q1 closed at 112% of quota — strong. But Q2 is where we accelerate. Let's walk through accounts, pipeline, and set clear owners for this week.

MARCUS RIVERA: Before we dive in — LevelTen Energy's David Park called Friday. They're budgeting for a data platform expansion and want a proposal by end of next week. Potential $400K expansion deal.

SARAH CHEN: Marcus, own that. Draft the proposal framework and get it to me by Wednesday. I'll review Thursday morning and we'll iterate. Also loop in their CTO, Lisa Huang — get a discovery call on her calendar this week before the proposal lands.

MARCUS RIVERA: Absolutely. I'll also scan LevelTen's vendor network to see who's already in our orbit before that call, and prep a competitive landscape summary.

SARAH CHEN: Good. Jordan — CBRE outreach. You were supposed to hit 30 cold touches last week.

JORDAN KIM: Got through 22 of 30. CBRE portfolio team responded — I have a meeting with their Director of Technology, Robert Chen, set for Thursday at 2 PM. Still working through the Puget Sound Energy list.

SARAH CHEN: Finish the remaining 8 CBRE touches today — they're already warm, don't lose momentum. Then start the Puget Sound Energy sequence. Use the newsletter signal we flagged — they just announced a $200M grid modernization project. That's our hook. Also run the full prospect intelligence report on CBRE through the engine — stakeholders, pain points, AZX fit — have it ready by Wednesday EOD so I can review before Thursday's call.

JORDAN KIM: Got it. One thing — I don't have access to the prospect intelligence engine for Puget Sound Energy yet.

SARAH CHEN: Alex, flag that to IT. Get Jordan provisioned today.

ALEX TORRES: I'll send the IT request right after this call.

PRIYA PATEL: Quick update — our LinkedIn campaign launched last week is showing 3.2% CTR on the grid modernization angle. That's well above benchmark. I think we double down on this for Q2.

SARAH CHEN: Love it. Priya, I need a 4-week content calendar focused on grid modernization and AI adoption, with specific case study angles for CBRE and LevelTen. Also — the energy sector one-pager is outdated. I need an updated version by Friday incorporating the new ROI data.

PRIYA PATEL: Done. I also want to propose a mid-April webinar with a guest speaker from the utilities sector. I'll research potential speakers this week and come back with three vetted options by Friday.

ALEX TORRES: Flexe's contract is up for renewal in 60 days. Haven't done a formal QBR yet — that needs to happen this week. I'm targeting Tuesday or Wednesday. I'll build a full 12-month value realization report using platform usage data to present in the QBR.

SARAH CHEN: Flexe is a reference account. We cannot lose them. Make the QBR your top priority this week. And one more thing — their ops lead has been signaling they know two other warehousing companies we should be talking to. Turn that into a formal referral ask in the QBR meeting.

ALEX TORRES: Will do. I'll structure the referral ask into the QBR agenda.

SARAH CHEN: Marcus, can you support Alex with a partnership angle on those referrals? Let's sync Thursday after the CBRE call.

MARCUS RIVERA: Done. Alex, I'll have the vendor network scan ready before Thursday so we go in informed.

SARAH CHEN: Last item — all-hands is next Friday. Everyone send me a bullet-point summary of your week's wins by Thursday EOD so I can compile the deck.

ALL: Confirmed.

[MEETING END — 11:18 AM]`;

interface TranscriptResult {
  meeting: string;
  date?: string;
  participants: Person[];
}

export function TranscriptModule() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const process = async (transcript: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Processing failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process transcript");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setText((e.target?.result as string) ?? "");
    reader.readAsText(file);
  };

  const reset = () => { setResult(null); setError(null); setText(""); };

  const totalTasks = result?.participants.reduce((s, p) => s + p.todos.length, 0) ?? 0;

  /* ── Results view ── */
  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-[10px] text-azx-muted tracking-widest uppercase mb-1">Meeting Intelligence</div>
            <h2 className="font-mono text-xl font-bold text-white">{result.meeting}</h2>
            {result.date && <div className="font-mono text-xs text-azx-muted mt-0.5">{result.date}</div>}
            <div className="font-mono text-[10px] text-white/30 mt-1.5 tracking-widest">
              {result.participants.length} PARTICIPANTS · {totalTasks} TASKS EXTRACTED
            </div>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-azx-border text-azx-muted font-mono text-xs hover:text-white hover:border-white/20 transition-colors"
          >
            <RotateCcw size={12} />
            New Transcript
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {result.participants.map((person, i) => (
            <PersonCard key={person.name} person={person} delay={i * 0.07} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Input view ── */
  return (
    <div className="space-y-5">
      {/* Demo shortcut */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setText(DEMO_TRANSCRIPT)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-white font-mono text-xs hover:bg-white/10 transition-colors"
        >
          <Zap size={12} />
          Load Demo Transcript
        </button>
        <span className="font-mono text-[10px] text-azx-muted">Q2 GTM strategy · 5 participants · AZX accounts</span>
      </div>

      {/* Transcript input */}
      <div
        className="rounded-xl border border-azx-border bg-azx-card overflow-hidden"
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-azx-border">
          <span className="font-mono text-[10px] text-azx-muted tracking-widest uppercase">Meeting Transcript</span>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-azx-border text-azx-muted font-mono text-[10px] hover:text-white hover:border-white/20 transition-colors"
          >
            <Upload size={10} />
            Upload .txt / .vtt
          </button>
          <input
            ref={fileRef} type="file" accept=".txt,.vtt,.md" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Paste your meeting transcript here...\n\nOr drag & drop a .txt / .vtt file, or click 'Load Demo Transcript' above to try it instantly."}
          rows={14}
          className="w-full px-5 py-4 bg-transparent font-mono text-sm text-white/80 placeholder:text-white/15 resize-none focus:outline-none leading-relaxed"
        />

        {text.length > 0 && (
          <div className="px-5 py-2.5 border-t border-azx-border">
            <span className="font-mono text-[9px] text-azx-muted tracking-widest">
              {text.length.toLocaleString()} CHARS · {text.split("\n").filter(Boolean).length} LINES
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 font-mono text-xs text-red-400">{error}</div>
      )}

      <button
        onClick={() => text.trim().length >= 50 && process(text.trim())}
        disabled={text.trim().length < 50 || loading}
        className="w-full py-3.5 rounded-xl bg-white text-black font-mono text-sm font-bold
                   hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? (
          <motion.span
            className="flex items-center justify-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            Extracting action items...
          </motion.span>
        ) : (
          "Extract Weekly Plans →"
        )}
      </button>
    </div>
  );
}
