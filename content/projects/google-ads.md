---
title: "Building my own Google Ads MCP"
slug: google-ads
rssId: /connectors/google-ads
description: "An email tool gave me the confidence to build a Google Ads MCP. Using it on real accounts taught me what I had to fix."
preview:
  src: /projects/google-ads/opengraph-image
  alt: Building my own Google Ads MCP, with the yellow collection artwork.
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
storyDate: "2026-01"
updated: 2026-09-12
newsletter: I write about the tools I build for media buying, including what breaks and what I change.
tags: [google-ads, mcp, gaql, paid-media, automation, agents, guardrails]
sanitized: true
pairing: "Runs locally over stdio. Requires a Google Ads developer token and OAuth credentials. The [configuration guide](https://github.com/channel47/mcps/tree/main/google-ads#configuration) includes the environment variables and an MCP client example."
faqs:
  - q: "Is it safe to point at a live account?"
    a: "The mutate tool defaults to a dry-run preview. Applying a change requires dry_run=false. For reporting only, set GOOGLE_ADS_READ_ONLY=true to remove the mutation tool entirely."
  - q: "What credentials does it need?"
    a: "A Google Ads developer token, OAuth client ID and client secret, and an OAuth refresh token for the account. You configure these locally as environment variables; the server uses them to authenticate with Google."
  - q: "What can my agent actually do with it?"
    a: "List the accounts visible to the configured credentials, run GAQL queries with structured results, and preview or apply mutations."
---

My Google Ads tool told me it had validated a new ad without making any changes. I opened the account and found the ad sitting there. When I ran what was supposed to be the real version, I got a second one. I'd released the first public version just a week earlier.

[Jump to installation](#install)

## It started with an email app

I was using Drip for email at my own business when I discovered it had an API: a way for software to do many of the things I did inside the app.

Agentic coding tools were becoming useful. An MCP server could make those actions available to an agent. That was about as far as my technical understanding went. I couldn't write the server myself, but I could describe what I wanted, point a coding agent at the documentation, and try what it built. Anthropic's MCP Builder skill helped me get started.

The first version had 18 named actions, including adding subscribers, applying tags, starting workflows, and pulling campaigns. I knew these jobs from using Drip. Now I could ask an agent to do them through a tool I'd helped build.

When I started a new job, I came across the Google Ads API. I'd managed Google Ads for years, so I knew the accounts, campaigns, search terms, budgets, and reports I wanted to work with. Looking through the documentation, it seemed I could reach almost all of them.

After Drip, another MCP felt like something I could attempt. I had a long list of account tasks I wanted to stop doing by hand.

![An agent connects through the MCP to the Google Ads API. The physical objects are generated illustrations of that relationship.](/posts/google-ads-connection-v3.webp)

## Thirteen commands became three tools

I began by giving each familiar task its own command: get campaign performance, pull search terms, find wasted spend, check Quality Score, track budget pacing. Whenever I thought of another job, I asked the coding agent to add it.

At 13 commands, I realized I was describing variations of three operations.

- Find the accounts available to me with `list_accounts`.
- Read and report on the data with `query`.
- Make a change with `mutate`.

![The three tools in MCP Inspector, shown in September 2026. The example query is for enabled campaigns; no account query was run.](/posts/google-ads-inspector-v2.webp "screenshot")

The `query` tool uses GAQL, Google's query language for Ads data. I could describe the report I wanted and let the agent write the query. The same idea applied to changes: I described the account task, and the agent worked out the mutation. I no longer needed to add a command for every new question.

On January 7, I released `@channel47/google-ads-mcp` and started using it on real accounts.

## Why the preview made changes

Then came the duplicate ads.

I couldn't explain which part of the code had failed. I could explain what I'd asked for and show what had happened in the account. I took that back to the coding agent.

It traced the problem to two setting names. They were written in a format the Google Ads connection ignored, so the validation settings never reached Google. Nothing crashed; the request went through without the protection I thought I'd asked for.

The agent [fixed the names](https://github.com/channel47/google-ads-mcp-server/commit/3de539fa396183acfb59e76fdafbc514236a2402) and added tests.

![The original fix: partialFailure and validateOnly became partial_failure and validate_only, so the API received the validation settings.](/posts/google-ads-dry-run-fix-v3.webp "screenshot")

## Update: September 2026

I'm using the MCP for account work as well as reporting. I want to keep write access available, with a way to limit what an agent can do.

The mutation tool now defaults to `dry_run: true`, which validates a request without applying it. Applying a change requires `dry_run: false`. For reporting only, `GOOGLE_ADS_READ_ONLY=true` removes the mutation tool entirely.

I've since had an agent set up a Google search campaign through it. When I only need data, I can leave it with the two tools for finding accounts and querying them.

### Monday reporting

The job I use it for most regularly is the Monday report. An agent pulls the previous seven days from more than a dozen accounts under two manager accounts, then combines the Google Ads data with our CRM data. Grouping the report by offer and campaign type lets me see which accounts need attention without opening them one by one.

![An illustrated report layout: Google Ads and CRM records come together by offer and campaign type, with spend, revenue, conversions, ROAS, and changes over time.](/posts/google-ads-monday-report-v2.webp)

I don't write the queries. I ask for the report and check it against what I know about the accounts. Most weeks I never open the dashboards.
