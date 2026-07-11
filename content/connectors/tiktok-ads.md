---
title: "tiktok-ads-mcp — Let your agent read and manage TikTok Ads"
slug: tiktok-ads
description: "An MCP server for TikTok advertising accounts, campaign entities, reporting, and previewed mutations."
repo: https://github.com/channel47/mcps/tree/main/tiktok-ads
install: npx @channel47/tiktok-ads-mcp@beta
package: "@channel47/tiktok-ads-mcp"
date: 2026-07-02
tags: [tiktok-ads, mcp, creative-testing, ugc, paid-media]
pairing: "Requires `TIKTOK_ADS_ACCESS_TOKEN`; account discovery also requires app credentials or an advertiser ID."
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
