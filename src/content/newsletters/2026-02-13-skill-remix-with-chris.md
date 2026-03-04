---
title: "Remixed a skill with my boss yesterday"
date: 2026-02-13
status: draft
kit_broadcast_id: 22927212
---

You signed up through Channel 47. This is the first email. Short ones when something ships.

Yesterday after the workshop, Chris (a fellow marketer) sat down with me and we remixed one of the skills I'd demoed. An hour later we had a native ad generator that neither of us could have built from scratch.

## What we started with

The [Ad Creative Variant Generator](https://github.com/channel47/plugins/tree/main/plugins/paid-search/skills/creative-variants). Feed it a winning ad image, it figures out what's working, generates variations at three divergence levels (subtle, moderate, dramatic). Runs on Google's Gemini image model. I built this a few weeks ago by remixing an image generation skill from OpenAI.

Chris wanted to reshape it for native ad platforms. Taboola, Outbrain. With headlines. Running inside Claude Cowork.

## The block

We set up the Gemini API key, installed the dependencies in our project folder, loaded the skill in Cowork, and ran it. Network restriction error. Claude couldn't reach Google's image API.

## The fix

Claude has an "allowed domains" list in settings. We added the Gemini API URL, restarted Claude, ran it again.

Worked.

30 seconds in settings. That was the whole difference between a blocked session and a working tool.

## What we ended up with

Two skills from one starting point.

The original generates ad variations you can split test across any platform. The remix produces native ads with headlines, tuned for that editorial look native platforms reward.

Chris isn't a developer. I'm barely one. We just had a clear picture of what we needed, and the existing skill gave us something to start from. That's what remixing is. You don't start from scratch every time you cook. You find a recipe that's close and adjust.

## Try it

The creative variant generator is [open source](https://github.com/channel47/plugins/tree/main/plugins/paid-search/skills/creative-variants). It lives inside a Claude plugin I built, and has a few other skills in it too.

To install, add the Channel 47 marketplace and pick the paid-search plugin.

**In Cowork:** Type `/plugins` to open the plugin browser. Add `channel47/plugins` as a marketplace, then select paid-search from the list.

**In Claude Code:**

`/plugin marketplace add channel47/plugins`

`/plugin install paid-search@channel47`

If you're in Cowork and hit the same network block, same fix from the story above.

Reply to this email if you want to try it and get stuck. I'll walk you through setup.

— Jackson

P.S. The native ad generator is rough. We built it yesterday. It works, but it'll get better.
