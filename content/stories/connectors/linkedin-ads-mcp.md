---
title: "$28 Clicks Make You Careful: LinkedIn Ads Without the Fear"
slug: linkedin-ads-mcp
description: "LinkedIn's API is powerful and hostile. The linkedin-ads MCP absorbs the hostility — drafts by default, local dry-runs, and analytics that respect the platform's hard limits."
type: story
category: connectors
asset:
  name: linkedin-ads
  type: mcp
  repo: https://github.com/channel47/mcps/tree/main/linkedin-ads
  install: npx @channel47/linkedin-ads-mcp@latest
  package: "@channel47/linkedin-ads-mcp"
author: Jackson Dean
date: 2026-07-02
tags: [linkedin-ads, mcp, b2b, lead-gen, analytics]
---

LinkedIn was the platform I ran with two hands on the wheel and my foot hovering over the
brake. A coaching business I managed lived there — high-ticket offer, exactly the audience
LinkedIn is uniquely good at reaching — and the clicks ran north of $28. At that price, a
misconfigured campaign doesn't teach you a lesson. It invoices you for one. A campaign that
goes live a day early, a budget with a misplaced digit, an audience saved wrong: on Meta
these are annoyances; on LinkedIn they're line items.

So when I started wiring my platforms into agents, LinkedIn was the one I hesitated on. And
when I finally built the connector, the platform's own API made the case for why it needed
one. The LinkedIn Marketing API is capable and genuinely hostile to casual use: Rest.li 2.0
protocol headers, URNs instead of plain IDs, `List(...)` query encodings that break if you
URL-encode them the normal way, versioned APIs that expire after about a year, partial
updates that require a special method header and a `{ "patch": { "$set": ... } }` body.
Every one of those is a way for a hand-rolled script to fail weirdly at 5pm on a Friday.

The `linkedin-ads` MCP server swallows all of it. Four tools — `list_accounts`, `query`,
`analytics`, `mutate` — and the protocol weirdness stays inside the box. Plain numeric IDs
are accepted everywhere and converted to URNs internally. The version header defaults to
current and is one env var to bump. Query encoding is handled the way Rest.li demands, not
the way JavaScript defaults would butcher it.

But the reason I actually trust it with a $28-CPC account is the safety posture, which is
tuned to LinkedIn's specific sharp edges:

- **Creates land as drafts.** New campaigns and creatives default to `DRAFT` — LinkedIn's
  safe, non-serving state — unless you explicitly pass a status. An agent building out a
  campaign structure cannot accidentally start spending. Going live is its own decision.
- **Dry-run previews the exact requests.** LinkedIn has no server-side validate-only mode,
  so `dry_run: true` (the default) validates locally and shows you the literal method,
  path, headers, and body it would send. You review the actual HTTP, not a summary of it.
- **Archive is treated as the hazard it is** — hard to reverse, so the tooling steers you
  to `pause`. And deletion isn't exposed at all. Deliberately. There is no conversation
  with an agent that should end in a deleted campaign.
- **Read-only mode** (`LINKEDIN_ADS_READ_ONLY=true`) removes `mutate` entirely for
  reporting-only setups.

On the measurement side, `analytics` pivots by account, campaign group, campaign, or
creative, with daily or monthly granularity — and it encodes LinkedIn's hard limits instead
of letting you discover them: at most 20 metric fields per call (enforced), and no
pagination on the analytics endpoint, which silently caps at 15,000 elements. The server
tells you to narrow the range rather than letting a quarterly report come back subtly
truncated. That one footnote is the difference between a correct number and a confident
wrong one in a client deck.

Auth handles both realities of LinkedIn tokens: paste a 60-day member token and go, or —
if your app has programmatic refresh — give it client credentials plus the year-long
refresh token and it mints and renews access tokens itself, refreshing five minutes before
expiry.

The coaching account runs through the same agent workflows as everything else now.
Structure builds land as drafts I flip live myself; weekly performance is a question; the
foot never needs to hover, because the machine's defaults are more careful than my hands
ever were.

## Grab it

```bash
claude mcp add linkedin-ads --env LINKEDIN_ADS_ACCESS_TOKEN=<token> -- npx @channel47/linkedin-ads-mcp@latest
```

Credential walkthrough (LinkedIn's Advertising API requires app approval — budget a little
patience) and the full tool reference are in the
[README](https://github.com/channel47/mcps/tree/main/linkedin-ads).
