import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadinessSection } from "@/components/readiness/ReadinessSection";
import { PageHero } from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata = {
  title: "AI GTM Readiness Score — GTM Brain",
  description: "8 questions. Score your target account's AI GTM maturity and get specific unlock recommendations.",
};

export default function ReadinessPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        <PageHero>
          <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Back</Link>
                <span className="text-azx-border">/</span>
                <span className="font-mono text-xs text-white/40 tracking-widest">FEATURE 03</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-3">
                AI GTM
                <br />
                <span className="text-white/60">Readiness Score</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Answer 8 questions about your target account. Instantly score their AI GTM
                maturity, identify their tier, and get specific unlock recommendations to
                anchor your next discovery call.
              </p>
            </div>
          </div>
        </PageHero>

        <ReadinessSection />

        <div className="border-t border-azx-border px-6 py-8 max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/architecture" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← GTM Architecture</Link>
          <Link href="/"
            className="px-5 py-2.5 rounded-lg border border-azx-border font-mono text-sm text-slate-300
                       hover:border-white/30 hover:text-white transition-colors">
            ↩ Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
