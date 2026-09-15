---
title: "A coffee-shop demo became PhantomRack"
slug: phantomrack
description: "My friend Mike showed me an app that turned a song into an editable Ableton rack. I joined him to build the interface, and we made PhantomRack."
date: 2026-09-11
updated: 2026-09-14
tags: [phantomrack, music, ableton, gemini, agents, design]
preview:
  src: /projects/phantomrack/opengraph-image
  alt: "A coffee-shop demo became PhantomRack, with the graphite audio-fader artwork."
---

When my college friend Mike asked whether I'd tried Replit, I remember thinking, *oh great, another one bites the dust*.

I meant it affectionately. I'd been using AI to make websites and knew how absorbing these tools could be. Mike was getting into them, too.

A week later, we met at a coffee shop. He had an app to show me, and it was doing something I hadn't realized a model could attempt.

You gave it a song with a vocal sound you liked. It analyzed the audio, estimated the effects that might produce that sound, and made a file you could open in Ableton, the music production software. You could then apply those effects to a vocal recording of your own.

I'd been making pages. Mike was getting a model to listen to music and propose a way to make something sound like it.

## From a song to a rack

An effects rack collects a sequence of audio effects and their settings. In this case, the app used Google's Gemini model to analyze the reference and suggest a chain, then assembled it using effects already included in Ableton.

The result was something a musician could work with. Load the rack, hear it on a recording, open the effects, and change the settings. The model's interpretation became a starting point you could listen to and adjust by ear.

That was the part that surprised me: audio analysis could get far enough to produce an editable rack. After the coffee-shop meeting, I looked for other people doing something similar and didn't find much like it.

The app can separate the vocal from the reference song before analyzing it. When that separation isn't available, it works from the mixed track. Either way, the rack is an estimate of what might produce the sound, with settings for the musician to try.

These clips are from PhantomRack's later public demos. Play the original vocal, then the version with the rack applied to hear the change.

<figure class="st-media">
  <div style="display:grid;gap:1rem">
    <div style="display:grid;gap:0.5rem;font-size:0.875rem">Original vocal
      <audio controls preload="none" aria-label="Upfront Hip-Hop: original vocal" style="width:100%"><source src="/posts/phantomrack/hiphop-dry.mp3" type="audio/mpeg"><a href="/posts/phantomrack/hiphop-dry.mp3">Listen to the original vocal</a></audio>
    </div>
    <div style="display:grid;gap:0.5rem;font-size:0.875rem">With the rack
      <audio controls preload="none" aria-label="Upfront Hip-Hop: processed vocal" style="width:100%"><source src="/posts/phantomrack/hiphop-wet.mp3" type="audio/mpeg"><a href="/posts/phantomrack/hiphop-wet.mp3">Listen to the processed vocal</a></audio>
    </div>
  </div>
  <figcaption class="st-shot-cap">Upfront Hip-Hop: the same vocal without and with the rack. The reference track is not included in this pair.</figcaption>
</figure>

## Our own model lab

We met a few more times at my apartment to work on what became PhantomRack. Mike concentrated on the audio analysis and rack generation. I took on the interface and marketing.

It felt a little like having our own model lab: Mike was the research team, and I was the product team. He was working on what the app could do with a recording. I was working on how someone would use it.

I'd [built websites](/projects/ballet-born-simple) before, but this was my first app interface. There was a process to carry someone through: bring in a reference, wait for the analysis, inspect the proposed effects, and get the rack into Ableton.

I tried a few tools to work out how it should look. I think I used Superdesign most, with some Claude Design and Google Stitch along the way. I could get to a design I wanted to use, but the code that came with it didn't necessarily fit the app Mike was building.

That gave Claude Code and Codex a different job. I could show them the design and have them work out how to build it within our project. The design supplied a clear target; the agents could adapt the implementation to the app we already had.

I was surprised by how faithfully the working interface could follow it. I'd expected there to be more distance between the design I liked and what we could actually build. Seeing those two come together was a big part of what I enjoyed about the project.

![PhantomRack's later public homepage, captured in September 2026. The reference-track idea became the starting point for the product's interface and marketing.](/posts/phantomrack/homepage.webp "screenshot")

## A project we made together

By the time I sat down to write about PhantomRack, it had reached about 300 users. Most were on the free plan, with a handful paying. People could sign up, bring their own recordings, and use what we'd made.

We're in a quieter stretch with it now. Life has been busy, and neither of us has worked on it much in recent weeks. There's more we'd like to do. I'm proud of what we've made together: Mike's audio experiment became an app people could use, and I got to build my first app interface alongside a friend.

If you use Ableton, bring a reference track and try it on a vocal of your own. I'd be interested to hear what you keep and what you change.

<p class="workflow-downloads"><a class="workflow-download" href="https://phantomrack.ai/">Try PhantomRack</a></p>
