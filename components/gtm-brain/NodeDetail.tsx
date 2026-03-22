"use client";

import { useEffect, useRef } from "react";
import type { GTMNode } from "@/types";

interface NodeDetailProps {
  node: GTMNode | null;
  onClose: () => void;
}

export function NodeDetail({ node, onClose }: NodeDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className={`
        h-full overflow-y-auto bg-azx-card border-l border-azx-border p-5
        transition-all duration-300 ease-in-out
        ${node ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
      `}
    >
      {node && (
        <>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                className="font-mono text-xs tracking-widest uppercase mb-1"
                style={{ color: node.color }}
              >
                Layer {node.layer}
              </div>
              <h3 className="text-xl font-bold text-white">{node.label}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-azx-muted hover:text-white transition-colors text-lg leading-none mt-1"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            {node.purpose}
          </p>

          <div className="space-y-4">
            {/* Inputs */}
            <div>
              <div className="font-mono text-xs text-azx-muted uppercase tracking-widest mb-2">
                Inputs
              </div>
              <ul className="space-y-1">
                {node.inputs.map((input) => (
                  <li key={input} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-azx-border">→</span>
                    {input}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs */}
            <div>
              <div className="font-mono text-xs text-azx-muted uppercase tracking-widest mb-2">
                Outputs
              </div>
              <ul className="space-y-1">
                {node.outputs.map((output) => (
                  <li key={output} className="flex items-center gap-2 text-sm text-slate-400">
                    <span style={{ color: node.color }}>→</span>
                    {output}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <div className="font-mono text-xs text-azx-muted uppercase tracking-widest mb-2">
                Tools
              </div>
              <div className="flex flex-wrap gap-2">
                {node.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-1 rounded text-xs font-mono border border-azx-border text-slate-300 bg-azx-dark"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* AZX Role */}
            <div
              className="p-3 rounded-lg border"
              style={{
                borderColor: `${node.color}40`,
                backgroundColor: `${node.color}08`,
              }}
            >
              <div
                className="font-mono text-xs uppercase tracking-widest mb-2"
                style={{ color: node.color }}
              >
                AZX Role
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {node.azxRole}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
