"use client";

interface StreamingTextProps {
  text: string;
  isActive: boolean;
  className?: string;
}

export function StreamingText({ text, isActive, className }: StreamingTextProps) {
  return (
    <span
      className={`whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300 ${
        isActive ? "streaming-cursor" : ""
      } ${className ?? ""}`}
    >
      {text}
    </span>
  );
}
