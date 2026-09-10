import type { MetadataRoute } from "next"
import { getFeedItems } from "@/lib/content"
import { PUBLIC_PAGES, absoluteUrl } from "@/lib/discovery"
import { SITE_URL } from "@/lib/seo"

/**
 * sitemap.xml — every canonical, indexable URL with REAL lastmod values
 * (content pages use the recorded revision or publication date; list pages
 * use the most recent change to an item they show). Fake lastmod trains crawlers to
 * ignore the field, so evergreen pages simply omit it.
 *
 * Submit to Google Search Console AND Bing Webmaster Tools — Bing feeds
 * ChatGPT search, so it matters beyond its own market share.
 */

function latestDate(dates: string[]): string | undefined {
  return dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : undefined
}

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getFeedItems()
  const newest = latestDate(items.map((item) => item.updated ?? item.date))

  return [
    ...PUBLIC_PAGES.map((page) => ({
      url: absoluteUrl(SITE_URL, page.path),
      lastModified:
        "lastModified" in page && page.lastModified === "content"
          ? newest
          : undefined,
    })),
    ...items.map((item) => ({ url: `${SITE_URL}${item.href}`, lastModified: item.updated ?? item.date })),
  ]
}
