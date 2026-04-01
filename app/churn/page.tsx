import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { ChurnAnalysisTab } from "@/components/monitoring/ChurnAnalysisTab";
import Link from "next/link";

export const metadata = {
  title: "Churn Risk Analyzer — GTM Brain",
  description: "Upload client CSV — Claude scores every account for churn risk based on adoption and conversion data.",
};

export default function ChurnPage() {
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
                <span className="font-mono text-xs text-white/40 tracking-widest">FEATURE 06</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-3">
                Churn Risk
                <br />
                <span className="text-white/60">Analyzer</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Upload any client CSV with adoption and conversion data. Set risk thresholds —
                Claude scores every account 0–100, explains why they&apos;re at risk, and groups
                them into a prioritized action dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-2 font-mono text-[10px] text-white/30 tracking-widest shrink-0">
              <div>CLAUDE · RISK SCORING</div>
              <div>CSV · UP TO 100 ROWS</div>
              <div>RESULTS · PERSIST IN SESSION</div>
            </div>
          </div>
        </PageHero>

        <section className="px-6 py-12 max-w-6xl mx-auto">
          <Suspense fallback={null}>
            <ChurnAnalysisTab />
          </Suspense>
        </section>

        <div className="border-t border-azx-border px-6 py-8 max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/monitoring" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Signal Monitor</Link>
          <Link
            href="/performance"
            className="px-5 py-2.5 rounded-lg border border-azx-border font-mono text-sm text-slate-300
                       hover:border-white/30 hover:text-white transition-colors"
          >
            Client Performance →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
