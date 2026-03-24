import { FileText } from "lucide-react";
import { TranscriptModule } from "@/components/transcript/TranscriptModule";

export default function TranscriptPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={13} className="text-white/40" />
          <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
            Meeting Intelligence · Module 07
          </span>
        </div>
        <h1 className="font-mono text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
          Meeting Transcript<br />
          <span className="text-white/40">→ Weekly Plans</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
          Paste any meeting transcript — Claude extracts a prioritized weekly action plan
          for every participant, ready to send in one click.
        </p>

        <div className="mt-5 flex items-center gap-4 flex-wrap">
          {[
            "Upload .txt or .vtt",
            "Per-person action items",
            "Priority scoring",
            "One-click send",
          ].map((feat) => (
            <span
              key={feat}
              className="font-mono text-[9px] text-azx-muted tracking-widest px-2.5 py-1 rounded border border-azx-border"
            >
              {feat.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <TranscriptModule />
    </main>
  );
}
