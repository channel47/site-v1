---
title: "I wanted a better Google Flow"
slug: vellum
description: "I built an image workspace around the things I liked in Google Flow. Making product images for X-All keeps showing me what it needs."
date: 2026-09-10
updated: 2026-09-14
status: in-progress
tags: [vellum, google-flow, image-generation, agents, creative-workflow]
preview:
  src: /projects/vellum/opengraph-image
  alt: I wanted a better Google Flow, with the blue Vellum contact-sheet artwork.
---

I built my own version of Google Flow and managed to leave out one of the things I liked about it.

Sometimes I just wanted to write a prompt and generate an image. Somewhere during the build, that direct route had disappeared. I'd made an image workspace with an agent, and now I needed to bring back the option to work without it.

That was a slightly ridiculous problem to give myself. I'd started building the app because Flow had already shown me an arrangement I liked.

## A workspace I wanted to keep using

The images sat in a grid, with a conversation beside them and very little else in the way. I could look at the work while talking through what I wanted. When I already knew, I could turn the agent off and write the prompt myself.

Flow was also making images I was excited about. I'd been using it for product shots, bringing in photographs and visual references and seeing what it could do with them. Some of the results were good enough to keep me working through the less enjoyable parts.

The packaging could be wrong. A correction might get ignored. I'd get an image I wanted to keep, then struggle to get the remaining details right.

I wanted to keep working in a space like that, with more control over how it worked. By then, building my own version felt like something I could try.

I called it [Vellum](https://vellum.gallery/).

## Giving it an actual job

I'd just rebuilt the Shopify site for [X-All](https://x-all.com/), a cleaning brand. The product pages needed images, which gave me a reason to use Vellum while I was building it.

There were products to organize, reference photographs to keep track of, and galleries to fill. As the board grew, I needed to know which products still needed work.

![X-All product-image studies in Vellum, with the prompt composer below the grid. The before-and-after compositions are generated concepts.](/posts/vellum/x-all-grid.webp "screenshot")

The board filled with blue tile, stainless steel, and water. Scrubbers against bathroom walls. A spray bottle beside a stove. Cleaning products around sinks. Taken together, the images were beginning to look like a set.

In one session, I asked the agent, “Nice. What's next?”

It went through the unfinished work. Some products needed one more image. Others had empty galleries. There were also images we'd already made that needed attention.

I asked it to pick one of the empty galleries and make all three images.

It chose Glass Wipes. After reading the packaging, the agent described them as wipes for eyeglasses and screens. That changed the setting: this batch went onto desks and beside monitors, away from the tiled bathrooms around it.

The results showed the blue pack beside a screen, a hand wiping a monitor, and someone cleaning a pair of glasses. They belonged together, and the setting made sense for the product the agent thought it was working with.

![The agent's conversation beside the X-All board, including its choice of Glass Wipes and the three images it generated.](/posts/vellum/x-all-agent.webp "screenshot")

That short exchange is a good example of what I want the agent to be able to do. The question made sense because the work was already there: products, references, existing images, and the gaps in their galleries.

I could ask what came next and get a proposal based on the board. Then I could look at the images beside the conversation that had produced them.

## Keeping the product in view

I've been building the organization around that kind of work.

A Subject holds a product's notes and reference images. A Placement records what the images are for, such as a product gallery. I can assign images to that gallery and export them together.

Those are useful distinctions when I'm working across a whole store. The product needs to remain recognizable as its setting changes, and each image needs somewhere to go. Keeping the references and intended use close to the work gives both me and the agent something to refer back to.

It still takes a close look to decide whether an image is usable.

In the Glass Wipes conversation, the agent also reminded me about a garbage-disposal image. It showed a yellow cleaning pod above a sink, with running water and blue tile behind it. At the size of a grid thumbnail, it fit right in.

Open it up and the pod was still enclosed in its clear blister packaging. The drain collar looked industrial, too.

![The disposal image open for editing in Vellum. The yellow pod is still inside its clear blister packaging.](/posts/vellum/x-all-disposal-viewer.webp "screenshot")

The image had the color, lighting, and general appearance of the rest of the board. It also showed a product being used with its packaging still on. I couldn't put it on the product page that way.

I need to move between those two views of the work: the whole board, where I can see what belongs together and what is missing, and the individual image, where I can inspect what the model has actually made.

## Bringing the prompt back

Using Vellum gave me things to change in the app as well as the images. Losing direct generation was one of them.

The agent was useful when I wanted help deciding what to make or working through a batch. Sometimes I'd already made that decision. I wanted to attach the references, choose the model, write the prompt, and see the result.

I brought direct generation back and made Generate the default. When I want help, I can switch to Agent. Whatever I've typed or attached stays with me as I move between them.

That's much closer to the workspace I wanted in the first place. I can ask for help with the next product gallery, then take over the prompt for an image I want to work on myself. Both belong in the same app.

## Try Vellum

Vellum is still taking shape. If you make images with AI, I'd like you to try it and see how it fits the way you work.

I'm also considering open sourcing it so people can tweak the app for themselves. I started this because I wanted a workspace I could change; I'd like other people to have that option, too.

<p class="workflow-downloads"><a class="workflow-download" href="https://vellum.gallery/">Try Vellum</a></p>
