---
title: "I wanted a better Google Flow"
slug: vellum
description: "I'm building Vellum while making product images for X-All, working out where an agent helps and when I want to generate an image myself."
date: 2026-09-10
updated: 2026-09-11
status: in-progress
tags: [vellum, google-flow, image-generation, agents, creative-workflow]
preview:
  src: /projects/vellum/opengraph-image
  alt: I wanted a better Google Flow, with the blue Vellum contact-sheet artwork.
---

I'm building Vellum while using it to make product images for X-All, a cleaning brand I work on. The image work keeps showing me what to change in the app.

I'd just finished rebuilding the [X-All](https://x-all.com/) website in Shopify. Making assets for the site gave me a specific job for Vellum: keep the product references together, help me make the images, and keep track of what's still missing.

The idea came from Google Flow. Its agent had helped me make much better site assets. I could give it references, talk through a direction, and get images I was excited to use. I also spent a lot of time on images that went wrong, sometimes asking for edits that it ignored.

I liked the grid, the minimal interface, and having the agent beside the images. I liked being able to turn it off and generate directly, too. By this point, making my own version felt like something I could go ahead and try.

![Product images on the X-All board in Vellum. The composer sits over the grid.](/posts/vellum/x-all-grid.webp "screenshot")

## Three images for Glass Wipes

In one session, I asked the agent, "Nice. What's next?"

It looked at the products that still needed images and suggested a batch. I asked it to start with a product that had empty slots and make all three images for it.

It chose Glass Wipes. Most of the board showed cleaning products against blue tile and sinks. The agent identified this pack as wipes for eyeglasses and screens, so it made the three images around desks and screens instead.

![The Glass Wipes batch, with the conversation beside the image grid.](/posts/vellum/x-all-agent.webp "screenshot")

That's the sort of conversation I want to have with the agent. The images are right there while we decide what to make next.

I've added two ways to organize the work. **Subjects** hold a product's notes and reference images. **Placements** record what I need for a particular use, such as a product gallery. I can assign images to that gallery and export them together, while the agent can use the references and style guides to help fill it out.

The board also shows where the work is unfinished. In the same conversation, the agent pointed out a garbage-disposal image that needed attention. The pod was still in its blister and the drain collar looked industrial. Both need fixing.

![The disposal image open for editing. The pod still has its clear casing.](/posts/vellum/x-all-disposal-viewer.webp "screenshot")

## Bringing back the Generate button

Somewhere during the build, Vellum lost direct generation. I'd made an alternative to Flow that couldn't do one of the things I liked about Flow. Sometimes I just want to write a prompt and get an image; I don't need to discuss it first.

I brought it back, and **Generate** is now the default. I choose a model, attach any images, and write my prompt. When I want help, I switch to **Agent**. What I've typed and attached stays with me when I switch.

## Letting other agents find the images

I'm still working through the X-All assets. After that, I'll probably add a way for external agents to query Vellum through an API. An agent working on the site could find the images I've already made and see where they're meant to go.

For now, I have more product images to finish, including that disposal pod.
