"use client";

import { useState } from "react";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { NodeDetail } from "./NodeDetail";
import { MobileLayerCards } from "./MobileLayerCards";
import type { GTMNode } from "@/types";

export function GTMBrainSection() {
  const [selectedNode, setSelectedNode] = useState<GTMNode | null>(null);

  return (
    <section id="architecture" className="section-anchor px-6 py-16 max-w-7xl mx-auto">

      {/* Desktop: diagram + panel side by side */}
      <div className="hidden md:flex gap-4 transition-all duration-300">
        <div
          className="transition-all duration-300"
          style={{ width: selectedNode ? "65%" : "100%" }}
        >
          <ArchitectureDiagram
            selectedNode={selectedNode}
            onNodeClick={(node) =>
              setSelectedNode(selectedNode?.id === node.id ? null : node)
            }
          />
        </div>

        <div
          className="transition-all duration-300 overflow-hidden rounded-lg border border-azx-border"
          style={{
            width: selectedNode ? "35%" : "0%",
            opacity: selectedNode ? 1 : 0,
            minHeight: selectedNode ? 400 : 0,
          }}
        >
          <NodeDetail
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      </div>

      {/* Mobile: layer cards */}
      <div className="md:hidden">
        <MobileLayerCards onNodeSelect={(node) => setSelectedNode(node)} />

        {/* Mobile NodeDetail bottom sheet */}
        {selectedNode && (
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-azx-border bg-azx-card shadow-2xl">
            <div className="sticky top-0 flex justify-center py-2 bg-azx-card">
              <div className="w-12 h-1 rounded-full bg-azx-border" />
            </div>
            <div className="px-5 pb-8">
              <NodeDetail
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          </div>
        )}
        {selectedNode && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSelectedNode(null)}
          />
        )}
      </div>
    </section>
  );
}
