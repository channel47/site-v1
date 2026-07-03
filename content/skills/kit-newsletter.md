---
title: Kit Newsletter
slug: kit-newsletter
description: "Draft, schedule, and check Kit broadcasts from the terminal — the newsletter sent without opening a dashboard, drafts by default."
repo: https://github.com/channel47/skills/tree/main/skills/distribution/kit-newsletter
install: npx skills add channel47/skills --skill kit-newsletter
date: 2026-07-02
tags: [newsletter, kit, convertkit, email, distribution]
---

The friction between writing and sending, removed. This skill lets you draft,
schedule, and check Kit (ConvertKit) broadcasts in the same conversation where
you wrote them — no dashboard. It bundles a small Python CLI around Kit's V4
API, stdlib only, nothing to install.

## What it does

- Converts an issue to email-safe HTML (simple tags, no div soup — Kit's
  template handles the outer styling) and shows you the content for review
  before creating anything.
- **Creating a broadcast produces a draft by default — nothing sends.** It only
  schedules a send when you explicitly give a send time, and confirms the date
  first.
- Subscriber operations: look up, add with tags — upserting rather than
  duplicating people who already exist.
- Tags (list, create, apply), sequences (drop a subscriber into a drip
  series), and stats (`broadcasts stats` pulls opens and clicks).
- Knows Kit's operational surface: the 120-requests-per-rolling-minute rate
  limit (bulk work gets spaced out), 50-item list pagination and how to cursor
  through it, and the failure modes — 401 means bad key, 429 means back off.
- First command in any session is an account check to confirm auth before
  touching anything.

## Setup

One environment variable: `KIT_API_KEY`, from Kit's developer settings. Pairs
naturally with [content-miner](/skills/content-miner), which drafts what this
sends.
