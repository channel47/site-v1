---
title: Turning customer research into ad angles with Claude
slug: customer-research-ad-angles-claude
description: A traveler's comment about packing cubes suggests an ad. I work through the idea with Claude, from the original quote to two creative directions.
date: 2026-09-09
updated: 2026-09-10
newsletter: More worked examples of customer research and ad creative, with source quotes, prompts, and creative briefs.
tags: [claude, customer-research, creative-strategy, ad-angles, skills, static-ads, creative-production]
preview:
  src: /collection/research-loupe.webp
  alt: A photographic loupe resting on green enamel. Conceptual cover artwork.
---

In a discussion about compression packing cubes, one traveler explains how they separate their clothes, then adds this.

> I can select from one cube without disturbing anything else.

[The original comment on r/onebag](https://www.reddit.com/r/onebag/comments/1ufb2re/compression_standard_packing_cubes/) is about a particular packing setup. But that last sentence suggests something an ad could demonstrate. Take out the clothes you need and leave the rest of the bag packed.

That's the part of customer research I want to spend more time on. A person describes something ordinary about their trip, and suddenly there's an idea you can picture. Asking Claude for ten ads about staying organized would skip the detail that makes this one interesting.

For this walkthrough, I'm using three public discussions to develop two ad angles. The photography and ads are AI-generated concept studies made for the article. The [Creative Strategist skill](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist) keeps the research and creative work in one document, so I can follow an idea back to the comment that started it.

![The overnight-stop idea starts with a specific action. Take out one cube and leave the rest of the bag packed.](/posts/customer-research-overnight-study.webp)

## Start with the trip

Packing cubes make an obvious promise about organizing a bag. I'm more interested in what happens after that bag is packed. What do people value once they're traveling and opening it every day?

For a real brief, give Claude the product page, price, offer, and any customer research you already have. It needs to know what you sell as well as what people say about the category.

I'd start with this.

```text
Research why people buy packing cubes and what
they value or dislike after using them. Focus
on trips with several overnight stops.

Keep exact quotations and source links.
Separate observations from interpretation,
and include contradictory evidence.
Don't write ads yet.
```

“Don't write ads yet” matters. A good headline can make me want to keep an idea before I've checked whether the research supports it.

## The comments don't all point the same way

Call the opening quote **Q1**. The traveler wants to take out some clothes without disturbing the rest. A second comment, **Q2**, gives that action a setting.

“Or if I'm going to an overnight stop, I put what I want for the next day in a small one, and that's all I have to take out of my bag for clothing, no digging around looking for the socks you want.”

[Q2 comes from a discussion about whether packing cubes are worth buying.](https://www.reddit.com/r/onebag/comments/1ntqa88/are_packing_cubes_worth_it/) The commenter is describing an inexpensive set, which will matter when we get to the offer.

Then there's **Q3**, from a reply in a discussion about changing accommodation every day.

“Something that helped me was moving to fewer, larger cubes, with their own organisation. One cube for each task.”

[That thread is about making daily packing and unpacking less cumbersome.](https://www.reddit.com/r/onebag/comments/1e37pr6/packing_workflow_for_daily_change_of_accomodation/) This person wants fewer things to sort through. More compartments could make their packing routine worse.

If Claude summarizes all three as “customers want convenience,” the interesting part disappears. One person wants to grab a small cube for an overnight stop. Another wants fewer cubes to deal with in the first place.

The skill gives each excerpt an ID and source URL, with Claude's interpretation beside the original wording. That makes it easier to catch a summary that's become too broad. These three discussions are enough to explore an idea, but a full research pass would also need product reviews, customer feedback, and evidence that challenges it.

## Two different reasons to buy

Those packing habits suggest two groups to explore. Q1 and Q2 describe someone who wants to retrieve one set of clothes. Q3 describes someone who wants fewer separate things to handle. Inventing an age, income, or personality profile wouldn't help me decide what to show them.

![Q1 and Q2 suggest retrieving one outfit. Q3 suggests handling fewer cubes. Each calls for a different demonstration.](/posts/customer-research-two-angles.webp)

The angle is the reason someone might care. The hook is how the ad introduces it.

For the first group, the proposed angle is **pack for each stop so you can leave the rest of the bag alone**. It follows from Q1 and Q2. Several hooks could express it.

- “One night here. Everything else stays packed.”
- “Tomorrow's clothes, in one cube.”
- “Take out what you need for this stop.”

All three make the same offer to the traveler. Changing the headline doesn't make it a different reason to buy.

![Concept A uses the overnight-stop situation. The orange cube makes the action visible while the rest of the bag stays packed.](/posts/customer-research-ad-overnight.webp)

A second angle, suggested by Q3, would be **make the packing routine simpler with fewer containers**. “One cube for the clothes” gives it a different emphasis. Show the clothing together in a single large compartment, with fewer separate pieces to handle.

![Concept B emphasizes keeping the clothing together in one large cube. The composition changes because the reason to buy changes.](/posts/customer-research-ad-fewer-cubes.webp)

Now there are two ideas worth investigating further. Claude can look for more accounts of each habit and check how competing brands already talk about them.

## What would the ad actually show?

The first angle already suggests a simple creative treatment. An open bag holds several cubes. A hand removes the small one containing clothes for the overnight stop. The other contents stay where they are.

![The shot plan for Concept A keeps the bag and its remaining contents in the same positions. Only the overnight cube moves.](/posts/customer-research-packing-storyboard-v2.svg)

That gives us a brief with something concrete to make.

- **Situation.** Arriving for a single overnight stop during a longer trip.
- **Message.** Keep that stop's clothes together so you can retrieve them separately.
- **Visual proof.** Show the same bag before and after removing the cube, with the remaining contents visible.
- **Product check.** Confirm the actual cube fits the advertised clothing load and the bag used in the demonstration.
- **Research.** Keep Q1 and Q2 attached so the person making the ad can see where the idea came from.

A before-and-after pair could make the movement clearer in a static ad. The final demonstration needs the actual product, with the clothing load, bag fit, and ease of removal checked.

## An ordinary pouch might do the same thing

I like the overnight-stop idea, but an ordinary pouch might solve the same problem. Q2's inexpensive cubes are a reminder to ask what the advertised product adds. And if competing brands already use this demonstration, it's a familiar category benefit, not a newly discovered angle. It might still be worth testing.

The second direction has its own problem. An ad about handling fewer containers would be an odd way to sell a large bundle of small cubes. This is where Claude needs the actual offer, not just the research.

Neither direction earns a promise like “double your luggage space” or “unpack in ten seconds.” The comments haven't established that. Before taking the idea further, I'd ask Claude to challenge it.

```text
Review each angle against its source quotes,
contradictory evidence, product facts, and the
closest competing message you found.

Which hooks should we cut or change?
What do we need to research next?
```

## Run it in Claude with Creative Strategist

To use the public skill in Claude Code, run the installer from your project and select Claude Code when prompted.

```sh
npx skills add channel47/skills --skill creative-strategist
```

The [repository contains the skill and its stage instructions](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist). Give Claude your product context and the research prompt above. Ask it to use Creative Strategist, save the work in the product dossier, and pause after each stage for review. Your Claude setup will need web access for the sources you want it to read.

## Take one brief into production

For the packing-cube example, the next production task is the overnight-stop demonstration. The brief specifies what stays in the bag, what comes out, and why that action matters.

These are concepts to test, not evidence that either angle sells packing cubes. Before launching, decide what result would justify continuing and keep track of which angle each ad uses.

For the image-making part, the [Google Flow and Codex walkthrough](/notes/codex-static-ads-google-flow) covers working with product references and generating complete static ads. Pass the approved brief into that process along with the actual product images. Keep Q1 and Q2 attached to the brief, too, so “leave the rest of the bag packed” is still the idea when you review the first output.
