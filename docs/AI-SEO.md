# Search and machine-readable surfaces

This describes the current implementation. Article voice and structure follow
[the editorial guidance](../content/README.md#direct-language). Search metadata
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

The [README measurement section](../README.md#measurement) describes Vercel
Analytics, Statsig reading events, and their limits. The parent workspace has
the Search Console reporting scripts. These facilities measure discovery and
reading behavior; they do not guarantee search placement or AI citations.

The [July plan](archive/2026-07-ai-seo.md) is retained as historical context.
Its retired taxonomy, editorial prescriptions, and roadmap are not current requirements.
