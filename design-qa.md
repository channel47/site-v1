# 47 design and code cleanup QA

Reviewed September 9, 2026 (America/Los_Angeles). Scope: refine the existing visual direction and simplify its implementation. The four artworks, phone composition, cobalt reel and block-logo animation are retained.

## Changes

- Copy, sharing, source links, subscription feedback and FAQ controls use Phosphor icons. Social hover surfaces are circular; copy feedback keeps a stable 112px label width. Sharing remains a compact group with a 12px label gap.
- The working-session page uses one responsive offer panel and one body. It shares the site's serif headings, rectangular portrait and direction cues. Tablet layout becomes one column below 900px; phones retain the booking bar. Published duration, price, capacity and destination remain intact.
- Removed four helper files: the separate copy hook, custom social glyphs, generic disclosure wrapper and logo-animation helper. Removed unused logo/form options, redundant button branches, mobile-only biographies, unused copy and obsolete CSS aliases.
- Menu links, focus and keyboard navigation use delegated handlers. Link clicks are captured before Next Link navigation, so the exit transition completes before the route changes.
- The canonical guides describe the current controls and responsive layout. The article-diagram guide no longer assigns retired category colors to the interface.
- Phone gallery captions remain positioned above the rotated artwork. Resetting them to static positioning let the image cover the top of the first title; relative positioning preserves their stacking order and normal-flow layout.

## Verification

- Typecheck, production build (30 pages), content model, measurement and SEO checks pass.
- Server checks pass for all four pieces, Markdown twins, negotiated responses, social previews, redirects, filters, search, sitemaps, RSS, media and retired-page 404s.
- Copy page successfully copies its Markdown and changes to Copied without changing width. All four share icons are 18px. The group fits a 358px phone viewport without overflow.
- The FAQ starts with one answer open. Opening the second closes the first; Enter closes it again. Expanded state, panel IDs, aria-hidden and inert remain consistent.
- Menu Tab/arrow navigation reaches the four primary destinations. Immediately after activating Index, the original route remains while the dialog exits; the new route appears after closing. Escape restores focus to Open menu. Repeated groups remain outside the accessibility tree.
- The home mark retains six blocks and alternates its animation on replay. All four collection objects remain present.
- Invalid email input is rejected before submission; the form remains idle. No subscriber, booking or external share was created.
- Inspected desktop, phone and tablet layout geometry. Controls remain inside the viewport; responsive overrides are reset after review.
- No CSS class selectors remain without a reference in application or published-content source. Diff whitespace check passes.
- Caption fix: visually checked all four captions at 358px and the first at 388px. Text fits its caption and viewport, and the first caption paints above the overlapping image. Evidence: `output/verification/collection-caption-phone.png`.

## Visual evidence and limits

`output/verification/newsletter-cleanup-phone.png` records the current narrow-screen form. The session and article layouts were also inspected in the browser. This session's capture provider sometimes crops or repositions parts of full-page screenshots; DOM geometry and native interaction checks were recorded separately. Screenshots are not pixel-perfect references.

Reduced-motion rules retain static objects and a finite menu. Physical iPhone/Safari, hardware touch momentum and device-level preference changes were not tested. No FPS claim is made.

Canonical values: `app/tokens.css`. Component recipes: `app/globals.css`. Design rules: `docs/design-system.md`. Artwork: `docs/cover-art.md`.
