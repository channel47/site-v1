# Collection cover art

The collection is a small table of objects that invite exploration. A cover gives a piece a memorable visual identity; its title and explanation appear on focus or after opening. Information density is not a goal. The blue tablet relief in `public/collection/flow-specimen.webp` is the quality benchmark.

## Choose the image before rendering

1. Look through the actual piece and its media. Prefer a striking result, product photograph, frame, or physical artifact when one already works.
2. Decide what makes that image worth looking at: material, repetition, scale, color, or an unexpected arrangement. Preserve that quality.
3. If no existing image works, design one distinct object related to the work. A connector can suggest joining, a tool can suggest an instrument, and an experiment can become a material study. The relationship may be indirect. Avoid generic books, notebooks, report covers, dashboards, charts, and labeled boxes as default stand-ins.
4. Do not invent campaign results, interfaces, product features, or documentary evidence. Generated artwork is cover art; the piece itself contains the actual work.

## Shared visual rules

- **Camera:** near-orthographic overhead, shallow enough to reveal thickness and folds. No horizon or room. Face stays approximately square to the image; the site adds its small rotation.
- **Framing:** one complete, isolated object centered in a square canvas. Object occupies about 78–84% of the canvas. Preserve generous clearance for the shadow; never crop a corner. For the current collection, match the square physical footprint as well as the square canvas. Recompose source artwork instead of stretching or cropping a tall object. A future non-square exception needs a deliberate reason.
- **Light:** one broad, directional studio source from upper left, shadows falling lower right. Clear contact shadow, gradual falloff. Highlights must describe the material. Avoid floating objects and dramatic unrelated lighting between covers.
- **Background:** flat pure white for the current multiply-composited web treatment. No vignette, baked paper background, checkerboard, fake transparency, desk props, text UI, or frame. If true alpha is available, verify it; do not assume a transparency request succeeded.
- **Materials:** specific and convincing. Chalky tablets on blue enamel, creased printed stock, machined aluminum, smoked glass, lacquer, or anodized metal. Show fine texture without grit overlays. Prefer a strong material contrast within each object.
- **Color:** deliberate, saturated color belongs inside the object. The surrounding interface stays neutral. The reference blue is cobalt; other covers may use industrial yellow, deep green, red, graphite, or metal. Avoid pastel gradients and candy-colored assortments. One dominant color per cover is usually enough.
- **Composition:** legible silhouette at thumbnail size, a clear focal point, and room for the material to be seen. Use repetition only when its rhythm makes the object stronger. No decorative filler geometry.
- **Type:** omit it unless it is inherent to the source artwork, as with the ELT sachet. Do not put the article headline, date, category, or a fake publication title into the render. Preserve real artwork text when possible; inspect packaging text at full size.
- **Motion:** static covers stay still except for the site's gentle interaction response. Videos belong inside their pieces; do not duplicate a piece in the gallery just to add a moving object. Any future preview must be relevant to a distinct piece and respect reduced motion. Do not animate every object just because it is possible.

## Current collection

| Piece | Cover direction |
| --- | --- |
| Customer research and ad angles in Claude | A deep-green optical-glass tile with three lens ribs refracting a dot grid. Conceptual cover art, with a separate explanatory storyboard inside the article. |
| Combined Google Flow and Codex creative workflow | Keep the approved blue tablet relief unchanged. The Flow reference study and original ELT ad examples live inside one piece. |
| Google Ads MCP story and installation | A vivid industrial-yellow relief with dark machined channels converging into three; visually appealing before it is explanatory. No printed labels. |

The Flow walkthrough remains inside the combined note at `/notes/codex-static-ads-google-flow`. The gallery has one object per piece. The red ELT cover remains an available asset but is no longer a separate gallery entry.

## Agent handoff

Supply the approved tablet asset, a screenshot of the current collection, any actual artwork to preserve, the intended slot size, and this guide. Brief one asset at a time. Ask for a square, high-resolution raster, then inspect the result before integrating it.

Example prompt skeleton:

> Render one [specific object] as collection cover art. Match the supplied tablet reference's overhead camera, realistic materials, upper-left studio light, lower-right contact shadow, and complete centered framing. Use [material and dominant color]. The object occupies about 80% of the square canvas on pure white. [Preserve this actual artwork / no text.] No room, props, interface, outer frame, or invented results. The cover should be compelling at 250 pixels wide.

## Acceptance and delivery

- Compare beside the tablet reference and in the actual grid, at desktop and mobile sizes.
- Reject bland placeholder symbolism, generic notebook/report mockups, muddy material, clipped shadows, visible rectangular backgrounds, and illegible invented packaging.
- Check that the cover is appealing before reading its hover label.
- Export responsive WebP assets for the site. Keep high-resolution working images in ignored output; record generation source paths there rather than shipping every iteration.
- Keep readable titles in HTML and accessible link names. Decorative cover images have empty alt text when the same link already has a complete accessible name.
- Document a deliberate exception rather than forcing every piece into the same shape. Shared lighting and framing create coherence; subjects should vary.

## ELT production reference

The retained ELT cover was generated with the built-in image tool from the blue tablet and previous ELT cover as references. Exports: `public/collection/elt-specimen.webp` (960px) and `elt-specimen-480.webp` (480px). These, the prior cover and green connector render remain published assets, but no longer appear in the collection.

Reusable brief: one white foil ELT stick sachet on a vermilion enamel square, resting diagonally with a small spill of white powder at the opened end. Near-orthographic overhead camera; slab edges square to the canvas, centered at 82% of its width. Upper-left studio light, lower-right contact shadows, pure white surround. Realistic foil, powder and enamel. Only the ELT brand letters; no headline, scenery, fruit, advertisement or extra props. This is conceptual cover art; preserve the actual campaign images in the article.
