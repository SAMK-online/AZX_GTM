"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/intelligence", label: "Intelligence" },
  { href: "/architecture", label: "Architecture" },
  { href: "/readiness", label: "Readiness" },
  { href: "/outreach", label: "Outreach" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6
                       border-b border-azx-border/50 bg-azx-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/"
          className="font-mono text-sm font-bold tracking-widest text-white hover:text-white/70 transition-colors">
          AZX <span className="text-white/50">GTM</span> BRAIN
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`font-mono text-xs tracking-widest uppercase transition-colors ${
                pathname === href ? "text-white" : "text-azx-muted hover:text-white"
              }`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* GitHub */}
        <a href="https://github.com/SAMK-online" target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs text-azx-muted hover:text-white transition-colors">
          GitHub →
        </a>
      </div>
    </header>
  );
}
