---
title: Pinterest Ads MCP
slug: pinterest-ads
description: "An MCP server for Pinterest advertising accounts, campaign entities, analytics, and previewed mutations."
repo: https://github.com/channel47/mcps/tree/main/pinterest-ads
install: git clone https://github.com/channel47/mcps.git && cd mcps && npm install
date: 2026-07-02
tags: [pinterest-ads, mcp, dtc, attribution, seasonal, paid-media]
pairing: "Source install; this package is not published to npm. Requires Pinterest OAuth credentials, then runs with `node pinterest-ads/server/index.js`."
---

Pinterest Ads MCP connects an MCP client to the Pinterest Ads API. It requires
an access token or a supported OAuth refresh setup.

## Tools and safety

- `list_accounts` lists accessible advertising accounts.
- `query` reads supported campaign entities.
- `analytics` supports configurable attribution windows, reporting levels, and
  time granularity.
- `mutate` defaults to `dry_run: true`; new entities default to `PAUSED`.
- `PINTEREST_ADS_READ_ONLY=true` removes the mutation tool.
