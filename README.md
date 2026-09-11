# channel47

The public site at [channel47.dev](https://channel47.dev), deployed on Vercel.
Built with Next.js 16 App Router, React, TypeScript, and plain CSS. Uses pnpm.

## Start with the task

Read only the relevant guide, then inspect the files it names.

| Task | Start here |
| --- | --- |
| Draft or edit writing | [Voice](content/VOICE.md), then the specific piece and its source notes |
| Add or publish content | [Content format](content/README.md) |
| Change layout or motion | [Design system](docs/design-system.md) |
| Make collection artwork | [Cover art](docs/cover-art.md) |
| Work on discovery or analytics | [Discovery and measurement](docs/AI-SEO.md) |
| Prepare or send email | [Newsletter playbook](docs/newsletter-playbook.md); [CLI setup](newsletter/README.md) |

## Development

```sh
pnpm install
pnpm dev
```

See `.env.example` for environment variables. Workspace secrets live in the
parent `.env.local`; export only the variables this site needs, or mirror those
variables into this repo's ignored `.env.local`.

For documentation-only edits, check links and `git diff --check`. During
implementation, run checks relevant to the changed behavior. Before shipping
code or published content, run the project checks:

```sh
pnpm typecheck
pnpm check:seo-surfaces
pnpm build
pnpm test:content
pnpm test:measurement
pnpm test:motion
pnpm test:theme
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
| `lib/site-content.ts` | Shared biography, subscription and working-session copy |
| `lib/collection.ts` | Cover selection tied to real content URLs |
| `app/tokens.css` | Canonical design tokens |
| `lib/discovery.ts` | Public route and machine endpoint registry |
| `lib/seo.ts` | Canonical URL, metadata, and structured data |
| `lib/og-image.tsx` | Shared social preview renderer |
| `app/fonts/` | Self-hosted Instrument Serif and Instrument Sans, with licenses |
| `assets/fonts/` | Fonts used to generate social previews |
| `public/` | Published images, video, captions, and icons |
| `newsletter/` | Kit email template, issue drafts, and source artwork; see [newsletter/README.md](newsletter/README.md) |
| `scripts/` | Project checks and maintenance tools |
| `tests/` | Local newsletter regression tests with mocked Kit API calls |

The parent `AGENTS.md` is the canonical guide for the Channel47 workspace.
Current code defines behavior; `content/VOICE.md` defines voice. Existing articles
and drafts are not automatically approved style examples.

The newsletter CLI uses Python 3. Run its local checks with:

```sh
python3 -m unittest discover -s tests -p 'test_kit_broadcast.py'
```

Run `pnpm brand:build` on Node 24 to regenerate the mark exports and icons.
Newsletter preparation and sending instructions live in [docs/newsletter-playbook.md](docs/newsletter-playbook.md); template setup
and CLI commands live in [newsletter/README.md](newsletter/README.md).

## Working context

The published inventory comes from `content/notes/` and `content/projects/`.
Supporting editorial notes and any future unpublished drafts live in `docs/content/`.
Putting a draft into a published collection makes it public on deployment.

`docs/archive/` contains historical plans, not current instructions. It and
ignored `output/` are excluded from normal file searches; inspect them only
when the task needs history (`rg --files --no-ignore docs/archive`). Git history also
retains removed experiments. Keep published media URLs stable, including art
used in sent newsletters.

Local preview: `pnpm dev --hostname 127.0.0.1 --port 3174`.

### Measurement

See [discovery and measurement](docs/AI-SEO.md#measurement) for analytics setup,
event meanings, attribution, privacy, and verification. Search Console scripts
live in the parent workspace.

### Prepare sharing material

```sh
pnpm share:pack /notes/codex-static-ads-google-flow
python3 scripts/kit-broadcast.py render output/sharing/notes/codex-static-ads-google-flow/newsletter.html --output output/sharing/notes/codex-static-ads-google-flow/newsletter-preview.html
```

The first command creates `share.md` and `newsletter.html` under ignored
`output/sharing/`. It reuses the published title, description, opening
paragraphs, and a real image reference when one exists. It supplies tagged
links for X, LinkedIn, GitHub, and email, using the entry slug as the campaign.
The site's X and LinkedIn share buttons use the same tagged-link convention;
the generic copy-link button retains the canonical URL.
Existing review files are protected; pass `--force` only to replace them.
No command in this preparation step posts, uploads, creates a Kit broadcast,
or sends anything. Follow the newsletter playbook for review and sending.
