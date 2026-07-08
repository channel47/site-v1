---
title: "Skills Lab #2: Creative Strategist Plugin"
slug: creative-strategist-plugin
description: "From single skills to a chained system. A live walkthrough of the Creative Strategist plugin, three skills that mine real customer voice into personas and ranked ad angles, tested on a product the room picked."
status: past
date: 2026-04-10
duration: "95 min"
author: Jackson Dean
tags: [skills, plugins, creative-strategy, customer-research, personas, ad-angles, claude-code, cowork]
relatedAsset:
  type: skill
  slug: creative-strategist
---

Quick recap of the lineage, since I gave it on air too: the February flagship was the broad 200-person overview, the March lab demoed the mechanics of a single skill (the Voice Skill Builder), and this session went a level deeper. Not one skill, but a **collection of 3 chained skills** packaged as a Claude plugin.

If you've installed the creative-strategist skill from this site, this session was effectively its origin story and live introduction.

## The marketplace and the plugin format

I started by showing my own self-hosted Claude **plugin marketplace**, a GitHub repo holding 3 plugins I built: Creative Strategist (the star of this session), Media Buyer (real Google Ads and Bing Ads connectors I use in my actual day job), and a Front-end Designer plugin. A plugin is just Claude's packaging format for bundling skills, agents, connectors, and hooks together, and you install one by adding the marketplace source (a GitHub repo) inside Claude's Customize tab.

## Inside Creative Strategist

The plugin contains 3 core skills plus a meta-skill that chains them:

- **customer-research** scrapes real customer voice from Reddit, Amazon reviews, and Trustpilot. It ships with fallback instructions for when sites block bots (try Playwright browser tools, Firecrawl, other workarounds), and I was upfront that this part is explicitly built to need re-maintenance as sites change their blocking. Skills are software. They need maintenance.
- **persona-builder** turns the research into typically 4 target buyer personas plus 1 **anti-persona**: the person who engages with your ads, never buys, and only raises your CAC.
- **angle-generator** combines research and personas into ranked marketing angles and hooks using named frameworks: pain/agitation/failed-solution, trigger-event, identity angles.

There's a **full pipeline** meta-skill that runs all 3 in sequence, and a dedicated research-crawler sub-agent that exists for one reason: long web research would blow out the main conversation's context window, so the sub-agent does the scouring and hands back a pre-formatted summary.

## The live demo (and the snag)

I let the room vote on a real product to test, and they picked a plant protein powder brand. First attempt: running the full pipeline inside Claude Cowork. It hit a wall, because Cowork's more sandboxed browser access blocked the research step. I pivoted to running the customer-research skill on its own, which worked, and the snag turned into the most useful lesson of the night.

**Cowork is the same underlying harness as Claude Code, just more restricted by default.** No free network or folder access out of the box. So Claude Code is the more reliable home for anything research-heavy, while Cowork is the friendlier front door Anthropic built for the same power. Related distinction we covered: plain chat can't write files to a working folder. Only Cowork and Code can, which is why real work sessions belong in one of those two.

We also walked through customizing the plugin's built-in angle frameworks to your own taste via Claude Desktop's Customize tab.

Ann Marie closed by confirming another lab the following month, which became the advertorial session.
