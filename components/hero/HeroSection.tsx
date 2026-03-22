"use client";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Radar pings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-white/10 animate-radar-ping pointer-events-none"
          style={{
            width: 200 + i * 120,
            height: 200 + i * 120,
            animationDelay: `${i * 1}s`,
            animationDuration: "3s",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Top label */}
        <div className="font-mono text-xs text-azx-muted tracking-[0.3em] uppercase mb-8 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          CANDIDATE BRIEF v1.0
        </div>

        {/* Main headline */}
        <h1
          className="font-mono font-bold leading-none mb-2 animate-fade-in-up opacity-0"
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            animationDelay: "0.2s",
            animationFillMode: "forwards",
          }}
        >
          <span className="text-white">GTM</span>
          <span className="text-white/60"> Brain</span>
        </h1>

        <div
          className="font-mono text-azx-muted text-lg mb-10 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          for <span className="text-white">AZX</span>
        </div>

        {/* Subtitle */}
        <p
          className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          This is what AI-native go-to-market looks like.
        </p>
        <p
          className="text-azx-muted text-base max-w-xl mx-auto leading-relaxed mb-12 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        >
          Not slides. Not a PDF. A working system.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.85s", animationFillMode: "forwards" }}
        >
          <button
            onClick={() => scrollTo("prospect")}
            className="px-6 py-3 rounded-lg bg-white text-black font-mono text-sm font-bold tracking-wide hover:bg-white/90 transition-colors duration-200"
          >
            Run Intelligence Engine →
          </button>
          <button
            onClick={() => scrollTo("architecture")}
            className="px-6 py-3 rounded-lg border border-azx-border text-slate-300 font-mono text-sm hover:border-white/30 hover:text-white transition-colors duration-200"
          >
            See Architecture →
          </button>
          <button
            onClick={() => scrollTo("readiness")}
            className="px-6 py-3 rounded-lg border border-azx-border text-slate-300 font-mono text-sm hover:border-white/30 hover:text-white transition-colors duration-200"
          >
            Take Assessment →
          </button>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in-up opacity-0"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col items-center gap-2 text-azx-muted">
            <span className="font-mono text-xs tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-gradient-to-b from-azx-muted/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
