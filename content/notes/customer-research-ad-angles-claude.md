---
title: Finding an ad in a packing-cube comment
slug: customer-research-ad-angles-claude
description: I work through three comments about packing cubes with Claude, following two ad ideas from the source quotes to a creative brief.
date: 2026-09-09
updated: 2026-09-11
newsletter: More worked examples of customer research and ad creative, with source quotes, prompts, and creative briefs.
tags: [claude, customer-research, creative-strategy, ad-angles, skills, static-ads, creative-production]
preview:
  src: /collection/research-loupe.webp
  alt: A photographic loupe resting on green enamel. Conceptual cover artwork.
---

A traveler on Reddit's r/onebag forum is explaining how they pack their clothes. Socks and briefs go in one cube, tees and polos in another. Near the end of the comment, there's a sentence I can picture as an ad.

> I can select from one cube without disturbing anything else.

[The comment is about their own packing setup.](https://www.reddit.com/r/onebag/comments/1ufb2re/compression_standard_packing_cubes/) But it suggests a small, useful demonstration: take out the clothes you need and leave the rest of the bag packed.

That gives me something specific to investigate with Claude. I want to follow the detail about taking out one thing, and see what it could tell us beyond the broad promise of staying organized.

I'm using three public discussions to work through two ad angles here. The photography and ads are AI-generated concept studies for this article. The [Creative Strategist skill](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist), a set of instructions for Claude, keeps the research and creative work in one document so I can trace an idea back to its source.

![The overnight-stop idea starts with a specific action. Take out one cube and leave the rest of the bag packed.](/posts/customer-research-overnight-study.webp)

## Give Claude something to investigate

Packing cubes are zippered containers for organizing clothes inside a bag. The interesting question for this example is what happens after the packing is done. When someone opens their bag during a trip, what do they want to be easier?

For a real brief, I'd give Claude the product page, price, offer, and any customer research already available. Then I'd ask it to investigate a particular kind of trip.

```text
Research why people buy packing cubes and what
they value or dislike after using them. Focus
on trips with several overnight stops.

Keep exact quotations and source links.
Separate observations from interpretation,
and include contradictory evidence.
Don't write ads yet.
```

That last line helps me, too. Once I like a headline, it's tempting to keep the idea before checking whether the research supports it.

## One small cube, or fewer cubes?

I'll call the opening quote **Q1** so we can keep track of it. A second comment gives that action a setting.

In [a discussion about whether packing cubes are worth buying](https://www.reddit.com/r/onebag/comments/1ntqa88/are_packing_cubes_worth_it/), **Q2** says:

> Or if I'm going to an overnight stop, I put what I want for the next day in a small one, and that's all I have to take out of my bag for clothing, no digging around looking for the socks you want.

Now I can see the occasion for the ad: one night somewhere during a longer trip. The commenter uses an inexpensive set of cubes, which will matter when we consider what the ad is selling.

The third comment points in another direction. **Q3**, in [a discussion about changing accommodation every day](https://www.reddit.com/r/onebag/comments/1e37pr6/packing_workflow_for_daily_change_of_accomodation/), says: “Something that helped me was moving to fewer, larger cubes, with their own organisation. One cube for each task.”

This person wants fewer things to handle. Adding small compartments could make their routine more cumbersome. A summary like “customers want convenience” would hide that difference.

Creative Strategist gives each excerpt an ID and source URL, with the interpretation beside the original wording. I can check what Claude has inferred without hunting through the research again. These three discussions give us ideas to explore; a fuller investigation would also need product reviews, customer feedback, and accounts that challenge them.

## Two reasons to care

Q1 and Q2 suggest packing for each stop. Q3 suggests simplifying the routine with fewer containers. That difference gives me something to work with when deciding what each ad should show.

![Q1 and Q2 suggest retrieving one outfit. Q3 suggests handling fewer cubes. Each calls for a different demonstration.](/posts/customer-research-two-angles.webp)

An **angle** is the reason someone might care. A **hook** introduces that reason. For the overnight-stop angle, I could try any of these:

- “One night here. Everything else stays packed.”
- “Tomorrow's clothes, in one cube.”
- “Take out what you need for this stop.”

The wording changes, but each offers the traveler the same thing. I would treat them as variations of one idea when testing.

![Concept A uses the overnight-stop situation. The orange cube makes the action visible while the rest of the bag stays packed.](/posts/customer-research-ad-overnight.webp)

For the second angle, “One cube for the clothes” suggests a different image: clothing together in one large compartment, with fewer separate pieces to deal with. The composition changes because we're demonstrating a different packing habit.

![Concept B emphasizes keeping the clothing together in one large cube. The composition changes because the reason to buy changes.](/posts/customer-research-ad-fewer-cubes.webp)

I'd ask Claude to investigate both directions further: find more people describing each habit, check competing brands' messages, and compare each idea with the product we're selling.

An ordinary pouch might do the overnight job just as well. Q2's inexpensive cubes make that worth asking. If competitors already use this demonstration, it may be a familiar category benefit that is still worth testing. And an ad promising fewer containers would be a strange fit for a large bundle of small cubes.

Nothing in these comments supports “double your luggage space” or “unpack in ten seconds.” Before settling on an angle, I'd ask Claude to challenge it.

```text
Review each angle against its source quotes,
contradictory evidence, product facts, and the
closest competing message you found.

Which hooks should we cut or change?
What do we need to research next?
```

## Make the brief specific enough to build

For the overnight-stop idea, the scene is an open bag containing several cubes. A hand removes the small cube with clothes for the next day. Everything else stays where it is.

![The shot plan for Concept A keeps the bag and its remaining contents in the same positions. Only the overnight cube moves.](/posts/customer-research-packing-storyboard-v2.svg)

I'd give the person making the ad this brief:

- **Situation:** A single overnight stop during a longer trip.
- **Message:** Keep that stop's clothes together so you can retrieve them separately.
- **Demonstration:** Show the same bag before and after removing the small cube. Keep the remaining contents visible and in place.
- **Product check:** Use the actual cube and verify the clothing load, fit inside the bag, and ease of removal.
- **Source:** Keep Q1 and Q2 attached to the brief.

A before-and-after pair could show the movement in a static ad. We'd need to make it with the actual product to check that the cube fits the clothes and comes out of the packed bag as easily as the brief suggests.

## Try it in Claude

To install the public skill, run this from your project and select Claude Code when prompted.

```sh
npx skills add channel47/skills --skill creative-strategist
```

The [repository includes the skill and its stage instructions](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist). Give Claude your product context and the research prompt above. Ask it to use Creative Strategist, save the work in the product dossier, and pause after each stage for review. Your Claude setup needs web access to read the sources.

Once a brief is approved, the [Google Flow and Codex walkthrough](/notes/codex-static-ads-google-flow) covers the image-making work. Bring the brief, actual product images, and source quotes into that process. Before launching a test, decide what result would justify continuing and record which angle each ad uses. We still need to find out whether either idea sells packing cubes.

For this example, I'd start with the overnight-stop brief. When the first output comes back, there's something specific to look for: one cube comes out, and the rest of the bag stays packed.
