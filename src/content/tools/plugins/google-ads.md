---
name: "Google Ads"
description: "Claude plugin for Google Ads — nine skills for daily briefs, waste detection, search term classification, Performance Max transparency, account scoring, ad copy analysis, and competitive intel. Read-only by design."
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["google-ads", "ppc", "search-ads", "performance-max", "waste-detection", "plugin"]
featured: true
status: "live"
install: "claude plugin install google-ads@channel47"
compatibleWith: ["Claude Code", "Claude Cowork"]
relatedTools: ["microsoft-ads", "meta-ads"]
---

## What it does

The Google Ads plugin connects Claude to your Google Ads accounts through live API access. It runs practitioner-built workflows that turn raw account data into prioritized, dollar-quantified action plans. Read-only by design — it cannot modify your accounts.

Built from managing 25+ ad accounts daily. Every workflow exists because the manual version was eating hours.

## Workflows included

Nine workflows, each handling a distinct piece of Google Ads management:

**platform-setup** — Configure and verify your Google Ads credentials. Walks through OAuth, tests connections, discovers accounts, and confirms API access.

**morning-brief** — Daily account health check. Pulls performance data, runs anomaly detection against 7-day and 30-day baselines, checks budget pacing, flags ad disapprovals and auto-applied changes. Replaces the 20-minute tab-switching ritual.

**waste-detector** — Finds high-impact spend leaks across eight waste categories. Surfaces the campaigns, ad groups, and keywords burning budget with nothing to show for it. Every finding includes dollar impact, exact UI navigation paths, and copy-paste fix artifacts.

**search-term-verdict** — Classifies search terms into four buckets: NEGATE, PROMOTE, INVESTIGATE, or KEEP. Exports paste-ready negative keyword lists grouped by match type.

**pmax-decoder** — Transparency for Performance Max campaigns. Pulls search terms, channel mix, and asset performance from Google's black box and structures it so you can see what's happening inside.

**account-scorecard** — Quantified health grade across five dimensions. Monthly pulse check with trend analysis.

**ad-copy-analyzer** — RSA asset performance analysis with fatigue detection and improvement recommendations.

**competitor-intel** — Auction insights analysis with competitive research via DataForSEO integration.

**profile-review** — Periodic profile cleanup. Audits your watch list, active tests, and decision log to keep account context current.

## What people have caught with it

- **~$3K/month in wasted spend** across two accounts, flagged by waste-detector in the first run
- **Budget pacing issue** flagged 4 days before the client noticed
- **Daily briefings** that replaced manual morning checks across 25+ accounts

## Getting started

Install the plugin:

```
claude plugin install google-ads@channel47
```

Run platform-setup first to configure your credentials. It walks through Google OAuth and verifies API access.

After that, try morning-brief. It's the fastest way to see what the plugin actually does with your live data.

## Guides

- [How to Connect Google Ads to Claude](/guides/connect-google-ads-to-claude) — step-by-step setup from credentials to your first morning brief
- [Morning Brief: Daily Google Ads Health Check](/guides/morning-brief-workflow) — how the morning brief workflow monitors spend pacing, anomalies, and quality scores
- [Claude for PPC: A Practitioner's Guide](/guides/claude-for-ppc) — comprehensive overview of using Claude for paid media management
