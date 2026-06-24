# Design source of truth

The channel47 pages are **designed in Claude Design**, exported here as `*.dc.html`,
and compiled into the Next app. We do **not** hand-edit the page bodies in React —
edit the design, re-export, and re-run the build script.

## The pipeline

```
Claude Design  →  design-import/<Page>.dc.html  →  scripts/build-<page>.mjs  →  app/<route>/<page>-content.tsx
                                                                                 (+ <page>-runtime.tsx, hand-ported behaviors)
```

- `*-content.tsx` is **auto-generated** (inline CSS + HTML via `dangerouslySetInnerHTML`,
  server-rendered and crawlable). Never hand-edit it — re-run the script.
- `*-runtime.tsx` is a hand-maintained 1:1 port of the design's `support.js`
  (hover/focus styling, scroll-reveal, carousels, the booking modal, form posts).
- Shared transform logic lives in `scripts/lib/dc-build.mjs`; each `build-<page>.mjs`
  is a thin per-page config.

## Current pages

| Export | Build script | Route |
|---|---|---|
| `Advertorials on Tap.dc.html` | `build-advertorial.mjs` | `/` (the offer = the home) |
| `Vibe Members.dc.html` | `build-vibe.mjs` | `/vibe` (community side door → funnels to `/`) |

`Book a Call.dc.html` is **not** imported — booking CTAs are wired straight to
`https://cal.com/ctrlswing/15min` by the build scripts.

## Canonical design system (LOCKED)

The dark/lime/Space system is the one and only direction. Don't introduce another.

| Token | Value | Role |
|---|---|---|
| Background | `#0b0b0c` | page bg |
| Ink | `#f4f4ef` | primary text |
| Accent | `#cdfb45` | lime — CTAs, highlights, selection |
| Accent (bright) | `#dbff6e` | lime hover/emphasis |
| Muted | `#9d9d97` / `#74746e` | secondary text |
| Hairline | `#c8c8c2` (low alpha) | borders |
| Display / body font | Space Grotesk (`--font-space-grotesk`) | via `next/font` |
| Mono font | Space Mono (`--font-space-mono`) | via `next/font` |

Fonts are provided by `next/font` in `app/layout.tsx`. The build scripts pin the
design's hard-coded font families to those CSS variables so exports always render
in the canonical type system regardless of what the design file declares.

## Archived directions

`../archive/` holds an earlier **editorial** exploration (paper/ink, serif type) that
was **not** adopted. It is kept for reference only and is not wired into the app.
