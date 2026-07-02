---
title: "Learning to Speak Google Ads: Why I Finally Sat Down With GAQL"
slug: gaql
description: "GAQL is the SQL of media buying — and the gaql skill is the reference I wish I'd had for every cryptic validation error along the way."
type: story
category: skills
asset:
  name: gaql
  type: skill
  repo: https://github.com/channel47/skills/tree/main/skills/paid-media/gaql
  install: npx skills add channel47/skills --skill gaql
author: Jackson Dean
date: 2026-07-02
tags: [gaql, google-ads, google-ads-api, reporting, queries]
---

There's a moment in every performance marketer's life where the Google Ads UI stops being
enough. Mine came on a lead-gen account where I needed one specific view: search terms,
segmented by match type, filtered to a campaign subset, joined with cost — daily, in a
format I could actually work with. The UI could show me most of that, in three different
screens, none exportable the way I needed.

The Google Ads API could do it in one query. The query language it speaks is GAQL —
Google Ads Query Language — and it looks friendly if you know SQL:

```sql
SELECT search_term_view.search_term,
  segments.keyword.info.match_type,
  campaign.name,
  metrics.clicks, metrics.cost_micros
FROM search_term_view
WHERE segments.date DURING LAST_7_DAYS
```

Looks friendly. Isn't, quite. GAQL is SQL's strict cousin who grew up with unusual rules,
and it communicates those rules through validation errors that tell you what broke but
rarely why. My first weeks with it were a loop of submit, read cryptic error, guess, submit.

A sampler of the walls I hit, each of which cost me an evening:

- **There is no OR.** Conditions join with AND only. You fake OR with `IN` on a single
  field, and you restructure your thinking for everything else.
- **Non-date segments you filter on must also be selected.** Filter on a segment that
  isn't in your SELECT and the query bounces — except for core date segments, which are
  exempt, which is exactly the kind of exception that makes you doubt the rule.
- **If you select a date segment, you must filter on one.** The reverse trap of the
  previous one.
- **Everything cost-related is in micros.** The first report I proudly handed a client had
  every spend figure inflated by a factor of a million. Divide by 1,000,000. Always.
- **`segments.month = '2024-05-15'` fails** with `MISALIGNED_DATE_FOR_FILTER` because
  period filters want the *first day* of the period. Nothing tells you this in advance.
- **Segments and metrics have compatibility rules** you can only discover by querying
  `GoogleAdsFieldService` for field metadata — a service I didn't know existed for an
  embarrassingly long time.

The `gaql` skill is all of that, written down. It carries the formal grammar, every clause
and operator, the case-sensitivity table (`LIKE` is insensitive, `=` is sensitive,
`REGEXP_MATCH` needs a `(?i)` prefix — you'd never guess), the full list of predefined
date ranges, the field-metadata queries for checking compatibility before you hit the
error, and a gotcha list that reads like my personal scar tissue. Plus a cookbook of
ready-made queries that replicate the Google Ads UI screens — campaign performance, low
quality score keywords, search terms — so the common cases are copy-paste.

The way I actually use it: it loads whenever I'm working in Claude Code and ask anything
GAQL-shaped. "Write me a query for keywords under QS 5 with real impression volume."
"Why is this query throwing a date range error?" "Give me the case-insensitive version of
this campaign name filter." The agent answers from the reference instead of hallucinating
plausible-but-wrong field names, which — if you've ever debugged a GAQL query an AI
invented from vibes — is the entire value proposition.

It pairs naturally with the [google-ads MCP](https://github.com/channel47/mcps/tree/main/google-ads),
which executes what this skill writes, and with the
[media-buyer skill](https://github.com/channel47/skills/tree/main/skills/paid-media/media-buyer),
which uses both to run full analyses. But it stands alone fine: if you write GAQL anywhere —
scripts, notebooks, the API directly — this is the reference that stops the
submit-error-guess loop.

That search-terms view I needed? One query now. It was always one query. I just needed the
grammar nobody teaches.

## Grab it

```
npx skills add channel47/skills --skill gaql
```
