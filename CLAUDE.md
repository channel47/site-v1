# Channel 47 Site

Astro 5 → channel47.dev via Vercel. Static output + one serverless endpoint (`api/subscribe.ts`).

## Commands

```bash
npm run dev      # localhost:4321+
npm run build
npm run preview  # Preview build output locally
npm test         # node --test
```

Tests use `node:test` (no framework). Test files in `tests/`.

## Strategy Docs

- `.claude/product-marketing-context.md` — single source of truth for positioning, competitive landscape, audience, differentiation, messaging, voice, proof points, metrics

## Environment

`KIT_API_KEY` required for subscribe endpoint. `PUBLIC_GA_*` / `PUBLIC_META_*` for analytics.

## Plugins (current state)

Three live plugins, one deprecated:

| Plugin | Status | Skills | Content file |
|--------|--------|-------:|-------------|
| google-ads | Live v1.0.0 | 9 | `src/content/tools/plugins/google-ads.md` |
| microsoft-ads | Live v1.0.0 | 8 | `src/content/tools/plugins/microsoft-ads.md` |
| meta-ads | Live v1.0.0 | 9 + 2 agents | `src/content/tools/plugins/meta-ads.md` |
| paid-search | Deprecated (frozen v7.0.0) | 6 | `src/content/tools/plugins/paid-search.md` |
| frontend-craft | Not marketed | — | `src/content/tools/plugins/frontend-craft.md` |

Install command format: `claude plugin install google-ads@channel47` (NOT the old `/plugin install` or `/plugin marketplace add` format).

## Pages

- `/` — Homepage: AI plugins for media buyers (hero + proof bar + plugin directory + credibility + workshop + FAQ + rupture + product callout + CTA)
- `/plugins/` — Plugins hub — filtered listing of featured plugins (excludes deprecated/unmarketable). Targets "claude code plugins", "claude plugin marketplace"
- `/plugins/[slug]` — Plugin detail page with rendered markdown body, schema (SoftwareApplication + BreadcrumbList + HowTo)
- `/guides/` — Guides hub — SEO content hub for practitioner guides. Targets "google ads ai tool", "ai ppc management"
- `/guides/[slug]` — Individual guide articles (Article + BreadcrumbList schema). Categories: setup, workflow, comparison, overview
- `/notes` — Build Notes hub (content collection index, newsletter community content)
- `/notes/[slug]` — Individual note articles (Article + BreadcrumbList schema)
- `/labs` — Skills Labs landing page (monthly live builds → Skool community)
- `/subscribe` — Email signup standalone page
- `/privacy` — Privacy policy
- `/coming-soon` — Shared empty state with email signup
- `/skills/` — 301 redirect to `/plugins`
- `/skills/[slug]` — Skill detail page (legacy, still live for direct links, excluded from sitemap)
- `/mcps/` — 301 redirect to `/plugins`
- `/mcps/[slug]` — MCP detail page (legacy, still live for direct links, excluded from sitemap)
- `/build`, `/tools`, `/ecosystem`, `/hire` — 301 redirects to `/`
- `/api/subscribe` — POST, proxies to Kit API

## Content Sections

| Section | Purpose | SEO role |
|---------|---------|----------|
| `/plugins/` | Product hub — the plugins | Targets "claude code plugins", "claude plugin marketplace" |
| `/guides/` | SEO content hub — keyword-targeted how-to guides | Captures search intent: setup, workflows, comparisons |
| `/notes/` | Community content — Build Notes newsletter | Community/newsletter, not SEO-optimized |

### Guides content collection

Guides live in `src/content/guides/`. Schema: title, description, date, updated, category (setup/workflow/comparison/overview), plugin (optional related plugin slug), featured, draft. Guide detail pages reuse the article layout pattern from notes with reading progress bar.

**Phase 1 guides (live):**
- `claude-for-ppc.md` — Pillar page. Targets "claude for google ads", "ai ppc management"
- `connect-google-ads-to-claude.md` — Setup guide. Targets "connect google ads to claude", "google ads mcp claude"
- `morning-brief-workflow.md` — Workflow guide. Targets "google ads morning brief"

**Phase 2 guides (planned):**
- `waste-detection-google-ads.md` — Workflow guide
- `search-term-analysis.md` — Workflow guide
- `claude-prompts-google-ads.md` — Competes with Adspirer's blog post (they rank #16)
- `connect-meta-ads-to-claude.md` — Setup guide
- `connect-microsoft-ads-to-claude.md` — Setup guide

**Phase 3 guides (planned):**
- `best-ai-tools-google-ads.md` — Listicle/comparison
- `ai-ppc-management.md` — Broad category guide

## Navigation

Header: Plugins · Guides · Notes · Labs · Subscribe
Footer: Plugins · Guides · Notes · Labs · Privacy · jackson attribution

## Sitemap

16 URLs in sitemap. Excluded via `astro.config.mjs` filter: `/skills/*`, `/mcps/*`, `/tools/*`, `/plugins/paid-search`, `/plugins/frontend-craft`, `/coming-soon`, redirect pages.

## Key Files

```
src/
├── layouts/
│   └── BaseLayout.astro          # Root layout (meta, fonts, schema, scroll reveal)
├── pages/
│   ├── index.astro               # Homepage
│   ├── plugins/index.astro       # Plugins hub — filtered listing (featured only)
│   ├── plugins/[slug].astro      # Plugin detail (renders Content via slot)
│   ├── guides/index.astro        # Guides hub — SEO content listing
│   ├── guides/[...slug].astro    # Guide detail (article layout with reading progress)
│   ├── skills/[slug].astro       # Skill detail (legacy, renders Content via slot)
│   ├── mcps/[slug].astro         # MCP detail (legacy, renders Content via slot)
│   ├── notes/index.astro         # Build Notes hub
│   ├── notes/[...slug].astro     # Article page
│   ├── labs.astro                # Skills Labs
│   ├── subscribe.astro           # Email signup
│   ├── privacy.astro             # Privacy policy
│   ├── coming-soon.astro         # Empty state
│   └── api/subscribe.ts          # Kit API proxy (serverless)
├── components/
│   ├── Nav.astro                 # Fixed glass nav (Plugins · Guides · Notes · Labs · Subscribe)
│   ├── Footer.astro              # Plugins · Guides · Notes · Labs · Privacy + attribution
│   ├── Breadcrumbs.astro         # Breadcrumb navigation
│   ├── EmailSignup.astro         # Email capture form (JS state handling)
│   ├── ContentCard.astro         # Note card for grid
│   ├── ToolCard.astro            # Full-width tool row
│   ├── ToolDetail.astro          # Tool detail layout with slot for markdown body + prose styles
│   ├── ProductCallout.astro      # PaidBrief callout card
│   ├── LogoAnimated.astro        # Animated channel47 logo
│   ├── ui/button.tsx             # shadcn/ui Button (React)
│   └── ui/input.tsx              # shadcn/ui Input (React)
├── content/
│   ├── guides/                   # Practitioner guides (markdown, `guides` collection — SEO content)
│   ├── notes/                    # Published notes (markdown, `notes` collection — newsletter content)
│   ├── tools/                    # Tool registry (markdown with YAML frontmatter, `tools` collection)
│   │   ├── plugins/              # google-ads, microsoft-ads, meta-ads, paid-search, frontend-craft
│   │   ├── skills/               # morning-brief, waste-detector, search-term-verdict, pmax-decoder, platform-setup, gaql
│   │   └── mcps/                 # google-ads-mcp, bing-ads-mcp
│   └── newsletters/              # Newsletter drafts (markdown)
├── styles/
│   └── main.css                  # Tailwind v4 @theme tokens, @layer components, keyframes
└── scripts/
    ├── scroll-reveal.ts          # IntersectionObserver scroll reveal
    ├── nav-scroll.ts             # Nav hide-on-scroll behavior
    └── copy-to-clipboard.ts      # Copy button utility
```

## Schema (structured data)

BaseLayout accepts a `schema` prop → renders JSON-LD. Currently deployed:
- **Homepage**: Organization + WebSite + FAQPage
- **Plugin detail pages**: SoftwareApplication + BreadcrumbList + HowTo
- **Plugins hub**: BreadcrumbList + ItemList
- **Guides hub**: BreadcrumbList + ItemList
- **Guide articles**: Article + BreadcrumbList
- **Notes articles**: Article + BreadcrumbList

## Subscribe API

`POST /api/subscribe` proxies to Kit. Accepts JSON or form-encoded.

- `email` (required) — subscriber email
- `tag` (optional) — applies a Kit tag prefixed `ch47-` (e.g., `"home"` → `ch47-home`)
- `fields` (optional) — custom Kit fields. Allowed keys: `name`, `scope`, `brief`, `budget`, `build_role`, `build_task`, `build_tool`

## CSS

Tailwind CSS v4 via `@tailwindcss/vite`. Single entry point: `src/styles/main.css`.

- `@theme` block defines the design token system: warm gray scale, amber accent, font families, radius, animations
- `@layer components` for shared patterns: `.label`, `.wrap`, `.prose`, `.hero`, `.stats`, `.cta`, `.accent-bar`
- Scoped `<style>` blocks for component-specific CSS (animation triggers, JS state classes, `:global()` overrides)
- Body text is JetBrains Mono (mono-first is intentional). Single accent: amber `#F59E0B`
- shadcn/ui semantic tokens (`background`, `foreground`, `ring`, etc.) defined in `@theme` for React component compatibility

## Scroll Reveals (two layers)

1. **Section-level**: `data-section="name"` + IO (threshold 0.15). Adds `.is-visible`. Hero gets it immediately via JS, not IO.
2. **Element-level**: `BaseLayout` observes `[data-animate]` (threshold 0.1). One-time trigger. Stagger with `data-stagger="1..6"`.

## Component Conventions

- Guard double-init with `data-initialized` attribute
- State classes: `.is-visible`, `.is-loading`, `.is-success`, `.is-error`, `.is-server-error`
- Prefer `[data-*]` attributes over classes for JS targeting
- Vanilla JS for Astro components, React for shadcn/ui components
- ToolDetail uses a `<slot />` for markdown body content — pass `<Content />` from the page

## Gotchas

- **`:global()` required** for cross-component ancestor selectors in scoped styles
- **Newsletter content** lives in `src/content/newsletters/` as markdown with frontmatter (`title`, `date`, `status`, `kit_broadcast_id`)
- **Gray scale is inverted** — `gray-0` is black, `gray-700` is near-white. Dark-first design.
- **Plugin filtering** — Plugins hub and homepage filter by `featured: true` to hide deprecated/unmarketable plugins. Set `featured: false` to hide from listings.
- **Install command format changed** — Old: `/plugin install paid-search@channel47`. New: `claude plugin install google-ads@channel47`. Don't use the old format.
- **paid-search is deprecated** — Frozen at v7.0.0, `featured: false`, excluded from sitemap. Use google-ads + microsoft-ads instead.
- **Tool content bodies** — Markdown body in tool .md files renders on detail pages via ToolDetail slot. Skills with no body render an empty (hidden) prose div.
- **Guide and note detail pages share duplicated article styles** — `.article-hero`, `.article-prose`, `.article-signup` CSS is duplicated in `guides/[...slug].astro` and `notes/[...slug].astro`. Update both when changing article layout styles.
- **Sitemap auto-includes new directories** — New page directories (e.g., `/guides/`, `/compare/`) are included in the sitemap automatically. Only add to `astro.config.mjs` filter to *exclude* pages.
- **DataForSEO MCP available** — Use `mcp__dataforseo__*` tools for keyword research, competitor ranked keywords, keyword difficulty, and domain analysis. No API key setup needed — it's preconfigured.
