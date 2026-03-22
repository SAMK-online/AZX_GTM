"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Industry, LoadingPhase } from "@/types";

interface UseProspectStreamReturn {
  streamContent: string;
  isStreaming: boolean;
  isComplete: boolean;
  loadingPhase: LoadingPhase;
  error: string | null;
  isGrounded: boolean;
  startStream: (companyName: string, industry: Industry) => void;
  resetStream: () => void;
}

export function useProspectStream(): UseProspectStreamReturn {
  const [streamContent, setStreamContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isGrounded, setIsGrounded] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const doStream = useCallback(
    async (companyName: string, industry: Industry, isRetry = false) => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoadingPhase("searching");

        const response = await fetch("/api/prospect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName, industry }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        // Check if Tavily grounded this response
        const grounded = response.headers.get("X-Tavily-Grounded") === "true";
        setIsGrounded(grounded);

        setLoadingPhase("synthesizing");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          if (chunk.includes("__STREAM_ERROR__")) {
            throw new Error("Stream interrupted by server");
          }

          accumulated += chunk;
          setStreamContent(accumulated);
        }

        setIsStreaming(false);
        setIsComplete(true);
        setLoadingPhase("idle");
        retryCountRef.current = 0;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User cancelled — silent
          return;
        }

        if (!isRetry && retryCountRef.current === 0) {
          // Silent retry once
          retryCountRef.current = 1;
          setStreamContent("");
          setLoadingPhase("searching");
          await doStream(companyName, industry, true);
        } else {
          // Retry also failed — show error, preserve partial content
          setIsStreaming(false);
          setLoadingPhase("idle");
          setError("Brief generation was interrupted. Partial results may be shown above.");
        }
      }
    },
    []
  );

  const startStream = useCallback(
    (companyName: string, industry: Industry) => {
      abortControllerRef.current?.abort();
      retryCountRef.current = 0;
      setStreamContent("");
      setIsStreaming(true);
      setIsComplete(false);
      setError(null);
      setIsGrounded(false);
      setLoadingPhase("searching");
      doStream(companyName, industry);
    },
    [doStream]
  );

  const resetStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setStreamContent("");
    setIsStreaming(false);
    setIsComplete(false);
    setLoadingPhase("idle");
    setError(null);
    setIsGrounded(false);
    retryCountRef.current = 0;
  }, []);

  return {
    streamContent,
    isStreaming,
    isComplete,
    loadingPhase,
    error,
    isGrounded,
    startStream,
    resetStream,
  };
}
