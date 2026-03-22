# AZX GTM Brain

A working AI GTM system built as a job application for the AI GTM Engineer role at AZX. Four live tools — not slides, not mockups.

---

## What it does

### 01 · Prospect Intelligence Engine
Type a company name. Get a full GTM brief in ~15 seconds.

Tavily runs a live web search to pull fresh signals, then Claude synthesizes them into a structured 8-section brief: buying signals, key stakeholders, pain points, AZX fit, outreach angle, timing signals, AI opportunities, and prospective contacts. Every brief is grounded in real data, streamed token-by-token.

### 02 · GTM Brain Architecture
An interactive map of a complete AI-powered GTM stack.

16 nodes across 7 layers — from data ingestion through AI processing, content generation, orchestration, execution, feedback, and optimization. Click any node to see what it does, what tools power it, and exactly where AZX's AI changes the economics. Hit "Animate Data Flow" to watch signals travel through the stack in real time.

### 03 · AI GTM Readiness Score
8 questions. One score. A maturity tier and three unlock recommendations.

Scores a prospect's AI GTM maturity across data infrastructure, automation depth, trigger response time, and content personalization. Maps to one of four tiers — Manual GTM through AI-Native — and surfaces the specific gaps AZX closes for that tier. Built to be used on a discovery call.

### 04 · Outreach Builder
Contacts from the Intelligence Engine land here automatically.

Select any contact, choose Email or LinkedIn, and generate a personalized message grounded in the brief — their specific signals, pain points, and the outreach angle Claude identified. Built for the AE who needs to send something smart in under 10 seconds.

---

## Why it exists

Most job applications describe what someone would do. This one does it.

Every module maps to a real AZX GTM workflow: the Tavily → Claude signal pipeline for prospect research, an AI orchestration layer for the full GTM stack, an interactive qualification tool for discovery calls, and a message generator that turns research into action.

---

## Stack

Next.js 14 App Router · Claude claude-sonnet-4-6 (Edge streaming) · Tavily Search API · Framer Motion · Vercel · Zero backend · Zero database

---

Built by **Abdul Shaik** — applying for AI GTM Engineer @ AZX
