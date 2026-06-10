# Channel 47 Site

Astro 5 → channel47.dev via Vercel. Static output + one serverless endpoint (`api/subscribe.ts`).

**State:** Plugins-focused site. Home, plugins library + one detail page, community, studio, subscribe, 404. Link prefetching enabled (`prefetch.prefetchAll`).

## Commands

```bash
npm run dev      # localhost:4321+
npm run build
npm run preview
```

## Environment

`KIT_API_KEY` required for subscribe endpoint. `PUBLIC_GA_*` / `PUBLIC_META_*` for analytics.

## Pages

- `/` — home: hero, plugin list, community stat, studio services, subscribe signoff
- `/plugins` — filterable plugin library (8 cards; only `funnel-architect` has a detail page)
- `/plugins/funnel-architect` — plugin detail: meta strip, what's inside, sessions, install block
- `/community` — The Vibe Marketers: stats, sessions calendar (RSVPs link to Skool), member quotes
- `/studio` — client services, case studies, process, contact form
- `/subscribe` — newsletter page with issue archive (titles only — no issue pages exist)
- `/404` — "signal lost" page
- `/api/subscribe` — POST, proxies to Kit API

## Structure

```
src/
├── layouts/
│   └── BaseLayout.astro        # Root layout — meta, fonts, JSON-LD schema, skip link, html.js flag, init scripts
├── components/
│   ├── Nav.astro               # Fixed glass nav (blur + hairline). Height = --nav-h; body padding-top offsets it
│   ├── Footer.astro            # Internal links + socials, ctrlswing attribution
│   ├── LogoAnimated.astro      # Animated channel47 logo
│   └── Analytics/Analytics.astro
├── styles/
│   └── main.css                # Tailwind v4 @theme tokens, @layer components, reveal styles, keyframes
└── scripts/
    ├── scroll-reveal.ts        # IntersectionObserver scroll reveal
    ├── nav-scroll.ts           # Nav hide-on-scroll (currently inert — no .nav--hidden styles defined)
    ├── subscribe-form.ts       # Enhances [data-kit-form] forms; aria-live status announcements
    └── copy-to-clipboard.ts    # Copy button utility
```

`DESIGN.md` at repo root is the canonical design system spec.

## Subscribe API

`POST /api/subscribe` proxies to Kit. Accepts JSON or form-encoded.

- `email` (required)
- `tag` (optional) — applies a Kit tag prefixed `ch47-` (e.g., `"home"` → `ch47-home`)
- `fields` (optional) — Kit custom fields. Allowed keys: `name`, `scope`, `brief`, `budget`, `build_role`, `build_task`, `build_tool`

## CSS

Tailwind CSS v4 via `@tailwindcss/vite`. Single entry: `src/styles/main.css`.

- `@theme` block defines tokens: `bg`/`surface`/`text`/`line` scale, amber accent, font families, radius
- `@layer components` for shared patterns: `.wrap`, `.eyebrow`, `.amber`, `.btn-primary`, `.btn-ghost`, `.head-hero`, `.head-section`, `.head-mid`, `.body-lead`, `.body-mid`, `.section-pad`, `.skip-link`, `.visually-hidden`
- Body text is Geist sans; Geist Mono for code/indices. Single accent: amber `#F5B544`
- `--nav-h` (`:root`) sizes the fixed nav; `body` gets `padding-top: var(--nav-h)` and `[id]` gets matching `scroll-margin-top`
- shadcn/ui semantic tokens (`background`, `foreground`, `ring`) defined in `@theme` for React component compatibility

## Scroll Reveals

- `data-reveal` — single element, fades up when 12% visible. One-time.
- `data-reveal-stagger` (parent) + `data-reveal-child` (children) — children reveal together with per-child delay via inline `style="--stagger: n"` (capped at 5 in CSS).
- Hidden states are gated behind `html.js` (set inline in BaseLayout `<head>`) and `prefers-reduced-motion: no-preference` — content stays visible without JS or with reduced motion.
- Legacy `data-section` / `data-animate` observers still run but no page uses them.

## Schema (structured data)

`BaseLayout` accepts a `schema` prop and renders JSON-LD. Pass an object or array; arrays are wrapped in `@graph`.

## Conventions

- Guard double-init with `data-initialized` attribute
- State classes: `.is-visible`, `.is-loading`, `.is-success`, `.is-error`, `.is-server-error`
- Prefer `[data-*]` attributes over classes for JS targeting
- Vanilla JS for Astro components, React only for shadcn primitives if added back

## Gotchas

- **Gray scale is inverted** — `gray-0` is black, `gray-700` is near-white. Dark-first design.
- **`:global()` required** for cross-component ancestor selectors in scoped styles
- **Scroll reveal hides content by default** — `[data-reveal-child]` and `[data-reveal]` start at `opacity: 0`. Content only appears after IntersectionObserver fires `.is-visible`. If a section looks blank, it's the reveal system, not missing data.
- **Footer attribution** — `ctrlswing`, not `jackson`. Link: `https://x.com/ctrlswing`.
- **DataForSEO MCP available** — Use `mcp__dataforseo__*` tools for keyword research.
