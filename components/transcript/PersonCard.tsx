"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check } from "lucide-react";

type Priority = "HIGH" | "MED" | "LOW";

interface Todo {
  id: number;
  priority: Priority;
  task: string;
  due: string;
  context: string;
}

export interface Person {
  name: string;
  role: string;
  initials: string;
  todos: Todo[];
}

const PILL: Record<Priority, string> = {
  HIGH: "bg-white text-black font-bold",
  MED: "border border-white/30 text-white/60",
  LOW: "border border-azx-border text-azx-muted",
};

export function PersonCard({ person, delay = 0 }: { person: Person; delay?: number }) {
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const highCount = person.todos.filter((t) => t.priority === "HIGH").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, type: "spring", stiffness: 280, damping: 28 }}
      className="rounded-xl border border-azx-border bg-azx-card overflow-hidden hover:border-white/15 transition-colors duration-300"
    >
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-azx-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-white">{person.initials}</span>
          </div>
          <div className="min-w-0">
            <div className="font-mono text-sm font-bold text-white truncate">{person.name}</div>
            <div className="font-mono text-[9px] text-azx-muted tracking-widest uppercase truncate">{person.role}</div>
          </div>
        </div>

        <button
          onClick={handleSend}
          title="Send this week plan"
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[9px] tracking-widest transition-all duration-200 ${
            sent
              ? "border-white/25 bg-white/8 text-white"
              : "border-azx-border text-azx-muted hover:border-white/25 hover:text-white"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Check size={9} strokeWidth={2.5} />
                SENT
              </motion.span>
            ) : (
              <motion.span key="send" className="flex items-center gap-1">
                <Send size={9} strokeWidth={2} />
                SEND
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Todo list ── */}
      <div className="px-5 py-4 space-y-3">
        {person.todos.map((todo, i) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.05 + 0.1 }}
            className="flex gap-3"
          >
            <div className="mt-[3px] shrink-0">
              <span
                className={`inline-block font-mono text-[8px] px-1.5 py-[3px] rounded tracking-widest ${
                  PILL[todo.priority] ?? PILL.LOW
                }`}
              >
                {todo.priority}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-white/90 leading-snug">{todo.task}</div>
              <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                <span className="font-mono text-[9px] text-white/40 shrink-0">{todo.due}</span>
                {todo.context && (
                  <span className="font-mono text-[9px] text-white/20 leading-tight">{todo.context}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 pb-4 pt-1 border-t border-azx-border/50">
        <span className="font-mono text-[9px] text-azx-muted tracking-widest">
          {person.todos.length} TASKS
          {highCount > 0 && ` · ${highCount} HIGH PRIORITY`}
        </span>
      </div>
    </motion.div>
  );
}
