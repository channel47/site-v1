---
title: "I Read X's Algorithm So My Tweets Stopped Dying at 200 Impressions"
slug: twitter-algorithm-optimizer
description: "What X's open-sourced ranking system actually rewards — and the skill that scores and rewrites your drafts against it before you post."
type: story
category: skills
asset:
  name: twitter-algorithm-optimizer
  type: skill
  repo: https://github.com/channel47/skills/tree/main/skills/distribution/twitter-algorithm-optimizer
  install: npx skills add channel47/skills --skill twitter-algorithm-optimizer
author: Jackson Dean
date: 2026-07-02
tags: [x, twitter, distribution, algorithm, social]
---

The post I was proudest of last year died at a couple hundred impressions. A genuinely
useful breakdown of a campaign structure, weeks of real results behind it, link to the full
writeup. Meanwhile a throwaway observation I'd typed in ninety seconds did fifty times the
numbers. For years I treated this as weather — the feed giveth, the feed taketh away.

Then X open-sourced its recommendation algorithm, and in January 2026 open-sourced the new
Grok-based version. I did the unreasonable thing: I actually read it. And the weather turned
out to be physics. My proud post didn't die randomly. It died because I had made, by the
ranking system's math, several specific mistakes — the biggest one being the link.

The numbers that rearranged my head, straight from the engagement weights:

- A **like** is the baseline signal, worth roughly 0.5–1x.
- A **repost** is worth about **20x**.
- A **reply** is 13.5x — but a reply that *you reply back to* is worth about **75x**, and a
  real back-and-forth conversation compounds toward **150x**. One genuine reply chain
  outweighs hundreds of likes.
- An **external link in the post body** is a 30–50% reach penalty for Premium accounts and
  near-invisibility for free ones. My best content had been shipping with an anchor tied to
  its ankle.

There's more that changes behavior once you know it: a post loses half its remaining
potential every six hours, so the first thirty minutes decide most of its fate. The
Grok-based ranker runs sentiment analysis now — combative flamebait gets throttled even
when it's "working." Format matters mechanically: native video and images get boosted,
threads pull roughly 3x single-tweet engagement.

The `twitter-algorithm-optimizer` skill packages all of this into something you use at the
moment it matters — right before posting. Hand it a draft and it scores it against a
weighted rubric that mirrors the algorithm's actual priorities: reply potential at 5x,
repost potential at 4x, hook strength at 3x, bookmark potential, community fit, and
penalties for negative-signal risk and in-body links. Under 40, rethink the idea. Over 80,
ship it.

Then it rewrites — with a constraint I care about, written into the skill itself: the
rewrite has to sound like you. No growth-hacker voice, no engagement bait. "Like if you
agree" damages your credibility score over time; the skill treats it as an anti-pattern,
not a technique. The algorithm rewards genuine conversation, so your authentic voice *is*
the optimization.

Every change comes annotated with the signal it targets, and the output ends with a posting
plan: format recommendation, link handling (almost always: main post clean, link in the
first reply), and a first-30-minutes strategy — post when your audience is actually online,
self-reply with added context, and answer every reply while the velocity window is open,
because each author-reply is that 75x signal firing.

One honest caveat the skill makes itself: it stamps the date it was last verified against
the public source code, because X ships ranking changes without announcements. It tells you
to distrust its own specifics if that date gets stale. A reference that knows it can rot is
worth ten that pretend they can't.

My reposted-breakdown post, rewritten under these rules — hook first, link demoted to the
replies, question at the end, me actually present for the first half hour — became the
best-performing thing on my account. Same content. Different physics.

## Grab it

```
npx skills add channel47/skills --skill twitter-algorithm-optimizer
```

Use it on the next draft you actually care about. Score first, then rewrite — seeing *why*
a post is structurally weak teaches the instinct faster than any thread about threads.
