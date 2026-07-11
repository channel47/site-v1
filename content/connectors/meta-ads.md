---
title: "meta-ads-mcp — Give your agent a live view of Meta Ads"
slug: meta-ads
description: "An MCP server for Meta advertising accounts, campaign entities, insights, and previewed mutations."
repo: https://github.com/channel47/mcps/tree/main/meta-ads
install: npx @channel47/meta-ads-mcp@beta
package: "@channel47/meta-ads-mcp"
date: 2026-07-02
tags: [meta-ads, facebook-ads, instagram-ads, mcp, creative-testing, insights]
pairing: "Requires `META_ADS_ACCESS_TOKEN`; set `META_ADS_READ_ONLY=true` for reporting-only use."
---

Meta Ads MCP is a local stdio server that connects an MCP client to Meta's
Graph API. It requires a long-lived or system-user access token.

## Tools and safety

- `list_accounts` lists accessible ad accounts.
- `query` reads campaigns, ad sets, ads, creatives, audiences, and insights,
  including supported breakdowns.
- `mutate` previews supported changes with `dry_run: true` by default.
- `META_ADS_READ_ONLY=true` disables live mutations.
