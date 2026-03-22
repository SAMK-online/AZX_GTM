"use client";

import { EtherealShadow } from "./etheral-shadow";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <EtherealShadow
        color="rgba(255, 255, 255, 0.35)"
        animation={{ scale: 80, speed: 30 }}
        noise={{ opacity: 0.4, scale: 1.2 }}
        sizing="fill"
        style={{ position: "absolute", inset: 0 }}
      />
      {/* Subtle dark overlay — just enough to keep text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.55)",
        }}
      />
    </div>
  );
}
