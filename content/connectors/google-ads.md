---
title: Google Ads MCP
slug: google-ads
description: "An MCP server for listing Google Ads accounts, running GAQL queries, and previewing or applying mutations."
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
tags: [google-ads, mcp, gaql, paid-media, automation]
pairing: "Requires Google Ads API access and OAuth credentials."
---

Google Ads MCP is a local stdio server that connects an MCP client to the
Google Ads API. It requires Google Ads API and OAuth credentials.

## Tools and safety

- `list_accounts` lists accounts visible to the configured credentials.
- `query` runs GAQL and returns structured results.
- `mutate` supports account changes and defaults to `dry_run: true`.
- `GOOGLE_ADS_READ_ONLY=true` removes the mutation tool.
