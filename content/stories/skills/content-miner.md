---
title: "I Shipped All Week and Posted Nothing: Fixing the Builder's Content Problem"
slug: content-miner
description: "The content-miner skill digs through your week — notes, commits, conversations — and surfaces the posts that were already there."
type: story
category: skills
asset:
  name: content-miner
  type: skill
  repo: https://github.com/channel47/skills/tree/main/skills/distribution/content-miner
  install: npx skills add channel47/skills --skill content-miner
author: Jackson Dean
date: 2026-07-02
tags: [content, distribution, build-in-public, newsletter, x, linkedin]
---

Here's a pattern I lived for a couple of years. Monday through Friday: real work.
Debugging a feed issue at midnight, rebuilding a landing page test, arguing with an ads API,
learning something the hard way roughly every other day. Saturday: open X, stare at the
compose box, and type something generic about consistency. Post it. Twelve likes. Close X.

The absurd part is that the week was *full* of content. The feed issue alone had a better
story arc than anything I ever composed cold — a mystery, a wrong theory, a fix, a number
at the end. But by Saturday it had faded into "fixed a thing," and cold composition
produces cold content. Every builder I know has this problem: the people doing the most
interesting work post the least interesting things about it, because creation and
documentation use different muscles and nobody has both fresh at once.

The `content-miner` skill attacks this the way its name suggests. Not a content calendar,
not an idea generator — a mining operation over what actually happened. Its premise, which
I now believe completely: **the best content already exists.** It's buried in your notes,
your git log, your closed issues, your chat history from the past week. It doesn't need to
be invented. It needs to be surfaced.

A run works in four phases. First it gathers — the last 7 to 14 days from every source
that's actually connected: work artifacts (commits, merged PRs, shipped changes), notes and
journals, conversation history, completed tasks. It reads days chronologically, because
morning confusion resolving into evening clarity is itself a story shape.

Then it filters, and this is the part that changed how I think about posting. Every
candidate nugget runs through five signal tests:

1. **Provenance** — did this come from *doing* something, or reading about something?
   First-hand only.
2. **Specificity** — is there at least one concrete detail someone can use? A tool, a
   number, a failure mode.
3. **Replaceability** — could any other account in this space have written it? If yes,
   sharpen or kill.
4. **Tension** — is there a gap between what people assume and what actually happened?
5. **So what** — why does this matter to someone who isn't me? Specific answer required.

That replaceability test alone would have killed my entire Saturday-generic-post era, which
is precisely why it's there.

Survivors get classified — build log, tool report, contrarian take, process note, shipping
update, receipts — and matched to their natural channel rather than blasted everywhere. A
debugging saga becomes a newsletter section or an X thread. A sharp observation becomes a
single post. The skill drafts in *my* voice, too: it loads whatever brand-voice guide
exists in the workspace before writing a word, and refuses to draft without one.

What lands on my desk is a brief, not a wall of drafts: two or three top picks with drafts
attached, secondary ideas with angles, and — my favorite part — a **parking lot** for ideas
that are interesting but not ready. Missing a number, waiting on a result. Half-baked ideas
ripen; the parking lot remembers them so I don't have to.

There's also a fast mode for the days urgency wins: "just post something" pulls the last
three days, finds the single most concrete thing that happened, and hands back one X draft
and one LinkedIn draft. No brief, no ceremony. A good-enough post today beats a perfect
post never.

The midnight feed bug from that week? Mined, drafted as a thread, posted Tuesday instead of
summarized badly on Saturday. It did better than anything I'd written in months — because
it wasn't written, it was excavated.

## Grab it

```
npx skills add channel47/skills --skill content-miner
```

Point it at whatever holds your week — notes, git, chat history — and configure defaults in
`.claude/content-miner.local.md` so it knows your sources without asking every time.
