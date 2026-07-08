---
title: "AI Skills: Teach AI How You Work (So You Stop Repeating Yourself)"
slug: ai-skills-teach-ai-how-you-work
description: "The flagship intro session inside Vibe Marketers. What skills are, how they fit alongside slash commands, subagents, and MCP, and two live builds, including a brand email generator made from scratch with no code."
status: past
date: 2026-02-13
duration: "90 min"
author: Jackson Dean
tags: [skills, ai-101, claude-desktop, mcp, subagents]
---

This was the big one, the session Ann Marie and I ran for the whole Vibe Marketers community. Around 200 people showed up, and most of them had never touched an AI skill before. That was the point. The premise of the whole session fits in one sentence: AI is powerful, but it forgets your process every time you start a new chat. Skills are how you stop re-explaining yourself.

The anchor line I kept coming back to: **"Skills are how you package your process so AI can work with you, not instead of you."**

## What we covered

I opened with the mental model I use for everything in this space, the **4 Lego bricks**: skills (reusable playbooks that load automatically when they're relevant), slash commands (manual shortcuts, increasingly just implemented as skills), subagents (specialist helpers you delegate to, with their own context), and MCP servers (secure connectors to outside tools). The line that seemed to land: MCP is the outlet, skills are the appliance instructions.

Then a tour of where skills actually live today: Claude Desktop (the no-code front door, and where we spent most of the session), Claude Code, OpenAI Codex with its official catalog, Cline, and OpenCode. Same idea everywhere, and the formats are converging enough that skills are becoming portable across tools.

We also spent a few minutes on always-on agents (the OpenClaw and Clawdbot stuff making the rounds) and the safety posture I actually recommend: treat installing a skill like installing software. Read it first, watch for hidden scripts and broad permissions, and start with skills and guardrails before you hand anything an always-on loop.

## What we built live

Two demos. First, a **Google Search campaign builder** skill: feed it a landing page URL or product description and it walks through offer extraction, keyword themes, campaign structure, and drafts of ad groups and ads. I was explicit about the framing: this is a first-draft builder, not an autonomous ad buyer.

Second, and this was the heart of the session, we built a real **brand-specific email generator** from scratch in Claude Desktop's built-in skill creator. No code. We wrote a clear trigger description, defined the inputs (topic, audience, goal), added brand voice guardrails, specified the output format (subject, preview, body, CTA), and tested it live.

We closed by reverse-engineering public skills: open a repo, read the name and description to understand when it fires, skim the steps, find the inputs and outputs, then keep the structure and swap in your own domain. The example we walked through was remixing a generic image-generation skill into an ad-creative generator for a specific business.

## What people walked away with

Everyone got the free **Skill Starter Kit**: the Vibe Skill Builder, a Brand Voice Extractor, and a Quality Check output gate, with Claude Desktop install steps and test prompts for each. Plus links to the official Agent Skills reference, OpenAI's skills repo, and the Claude docs.

We also announced what came next: a monthly **Skill Remix Lab** inside the community, and a growing **Skill Vault** of tested skills. This session turned out to be the start of the whole series.
