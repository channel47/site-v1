---
title: X Algorithm Optimizer
slug: twitter-algorithm-optimizer
description: "Scores and rewrites your X drafts against the platform's open-sourced ranking system — in your voice, with every change annotated."
repo: https://github.com/channel47/skills/tree/main/skills/distribution/twitter-algorithm-optimizer
install: npx skills add channel47/skills --skill twitter-algorithm-optimizer
date: 2026-07-02
tags: [x, twitter, distribution, algorithm, social]
---

X open-sourced its recommendation algorithm; almost nobody read it. This skill
did — including the January 2026 Grok-based version — and scores your drafts
against what the ranking system actually rewards before you post.

## What it does

- Encodes the engagement weights: a like is the ~0.5–1× baseline, a repost
  ~20×, a reply 13.5×, a reply you reply back to ~75×, and sustained
  back-and-forth conversation compounds toward ~150×.
- Knows the penalties: an external link in the post body costs Premium
  accounts 30–50% of reach and buries free accounts; the Grok-based ranker
  runs sentiment analysis, so combative flamebait gets throttled.
- Knows the clock — a post loses half its remaining potential every six hours,
  so the first 30 minutes decide most of its fate — and the format effects:
  native video and images boosted, threads pulling ~3× single-tweet
  engagement.
- Scores drafts against a weighted rubric (reply potential 5×, repost
  potential 4×, hook strength 3×, bookmark potential, community fit, minus
  negative-signal and link penalties). Under 40: rethink. Over 80: ship.
- Rewrites in **your** voice — the constraint is written into the skill. No
  growth-hacker voice, no engagement bait; "Like if you agree" is treated as an
  anti-pattern. Every change is annotated with the signal it targets.
- Outputs a posting plan: format, link handling (usually main post clean, link
  in the first reply), and a first-30-minutes strategy.
- Stamps the date it was last verified against the public source and tells you
  to distrust stale specifics.

## Setup

No credentials — it analyzes drafts, it doesn't post.
