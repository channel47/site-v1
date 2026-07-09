---
title: GAQL
slug: gaql
description: "The Google Ads Query Language reference your agent loads on demand — formal grammar, the gotcha list, and a cookbook of ready-made queries."
repo: https://github.com/channel47/skills/tree/main/skills/paid-media/gaql
install: npx skills add channel47/skills --skill gaql
date: 2026-07-02
tags: [gaql, google-ads, google-ads-api, reporting, queries]
pairing: "No credentials — it's a reference, not a connection. Pairs with the [google-ads connector](/connectors/google-ads), which executes what this skill writes."
screenshotCaption: "The submit → cryptic error → guess loop, ended: the agent answers from the reference."
askAnswer:
  question: "Keywords under quality score 5 with real impression volume — last 30 days."
  columns: ["Keyword", "QS", "Impr"]
  rows:
    - label: "rain jacket women"
      value: "3"
      value2: "12,480"
    - label: "waterproof shell"
      value: "3"
      value2: "9,120"
    - label: "hiking jacket sale"
      value: "4"
      value2: "7,940"
  caption: "Query written and run by the agent — this skill supplies the grammar, the google-ads connector executes."
---

GAQL — Google Ads Query Language — looks like SQL and isn't, quite. Its rules
arrive as validation errors that say what broke but rarely why. This skill is
that missing manual, loaded whenever you ask anything GAQL-shaped.

## What it knows

- The formal grammar — every clause and operator, plus all the predefined
  date ranges.
- The gotcha list — no `OR`, costs in micros, case sensitivity that varies by
  operator, period filters that want day one.
- Compatibility checks — segment and metric rules verified before you hit the
  error.
- A cookbook of ready-made queries that mirror the Google Ads UI screens.
