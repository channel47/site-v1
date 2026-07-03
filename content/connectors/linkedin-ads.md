---
title: LinkedIn Ads MCP
slug: linkedin-ads
description: "LinkedIn's hostile Marketing API, absorbed — drafts by default, local dry-runs, analytics that respect the platform's hard limits, and a read-only mode."
repo: https://github.com/channel47/mcps/tree/main/linkedin-ads
install: npx @channel47/linkedin-ads-mcp@latest
package: "@channel47/linkedin-ads-mcp"
date: 2026-07-02
tags: [linkedin-ads, mcp, b2b, lead-gen, analytics]
---

$28 clicks make you careful. LinkedIn's Marketing API is powerful and hostile —
Rest.li 2.0 protocol ceremony, URNs everywhere, hard limits that surface as
mysteries. This MCP server absorbs the hostility and defaults every risky
operation to a safe, non-serving state.

## What it does

- **Four tools:** `list_accounts`, `query`, `analytics`, `mutate`.
- Hides the Rest.li 2.0 weirdness: plain numeric IDs accepted everywhere and
  converted to URNs internally, `List(...)` query encoding handled, the
  version header defaulting to current (one env var to bump), partial updates
  via the patch method.
- **Creates land as drafts:** new campaigns and creatives default to
  LinkedIn's `DRAFT` state — safe, non-serving — unless you explicitly pass a
  status.
- **Dry-run previews the literal request:** `dry_run: true` is the default,
  and since LinkedIn has no server-side validate mode, it validates locally
  and shows the exact method, path, headers, and body it would send.
- Archive is steered toward `pause` (archive is hard to reverse); deletion
  isn't exposed at all.
- **Read-only mode:** `LINKEDIN_ADS_READ_ONLY=true` removes `mutate` entirely.
- `analytics` pivots by account, campaign group, campaign, or creative, daily
  or monthly — and encodes the hard limits: max 20 metric fields per call
  (enforced), no pagination on the analytics endpoint (caps at 15,000
  elements; it tells you to narrow the range instead of silently truncating).

## Setup

Add with `claude mcp add linkedin-ads --env LINKEDIN_ADS_ACCESS_TOKEN=<token>
-- npx @channel47/linkedin-ads-mcp@latest`. Auth takes either a 60-day member
token pasted directly, or client credentials plus a year-long refresh token —
the server mints and renews access tokens itself, refreshing five minutes
before expiry. Note LinkedIn's Advertising API requires app approval.
