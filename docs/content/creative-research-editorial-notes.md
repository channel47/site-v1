# Creative research pipeline — editorial notes

Draft: [Building a creative research pipeline](creative-research-pipeline-draft.md).

Adopted locally in `content/notes/customer-research-ad-angles-claude.md`, which is now the canonical article. Its slug and publication date are preserved, with `storyDate: "2026-04"`. Selected figures are in `public/posts/creative-research/`; existing media URLs remain available. Nothing has been published. The draft above is the reviewed working copy.

The reusable starter source is `workflows/creative-research-starter/`. Its explicit four-file download is built with `node scripts/package-workflow.mjs creative-research-starter`. The article includes the ZIP, readable instructions, a downloadable blank brief, and a copyable starter prompt. It contains newly authored general instructions and no workshop research, client data, or artwork.

## Sources and boundaries

- Jackson confirmed that he demonstrated the creative research pipeline during a Vibe Marketer mentor session. He recalled possibly ELT in April or May, but does not remember the Norse example well enough to reconstruct the session.
- [Public recap, April 28, 2026](https://thevibemarketer.beehiiv.com/p/your-d2c-ads-are-not-converting-the-problem-isn-t-your-offer-or-creative): confirms Jackson's Creative Strategist walkthrough and three-stage workflow. Avoid its performance guarantees and episode numbering.
- `/Users/jackson/Documents/resources/thevibemarketer/skills-lab-creative-strategist/norse-code-research.md`: source excerpts, access labels, themes. Material includes testimonials, snippets, and articles, so do not describe all 60 items as verified customer quotes.
- Same folder: `norse-code-personas.md` and `norse-code-angles.md` document the named profiles and six proposed creative directions. Hooks are generated drafts, not customer testimony; no produced campaign or results were found. The article does not repeat unsupported medical or competitor claims.
- Same folder: `norse-code-dashboard.jsx` is the saved April artifact. The screenshot is a new rendering, cropped to the header/navigation/source excerpt; it is not a historical screenshot or campaign report.
- `/Users/jackson/Documents/resources/Claude/Projects/DrinkELT/drinkelt-{research,personas,angles}.md`: May 11 research outputs.
- `/Users/jackson/Documents/resources/Codex/2026-05-11/i-would-like-to-get-into/elt-lab-prep/call-prep.md` and `research-brief.md`: follow-on preparation and planned questions for the owner. Do not claim a finished conversion page, answered questions, or sales results.

## Visuals

1. `assets/creative-research/pipeline.png`: a new editorial diagram of the three-stage workflow, drawn from native HTML/SVG. The saved SVG is the editable source.
2. `assets/creative-research/protein-graveyard.png`: conceptual illustration generated with the built-in image tool. It is labeled in the article, unbranded, and depicts the cupboard variant of the written direction. It is not a customer photograph or original campaign creative.
3. `assets/creative-research/lab-dashboard.png`: actual saved dashboard code rendered for this article, cropped to a relevant section. Original code is unchanged.

### Illustration prompt

```text
Use case: photorealistic-natural
Asset type: editorial illustration inside a first-person essay about an AI customer-research workshop.
Primary request: illustrate a proposed advertising concept called "The Protein Graveyard": the forgotten, half-used protein powders accumulated by someone who keeps trying a product and stops using it. This is a new conceptual illustration, not a documented photograph of a real customer or a finished campaign.
Scene/backdrop: an ordinary kitchen cupboard with the door open, a pale oak shelf, glimpses of a quiet lived-in kitchen. Five differently shaped protein powder containers and resealable pouches crowded loosely on the shelf. Some lids off so half-full powder is visible, a scoop left in one container, one folded pouch almost empty. Subtle powder dust, slightly bent labels and creased pouches, convincing physical detail. Mostly plain ivory, muted green, charcoal and kraft packaging.
Style/medium: exceptionally good editorial photography, natural, tactile and understated. Interesting asymmetrical composition and softly directional afternoon window light. Close crop that makes the accumulation immediately legible; medium depth of field with all five containers readable as objects. Landscape 3:2 composition.
Constraints: entirely unbranded packaging with no readable label text, no real brand names, no invented Norse Code product packaging, no people, no health claims, no before-and-after claims, no ad headline or call to action, no gravestones or literal cemetery imagery. The idea should be recognizable through the objects alone. Avoid glossy CGI, staged luxury product advertising, excessive clutter, decorative overlays, diagrams, or text.
```
