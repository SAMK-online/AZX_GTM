interface LoadingPulseProps {
  message?: string;
}

export function LoadingPulse({ message }: LoadingPulseProps) {
  return (
    <div className="flex items-center gap-3 text-azx-muted font-mono text-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/50 animate-skeleton-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      {message && <span>{message}</span>}
    </div>
  );
}
