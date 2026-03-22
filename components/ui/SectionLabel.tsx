interface SectionLabelProps {
  number: string;
  label: string;
}

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs text-azx-muted tracking-widest uppercase">
        FEATURE {number}
      </span>
      <div className="h-px flex-1 bg-azx-border max-w-8" />
      <span className="font-mono text-xs text-azx-muted tracking-widest uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-azx-border" />
    </div>
  );
}
