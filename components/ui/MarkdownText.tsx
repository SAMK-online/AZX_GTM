"use client";

import React from "react";

interface MarkdownTextProps {
  text: string;
  isActive?: boolean;
  className?: string;
}

/**
 * Lightweight markdown renderer for Claude's streaming output.
 * Handles: **bold**, *italic*, - bullets, 1. numbered, > blockquote, --- dividers.
 * No external deps — renders clean styled JSX.
 */
export function MarkdownText({ text, isActive, className }: MarkdownTextProps) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip --- dividers and empty lines at the start
    if (trimmed === "---" || trimmed === "—") {
      i++;
      continue;
    }

    // Empty line — spacing between blocks
    if (trimmed === "") {
      i++;
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith("> ")) {
      const content = trimmed.slice(2);
      elements.push(
        <div
          key={i}
          className="pl-3 border-l-2 border-azx-muted/40 text-azx-muted text-xs italic my-2"
        >
          {renderInline(content)}
        </div>
      );
      i++;
      continue;
    }

    // Unordered list: starts with "- "
    if (trimmed.startsWith("- ")) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        const content = lines[i].trim().slice(2);
        listItems.push(
          <li key={i} className="flex gap-2 leading-relaxed">
            <span className="text-white/40 mt-1 shrink-0">·</span>
            <span>{renderInline(content)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-1">
          {listItems}
        </ul>
      );
      continue;
    }

    // Numbered list: starts with "1. " "2. " etc.
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^(\d+)\.\s(.*)$/);
        if (match) {
          listItems.push(
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="text-white/40 font-mono text-xs shrink-0 mt-0.5">
                {String(match[1]).padStart(2, "0")}
              </span>
              <span>{renderInline(match[2])}</span>
            </li>
          );
        }
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-3 my-1">
          {listItems}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return (
    <div
      className={`text-sm text-slate-300 space-y-2 ${isActive ? "streaming-cursor" : ""} ${className ?? ""}`}
    >
      {elements}
    </div>
  );
}

/**
 * Renders inline markdown: **bold**, *italic*, `code`
 */
function renderInline(text: string): React.ReactNode {
  // Split on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="text-slate-200 italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-azx-dark border border-azx-border font-mono text-xs text-white/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}
