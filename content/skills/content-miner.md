---
title: Content Miner
slug: content-miner
description: "Digs through your week — notes, commits, conversations — and surfaces the posts that were already there, drafted in your voice."
repo: https://github.com/channel47/skills/tree/main/skills/distribution/content-miner
install: npx skills add channel47/skills --skill content-miner
date: 2026-07-02
tags: [content, distribution, build-in-public, newsletter, x, linkedin]
---

The builder's content problem: you shipped all week and posted nothing. This
skill is a mining operation over what actually happened — not a content
calendar, not an idea generator. It digs through your past week of work
artifacts, notes, conversations, and completed tasks, and surfaces the content
that was already there.

## What it does

- Runs four phases — **gather → filter → classify → brief** — over your last
  7–14 days: commits and merged PRs, notes and journals, conversation history,
  completed tasks, read chronologically so a morning-confusion-to-evening-
  clarity day keeps its story shape.
- Applies five signal tests to every candidate: provenance (first-hand only),
  specificity, replaceability (killed if anyone could have written it),
  tension, and "so what."
- Classifies survivors — build log, tool report, contrarian take, process
  note, shipping update, receipts — and matches each to its natural channel
  rather than blasting everything everywhere.
- Loads your brand-voice guide from the workspace before writing, and refuses
  to draft without one.
- Returns a brief: 2–3 top picks with drafts attached, secondary ideas with
  angles, and a parking lot for the not-ready (missing a number, waiting on a
  result).
- Fast mode for "just post something": pulls the last 3 days, finds the single
  most concrete thing, returns one X draft and one LinkedIn draft.

## Setup

No credentials. Configure sources and defaults in
`.claude/content-miner.local.md`.
