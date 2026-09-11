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
Current code and published content take precedence over historical design plans.

The newsletter CLI uses Python 3. Run its local checks with:

```sh
python3 -m unittest discover -s tests -p 'test_kit_broadcast.py'
```

Run `pnpm brand:build` on Node 24 to regenerate the mark exports and icons.
Pillow is only needed for the historical email artwork builder. Newsletter editorial guidance
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
footer switches between light and dark with one click and a short animated reveal.
Appearance follows the device until chosen explicitly; saved preferences apply
before paint and persist locally. Reduced motion switches immediately.
Artwork keeps its original color.

The current collection has four objects representing four published pieces.
The Flow walkthrough remains inside the combined Flow-to-Codex note. Old skills, connector catalogs,
and unused workshop/post layouts have been removed. Keep published media URLs
stable, including artwork embedded in sent newsletters.

Local preview for this direction: `pnpm dev --hostname 127.0.0.1 --port 3174`.
Vellum is published at `/projects/vellum`, with its article in
`content/projects/vellum.md` and screenshots in `public/posts/vellum/`.
Revision notes and an alternate screenshot remain in `docs/content/`.
Original PNGs remain in ignored `output/vellum-sources/` on the editing machine.

The standalone study under ignored `output/object-study` is reference material;
the maintained implementation is now this Next.js app.
Superseded design reviews and strategy documents are retained in `docs/archive/`.

### Measurement

Vercel Analytics supplies page views. Statsig's free Marketplace resource
`channel47-readers` supplies custom-event reporting; Vercel's current Hobby
plan cannot query custom events. `components/site/measurement.tsx` owns the
browser lifecycle, `lib/measurement.ts` the bounded event vocabulary, and
`lib/reading-activity.ts` the reading measurements. The Statsig SDK loads after
hydration and never delays content.

| Event | Meaning |
| --- | --- |
| `content_open` | A project or note opened; one per route entry |
| `content_active` | Foreground reading reached 30, 90, 180, or 300 seconds; `active_seconds` identifies the milestone |
| `content_depth` | The viewport reached 50% or 90% of the article body; `depth` identifies the milestone |
| `content_end` | The bottom of the article body entered the viewport |
| `prompt_copy`, `code_copy` | An article prompt or code block was successfully copied |
| `related_click` | The suggested next piece was clicked; includes `target_path` |
| `repository_click` | The project's source link was clicked |
| `install_copy` | An install command was successfully copied |
| `page_copy`, `link_copy` | Markdown or the page URL was successfully copied |
| `newsletter_view` | At least half of the signup form entered the foreground viewport |
| `newsletter_submit` | A valid form submission was attempted |
| `newsletter_result` | `accepted`, `invalid`, `unavailable`, `failed`, or `network_error` |

Active time counts only while the article body intersects a visible, focused
window. It pauses after 60 seconds without scrolling, a key press, pointer
interaction, or returning to the tab. Background time and suspended timer gaps
are excluded. Milestones fire once per route entry; reaching the end does not
mean someone read or understood the article. The collection, header, install
instructions, FAQ, and signup area do not extend the article-body measure.

Events include the current `page`, first `landing_path`, a bounded `source`
and `medium`, and an optional `campaign` matching a published entry's slug.
Signup events include `placement`: `home`, `newsletter`, `article_end`, or
`workshop`. `last_content_path` identifies the most recently opened piece
during client navigation. It is context, not proof of signup causation.
Statsig also uses the article path as the event value for breakdowns.

Attribution lasts for this browser tab, through session storage with an
in-memory fallback. A tagged arrival resets it. Statsig gets a random ID held
only in memory until reload; device IDs, SDK storage, automatic URL capture,
autocapture and session replay are disabled. Events exclude email, form values,
raw referrers and arbitrary URL parameters. Do Not Track and Global Privacy
Control disable Statsig events. Nothing tracks a reader across devices or
identifies returning readers after a reload.

`newsletter_result: accepted` means the existing API accepted the request. It
does **not** mean a new subscriber, confirmed opt-in, or delivered email. Use
Kit for active/new subscriber counts and keep those numbers separate.

The Marketplace connection supplies `NEXT_PUBLIC_STATSIG_CLIENT_KEY`. Events
are enabled only on `channel47.dev` in a production build. For deliberate
verification, build with `NEXT_PUBLIC_MEASUREMENT_TEST=1`; events from local
or preview hosts are labeled `development`. Leave that variable unset during
ordinary work. No server API key is needed by the site's analytics code.

After deployment, use Statsig's Metrics Explorer with **Include Non-Production
Data** disabled (under More Actions) and break down events by article path (`value` or `metadata.page`). Compare 30- and
90-second milestones, end reaches, prompt copies, continuation clicks, and
signup views/submissions with article openings. Show counts alongside rates;
these describe article visits and actions, not unique people. Examine source
and campaign when useful, keep development checks out, and compare Kit's
subscriber change separately. For verification only, enable Include Non-Production
Data; the onboarding log stream also shows each event's environment. New
auto-generated production metrics can take up to 24 hours to appear, so do not
interpret an empty initial chart as zero traffic. Use Search Console for discovery and Vercel for
top-level page traffic. Reader replies remain necessary to judge usefulness.

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
