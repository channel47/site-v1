---
title: GAQL
slug: gaql
description: "The Google Ads Query Language reference your agent loads on demand — formal grammar, the gotcha list, and a cookbook of ready-made queries."
repo: https://github.com/channel47/skills/tree/main/skills/paid-media/gaql
install: npx skills add channel47/skills --skill gaql
date: 2026-07-02
tags: [gaql, google-ads, google-ads-api, reporting, queries]
---

GAQL — Google Ads Query Language — looks like SQL and isn't, quite. It's SQL's
strict cousin with unusual rules, communicated through validation errors that
say what broke but rarely why. This skill is the written-down reference that
loads whenever you ask anything GAQL-shaped, so queries get written correctly
instead of hallucinated.

## What it does

- Carries the formal GAQL grammar — every clause and operator — plus the full
  list of predefined date ranges.
- Encodes the case-sensitivity table (`LIKE` is insensitive, `=` is sensitive,
  `REGEXP_MATCH` needs a `(?i)` prefix) and the gotcha list: no `OR` (fake it
  with `IN` on a single field), non-date segments you filter on must also be
  selected, everything cost-related travels in micros, and period filters need
  the first day of the period or you get `MISALIGNED_DATE_FOR_FILTER`.
- Checks segment/metric compatibility with field-metadata queries (via
  `GoogleAdsFieldService`) before you hit the error.
- Includes a cookbook of ready-made queries that replicate the Google Ads UI
  screens: campaign performance, low quality-score keywords, search terms.
- Answers GAQL questions in place — write a query, explain a cryptic error,
  produce the case-insensitive version of a filter.

## Setup

No credentials — it's a reference, not a connection. Pairs with the
[google-ads connector](/connectors/google-ads), which executes what this skill
writes; also works standalone for scripts, notebooks, or direct API use.
