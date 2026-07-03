---
title: Pinterest Ads MCP
slug: pinterest-ads
description: "Pinterest Ads with the attribution windows done right — first-class click/engagement/view windows, so the slow channel is measured instead of killed."
repo: https://github.com/channel47/mcps/tree/main/pinterest-ads
install: npx @channel47/pinterest-ads-mcp@latest
package: "@channel47/pinterest-ads-mcp"
date: 2026-07-02
tags: [pinterest-ads, mcp, dtc, attribution, seasonal, paid-media]
---

Pinterest converts on planner time, not feed time — and bad reporting kills the
sleeper channel prematurely. This MCP server is built around getting the
attribution right, so the slow channel gets measured correctly instead of cut.

## What it does

- The **`analytics`** tool exposes attribution windows as first-class
  parameters: separate `click_window_days`, `engagement_window_days`, and
  `view_window_days` (0 to 60), plus `conversion_report_time` to credit
  conversions at time of ad action or time of conversion.
- Granularity from `TOTAL` down to `HOUR`, account-through-ad-level pivots —
  and it surfaces the constraint that the API reaches back at most 90 days
  with a 90-day max range, so you plan longitudinal pulls instead of
  discovering the wall.
- **`query`** reads campaigns, ad groups, and ads, and exposes
  `entity_statuses` — the API defaults to returning only `ACTIVE` and `PAUSED`
  entities, so archived history stays visible on request.
- **`list_accounts`** walks Pinterest's bookmark pagination.
- **`mutate` is dry-run by default**, previewing exact requests (Pinterest has
  no server-side validate mode). **Creates default to `PAUSED`.** Pinterest
  has no delete and archive is terminal — an archived entity can never be
  reactivated — which the server documents in bold before you find out the
  hard way.
- Money travels in micro-currency (`25000000` = 25.00) — documented so budgets
  and bids don't miss by six zeros.
- **Read-only mode:** `PINTEREST_ADS_READ_ONLY=true` removes the mutate tool
  entirely.

## Setup

Add with `claude mcp add pinterest-ads --env
PINTEREST_ADS_ACCESS_TOKEN=<token> --env
PINTEREST_ADS_AD_ACCOUNT_ID=<ad-account-id> -- npx
@channel47/pinterest-ads-mcp@latest`. Auth: paste an access token, or supply
client credentials plus a refresh token and the server mints access tokens
itself. Pinterest's refresh tokens may rotate on use — the server can't
persist the new value, so it logs a loud warning to update your env when that
happens. OAuth setup is in the README.
