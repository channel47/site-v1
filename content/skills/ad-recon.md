---
title: Ad Recon
slug: ad-recon
description: "Collects competitor ads from public libraries and maps the angles and formats competitors are using."
repo: https://github.com/channel47/skills/tree/main/skills/creative-strategy/ad-recon
install: npx skills add channel47/skills --skill ad-recon
date: 2026-07-05
tags: [creative-strategy, competitor-research, ad-libraries, ad-angles]
pairing: "Requires access to the public ad libraries used in a run. Writes to the same product dossier as Creative Strategist."
---

Ad Recon gathers current competitor ads and adds a classified competitive view
to a product's creative dossier.

## Workflow

- Takes competitor targets from `brand/context.md`, an existing dossier, or
  user input.
- Records captured ads with stable IDs, verbatim copy, platform, format, and
  source URLs.
- Classifies ads by angle and awareness stage.
- Produces competitor patterns, a saturation map, coverage notes, and possible
  openings for further testing.
