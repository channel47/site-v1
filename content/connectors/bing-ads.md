---
title: Bing Ads MCP
slug: bing-ads
description: "Microsoft Advertising for MCP agents — the whole async reporting lifecycle collapsed into single requests, plus structure queries and safe mutations."
repo: https://github.com/channel47/mcps/tree/main/bing-ads
install: npm i -g @channel47/bing-ads-mcp
package: "@channel47/bing-ads-mcp"
date: 2026-07-02
tags: [bing-ads, microsoft-advertising, mcp, paid-media, reporting]
pairing: "Needs a developer token, Azure AD client ID, and refresh token. Driven by the [Media Buyer skill](/skills/media-buyer)."
---

The account nobody checks. Microsoft Advertising quietly converts — and quietly
drifts, because its ceremonious async reporting API makes checking it a chore.
This MCP server collapses that ceremony into single requests, so the forgotten
channel becomes as easy to interrogate as Google or Meta.

## What it does

- The **report** tool handles the entire async lifecycle — submit job, poll,
  download the ZIP, unzip, parse the CSV — and returns clean rows. Report
  types: campaign, ad group, keyword, ad, search query, account, and asset
  group. Predefined date ranges from `Today` out to `LastYear`, daily through
  hourly aggregation.
- **`query`** reads account structure: campaigns, ad groups, keywords, and ads
  across all campaign types, including Performance Max.
- **`list_accounts`** includes status and pause reasons.
- **`list_products`** reads your Microsoft Merchant Center feed directly —
  titles, prices, availability, offer IDs.
- **`mutate` validates with `dry_run: true` by default**, previews the exact
  change, and touches nothing until explicitly armed. Negative keywords are a
  supported entity.
- Absorbs the Bing quirks: rotating OAuth refresh tokens, costs returned in
  dollars (vs Google's micros), and CTR representation differences —
  normalized so cross-platform comparison doesn't lie.
