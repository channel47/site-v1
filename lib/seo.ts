import type { Metadata } from "next"
import { ASSET_DIRS, type Asset, type Post } from "@/lib/content"

/**
 * Entity foundation + JSON-LD builders (docs/AI-SEO.md, Layer 1).
 *
 * Search engines and answer engines both reason about entities. This module
 * is the single source of truth for the site's entity graph: one canonical
 * org, one canonical person, one canonical positioning string, referenced by
 * stable `@id` anchors so every page contributes to ONE connected graph
 * instead of disconnected blobs.
 *
 * Rules the builders enforce:
 * - Descriptions come straight from content frontmatter, so the meta
 *   description, the schema description, and the visible intro stay the same
 *   string (triple consistency — extractors lift what they can corroborate).
 * - Dates are the real frontmatter dates. Never fake freshness.
 * - `sameAs` lists only confirmed profiles — never guess a URL.
 */

export const SITE_URL = "https://channel47.dev"

/** Canonical brand string — lowercase, matches the site design rule
 * ("channel47" everywhere) and drives every page title, OG tag, and schema
 * `name` field. Historical capitalized spellings live only in `alternateName`
 * below, so entity matching still works for engines that know the brand
 * that way. */
export const SITE_NAME = "channel47"

/** The canonical positioning string: homepage meta description, WebSite/Org
 * schema description, and the llms.txt blockquote. One string, everywhere. */
export const SITE_DESCRIPTION =
  "Open-source skills and MCP connectors for marketers, plus workshops hosted inside Vibe Marketers."

export const AUTHOR_NAME = "Jackson Dean"

/** Confirmed off-site profiles for the org (entity merging via sameAs). */
const ORG_SAME_AS = ["https://github.com/channel47"]

// Stable @id anchors — reference these, never duplicate node contents.
export const ORG_ID = `${SITE_URL}#organization`
export const WEBSITE_ID = `${SITE_URL}#website`
export const PERSON_ID = `${SITE_URL}#jackson-dean`

/** Compact reference nodes for use inside per-page blocks. */
const orgRef = { "@id": ORG_ID }
const personRef = { "@id": PERSON_ID }

/**
 * The three-node base graph (Organization + WebSite + Person), rendered
 * site-wide from the root layout. The person is the authority anchor —
 * content is attributed to a named human, not a faceless brand.
 */
export function baseGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        alternateName: ["Channel 47", "Channel47"],
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: `${SITE_URL}/icon.svg`,
        sameAs: ORG_SAME_AS,
        founder: personRef,
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: AUTHOR_NAME,
        url: `${SITE_URL}/about`,
        description:
          "Media buyer and Vibe Marketers mentor who publishes open-source marketing skills and MCP connectors at channel47.",
        worksFor: orgRef,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: orgRef,
        creator: personRef,
      },
    ],
  }
}

/** BreadcrumbList for a page nested under one section. */
function breadcrumb(pageUrl: string, section: { name: string; url: string }, name: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: section.name, item: section.url },
      { "@type": "ListItem", position: 3, name, item: pageUrl },
    ],
  }
}

/** Per-post graph: BlogPosting + breadcrumb, anchored to the base entities. */
export function postGraph(post: Post) {
  const url = `${SITE_URL}/posts/${post.slug}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: post.title,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        description: post.description,
        author: personRef,
        publisher: orgRef,
        datePublished: post.date,
        dateModified: post.date,
        isAccessibleForFree: true,
        keywords: post.tags.join(", "),
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumb(url, { name: "Posts", url: `${SITE_URL}/browse?type=posts` }, post.title),
    ],
  }
}

/** Per-asset graph: the skill/connector as SoftwareSourceCode + breadcrumb.
 * SoftwareSourceCode is the honest type — these are installable source
 * artifacts living in a repo, not hosted applications. */
export function assetGraph(asset: Asset) {
  const path = ASSET_DIRS[asset.type]
  const section =
    asset.type === "skill"
      ? { path, name: "Skills", indexUrl: `${SITE_URL}/browse?type=skills` }
      : { path, name: "Connectors", indexUrl: `${SITE_URL}/browse?type=connectors` }
  const url = `${SITE_URL}/${section.path}/${asset.slug}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#code`,
        name: asset.title,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        description: asset.description,
        codeRepository: asset.repo,
        author: personRef,
        publisher: orgRef,
        dateModified: asset.date,
        isAccessibleForFree: true,
        keywords: asset.tags.join(", "),
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumb(url, { name: section.name, url: section.indexUrl }, asset.title),
    ],
  }
}

/** Serialize a JSON-LD object for a <script type="application/ld+json">.
 * `<` is escaped so content strings can never close the script tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

/** Shared `generateMetadata` shape for simple content routes and static
 * utility pages — pass just the unique title fragment; the root layout's
 * `title.template` appends " — {SITE_NAME}". Centralizing here means every
 * route gets `alternates.canonical` and a matching `openGraph` block by
 * construction instead of by remembering to add them. */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
}: {
  title: string
  description: string
  path: string
  ogType?: "website" | "article"
}): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
    },
  }
}

/** Shared `generateMetadata` shape for the Skill/Connector detail routes —
 * identical except for the kind word in the title ("skill" / "MCP connector").
 * Uses `title.absolute` rather than a plain string: this suffix ("— a
 * {SITE_NAME} skill") differs from the root layout's plain "%s — {SITE_NAME}"
 * template, so it must bypass that template instead of being wrapped by it. */
export function assetMetadata(asset: Asset, kindLabel: string): Metadata {
  const path = ASSET_DIRS[asset.type]
  const canonical = `/${path}/${asset.slug}`
  return {
    title: { absolute: `${asset.title} — a ${SITE_NAME} ${kindLabel}` },
    description: asset.description,
    alternates: { canonical },
    openGraph: {
      title: asset.title,
      description: asset.description,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      type: "website",
    },
  }
}
