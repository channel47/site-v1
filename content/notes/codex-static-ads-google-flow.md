---
title: Making the whole ad in Codex
slug: codex-static-ads-google-flow
description: I tried making a complete ad in Codex, from the scene and product packaging to the headline and call to action.
date: 2026-07-24
updated: 2026-09-12
newsletter: I share creative experiments and the prompts, outputs, and corrections that mattered.
tags: [codex, google-flow, image-generation, static-ads, skills, creative-production, product-imagery, art-direction]
preview:
  src: /posts/codex-static-ads-native-pass.jpg
  alt: Two static ad concepts with the products, scenes, and typography generated together.
video:
  src: /posts/google-flow-reference-led-product-imagery.mp4
  poster: /posts/google-flow-tablet-grid-blue.jpg
  captions: /posts/google-flow-reference-led-product-imagery.vtt
  duration: PT4M17S
  uploadDate: "2026-07-14"
  caption: The original four-minute Flow walkthrough, including the outputs that worked and the packaging details that didn't.
---

I was using Codex to help write prompts for Google Flow. We'd work out what to ask for, then I'd copy the prompt over and work through the images there. Eventually I realized Codex had its own image generator. We could try making the ads in the same place we were discussing them.

That led to a second question: how much of an ad could the image generator make at once?

## What I liked about Flow

The Flow experiments started with two reference images and a question for its agent.

```text
How would you describe these from a lighting and composition point of view?
```

I wanted to use the same visual language for X-All's cleaning products. The agent described hard lighting, frozen motion, and a polished studio look, then asked what X-All sold. I uploaded real product photos, carried those lighting and composition details into the next prompt, and gave it room to experiment.

It went well beyond putting a product on a table. There were action scenes around the toilet-cleaning foam powder, a bubbly version of the X-All logo, tablets frozen against water, and a whole set of blue compositions.

![One of Flow's generated directions, a grid of white tablets under hard directional light.](/posts/google-flow-tablet-grid-blue.jpg)

I hadn't asked for those particular ideas. Some looked usable straight away, especially the microfiber cloth shot and the tablet dissolving inside a bottle. For finding a design direction, it was pretty dang good.

[Watch the original four-minute Flow walkthrough.](/posts/google-flow-reference-led-product-imagery.mp4)

Getting the actual product right was less reliable. Single-product shots tended to hold together, but labels drifted when several products appeared in one image. A package could look convincing at a glance and say the wrong thing up close. Colors changed, too.

Maybe one in ten of the static ads really looked the way I wanted. The good ones felt on brand and as polished as something from a high-end creative studio. The rest were often busy, full of artifacts, or built around generic products it had invented despite the references.

I kept trying because I liked the good images so much, but the back and forth got frustrating. Sometimes I'd ask for an edit and Flow would ignore it.

## Asking Codex to make all of it

When I tried making ads in Codex, it generated the scenes and added the headlines and calls to action separately. The ads below, for ELT's electrolyte drink mix, came from that first approach. The text was clean, and the ads probably would have been fine to use.

![The first Codex pass for ELT used generated scenes with composited headlines and Shop ELT CTA buttons.](/posts/codex-static-ads-composited-pass.jpg)

Codex seemed to be assuming the text would be better handled separately. I wanted to see what the image generator could manage, so I asked it to try the entire ad in one generation: scene, headline, call to action, product packaging, all of it.

The next pass felt more like a set of complete concepts. The typography belonged to the composition instead of looking added afterward.

![The second Codex pass generated the scenes, products, and typography together as complete native compositions.](/posts/codex-static-ads-native-pass.jpg)

Some outputs were stronger than others, and there were still visual artifacts. Even so, I found the process easier to work with. The interface was cleaner, the product references seemed to carry through more consistently, and corrections usually did what I'd asked.

The result still needs a close comparison with the actual product. Labels, shape, color, and claims all need checking. An ad can look finished before those details are right.

## Saving the instruction for next time

Almost immediately, I wanted to turn this into a skill: a set of instructions the agent could use again. I'd had to encourage it to try something it was capable of, and I didn't want to repeat that conversation every time.

I still use Flow, though much less. It can produce images I love. For working through a static ad, I now reach for Codex. Once I have a brief, we can try the whole thing there.

## Update: September 2026

I've put that instruction into [Make Static Ads](https://github.com/channel47/skills/tree/main/skills/creative-production/make-static-ads): try generating the complete ad first, including typography and packaging. The [customer-research walkthrough](/notes/customer-research-ad-angles-claude) covers working out what an ad should show before handing over the brief and product images.

I also liked Flow's workspace enough to start [building my own in Vellum](/projects/vellum). I'm using it to make product images for X-All, with the agent beside the image grid.
