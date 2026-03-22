"use client";

import { cn } from "@/lib/utils";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";
import { LoadingPulse } from "@/components/ui/LoadingPulse";
import { ResultCard } from "./ResultCard";
import { useQuizState } from "@/hooks/useQuizState";

export function QuizEngine() {
  const {
    phase,
    currentQuestion,
    answers,
    score,
    tier,
    selectAnswer,
    back,
    startQuiz,
    resetQuiz,
  } = useQuizState();

  if (phase === "idle") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 p-5 rounded-lg border border-azx-border bg-azx-card">
          <div className="font-mono text-xs text-azx-muted uppercase tracking-widest mb-4">
            Assessment Instructions
          </div>
          <p className="text-slate-300 text-base leading-relaxed mb-2">
            Think of your highest-priority target account right now.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Answer the next 8 questions for <strong className="text-white">them</strong> —
            not for yourself. You&apos;ll get a GTM intelligence score and a clear picture
            of their AI readiness.
          </p>
        </div>
        <button
          onClick={startQuiz}
          className="px-8 py-3 rounded-lg bg-white text-black font-mono text-sm font-bold
                     hover:bg-white/90 transition-colors duration-200"
        >
          Start Assessment →
        </button>
      </div>
    );
  }

  if (phase === "calculating") {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <LoadingPulse message="Calculating your target account's GTM intelligence quotient..." />
      </div>
    );
  }

  if (phase === "result" && tier) {
    return <ResultCard score={score} tier={tier} onRetake={resetQuiz} />;
  }

  // Question phase
  const q = QUIZ_QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-azx-muted">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "#FF8C42" }}
          >
            {q.category}
          </span>
        </div>
        <div className="h-1 bg-azx-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: "#FF8C42",
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="p-6 rounded-lg border border-azx-border bg-azx-card mb-5 animate-fade-in-up">
        <p className="text-white text-lg leading-relaxed font-medium">{q.text}</p>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {q.options.map((option) => {
          const isSelected = answers[currentQuestion] === option.score;
          return (
            <button
              key={option.score}
              onClick={() => selectAnswer(option.score)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-lg border font-mono text-sm",
                "transition-all duration-150",
                isSelected
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-azx-border bg-azx-card text-slate-300 hover:border-white/20 hover:text-white"
              )}
              style={
                isSelected
                  ? { boxShadow: "0 0 12px rgba(255,255,255,0.15)" }
                  : undefined
              }
            >
              <span className="text-azx-muted mr-3">
                {String.fromCharCode(64 + option.score)}.
              </span>
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Back button */}
      {currentQuestion > 0 && (
        <div className="mt-4">
          <button
            onClick={back}
            className="font-mono text-xs text-azx-muted hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
