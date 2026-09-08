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
