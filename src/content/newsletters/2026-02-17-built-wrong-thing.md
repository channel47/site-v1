---
title: "I built the wrong thing this week"
date: 2026-02-17
status: draft
---

Four attempts to verify a single API connection. Most useful thing that happened all week.

Back up. Last Friday I built a Bing Ads skill for Claude. It taught Claude how to authenticate against the API, query accounts, create campaigns. Had it working by evening. Used it alongside Claude to launch campaigns across five products and scale budgets on others that were performing. Never opened the Bing UI. That part worked.

I kept building.

Expanded the Bing skill into a broader ad platform connector. One skill to teach Claude how to work with any ad platform API. Bing, Google, eventually Meta, whatever else. Skills are portable, just markdown and scripts. I figured one skill could handle every platform I'd ever need.

Monday morning I fired it up in Cowork against real accounts. First attempt, dependencies weren't installed. Second attempt, the auth couldn't find my credentials. Third attempt, credentials found but the config format didn't match what the auth expected. Fourth attempt, had to manually map the account hierarchy.

It eventually connected. Seventy-one Google Ads accounts across one manager account, twelve across another, Bing authenticated and ready.

And that's when I stopped.

A skill that needs four attempts to verify a connection isn't teaching Claude anything. It's carrying infrastructure that doesn't belong there.

Skills teach Claude what to do. What a good campaign looks like, how to read a search term report, what budget pacing should feel like. That's the layer they're good at.

Auth, credentials, live API access. Different job entirely. That's what MCP servers are for. They're the wiring layer. Point one at an ad platform and Claude can authenticate, query accounts, push changes without the skill knowing how the connection works.

I'd been cramming both jobs into one skill. Worked fine for Bing alone. The moment I tried to make it portable, the seams ripped.

By the afternoon I'd pulled the connection piece out. Built a Bing Ads MCP server and packaged it into the media buyer plugin so it installs automatically. No dependency hunting. No manual config.

That's the architecture I'm building with Channel 47. Plugins that package entire professions. The MCP servers handle connections. The skills carry domain knowledge. And sub-agents run workflows that tie them together. The media buyer plugin is Season 1, and every future profession follows the same structure.

None of this came from reading docs. I learned it from four failed connection attempts on a Monday morning.

— Jackson
