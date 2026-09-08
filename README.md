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
pnpm test:content
# Against a running local server:
python3 scripts/check-content-surfaces.py http://localhost:3100
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
| `newsletter/` | Kit email template, issue drafts, and source artwork; see [newsletter/README.md](newsletter/README.md) |
| `scripts/` | Project checks and maintenance tools |
| `tests/` | Local newsletter regression tests with mocked Kit API calls |

The parent `AGENTS.md` is the canonical guide for the Channel47 workspace.
Current code and published content take precedence over historical design plans.

The newsletter CLI uses Python 3. Run its local checks with:

```sh
python3 -m unittest discover -s tests -p 'test_kit_broadcast.py'
```

Pillow is only needed to regenerate the email logo. Newsletter editorial guidance
lives in [docs/newsletter-playbook.md](docs/newsletter-playbook.md); template setup
and CLI commands live in [newsletter/README.md](newsletter/README.md).

## Content and design

- Read [content/README.md](content/README.md) before authoring. Projects and Notes
  are the public sections. Source formats retain their specialized fields; old
  URLs redirect through `proxy.ts` and `next.config.mjs`.
- Preserve published asset URLs, including email images that sent newsletters
  may still load even when no current template references them.
- `app/globals.css` holds all styles and design tokens. Read its header before
  editing. Preserve hard edges, existing avatar treatments, and section colors used for interaction and selection. One strong blue accent
  sits on neutral paper and charcoal, with separate light and dark values. Hierarchy comes from
  spacing, type, and quiet surfaces rather than divider lines. The logo uses staggered pixel blocks, and content reveals gradually from blur.
  Motion uses shared timing tokens and respects reduced-motion preferences.
- The header wordmark pairs `channel` with the shared pixel `47` geometry.
  The homepage leads with the latest note, using a real image from the piece
  when available, then a selection of notes and projects. Signup follows the
  work. Social previews use the wordmark and typography; no cover is required.
- Notes align the opening and body to one reading measure, with wider media.
  Project documentation puts installation near the top. Related reading uses
  authored links and shared tags, with no generated descriptions or claims.
- Browse filters live in the URL. The navigation provider retains scroll and
  focus for a browse → piece → back journey. Rows do not animate when filtered.
- Theme colors are deliberately declared in three places: `:root`, the OS dark
  media query, and explicit `[data-theme]`. Update all three together.
- Use lowercase `channel47`. Sitewide metadata and discovery checks are described
  in [docs/AI-SEO.md](docs/AI-SEO.md).
- The shared `marked` renderer affects every content type. Images are unframed
  by default; use the markdown title `"screenshot"` for framed screenshots.

### Design references

These are references for specific decisions, not templates to reproduce:

| Reference | Adaptation |
| --- | --- |
| [Craig Mod](https://craigmod.com/) | Selected work leads the homepage |
| [Maggie Appleton](https://maggieappleton.com/) | Short observations and substantial pieces can coexist |
| [Paco Coursey](https://paco.me/) | Spacing, typography, and concise project descriptions establish hierarchy |
| [Emil Kowalski](https://emilkowal.ski/ui/you-dont-need-animations) | Purposeful motion; routine filtering does not replay entrances |
| [GOV.UK back links](https://design-system.service.gov.uk/components/back-link/) | Return to the previous results with state intact |
| [Simon Willison](https://simonwillison.net/2024/Dec/22/link-blog/) | Low-overhead publishing without a required essay or cover |
