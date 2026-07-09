---
title: TikTok Ads MCP
slug: tiktok-ads
description: "The TikTok for Business API at agent speed — synchronous reporting for the test-read-kill loop, with paused-by-default creates."
repo: https://github.com/channel47/mcps/tree/main/tiktok-ads
install: npx @channel47/tiktok-ads-mcp@latest
package: "@channel47/tiktok-ads-mcp"
date: 2026-07-02
tags: [tiktok-ads, mcp, creative-testing, ugc, paid-media]
pairing: "Needs a `TIKTOK_ADS_ACCESS_TOKEN` — walked through the developer-app authorize-and-exchange flow in the README."
---

TikTok burns through creative faster than any platform — velocity is the whole
game. This MCP server connects an agent to the TikTok for Business API so the
test-read-kill loop runs fast enough to keep up, with every create landing
paused.

## What it does

- **Four tools:** `list_accounts`, `query`, `report`, `mutate`.
- `report` hits TikTok's integrated reporting synchronously: pick a data level
  (`AUCTION_CAMPAIGN` down to `AUCTION_AD`) and get spend, impressions, CTR,
  CPC, CPM, conversions, cost per conversion, and conversion rate by default,
  sliced by day — with filtering and ordering handled server-side.
- `mutate` covers campaigns, ad groups, and ads: create, update, pause,
  enable, delete. **Dry-run by default** — TikTok has no server-side validate
  mode, so it validates locally and shows the exact requests.
- **Creates come out paused:** new campaigns and ad groups default
  `operation_status` to `DISABLE`.
- **Delete is steered to pause every time** — TikTok's delete is permanent and
  unrecoverable.
- **Read-only mode:** `TIKTOK_ADS_READ_ONLY=true` removes the mutate tool
  completely.
- Handles the platform quirks: the `Access-Token` header (not Bearer),
  envelope responses where an HTTP 200 can carry an error code (surfaced
  properly), automatic pagination, and rate-limit retries honoring
  `Retry-After`.
