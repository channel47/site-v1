import type { Asset, Post } from "@/lib/content"

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

/** Canonical brand name — matches page titles; "Channel47" is the mark's spelling. */
export const SITE_NAME = "Channel 47"

/** The canonical positioning string: homepage meta description, WebSite/Org
 * schema description, and the llms.txt blockquote. One string, everywhere. */
export const SITE_DESCRIPTION =
  "Skills, connectors, and agents for marketers — built in real ad accounts by a working operator. Free to grab, live sessions monthly."

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
        alternateName: "Channel47",
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
          "Growth operator for ecommerce and DTC brands; publishes the agentic marketing systems he runs at Channel 47.",
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
  const section =
    asset.type === "skill"
      ? { path: "skills", name: "Skills", indexUrl: `${SITE_URL}/skills` }
      : {
          path: "connectors",
          name: "Connectors",
          indexUrl: `${SITE_URL}/browse?type=connectors`,
        }
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

/** ItemList for the /skills index — declares the catalog as one entity. */
export function skillsIndexGraph(skills: Asset[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/skills#list`,
    name: "Channel 47 skills",
    description:
      "Every skill in the Channel 47 library — agentic marketing systems for research, media buying, and distribution, free to install.",
    itemListElement: skills.map((skill, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: skill.title,
      url: `${SITE_URL}/skills/${skill.slug}`,
    })),
  }
}

/** Serialize a JSON-LD object for a <script type="application/ld+json">.
 * `<` is escaped so content strings can never close the script tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
