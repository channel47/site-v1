---
title: From Google Flow to making whole ads in Codex
slug: codex-static-ads-google-flow
description: I started with product references in Google Flow, then moved into Codex to generate complete static ads with the products and typography together.
date: 2026-07-24
updated: 2026-09-10
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

I attached two reference images to Google Flow and asked it to describe them.

> How would you describe these from a lighting and composition point of view?

In the same prompt, I told it I wanted that visual language for X-All. The agent came back with hard lighting, frozen motion, and a polished studio-still look, then asked what X-All sold. I uploaded real product photos and said, more or less, go wild.

## Starting with references

The style references set the visual direction. The product photos gave Flow the actual products to work with. I used the lighting and composition details from that first answer in the next prompt, keeping the direction in the conversation as we went.

The first useful surprise was how far the agent moved beyond a literal product-on-a-table shot. It built action scenes around the toilet-cleaning foam powder, tried a bubbly version of the X-All logo, froze tablets against water, and turned a stack of cleaning products into a whole blue visual system.

![One of Flow's generated directions, a grid of white tablets under hard directional light.](/posts/google-flow-tablet-grid-blue.jpg)

I hadn't asked for the bubbly logo or any of those exact compositions. Some images looked usable out of the box. The microfiber cloth shot looked sharp. The tablet dissolving inside the bottle did, too.

For getting an actual design direction in place, it was pretty dang good.

[Watch the original four-minute Flow walkthrough.](/posts/google-flow-reference-led-product-imagery.mp4)

## Getting it to use the actual product

The single-product shots held together better than the more complicated compositions. Once several products appeared in the same image, labels started drifting. A package could look right from across the room while saying the wrong thing up close. Some colors moved, too.

I couldn't use those outputs as finished product images without correcting them. They still gave me lighting and composition ideas I wanted to try.

As I kept using Flow to make static ads, the inconsistency got frustrating. Maybe one out of ten times it would really nail it. The image would feel incredibly on brand and look like something a high-end creative studio had made. The other nine were more or less total AI slop. They were too busy, had weird artifacts, or used generic versions of products that Flow had made up instead of actually using the references I gave it.

So there was a lot of back and forth. I'd ask Flow to fix something and sometimes it would literally just ignore the edit.

## I was already using Codex for the prompts

At the same time, I was using Codex to help me write the prompts I was handing over to Flow. Eventually I realized Codex had its own image generator and was like, wait, can we just make these in here together?

The first versions weren't actually bad. Codex generated the scenes and then added the headlines and CTAs separately. The text was clean and readable, and if I'd just wanted a usable ad, they probably would've been fine.

![The first Codex pass for ELT used generated scenes with composited headlines and Shop ELT CTA buttons.](/posts/codex-static-ads-composited-pass.jpg)

But I could tell it had chosen the safer route. It was using the image generator for the part it trusted, then handling the details separately because those were more likely to go wrong.

My reaction was basically that it was underestimating what the image generator could do. I wanted it to push the bounds a little and try making the entire ad natively, instead of treating things like text, CTA labels, and product packaging as elements it had to add later.

Once it did that, the results felt more like complete concepts than generated scenes with ad elements added afterward.

![The second Codex pass generated the scenes, products, and typography together as complete native compositions.](/posts/codex-static-ads-native-pass.jpg)

They still weren't perfect. There were some visual artifacts, and certain outputs were clearly stronger than others. But the process felt a lot easier to work with than Flow. The UI was cleaner, the product references seemed to carry through more consistently, and when I asked it to correct something, it usually did.

Before using an output, check the packaging text, product shape, color, and any claims in the ad against the actual product. A convincing composition can still get those details wrong.

I still use Flow, just far less than I did. It can still produce something incredible, so I haven't written it off. Codex has just become a much easier place to work through the idea.

## The part I wanted to save

Almost immediately after I figured out Codex could do this, I was like, "This is definitely a skill."

It wasn't really the sequence of steps I wanted to save. It was the judgment I'd had to give the agent. Don't assume the text, CTA, and product packaging need to be handled separately. Push the image generator further and try making the complete ad first.

That's what I put into [Make Static Ads](https://github.com/channel47/skills/tree/main/skills/creative-production/make-static-ads), the public skill that asks the image model to generate the complete ad, including typography and product packaging.

For the step before image generation, the [customer-research walkthrough](/notes/customer-research-ad-angles-claude) follows a source quote into a reason to buy and a demonstration the ad needs to show.

I think that's probably the more interesting part of the skill for me. The steps are useful, but the judgment is the part I don't want to teach again.
