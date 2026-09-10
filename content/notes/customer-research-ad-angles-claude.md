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

Below is a small worked example using public packing-cube discussions. The comments are real. The angles and creative treatments are proposals developed for this article, with no campaign results attached. Three discussions are enough to explain the decisions, but they're only one source type and wouldn't satisfy the skill's full research requirements.

## Give Claude a question worth researching

For this example, the question is what people value about packing cubes after they start using them. Does the benefit change once they're traveling and repeatedly opening the bag?

For an actual product, Claude also needs the product page, price, current offer, known competitors, and any claims you can substantiate. Include customer interviews, support tickets, returns feedback, or reviews you already have permission to use. Separate your assumptions from what customers have actually said.

A useful opening instruction would be something like this.

> Research why people buy packing cubes and what they value or dislike after using them. Pay particular attention to trips with several overnight stops. Keep exact quotations and source links. Separate customer observations from your interpretation, and include evidence that contradicts the emerging idea. Don't write ads yet.

The last part gives you a chance to inspect the research before a polished headline makes an idea feel more convincing than it is.

## Keep the details that change the ad

Call the opening quote **Q1**. It describes selective access to clothes. A second comment, **Q2**, adds a particular use case.

> Or if I'm going to an overnight stop, I put what I want for the next day in a small one, and that's all I have to take out of my bag for clothing, no digging around looking for the socks you want.

[Q2 comes from a discussion about whether packing cubes are worth buying.](https://www.reddit.com/r/onebag/comments/1ntqa88/are_packing_cubes_worth_it/) The commenter is describing how they use an inexpensive set. Nothing here establishes that a premium cube would do this better.

Then there's **Q3**, from a reply in a discussion about changing accommodation every day.

> Something that helped me was moving to fewer, larger cubes, with their own organisation. One cube for each task.

[That thread is about making daily packing and unpacking less cumbersome.](https://www.reddit.com/r/onebag/comments/1e37pr6/packing_workflow_for_daily_change_of_accomodation/) It complicates the recommendation. Adding more compartments isn't automatically helpful. Someone who wants a separate place for everything may need a different setup from someone who finds all that sorting tedious.

Those details should survive Claude's summary. If all three become “customers want convenience,” you've lost the distinction that could make the creative useful.

In a working research file, keep the full source URL, the exact excerpt, its ID, and enough context to explain what the person was responding to. Keep your interpretation in a separate field. A sentence Claude writes to connect two observations must never quietly become another customer quote.

For a proper research pass, add other sources and look for disagreement. Product reviews can reveal failures after purchase. Support questions can reveal uncertainty before purchase. Interviews can help explain why someone chose one option over another. Note which sources Claude couldn't access, and don't let it fill those gaps with plausible reviews.

## Group people by the decision they're making

The useful distinction here is between packing habits.

Q1 and Q2 suggest a traveler who wants to retrieve a particular set of clothes while leaving everything else alone. Q3 suggests someone who wants fewer separate things to handle. Those are provisional groups, based on a very small sample. They give you different demonstrations to explore.

There isn't evidence here for an age, income, lifestyle, or personality profile. Adding those details would make the persona longer without helping choose an ad.

Ask Claude to explain what each group would need to see before believing the benefit. For the first group, that might be a demonstration of removing one night's clothes without unpacking the rest. For the second, it might be a complete packing routine using fewer containers.

If two proposed personas would respond to the same demonstration, objection handling, and offer, there may be no useful reason to keep them separate.

## Turn the observation into an angle

An angle is the reason someone might care about the product. A hook is one way to introduce that reason.

For the first group, the proposed angle is **pack for each stop so you can leave the rest of the bag alone**. It follows from Q1 and Q2. Several hooks could express it.

- “One night here. Everything else stays packed.”
- “Tomorrow's clothes, in one cube.”
- “Take out what you need for this stop.”

These are draft lines, not customer quotations. They're also three versions of one idea. Treating them as three separate angles would overstate how much variety you've developed.

A second angle, suggested by Q3, would be **make the packing routine simpler with fewer containers**. A draft hook might be “One cube for the clothes. One less thing to sort.” That idea needs a different demonstration and may suit a different product configuration.

Neither idea has earned a high-confidence recommendation yet. The first has two supporting excerpts. The second has one. The skill's angle rubric asks for a strong anchor quote, at least two supporting quotes, a fit with the intended buyer, and a competitor check. This example still needs more research, and dramatic wording wouldn't make its evidence stronger.

## Decide what the camera needs to show

The first angle already suggests a simple creative treatment. An open bag holds several cubes. A hand removes the small one containing clothes for the overnight stop. The other contents stay where they are.

![Proposed demonstration for the first angle. Remove the overnight cube and show that the remaining bag stays packed. This is a storyboard, not a product photograph or a tested ad.](/posts/customer-research-packing-storyboard.svg)

The brief can now be specific.

- **Situation.** Arriving for a single overnight stop during a longer trip.
- **Message.** Keep that stop's clothes together so you can retrieve them separately.
- **Visual proof.** Show the same bag before and after removing the cube, with the remaining contents visible.
- **Product check.** Confirm the actual cube fits the advertised clothing load and the bag used in the demonstration.
- **Evidence.** Q1 and Q2 support exploring this use case. They don't establish performance for the product being advertised.

An attractive image of perfectly arranged luggage wouldn't answer all of that. The movement matters. If you're making a static ad, a before-and-after pair can show it, provided both images accurately represent the product and packing arrangement.

The storyboard above only explains the shot. Any demonstration used as product evidence needs to be made with the actual product. Generated imagery can't establish its capacity or how easily it comes out of a packed bag.

## Check the reasons this idea might fail

Before developing the creative further, ask Claude to make the strongest case against it.

The first issue is differentiation. An ordinary pouch might solve the same problem. Q2's inexpensive cubes are a reminder to check what the advertised product adds. Look at competing product pages and the ads you can actually access. Record the examples and the date you checked them. If those ads already use the same demonstration, describe the idea as a familiar category benefit. You can still test it, but you haven't found an unused angle.

The second issue is the offer. An ad about reducing the number of things to handle could be a poor fit for a large bundle of small cubes. Claude should flag that mismatch before writing copy for the bundle.

The third issue is the promise. Nothing in this example supports “double your luggage space,” “unpack in ten seconds,” or “never rummage through your bag again.” Each adds a claim the research hasn't established. Ask for the evidence required to use it, or remove it.

A useful review instruction is this.

> For each angle, list the supporting quote IDs, contradictory evidence, product facts that need checking, and the closest competing message you found. Mark any assumption explicitly. Cut hooks that promise more than we can demonstrate. If the evidence is too thin, tell me what to research next.

This review may leave you with fewer ideas than you requested. That's a useful result if it prevents an unsupported idea from becoming a finished ad.

## Run it in Claude with Creative Strategist

To use the public skill in Claude Code, run the installer from your project and select Claude Code when prompted.

```sh
npx skills add channel47/skills --skill creative-strategist
```

The [repository contains the skill and its stage instructions](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist). Web research requires access to the relevant sources through your Claude setup. Installing the skill supplies instructions, not access to otherwise unavailable reviews or ad libraries.

Give Claude your product context, then start with research only.

> Use Creative Strategist to research this product and category. Save the work in the product dossier. Keep quotes verbatim with stable IDs and source links, report source coverage and gaps, and pause after research so I can review it.

Once you've checked the sources, ask it to group the evidence by buying behavior. Review those groups before moving into angles. The shared file makes it easier to see whether a later recommendation still follows from the original material.

For the angle stage, ask for different reasons to buy, along with the hook, demonstration, supporting evidence, and likely objection for each. Keep headline variations under their parent angle. Add your competitor examples before asking Claude to assess differentiation.

## Take one brief into production

The next step for the packing-cube example would be to fill the evidence gaps, verify the product, and produce the overnight-stop demonstration. You'd then have a specific idea to compare with the current creative.

Decide what result would justify continuing before launching. If the campaign's job is purchases, clicks alone won't establish success. Keep the offer and destination consistent where possible, and record which angle and treatment each ad uses. A result from one execution also doesn't settle whether every version of that angle would work.

For the image-making part, the [Google Flow and Codex walkthrough](/notes/codex-static-ads-google-flow) covers working with product references and generating complete static ads. Pass the approved brief into that process along with the actual product images. Keep Q1 and Q2 attached to the brief, too, so “leave the rest of the bag packed” is still the idea when you review the first output.
