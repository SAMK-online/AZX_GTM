"use client";

import { useState, useCallback } from "react";
import type { SignalSource } from "@/types";

interface UseSignalStreamReturn {
  content: string;
  isStreaming: boolean;
  error: string | null;
  sources: SignalSource[];
  start: (endpoint: string, payload: Record<string, unknown>) => Promise<void>;
  reset: () => void;
}

export function useSignalStream(): UseSignalStreamReturn {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<SignalSource[]>([]);

  const start = useCallback(
    async (endpoint: string, payload: Record<string, unknown>) => {
      setContent("");
      setIsStreaming(true);
      setError(null);
      setSources([]);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(err.error ?? `HTTP ${res.status}`);
        }

        const sourcesHeader = res.headers.get("X-Sources");
        if (sourcesHeader) {
          setSources(JSON.parse(sourcesHeader));
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream body");

        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk.includes("__STREAM_ERROR__")) {
            throw new Error("Stream interrupted by server");
          }
          acc += chunk;
          setContent(acc);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setContent("");
    setError(null);
    setSources([]);
    setIsStreaming(false);
  }, []);

  return { content, isStreaming, error, sources, start, reset };
}
