---
title: "google-ads-mcp — Put Google Ads inside your agent"
slug: google-ads
description: "An MCP server for listing Google Ads accounts, running GAQL queries, and previewing or applying mutations."
repo: https://github.com/channel47/mcps/tree/main/google-ads
install: npx @channel47/google-ads-mcp@latest
package: "@channel47/google-ads-mcp"
date: 2026-07-02
tags: [google-ads, mcp, gaql, paid-media, automation]
pairing: "Requires Google Ads API access and OAuth credentials."
faqs:
  - q: "Is it safe to point at a live account?"
    a: "Changes are opt-in twice over: the mutate tool defaults to a dry-run preview, and setting GOOGLE_ADS_READ_ONLY=true removes the mutation tool entirely, leaving only account listing and GAQL queries."
  - q: "What credentials does it need?"
    a: "Google Ads API access and OAuth credentials for the account. The server runs locally over stdio, so credentials stay on your machine."
  - q: "What can my agent actually do with it?"
    a: "List the accounts visible to the configured credentials, run GAQL queries with structured results, and preview or apply mutations."
---

Google Ads MCP is a local stdio server that connects an MCP client to the
Google Ads API. It requires Google Ads API and OAuth credentials.

## Tools and safety

- `list_accounts` lists accounts visible to the configured credentials.
- `query` runs GAQL and returns structured results.
- `mutate` supports account changes and defaults to `dry_run: true`.
- `GOOGLE_ADS_READ_ONLY=true` removes the mutation tool.
