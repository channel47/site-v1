# 47 refinement QA

September 10 motion refinement (America/Los_Angeles): shortened page arrival to 720ms with 60ms stagger steps. Text starts with 3px blur and 3px displacement; objects use 6px/8px. The revised curve makes the first heading sharp at about 300ms, with a short opacity finish. A passive browser sampler measured 41%/77%/97% opacity at 100/200/300ms. Both About paragraphs participated; the second was sharp by 400ms. The logo assembly and cobalt menu timing are unchanged.

Removed positional hover/focus motion from index titles, back arrows, next-reading arrows and session-proof arrows. Keyboard checks confirm stationary glyphs and text while color changes. Article prompt/code blocks now share the existing copy icon and feedback; actual browser copy/paste matched the second prompt exactly, including line breaks. Portrait media reserves its reduced layout even before downloading; at an 808 × 631 CSS viewport, all three tall research-article images fit at 454px high without cropping. The article and About page have no horizontal overflow at 388px. Temporary timing and clipboard instrumentation was removed after these checks.

Reviewed September 9, 2026 (America/Los_Angeles). Scope: menu presentation, pointer/keyboard focus, author portraits, sentence-case UI, the ELT cover and Google Ads consolidation. Existing concurrent brand work is preserved.

Motion pass: preserved the logo assembly and menu wash; unified page arrivals, gallery settling, control response, disclosures and feedback. The complete inventory and deliberate static moments live in `docs/design-system.md`.

Follow-up motion audit found the cause of the abrupt arrivals: optimized CSS returned `1.4s`, which `parseFloat` supplied to Web Animations as 1.4 milliseconds. The same assumption affected the menu fallback timer. Both now use a shared CSS-time conversion. The entrance also starts before first paint, waits for decoded artwork/fonts, and uses a slower initial curve. Missing hydration and stalled assets fail open instead of leaving invisible content.

The independent combined review found that article images lacked intrinsic dimensions. The shared renderer now reserves space for local JPEG, WebP and SVG artwork before loading, including the five figures added in the editorial revision. Regression tests cover all three formats, replaced assets, missing/remote images and the public-directory boundary.

## Changes

- The menu reel fades through a stationary mask at both edges. Focused links remain centered and clear; reduced motion removes the mask and repeated groups.
- Return links use a single 20px Phosphor arrow in a 48px target, with the destination in the accessible name and tooltip. Returning restores scroll position for every visit and the selected link for keyboard-opened pieces. Pointer-opened pieces do not receive programmatic focus on return.
- Menu links are text only. Close is a bare X; keyboard focus uses a short underline. Pointer opening focuses the dialog, keyboard opening focuses Close. The skip link reveals only after Tab input, never from pointer input or restored focus alone.
- One AuthorPortrait component uses the original square photo with an upright circular crop. Portraits sit beside their related headings and beside the author on every content page. Article metadata is grouped below the linked author name.
- Interface labels use sentence case and close tracking. Removed redundant legacy results/status strips from the two affected stories; actual artwork and acronyms retain their lettering.
- ELT now uses a white sachet and powder on vermilion enamel, matching the gallery framing and lighting. Original campaign media remains in the article. The gallery contains three distinct pieces.
- The Google Ads build story, installation, source and FAQs share /projects/google-ads. The former note redirects there, including Markdown and social previews. The existing project feed identity and date are preserved. Session references include the combined piece.

- About aligns the blue 20px X and GitHub icons to the right, opposite Occasional emails and its 18px envelope on the left. The same social pair appears at the menu’s lower left, opposite contact and RSS. The footer contains only the mark and legal links. All icon targets are 48px, with accessible names and hover/focus labels. No redundant outbound arrows.

## Verification

- September 10 article-detail follow-up: code/prompt copy controls now match the install control's glyph, 48px target, hover surface, insets and success feedback. Both upper and lower arrow-only return links work; pointer return leaves no focused gallery item. Screenshots render directly without added frames or shadows, and article media has an 8px radius. The incident capture is cropped closer to make the changed lines larger; its source remains a compressed browser capture. The generated connector label now reads Google Ads. Checked the article at 1149px and 388px, with no horizontal overflow. Content, type, motion, measurement, SEO, production build and content-surface checks pass.
- Google Ads article imagery: two contextual material renders and two real project captures replace the four type-only diagrams. All four load with intrinsic dimensions; desktop and 388px phone layouts have no horizontal overflow. The Inspector capture uses the published 1.2.0 tool schema and an unexecuted documented query; the incident capture is the original public two-line fix. No account data was accessed. Content, type, SEO, artwork generation and the 27-route production build pass.
- Motion lifecycle regression checks pass: optimized CSS seconds/milliseconds, pre-paint guard expiry, font/image readiness, failed and stalled assets, late promises after cancellation, Strict Mode replay, ordinary navigation, no replay on history or filters, one-time off-screen artwork reveals, immediate settling on input, reduced-motion changes and cleanup on pagehide/unmount. These use browser doubles; they do not claim physical-device motion testing.
- A temporary passive frame sampler caught the 1.4ms bug in the real browser, then verified the correction on a fresh document. At approximately 100/300/500/1000ms the first object was 1%/18%/54%/95% opaque, settling fully at 1500ms. The first sampled frame was hidden, with no visible-to-hidden flash, and artwork was ready before progress. Timing instrumentation is removed before release.
- Native browser animation events confirm the menu opens over 900ms and closes over 640ms. Interrupting its opening at about 267ms still completes a 640ms close and releases the modal/scroll lock. Phone-width fresh gallery/article arrivals and quiet browser-back restoration pass.
- The final production build was checked at 358 CSS pixels: all five research-article figures reserve their correct dimensions, including four still-unloaded images; the page has no horizontal overflow and retains one display quote. The separate review agent rechecked the dimension fix and reported no remaining actionable findings across all three contributors' changes.
- Browser checks confirm an off-screen gallery object waits, then resolves when scrolled into view. Returning restores the gallery’s scroll and keyboard focus with all objects visible. Copy reports success with one feedback animation; FAQ opening retains one active, non-inert panel. A quick menu open/close completes without a stranded overlay.

- Typecheck, content model, measurement and SEO checks pass. Production build succeeds (27 routes).
- Server checks pass for three canonical pieces: HTML, Markdown twins, content negotiation, social previews, redirects, index filters, search, sitemaps, RSS and retained media. Search exposes one Google Ads piece. The old note resolves to the combined page.
- Visually reviewed the three objects, mobile menu fades, About and newsletter portrait placement. Checked article byline and heading geometry at 358px and 388px with no horizontal overflow.
- Menu keyboard navigation centers the focused link. Navigating to About completes the exit before changing routes. Keyboard-opened pieces restore the originating gallery link; pointer-opened pieces return with no focused artwork or visible skip prompt.
- The combined Google Ads article has one portrait, story before installation and three FAQs. Copying the install command reports Copied; opening the second FAQ closes the first.
- Verified pointer-opened menu has no row arrows, Close background or Close outline. Tab reveals the skip link; pointer input hides it. Keyboard opening focuses Close, arrow navigation reaches Index and Escape returns to the trigger.
- No subscription, booking or external share was submitted. Published media URLs remain intact.

- At 358px, About’s email invitation and social icons fit on one row with 48px targets and no horizontal overflow. Both menu icon groups fit within the viewport. Tab reaches the social profiles, their focus labels stay within the screen, and Escape closes the menu.

## Limits

Browser screenshot capture can crop or reposition parts of the image; geometry and native interaction checks are recorded separately. Physical iPhone/Safari and device-level reduced-motion preferences were not tested.

Canonical values: app/tokens.css. Components: app/globals.css. Design rules: docs/design-system.md. Artwork and generation brief: docs/cover-art.md.
