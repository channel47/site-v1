---
title: "linkedin-ads-mcp — Bring B2B campaign data into the conversation"
slug: linkedin-ads
description: "An MCP server for LinkedIn advertising accounts, campaign entities, analytics, and previewed mutations."
repo: https://github.com/channel47/mcps/tree/main/linkedin-ads
install: npx @channel47/linkedin-ads-mcp@beta
package: "@channel47/linkedin-ads-mcp"
date: 2026-07-02
tags: [linkedin-ads, mcp, b2b, lead-gen, analytics]
pairing: "Requires LinkedIn Advertising API app approval and a supported OAuth setup."
---

LinkedIn Ads MCP connects an MCP client to LinkedIn's Advertising API. It
requires LinkedIn Advertising API approval and a supported OAuth setup.

## Tools and safety

- `list_accounts` lists accessible advertising accounts.
- `query` reads supported campaign entities; `analytics` returns supported
  performance pivots and time granularities.
- `mutate` validates locally and defaults to `dry_run: true`.
- New campaigns and creatives default to `DRAFT`.
- `LINKEDIN_ADS_READ_ONLY=true` removes the mutation tool.
