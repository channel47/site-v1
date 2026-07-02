---
title: "Frequency 4.2: Catching Creative Fatigue in a Conversation"
slug: meta-ads-mcp
description: "The meta-ads MCP puts campaigns, ad sets, and insights — with breakdowns — a question away, and makes every change a dry-run first."
type: story
category: connectors
asset:
  name: meta-ads
  type: mcp
  repo: https://github.com/channel47/mcps/tree/main/meta-ads
  install: npx @channel47/meta-ads-mcp@latest
  package: "@channel47/meta-ads-mcp"
author: Jackson Dean
date: 2026-07-02
tags: [meta-ads, facebook-ads, instagram-ads, mcp, creative-testing, insights]
---

Meta accounts don't fail loudly. They sag. A wellness brand I ran was doing fine on the
surface — spend steady, ROAS acceptable, nothing tripping an alert — while underneath, the
hero ad set had crept to a frequency of 4.2. The same people, seeing the same video, four
times over. CPA up forty percent from its best, so gradually that every daily comparison
looked normal. Fatigue never announces itself. It's only visible if you keep asking the
same boring questions on a schedule, and Ads Manager makes every boring question cost six
clicks and a breakdown menu.

That's the job the `meta-ads` MCP server does for me now: it makes the boring questions
free. It connects an agent to the Meta Graph API with the same three-tool shape as the
other Channel47 connectors — `list_accounts`, `query`, `mutate` — and the query tool is
where the fatigue-hunting lives.

`query` covers the entities that matter: campaigns, ad sets, ads, creatives, audiences,
and insights. Insights take date presets (`last_7d`, `last_30d`, `this_month`),
`time_increment` for trend lines, a `level` to aggregate at, and — the feature I'd defend
with my life — `breakdowns`. Age, gender, publisher platform, whatever dimension you
suspect. "Pull last 14 days at the ad set level broken down by publisher platform" is one
sentence, and it's the sentence that tells you Instagram Reels is quietly carrying the
account while Audience Network eats budget.

There's a small convenience that ends up shaping my whole workflow:
`inline_insights_fields`. When querying ad sets, you can append a nested projection like
`insights{spend,ctr,frequency}` so structure and performance arrive in one response. That's
the frequency-4.2 catcher — every routine ad set pull carries its frequency along for
free, so the sag shows up in the answer whether or not I remembered to ask about it.

When it's time to act, `mutate` follows the house rule: **dry-run by default.** Pausing the
fatigued ad set is a preview first — entity, action, exact params — and a live change only
after I approve. Supported actions run from `create` and `update` through `pause`,
`enable`, `archive`, and `delete`, across campaigns, ad sets, ads, audiences, and
creatives. For accounts where an agent should never write at all, `META_ADS_READ_ONLY=true`
disables live mutations outright.

Two gotchas the server documents that have burned real people: budgets travel in **minor
currency units** — `"daily_budget": "5000"` means fifty dollars, not five thousand, a
distinction you very much want to internalize before your first budget mutation — and rate
limiting is handled with an automatic retry that honors Meta's `Retry-After` header, so a
burst of queries degrades gracefully instead of erroring your session.

Setup is a single required environment variable — `META_ADS_ACCESS_TOKEN`, a long-lived or
system-user token — plus an optional default account ID. Account IDs come back normalized
without the `act_` prefix, one of those tiny paper cuts of the Graph API the server just
sands off.

The wellness account has a standing rhythm now: frequency and first-time-impression
questions surface weekly, in the same brief as everything else, via the
[media-buyer skill](https://github.com/channel47/skills/tree/main/skills/paid-media/media-buyer)
that drives this connector. The sag doesn't get four months of quiet anymore. It gets
caught the week it starts, which is the only time catching it is cheap.

## Grab it

```bash
npx @channel47/meta-ads-mcp@latest
```

Full tool reference and config in the
[README](https://github.com/channel47/mcps/tree/main/meta-ads). Works standalone or as the
Meta arm of the media-buyer skill's cross-platform brief.
