# From a reference track to an Ableton rack

Unpublished draft for editorial review.

---

A friend of mine from college, Mike, built an app that takes a song, pulls out the vocals, and asks Gemini to figure out what effects were used on them. It then puts together an effects rack you can open in Ableton, the music production software, and try on another vocal.

The week before, Mike had asked if I'd ever tried Replit, a tool for building apps. I remember thinking, “Oh great, another one bites the dust.” I'd already spent plenty of time down those rabbit holes myself.

Then we met at a coffee shop and he showed me what he'd made. I hadn't realized Google's models could understand audio well enough to even attempt something like that.

Afterward, I went looking for other people doing similar things with AI and audio. I didn't find much like it, and I wanted to get involved. Mike had built the original app, which became PhantomRack.

If you haven't used an effects rack before, it's a group of audio effects and their settings saved together. PhantomRack uses the effects that come with Ableton, so you can load the rack onto your own vocal and change the settings as you listen.

The model is guessing at the processing from what it can hear in the song. You aren't getting the producer's original settings. You get something you can actually try in a session, though, which is what made the idea so interesting to me.

Here's one of the demos from the site. The first clip is the vocal without the rack, and the second has it applied. It's a later example than the one Mike showed me at the coffee shop.

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

## Working on it together

After that first meeting, we had a few more at my apartment. Mike worked on the underlying system for extracting effects racks, and I worked on the user experience. It felt like a model lab. Mike was the research team and I was the product team.

I hadn't done any product or web UI design before PhantomRack. I tried a few tools for the interface design, mostly [Superdesign](https://superdesign.dev/), I think, with a bit of Claude Design and some Google Stitch at one point. The build itself was a mixture of Claude Code and Codex, my agentic tools of choice.

What surprised me was how faithfully the coding agents could reproduce the designs I'd made. The code coming out of the design tools didn't necessarily match the way our app was built, but the agents could translate it into something that worked for us. I could make a design in one tool and then have an agent work out how to use it in our actual app.

It was my first time trying any of this. I enjoyed it, and I learned a lot.

![PhantomRack’s current homepage.](/posts/phantomrack/homepage.webp "screenshot")

At the moment, PhantomRack has about 300 users, mostly on the free plan, and a handful of paying users. Neither Mike nor I has worked on it much in recent weeks. Life gets busy.

We're still proud of what we built, though. I think it's useful, and I still haven't found another tool that reliably does what PhantomRack does.

---

## Before publication

- Includes the already-published Upfront Hip-Hop dry/processed audio pair from the product landing page. It is not the coffee-shop demonstration or evidence of a match to the original reference.
- The approximate user count and handful of paying users are Jackson’s September 11 report. His search for alternatives is personal experience, not a verified uniqueness claim.

## Source basis

- Jackson's September 10 account in this site thread supplies Mike's idea, the Replit question, the coffee-shop demonstration the following week, his subsequent search, and his frontend and marketing role. He tentatively remembers Mike loading the rack and applying it to a vocal; no claim about how closely it sounded like the reference is supported.
- PhantomRack's canonical `AGENTS.md`, `PIPELINE.md`, and `server/ableton.ts` describe audio analysis, optional dry-vocal comparison, stock devices, parameter translation, and rack export. Product behavior should be rechecked before publication.
- The early repository history begins February 26, 2026. Commits `3f72610`, `698a3e5`, `0e6d09f`, and `09ef0fa` record rack compression, device recognition, preset structure, and device-template work. `fe0f1a8` adds the Gemini integration in March. These dates don't establish when Jackson first made the discovery.

- Media: current public homepage screenshot and unchanged `client/public/demos/hiphop-dry.mp3` / `hiphop-wet.mp3` from the PhantomRack repository. The landing page identifies these as the Upfront Hip-Hop demo.

- Jackson’s September 11 follow-up supplies the apartment meetings, division of work, model-lab comparison, first design experience, tool recollections, design-to-code surprise, approximate user count, and current pause in development. Preserve his uncertainty about which design tool he used most.

- Jackson recalls thinking “oh great, another one bites the dust” when Mike asked whether he'd tried Replit. This refers affectionately to the obsession and rabbit holes of first getting into agentic tools, which Jackson recognizes in himself. This is an internal reaction, not something he says he told Mike.
