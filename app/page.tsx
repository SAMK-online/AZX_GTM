"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const MODULES = [
  {
    number: "01",
    href: "/intelligence",
    tag: "LIVE AI · STREAMING",
    title: "Prospect Intelligence Engine",
    subtitle: "Type a company. Get a full GTM brief in 15 seconds.",
    description:
      "Live web search + Claude synthesis. Signals, stakeholders, pain points, solution fit, outreach angle, and timing — all streamed in real time across 8 sections.",
    cta: "Run Intelligence Engine",
    stat: { value: "~15s", label: "to brief" },
    preview: (
      <div className="h-full p-5 font-mono text-[10px] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white/60 tracking-widest">ANALYZING · SCHNEIDER ELECTRIC</span>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[
            { s: "SIGNALS",      active: true,  lines: [75, 55, 90, 60] },
            { s: "STAKEHOLDERS", active: false, lines: [70, 80, 50] },
            { s: "PAIN POINTS",  active: false, lines: [85, 60, 70] },
            { s: "SOLUTION FIT", active: false, lines: [65, 80] },
            { s: "OUTREACH",     active: false, lines: [90, 55, 75] },
            { s: "TIMING",       active: false, lines: [60, 70] },
          ].map(({ s, active, lines }) => (
            <div key={s} className={`p-2.5 rounded-lg border ${active ? "border-white/20 bg-white/5" : "border-[#222] bg-[#0d0d0d]"}`}>
              <div className={`tracking-widest mb-2 ${active ? "text-white" : "text-[#333]"}`}>{s}</div>
              <div className="space-y-1">
                {lines.map((w, j) => (
                  <div key={j} className={`h-1 rounded ${active ? "bg-white/40" : "bg-[#222]"}`} style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <span>✓</span>
          <span className="tracking-widest">WEB-GROUNDED · TAVILY + CLAUDE</span>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    href: "/architecture",
    tag: "INTERACTIVE · 16 NODES",
    title: "GTM Brain Architecture",
    subtitle: "Every layer of the AI GTM stack. Fully interactive.",
    description:
      "16 nodes. 7 layers. Click any component to see what it does, what tools power it, and where AI changes the economics. Animated data flow on demand.",
    cta: "Explore Architecture",
    stat: { value: "16", label: "nodes" },
    preview: (
      <div className="h-full p-5 font-mono text-[9px] flex flex-col gap-3">
        {[
          { label: "DATA INGESTION",  opacity: "text-white/80", nodes: ["Signal Crawler", "CRM Sync", "Intent Feed"] },
          { label: "AI PROCESSING",   opacity: "text-white/65", nodes: ["Account Scorer", "Persona Intel", "Competitive AI"] },
          { label: "CONTENT GEN",     opacity: "text-white/50", nodes: ["Outreach AI", "Content AI"] },
          { label: "ORCHESTRATION",   opacity: "text-white/35", nodes: ["GTM Orchestrator", "Workflow Engine"] },
          { label: "EXECUTION",       opacity: "text-white/25", nodes: ["Sales Engage", "Paid Amplify", "Partner Channel"] },
        ].map(({ label, opacity, nodes }) => (
          <div key={label}>
            <div className={`tracking-widest mb-1.5 ${opacity}`}>{label}</div>
            <div className="flex gap-1.5 flex-wrap">
              {nodes.map((n) => (
                <div key={n} className="px-2 py-1 rounded border border-[#222] bg-[#0d0d0d] text-[#555]">
                  {n}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    href: "/readiness",
    tag: "INTERACTIVE · 2 MIN",
    title: "AI GTM Readiness Score",
    subtitle: "Score your prospect's AI maturity instantly.",
    description:
      "8 questions. One score. A maturity tier and three specific unlock recommendations you can anchor your next discovery call on.",
    cta: "Take Assessment",
    stat: { value: "4", label: "tiers" },
    preview: (
      <div className="h-full p-5 font-mono flex flex-col gap-4">
        <div>
          <div className="text-[9px] text-white/50 tracking-widest mb-1.5">QUESTION 4 OF 8 · TRIGGER RESPONSE</div>
          <div className="h-px bg-[#222] overflow-hidden">
            <div className="h-full w-1/2 bg-white/60" />
          </div>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          How quickly can your GTM team respond to a trigger event?
        </p>
        <div className="space-y-2 flex-1">
          {["Days to weeks", "Same day if a rep catches it", "Hours, via alert tools", "Minutes, via automation"].map((opt, i) => (
            <div key={opt} className={`px-3 py-2 rounded border text-[10px] ${i === 2 ? "border-white/30 bg-white/5 text-slate-200" : "border-[#222] text-[#444]"}`}>
              {String.fromCharCode(65 + i)}. {opt}
            </div>
          ))}
        </div>
        <div className="text-[9px] text-azx-muted text-center tracking-widest">RESULT → AI-NATIVE GTM TIER</div>
      </div>
    ),
  },
  {
    number: "04",
    href: "/outreach",
    tag: "AI · EMAIL + LINKEDIN",
    title: "Outreach Builder",
    subtitle: "Turn any brief into a cold email in one click.",
    description:
      "Contacts auto-extracted from Intelligence Engine sessions. Select email or LinkedIn — Claude writes a hyper-personalized message anchored in live signals, pain points, and timing cues.",
    cta: "Open Outreach Builder",
    stat: { value: "2", label: "formats" },
    preview: (
      <div className="h-full p-5 font-mono text-[10px] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white/60 tracking-widest">OUTREACH · SARAH CHEN</span>
          </div>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 rounded bg-white text-black text-[9px] font-bold">EMAIL</span>
            <span className="px-2 py-0.5 rounded border border-[#222] text-[#444] text-[9px]">LINKEDIN</span>
          </div>
        </div>
        <div className="flex-1 p-3 rounded-lg border border-white/10 bg-[#0d0d0d] space-y-2">
          <div className="text-white/40 text-[9px]">SUBJECT: Schneider's $2.3B Data Center Push →</div>
          <div className="space-y-1.5 text-[9px]">
            <div className="text-slate-400">Hi Sarah,</div>
            <div className="text-slate-400 leading-relaxed">
              Saw Schneider's announcement on the $2.3B data center deals — liquid cooling at that scale creates exactly the AI decision-support gap our platform addresses...
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-white/50 animate-pulse" />
              <span className="text-white/30">generating...</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <span>✓</span>
          <span className="tracking-widest">GROUNDED IN LIVE SIGNALS</span>
        </div>
      </div>
    ),
  },
  {
    number: "05",
    href: "/monitoring",
    tag: "LIVE · TAVILY + CLAUDE",
    title: "Signal Monitor",
    subtitle: "Live news monitoring for every account you track.",
    description:
      "Auto-synced from your Intelligence Engine sessions. Tavily fetches fresh signals; Claude extracts urgency, trend, and intent from every headline.",
    cta: "Open Signal Monitor",
    stat: { value: "Live", label: "signals" },
    preview: (
      <div className="h-full p-5 font-mono text-[10px] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white/60 tracking-widest">MONITORING · 4 ACCOUNTS</span>
        </div>
        <div className="space-y-2 flex-1">
          {[
            { company: "Schneider Electric", signal: "[HIGH] $2.3B data center expansion announced", fresh: true },
            { company: "GE Vernova",          signal: "[HIGH] Grid modernization RFP issued",           fresh: true },
            { company: "Siemens Energy",      signal: "[MED] New CDO appointment",                      fresh: false },
          ].map(({ company, signal, fresh }) => (
            <div key={company} className={`p-2.5 rounded-lg border ${fresh ? "border-white/15 bg-white/[0.03]" : "border-[#222] bg-[#0d0d0d]"}`}>
              <div className={`tracking-widest mb-1 text-[9px] ${fresh ? "text-white/50" : "text-[#333]"}`}>{company}</div>
              <div className={`text-[10px] ${fresh ? "text-slate-300" : "text-[#444]"}`}>{signal}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <span>≡</span>
          <span className="tracking-widest">NEWSLETTER INTEL + CHURN RISK TABS</span>
        </div>
      </div>
    ),
  },
  {
    number: "06",
    href: "/churn",
    tag: "AI · CSV UPLOAD",
    title: "Churn Risk Analyzer",
    subtitle: "Upload client CSV. Claude flags who's about to churn.",
    description:
      "Upload any CSV with adoption and conversion data. Set risk thresholds, run analysis — Claude scores every client 0–100, explains why they're at risk, and groups them into a prioritized action dashboard.",
    cta: "Analyze Churn Risk",
    stat: { value: "100", label: "rows" },
    preview: (
      <div className="h-full p-5 font-mono text-[10px] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-white/60 tracking-widest">CHURN RISK · 47 CLIENTS</span>
          <div className="flex gap-2">
            <span className="text-red-400 font-bold">12 HIGH</span>
            <span className="text-amber-400 font-bold">8 LOW</span>
            <span className="text-emerald-400 font-bold">27 WELL</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[
            { name: "ACME Corp",        adoption: "18%", conversion: "12%", risk: "HIGH" as const, score: 94 },
            { name: "DataSync Ltd",     adoption: "23%", conversion: "31%", risk: "HIGH" as const, score: 78 },
            { name: "BrightPath Inc",   adoption: "38%", conversion: "62%", risk: "LOW" as const,  score: 44 },
            { name: "TechCo Solutions", adoption: "72%", conversion: "68%", risk: "WELL" as const, score: 8 },
          ].map(({ name, adoption, conversion, risk, score }) => (
            <div
              key={name}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded border text-[9px] ${
                risk === "HIGH" ? "border-red-500/20 bg-red-500/5" :
                risk === "LOW"  ? "border-amber-500/20 bg-amber-500/5" :
                                  "border-[#222] bg-[#0d0d0d]"
              }`}
            >
              <span className="text-white flex-1 truncate">{name}</span>
              <span className="text-[#555]">{adoption}</span>
              <span className="text-[#555]">{conversion}</span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                risk === "HIGH" ? "text-red-400 bg-red-500/10" :
                risk === "LOW"  ? "text-amber-400 bg-amber-500/10" :
                                  "text-emerald-400 bg-emerald-500/10"
              }`}>{risk}</span>
              <span className="text-[#444] w-5 text-right">{score}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <span>↓</span>
          <span className="tracking-widest">DOWNLOAD REPORT · RESULTS PERSIST</span>
        </div>
      </div>
    ),
  },
  {
    number: "07",
    href: "/performance",
    tag: "LIVE · YAHOO FINANCE",
    title: "Client Performance",
    subtitle: "Public market data for tracked client sectors.",
    description:
      "Real-time stock charts for CBRE and sector benchmarks across Energy, Logistics, and Utilities. Interactive 30-day price history with 52-week range tracking.",
    cta: "View Performance",
    stat: { value: "4", label: "tickers" },
    preview: (
      <div className="h-full p-5 font-mono text-[10px] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white/60 tracking-widest">MARKET · 4 SECTORS</span>
        </div>
        <div className="space-y-2 flex-1">
          {[
            { symbol: "CBRE", change: "+1.39%", bar: 72, client: true  },
            { symbol: "NEE",  change: "-0.62%", bar: 45, client: false },
            { symbol: "GXO",  change: "+1.60%", bar: 58, client: false },
            { symbol: "AWK",  change: "+0.73%", bar: 65, client: false },
          ].map(({ symbol, change, bar, client }) => (
            <div key={symbol} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-16 shrink-0">
                <span className="text-white font-bold">{symbol}</span>
                {client && <span className="text-[8px] bg-white text-black px-1 rounded font-bold">C</span>}
              </div>
              <div className="flex-1 h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div className="h-full bg-white/50 rounded-full" style={{ width: `${bar}%` }} />
              </div>
              <span className={`text-[9px] w-12 text-right ${change.startsWith("+") ? "text-white" : "text-white/30"}`}>
                {change}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <span>↑</span>
          <span className="tracking-widest">INTERACTIVE 30D CHART</span>
        </div>
      </div>
    ),
  },
  {
    number: "08",
    href: "/transcript",
    tag: "AI · CLAUDE EXTRACTION",
    title: "Meeting Intelligence",
    subtitle: "Transcript in. Weekly plans out.",
    description:
      "Paste any meeting transcript — Claude extracts a prioritized action plan for every participant with due dates, context, and a one-click send button.",
    cta: "Open Meeting Intel",
    stat: { value: "5", label: "participants" },
    preview: (
      <div className="h-full p-5 font-mono text-[10px] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white/60 tracking-widest">EXTRACTING · Q2 STRATEGY MEETING</span>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[
            { name: "SC", role: "VP Sales",     tasks: ["Draft LevelTen proposal", "Review Jordan's brief"] },
            { name: "MR", role: "Partnerships", tasks: ["CTO discovery call", "Vendor network scan"] },
            { name: "PP", role: "Marketing",    tasks: ["4-week content calendar", "Update one-pager"] },
            { name: "JK", role: "BDR",          tasks: ["Finish CBRE touches", "Build PSE sequence"] },
          ].map(({ name, role, tasks }) => (
            <div key={name} className="p-2 rounded border border-[#222] bg-[#0d0d0d]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">{name}</span>
                </div>
                <span className="text-[#555] tracking-widest text-[8px]">{role.toUpperCase()}</span>
              </div>
              {tasks.map((t) => (
                <div key={t} className="flex items-start gap-1 mb-0.5">
                  <span className="text-white/20 mt-0.5">·</span>
                  <span className="text-[#444] text-[9px] leading-tight">{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <span>→</span>
          <span className="tracking-widest">SEND PLANS TO EACH PERSON</span>
        </div>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <>
      <main className="overflow-x-hidden">

        {/* ── HERO + SCROLL ANIMATION ─────────────────────────────── */}
        <section className="relative">
          <ContainerScroll
            titleComponent={
              <div className="mb-8 relative z-10">
                <motion.h1
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="font-mono font-bold leading-[0.88] mb-6"
                  style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                >
                  <span className="text-white">The GTM Stack</span>
                  <br />
                  <span className="text-white/70">of the Future.</span>
                  <br />
                  <span className="text-white/25">Running Now.</span>
                </motion.h1>

                <motion.p
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-3"
                >
                  Eight working AI modules — prospect intelligence, outreach generation, churn risk
                  scoring, live signal monitoring, and more. Built to show what an AI-native GTM
                  team actually looks like.
                </motion.p>

                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.65, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <Link
                    href="/intelligence"
                    className="px-7 py-3.5 rounded-lg bg-white text-black font-mono text-sm font-bold
                               hover:bg-white/90 transition-colors duration-200"
                  >
                    Run Intelligence Engine →
                  </Link>
                  <Link
                    href="/churn"
                    className="px-7 py-3.5 rounded-lg border border-white/15 text-white/60 font-mono text-sm
                               hover:border-white/40 hover:text-white transition-colors duration-200"
                  >
                    Churn Risk Analyzer
                  </Link>
                  <Link
                    href="/readiness"
                    className="px-7 py-3.5 rounded-lg border border-white/15 text-white/60 font-mono text-sm
                               hover:border-white/40 hover:text-white transition-colors duration-200"
                  >
                    Take Assessment
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="font-mono text-[10px] text-azx-muted mt-6 tracking-widest"
                >
                  ↓ SCROLL TO EXPLORE ALL 8 MODULES
                </motion.p>
              </div>
            }
          >
            {/* 3D card — Intelligence Engine preview */}
            <div className="w-full h-full bg-azx-dark flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-azx-border bg-azx-card shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 mx-4 px-3 py-1 rounded bg-azx-dark border border-azx-border font-mono text-xs text-azx-muted">
                  gtmbrain.vercel.app/intelligence
                </div>
              </div>

              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: input */}
                <div className="p-6 border-r border-azx-border flex flex-col gap-4">
                  <div className="font-mono text-xs text-white/40 tracking-widest">PROSPECT INTELLIGENCE ENGINE</div>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2 rounded border border-white/20 bg-azx-card font-mono text-sm text-white">
                      Schneider Electric
                    </div>
                    <div className="px-3 py-2 rounded border border-azx-border bg-azx-card font-mono text-xs text-azx-muted">
                      Energy &amp; Utilities
                    </div>
                    <div className="px-4 py-2 rounded bg-white text-black font-mono text-xs font-bold">
                      Generate
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-white/50">✓</span>
                    <span className="text-azx-muted">Live signals retrieved</span>
                    <span className="ml-1 px-2 py-0.5 rounded bg-white/5 border border-white/15 text-white/50 text-[10px]">web-grounded</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {["SIGNALS", "STAKEHOLDERS", "PAIN POINTS", "SOLUTION FIT", "OUTREACH", "TIMING"].map((s, i) => (
                      <div key={s} className={`p-2 rounded border font-mono text-[9px] ${i === 0 ? "border-white/20 bg-white/5" : "border-azx-border"}`}>
                        <div className={`tracking-widest mb-1 ${i === 0 ? "text-white" : "text-azx-muted"}`}>{s}</div>
                        <div className="space-y-0.5">
                          {[70, 50, 85].map((w, j) => (
                            <div key={j} className={`h-1 rounded ${i === 0 ? "bg-white/40" : "bg-azx-border"}`} style={{ width: `${w}%` }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: streaming output */}
                <div className="p-6 flex flex-col gap-3 overflow-hidden">
                  <div className="font-mono text-[10px] text-azx-muted tracking-widest">SIGNALS</div>
                  <div className="space-y-2 flex-1 overflow-hidden">
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      <span className="text-white font-medium">$2.3B Data Center Deal Surge (Nov 2025):</span>{" "}
                      Schneider announced nearly $2.3B in new deals with U.S. data center operators, with liquid cooling infrastructure at the center...
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <span className="text-white font-medium">EcoStruxure Scaling Pressure:</span>{" "}
                      Customers demand more than dashboards — they want predictive, autonomous decision-support...
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed opacity-60">
                      <span className="text-white font-medium">Climate Week NYC 2025:</span>{" "}
                      Schneider placed &quot;energy resilience&quot; at the center of their board-level narrative...
                    </p>
                  </div>
                  <div className="font-mono text-[10px] text-azx-muted flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white/50 animate-pulse" />
                    streaming...
                  </div>
                </div>
              </div>
            </div>
          </ContainerScroll>
        </section>

        {/* ── MODULE CARDS ──────────────────────────────────────────── */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Not a portfolio.{" "}
                <span className="text-white/60">A working infrastructure.</span>
              </h2>
              <p className="text-slate-500 font-mono text-xs mt-4 tracking-widest">
                8 MODULES · EDGE STREAMING · ZERO BACKEND
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={mod.href} className="group block h-full">
                  <div
                    className="h-full rounded-xl border border-azx-border bg-azx-card p-6
                                group-hover:-translate-y-1"
                    style={{ transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "";
                    }}
                  >
                    {/* Tag + number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] tracking-widest px-2 py-1 rounded
                                       text-white/60 bg-white/[0.04]">
                        {mod.tag}
                      </span>
                      <span className="font-mono text-xs text-azx-border">{mod.number}</span>
                    </div>

                    {/* Preview */}
                    <div className="h-56 rounded-lg border border-azx-border overflow-hidden mb-5 bg-azx-dark">
                      {mod.preview}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-1.5">{mod.title}</h3>
                    <p className="font-mono text-xs text-azx-muted mb-3">{mod.subtitle}</p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5">{mod.description}</p>

                    {/* CTA row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-white
                                      group-hover:text-white/70 transition-colors">
                        {mod.cta}
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg font-bold text-white">{mod.stat.value}</div>
                        <div className="font-mono text-[9px] text-azx-muted uppercase tracking-widest">{mod.stat.label}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WHY THIS EXISTS ────────────────────────────────────────── */}
        <section className="px-6 pb-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-azx-border bg-azx-card p-8 md:p-12 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ffffff, transparent)", transform: "translate(30%, -30%)" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">Why This Exists</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  I built the demo instead of writing about it.
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Every module is a working building block for an AI-native GTM stack — a
                  Tavily → Claude signal pipeline for prospect research, personalized outreach
                  generation anchored in live signals, a churn risk analyzer that turns a CSV
                  into a prioritized action plan, and live news monitoring for every account
                  you care about.
                </p>
                <div className="font-mono text-xs text-azx-muted">
                  Next.js 14 · Claude claude-sonnet-4-6 (Edge streaming) · Tavily · Vercel · Zero backend
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-3">
                <Link
                  href="/intelligence"
                  className="px-6 py-3 rounded-lg bg-white text-black font-mono text-sm font-bold
                             hover:bg-white/90 transition-colors text-center whitespace-nowrap"
                >
                  Start with Intelligence →
                </Link>
                <a
                  href="https://github.com/SAMK-online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg border border-azx-border text-azx-muted font-mono text-sm
                             hover:text-white transition-colors text-center"
                >
                  View Source →
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
