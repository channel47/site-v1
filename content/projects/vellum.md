---
title: "I wanted a better Google Flow"
slug: vellum
description: "I'm building Vellum while making product images for the Shopify site I just rebuilt."
date: 2026-09-10
status: in-progress
tags: [vellum, google-flow, image-generation, agents, creative-workflow]
preview:
  src: /projects/vellum/opengraph-image
  alt: I wanted a better Google Flow, with the blue Vellum contact-sheet artwork.
---

When I started using the agent inside Google Flow, it helped me make a real jump in the quality of my site assets. But it was hit or miss, and most often it was miss. I'd ask it to fix an image and sometimes it would just ignore the edit.

I still liked a lot about Flow. The grid, the minimal interface, having the agent right there with the images. I could bring in references and give it guidance, or turn the agent off and generate something directly.

So I started building Vellum around the parts I wanted to keep. I'm using it to make assets for [X-All](https://x-all.com/), a Shopify site I just finished rebuilding at work.

![Product images on the X-All board in Vellum. The composer sits over the grid.](/posts/vellum/x-all-grid.webp "screenshot")

## Working on X-All

In one session, I asked the agent, "Nice. What's next?"

It listed the products that still needed images and suggested a batch. I asked it to do one of the products with empty slots first, and get all three images for that product.

It picked Glass Wipes. The agent said the pack described wipes for eyeglasses and screens, so it made the three images around desks and screens. Most of the surrounding board was blue tile, sinks, and cleaning products. These needed a different setting.

![The Glass Wipes batch, with the conversation beside the image grid.](/posts/vellum/x-all-agent.webp "screenshot")

That's the kind of help I want from an embedded agent. It can look at what's already there and help me work out what to make next.

I've also added Subjects and Placements to organize the work. Subjects keep a product's notes and reference images together. Placements record the images needed for a particular use, so I can assign frames to a product gallery and export that set. References and style guides are available to the agent as it works.

There are still images to fix. In that same conversation, the agent flagged a garbage-disposal shot where the pod was stuck in its blister and the drain collar looked industrial. Both problems are still visible in the image.

![The disposal image open for editing. The pod still has its clear casing.](/posts/vellum/x-all-disposal-viewer.webp "screenshot")

## I still want to generate directly

At one point during the build, Vellum lost direct generation. That made it less useful to me than Flow. I couldn't just write a prompt and get an image.

I brought it back, and Generate is now the default. I can choose a model, attach images, and submit the prompt myself. When I want help from the agent, I can switch modes without losing what I've already typed or attached.

## Letting other agents use the images

I'm still working through the X-All assets. Once those are finished, I'll probably add a way for external agents to query Vellum through an API. An agent working on the site could then find the images I've already made and the placements they're meant for directly in Vellum.
