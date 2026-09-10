# 47 refinement QA

Reviewed September 9, 2026 (America/Los_Angeles). Current scope: the eleven annotated refinements to menu motion, directional cues, utility icons, newsletter bio and article endings. Changes are local and uncommitted.

## Result

Implementation, functional browser checks and automated checks pass. Pixel-level visual verification has capture limitations described below; this report does not claim measured frame rate or physical-device certification.

## Feedback resolved

| Feedback | Result |
| --- | --- |
| Menu arrow feels unresolved | Shared 48px circular direction cue, independent of the display font and perspective. It enters horizontally beside the selected word. |
| Opening feels sticky halfway | Replaced whole-dialog clipping and repeated-list blur with a separate transform-animated solid circle. Its radius matches the farthest corner. Early closing starts from the current transform and opacity. |
| Menu footer needs icons | Conversation and RSS icons with accessible names and hover/focus labels. |
| Scroll instruction feels unnecessary | Removed the instruction and down arrow. Cropped neighboring words provide the continuation cue. |
| Random monospace RSS helper | Shortened to Read via RSS, with the shared sans serif and RSS icon. |
| Bland footer signature | Replaced name text with the actual 47 geometry at 28 × 14px. |
| Repeated author identity | Removed the repeated name and three-part bio. A small rectangular portrait sits beside About Jackson. |
| Oversized next-article arrow | Fixed-size SVG cue in a separate grid column. No typographic arrow or orphan line. |
| Share icons work | Preserved the existing copy, link, X and LinkedIn controls. |
| Share label too far away | Sharing is a left-aligned group with a 24px desktop / 12px mobile gap and wrapping when needed. |
| Generic back link | Compact Collection/grid or Index/list control, preserving the original destination and focus behavior. |

## Additional corrections found during verification

- Resizing no longer resets the reel to Collection; it preserves the centered position.
- Keyboard selection scrolls the reel directly. The previous scrollIntoView behavior could also move the outer dialog by 12px. After correction, the dialog scroll position and header top remain zero during arrow-key navigation.
- The local preview server was stopped when this turn began. It was restarted on port 3174 and remains running.

## Checks performed

- Typecheck and the final production build pass (30 generated pages).
- Content model, measurement and SEO-surface checks pass.
- Server checks pass for all four canonical pieces, Markdown twins, negotiated responses, social previews, legacy redirects, browse filters, search, sitemaps, RSS identity, media and retired-page 404s.
- Both directions of native menu scrolling cross repeat boundaries. The accessibility tree exposes four destinations and two footer utilities, without repeated link groups.
- Tab and arrow keys select destinations; Enter navigates to Index. Escape and an interrupted entrance close the menu and return focus to its trigger.
- Index → article → Index returns focus to the original article link. Visible return copy is Index with a list icon; direct arrivals show Collection with a grid icon.
- Inspected actual DOM geometry at approximately 792 × 946, 388 × 843 and 358 × 746 CSS pixels. Article title/cue columns, share controls, newsletter portrait and footer fit without page overflow. The menu covers the viewport and its cue/footer targets remain inside it.
- RSS helper resolves to the shared sans-serif font. Newsletter name/tagline duplication is absent. No email was submitted and no external share was sent.
- No browser errors were recorded in the verification tab. Diff whitespace check passes.

## Visual evidence and limits

- User’s eleven annotated screenshots are the source for this refinement pass.
- `output/verification/newsletter-mobile-detail.png` shows the revised small-screen portrait, RSS helper and footer. `output/verification/menu-detail-refined.png` is diagnostic only: this session’s capture provider can resize/reposition a live scroller during full-page capture.
- Normal viewport captures were sometimes cropped into an oversized canvas; full-page captures sometimes changed layout during collection. Do not treat these as pixel-perfect references. DOM geometry and native interaction checks were recorded separately, and temporary viewport overrides were reset.
- Prior gallery comparison remains at `output/verification/comparison-refined.png`; the four artworks were not changed in this pass. Artwork provenance and standards remain in `docs/cover-art.md`.
- Reduced-motion rules were inspected in code: animations are disabled, the circle is fully open, and a finite link set replaces cyclic copies. A device-level preference toggle, hardware touch momentum and physical iPhone/Safari were not exercised.
- Motion implementation removes the expensive combined clipping/blur path; no FPS performance claim is made.

Canonical component, icon and motion guidance is in `docs/design-system.md`; values live in `app/tokens.css` and recipes in `app/globals.css`.
