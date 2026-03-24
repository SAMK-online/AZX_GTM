"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6
                       border-b border-azx-border/40 bg-azx-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/"
          className="font-mono text-sm font-bold tracking-widest text-white hover:text-white/70 transition-colors">
          AZX <span className="text-white/50">GTM</span> BRAIN
        </Link>

        {/* GitHub */}
        <a href="https://github.com/SAMK-online" target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs text-azx-muted hover:text-white transition-colors">
          GitHub →
        </a>
      </div>
    </header>
  );
}
