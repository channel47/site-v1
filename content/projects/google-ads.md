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
updated: 2026-09-13
newsletter: I write about the tools I build for media buying, including what breaks and what I change.
tags: [google-ads, mcp, gaql, paid-media, automation, agents, guardrails]
sanitized: true
pairing: "Runs locally over stdio. Requires a Google Ads developer token and OAuth credentials. The [configuration guide](https://github.com/channel47/mcps/tree/main/google-ads#configuration) includes the environment variables and an MCP client example."
faqs:
  - q: "How do I control changes to a live account?"
    a: "The mutate tool defaults to dry_run=true, which validates without applying changes. A caller can apply changes with dry_run=false; the flag is not a separate human approval step. For reporting only, set GOOGLE_ADS_READ_ONLY=true to remove the mutation tool and reject mutation calls."
  - q: "What credentials does it need?"
    a: "A Google Ads developer token, OAuth client ID and client secret, and an OAuth refresh token for the account. You configure these locally as environment variables; the server uses them to authenticate with Google."
  - q: "What can my agent actually do with it?"
    a: "List the accounts visible to the configured credentials, run GAQL queries with structured results, and preview or apply mutations."
---

My Google Ads tool told me it had checked a new ad without making any changes. I opened the account and found the ad sitting there. When I ran what was supposed to be the real version, I got a second one. I'd released the first public version of the tool just a week earlier.

The project grew out of a smaller experiment with an email tool. I was using Drip for email at my own business when I discovered it had an API, a way for software to do many of the things I did inside the app. Coding agents were becoming useful, and I was beginning to see how I might use one.

An MCP server connects an AI agent to tools through the Model Context Protocol. In this case, it could let an agent work with Drip. That was about as far as my technical understanding went. I couldn't write the server myself, but I could describe what I wanted, point a coding agent at the documentation, and try what it built. Anthropic's MCP Builder skill helped me get started.

The first version had 18 named actions, including adding subscribers, applying tags, starting workflows, and pulling campaigns. I knew those jobs from using Drip. Seeing an agent do them through a tool I'd helped build made another project seem possible.

When I started a new job, I came across the Google Ads API. I'd managed Google Ads for years, so I already knew the work I wanted help with: campaigns, search terms, budgets, and the reports I kept assembling. Looking through the documentation, it seemed I could reach almost all of it. I had a long list of tasks I wanted to stop doing by hand.

![An illustrated connection from an agent, through an MCP server, to the Google Ads API. The physical objects are conceptual.](/posts/google-ads-connection-v3.webp)

I began by giving each familiar task its own command. Get campaign performance. Pull search terms. Find wasted spend. Check Quality Score. Track budget pacing. Whenever I thought of another job, I asked the coding agent to add it.

At 13 commands, I realized most of them were variations on a few operations. The agent needed to find the accounts it could access, read their data, and make changes. Those became the three tools: `list_accounts`, `query`, and `mutate`.

The query tool uses GAQL, Google's query language for Ads data. Instead of adding a command for every report, I could describe the report and let the agent write the query. Changes worked in a similar way: I'd describe the account task, and the agent would prepare the operation. A new question no longer meant adding another tool to the server.

![The three tools in MCP Inspector, a tool for inspecting MCP servers, shown in September 2026. The example query is for enabled campaigns; no account query was run.](/posts/google-ads-inspector-v2.webp "screenshot")

I released the package, `@channel47/google-ads-mcp`, on January 7 and began using it on real accounts. Then came the duplicate ads.

The operation was meant to be a dry run: send Google the proposed change for validation, but don't apply it. The response said that was what had happened. I couldn't explain which part of the code had failed, but I could show the coding agent what I'd asked for and what had appeared in the account.

It traced the problem to two setting names. The code passed `partialFailure` and `validateOnly` to a connection that expected `partial_failure` and `validate_only`. The unrecognized settings were ignored. Google received the request without the instruction to validate only, while my tool still reported that no changes had been made.

The [fix changed those two names](https://github.com/channel47/google-ads-mcp-server/commit/3de539fa396183acfb59e76fdafbc514236a2402). It was a small edit with a consequence I could see in the account. The response alone hadn't told me whether the tool had done what I intended.

![The original fix changes partialFailure and validateOnly to partial_failure and validate_only, allowing the connection to pass the validation settings through.](/posts/google-ads-dry-run-fix-v3.webp "screenshot")

I kept using the MCP over the following months, for account work as well as reporting. I wanted write access available when the task called for it, and a way to remove it when it didn't. I've since had an agent set up a Google search campaign through the server.

The mutation tool now defaults to `dry_run: true`, which validates a request without applying it. A caller can apply the change by setting `dry_run: false`; that setting doesn't itself require a person to approve anything. For reporting, `GOOGLE_ADS_READ_ONLY=true` removes the mutation tool and rejects mutation calls. The agent then has the two operations it needs to find accounts and query their data.

The job I use it for most regularly is the Monday report. An agent pulls the previous seven days from more than a dozen accounts under two manager accounts, then combines the Google Ads data with our customer relationship management system's data. I have it group the report by offer and campaign type, which helps me see where to look without opening every account separately.

![An illustrative Monday report combines Google Ads and CRM data by offer and campaign type. It shows the report's structure, not client results.](/posts/google-ads-monday-report-v2.webp)

The server [runs locally with Google Ads credentials](https://github.com/channel47/mcps/tree/main/google-ads#configuration); the installation command and requirements are below. Its three tools are still enough for the work I keep returning to.

I don't write the Monday queries. I ask for the report and check it against what I know about the accounts. Most weeks I never open the dashboards. I still need the years I spent learning those accounts to judge what comes back, but I no longer need to collect all the numbers myself.
