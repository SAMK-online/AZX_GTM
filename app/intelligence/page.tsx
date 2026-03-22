import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProspectEngine } from "@/components/prospect/ProspectEngine";
import { PageHero } from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata = {
  title: "Prospect Intelligence Engine — AZX GTM Brain",
  description: "Type a company name. Get a full AI-powered GTM brief in 15 seconds.",
};

export default function IntelligencePage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        <PageHero>
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Back</Link>
                <span className="text-azx-border">/</span>
                <span className="font-mono text-xs text-white/40 tracking-widest">FEATURE 01</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-3">
                Prospect Intelligence
                <br />
                <span className="text-white/60">Engine</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Live web search via Tavily, synthesized by Claude into a structured 6-section
                GTM brief. Signals, stakeholders, pain points, AZX fit, outreach angle,
                and timing signals — streamed in real time.
              </p>
            </div>
          </div>
        </PageHero>

        <ProspectEngine />

        <div className="border-t border-azx-border px-6 py-8 max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Home</Link>
          <Link href="/architecture"
            className="px-5 py-2.5 rounded-lg border border-azx-border font-mono text-sm text-slate-300
                       hover:border-white/30 hover:text-white transition-colors">
            Next: GTM Architecture →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
