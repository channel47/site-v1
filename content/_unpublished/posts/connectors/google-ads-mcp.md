---
title: "Twenty-Five Accounts, One Question at a Time: Why I Built the Google Ads MCP"
slug: google-ads-mcp
description: "The connector that lets an agent speak GAQL to your Google Ads accounts — built from managing 25+ accounts daily, with dry-run safety and a read-only mode."
type: story
category: connectors
asset:
  name: google-ads
  type: mcp
  repo: https://github.com/channel47/mcps/tree/main/google-ads
  install: npx @channel47/google-ads-mcp@latest
  package: "@channel47/google-ads-mcp"
author: Jackson Dean
date: 2026-07-02
tags: [google-ads, mcp, gaql, paid-media, automation]
---

At my peak I was touching twenty-five-plus Google Ads accounts a day, and I can tell you
exactly where the hours went: not into decisions. Into *retrieval*. Click into the account,
click into the report, set the dates, add the columns, export, repeat. The judgment part of
media buying — the part clients pay for — was maybe fifteen percent of the time. The rest
was being a slow, expensive API client made of mouse clicks.

When agents got good enough to help, I hit the obvious wall: Claude couldn't see my
accounts. It could write brilliant GAQL and reason clearly about a search terms report, but
I was the network cable — copy the query out, run it, paste results back. Halfway through
one of those sessions I realized I was doing the machine's job so the machine could do
mine.

So I built the connector I needed. The `google-ads` MCP server gives an agent direct,
structured access to the Google Ads API, and it's deliberately small — three tools, because
three is all media buying needs:

- **`list_accounts`** — everything visible under your MCC or individual credentials.
- **`query`** — raw GAQL against any resource. Campaigns, keywords, search terms, assets,
  change history. If the API exposes it, the agent can ask for it. Results come back as
  clean JSON, with `cost_micros` converted to actual dollars so nobody hands a client a
  report inflated by a factor of a million (ask me how I know).
- **`mutate`** — create, update, pause, remove. And this is where the design gets opinionated.

Opinionated how: **`dry_run` defaults to `true`.** A mutation you don't explicitly arm is a
validation, not a change. The agent previews exactly what would happen — which campaign,
which field, what value — and live execution requires deliberately setting `dry_run: false`.
For client accounts I go further and set `GOOGLE_ADS_READ_ONLY=true` in the server config,
which removes the mutate tool from existence. The agent can't write because there is no
write. That's the correct trust boundary for an audit engagement, and it's one environment
variable.

The server also encodes the API's sharp edges, learned in production rather than from the
docs. My favorite example: pausing a responsive search ad and editing its headlines are
operations on *two different resources* — status lives on `ad_group_ad`, content lives on
`ad` — and getting this wrong produces errors that explain nothing. The README documents
both paths with working payloads. Campaign creation handles the atomic budget-plus-campaign
dance with temp resource IDs, and it auto-fills the EU political advertising declaration
that the API started requiring in v19.2 — the kind of field that breaks scripts on a random
Tuesday. Image assets accept a local file path and the server does the base64 conversion
itself.

What it unlocked for me day to day is the thing the [media-buyer skill](https://github.com/channel47/skills/tree/main/skills/paid-media/media-buyer)
turns into a full workflow: questions at the speed of thought. "Which campaigns spent over
$100 last week with zero conversions?" is one sentence, one GAQL query the agent writes and
runs itself, one answer. Across twenty-five accounts, the compounding is hard to overstate.

Setup is environment variables — developer token, OAuth client ID and secret, refresh
token, optionally your MCC ID — in your MCP config, and it runs with `npx` so there's
nothing to install permanently. From cold start to first query is one config block.

It's not a demo. It's the tool I run my actual Tuesdays on.

## Grab it

```bash
npx @channel47/google-ads-mcp@latest
```

Config details and full mutation examples are in the
[README](https://github.com/channel47/mcps/tree/main/google-ads). Pair it with the
[gaql skill](https://github.com/channel47/skills/tree/main/skills/paid-media/gaql) so your
agent writes correct queries, and the media-buyer skill to run the whole morning routine.
