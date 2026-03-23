---
name: "Frontend Designer"
description: "Design, build, review, and polish web UIs with Claude — seven skills and two agents covering design systems, component architecture, page composition, accessibility, responsive design, and visual polish."
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["frontend", "design", "ui", "design-system", "accessibility", "responsive", "tailwind", "react", "plugin"]
featured: true
status: "live"
install: "claude plugin install frontend-designer@channel47"
compatibleWith: ["Claude Code"]
relatedTools: ["media-buyer", "creative-strategist"]
---

## What it does

The Frontend Designer plugin teaches Claude your design process — from design system creation to final polish. Seven skills auto-activate when you're working on frontend code. Two agents handle specialized review tasks.

No API keys. No MCP servers. No setup. Install and start building.

## Skills

**design-system** — Creates design tokens (colors, typography, spacing, radius, shadows) from scratch or extracts them from existing code. Generates `.design-system.json` for project-wide consistency.

**component-craft** — Builds UI components with proper variant systems, interactive states, accessibility, and design system compliance.

**page-compose** — Plans and builds full pages with density rhythm mapping, responsive behavior, and intentional composition.

**polish** — Adds hover effects, transitions, loading states, empty states, error states, and micro-interactions. The difference between "works" and "feels right."

**responsive** — Audits and fixes layouts across breakpoints. Mobile-first approach with systematic verification.

**accessibility** — WCAG compliance checks — heading hierarchy, focus indicators, ARIA labels, keyboard navigation, color contrast.

**visual-review** — Design quality review for spacing consistency, color usage, typography hierarchy, and interactive states.

## Agents

**design-critic** — Reviews your work for visual quality issues. Reports findings above 70% confidence only — no noise.

**pattern-scout** — Analyzes existing codebases to discover design patterns, conventions, and implicit design systems before you add to them.

## Hook

A PostToolUse hook watches `Write` and `Edit` operations on frontend files. Flags hardcoded colors, magic spacing values, and missing focus styles — keeps your design system honest.
