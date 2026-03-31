import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MonitoringModule } from "@/components/monitoring/MonitoringModule";
import { PageHero } from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata = {
  title: "Signal Monitor — GTM Brain",
  description: "Live news monitoring for tracked accounts and newsletter intelligence parsing.",
};

export default function MonitoringPage() {
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
                <span className="font-mono text-xs text-white/40 tracking-widest">FEATURE 05</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-3">
                Signal
                <br />
                <span className="text-white/60">Monitor</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Live news monitoring for every account you&apos;re tracking. Paste any newsletter
                or article and Claude extracts companies signaling buying intent, market trends,
                and recommended actions — all in real time.
              </p>
            </div>
            <div className="flex flex-col gap-2 font-mono text-[10px] text-white/30 tracking-widest shrink-0">
              <div>TAVILY · LIVE WEB SEARCH</div>
              <div>CLAUDE · SIGNAL EXTRACTION</div>
              <div>AUTO-SYNCED · FROM CONTACTS</div>
            </div>
          </div>
        </PageHero>

        <section className="px-6 py-12 max-w-6xl mx-auto">
          <MonitoringModule />
        </section>

        <div className="border-t border-azx-border px-6 py-8 max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/outreach" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Outreach Builder</Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-azx-border font-mono text-sm text-slate-300
                       hover:border-white/30 hover:text-white transition-colors"
          >
            ↩ Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
