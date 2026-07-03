---
title: Google Ads MCP
slug: google-ads
description: "Direct GAQL access to your Google Ads accounts for any MCP agent — three tools, dry-run safety by default, and a read-only mode."
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
tags: [google-ads, mcp, gaql, paid-media, automation]
---

Built from managing 25+ accounts daily. This MCP server gives an agent direct,
structured GAQL access to Google Ads — deliberately small, three tools — so
"which campaigns spent over $100 last week with zero conversions?" becomes one
query the agent writes and runs.

## What it does

- **`list_accounts`** — everything visible under your MCC or individual
  credentials.
- **`query`** — raw GAQL against any resource: campaigns, keywords, search
  terms, assets, change history. Results come back as clean JSON with
  `cost_micros` converted to actual dollars.
- **`mutate`** — create, update, pause, remove. **`dry_run` defaults to
  `true`:** a mutation you don't explicitly arm is a validation, previewing
  which campaign, which field, what value. Live execution requires
  deliberately setting `dry_run: false`.
- **Read-only mode:** `GOOGLE_ADS_READ_ONLY=true` removes the mutate tool
  entirely.
- Encodes the API's sharp edges: pausing a responsive search ad vs editing its
  headlines are two different resources (both documented with working
  payloads), campaign creation handles the atomic budget-plus-campaign dance
  with temp resource IDs, the EU political-advertising declaration required in
  v19.2 is auto-filled, and image assets accept a local file path with base64
  conversion handled server-side.

## Setup

Runs via `npx` — nothing to install permanently. Environment variables:
developer token, OAuth client ID and secret, refresh token, and optionally an
MCC ID. Pairs with the [GAQL skill](/skills/gaql), which writes what this
executes, and the [Media Buyer skill](/skills/media-buyer), which drives it.
