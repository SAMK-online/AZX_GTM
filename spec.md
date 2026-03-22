# AZX GTM Brain — Implementation Spec
> Last updated: March 2026 (post-interview decisions locked in)

---

## Project Summary

A single-page "vibe coded" portfolio app demonstrating AI-native GTM thinking, built for the AZX AI GTM Engineer application. Tone: confident, precision-engineered. LinkedIn DM with the link goes out first; the page itself contains a "Why I Built This" closing section.

---

## Directory Structure

```
/Users/abdulshaik/azxgtmbrain/
├── app/
│   ├── layout.tsx                  # Root layout, global metadata, OG tags
│   ├── page.tsx                    # Main single-page shell
│   ├── globals.css                 # Tailwind directives + custom keyframes
│   └── api/
│       └── prospect/
│           └── route.ts            # Streaming endpoint (Edge runtime)
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Sticky nav with section anchors
│   │   └── Footer.tsx              # Minimal footer
│   ├── hero/
│   │   └── HeroSection.tsx         # Terminal boot aesthetic, no date
│   ├── prospect/
│   │   ├── ProspectEngine.tsx      # Container for Feature 1
│   │   ├── ProspectInput.tsx       # Company name + industry selector
│   │   ├── ProspectStream.tsx      # Ghost skeleton grid + streaming parser
│   │   └── BriefSectionCard.tsx    # Per-section card with copy icon
│   ├── gtm-brain/
│   │   ├── GTMBrainSection.tsx     # Container for Feature 2
│   │   ├── ArchitectureDiagram.tsx # SVG diagram, 65/35 split on node click
│   │   ├── NodeDetail.tsx          # 35% panel, slides in on node click
│   │   └── MobileLayerCards.tsx    # Mobile fallback: vertical layer cards
│   ├── readiness/
│   │   ├── ReadinessSection.tsx    # Container for Feature 3
│   │   ├── QuizEngine.tsx          # 8Q state machine + back button
│   │   ├── ScoreAnimation.tsx      # requestAnimationFrame counter
│   │   └── ResultCard.tsx          # Shareable result card
│   ├── about/
│   │   └── AboutSection.tsx        # "Why I Built This" closing section
│   └── ui/
│       ├── StreamingText.tsx       # Text + blinking cursor
│       ├── GlowCard.tsx            # Dark card with glow border
│       ├── SectionLabel.tsx        # "FEATURE 01 —" monospace labels
│       └── LoadingPulse.tsx        # Animated loading state
├── lib/
│   ├── claude.ts                   # Anthropic SDK client
│   ├── prompts.ts                  # System + user prompt templates
│   ├── tavily.ts                   # Tavily search client + result formatter
│   ├── gtm-nodes.ts               # Node + edge data for SVG diagram
│   └── quiz-data.ts               # Questions, tiers, scoring
├── hooks/
│   ├── useProspectStream.ts        # Fetch + stream consumer + retry logic
│   └── useQuizState.ts             # Quiz state machine
├── types/
│   └── index.ts                    # Shared TypeScript interfaces
├── public/
│   └── og-image.png               # OG image for social sharing
├── .env.local                      # ANTHROPIC_API_KEY + TAVILY_API_KEY
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Color System

| Token | Hex | Usage |
|---|---|---|
| `azx-dark` | `#050810` | Page background |
| `azx-card` | `#0A0F1E` | Card backgrounds |
| `azx-border` | `#1A2340` | Default borders |
| `azx-cyan` | `#00D4FF` | Primary accent, active states |
| `azx-amber` | `#FF8C42` | Secondary accent, energy metaphor |
| `azx-green` | `#00FF88` | Success, complete states |
| `azx-muted` | `#4A5568` | Secondary text |

Typography: `font-mono` for labels/section numbers, Inter/system-sans for body, monospace for streaming output, tabular numerals for scores.

---

## Section Map

```
[ HEADER ] — Sticky, 64px, backdrop-blur. "AZX GTM BRAIN" + anchors.
     │
[ HERO ] — Full viewport. Terminal boot. No date. Three anchor CTAs.
     │
[ PROSPECT INTELLIGENCE ENGINE ] — Feature 1. ~120vh.
     │
[ GTM BRAIN ARCHITECTURE ] — Feature 2. ~100vh.
     │
[ AI READINESS SCORE ] — Feature 3. ~100vh.
     │
[ WHY I BUILT THIS ] — About section. Monospace, tight. Closing context.
     │
[ FOOTER ] — Name + GitHub link.
```

---

## Feature 1: Prospect Intelligence Engine

### Decisions
- **No rate limiting** — dropped entirely. Demo context, single reviewer, no realistic abuse risk. Code comment acknowledges the tradeoff.
- **Industry selector** — replaces the boolean energy toggle. Dropdown: Energy & Utilities / Industrial / Finance / Healthcare / General. Each meaningfully changes the system prompt.
- **Tavily web search** — added before Claude call for live signal grounding.
- **Two-phase loading** — Phase 1: "Searching live signals for [Company]..." (Tavily). Phase 2: "Synthesizing intelligence brief..." (Claude). Pipeline is visible.
- **6 ghost skeletons upfront** — all 6 cards render as dim skeletons immediately on submit. No layout shift. Cards fill as stream arrives.
- **Per-section copy icons** — each card has a copy icon in the top-right corner. No "Copy All." AE copies just the section they need.
- **Silent retry once** — on stream error, retry the full request silently. If retry fails, show error banner above the grid with partial output preserved.
- **AZX context injected** — system prompt includes 2-3 sentences describing AZX's actual positioning so the AZX FIT section is grounded.

### Input
- Company name text input (placeholder: "Try: Schneider Electric, Siemens, EDF...")
- Industry selector dropdown (Energy & Utilities selected by default)
- "Generate Brief" button / Enter key
- Disables on stream start

### Output: 6 Section Cards (2×3 ghost grid)

| # | Section | Icon | Content |
|---|---|---|---|
| 1 | SIGNALS | Radar | 3-5 live signals from Tavily + Claude synthesis |
| 2 | KEY STAKEHOLDERS | People | 3 relevant execs: Name, Title, one-liner |
| 3 | PAIN POINTS | Lightning | 3 pain points tied to AI/energy transformation |
| 4 | AZX FIT | Target | Grounded in AZX's actual positioning |
| 5 | OUTREACH ANGLE | Message | Specific first email hook + subject line |
| 6 | TIMING SIGNALS | Clock | Why now? Regulatory, fiscal, calendar |

### Full Streaming Data Flow

```
User Submit (company + industry)
    │
    ▼
useProspectStream.startStream()
    │ POST /api/prospect
    │ body: { companyName, industry }
    ▼
app/api/prospect/route.ts  [Edge runtime]
    │
    ├─ Zod validate: string min 2, max 100
    │
    ├─ Tavily search: `{companyName} {industry} recent news signals 2025`
    │   Returns: top 5 results { title, url, snippet }
    │
    ├─ Build prompt: inject Tavily results + AZX context + industry focus
    │
    ├─ anthropic.messages.stream({ model: 'claude-sonnet-4-6', messages, max_tokens: 1500 })
    │
    ├─ Custom TransformStream:
    │     for await (event of stream) {
    │       if event.type === 'content_block_delta'
    │          && event.delta.type === 'text_delta'
    │       enqueue(encoder.encode(event.delta.text))
    │     }
    │
    └─ return new Response(transformedStream, { 'Content-Type': 'text/plain; charset=utf-8' })
         │
         ▼
useProspectStream hook [client]
    │ response.body.getReader()
    │ TextDecoder → accumulate to streamContent
    │ AbortController ref → cleanup on unmount/resetStream
    │ On stream error → retry once → if retry fails, set error state
    ▼
ProspectStream component
    │ 6 BriefSectionCard components always rendered (skeleton state)
    │ Section parser: scan for '\n## ' in accumulated text
    │   - Lookahead buffer for delimiter split across chunks
    │   - When found: commit previous section, start new active section
    │   - Map header string → SectionKey enum
    ▼
BriefSectionCard (per section)
    ├─ Skeleton state: dim background, pulse animation
    ├─ Active state: pulsing cyan border, StreamingText renders tokens
    ├─ Complete state: static border, checkmark, copy icon appears
    └─ Copy icon: copies section content as plain text to clipboard
```

### Claude Prompt (`lib/prompts.ts`)

```
SYSTEM:
You are an expert AI GTM strategist specializing in enterprise {industry} technology sales.
AZX is an AI company that helps energy and industrial enterprises accelerate their AI transformation —
from grid modernization to predictive maintenance to intelligent operations. AZX's buyers are
VP-level and above at utilities, industrials, and energy companies undergoing digital transformation.

You produce precise, specific, research-grounded GTM intelligence briefs. Never generic.
Cite observable signals. Output must follow the exact section headers provided.

Grounding data from live search (use this to inform the SIGNALS section):
{tavilyResults}

USER:
Generate a GTM intelligence brief for: {companyName}
Industry focus: {industry}

Sections (in order, using ## headers):
## SIGNALS
## KEY STAKEHOLDERS
## PAIN POINTS
## AZX FIT
## OUTREACH ANGLE
## TIMING SIGNALS

3-5 bullets or 2-3 sentences per section. Specific. The reader is an AE preparing for discovery.
```

### Tavily Integration (`lib/tavily.ts`)

```typescript
// Query: `{companyName} {industry} AI strategy news 2025`
// Returns top 5 results formatted as:
// - [Title] (Source, Date): Snippet
// Injected into Claude prompt as grounding context
// If Tavily fails: proceed without grounding, no user-visible error
```

---

## Feature 2: GTM Brain Architecture

### Decisions
- **65/35 split on node click** — diagram animates to 65% width, NodeDetail panel slides into 35%.
- **Edge highlight pulse** (not dot animation) — "Show Data Flow" toggle pulses edge lines in a wave from Layer 0 → Layer 6, 300ms per layer. Cyan glow, then fades. 30 minutes of CSS, not 4 hours of SVG path work.
- **Short node labels** — max 2 words. No `<foreignObject>`. Pure SVG `<text>` elements. Cross-browser safe.
- **Mobile**: Below 768px, replace SVG entirely with vertical layer cards (collapsible). NodeDetail opens as bottom sheet.

### The Diagram: 7 Layers, 16 Nodes

**Layer 0 — Data Ingestion** (blue `#3B82F6`)
- `Signal Crawler` — Web scraping + news APIs for buying signals
- `CRM Sync` — Bidirectional Salesforce/HubSpot sync
- `Intent Feed` — G2, Bombora, LinkedIn intent signals

**Layer 1 — AI Processing** (cyan `#00D4FF`)
- `Account Scorer` — ML-based fit + timing score
- `Persona Intel` — Exec profiling + communication style
- `Competitive AI` — Battle card automation

**Layer 2 — Content Gen** (teal `#14B8A6`)
- `Outreach AI` — Claude-powered personalized sequences
- `Content AI` — Industry-specific collateral tailoring

**Layer 3 — Orchestration** (purple `#8B5CF6`)
- `GTM Orchestrator` — Central routing: who gets what signal when
- `Workflow Engine` — Trigger logic, handoff rules

**Layer 4 — Execution** (amber `#FF8C42`)
- `Sales Engage` — Sequence execution (Outreach/Salesloft)
- `Paid Amplify` — LinkedIn/Google programmatic ads sync
- `Partner Channel` — Channel partner activation

**Layer 5 — Feedback** (orange `#F97316`)
- `Convo Intel` — Gong/Chorus call analysis
- `Attribution` — Multi-touch revenue attribution

**Layer 6 — Optimization** (green `#00FF88`)
- `GTM Dashboard` — Unified metrics
- `Model Retraining` — Feedback loop closes the cycle

### Edge Connections (key flows)

```
Signal Crawler → Account Scorer
CRM Sync → Account Scorer
Intent Feed → Account Scorer
Account Scorer → GTM Orchestrator
Persona Intel → Outreach AI
Competitive AI → Outreach AI
Outreach AI → Sales Engage
Content AI → Sales Engage
GTM Orchestrator → Sales Engage
GTM Orchestrator → Paid Amplify
GTM Orchestrator → Partner Channel
Sales Engage → Convo Intel
Sales Engage → Attribution
Convo Intel → GTM Dashboard
Attribution → GTM Dashboard
GTM Dashboard → Model Retraining
Model Retraining → Account Scorer  ← closes the loop
```

### Node Data Structure (`lib/gtm-nodes.ts`)

```typescript
interface GTMNode {
  id: string;
  label: string;          // Max 2 words, no foreignObject needed
  layer: number;          // 0-6
  x: number;              // SVG coordinate (0-1000 space)
  y: number;
  purpose: string;        // 1 sentence
  inputs: string[];
  outputs: string[];
  tools: string[];        // Real product names (e.g., "Bombora", "Gong")
  azxRole: string;        // Where AZX AI plugs in at this layer
  color: string;          // Layer accent color
}

interface GTMEdge {
  from: string;
  to: string;
  animated: boolean;      // Pulses during "Show Data Flow" mode
}
```

### SVG Implementation

```
viewBox="0 0 1000 700"
preserveAspectRatio="xMidYMid meet"
width="100%"

Node labels: <text> elements only. Short labels = no wrapping needed.
Background: CSS radial-gradient dot grid (background-image: radial-gradient(circle, #1A2340 1px, transparent 1px))
```

### "Show Data Flow" Edge Pulse Animation

On toggle:
1. All edges reset to dim state
2. Fire layer-by-layer: Layer 0 edges → Layer 1 edges → ... → Layer 6 edges
3. Each layer's edges glow cyan (`box-shadow` / `stroke: #00D4FF`, `filter: drop-shadow(0 0 4px #00D4FF)`) then fade over 600ms
4. Inter-layer delay: 300ms
5. Total animation: ~2.1s, loops while toggle is on
6. Implementation: CSS class toggling + JS setTimeout per layer group

### NodeDetail Panel Content (35% panel)

- Node name (large, colored by layer)
- Purpose (1 sentence)
- Inputs list
- Outputs list
- Tools (real product names)
- "AZX Role" — where AZX's AI changes the economics at this layer

### Mobile Fallback (`MobileLayerCards.tsx`)

- Visible below `md` breakpoint
- 7 collapsible cards, one per layer
- Each card shows: layer name + color, list of nodes
- Tapping a node opens a bottom sheet with NodeDetail content
- No SVG rendered on mobile

---

## Feature 3: AI Readiness Score

### Decisions
- **Back button added** — visible after Q2. Allows correction without breaking flow.
- **Reframed as prospect tool** — intro copy changed: "Think of your highest-priority target account. Answer for them." Evaluator is acting as an AE doing discovery, not self-evaluating.
- **Tier 4 result made provocative** — challenges sophisticated audiences.

### The 8 Questions (unchanged from original spec)

Q1 — Prospect Identification
Q2 — Outreach Personalization
Q3 — Competitive Intelligence
Q4 — Trigger Response Speed
Q5 — Revenue Attribution
Q6 — Content Personalization
Q7 — Conversation Intelligence
Q8 — Stack Integration

*(See original spec for full answer options and scoring 1-4)*

### Quiz Intro Copy (updated)

> "Think of your highest-priority target account right now.
> Answer the next 8 questions for them — not for yourself.
> You'll get a GTM intelligence score and a clear picture of their AI readiness."

### Scoring Tiers

| Score | Tier | Color |
|---|---|---|
| 8–13 | Manual Operator | `#FF4444` |
| 14–19 | Emerging Stack | `#FF8C42` |
| 20–25 | AI-Assisted | `#FFD700` |
| 26–32 | AI-Native GTM | `#00D4FF` |

### Updated Tier 4 Result (Provocative for Experts)

> "Your target account is operating at the frontier. The question isn't whether they use AI — it's whether they're capturing the proprietary data those AI systems produce. That data is the next competitive moat. Are they building it, or feeding someone else's model?"
>
> Recommendations:
> - Map what proprietary data their AI stack generates today
> - Identify where data capture is leaking to vendors
> - Build the case for a unified data layer before the next budget cycle

### Quiz State Machine

```
IDLE
  │ startQuiz()
  ▼
QUESTION(n)  [0-7]
  │ selectAnswer(value) → auto-advance after 400ms
  │ back() → go to QUESTION(n-1), n > 0
  ▼
CALCULATING  [1.5s delay, score computed]
  ▼
RESULT
  │ resetQuiz()
  ▼
IDLE
```

### Interaction Flow

1. Intro screen with framing copy + "Start" button
2. One question at a time, slide-in from right animation
3. Back button visible from Q2 onward (subtle, top-left of question card)
4. Answer selection: immediate glow on selected option
5. Auto-advance after 400ms
6. Progress bar fills across top
7. "Calculating your target account's GTM intelligence quotient..." (1.5s)
8. Score animates 0 → actual (800ms, `requestAnimationFrame`)
9. Tier label fades in with color
10. Result card: score, tier, description, 3 recommendations
11. "Retake Assessment" button resets to IDLE

---

## Component Breakdown

### UI Primitives

**GlowCard.tsx** — `children`, `glowColor` (default cyan), `intensity` (low/mid/high). Box-shadow glow.

**StreamingText.tsx** — `text`, `isActive`. Blinking cursor while active. `whitespace-pre-wrap`.

**SectionLabel.tsx** — `number` ("01"), `label`. Monospace "FEATURE 01 —" rendering.

**LoadingPulse.tsx** — `message` (string). Three-dot pulse.

### Hook Interfaces

```typescript
// useProspectStream.ts
interface UseProspectStreamReturn {
  streamContent: string;
  isStreaming: boolean;
  isComplete: boolean;
  loadingPhase: 'idle' | 'searching' | 'synthesizing';  // two-phase loading
  error: string | null;
  startStream: (companyName: string, industry: string) => void;
  resetStream: () => void;
}
// Retry logic: on stream error, automatically retry once before setting error state
// AbortController: cleanup on unmount and resetStream

// useQuizState.ts
interface UseQuizStateReturn {
  phase: 'idle' | 'question' | 'calculating' | 'result';
  currentQuestion: number;
  answers: number[];       // sparse array, supports back-navigation
  score: number;
  tier: TierData | null;
  selectAnswer: (value: number) => void;
  back: () => void;        // NEW: go to previous question
  startQuiz: () => void;
  resetQuiz: () => void;
}
```

---

## Technical Configuration

### Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "@anthropic-ai/sdk": "^0.27.0",
    "react": "^18",
    "react-dom": "^18",
    "zod": "^3.22.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

Tavily: called via `fetch` directly (no SDK needed — simple REST call, keeps deps lean).
No animation library. All animations via Tailwind + custom CSS keyframes.

### Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
```

Both server-side only. Never shipped to client.

### Tailwind Extensions

```typescript
colors: {
  'azx-dark': '#050810',
  'azx-card': '#0A0F1E',
  'azx-border': '#1A2340',
  'azx-cyan': '#00D4FF',
  'azx-amber': '#FF8C42',
  'azx-green': '#00FF88',
  'azx-muted': '#4A5568',
},
animation: {
  'cursor-blink': 'blink 1s step-end infinite',
  'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
  'glow-pulse': 'glowPulse 2s ease-in-out infinite',
  'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
},
keyframes: {
  blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
  fadeInUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  glowPulse: { '0%, 100%': { boxShadow: '0 0 8px #00D4FF40' }, '50%': { boxShadow: '0 0 20px #00D4FF80' } },
  skeletonPulse: { '0%, 100%': { opacity: '0.3' }, '50%': { opacity: '0.6' } },
}
```

---

## Hero Section

```
[monospace label]  CANDIDATE BRIEF v1.0           ← no date

[large display]    GTM Brain
[large display, cyan]  for AZX

[subtitle, muted]  This is what AI-native go-to-market looks like.
[subtitle, muted]  Not slides. Not a PDF. A working system.

[candidate]  Built by Abdul Shaik  |  Applying for: AI GTM Engineer

[CTAs]
  [Run Intelligence Engine →]  [See Architecture →]  [Take Assessment →]
```

Background: radial gradient from near-black center to deep navy edges. Three slow radar-ping circle animations (scale + opacity, ~3s loop, staggered).

---

## About Section ("Why I Built This")

Monospace aesthetic. After the three features.

```
CANDIDATE BRIEF — APPROACH NOTES

Why Prospect Intelligence first:
The centerpiece isn't a demo of Claude — it's a demo of prompt engineering for GTM.
The Tavily → Claude pipeline shows how I'd actually build a signal-to-brief workflow for AZX's team.

Why the Architecture diagram:
I've seen too many GTM architecture slides with boxes and no depth.
Every node here has a purpose, real tools, and a specific place where AI changes the economics.

Why the Readiness Score:
AZX sells to enterprises at every stage of AI adoption. This tool qualifies them in 2 minutes.
I'd build this for AZX's own demand gen pipeline from day one.

[GitHub →]  [LinkedIn →]
```

---

## Build Order

1. `types/index.ts` — all interfaces (GTMNode, GTMEdge, TierData, SectionKey, etc.)
2. `lib/quiz-data.ts` — questions, tier thresholds, tier copy
3. `lib/gtm-nodes.ts` — all 16 nodes + edges with coordinates
4. `lib/prompts.ts` — system + user prompt templates
5. `lib/tavily.ts` — Tavily fetch + result formatter
6. `lib/claude.ts` — Anthropic client
7. `app/api/prospect/route.ts` — Edge route: Tavily → TransformStream → Claude
8. `app/globals.css` — custom keyframes
9. `tailwind.config.ts` — theme extensions
10. UI primitives: GlowCard, StreamingText, SectionLabel, LoadingPulse
11. `components/hero/HeroSection.tsx`
12. `components/prospect/*` — ProspectEngine, ProspectInput, ProspectStream, BriefSectionCard
13. `hooks/useProspectStream.ts`
14. `components/gtm-brain/*` — ArchitectureDiagram, NodeDetail, MobileLayerCards, GTMBrainSection
15. `components/readiness/*` — QuizEngine, ScoreAnimation, ResultCard, ReadinessSection
16. `hooks/useQuizState.ts`
17. `components/about/AboutSection.tsx`
18. `components/layout/Header.tsx` + `Footer.tsx`
19. `app/layout.tsx` — metadata, OG tags
20. `app/page.tsx` — final assembly

---

## Deployment

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=no --import-alias="@/*"
npm install @anthropic-ai/sdk zod clsx tailwind-merge

# Local dev
npm run dev

# Deploy
npx vercel
vercel env add ANTHROPIC_API_KEY
vercel env add TAVILY_API_KEY
vercel --prod
```

---

## Known Implementation Details

**Custom TransformStream (server)**
```typescript
const { readable, writable } = new TransformStream();
const writer = writable.getWriter();
const encoder = new TextEncoder();

(async () => {
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      await writer.write(encoder.encode(event.delta.text));
    }
  }
  await writer.close();
})();

return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
```

**Section parser (client)**
- Accumulate all received text into one string
- On each chunk: scan for `\n## ` in the accumulated + new content
- Use a 4-char rolling buffer to handle delimiters split across chunks
- Never commit a section split until newline after header confirmed

**Edge highlight pulse (SVG)**
```typescript
// On "Show Data Flow" toggle:
const layers = [0, 1, 2, 3, 4, 5, 6];
layers.forEach((layer, i) => {
  setTimeout(() => {
    // Add 'data-flow-active' class to all edges originating from this layer
    // CSS: .data-flow-active { stroke: #00D4FF; filter: drop-shadow(0 0 4px #00D4FF); }
    // Remove class after 600ms
  }, i * 300);
});
```

**Tavily fallback**
- If Tavily call fails for any reason: proceed without grounding
- Claude prompt omits the grounding data section
- No user-visible error (the brief is still useful without live signals)

**AbortController cleanup**
```typescript
useEffect(() => {
  return () => { abortControllerRef.current?.abort(); };
}, []);
```

---

## GitHub README Outline

```markdown
# AZX GTM Brain

A working AI GTM intelligence system built as a job application for AZX's AI GTM Engineer role.

## What It Does
- Prospect Intelligence Engine: Tavily search → Claude synthesis → structured GTM brief
- GTM Architecture: Interactive SVG diagram of a full AI-powered sales stack
- AI Readiness Score: 8-question prospect qualification tool

## Tech Decisions
- Edge runtime for streaming (avoids Vercel's 10s serverless timeout)
- Custom TransformStream instead of raw SSE passthrough (clean text deltas to client)
- No rate limiting — single-reviewer demo, explicitly acknowledged tradeoff
- Tavily for live search grounding; falls back gracefully if unavailable
- SVG with short node labels instead of foreignObject (Safari compatibility)

## Running Locally
cp .env.example .env.local
# Add ANTHROPIC_API_KEY and TAVILY_API_KEY
npm install && npm run dev
```

---

## Application Strategy

**Step 1:** LinkedIn DM to hiring manager.
> "Applied for AI GTM Engineer. Built a working demo instead of a cover letter: [URL]. Takes about 4 minutes to explore all three tools."

**Step 2:** The page itself is the application. "Why I Built This" section at the bottom serves as approach notes — no separate writeup needed.

---

*Spec finalized post-interview. All decisions locked.*
