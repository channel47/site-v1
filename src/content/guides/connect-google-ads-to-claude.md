---
title: "How to Connect Google Ads to Claude"
description: "Step-by-step guide to connecting your Google Ads accounts to Claude using the channel47 Media Buyer plugin. From API credentials to your first morning brief in under 15 minutes."
date: 2026-03-04
category: setup
plugin: media-buyer
featured: true
---

## What you'll set up

By the end of this guide, Claude will have read-only access to your Google Ads accounts. You'll be able to run morning briefs, waste detection, and search term analysis on live data — all from Claude.

Everything runs locally on your machine. Your credentials stay in your environment variables. No data flows to channel47 or any third party.

**Time required:** 10-15 minutes for initial setup. After that, it's one command to install and you're running.

## Prerequisites

- **Claude Code** or **Claude Cowork** installed
- A **Google Ads account** with active campaigns (manager or individual account)
- A **Google Cloud project** (free to create)

## Step 1: Install the plugin

In Claude Code, run:

```
claude plugin install media-buyer@channel47
```

This installs the Media Buyer plugin with connections for Google Ads, Bing Ads, and Meta Ads, plus safety hooks for mutations. You configure credentials for the platforms you use.

## Step 2: Set up Google Cloud credentials

The plugin needs OAuth2 credentials to access the Google Ads API. Here's the process:

1. Go to [Google Cloud Console](https://console.cloud.google.com) and create a new project (or use an existing one)
2. Enable the **Google Ads API** in your project's API Library
3. Create **OAuth 2.0 credentials** (Desktop application type)
4. Download the credentials JSON file

The platform-setup workflow walks you through each step with exact navigation paths. Just tell Claude:

```
Run platform-setup
```

It will verify each credential, test the API connection, and confirm which accounts you have access to.

## Step 3: Configure your environment

Set these environment variables with your credentials:

```bash
export GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
export GOOGLE_ADS_CLIENT_ID="your-client-id"
export GOOGLE_ADS_CLIENT_SECRET="your-client-secret"
export GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"
export GOOGLE_ADS_LOGIN_CUSTOMER_ID="your-manager-id"
```

Add them to your `~/.zshrc` or `~/.bashrc` so they persist across sessions.

**Developer token:** Apply for one in your Google Ads account under Tools > API Center. Basic access (15,000 operations/day) is sufficient for monitoring workflows.

**Refresh token:** The platform-setup workflow generates this through the OAuth consent flow. It opens a browser, you authorize, and the token is returned.

## Step 4: Run your first workflow

Start with the morning brief — it's the fastest way to see real value:

```
Run my morning brief
```

The morning brief checks pacing, spend anomalies, conversion shifts, and quality score changes across your accounts. Output is a prioritized action plan with dollar impact estimates.

## What's available

Once connected, you have 9 workflows:

| Workflow | What it does |
|----------|-------------|
| Morning brief | Daily health check with prioritized action plan |
| Waste detector | Identifies wasted spend with dollar-quantified impact |
| Search term verdict | Classifies queries and generates negative keyword lists |
| PMax decoder | Extracts search terms, channel mix, and asset performance from Performance Max |
| Platform setup | Credential verification and API connection testing |
| Account scorecard | Cross-account performance summary |
| Budget pacing | Budget utilization and projected over/underspend |
| Quality score audit | QS distribution and CPC inflation analysis |
| Auction insights | Competitive position analysis |

## Troubleshooting

**"API access denied"** — Your developer token may need approval. Check Tools > API Center in Google Ads. Basic access is usually auto-approved for existing accounts.

**"No accounts found"** — If you use a manager account, make sure `GOOGLE_ADS_LOGIN_CUSTOMER_ID` is set to the manager account ID (without dashes).

**"Quota exceeded"** — Basic access allows 15,000 operations/day. A morning brief across 5 accounts uses roughly 50-100 operations. If you hit quota, wait until midnight PT for reset.

## Next steps

- [Run the waste detection workflow](/guides/waste-detection-google-ads) to find spend bleed
- [Run the morning brief workflow](/guides/morning-brief-workflow) daily
- Configure [Bing Ads or Meta Ads](/plugins/media-buyer) credentials to cover more platforms
- [Subscribe to Build Notes](/subscribe) for workflow updates and new releases
