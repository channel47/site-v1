---
title: "I wanted a better Google Flow"
slug: vellum
description: "I'm building Vellum while making product images for X-All, working out where an agent helps and when I want to generate an image myself."
date: 2026-09-10
updated: 2026-09-13
status: in-progress
tags: [vellum, google-flow, image-generation, agents, creative-workflow]
preview:
  src: /projects/vellum/opengraph-image
  alt: I wanted a better Google Flow, with the blue Vellum contact-sheet artwork.
---

I'm building an image workspace called Vellum while using it to make product images for X-All, a cleaning brand I work on. I'd just rebuilt the [X-All website](https://x-all.com/) in Shopify, and the product pages needed assets. That gave me a specific job for the app: keep the references together, help me make the images, and remember what was still missing.

The idea came from Google Flow, where I'd been generating product imagery with an agent's help. I liked the arrangement: a grid of images, a minimal interface, and a conversation beside the work. I could give it references and talk through a direction. When I knew what I wanted, I could turn the agent off and generate an image directly.

Some of the results were good enough to make me want to keep working that way. Others had incorrect packaging or needed edits that Flow sometimes ignored. I wanted to keep what I liked about the workspace and work on the parts that frustrated me. By then, building my own version felt like something I could try.

![The X-All board in Vellum, with product images arranged in a grid and the prompt composer below.](/posts/vellum/x-all-grid.webp "screenshot")

In one session, I asked Vellum's agent, “Nice. What's next?” It looked through the products that still needed images and suggested a batch. I asked it to choose a product with empty slots and make all three images for it.

It chose Glass Wipes. Most of the board showed cleaning products against blue tile and sinks, but the agent identified this pack as wipes for eyeglasses and screens. It set the images around desks and screens instead. In the grid, the change is visible: a hand cleaning glasses, a monitor being wiped, the blue pack beside each scene.

![The agent explains its choice of Glass Wipes and shows the three generated images as thumbnails beneath the conversation.](/posts/vellum/x-all-agent.webp "screenshot")

That's the kind of help I want from the agent. It can look at the work already there, consider what the product needs, and suggest what to make next. I can follow its reasoning with the images in view and decide whether to continue.

To support that, I've added two ways to organize a project. Subjects hold a product's notes and reference images. Placements record what I need for a particular use, such as a product gallery. I can assign images to that gallery and export them together. The agent can use the same references and style guides while helping me fill it out.

Keeping track of images also means keeping track of problems. In the Glass Wipes conversation, the agent reminded me about a garbage-disposal image that still needed attention. The pod was shown in its blister packaging, and the drain collar looked industrial. The image had the blue setting and dramatic water I was using elsewhere, but those details were wrong.

![The disposal image open in Vellum's editor. The yellow pod is still surrounded by its clear blister casing.](/posts/vellum/x-all-disposal-viewer.webp "screenshot")

Seeing an image in the grid doesn't mean it's finished. These are generated studies in progress; the before-and-after compositions on the board aren't evidence of how the products perform. I still have to inspect what each image shows and decide whether it belongs on the site.

While building all this, I managed to lose direct generation. I'd made an alternative to Flow that couldn't do one of the things I liked about Flow. Sometimes I just want to write a prompt and get an image. Having to discuss it with an agent first adds a conversation I don't need.

I brought the Generate button back and made it the default. I choose a model, attach images, and write the prompt. When I want help working out a direction or deciding what comes next, I switch to Agent. The text and attachments stay with me when I switch, so I can make that choice without starting again.

Using Vellum for the X-All work keeps making these decisions concrete. A gallery needs three images. One product calls for a different setting. An image needs an edit, and I already know what to ask for. Each gives me something specific to improve in the app.

After the X-All assets, I'll probably add a way for external agents to query Vellum through an API. An agent working on a website could then find the images I've already made and see where they're meant to go. That access is still proposed. For now, I'm working inside Vellum, with more product images to finish and a disposal pod to get out of its packaging.
