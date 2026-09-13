---
title: Making the whole ad in Codex
slug: codex-static-ads-google-flow
description: I tried making a complete ad in Codex, from the scene and product packaging to the headline and call to action.
date: 2026-07-24
updated: 2026-09-13
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

I was asking Codex to help me write prompts for Google Flow. We'd work out the image I wanted, I'd copy the prompt into Flow, and then I'd work through the results there. Codex was the coding agent helping me think; Flow was where I made the images. Eventually I realized I could generate images inside Codex, too.

That made me curious about how much of the process I could keep in one place. I wanted to try a complete ad: the scene, the product packaging, the headline, and the call to action, all generated together.

I had good reasons to keep using Flow. For X-All, a cleaning brand I was working on, I'd found a way to get product imagery I was excited about. I started with two reference images whose lighting and composition I liked and asked Flow's agent a simple question:

```text
How would you describe these from a lighting and composition point of view?
```

It described hard lighting, frozen motion, and a polished studio look, then asked what X-All sold. I uploaded photographs of the actual products, asked it to carry that visual direction across, and gave it room to experiment.

The results went well beyond a product placed on a table. It made action scenes around the toilet-cleaning foam powder, a bubbly version of the X-All logo, and tablets suspended against water. There was a whole set of blue compositions I hadn't thought to ask for.

![A Flow-generated arrangement of white cleaning tablets against blue, with hard directional light and long shadows.](/posts/google-flow-tablet-grid-blue.jpg)

Some images looked usable straight away. I liked the microfiber cloth shot and a tablet dissolving inside a bottle. The best outputs had the finish I'd associate with a high-end creative studio. For finding a visual direction, it was pretty dang good.

In the original walkthrough, I go through those images and the details that still needed work.

[Watch the original four-minute Flow walkthrough.](/posts/google-flow-reference-led-product-imagery.mp4)

Packaging was the persistent problem. A single product often held together, but when several appeared in one image, the labels could drift. A package would look convincing until I looked closely at the words. Colors changed, too. The reference photos helped, but they didn't make the output dependable.

As I kept working on static ads, maybe one in ten looked the way I wanted. The good ones felt on brand and polished enough to keep me trying. Others were crowded, full of artifacts, or built around products Flow had invented despite the references. Sometimes I'd ask for a correction and it would ignore the change.

By the time I tried making ads in Codex, I wanted a process that was easier to revise as well as images I liked. My first attempts were for ELT, an electrolyte drink mix. Codex generated the scenes, then added the headlines and calls to action separately.

![The first Codex pass for ELT combines generated product scenes with separately added headlines and Shop ELT buttons.](/posts/codex-static-ads-composited-pass.jpg)

The text was clean. The ads probably would have been fine to use after checking the product details. But Codex seemed to have decided that typography was a separate job before we'd tried the alternative. I asked it to generate the whole ad in one pass, including the packaging and words.

The next results felt more like complete concepts. The headline's scale and placement were part of the composition. On one, large blue type occupied most of the sky above a padel court; on another, the type sat across a split blue-and-yellow scene. I could see what the generator was attempting with the entire image.

![The second pass generates the ELT scenes, packaging, and typography together. These are creative concepts; the visible product and advertising claims still need checking.](/posts/codex-static-ads-native-pass.jpg)

There were still artifacts, and some outputs were much stronger than others. What made me want to continue was the back and forth. The interface felt cleaner, the product references seemed to carry through more consistently, and corrections usually did what I'd asked. I could discuss an image and work on it in the same conversation.

Generating the whole composition didn't remove the need to inspect it. Labels, package shape, color, and claims still had to be compared with the actual product. The finished appearance could make those checks easier to overlook. The images showed what the generator could make; they couldn't tell me how the ads would perform.

Almost immediately, I wanted to save the instruction as a skill, a set of directions the agent could reuse. I'd had to encourage it to try something it could already do, and I didn't want to have that conversation at the start of every project. That became part of [Make Static Ads](https://github.com/channel47/skills/tree/main/skills/creative-production/make-static-ads): try generating the complete ad first, with the typography and packaging included.

The brief still comes before any of this. I work through that part in the [customer-research essay](/notes/customer-research-ad-angles-claude), following a packing habit from a customer's comment into an ad concept. Once I know what the image should demonstrate, I can bring that brief and the real product photos into Codex and begin.

I still use Flow, though much less. It can produce images I love, and I liked its workspace enough to start [building one of my own, called Vellum](/projects/vellum). For a static ad, I now tend to open Codex. I can ask for the whole idea, see what comes back, and keep working on the parts that aren't right yet.
