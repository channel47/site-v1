---
name: "Media Buyer"
description: "Claude as your media buying copilot. Query and manage Google Ads, Bing Ads, and Meta Ads from one plugin — morning briefs, waste detection, search term analysis, and cross-platform reporting."
type: "plugin"
author: "Jackson Dean"
source: "channel47"
tags: ["google-ads", "bing-ads", "meta-ads", "ppc", "media-buying", "paid-media", "waste-detection", "plugin"]
featured: true
status: "live"
install: "claude plugin install media-buyer@channel47"
compatibleWith: ["Claude Code"]
relatedTools: ["creative-strategist", "frontend-designer"]
---

## What it does

The Media Buyer plugin connects Claude to your ad accounts across Google, Bing, and Meta. One plugin handles all three platforms — morning briefs, waste detection, search term analysis, budget pacing, and cross-platform reporting.

Built from managing 25+ ad accounts daily. Every workflow exists because the manual version was eating hours.

## How it works

The plugin connects to your ad platforms through MCP servers that ship with it. Install the plugin, configure your credentials once, and Claude has live access to your account data.

- **Google Ads** — GAQL queries for campaigns, ad groups, keywords, search terms, and Performance Max asset groups
- **Bing Ads** — Campaign structure queries, performance reports, Merchant Center product feeds
- **Meta Ads** — Campaign, ad set, and ad queries via Graph API, creative performance insights

All mutations require explicit `dry_run: true` confirmation before executing. Read access is the default.

## What you can do

**Morning brief** — "How did my accounts perform yesterday?" pulls data across all connected platforms, runs anomaly detection, flags budget pacing issues, and surfaces anything that needs attention.

**Waste detection** — "Where am I wasting money?" identifies high-spend, low-return campaigns, ad groups, and keywords with dollar-quantified impact.

**Search term analysis** — "Show me search terms that need action" classifies terms as add, negate, or watch with reasoning.

**Cross-platform view** — "Compare Google and Meta performance this month" pulls data from both platforms and presents a unified view.

**Account audit** — "Score this account" evaluates structure, performance, and hygiene across campaigns.

## Requirements

API credentials for each platform you want to connect:
- **Google Ads** — Developer token, OAuth client ID/secret, refresh token, login customer ID
- **Bing Ads** — Developer token, client ID, refresh token, customer ID, account ID
- **Meta Ads** — Access token

The plugin walks you through setup on first run.
