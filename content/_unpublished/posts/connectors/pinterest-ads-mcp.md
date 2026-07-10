---
title: "The Slow Channel: Why Pinterest Rewards Patience (and Punishes Bad Reporting)"
slug: pinterest-ads-mcp
description: "Pinterest converts on planner time, not feed time. The pinterest-ads MCP gets the attribution windows right — and makes the sleeper channel worth operating."
type: story
category: connectors
asset:
  name: pinterest-ads
  type: mcp
  repo: https://github.com/channel47/mcps/tree/main/pinterest-ads
  install: npx @channel47/pinterest-ads-mcp@latest
  package: "@channel47/pinterest-ads-mcp"
author: Jackson Dean
date: 2026-07-02
tags: [pinterest-ads, mcp, dtc, attribution, seasonal, paid-media]
---

I almost killed the best channel a cookware client had, and the near-miss taught me more
about Pinterest than two years of running it.

We'd launched Pinterest campaigns in early fall — enameled dutch ovens, gift-guide season
coming. Four weeks in, the dashboard math said what dashboard math always says about
Pinterest: pretty impressions, polite clicks, conversions that made the CPA look like a
typo. I drafted the recommendation to wind it down. Then the November order data came in,
and a very different picture emerged: a wave of purchases from people who had *saved* our
pins in September and October. Pinterest wasn't underperforming. It was performing on
planner time — save now, buy when the season arrives — and I'd been grading a slow cooker
like a microwave.

Measuring that channel correctly isn't optional; it's the entire decision. And it's
exactly where the `pinterest-ads` MCP server earns its place. The `analytics` tool exposes
the levers that make Pinterest legible instead of misleading:

- **Attribution windows as first-class parameters** — separate `click_window_days`,
  `engagement_window_days`, and `view_window_days` (0 to 60), because a save in September
  converting in November is an *engagement* conversion and a 7-day click window will
  simply never see it.
- **`conversion_report_time`** — credit conversions at the time of the ad action or the
  time of the conversion. For seasonal analysis this switch changes the story completely:
  one view tells you when your marketing worked, the other when your revenue landed.
- Granularity from `TOTAL` down to `HOUR`, account through ad-level pivots, and honest
  constraints surfaced rather than hidden: the API reaches back at most 90 days with a
  90-day max range, so the server tells you to plan longitudinal pulls instead of letting
  a too-wide query quietly fail.

Around the measurement core sits the standard Channel47 connector shape. `query` reads
campaigns, ad groups, and ads — with a Pinterest-specific footgun handled: the API
defaults to returning only `ACTIVE` and `PAUSED` entities, so the server exposes
`entity_statuses` to make archived history visible when you actually want it. `list_accounts`
walks bookmark pagination for you.

And `mutate` carries the safety posture this platform particularly needs. Dry-run by
default, previewing the exact requests (Pinterest has no server-side validate mode).
Creates default to `PAUSED`. But the big one: **Pinterest has no delete, and archive is
terminal** — an archived entity can never be reactivated. The server documents this in
bold, because "archive" sounds gentle and on Pinterest it is not. There's also the money
gotcha: budgets, bids, and spend caps travel in micro-currency, so `25000000` means 25.00.
An agent that doesn't know that is one enthusiastic budget update from a very bad morning;
this one knows it.

Auth fits how Pinterest actually behaves: paste an access token, or supply client
credentials plus a refresh token and let the server mint access tokens itself. Pinterest
uses *continuous* refresh tokens that may rotate on use — the server can't persist the new
value, so it logs a loud warning telling you to update your env when rotation happens.
It's a small thing, but it's the difference between a mysterious auth death and a
documented, recoverable event.

The cookware account still runs Pinterest — bigger than ever, on purpose now. Fall
campaigns get judged in November with 60-day engagement windows and
`TIME_OF_CONVERSION` reporting, and the agent pulls that view on demand instead of me
rebuilding the argument in a spreadsheet every quarter. The slow channel is a fine channel.
You just have to measure it at its own speed.

## Grab it

```bash
claude mcp add pinterest-ads \
  --env PINTEREST_ADS_ACCESS_TOKEN=<token> \
  --env PINTEREST_ADS_AD_ACCOUNT_ID=<ad-account-id> \
  -- npx @channel47/pinterest-ads-mcp@latest
```

OAuth setup and the full analytics column reference are in the
[README](https://github.com/channel47/mcps/tree/main/pinterest-ads). Reporting-only setups
should set `PINTEREST_ADS_READ_ONLY=true` — it removes the mutate tool entirely.
