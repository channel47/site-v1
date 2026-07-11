---
title: Bing Ads MCP
slug: bing-ads
description: "An MCP server for Microsoft Advertising account data, reports, Merchant Center data, editorial status, and mutations."
repo: https://github.com/channel47/mcps/tree/main/bing-ads
install: npm i -g @channel47/bing-ads-mcp
package: "@channel47/bing-ads-mcp"
date: 2026-07-02
tags: [bing-ads, microsoft-advertising, mcp, paid-media, reporting]
pairing: "Requires a developer token, Azure AD client ID, and refresh token."
---

Bing Ads MCP is a local stdio server that connects an MCP client to Microsoft
Advertising. It requires a developer token and Microsoft OAuth credentials.

## Tools and safety

- `list_accounts` lists accessible advertising accounts.
- `query` reads campaign structure; `report` runs Microsoft Advertising
  reports and parses the downloaded result.
- `list_stores` and `list_products` read Microsoft Merchant Center data.
- `get_editorial_reasons` retrieves available editorial diagnostics.
- `mutate` previews supported changes with `dry_run: true` by default.
