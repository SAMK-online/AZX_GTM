"use client";

import { useState, useCallback } from "react";
import { getTierForScore } from "@/lib/quiz-data";
import type { QuizPhase, TierData } from "@/types";

interface UseQuizStateReturn {
  phase: QuizPhase;
  currentQuestion: number;
  answers: (number | undefined)[];
  score: number;
  tier: TierData | null;
  selectAnswer: (value: number) => void;
  back: () => void;
  startQuiz: () => void;
  resetQuiz: () => void;
}

export function useQuizState(): UseQuizStateReturn {
  const [phase, setPhase] = useState<QuizPhase>("idle");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    new Array(8).fill(undefined)
  );
  const [score, setScore] = useState(0);
  const [tier, setTier] = useState<TierData | null>(null);

  const startQuiz = useCallback(() => {
    setPhase("question");
    setCurrentQuestion(0);
    setAnswers(new Array(8).fill(undefined));
    setScore(0);
    setTier(null);
  }, []);

  const selectAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = value;
      setAnswers(newAnswers);

      if (currentQuestion < 7) {
        // Auto-advance after 400ms
        setTimeout(() => {
          setCurrentQuestion((q) => q + 1);
        }, 400);
      } else {
        // Last question — calculate result after delay
        setTimeout(() => {
          setPhase("calculating");
          setTimeout(() => {
            const total = newAnswers.reduce<number>(
              (sum, a) => sum + (a ?? 0),
              0
            );
            const tierData = getTierForScore(total);
            setScore(total);
            setTier(tierData);
            setPhase("result");
          }, 1500);
        }, 400);
      }
    },
    [answers, currentQuestion]
  );

  const back = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    }
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setPhase("idle");
    setCurrentQuestion(0);
    setAnswers(new Array(8).fill(undefined));
    setScore(0);
    setTier(null);
  }, []);

  return {
    phase,
    currentQuestion,
    answers,
    score,
    tier,
    selectAnswer,
    back,
    startQuiz,
    resetQuiz,
  };
}
