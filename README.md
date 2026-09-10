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
pnpm test:measurement
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
Current code and published content take precedence over historical design plans.

The newsletter CLI uses Python 3. Run its local checks with:

```sh
python3 -m unittest discover -s tests -p 'test_kit_broadcast.py'
```

Pillow is only needed to regenerate the email logo. Newsletter editorial guidance
lives in [docs/newsletter-playbook.md](docs/newsletter-playbook.md); template setup
and CLI commands live in [newsletter/README.md](newsletter/README.md).

## Content and design

The home page is an object collection. The visible mark is the geometric 47;
article and project pages share one reading layout. Read these canonical guides:

- [Design system](docs/design-system.md): tokens, layout, components, states and verification.
- [Cover art](docs/cover-art.md): how to select or generate coherent, compelling objects.
- [Content](content/README.md): the two source collections and publishing fields.

`app/tokens.css` owns colors, type, spacing and motion; `app/globals.css` owns
component recipes. `lib/collection.ts` maps covers to published pieces. The
interface uses one light paper surface; the artwork supplies its color.

The current collection has four square objects representing four published pieces.
The Flow walkthrough remains inside its note. Old skills, connector catalogs,
and unused workshop/post layouts have been removed. Keep published media URLs
stable, including artwork embedded in sent newsletters.

Local preview for this direction: `pnpm dev --hostname 127.0.0.1 --port 3174`.
The standalone study under ignored `output/object-study` is reference material;
the maintained implementation is now this Next.js app.

### Measurement

`components/site/measurement.tsx` uses the existing Vercel Analytics SDK.
`lib/measurement.ts` owns the attribution and sharing vocabulary. No additional
analytics provider or database is required.

| Event | Meaning |
| --- | --- |
| `content_open` | A project or note opened; one per route entry |
| `related_click` | The suggested next piece was clicked; includes `target_path` |
| `repository_click` | The project's source link was clicked |
| `install_copy` | An install command was successfully copied |
| `page_copy`, `link_copy` | Markdown or the page URL was successfully copied |
| `newsletter_submit` | A valid form submission was attempted |
| `newsletter_result` | `accepted`, `invalid`, `unavailable`, `failed`, or `network_error` |

Events include the current `page`, first `landing_path`, a bounded `source`
and `medium`, and an optional `campaign` matching a published entry's slug.
Signup events include `placement`: `home`, `newsletter`, `article_end`, or
`workshop`. `last_content_path` identifies the most recently opened piece
during client navigation, including when the reader continues to `/newsletter`.
It is context, not proof that a particular article caused a signup.

Attribution lasts for this browser tab, through session storage with an
in-memory fallback when storage is denied. A tagged arrival resets it. There
is no visitor ID or cross-device identity. Event URLs have query strings and
fragments removed; properties exclude email, form values, raw referrers, and
unrecognized campaign values. Content openings are deduplicated for repeated
effects, but a return visit to a page counts as another opening.

`newsletter_result: accepted` means the existing API accepted the request. It
does **not** mean a new subscriber, confirmed opt-in, or a delivered email.
Use Kit for active/new subscriber counts. Confirmation-level source attribution
would require a separately verified provider workflow; it is not implemented
by these browser events. Do not add acceptance events to historical
`newsletter_subscribe: success` events as though they were new people.

After deployment, establish a 28-day baseline in Vercel Analytics: traffic by
source, content openings, related clicks, successful command copies, and signup
attempts/results by placement. Report underlying event counts with any ratios;
these are actions, not deduplicated readers or verified software installs.
Compare the corresponding Kit subscriber change separately. Local SDK debug
output and mocked tests do not represent production visitors.

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
