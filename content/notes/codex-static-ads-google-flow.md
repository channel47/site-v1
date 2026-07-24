---
title: I was using Codex to write prompts for Google Flow
slug: codex-static-ads-google-flow
description: I was using Codex to write prompts for Google Flow, then realized Codex could generate the complete static ads itself.
date: 2026-07-24
tags: [codex, google-flow, image-generation, static-ads, skills, creative-production]
---

I had been using [Google Flow](/notes/google-flow-reference-led-product-imagery) to make static ads through the agent inside it. It worked, but it was super unreliable.

Maybe one out of ten times it would really nail it. The image would feel incredibly on brand and look like something a high-end creative studio had made. The other nine were more or less total AI slop. They were too busy, had weird artifacts, or used generic versions of products that Flow had made up instead of actually using the references I gave it.

So there was a lot of back and forth. I'd ask Flow to fix something and sometimes it would literally just ignore the edit.

At the same time, I was already using Codex to help me write the prompts I was handing over to Flow. Eventually I realized Codex had its own image generator and was like, wait, can we just make these in here together?

The first versions weren't actually bad. Codex generated the scenes and then added the headlines and CTAs separately. The text was clean and readable, and if I'd just wanted a usable ad, they probably would've been fine.

![The first pass used generated scenes with composited headlines and Shop ELT CTA buttons.](/posts/codex-static-ads-composited-pass.jpg)

But I could tell it had chosen the safer route. It was using the image generator for the part it trusted, then handling the details separately because those were more likely to go wrong.

My reaction was basically that it was underestimating what the image generator could do. I wanted it to push the bounds a little and try making the entire ad natively, instead of treating things like text, CTA labels, and product packaging as elements it had to add later.

Once it did that, the results felt more like complete concepts than generated scenes with ad elements added afterward.

![The second pass generated the scenes, products, and typography together as complete native compositions.](/posts/codex-static-ads-native-pass.jpg)

They still weren't perfect. There were some visual artifacts, and certain outputs were clearly stronger than others. But the process felt a lot easier to work with than Flow. The UI was cleaner, the product references seemed to carry through more consistently, and when I asked it to correct something, it usually did.

I still use Flow, just far less than I did. It can still produce something incredible, so I haven't written it off. Codex has just become a much easier place to work through the idea.

Almost immediately after I figured out Codex could do this, I was like, "This is definitely a skill."

It wasn't really the sequence of steps I wanted to save. It was the judgment I'd had to give the agent. Don't assume the text, CTA, and product packaging need to be handled separately. Push the image generator further and try making the complete ad first.

I didn't want to have to teach it that again every time.

I think that's probably the more interesting part of the skill for me. The steps are useful, but the judgment is the part I don't want to teach again.

### Ships with this build

- [Make Static Ads](/skills/make-static-ads), the public skill that keeps the more ambitious native-generation default in the workflow.
