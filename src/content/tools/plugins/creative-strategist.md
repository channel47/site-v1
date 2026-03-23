---
name: "Creative Strategist"
description: "Customer voice research, persona building, and angle generation from real public data. Turns Reddit threads, Amazon reviews, and forum posts into actionable creative strategy."
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["research", "customer-voice", "personas", "angles", "creative-strategy", "dtc", "market-research", "plugin"]
featured: true
status: "live"
install: "claude plugin install creative-strategist@channel47"
compatibleWith: ["Claude Code"]
relatedTools: ["media-buyer", "frontend-designer"]
---

## What it does

The Creative Strategist plugin runs a three-stage pipeline that takes a product or market and produces testable creative angles backed by real customer data:

1. **Research** — scrapes real customer language from Reddit, Amazon, Trustpilot, forums, and review sites
2. **Personas** — synthesizes research into 2-4 data-driven buyer personas
3. **Angles** — produces scored, ranked advertising angles tied to personas

No API keys. No MCP servers. Install and run `/full-pipeline [product]`.

## How it works

The plugin uses web search and browser automation to find real customer conversations across platforms. Some sites (Trustpilot, forums) are accessible directly. Others (Reddit, Amazon) need browser tools — if you have Playwright or similar installed, the plugin uses them automatically. If not, it falls back to search engine snippets.

Every customer quote is tagged with its source quality — direct access, search snippet, or quoted in an article — so you know exactly how reliable each data point is.

## Commands

`/research [product]` — Fetch customer voice data from public sources. Outputs `[product]-research.md`.

`/personas` — Build buyer personas from research data. Outputs `[product]-personas.md`.

`/angles` — Generate creative angles from personas. Outputs `[product]-angles.md`.

`/full-pipeline [product]` — Run all three stages in sequence.

## What you get

**Research output** — 30+ tagged customer quotes organized by pain points, desires, objections, trigger events, competitor mentions, and demographic signals.

**Personas** — 2-4 buyer personas with internal monologues written in real customer language, ranked pain points, objection maps, and ad responsiveness signals.

**Angles** — 5-8 scored creative angles with strategic framing, supporting evidence from research, example hook directions, and platform fit assessment.

## Configuration

Create `.claude/creative-strategist.local.md` in your project with product details, competitors, and target audience. The plugin reads it automatically so you don't repeat context every session.
