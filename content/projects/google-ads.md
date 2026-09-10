---
title: "How I built my Google Ads MCP"
slug: google-ads
rssId: /connectors/google-ads
description: "I used coding agents to build a Google Ads MCP, tested it on real accounts, and worked through the mistakes before making it part of my Monday reporting."
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
tags: [google-ads, mcp, gaql, paid-media, automation, agents, guardrails]
sanitized: true
pairing: "Runs locally over stdio. Requires a Google Ads developer token and OAuth credentials. The [configuration guide](https://github.com/channel47/mcps/tree/main/google-ads#configuration) includes the environment variables and an MCP client example."
faqs:
  - q: "Is it safe to point at a live account?"
    a: "The mutate tool defaults to a dry-run preview. Applying a change requires dry_run=false. For reporting only, set GOOGLE_ADS_READ_ONLY=true to remove the mutation tool entirely."
  - q: "What credentials does it need?"
    a: "Google Ads API access and OAuth credentials for the account. The server runs locally over stdio, so credentials stay on your machine."
  - q: "What can my agent actually do with it?"
    a: "List the accounts visible to the configured credentials, run GAQL queries with structured results, and preview or apply mutations."
---

My first MCP wasn't for Google Ads. It was for Drip.

I was using Drip for email at my own business in the middle of 2025, right as agentic coding tools started becoming useful. I knew Drip had an API. I had also started to understand what an MCP could do. It gives an agent a way to use an API.

That was about as technical as my understanding went. I don't know how to write the code underneath an MCP server. What I could do was describe what I wanted, point a coding agent at the API docs, and test what came back.

The first version had 18 named actions. Add a subscriber. Apply a tag. Start a workflow. Pull a campaign. Familiar things I was already doing inside an email platform, now available to the agent.

[Jump to installation](#install)

## Then I found the Google Ads API

I started a new job in November and came across the Google Ads API. I'd managed Google Ads for years. I understood accounts, campaigns, search terms, budgets, and the reports I needed to make decisions. The API appeared to reach almost all of it.

I remember looking through the documentation and thinking, I could do basically anything with this. I had a long list of account tasks I wanted to stop doing by hand.

![The timeline from my first Drip experiment in 2025 to the Google Ads MCP release in January 2026.](/posts/google-ads-mcp-whiteboard-journey.jpg)

## Thirteen commands became three tools

My first instinct was to give every familiar Google Ads task its own command. Get campaign performance. Pull search terms. Find wasted spend. Check Quality Score. Track budget pacing.

I kept asking the coding agent to add one more until the MCP had 13 separate commands. Eventually I realized they were all variations of three things.

- Find the accounts available to me with `list_accounts`.
- Read and report on the data with `query`.
- Make a change with `mutate`.

![Thirteen task-specific commands reduced to account discovery, queries, and mutations.](/posts/google-ads-mcp-whiteboard-three-tools.jpg)

The smaller version could still pull search terms, check budgets, find wasted spend, and update campaigns. The agent worked out the query or change from the job I described.

On January 7, 2026, the first public version shipped as `@channel47/google-ads-mcp`. Then I started using it on real accounts.

## The preview created a real ad

A week after release, I asked the MCP to validate a new ad without publishing it. The server came back and said no changes were made.

I checked the Google Ads account. The ad was sitting there. Then I ran what was supposed to be the real version, and that created a second one.

![Both runs reported no changes, but the preview created one live ad and the second run created another.](/posts/google-ads-mcp-whiteboard-incident.jpg)

I couldn't have explained which part of the code had failed. I knew what I'd asked the system to do, and I could see what it had actually done.

I brought it back to the coding agent. It traced the problem to two setting names written in a format the connection to Google Ads ignored. Nothing had crashed. The safety settings simply never reached Google.

The agent fixed the names and added tests. My job was to check what happened in the account and bring back anything that didn't match what I'd asked for.

## Adding previews and a read-only mode

I needed the server to enforce those checks even if the agent got the request wrong.

The mutation tool now defaults to `dry_run: true`, which validates the request without applying it. Applying a change requires `dry_run: false`. For reporting, setting `GOOGLE_ADS_READ_ONLY=true` removes the mutation tool entirely.

I kept optional write access because I use the server for hands-on account work. The read-only setting lets me limit it to finding accounts and pulling data when that's all I need.

## The report I use every Monday

Every Monday an agent moves through more than a dozen Google Ads accounts under two manager accounts. It pulls the previous seven days, compares the ad data with our backend CRM, and organizes the report by offer and campaign type.

The MCP supplies the Google Ads data. The agent combines it with the CRM data as part of that reporting workflow.

![Ads and CRM data organized into a report by offer, with spend, revenue, conversions, ROAS, and changes over time.](/posts/google-ads-mcp-whiteboard-kpi-scan.jpg)

I ask for the report and judge it like a marketer. I can see which accounts need attention without opening them one by one.

Most weeks I never open the dashboards.
