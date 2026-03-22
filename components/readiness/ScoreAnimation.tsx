"use client";

import { useEffect, useState } from "react";

interface ScoreAnimationProps {
  targetScore: number;
  tierColor: string;
}

export function ScoreAnimation({ targetScore, tierColor }: ScoreAnimationProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 800;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * targetScore));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetScore]);

  return (
    <div className="text-center">
      <div
        className="text-8xl font-mono font-bold tabular-nums leading-none"
        style={{ color: tierColor }}
      >
        {displayScore}
      </div>
      <div className="text-azx-muted font-mono text-lg mt-1">/ 32</div>
    </div>
  );
}
