---
title: Finding an ad in a packing-cube comment
slug: customer-research-ad-angles-claude
description: I work through three comments about packing cubes with Claude, following two ad ideas from the source quotes to a creative brief.
date: 2026-09-09
updated: 2026-09-13
newsletter: More worked examples of customer research and ad creative, with source quotes, prompts, and creative briefs.
tags: [claude, customer-research, creative-strategy, ad-angles, skills, static-ads, creative-production]
preview:
  src: /collection/research-loupe.webp
  alt: A photographic loupe resting on green enamel. Conceptual cover artwork.
---

A traveler on Reddit's r/onebag forum is explaining how they pack their clothes. Socks and briefs go in one packing cube, tees and polos in another. These are small zippered containers that keep clothes together inside a bag. Near the end of the comment, there's a sentence I can picture as an ad:

> I can select from one cube without disturbing anything else.

[The commenter is describing their own packing setup.](https://www.reddit.com/r/onebag/comments/1ufb2re/compression_standard_packing_cubes/) I'm interested in the action: take out the clothes you need and leave everything else where it is. “Stay organized” could mean almost anything. This gives me something to show.

I want to see how far I can develop that detail with Claude, the AI assistant I use for this example. I'm working from three public discussions, using [Creative Strategist](https://github.com/channel47/skills/tree/main/skills/creative-strategy/creative-strategist), a set of instructions that keeps research, interpretations, and creative ideas together in one document. The photographs and ads below are AI-generated concept studies made for this article.

![A hand lifts an orange cube from an open bag while the other cubes remain packed, illustrating the overnight-stop idea.](/posts/customer-research-overnight-study.webp)

For a real brief, I'd begin with the product page, price, offer, and any customer research already available. Those facts determine which ideas the product can support. Here, the question I want Claude to investigate is what happens after someone finishes packing and starts traveling.

```text
Research why people buy packing cubes and what they value or dislike after using them. Focus on trips with several overnight stops.

Keep exact quotations and source links. Separate observations from interpretation, and include contradictory evidence. Don't write ads yet.
```

That last instruction helps me, too. Once I like a headline, it's tempting to keep it and look for reasons to use it. Leaving the copy until later gives me more room to notice something that doesn't fit.

I'll call the opening quote **Q1**. In [a second discussion, about whether packing cubes are worth buying](https://www.reddit.com/r/onebag/comments/1ntqa88/are_packing_cubes_worth_it/), **Q2** gives the action a setting:

> Or if I'm going to an overnight stop, I put what I want for the next day in a small one, and that's all I have to take out of my bag for clothing, no digging around looking for the socks you want.

Now there's an occasion for the ad: a single night somewhere during a longer trip. This person puts the next day's clothes together in advance. The cube is useful because it lets them open only the part of the bag they need. They also mention being happy with an inexpensive set, a detail I'd want to keep beside any idea about selling them a more expensive one.

The third comment complicates the picture. In [a discussion about changing accommodation every day](https://www.reddit.com/r/onebag/comments/1e37pr6/packing_workflow_for_daily_change_of_accomodation/), **Q3** describes a different preference:

> Something that helped me was moving to fewer, larger cubes, with their own organisation. One cube for each task.

For this traveler, more small compartments could mean more work. They keep their clothes in one large cube so they have fewer things to handle. Both routines could disappear into a research summary that says “customers value convenience,” even though they suggest different products and different ads.

This is why I want the original wording close to the interpretation. Creative Strategist assigns each quote an ID and keeps its source link, so I can follow an idea back to the comment that prompted it. Three discussions are enough for this worked example. Before spending money on either direction, I'd look for more accounts of these habits, including product reviews and people who tried them and gave up.

![Q1 and Q2 suggest retrieving one outfit. Q3 suggests handling fewer cubes. The two ideas call for different demonstrations.](/posts/customer-research-two-angles.webp)

The distinction also helps me separate an ad's angle from its hook. The angle is the reason someone might care; the hook is how I introduce it. “One night here. Everything else stays packed,” “Tomorrow's clothes, in one cube,” and “Take out what you need for this stop” all introduce the overnight-stop idea. Testing those lines would tell me something about the wording, but I'd still be testing the same reason to buy.

![Concept A shows a hand lifting an orange cube from a packed bag, with the headline “One night here. Everything else stays packed.”](/posts/customer-research-ad-overnight.webp)

“One cube for the clothes” asks for a different composition. I want the clothing together in one large compartment, with fewer separate pieces around it. Changing the reason to buy changes what the image needs to demonstrate.

![Concept B groups the clothing in one large cube under the headline “One cube for the clothes.”](/posts/customer-research-ad-fewer-cubes.webp)

At this point I'd ask Claude to challenge both ideas against the product and the market. An ordinary pouch might do the overnight job well enough. The inexpensive cubes in Q2 make that question hard to ignore. Competitors may already use the same demonstration, and an offer built around a large bundle of small cubes would be an awkward fit for the second angle.

```text
Review each angle against its source quotes, contradictory evidence, product facts, and the closest competing message you found.

Which hooks should we cut or change? What do we need to research next?
```

The comments support ideas about access and packing habits. They don't support claims about doubling luggage space or unpacking in ten seconds. Keeping that boundary clear makes the brief easier to write: I can describe the action we need to show without attaching a result we haven't established.

For the overnight stop, I'd specify an open bag containing several cubes, with the next day's clothes in the small one. A hand removes that cube. The bag and its remaining contents stay in the same positions, so someone looking at the ad can see what has changed.

![The shot plan for Concept A keeps the bag and its remaining contents in place while the overnight cube is removed.](/posts/customer-research-packing-storyboard-v2.svg)

A before-and-after pair could make this work as a static ad. I'd keep Q1 and Q2 attached to the brief and ask whoever makes it to use the actual product. We need to check that the clothes fit and the cube comes out as easily as the concept suggests.

The public skill can be installed from a project folder with the command below; select Claude Code when prompted. Give Claude the product context and research prompt, ask it to use Creative Strategist, and have it save the work in a product dossier with a review between stages. It needs web access to read the sources.

```sh
npx skills add channel47/skills --skill creative-strategist
```

The [Flow and Codex walkthrough](/notes/codex-static-ads-google-flow) follows the next part of the work: turning a brief and product references into images. For this example, I'd take the overnight-stop idea into that process first. It gives me a clear scene to build and a practical way to judge the first output. One cube comes out; the rest of the bag stays packed. Whether that sells packing cubes is still a question for a test.
