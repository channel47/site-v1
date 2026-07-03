---
title: Creative Strategist
slug: creative-strategist
description: "A voice-of-customer creative pipeline — reviews and threads mined into personas, ranked angles, and a build-ready advertorial, with every claim traced to a real quote."
repo: https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist
install: npx skills add channel47/skills --skill creative-strategist
date: 2026-07-02
tags: [creative-strategy, voice-of-customer, personas, ad-angles, advertorial, dtc]
---

The best ad angles aren't brainstormed — they're mined. This skill systematizes a
voice-of-customer pipeline so the research corners can't get cut: it pulls real
customer language from product reviews, competitor reviews, and Reddit threads,
then works it into personas, ranked angles, and a build-ready advertorial.
Research first, write last.

## What it does

- Runs four stages — **research → personas → angles → advertorial** — as one
  pipeline or one stage at a time, accumulating everything in a single dossier
  file per product (`creative/[product-slug]-dossier.md`).
- Enforces a traceability law: every quote is pulled verbatim, tagged with an
  intensity rating (🔥1 calm fact → 🔥3 visceral story) and a buyer-journey
  stage, and given a stable ID. Every downstream claim — persona trait, angle,
  headline — must cite the quote IDs it stands on. No quote, and it's labeled
  speculative out loud.
- Fabricating reviews or stats is explicitly forbidden, and it self-audits its
  intensity ratings if too many quotes read as maximum-heat.
- Builds personas including **anti-personas** — the people who'll never buy and
  only raise your CAC.
- Ranks angles with hooks, each anchored to quotes and each with a documented
  failure mode, then drafts an advertorial with a proof ledger: every claim
  marked proven, needs-source, or remove.
- Re-running research gives new quotes fresh IDs and flags stale downstream
  sections until they're rebuilt.

## Setup

Works in Claude Code, Cursor, Cline, Windsurf, Codex CLI — anything that reads
`SKILL.md` files. No credentials needed. A sample dossier ships in the repo.
