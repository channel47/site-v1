---
title: Meta Ads MCP
slug: meta-ads
description: "Campaigns, ad sets, ads, and insights with breakdowns — a question away for any MCP agent, with every change a dry-run first."
repo: https://github.com/channel47/mcps/tree/main/meta-ads
install: npx @channel47/meta-ads-mcp@latest
package: "@channel47/meta-ads-mcp"
date: 2026-07-02
tags: [meta-ads, facebook-ads, instagram-ads, mcp, creative-testing, insights]
pairing: "Needs a `META_ADS_ACCESS_TOKEN` (long-lived or system-user), plus an optional default account ID. Driven by the [Media Buyer skill](/skills/media-buyer)."
---

Creative fatigue creeps — frequency 4.2 doesn't announce itself. This MCP
server connects an agent to the Meta Graph API so the slow-creeping issues get
caught by routine questions: campaigns, ad sets, ads, and insights with
breakdowns, plus dry-run-first changes.

## What it does

- **Three tools:** `list_accounts`, `query`, `mutate`.
- `query` covers campaigns, ad sets, ads, creatives, audiences, and insights.
  Insights take date presets (`last_7d`, `last_30d`, `this_month`),
  `time_increment` for trend lines, a `level` to aggregate at, and
  `breakdowns` — age, gender, publisher platform, and more.
- `inline_insights_fields` appends a nested projection like
  `insights{spend,ctr,frequency}` when querying ad sets, so structure and
  performance arrive in one response.
- **`mutate` is dry-run by default** — it previews entity, action, and exact
  params before any live change. Actions: create, update, pause, enable,
  archive, delete — across campaigns, ad sets, ads, audiences, creatives.
- **Read-only mode:** `META_ADS_READ_ONLY=true` disables live mutations.
- Documents the gotchas: budgets travel in minor currency units
  (`"daily_budget": "5000"` is $50), rate limiting is retried automatically
  honoring Meta's `Retry-After` header, and account IDs come back normalized
  without the `act_` prefix.
