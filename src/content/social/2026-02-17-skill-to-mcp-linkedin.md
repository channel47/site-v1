---
title: "Skill to MCP pivot"
date: 2026-02-17
platform: linkedin
status: draft
newsletter: 2026-02-17-built-wrong-thing
---

I built a Bing Ads skill for Claude last Friday. Teaches it how to connect to the API, query accounts, create campaigns. It worked. Used it to launch campaigns across five products without opening the Bing UI once.

Then I tried to expand it into this universal ad platform connector skill. One skill that could handle Bing, Google, all of it. Tested it Monday morning in Cowork against real accounts and spent an hour debugging connection issues. Dependencies missing, auth breaking, config mismatches.

It eventually connected, but the friction made me stop and rethink the whole thing. I was trying to make a skill do two jobs. Skills are good at teaching Claude what a campaign should look like and how to think about it. But handling live API connections, auth, credentials management? That's what MCP servers are for.

Scrapped the approach, built a Bing Ads MCP server, packaged it into the plugin. Install the plugin, the connections come with it.

I keep coming back to this framing of plugins that package professions. Skills for the knowledge, MCPs for the connections, sub-agents for the workflows. Three layers, each doing one thing. This is what I'm building with Channel 47, starting with the media buyer plugin.

What's the most useful thing that broke on you recently?
