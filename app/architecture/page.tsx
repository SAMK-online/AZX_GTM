import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GTMBrainSection } from "@/components/gtm-brain/GTMBrainSection";
import { PageHero } from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata = {
  title: "GTM Brain Architecture — AZX GTM Brain",
  description: "Interactive AI GTM stack diagram. 16 nodes, 7 layers. Click any component to explore.",
};

export default function ArchitecturePage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        <PageHero>
          <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Back</Link>
                <span className="text-azx-border">/</span>
                <span className="font-mono text-xs tracking-widest text-white/40">FEATURE 02</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-3">
                GTM Brain
                <br />
                <span className="text-white/60">Architecture</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                A complete interactive map of an AI-powered GTM stack. Every node shows its
                purpose, inputs, outputs, real tool examples, and exactly where AZX&apos;s
                AI changes the economics.
              </p>
            </div>
          </div>
        </PageHero>

        <GTMBrainSection />

        <div className="border-t border-azx-border px-6 py-8 max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/intelligence" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← Intelligence Engine</Link>
          <Link href="/readiness"
            className="px-5 py-2.5 rounded-lg border border-azx-border font-mono text-sm text-slate-300
                       hover:border-white/30 hover:text-white transition-colors">
            Next: AI Readiness Score →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
