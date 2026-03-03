---
name: "Frontend Craft"
description: "Claude Code plugin for designing, building, reviewing, and polishing web UIs — seven skills and two agents covering design systems, component architecture, page composition, accessibility, responsive, and polish"
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["frontend", "design", "ui", "design-system", "accessibility", "responsive"]
featured: false
status: "live"
install: "/plugin install frontend-craft@channel47"
compatibleWith: ["Claude Code"]
relatedTools: ["paid-search"]
---

## What it does

Frontend Craft gives Claude a complete frontend design workflow. Not just code generation — structured design thinking. Design system constraints, density-mapped layouts, accessibility audits, responsive checks, and a polish pass that catches every missing hover state, loading skeleton, and empty state.

Built from shipping real sites (Astro, Next.js, React) where the gap between "it works" and "it feels good" kept eating hours.

## Skills included

Seven skills, each handling a distinct layer of the frontend workflow:

**design-system** — Generate and enforce a `.design-system.json` constraint file. Caps colors at 12-15, fonts at 2, accent at 1. Outputs Tailwind config and CSS custom properties. Design system = constraint budget, not style guide.

**component-craft** — Build accessible components following the design system. Semantic HTML first, variants via `cva`, four states on every interactive element (default, hover, focus, disabled), `forwardRef` on everything.

**page-compose** — Assemble pages with intentional density rhythm. Maps HIGH/MEDIUM/LOW zones, varies container widths, places exactly one rupture per page. Landing, dashboard, settings, editorial — each page type has a density signature.

**visual-review** — Five-layer visual audit: spacing, typography hierarchy, color contrast, visual rhythm, and polish. Confidence-scored findings — only reports issues at 70+ confidence.

**polish** — The final 10%. Interactive states, transitions (150-300ms, GPU-accelerated), skeleton loading, empty states, error states, micro-interactions, and edge cases like text overflow and missing images.

**accessibility** — Deep a11y audit beyond automated tools. Semantic HTML, keyboard navigation, screen reader experience, color contrast, and responsive accessibility. Priority-ranked P0-P4.

**responsive** — Audit across 320px to 2560px. Touch targets, typography scaling, spacing compression, layout reflow, and interactive component behavior across mobile, tablet, and desktop.

## Agents

Two agents run during the workflow:

- **pattern-scout** — Reverse-engineers the existing design language from your codebase before building anything new. Extracts colors, typography, spacing, component patterns, and inconsistencies.
- **design-critic** — Reviews UI code for visual quality and design consistency. Checks spacing, typography, color, interactive states, and pattern consistency with confidence scoring.

## Hook

A PostToolUse hook monitors all Write/Edit operations on frontend files (tsx, jsx, vue, svelte, astro, css). Flags hardcoded hex colors, hardcoded pixel spacing, and missing `focus-visible` styles in real time.

## Getting started

Install the plugin:

```
/plugin install frontend-craft@channel47
```

Run `/frontend-craft` to start the full 8-phase workflow, or invoke individual skills directly:

- `/frontend-craft:design-system` — Set up your design tokens
- `/frontend-craft:component-craft` — Build a component
- `/frontend-craft:page-compose` — Compose a full page
- `/frontend-craft:visual-review` — Audit visual quality
- `/frontend-craft:polish` — Add states, transitions, edge cases
- `/frontend-craft:accessibility` — Deep a11y audit
- `/frontend-craft:responsive` — Check all breakpoints
