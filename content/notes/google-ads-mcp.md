---
title: Shipping a Google Ads MCP before Google did
slug: google-ads-mcp
description: Why I built a Google Ads MCP server before I'd ever written GAQL, and why the dry-run guardrail had to live in the server instead of the config file.
date: 2026-07-13
tags: [google-ads, mcp, gaql, agents, guardrails]
sanitized: true
---

## Born from necessity

I wasn't even touching GAQL before I built this. I was looking at 12+ Google Ads accounts across two MCCs every day, checking them one at a time in the UI, and I needed a solution.

It was around the time I was learning how APIs can give agents programmatic access to tools and data. I looked into whether Google Ads had such an API and was pleasantly surprised to find GAQL, a full query language over every resource in an account. I'd managed ads for years without writing a line of it.

The server is three tools: `list_accounts` to see everything under both MCCs, `query` to run GAQL the agent composes, and `mutate` to change things — campaigns, budgets, ads, keywords.

A few weeks after I had my first working version, Google released their own official Google Ads MCP. Mine had write access, theirs didn't.

## Write access needs a hard guardrail

The write access needed absolute caution. My boss at the time was super nitpicky about the whole thing and anxious the agent would run amok in accounts with real spend.

My first attempt was instructions. I embedded the default-to-dry-run logic in the agent's config file, but often enough the agent would just bypass the dry runs and go straight to the mutation.

So I built it into the server as a hard guardrail. `mutate` defaults to `dry_run: true`, so every write validates against the API without executing until a human explicitly turns the dry run off. And for anyone who wants no writes at all, setting `GOOGLE_ADS_READ_ONLY=true` removes the mutate tool entirely, so the agent has nothing to call.

## Where it's at now

I mainly use it for a weekly KPI pull that runs on a schedule. Every Monday an agent goes through every account I manage, pulls spend for the last 7 days, and compares the Google Ads data against our backend CRM to compile a KPI report by offer and by campaign type.

![The Monday KPI report, compiled by offer and campaign type](placeholder:monday-report)

RESULTS · 12+ · accounts checked every Monday | ~5 min · to scan the full report | 0 · GAQL queries written by hand

I can scan the report in about five minutes and see the areas of opportunity and the areas that need optimization. I still don't look at the GAQL. The agent writes it and runs it.

## Make your own version

The server is open source and published as [`@channel47/google-ads-mcp`](/connectors/google-ads). `npx @channel47/google-ads-mcp@latest` plus your Google Ads API credentials gets you the same three tools. If you build anything like it and the agent gets write access, put the dry-run rule in the server rather than the config file. The config-file version got bypassed; the server version can't be.

STATUS · Published on npm / weekly KPI agent in production / write access behind dry-run defaults
