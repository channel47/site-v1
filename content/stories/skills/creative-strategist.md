---
title: "The Best Ad I Ever Wrote Was Written by a Stranger in a Review"
slug: creative-strategist
description: "How I stopped brainstorming ad angles and started mining them — the voice-of-customer pipeline behind the creative-strategist skill."
type: story
category: skills
asset:
  name: creative-strategist
  type: skill
  repo: https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist
  install: npx skills add channel47/skills --skill creative-strategist
author: Jackson Dean
date: 2026-07-02
tags: [creative-strategy, voice-of-customer, personas, ad-angles, advertorial, dtc]
---

Early in my career I thought creative strategy meant a whiteboard. Me, a marker, maybe a
copywriter if the client was paying for one, and an hour of "what if we led with the
ingredient story?" We'd pick our three favorite angles, brief them out, and wait two weeks
to learn the market didn't care about any of them.

The account that broke me of this was a skincare brand. Solid product, decent landing page,
and eleven straight creative tests that died under a 1% CTR. On test twelve, out of ideas,
I did the thing I should have done first: I stopped writing and started reading. Two hundred
reviews of our product and every competitor I could find. Reddit threads. The one-star
reviews especially — that's where people stop being polite.

Buried in a competitor's reviews was a woman describing her bathroom cabinet: "a graveyard
of half-used jars that all worked for about two weeks." I never could have written that
line. Nobody in a conference room writes that line. We built the next ad around the
graveyard — not the ingredient, not the routine, the *drawer full of things that almost
worked* — and it outperformed everything we'd tested that year.

That became my process: research first, write last. The problem is the process is brutal to
do properly. Pulling quotes from six sources, tagging them, keeping track of which persona
came from which quotes, which angle came from which persona — by week three it's a soup of
screenshots and a doc nobody can navigate. So the corners get cut, and cut corners in
research means made-up personas, and made-up personas mean you're back at the whiteboard
with extra steps.

The `creative-strategist` skill is that process, systematized so the corners can't get cut.
It runs in four stages — research → personas → angles → advertorial — either as one pipeline
or one stage at a time, and everything accumulates in a single dossier file per product.

The part I'm most stubborn about is what the skill calls the **traceability law**. Every
quote gets pulled verbatim, tagged with an intensity rating and a buyer-journey stage, and
assigned a stable ID:

```
Q12 [🔥2 | solution-aware] "exact words from the customer" — source URL
```

Then every downstream claim — every persona trait, every angle, every headline — has to
cite the quote IDs it stands on. If a persona says "she's skeptical of testimonials," the
dossier shows you the three quotes that skepticism came from. If there's no quote, the
output gets labeled speculative, out loud. The skill is explicitly forbidden from
fabricating reviews or stats, which matters more than you'd think when you're handing
research to an AI.

The intensity ratings earn their keep too. A 🔥1 is a calm fact, a 🔥3 is a visceral story —
the raw material hooks are made of. And the skill self-audits: if more than about 30% of
quotes are landing at 🔥3, it recalibrates, because real 🔥3 is rare and inflation there
poisons everything downstream.

From the research it builds personas — including **anti-personas**, the people your ads
attract who will never buy and whose hostile comments quietly raise your CAC. Then ranked
angles with hooks, each anchored to quote IDs, each with a documented failure mode. Then a
build-ready advertorial with a proof ledger: every claim on the page marked proven,
needs-source, or remove. "Recommended by trainers" with no evidence in the research doesn't
survive to publication.

The whole run lands in `creative/[product-slug]-dossier.md`. Re-run research next quarter
and new quotes get fresh IDs — nothing gets renumbered, and downstream sections get flagged
stale until they're rebuilt. It's the boring bookkeeping I was never disciplined enough to
do by hand, and it's exactly the bookkeeping that makes the creative trustworthy.

I ran twelve tests to find the graveyard line. The dossier finds those lines on purpose.

## Grab it

```
npx skills add channel47/skills --skill creative-strategist
```

Works in Claude Code, Cursor, Cline, Windsurf, Codex CLI — anything that reads `SKILL.md`
files. There's a [sample dossier](https://github.com/channel47/skills/blob/main/examples/hushhound-dossier.md)
in the repo (fictional product, real format) if you want to see the quality bar before you
point it at your own product.
