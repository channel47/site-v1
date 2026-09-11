---
title: "I wanted a better Google Flow"
slug: vellum
description: "The agent in Google Flow showed me what was possible, then kept missing the edits. I started building the workspace I wanted while making images for X-All."
date: 2026-09-10
updated: 2026-09-10
status: in-progress
tags: [vellum, google-flow, image-generation, agents, creative-workflow]
preview:
  src: /projects/vellum/opengraph-image
  alt: I wanted a better Google Flow, with the blue Vellum contact-sheet artwork.
---

The agent inside Google Flow helped me make a jump in the quality of my site assets. I could give it references, talk through a direction, and get images I was excited to use. But it was hit or miss, and most often it was miss. I'd ask it to fix an image and sometimes it would just ignore the edit.

I still liked a lot about Flow. The grid, the minimal interface, having the agent right there with the images. I could also turn the agent off and generate something directly.

I wanted a better Google Flow, and by this point building my own felt like something I could just go ahead and try. That's where Vellum started.

I'm building it while making assets for [X-All](https://x-all.com/), a Shopify site I just finished rebuilding at work. The work gives me something specific to build around, from keeping product references together to figuring out which images are still missing.

![Product images on the X-All board in Vellum. The composer sits over the grid.](/posts/vellum/x-all-grid.webp "screenshot")

## Asking it what to make next

In one session, I asked the agent, "Nice. What's next?"

It listed the products that still needed images and suggested a batch. I asked it to do one of the products with empty slots first, and get all three images for that product.

It picked Glass Wipes. The agent said the pack described wipes for eyeglasses and screens, so it made the three images around desks and screens. Most of the surrounding board was blue tile, sinks, and cleaning products. These needed a different setting.

![The Glass Wipes batch, with the conversation beside the image grid.](/posts/vellum/x-all-agent.webp "screenshot")

That's the kind of help I want from an embedded agent. I can ask what's next and work through the answer with the images right there.

The board also needs to keep track of what those images are for. I've added Subjects to hold a product's notes and reference images, and Placements to record what's needed for somewhere like a product gallery. I can assign images to that gallery and export them together. The agent can use the references and style guides while helping me fill it out.

In the same conversation, it also pointed out a garbage-disposal shot that still needed work. The pod was stuck in its blister and the drain collar looked industrial. Both still need fixing.

![The disposal image open for editing. The pod still has its clear casing.](/posts/vellum/x-all-disposal-viewer.webp "screenshot")

## I still want to generate directly

At one point during the build, Vellum lost direct generation. I'd built an alternative to Flow that no longer let me do one of the things I liked about Flow. Sometimes I just want to write a prompt and get an image.

So I brought it back. Generate is now the default, with a model choice, image attachments, and my own prompt. The agent is there when I want help. Switching modes keeps what I've already typed or attached.

## Letting other agents use the images

I'm still working through the X-All assets. Once those are finished, I'll probably add a way for external agents to query Vellum through an API. An agent working on the site could then find the images I've already made and the placements they're meant for directly in Vellum.
