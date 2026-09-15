# PhantomRack editorial notes

Published September 11, 2026 at `/projects/phantomrack`.
The canonical article is `content/projects/phantomrack.md`.
Rewritten locally September 14, 2026 as “A coffee-shop demo became PhantomRack,”
around the coffee-shop discovery and Jackson's first app interface. The existing
audio pair now follows the rack explanation; the homepage capture follows the
design story. The closing link points to the live app. Publication date and media
URLs are unchanged; this rewrite has not been published.

## Editorial context
- Jackson clarified on September 11 that PhantomRack was his first app interface, not his first website or first use of dedicated design tools.
- Includes the already-published Upfront Hip-Hop dry/processed audio pair from the product landing page. It is not the coffee-shop demonstration or evidence of a match to the original reference.
- The approximate user count and handful of paying users are Jackson’s September 11 report. His search for alternatives is personal experience, not a verified uniqueness claim.

## Source basis
- Jackson's September 10 account in this site thread supplies Mike's idea, the Replit question, the coffee-shop demonstration the following week, his subsequent search, and his frontend and marketing role. He tentatively remembers Mike loading the rack and applying it to a vocal; no claim about how closely it sounded like the reference is supported.
- PhantomRack's canonical `AGENTS.md`, `PIPELINE.md`, and `server/ableton.ts` describe audio analysis, optional dry-vocal comparison, stock devices, parameter translation, and rack export. Behavior was rechecked on September 11, 2026 against these files and `server/demucs.ts`. Vocal isolation is conditional on availability; mixed-track analysis is the fallback. The article describes the original demonstration without promising recovery of the producer’s settings.
- The early repository history begins February 26, 2026. Commits `3f72610`, `698a3e5`, `0e6d09f`, and `09ef0fa` record rack compression, device recognition, preset structure, and device-template work. `fe0f1a8` adds the Gemini integration in March. These dates don't establish when Jackson first made the discovery.
- Media: current public homepage screenshot and unchanged `client/public/demos/hiphop-dry.mp3` / `hiphop-wet.mp3` from the PhantomRack repository. The landing page identifies these as the Upfront Hip-Hop demo.
- Jackson’s September 11 follow-up supplies the apartment meetings, division of work, model-lab comparison, first app-interface design experience, tool recollections, design-to-code surprise, approximate user count, and current pause in development. Preserve his uncertainty about which design tool he used most.
- Jackson recalls thinking “oh great, another one bites the dust” when Mike asked whether he'd tried Replit. This refers affectionately to the obsession and rabbit holes of first getting into agentic tools, which Jackson recognizes in himself. This is an internal reaction, not something he says he told Mike.
- September 14 rewrite check: `server/analysis.ts` and `server/ableton.ts` still support conditional vocal isolation, Gemini audio analysis, and editable rack generation. The public [PhantomRack homepage](https://phantomrack.ai/) was reachable and confirmed the app destination and Upfront Hip-Hop demo. No new user counts or quality claims were taken from the marketing copy. The earlier capture is labeled September 2026; no original coffee-shop recording is implied.
