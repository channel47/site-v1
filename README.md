# channel47

The public site at [channel47.dev](https://channel47.dev), deployed on Vercel.
Built with Next.js 16 App Router, React, TypeScript, and plain CSS. Uses pnpm.

## Development

```sh
pnpm install
pnpm dev
```

See `.env.example` for environment variables. Workspace secrets live in the
parent `.env.local`; export only the variables this site needs, or mirror those
variables into this repo's ignored `.env.local`.

Run the project checks before shipping changes:

```sh
pnpm typecheck
pnpm check:seo-surfaces
pnpm build
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/` | Pages, route handlers, and global styles |
| `components/site/` | Shared navigation, content templates, controls, and logo |
| `content/` | Published markdown and frontmatter; see [content/README.md](content/README.md) |
| `lib/content.ts` | Build-time content loading and shared markdown rendering |
| `lib/site-content.ts` | Sitewide copy, navigation, and content identity |
| `lib/discovery.ts` | Public route and machine endpoint registry |
| `lib/seo.ts` | Canonical URL, metadata, and structured data |
| `lib/og-image.tsx` | Shared social preview renderer |
| `assets/fonts/` | Fonts used to generate social previews |
| `public/` | Published images, video, captions, and icons |
| `scripts/` | Project checks and maintenance tools |

The parent `AGENTS.md` is the canonical guide for the Channel47 workspace.
Current code and published content take precedence over historical design plans.

## Content and design

- Read [content/README.md](content/README.md) before authoring. Notes, skills,
  connectors, and workshops currently have published content. Post routes remain
  available for future content; redirects for retired post URLs live in
  `next.config.mjs`.
- Preserve published asset URLs, including email images that sent newsletters
  may still load even when no current template references them.
- `app/globals.css` holds all styles and design tokens. Read its header before
  editing. Preserve hard edges, existing avatar treatments, and content colors
  used for interaction and selection.
- Theme colors are deliberately declared in three places: `:root`, the OS dark
  media query, and explicit `[data-theme]`. Update all three together.
- Use lowercase `channel47`. Sitewide metadata and discovery checks are described
  in [docs/AI-SEO.md](docs/AI-SEO.md).
- The shared `marked` renderer affects every content type. Images are unframed
  by default; use the markdown title `"screenshot"` for framed screenshots.
