---
title: "From a reference track to an Ableton rack"
slug: phantomrack
description: "A college friend built an app that estimates the effects on a reference vocal and makes an Ableton rack. I joined him to design my first app interface."
date: 2026-09-11
tags: [phantomrack, music, ableton, gemini, agents, design]
preview:
  src: /projects/phantomrack/opengraph-image
  alt: "From a reference track to an Ableton rack, with the graphite audio-fader artwork."
---

When my college friend Mike asked whether I'd tried Replit, a tool for building apps, my first thought was, “Oh great, another one bites the dust.” I'd spent plenty of time down those rabbit holes myself. Now he was getting into it, too.

A week later, we met at a coffee shop and he showed me what he'd made. His app could take a song, isolate the vocal, and use Google's Gemini model to estimate the effects on it. Then it put together an effects rack you could open in Ableton, the music production software, and try on another vocal.

I hadn't realized the models could understand audio well enough to attempt that. Afterward, I went looking for other people doing something similar. I didn't find much like it, and I wanted to get involved. I joined Mike to work on the interface of what became PhantomRack.

An effects rack is a group of audio effects and their settings saved together. PhantomRack uses the effects included with Ableton, so you can load the rack onto your own vocal and adjust it as you listen.

You aren't getting the producer's original settings. The model is working from what it can hear in a finished song. What interested me was that its estimate came in a form I could open and use in a session.

The clips below are from the Upfront Hip-Hop demo on the product site. They came later than the coffee-shop demonstration. The first is the vocal without the rack; the second has the rack applied.

<figure class="st-media">
  <div style="display:grid;gap:1rem">
    <div style="display:grid;gap:0.5rem;font-size:0.875rem">Original vocal
      <audio controls preload="none" aria-label="Upfront Hip-Hop: original vocal" style="width:100%"><source src="/posts/phantomrack/hiphop-dry.mp3" type="audio/mpeg"><a href="/posts/phantomrack/hiphop-dry.mp3">Listen to the original vocal</a></audio>
    </div>
    <div style="display:grid;gap:0.5rem;font-size:0.875rem">With the rack
      <audio controls preload="none" aria-label="Upfront Hip-Hop: processed vocal" style="width:100%"><source src="/posts/phantomrack/hiphop-wet.mp3" type="audio/mpeg"><a href="/posts/phantomrack/hiphop-wet.mp3">Listen to the processed vocal</a></audio>
    </div>
  </div>
  <figcaption class="st-shot-cap">Upfront Hip-Hop, from PhantomRack’s published demos. Original vocal first, then the version with the rack applied.</figcaption>
</figure>

## Mike on the audio, me on the interface

We met a few more times at my apartment. Mike worked on the system for producing the racks, and I worked on the user experience. It felt a bit like a model lab: he was the research team, and I was the product team.

This was my first app interface. I tried a few design tools, mostly [Superdesign](https://superdesign.dev/), I think, with some Claude Design and Google Stitch along the way. Claude Code and Codex handled the build.

I was surprised by how faithfully the coding agents could reproduce the designs. The code a design tool produced didn't necessarily fit our app, but the agents could translate the design into code that did. I enjoyed seeing how much of the interface I could make this way.

![PhantomRack’s current homepage.](/posts/phantomrack/homepage.webp "screenshot")

As of September 2026, PhantomRack has about 300 users, mostly on the free plan, and a handful who pay. Neither of us has worked on it much in recent weeks. Life gets busy.

We're still proud of it. I think it's useful, and I still haven't found another tool that reliably does the same job.
