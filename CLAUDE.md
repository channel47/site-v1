# Channel 47 Site

Astro 5 → channel47.dev via Vercel. Static output + one serverless endpoint (`api/subscribe.ts`).

**State:** Fresh slate. Pages were nuked May 2026 to start over. Design system is intact.

## Commands

```bash
npm run dev      # localhost:4321+
npm run build
npm run preview
```

## Environment

`KIT_API_KEY` required for subscribe endpoint. `PUBLIC_GA_*` / `PUBLIC_META_*` for analytics.

## Pages

- `/` — placeholder index
- `/api/subscribe` — POST, proxies to Kit API (preserved)

That's it. Add new pages under `src/pages/`.

## Design System (the part that survived)

```
src/
├── layouts/
│   └── BaseLayout.astro        # Root layout — meta, fonts, schema, scroll reveal
├── components/
│   ├── Nav.astro               # Logo-only fixed nav (links stripped, add back as routes ship)
│   ├── Footer.astro            # ctrlswing attribution (links stripped)
│   ├── EmailSignup.astro       # 3 variants — inline / default / prominent. Posts to /api/subscribe
│   ├── LogoAnimated.astro      # Animated channel47 logo
│   └── Analytics/Analytics.astro
├── styles/
│   └── main.css                # Tailwind v4 @theme tokens, @layer components, keyframes
└── scripts/
    ├── scroll-reveal.ts        # IntersectionObserver scroll reveal
    ├── nav-scroll.ts           # Nav hide-on-scroll
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

- `@theme` block defines tokens: warm gray scale, amber accent, font families, radius, animations
- `@layer components` for shared patterns: `.label`, `.wrap`, `.prose`, `.hero`, `.stats`, `.cta`, `.accent-bar`
- Body text is JetBrains Mono. Single accent: amber `#F59E0B`
- shadcn/ui semantic tokens (`background`, `foreground`, `ring`, etc.) defined in `@theme` for React component compatibility

## Scroll Reveals (two layers)

1. **Section-level**: `data-section="name"` + IO (threshold 0.15). Adds `.is-visible`.
2. **Element-level**: `BaseLayout` observes `[data-animate]` (threshold 0.1). One-time. Stagger with `data-stagger="1..6"`.

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
