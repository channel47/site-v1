# 47 refinement QA

Reviewed September 9, 2026 (America/Los_Angeles). Scope: menu presentation, pointer/keyboard focus, author portraits, sentence-case UI, the ELT cover and Google Ads consolidation. Existing concurrent brand work is preserved.

Motion pass: preserved the logo assembly and menu wash; unified page arrivals, gallery settling, control response, disclosures and feedback. The complete inventory and deliberate static moments live in `docs/design-system.md`.

## Changes

- The menu reel fades through a stationary mask at both edges. Focused links remain centered and clear; reduced motion removes the mask and repeated groups.
- Return links use an arrow and Back, with the destination in the accessible name. Returning restores scroll position for every visit and the selected link for keyboard-opened pieces. Pointer-opened pieces do not receive programmatic focus on return.
- Menu links are text only. Close is a bare X; keyboard focus uses a short underline. Pointer opening focuses the dialog, keyboard opening focuses Close. The skip link reveals only after Tab input, never from pointer input or restored focus alone.
- One AuthorPortrait component uses the original square photo with an upright circular crop. Portraits sit beside their related headings and beside the author on every content page. Article metadata is grouped below the linked author name.
- Interface labels use sentence case and close tracking. Removed redundant legacy results/status strips from the two affected stories; actual artwork and acronyms retain their lettering.
- ELT now uses a white sachet and powder on vermilion enamel, matching the gallery framing and lighting. Original campaign media remains in the article. The gallery contains three distinct pieces.
- The Google Ads build story, installation, source and FAQs share /projects/google-ads. The former note redirects there, including Markdown and social previews. The existing project feed identity and date are preserved. Session references include the combined piece.

- About aligns the blue 20px X and GitHub icons to the right, opposite Occasional emails and its 18px envelope on the left. The same social pair appears at the menu’s lower left, opposite contact and RSS. The footer contains only the mark and legal links. All icon targets are 48px, with accessible names and hover/focus labels. No redundant outbound arrows.

## Verification

- Motion lifecycle regression checks pass: ordinary navigation, no replay on history or filters, one-time off-screen artwork reveals, immediate settling on input, reduced-motion changes and cleanup on pagehide/unmount. These use browser doubles; they do not claim physical-device motion testing.
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
