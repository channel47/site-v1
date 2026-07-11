---
title: "/brief-me — Give your agent the context it needs"
slug: brief-me
description: "Runs a structured discovery interview and writes shared brand context for other creative-strategy skills."
repo: https://github.com/channel47/skills/tree/main/skills/creative-strategy/brief-me
install: npx skills add channel47/skills --skill brief-me
date: 2026-07-03
tags: [creative-strategy, discovery, brand-context, briefing]
pairing: "No credentials required. Writes `brand/context.md` for Creative Strategist and Ad Recon."
---

Brief Me gathers the brand, offer, audience, proof, competitor, voice, and
constraint information needed by the other creative-strategy skills.

## Workflow

- Asks one discovery question at a time and challenges vague answers.
- Checks supplied sites, ads, reviews, and existing dossiers when they can
  answer a question directly.
- Marks unsupported claims and unresolved details instead of filling gaps.
- Writes the result to `brand/context.md` and lists the remaining open items.
