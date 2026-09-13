---
title: "From a reference track to an Ableton rack"
slug: phantomrack
description: "An audio experiment with a college friend led me to design my first app interface. We built PhantomRack, which makes effects racks for Ableton."
date: 2026-09-11
updated: 2026-09-13
tags: [phantomrack, music, ableton, gemini, agents, design]
preview:
  src: /projects/phantomrack/opengraph-image
  alt: "From a reference track to an Ableton rack, with the graphite audio-fader artwork."
---

A week after my college friend Mike asked whether I'd tried Replit, we met at a coffee shop to look at what he'd been building. I'd been using AI to make websites, while he was working on an app that could listen to a song and help a musician get a similar sound on a recording of their own.

The idea was to start with a song whose vocal sound you liked and get a set of effects you could try on your own recording. The app could isolate the reference vocal and ask Google's Gemini model to estimate the effects it heard, then assemble those effects and settings into a rack for Ableton, the music production software.

I hadn't realized a model could analyze audio in enough detail to attempt that. The result was an actual file you could open in Ableton, where you could listen to what the model had suggested and change it. After our meeting, I looked for other people doing something similar and didn't find much like it.

We met a few more times at my apartment to work on what became PhantomRack. Mike concentrated on the system that analyzed the audio and produced the racks, while I took on the interface. It felt a little like having our own model lab, with him as the research team and me as the product team.

I'd [built websites](/projects/ballet-born-simple) before, but this was my first app interface. I tried a few design tools to work through how it should look, mostly [Superdesign](https://superdesign.dev/), I think, with some Claude Design and Google Stitch along the way. Having a design I wanted to use gave me something to work toward, though the code a design tool supplied didn't necessarily fit the app Mike had been building.

That was where Claude Code and Codex helped. I could give them the design and have them work out how to build it within our project. I was surprised by how faithfully the working interface could follow the design, even when its original code wasn't something we could use directly.

![PhantomRack's homepage, showing the reference-track workflow and an invitation to make a first rack.](/posts/phantomrack/homepage.webp "screenshot")

The racks PhantomRack makes use effects already included in Ableton. They're estimates of what might produce the sound of a reference vocal, with settings a musician can try and adjust by ear. Vocal isolation depends on the separation service being available; when it isn't, the app can analyze the mixed track instead.

The Upfront Hip-Hop clips below show a rack applied to a vocal. They're from the product's later published demos, rather than the coffee-shop demonstration. The first recording is unprocessed, and the second has the rack applied, so you can hear what changes when the same vocal runs through it.

<figure class="st-media">
  <div style="display:grid;gap:1rem">
    <div style="display:grid;gap:0.5rem;font-size:0.875rem">Original vocal
      <audio controls preload="none" aria-label="Upfront Hip-Hop: original vocal" style="width:100%"><source src="/posts/phantomrack/hiphop-dry.mp3" type="audio/mpeg"><a href="/posts/phantomrack/hiphop-dry.mp3">Listen to the original vocal</a></audio>
    </div>
    <div style="display:grid;gap:0.5rem;font-size:0.875rem">With the rack
      <audio controls preload="none" aria-label="Upfront Hip-Hop: processed vocal" style="width:100%"><source src="/posts/phantomrack/hiphop-wet.mp3" type="audio/mpeg"><a href="/posts/phantomrack/hiphop-wet.mp3">Listen to the processed vocal</a></audio>
    </div>
  </div>
  <figcaption class="st-shot-cap">Upfront Hip-Hop, from PhantomRack’s published demos. Compare the same vocal without and with the rack. This pair does not include the reference track.</figcaption>
</figure>

PhantomRack has reached about 300 users, most of them on the free plan, with a handful who pay. Mike's experiment became something other people could use, and I got to design and build my first app interface as part of it.

Neither of us has worked on it much in recent weeks. Life has been busy, and there's more we'd like to do, but we're proud of what we've made together.
