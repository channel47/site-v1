---
title: Media Buyer
slug: media-buyer
description: "Account checks across Google, Bing, and Meta as one conversational request — budget pacing, anomalies, search terms to negate, with a dry-run-first write protocol."
repo: https://github.com/channel47/skills/tree/main/skills/paid-media/media-buyer
install: npx skills add channel47/skills --skill media-buyer
date: 2026-07-02
tags: [paid-media, google-ads, bing-ads, meta-ads, account-audit, waste-detection]
pairing: "No credentials of its own — needs at least one of the connectors it drives: [google-ads](/connectors/google-ads), [bing-ads](/connectors/bing-ads), or [meta-ads](/connectors/meta-ads)."
---

The looking part of media buying — the morning sweep across every account —
delegated. This skill sits on top of the Channel47 MCP connectors for Google
Ads, Bing Ads, and Meta and turns a multi-account audit routine into one
request: "morning brief on all accounts."

## What it knows

- Checks which platforms are connected, pulls yesterday plus the trailing
  period, and returns **findings**, not screenshots: budget pacing against
  target, anomalies against baseline, search terms that need negation,
  disapprovals, drifting PMax campaigns.
- Ships reference files that carry the judgment: waste-detection thresholds
  with dollar-impact formulas for eight distinct waste types, anomaly detection
  with baseline math, search-term verdict heuristics (NEGATE / PROMOTE /
  INVESTIGATE / KEEP), and GAQL templates for every standard analysis.
- Knows the traps: conversions backfill for 24–72 hours (so it won't panic-flag
  a one-day dip), impression-share fields don't aggregate in Google (it queries
  them for yesterday only), Quality Score returns null on low-volume keywords
  (it skips them).
- Every write follows a four-step protocol: query and analyze, run the mutation
  with `dry_run: true`, show exactly what would change and why, and execute
  only after an explicit "go." It never skips the dry run.
- Works with whichever connectors respond — a missing platform is skipped, not
  an error.
