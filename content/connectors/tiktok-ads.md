---
title: TikTok Ads MCP
slug: tiktok-ads
description: "An MCP server for TikTok advertising accounts, campaign entities, reporting, and previewed mutations."
repo: https://github.com/channel47/mcps/tree/main/tiktok-ads
install: git clone https://github.com/channel47/mcps.git && cd mcps && npm install
date: 2026-07-02
tags: [tiktok-ads, mcp, creative-testing, ugc, paid-media]
pairing: "Source install; this package is not published to npm. Requires `TIKTOK_ADS_ACCESS_TOKEN`, then runs with `node tiktok-ads/server/index.js`."
---

TikTok Ads MCP connects an MCP client to the TikTok for Business API. It
requires a TikTok Ads access token.

## Tools and safety

- `list_accounts` lists accessible advertiser accounts.
- `query` reads supported campaign entities; `report` retrieves performance
  data.
- `mutate` validates locally and defaults to `dry_run: true`.
- New campaigns and ad groups default to a disabled state.
- `TIKTOK_ADS_READ_ONLY=true` removes the mutation tool.
