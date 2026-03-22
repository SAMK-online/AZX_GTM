export function AboutSection() {
  return (
    <section id="about" className="section-anchor px-6 py-24 max-w-4xl mx-auto">
      <div className="border-t border-azx-border pt-16">
        <div className="font-mono text-xs text-azx-muted tracking-[0.3em] uppercase mb-8">
          CANDIDATE BRIEF — APPROACH NOTES
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 01 note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-azx-muted">01</span>
              <div className="h-px flex-1 bg-azx-border" />
            </div>
            <h3 className="font-mono text-sm text-white">
              Prospect Intelligence Engine
            </h3>
            <p className="text-azx-muted text-sm leading-relaxed">
              The centerpiece isn&apos;t a demo of Claude — it&apos;s a demo of prompt
              engineering for GTM. The Tavily → Claude pipeline shows how I&apos;d
              actually build a signal-to-brief workflow for AZX&apos;s team. Every
              section is engineered to produce actionable output, not plausible-
              sounding text.
            </p>
          </div>

          {/* Feature 02 note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-azx-muted">02</span>
              <div className="h-px flex-1 bg-azx-border" />
            </div>
            <h3 className="font-mono text-sm text-white">
              GTM Brain Architecture
            </h3>
            <p className="text-azx-muted text-sm leading-relaxed">
              I&apos;ve seen too many GTM architecture slides with boxes and no depth.
              Every node here has a purpose, real tools, and a specific place where
              AI changes the economics. It reflects how I&apos;d actually think about
              instrumenting AZX&apos;s sales org from day one.
            </p>
          </div>

          {/* Feature 03 note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-azx-muted">03</span>
              <div className="h-px flex-1 bg-azx-border" />
            </div>
            <h3 className="font-mono text-sm text-white">
              AI Readiness Score
            </h3>
            <p className="text-azx-muted text-sm leading-relaxed">
              AZX sells to enterprises at every stage of AI adoption. This tool
              qualifies them in 2 minutes and gives reps a specific pitch angle
              based on maturity tier. I&apos;d want to build this for AZX&apos;s own demand
              gen pipeline from day one.
            </p>
          </div>
        </div>

        {/* Tech stack note */}
        <div className="mt-10 p-4 rounded-lg border border-azx-border bg-azx-card font-mono text-xs text-azx-muted">
          <span className="text-azx-muted">// </span>
          Next.js 14 · Claude claude-sonnet-4-6 (streaming via Edge runtime) · Tavily web search ·
          Vercel · No backend, no database — fully stateless.{" "}
          <span className="text-azx-muted">
            Each system here is a building block for what I&apos;d build at AZX.
          </span>
        </div>
      </div>
    </section>
  );
}
