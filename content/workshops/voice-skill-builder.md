---
title: "Skills Lab #1: Voice Skill Builder"
slug: voice-skill-builder
description: "The first Skills Lab. Building a complete brand voice skill for Dr. Squatch live in Claude Desktop, from writing samples to a packaged one-click install, using a meta-skill that does the heavy lifting."
status: past
date: 2026-03-05
duration: "70 min"
author: Jackson Dean
tags: [skills, voice, brand-voice, claude-desktop, claude-code, opus]
---

I opened this one with "welcome everybody to the first Skills Lab," and that's exactly what it was: the first of the smaller, hands-on monthly sessions we promised after the February intro workshop. Ann Marie co-hosted again, and the smaller group meant we could actually stop and answer questions mid-build.

The whole session was one worked example: building a **brand voice skill for Dr. Squatch**, the soap brand, using a meta-skill I built called the Voice Skill Builder.

## The before and after

First, the before. I asked Claude to write ad copy for a soap brand with no skill loaded. The result was generic, slightly off-brand, and yes, it included an em dash, which got a laugh. AI has a dash habit.

Then we ran the Voice Skill Builder, which works in **6 phases**:

1. **Intake**: collect writing samples. Paste them directly, upload files, hand it a URL and let Claude read across the site, or reference past Claude chats.
2. **Analysis**: Claude names the core voice attributes it detects. For Dr. Squatch it surfaced things like "comedy-first education," "bro-adjacent but not bro," "anti-corporate insurgent," and the "natural equals manly" reframe. Watching it name those out loud is the moment the room got it.
3. **Interview**: a short back-and-forth if it needs more context.
4. **Draft generation**: it builds the actual skill files.
5. **Calibration**: it generates real samples across formats (social post, blog intro, product description, email, FAQ, ad headline, push notification) so you can test the voice before committing.
6. **Packaging**: it bundles everything into a .skill file with a one-click "copy to your skills" install in Claude Desktop.

The output is always 3 files: **skill.md** (core instructions with the trigger description and phrases), an **editing.md** reference for revising existing copy in the voice, including a built-in "AI tells" pass, and an **examples.md** reference.

Then the payoff: I re-ran the exact same original prompt with the Dr. Squatch skill turned on. Dramatically more on-brand, more specific, actually funny.

## What came up in Q&A

A few teaching points worth keeping. The skill is designed for **Claude Opus** specifically, because Opus and Sonnet respond to instructions differently. I've found that over-listing "don't do X" examples can backfire on Opus (it starts including the very thing you told it to avoid), while Sonnet may need repetition to comply. Know your model's tendencies.

Also: skills built in Claude Desktop flow automatically into Cowork and the Claude web and mobile apps, but **not** into Claude Code. For Code you download the .skill file and place the unzipped files into a `.claude/skills/` folder at the project or user level.

If Claude isn't auto-triggering your skill, fix the description and trigger phrases first, or just invoke it manually with a backslash command. And if you juggle multiple brands or clients, use a folder per client.

## Who this is for

This works for a personal writing voice, a brand voice, or modeling a voice you admire and remixing it into your own. We closed with an open call for future lab topics, which is where the next sessions came from.
