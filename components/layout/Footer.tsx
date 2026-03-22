export function Footer() {
  return (
    <footer className="border-t border-azx-border px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-azx-muted">
          Built by{" "}
          <span className="text-white">Abdul Shaik</span>
          {" "}for{" "}
          <span className="text-white">AZX</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-azx-muted">
          <a
            href="https://github.com/SAMK-online"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub →
          </a>
          <span className="text-azx-border">·</span>
          <span>Next.js · Claude · Tavily · Vercel</span>
        </div>
      </div>
    </footer>
  );
}
