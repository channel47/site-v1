---
name: "Meta Ads"
description: "Claude plugin for Meta Ads (Facebook + Instagram) — nine skills and two agents for daily monitoring, creative analysis, waste detection, audience diagnostics, placement optimization, and competitive intelligence. Read-only by design."
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["meta-ads", "facebook-ads", "instagram-ads", "creative-analysis", "waste-detection", "plugin"]
featured: false
status: "live"
install: "claude plugin install meta-ads@channel47"
compatibleWith: ["Claude Code", "Claude Cowork"]
relatedTools: ["google-ads", "microsoft-ads"]
---

## What it does

The Meta Ads plugin connects Claude to your Facebook and Instagram ad accounts through live API access. It runs practitioner-built workflows for creative performance, audience diagnostics, and spend efficiency. Read-only by design — it cannot modify your accounts.

Meta's black-box optimization makes it hard to see what's working. This plugin opens the box.

## Workflows included

Nine workflows and two agents, each handling a distinct piece of Meta Ads management:

**platform-setup** — Configure and verify your Meta Ads credentials. Tests connections, discovers ad accounts, confirms API access.

**morning-brief** — Daily account health check. Spend pacing, delivery issues, creative fatigue signals, audience saturation metrics. Adapted for Meta's auction dynamics.

**waste-detector** — Finds Meta-specific waste across budget allocation, audience overlap, placement bleed, and creative fatigue. Every finding includes dollar impact and fix instructions.

**creative-analyzer** — Deep creative performance analysis. Identifies winning and losing ad creatives, detects fatigue patterns, surfaces asset-level performance data.

**audience-diagnostics** — Audience overlap detection, saturation analysis, and targeting efficiency. Finds where audiences compete against each other and where frequency is too high.

**placement-optimizer** — Placement-level performance breakdown. Identifies which placements (Feed, Stories, Reels, Audience Network) are performing and which are bleeding budget.

**competitor-intel** — Competitive intelligence via Meta Ad Library data and DataForSEO integration. See what competitors are running.

**account-scorecard** — Quantified health grade across five dimensions with Meta-specific benchmarks.

**profile-review** — Periodic profile cleanup. Audits watch list, active tests, and decision log.

## Agents

**creative-analyst** — Parallel creative performance analysis across multiple ad accounts and campaigns.

**competitor-scout** — Parallel competitive research across Meta Ad Library and third-party data sources.

## Getting started

Install the plugin:

```
claude plugin install meta-ads@channel47
```

Run platform-setup first to configure your Meta access token and verify API access.

Then try morning-brief to see what the plugin does with your live Meta data.
