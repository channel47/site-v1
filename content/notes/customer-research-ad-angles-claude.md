---
title: Turning customer research into ad angles with Claude
slug: customer-research-ad-angles-claude
description: A worked example of using Claude for customer research, keeping ad angles tied to real sources, and turning a promising idea into a creative brief.
date: 2026-09-09
tags: [claude, customer-research, creative-strategy, ad-angles, skills, static-ads, creative-production]
preview:
  src: /collection/research-lens.webp
  alt: A green optical-glass tile refracting a grid of dots through three lenses. Conceptual cover artwork.
---

In a discussion about compression packing cubes, one traveler explains how they separate their clothes, then adds this.

> I can select from one cube without disturbing anything else.

[The original comment on r/onebag](https://www.reddit.com/r/onebag/comments/1ufb2re/compression_standard_packing_cubes/) is about a particular packing setup. But that last sentence suggests something an ad could demonstrate. Take out the clothes you need and leave the rest of the bag packed.

That's more specific than asking Claude for ten ads about staying organized. It gives the ad a situation, an action, and a benefit you could actually show.

The [Creative Strategist skill](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist) puts research, personas, and ad angles into one working document. Each quote gets an ID and a source. Later stages have to refer back to those IDs, so you can check how Claude arrived at a recommendation.

This walkthrough uses three public discussions to develop two ad angles. The photography and ads are AI-generated concept studies made for the article.

![The overnight-stop idea starts with a specific action. Take out one cube and leave the rest of the bag packed.](/posts/customer-research-overnight-study.webp)

## Give Claude a question worth researching

For this example, the question is what people value about packing cubes after they start using them. Does the benefit change once they're traveling and repeatedly opening the bag?

For an actual product, Claude also needs the product page, price, current offer, known competitors, and any claims you can substantiate. Include customer interviews, support tickets, returns feedback, or reviews from your own research. Separate your assumptions from what customers have actually said.

A useful opening instruction would be something like this.

```text
Research why people buy packing cubes and what
they value or dislike after using them. Focus
on trips with several overnight stops.

Keep exact quotations and source links.
Separate observations from interpretation,
and include contradictory evidence.
Don't write ads yet.
```

The last part gives you a chance to inspect the research before a polished headline makes an idea feel more convincing than it is.

## Keep the details that change the ad

Call the opening quote **Q1**. It describes selective access to clothes. A second comment, **Q2**, adds a particular use case.

“Or if I'm going to an overnight stop, I put what I want for the next day in a small one, and that's all I have to take out of my bag for clothing, no digging around looking for the socks you want.”

[Q2 comes from a discussion about whether packing cubes are worth buying.](https://www.reddit.com/r/onebag/comments/1ntqa88/are_packing_cubes_worth_it/) The commenter is describing an inexpensive set, which will matter when we get to the offer.

Then there's **Q3**, from a reply in a discussion about changing accommodation every day.

“Something that helped me was moving to fewer, larger cubes, with their own organisation. One cube for each task.”

[That thread is about making daily packing and unpacking less cumbersome.](https://www.reddit.com/r/onebag/comments/1e37pr6/packing_workflow_for_daily_change_of_accomodation/) It complicates the recommendation. Adding more compartments isn't automatically helpful. Someone who wants a separate place for everything may need a different setup from someone who finds all that sorting tedious.

Those details should survive Claude's summary. If all three become “customers want convenience,” you've lost the distinction that could make the creative useful.

In the research file, give each excerpt an ID, its source URL, and enough context to explain what the person was responding to. Keep Claude's interpretation beside the original wording so you can compare them.

For a full research pass, look beyond these discussions. Product reviews reveal failures after purchase. Support questions show uncertainty before purchase. Interviews help explain why someone chose one option over another. Ask Claude to report which sources it could access and where it needs more material.

## Group people by the decision they're making

The useful distinction here is between packing habits.

Q1 and Q2 suggest a traveler who wants to retrieve a particular set of clothes while leaving everything else alone. Q3 suggests someone who wants fewer separate things to handle. That gives you two different demonstrations to explore.

The packing habit helps choose the ad. An invented age, income, or personality profile wouldn't add much.

![Q1 and Q2 suggest retrieving one outfit. Q3 suggests handling fewer cubes. Each calls for a different demonstration.](/posts/customer-research-two-angles.webp)

Ask Claude to explain what each group would need to see before believing the benefit. For the first group, that might be a demonstration of removing one night's clothes without unpacking the rest. For the second, it might be a complete packing routine using fewer containers.

If two proposed personas would respond to the same demonstration, objection handling, and offer, there may be no useful reason to keep them separate.

## Turn the observation into an angle

An angle is the reason someone might care about the product. A hook is one way to introduce that reason.

For the first group, the proposed angle is **pack for each stop so you can leave the rest of the bag alone**. It follows from Q1 and Q2. Several hooks could express it.

- “One night here. Everything else stays packed.”
- “Tomorrow's clothes, in one cube.”
- “Take out what you need for this stop.”

Those are three hooks for one angle. You can vary the words while still testing the same reason to buy.

![Concept A uses the overnight-stop situation. The orange cube makes the action visible while the rest of the bag stays packed.](/posts/customer-research-ad-overnight.webp)

A second angle, suggested by Q3, would be **make the packing routine simpler with fewer containers**. “One cube for the clothes” gives it a different emphasis. Show the clothing together in a single large compartment, with fewer separate pieces to handle.

![Concept B emphasizes keeping the clothing together in one large cube. The composition changes because the reason to buy changes.](/posts/customer-research-ad-fewer-cubes.webp)

Now Claude has two directions to investigate. Its next research pass should look for more accounts of these behaviors, the objections to each setup, and how competing brands already talk about them.

## Decide what the camera needs to show

The first angle already suggests a simple creative treatment. An open bag holds several cubes. A hand removes the small one containing clothes for the overnight stop. The other contents stay where they are.

![The shot plan for Concept A keeps the bag and its remaining contents in the same positions. Only the overnight cube moves.](/posts/customer-research-packing-storyboard-v2.svg)

The brief can now be specific.

- **Situation.** Arriving for a single overnight stop during a longer trip.
- **Message.** Keep that stop's clothes together so you can retrieve them separately.
- **Visual proof.** Show the same bag before and after removing the cube, with the remaining contents visible.
- **Product check.** Confirm the actual cube fits the advertised clothing load and the bag used in the demonstration.
- **Research.** Keep Q1 and Q2 attached so the person making the ad can see where the idea came from.

The movement matters here. A before-and-after pair could make it clearer in a static ad. When producing the final demonstration, use the actual product and check the clothing load, bag fit, and ease of removal.

## Check the reasons this idea might fail

Before developing the creative further, ask Claude to make the strongest case against it.

The first issue is differentiation. An ordinary pouch might solve the same problem. Q2's inexpensive cubes are a reminder to check what the advertised product adds. Look at competing product pages and the ads you can actually access. Record the examples and the date you checked them. If those ads already use the same demonstration, describe the idea as a familiar category benefit. You can still test it, but you haven't found an unused angle.

The second issue is the offer. An ad about reducing the number of things to handle could be a poor fit for a large bundle of small cubes. Claude should flag that mismatch before writing copy for the bundle.

The third issue is the promise. Nothing in this example supports “double your luggage space,” “unpack in ten seconds,” or “never rummage through your bag again.” Each adds a claim the research hasn't established. Ask for the evidence required to use it, or remove it.

A useful review instruction is this.

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

Check the research, then the buying behaviors, then the angles. Working in one file lets you follow a recommendation back to the original material.

For the angle stage, ask for different reasons to buy, along with the hook, demonstration, supporting evidence, and likely objection for each. Keep headline variations under their parent angle. Add your competitor examples before asking Claude to assess differentiation.

## Take one brief into production

For the packing-cube example, the next production task is the overnight-stop demonstration. The brief specifies what stays in the bag, what comes out, and why that action matters.

Decide what result would justify continuing before launching. If the campaign's job is purchases, clicks alone won't establish success. Keep the offer and destination consistent where possible, and record which angle and treatment each ad uses. A result from one execution also doesn't settle whether every version of that angle would work.

For the image-making part, the [Google Flow and Codex walkthrough](/notes/codex-static-ads-google-flow) covers working with product references and generating complete static ads. Pass the approved brief into that process along with the actual product images. Keep Q1 and Q2 attached to the brief, too, so “leave the rest of the bag packed” is still the idea when you review the first output.
