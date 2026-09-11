# Search and machine-readable surfaces

This describes the current implementation. Article voice and structure follow
[the editorial guidance](../content/VOICE.md). Search metadata
should describe the work accurately without dictating how a personal story is told.

## Content inventory

`content/projects/` and `content/notes/` are the published collections.
`lib/content.ts` loads them once for pages, browse, search, feeds, and sitemaps.
`lib/discovery.ts` owns the public route and endpoint registry.

Drafts and editorial notes stay in `docs/content/`, outside published inventories.
Vellum is published at `/projects/vellum`; its former local-preview routes have
been removed.

## Metadata and structured data

`lib/seo.ts` owns entity names, canonical URLs, metadata helpers, and structured
data. The root layout adds the shared Organization, WebSite, and Person graph.
The article template adds the appropriate article or source-code graph.

Titles and descriptions come from frontmatter. Publication and substantive
revision dates retain their meanings; routine builds do not change them.
Social images use the shared renderer in `lib/og-image.tsx`.

## Machine-readable routes

| Surface | Source |
| --- | --- |
| Crawl policy | `app/robots.ts` |
| Public machine endpoint directory | `app/api/route.ts` |
| Search | `app/api/search/route.ts` |
| Curated agent map | `app/llms.txt/route.ts` |
| XML and Markdown sitemaps | `app/sitemap.ts`, `app/sitemap.md/route.ts` |
| Full-content RSS | `app/rss.xml/route.ts` |
| Markdown twins and content negotiation | `proxy.ts`, `app/md/[section]/[slug]/route.ts` |

Canonical project and note URLs support `.md` twins and `Accept: text/markdown`.
Legacy detail paths redirect to their current pieces. RSS preserves historical
identities after source moves. Published media URLs remain stable.

## Verification and measurement

Run `pnpm check:seo-surfaces` for route and metadata consistency, then
`python3 scripts/check-content-surfaces.py <local-production-origin>` for the
rendered pages and machine surfaces, including Vellum publication and the
retired preview routes.

The [July plan](archive/2026-07-ai-seo.md) is retained as historical context.
Its retired taxonomy, editorial prescriptions, and roadmap are not current requirements.

## Measurement

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
