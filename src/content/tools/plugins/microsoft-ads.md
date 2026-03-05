---
name: "Microsoft Ads"
description: "Claude plugin for Microsoft Advertising (Bing Ads) — eight skills for daily monitoring, waste detection, search term analysis, import auditing, placement cleaning, and account scoring. Read-only by design."
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["microsoft-ads", "bing-ads", "search-ads", "waste-detection", "plugin"]
featured: true
status: "live"
install: "claude plugin install microsoft-ads@channel47"
compatibleWith: ["Claude Code", "Claude Cowork"]
relatedTools: ["google-ads", "meta-ads"]
---

## What it does

The Microsoft Ads plugin connects Claude to your Microsoft Advertising (Bing Ads) accounts through live API access. It runs practitioner-built workflows tuned for Bing-specific data quirks and waste patterns. Read-only by design — it cannot modify your accounts.

Nobody treats Bing as a first-class platform. This plugin does.

## Workflows included

Eight workflows, each handling a distinct piece of Microsoft Ads management:

**platform-setup** — Configure and verify your Microsoft Advertising credentials. Tests connections, discovers accounts, confirms API access.

**morning-brief** — Daily account health check. Budget pacing, bot traffic monitoring, search partner quality assessment. Adapted for Bing's reporting structure.

**waste-detector** — Finds Bing-specific waste across seven categories including MSAN (Microsoft Audience Network) bleed, search partner junk traffic, and broad match imports that don't translate from Google.

**search-term-verdict** — Classifies search terms adapted for Bing's worse close-variant matching behavior. Exports paste-ready negative keyword lists.

**import-auditor** — Post-Google-import cleanup checklist. Catches the settings, bid strategies, and targeting options that don't translate cleanly from Google to Bing. Saves hours of manual post-import review.

**placement-cleaner** — MSAN and publisher exclusion recommendations. Identifies low-quality placements bleeding budget.

**account-scorecard** — Quantified health grade across five dimensions with Bing-specific benchmarks.

**profile-review** — Periodic profile cleanup. Audits watch list, active tests, and decision log.

## Why a separate Bing plugin?

Google and Bing have different data structures, different waste patterns, and different API quirks. Bing spend is in dollars (no micros conversion), CTR comes as a percentage string, and there's no change event history, impression share in standard reports, or ad disapproval data via API.

A combined plugin means bloated context windows and generic workflows. A dedicated plugin means Bing-specific intelligence.

## Getting started

Install the plugin:

```
claude plugin install microsoft-ads@channel47
```

Run platform-setup first to configure your credentials and verify API access.

Then try morning-brief to see what the plugin does with your live Bing data.
