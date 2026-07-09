---
title: Google Ads MCP
slug: google-ads
description: "Direct GAQL access to your Google Ads accounts for any MCP agent — three tools, dry-run safety by default, and a read-only mode."
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
tags: [google-ads, mcp, gaql, paid-media, automation]
pairing: "Needs your Google Ads API credentials. Pairs with the [gaql skill](/skills/gaql), which writes what this executes."
askAnswer:
  question: "Which campaigns spent over $100 last week with zero conversions?"
  columns: ["Campaign", "Spend", "Conv"]
  rows:
    - label: "Brand — Exact"
      value: "$412"
      value2: "0"
    - label: "Competitor KWs"
      value: "$186"
      value2: "0"
    - label: "DSA — Catch-all"
      value: "$121"
      value2: "0"
  caption: "One query, written and run by the agent. Changing anything is a separate, deliberate step."
---

Built from managing 25+ accounts daily. This MCP server gives an agent direct,
structured GAQL access to Google Ads — deliberately small, three tools — so
"which campaigns spent over $100 last week with zero conversions?" becomes one
query the agent writes and runs.

## What it does

- **`list_accounts`** — everything visible under your MCC or individual
  credentials.
- **`query`** — raw GAQL against any resource, results back as clean JSON with
  `cost_micros` converted to actual dollars.
- **`mutate`** — create, update, pause, remove; `dry_run` defaults to `true`,
  so nothing executes until you deliberately arm it.
- **Read-only mode** — `GOOGLE_ADS_READ_ONLY=true` removes the mutate tool
  entirely.
