import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OutreachModule } from "@/components/outreach/OutreachModule";
import { PageHero } from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata = {
  title: "Outreach Builder — GTM Brain",
  description: "Generate personalized outreach emails and LinkedIn messages for your prospect contacts.",
};

export default function OutreachPage() {
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
                <span className="font-mono text-xs text-white/40 tracking-widest">FEATURE 04</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-3">
                Outreach
                <br />
                <span className="text-white/60">Builder</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Contacts from your Intelligence Engine sessions land here automatically.
                Select any contact and generate a personalized email or LinkedIn message — grounded in the brief.
              </p>
            </div>
          </div>
        </PageHero>

        <section className="px-6 py-12 max-w-7xl mx-auto">
          <OutreachModule />
        </section>

        <div className="border-t border-azx-border px-6 py-8 max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/readiness" className="font-mono text-xs text-azx-muted hover:text-white transition-colors">← AI Readiness Score</Link>
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
