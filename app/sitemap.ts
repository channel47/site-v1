import type { MetadataRoute } from "next"
import { getAllPosts, getAssets, getBuilds, getWorkshops } from "@/lib/content"
import { PUBLIC_PAGES, absoluteUrl } from "@/lib/discovery"
import { SITE_URL } from "@/lib/seo"

/**
 * sitemap.xml — every canonical, indexable URL with REAL lastmod values
 * (content pages use their frontmatter date; list pages use the date of the
 * newest item they show). Fake or always-today lastmod trains crawlers to
 * ignore the field, so evergreen pages simply omit it.
 *
 * Submit to Google Search Console AND Bing Webmaster Tools — Bing feeds
 * ChatGPT search, so it matters beyond its own market share.
 */

function latestDate(dates: string[]): string | undefined {
  return dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : undefined
}

export default function sitemap(): MetadataRoute.Sitemap {
  const builds = getBuilds()
  const posts = getAllPosts()
  const skills = getAssets("skill")
  const connectors = getAssets("connector")
  const workshops = getWorkshops()
  const newest = latestDate(
    [...builds, ...posts, ...skills, ...connectors, ...workshops].map((i) => i.date),
  )

  return [
    ...PUBLIC_PAGES.map((page) => ({
      url: absoluteUrl(SITE_URL, page.path),
      lastModified:
        "lastModified" in page && page.lastModified === "content"
          ? newest
          : undefined,
    })),
    ...builds.map((b) => ({
      url: `${SITE_URL}/builds/${b.slug}`,
      lastModified: b.date,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/posts/${p.slug}`,
      lastModified: p.date,
    })),
    ...skills.map((a) => ({
      url: `${SITE_URL}/skills/${a.slug}`,
      lastModified: a.date,
    })),
    ...connectors.map((a) => ({
      url: `${SITE_URL}/connectors/${a.slug}`,
      lastModified: a.date,
    })),
    ...workshops.map((w) => ({
      url: `${SITE_URL}/workshops/${w.slug}`,
      lastModified: w.date,
    })),
  ]
}
