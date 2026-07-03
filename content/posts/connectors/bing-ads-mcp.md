---
title: "The Account Nobody Checks: Putting Bing Ads Back on the Radar"
slug: bing-ads-mcp
description: "Microsoft Advertising quietly converts — and quietly drifts. The bing-ads MCP makes the forgotten channel as easy to interrogate as the big ones."
type: story
category: connectors
asset:
  name: bing-ads
  type: mcp
  repo: https://github.com/channel47/mcps/tree/main/bing-ads
  install: npm i -g @channel47/bing-ads-mcp
  package: "@channel47/bing-ads-mcp"
author: Jackson Dean
date: 2026-07-02
tags: [bing-ads, microsoft-advertising, mcp, paid-media, reporting]
---

Every media buyer has a version of this account. For me it was a cookware brand: Google and
Meta got the daily attention, and off to the side sat Microsoft Advertising — imported from
Google two years earlier, spending its modest budget, checked whenever someone remembered.
Which was roughly monthly. On a good quarter.

Here's the uncomfortable part: when I finally did a proper pass, the Bing account had the
best CPA of the three platforms. Older demographic, less auction pressure, buyers with
money who search from a desktop that came with Edge installed. It also had four months of
search-query drift nobody had negated, because *nobody was looking*.

Bing accounts don't get neglected because they're unprofitable. They get neglected because
the tooling friction is real. The Microsoft Advertising API is capable but famously
ceremonious — and nowhere more than reporting, where getting a simple performance report
means submitting an async job, polling for completion, downloading a ZIP, extracting it,
and parsing the CSV inside. Nobody does that ad hoc. So nobody looks. So the drift
accumulates on the channel that could most afford the attention.

The `bing-ads` MCP server exists to delete that friction. The report tool handles the
entire async lifecycle — submit, poll, download, unzip, parse — and hands the agent clean
rows. From my side it's one request:

```json
{
  "report_type": "search_query",
  "date_range": "Last30Days",
  "aggregation": "Summary"
}
```

Campaign, ad group, keyword, ad, search query, account, and asset group reports, with
predefined ranges from `Today` out to `LastYear` and daily-through-hourly aggregation. The
five-step ceremony still happens; it's just no longer my problem.

Around that core, the server covers the rest of the account surface: `query` for structure
(campaigns, ad groups, keywords, ads — across all the campaign types, PerformanceMax
included), `list_accounts` with status and pause reasons, and — the part ecommerce folks
will appreciate — `list_products`, which reads your Microsoft Merchant Center feed directly.
Titles, prices, availability, offer IDs. When Shopping performance dips, "is the feed
actually healthy?" is now a question the agent can answer in the same conversation, instead
of a login to a portal I visit twice a year.

Writes go through the same safety pattern as every Channel47 connector: `mutate` validates
with `dry_run: true` by default, previews the exact change, and touches nothing until you
explicitly arm it. Negative keywords — the fix for all that search-query drift — are a
supported entity, so the audit and the cleanup happen in one sitting.

It also absorbs Bing's quirks so your agent doesn't trip on them. Microsoft rotates OAuth
refresh tokens; the [media-buyer skill](https://github.com/channel47/skills/tree/main/skills/paid-media/media-buyer)
knows to suggest re-auth when that bites. Costs come back in dollars while Google speaks
micros; CTR is a percentage string here and a decimal there. The skill layer normalizes
that thinking so cross-platform comparisons don't silently lie to you.

The cookware account gets the same Monday look as everything else now, because looking
costs a sentence. The forgotten channel stopped being forgotten the moment it stopped being
annoying.

## Grab it

```bash
npm i -g @channel47/bing-ads-mcp
bing-ads-mcp
```

Credentials are environment variables — developer token, Azure AD client ID, refresh token —
documented in the [README](https://github.com/channel47/mcps/tree/main/bing-ads). If you
run Google alongside it, the media-buyer skill will brief both platforms in one pass.
