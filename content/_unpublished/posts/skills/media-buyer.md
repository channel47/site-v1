---
title: "The Monday Morning Brief That Replaced My First Two Hours"
slug: media-buyer
description: "Running Google, Bing, and Meta account checks as a conversation — how the media-buyer skill turned my audit routine into one question."
type: story
category: skills
asset:
  name: media-buyer
  type: skill
  repo: https://github.com/channel47/skills/tree/main/skills/paid-media/media-buyer
  install: npx skills add channel47/skills --skill media-buyer
author: Jackson Dean
date: 2026-07-02
tags: [paid-media, google-ads, bing-ads, meta-ads, account-audit, waste-detection]
---

For most of seven years, my Monday looked the same. Open the MCC. Click into the first
account. Campaigns tab, change date range, scan spend against pace. Search terms report,
sort by cost, scan for garbage. Click into the next account. Repeat, at one point, across
twenty-five of them.

Two hours, most Mondays, before I'd done anything a client would call *work*. And the
honest version is worse: by account fifteen my scan quality had degraded to "does anything
look on fire." The accounts at the end of the alphabet got audited by a tired person. That's
where the expensive surprises lived.

The one that stung: a hearing clinic client, mid-sized lead-gen account. A broad match
keyword had drifted, and for eleven days it quietly collected clicks on searches about
concert tickets — the band shared a word with the clinic's name. About $1,400 of spend
before Monday-me caught it, because it happened on a Tuesday and account seventeen wasn't
getting a Tuesday look. Nothing about finding it required judgment. It required *looking*,
and looking doesn't scale.

The `media-buyer` skill is my looking, delegated. It sits on top of the Channel47 MCP
connectors for Google Ads, Bing Ads, and Meta, and it turns the Monday routine into a
sentence:

> "Morning brief on all accounts."

It checks which platforms are actually connected, pulls yesterday and the trailing period,
and comes back with the things I'd have found by hand — budget pacing against target,
anomalies against baseline, search terms that need negating, disapprovals, the PMax
campaign that's drifting. Not screenshots of dashboards. Findings.

What made me trust it wasn't the speed, it was that the domain knowledge is written down
instead of improvised. The skill ships with reference files for the things buyers actually
argue about: waste-detection thresholds with dollar-impact formulas for eight distinct
waste types, anomaly detection with real baseline math instead of vibes, search-term
verdict heuristics (NEGATE / PROMOTE / INVESTIGATE / KEEP), and GAQL templates for every
standard analysis so queries don't get invented from scratch each run.

It also knows the traps. Yesterday's conversions backfill for 24–72 hours, so it doesn't
panic-flag a one-day conversion dip. Impression share fields don't aggregate in Google, so
it queries them for yesterday only. Quality Score comes back null on low-volume keywords,
so those get skipped instead of skewing the analysis. Every one of those guardrails is a
mistake I have personally made with a real budget.

And when it's time to act, there's a protocol I'd trust with a client login. Every write
follows the same four steps: query and analyze first, run the mutation with `dry_run: true`,
show me exactly what would change and why, and only execute after I explicitly say go.
It never skips the dry run. "Add these six negatives" becomes a preview I approve, not a
change I discover later.

The concert-ticket leak now gets caught the morning after it starts, on every account,
including the ones at the end of the alphabet. Monday-me starts at the interesting part:
deciding what to do about it.

## Grab it

```
npx skills add channel47/skills --skill media-buyer
```

You'll want at least one of the connectors it drives — the
[google-ads](https://github.com/channel47/mcps/tree/main/google-ads),
[bing-ads](https://github.com/channel47/mcps/tree/main/bing-ads), or
[meta-ads](https://github.com/channel47/mcps/tree/main/meta-ads) MCP servers. It works
with whichever ones respond and doesn't complain about the ones that don't.
