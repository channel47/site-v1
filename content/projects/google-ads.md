---
title: "How I built my Google Ads MCP"
slug: google-ads
rssId: /connectors/google-ads
description: "Drip showed me I could build tools for an agent. Then I found the Google Ads API and started working through the account tasks I wanted it to do."
preview:
  src: /projects/google-ads/opengraph-image
  alt: How I built my Google Ads MCP, with the yellow collection artwork.
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
updated: 2026-09-10
newsletter: I write about the tools I build for media buying, including what breaks and what I change.
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

I was using Drip for email at my own business in the middle of 2025, right as agentic coding tools started becoming useful. Discovering its API meant I could get at the same things I was using inside the app. An MCP would give an agent a way to use that API, so I used Anthropic's MCP Builder skill to help build one.

That was about as technical as my understanding went. I don't know how to write the code underneath an MCP server. But I could describe what I wanted, point a coding agent at the API docs, and test what came back.

The first version had 18 named actions. Add a subscriber. Apply a tag. Start a workflow. Pull a campaign. These were things I already knew how to do inside Drip. Now I could ask an agent to do them through a tool I'd helped build.

[Jump to installation](#install)

## Then I found the Google Ads API

I started a new job in November and came across the Google Ads API. I'd managed Google Ads for years. I understood accounts, campaigns, search terms, budgets, and the reports I needed to make decisions. The API appeared to reach almost all of it.

I remember looking through the documentation and thinking, I could do basically anything with this. After Drip, building another MCP felt like something I could actually attempt. And I had a long list of account tasks I wanted to stop doing by hand.

![An agent connects through the MCP to the Google Ads API. The physical objects are generated illustrations of that relationship.](/posts/google-ads-connection-v3.webp)

## Thirteen commands became three tools

My first instinct was to give every familiar Google Ads task its own command. Get campaign performance. Pull search terms. Find wasted spend. Check Quality Score. Track budget pacing.

I kept asking the coding agent to add one more until the MCP had 13 separate commands. Eventually I realized they were all variations of three things.

- Find the accounts available to me with `list_accounts`.
- Read and report on the data with `query`.
- Make a change with `mutate`.

![The three tools in MCP Inspector, with an example query for enabled campaigns. This shows the real tool interface; no account query was run.](/posts/google-ads-inspector-v2.webp "screenshot")

I didn't need a separate command for every question I might ask. The smaller version could still pull search terms, check budgets, find wasted spend, and update campaigns. The agent worked out the query or change from the job I described.

On January 7, 2026, the first public version shipped as `@channel47/google-ads-mcp`. Then I started using it on real accounts.

## The preview created a real ad

A week after release, I asked the MCP to validate a new ad without publishing it. The server came back and said no changes were made.

I checked the Google Ads account. The ad was sitting there. Then I ran what was supposed to be the real version, and that created a second one.

I couldn't have explained which part of the code had failed. I knew what I'd asked the system to do, and I could see what it had actually done.

I brought it back to the coding agent. It traced the problem to two setting names written in a format the connection to Google Ads ignored. Nothing had crashed. The safety settings simply never reached Google.

The agent [fixed the names](https://github.com/channel47/google-ads-mcp-server/commit/3de539fa396183acfb59e76fdafbc514236a2402) and added tests. My job was to check what happened in the account and bring back anything that didn't match what I'd asked for.

![The original fix: partialFailure and validateOnly became partial_failure and validate_only, so the API received the validation settings.](/posts/google-ads-dry-run-fix-v3.webp "screenshot")

## Adding previews and a read-only mode

I needed the server to enforce those checks even if the agent got the request wrong.

The mutation tool now defaults to `dry_run: true`, which validates the request without applying it. Applying a change requires `dry_run: false`. For reporting, setting `GOOGLE_ADS_READ_ONLY=true` removes the mutation tool entirely.

I kept optional write access because I use the server for hands-on account work. The read-only setting lets me limit it to finding accounts and pulling data when that's all I need.

I've since had an agent set up a Google search campaign through the MCP I built. That's one of the moments that changed my sense of what I could do myself. I knew how I wanted to run campaigns, and now I could build a way for an agent to help me do it.

## The report I use every Monday

The regular job is Monday reporting. An agent pulls the previous seven days from more than a dozen accounts under two manager accounts, then combines that Google Ads data with our CRM data. The report is grouped by offer and campaign type, so I can see which accounts need attention without opening them one by one.

![An illustrated report layout: Google Ads and CRM records come together by offer and campaign type, with spend, revenue, conversions, ROAS, and changes over time.](/posts/google-ads-monday-report-v2.webp)

I don't write the queries for that report. I ask for it and check it against what I know about the accounts. Most weeks I never open the dashboards.
