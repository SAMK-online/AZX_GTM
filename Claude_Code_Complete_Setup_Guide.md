# Claude Code: Complete Setup Guide

*Compiled from official Anthropic docs, Manthan Patel's .claude folder guide, and community best practices (March 2026)*

---

## 1. Installation

### Prerequisites

- **OS**: macOS 13+, Ubuntu 20.04+/Debian 10+, or Windows 10+ with WSL2
- **RAM**: 4GB minimum, 8GB recommended
- **Account**: Claude Pro ($20/mo), Claude Max ($100-200/mo), Teams, Enterprise, or Console (API)
- **No GPU needed**. All inference runs on Anthropic's servers.

### Recommended: Native Installer (no Node.js required)

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex
```

This auto-updates in the background. No dependency management.

### Alternative: npm (if you need version pinning)

```bash
# Requires Node.js 18+
npm install -g @anthropic-ai/claude-code
# NEVER use sudo with npm install
```

### Alternative: Homebrew (macOS/Linux)

```bash
brew install --cask claude-code
# Note: does NOT auto-update. Run `brew upgrade claude-code` manually.
```

### Verify + Authenticate

```bash
claude --version
claude doctor    # checks environment for issues
claude           # first run opens browser for auth
```

---

## 2. The Full Architecture

Claude Code is not just a chatbot in a terminal. It is a programmable platform with six layers of customization:

```
your-project/
├── CLAUDE.md                    # The project brain (loaded EVERY session)
├── CLAUDE.local.md              # Your personal project notes (gitignored)
├── .claude/
│   ├── agents/                  # Specialist subagents
│   │   ├── code-reviewer.md
│   │   ├── debugger.md
│   │   ├── test-writer.md
│   │   └── ...
│   ├── commands/                # Custom slash commands (now merged into skills)
│   │   ├── fix-issue.md
│   │   ├── deploy.md
│   │   └── pr-review.md
│   ├── hooks/                   # Deterministic scripts (MUST run, no exceptions)
│   │   ├── pre-commit.sh
│   │   └── lint-on-save.sh
│   ├── rules/                   # Context-aware instructions (path-matched)
│   │   ├── frontend.md
│   │   ├── database.md
│   │   └── api.md
│   ├── skills/                  # On-demand knowledge packs
│   │   └── frontend-design/
│   │       └── SKILL.md
│   ├── settings.json            # Project-level permissions + hooks config
│   └── settings.local.json      # Personal project settings (gitignored)
│
~/.claude/                        # GLOBAL (applies to ALL projects)
├── CLAUDE.md                     # Global instructions for every project
├── settings.json                 # Global user settings
├── settings.local.json           # Local user settings (not synced)
├── agents/                       # Personal agents available everywhere
└── .credentials.json             # API credentials (Linux/Windows)
```

### Key Concept: CLAUDE.md vs MEMORY.md

- **CLAUDE.md** = what YOU write. Shared with your team via git. Your project's standing brief.
- **MEMORY.md** = what Claude writes automatically. Located at `~/.claude/projects/{project}/memory/`. Claude's personal notebook about your preferences. First 200 lines loaded each session.

### Key Concept: Deterministic vs Probabilistic

| Layer | Type | Behavior |
|-------|------|----------|
| CLAUDE.md | Always loaded | Read every session, survives /compact |
| Hooks | Deterministic | Run every time, zero exceptions |
| Rules | Auto-loaded | Triggered by file path matching |
| Skills | Probabilistic | Claude decides when to invoke |
| Agents | On-demand | Separate context window, delegated tasks |

---

## 3. CLAUDE.md: The Project Brain

This is the single most important file. It loads into Claude's system prompt before your first message every session. It also survives compaction (when context fills up and /compact runs, CLAUDE.md gets re-injected fresh).

### Creating It

```bash
cd your-project
claude
# then run:
/init
```

Claude scans your project and generates a starter CLAUDE.md. For existing codebases, let it analyze your real files first.

### What to Put In It

Keep it under 200 lines. Use @imports for details.

```markdown
# Project Brain

## Stack
Next.js 14, TypeScript strict, Tailwind + shadcn/ui, Supabase, Stripe, Vercel

## Commands
npm run dev    # Start dev server on port 3000
npm run build  # Production build
npm test       # Run Jest tests
npm run lint   # ESLint check

## Architecture
- App Router with server components by default
- Database access only through Drizzle ORM in server components/actions
- Authentication via Clerk
- All API routes in src/app/api/

## Conventions
- TypeScript strict mode, no `any` types
- Zustand for global state, no prop drilling
- Dark mode first
- Functional components + hooks only
- Functions under 50 lines
- Commit messages: imperative mood, < 72 chars

## Do NOT
- Modify files in src/legacy/
- Use default exports (named exports only)
- Add dependencies without asking first
```

### Multi-level CLAUDE.md Files

Claude reads CLAUDE.md hierarchically. Root rules apply everywhere; subdirectory rules apply only when working in that directory:

```
/CLAUDE.md                    # Project-wide rules
/frontend/CLAUDE.md           # Only when editing frontend files
/services/auth/CLAUDE.md      # Only when working on auth service
```

### @imports for Modularity

```markdown
# CLAUDE.md
@.claude/rules/frontend.md
@.claude/rules/database.md
@.claude/rules/security.md
```

---

## 4. Rules (Path-Matched Auto-Loading)

Rules are instruction files that Claude loads automatically based on which files you are editing. They keep your CLAUDE.md lean.

### Location: `.claude/rules/frontend.md`

```yaml
---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
---
# Frontend Rules

- Functional components + hooks only
- shadcn/ui for primitives, never build from scratch
- Tailwind CSS, dark mode first
- Zustand for global state, no prop drilling
- cn() for conditional classes
- next/image for all images
```

When you edit any `.tsx` file in `components/` or `app/`, Claude automatically loads these rules. No manual invocation needed.

### Recommended Rule Files

- `frontend.md` - UI/component conventions
- `database.md` - Query patterns, migration rules, ORM usage
- `api.md` - Endpoint conventions, auth requirements, error formats

---

## 5. Skills (On-Demand Knowledge Packs)

Skills are knowledge bases Claude draws from when it recognizes a matching situation. Think of them as "how-to" manuals Claude consults automatically.

### Location: `.claude/skills/frontend-design/SKILL.md`

```yaml
---
name: frontend-design
description: Apply exact design standards to any UI. Use when building
  landing pages, dashboards, or any user-facing interface.
user-invocable: true
---
# Design System

Colors: #FF6B35 primary, #0A0A0F background, rgba(255,255,255,0.04) surfaces
Typography: Inter, -0.02em tracking, 48-64px hero, 15-16px body
Spacing: 64px sections, 24px card padding, 16px border radius
Dark mode: Never flat black. Depth through gradients, glows, borders.
Animations: Framer Motion, stagger children by 0.1s
```

### Skills vs CLAUDE.md

- **CLAUDE.md**: Always loaded. Use for rules that apply to nearly every task.
- **Skills**: Loaded on-demand. Use for specific workflows that only matter sometimes.

Putting too much in CLAUDE.md wastes context every turn. Move specialized knowledge into skills.

### Making Skills More Reliable

Auto-invocation depends on Claude matching the skill description to the current task. To improve reliability, add a list of your skills to your CLAUDE.md:

```markdown
## Available Skills
- frontend-design: UI standards, colors, spacing
- api-testing: Endpoint testing patterns
- deployment: CI/CD and deploy workflows
```

---

## 6. Agents (Specialist Subagents)

Agents are separate Claude Code instances with their own context window. They handle focused tasks without polluting your main session.

### Location: `.claude/agents/code-reviewer.md`

```yaml
---
name: code-reviewer
description: Reviews code for bugs and security issues before merge.
tools: Read, Glob, Grep, Bash
model: sonnet
memory: project
---
You are a senior code reviewer.

Step 1: Run `git diff HEAD~1`, read every changed file.
Step 2: Security scan - grep for hardcoded keys, check Zod validation, verify auth.
Step 3: Performance - no unnecessary re-renders, images use next/image.
Step 4: Quality - no `any` types, functions under 50 lines, no duplication.
Step 5: Report as CRITICAL / WARNING / SUGGESTION. Block if CRITICAL found.
```

### Agent Frontmatter Fields

| Field | Purpose |
|-------|---------|
| `tools` | Which tools the agent can access |
| `model` | sonnet, opus, or haiku |
| `memory` | `user` (global) or `project` (per-repo) memory persistence |
| `maxTurns` | Max steps before stopping |
| `hooks` | Agent-specific PreToolUse hooks for validation |

### Creating Agents

```bash
# Interactive creation
/agents
# Select "Create new agent" > Personal or Project
# Choose "Generate with Claude" and describe the agent
```

### Recommended Agent Team

1. **code-reviewer** - Pre-merge quality + security checks
2. **debugger** - Root cause analysis on failing tests/errors
3. **test-writer** - Generate regression tests for new code
4. **refactorer** - Clean up code while preserving behavior
5. **doc-writer** - Generate/update documentation from code changes
6. **security-auditor** - Deep security analysis

### When to Use Agents vs Skills

- Need a **separate context window** (heavy research, parallel work)? Use an agent.
- Need **specialized knowledge** for the current task? Use a skill.
- Need **deterministic enforcement**? Use a hook.

---

## 7. Commands (Slash Commands)

Commands are saved prompts you trigger with `/command-name`. They are now part of the skills system but the pattern remains the same.

### Location: `.claude/commands/fix-issue.md`

```yaml
---
name: fix-issue
argument-hint: [issue-number]
---
Fix GitHub issue #$ARGUMENTS:

1. `gh issue view $ARGUMENTS` - read the issue
2. Find relevant source files
3. Implement the minimal fix
4. Write a regression test
5. `npm test` - all green
6. Commit: "fix: description (closes #$ARGUMENTS)"
```

**Usage**: Type `/fix-issue 42` and Claude handles the rest.

### Recommended Commands

- `/fix-issue [number]` - End-to-end issue resolution
- `/deploy` - Run build, test, push, deploy sequence
- `/pr-review` - Comprehensive PR review checklist

---

## 8. Hooks (Deterministic Enforcement)

Hooks are shell scripts that run automatically at specific lifecycle points. They are NOT suggestions. They execute every time, with zero exceptions.

### Key Principle

- **Skills/CLAUDE.md** = "should do" (probabilistic)
- **Hooks** = "must do" (deterministic)

### Location: `.claude/hooks/pre-commit.sh`

```bash
#!/bin/bash
# Before EVERY commit: type check > lint > test
# If anything fails, commit is BLOCKED.

npx tsc --noEmit || exit 2
npx eslint $(git diff --cached --name-only | grep -E "\.(ts|tsx)$") --quiet || exit 2
npm test -- --silent || exit 2

echo "All checks passed!"
exit 0
```

**Exit codes**: `0` = allow, `2` = block the action.

### Configuring Hooks in settings.json

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/pre-commit.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/lint-on-save.sh"
      }]
    }]
  }
}
```

### Hook Lifecycle Events (17 total)

The main ones you will use:

- **PreToolUse** - Before any tool executes (block destructive commands)
- **PostToolUse** - After a tool executes (auto-format, lint)
- **SessionEnd** - When a session closes

### Best Practice: Block at Commit, Not at Write

Blocking mid-write confuses the agent. Let Claude finish its work, then validate at commit time:

```
PreToolUse hook on Bash(git commit) > runs tests > blocks if failing
```

This forces Claude into a "test-and-fix" loop until the build is green.

---

## 9. settings.json (The Control Center)

### Location: `.claude/settings.json` (project) or `~/.claude/settings.json` (global)

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(npm run build)",
      "Bash(npx playwright test *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git status)",
      "Bash(gh issue *)",
      "Bash(gh pr *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(secrets/**)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(curl *)"
    ]
  },
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/pre-commit.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/lint-on-save.sh"
      }]
    }]
  },
  "model": "claude-sonnet-4-6",
  "autoMemoryEnabled": true
}
```

### Precedence (highest to lowest)

1. **Managed settings** (enterprise/MDM)
2. **Project settings** (`.claude/settings.json`)
3. **User settings** (`~/.claude/settings.json`)

If a permission is allowed in user settings but denied in project settings, the project setting wins.

---

## 10. MCP Servers (External Tool Integration)

MCP (Model Context Protocol) servers extend Claude Code with access to external tools and data sources.

### User-Scoped MCP Servers (all projects)

File: `~/.claude.json` (NOT inside `~/.claude/`)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/you/Documents"]
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

### Project-Scoped MCP Servers

File: `.claude/mcp.json` (commit this for team-wide MCP servers)

Claude loads servers from BOTH files. Project servers supplement user servers.

### Recommended MCP Servers for Your Stack

Given your work with LangGraph, FastAPI, and multi-agent systems:

- **Exa** - Semantic web search (you already use this)
- **Context7/Ref** - Documentation fetching (you already use this)
- **Semgrep** - Static analysis (you already use this)
- **GitHub MCP** - Issue/PR management directly from Claude
- **Supabase MCP** - Direct database access if using Supabase

---

## 11. Quick Setup Script

Run this from your project root to scaffold the entire structure:

```bash
mkdir -p .claude/{agents,commands,hooks,rules,skills/frontend-design}
touch .claude/agents/{code-reviewer,debugger,test-writer,refactorer,doc-writer,security-auditor}.md
touch .claude/commands/{fix-issue,deploy,pr-review}.md
touch .claude/hooks/{pre-commit,lint-on-save}.sh
touch .claude/rules/{frontend,database,api}.md
touch .claude/skills/frontend-design/SKILL.md
touch .claude/settings.json CLAUDE.md
chmod +x .claude/hooks/*.sh
```

Then populate each file using the templates above.

---

## 12. Essential Slash Commands Reference

| Command | What It Does |
|---------|-------------|
| `/init` | Generate CLAUDE.md from your codebase |
| `/config` | Open settings interface |
| `/compact` | Summarize session to free context (CLAUDE.md re-injected) |
| `/agents` | Create/manage subagents interactively |
| `/hooks` | Configure hooks interactively |
| `/help` | Show all available commands |
| `/clear` | Start fresh conversation |
| `#` | Quick-add instruction to CLAUDE.md mid-session |
| `claude --resume` | Resume previous session |
| `claude --continue` | Continue last session |

---

## 13. Decision Framework: Which Layer to Use?

```
Is it needed EVERY session?
  YES > Put in CLAUDE.md (keep it under 200 lines)
  NO  > Continue...

Must it run 100% of the time with zero exceptions?
  YES > Use a Hook (deterministic, exit code 2 blocks)
  NO  > Continue...

Does it match specific file paths?
  YES > Use a Rule (auto-loaded by path)
  NO  > Continue...

Is it specialized knowledge for certain situations?
  YES > Use a Skill (probabilistic, Claude decides when)
  NO  > Continue...

Does it need a separate context window or parallel execution?
  YES > Use an Agent (separate instance)
  NO  > Continue...

Is it a repeatable prompt you type often?
  YES > Use a Command/Skill with user-invocable: true
```

---

## 14. Pro Tips

1. **CLAUDE.md survives compaction.** Chat instructions do not. Anything important goes in CLAUDE.md, not typed in conversation.

2. **Keep CLAUDE.md lean.** Under 200 lines. Use @imports and skills for details. Long files get ignored.

3. **Use `claude --resume` for learning.** Resume old sessions to ask Claude to summarize how it solved a problem. Use those insights to improve your CLAUDE.md.

4. **Block at commit, not at write.** PreToolUse hooks on `Bash(git commit)` create a test-and-fix loop. Blocking mid-write confuses the agent.

5. **Skill descriptions are targeting instructions.** Vague descriptions fire on everything. Specific descriptions (file types, directories, action contexts) fire only when relevant.

6. **Review CLAUDE.md like code.** When Claude makes a mistake a rule would have prevented, add the rule. When Claude does something correctly without a rule, remove the redundant instruction.

7. **Agents get separate context.** Use them for heavy research or parallel work so your main session stays clean.

8. **Press `#` during any session** to add a quick instruction to CLAUDE.md without leaving the conversation.

9. **`claude doctor`** auto-detects most configuration issues. Run it before debugging manually.

10. **`.claudeignore`** works like `.gitignore`. Exclude `node_modules/`, `dist/`, `build/`, `.git/`, `coverage/` to reduce token usage by 50-70%.

---

*Sources: [Anthropic Official Docs](https://code.claude.com/docs/en/settings), [Manthan Patel's .claude Folder Setup](https://resources.leadgenman.com/ClaudeFolderSetup), [Morphllm CLAUDE.md Guide](https://www.morphllm.com/claude-md-guide), [Shrivu Shankar's Feature Guide](https://blog.sshh.io/p/how-i-use-every-claude-code-feature), community resources.*
