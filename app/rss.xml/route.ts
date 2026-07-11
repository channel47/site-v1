import {
  getAllPosts,
  getAssets,
  getBuilds,
  getWorkshops,
  type Asset,
  type Build,
  type Post,
  type Workshop,
} from "@/lib/content"
import { CONTENT_COLLECTION, absoluteUrl } from "@/lib/discovery"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * rss.xml — full-content feed of everything the site publishes (posts and
 * asset pages alike, newest first). RSS is the oldest machine-readable
 * surface and still feeds aggregators, newsletter tools, and AI data
 * pipelines; full content means consumers never need a second fetch.
 *
 * Workshops only join once `status: past` — an upcoming session's date is a
 * future call time, not a publish date, and its page is a pre-event
 * announcement rather than the finished recording write-up.
 */

export const dynamic = "force-static"

interface FeedEntry {
  title: string
  url: string
  description: string
  html: string
  date: string
}

function esc(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function cdata(html: string): string {
  // "]]>" inside content would close the CDATA section — split it apart.
  return `<![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`
}

function entry(item: Post | Asset | Workshop | Build, url: string): FeedEntry {
  return {
    title: item.title,
    url,
    description: item.description,
    html: item.html,
    date: item.date,
  }
}

export function GET() {
  const entries: FeedEntry[] = [
    ...getBuilds().map((b) =>
      entry(b, absoluteUrl(SITE_URL, `${CONTENT_COLLECTION.builds.basePath}/${b.slug}`)),
    ),
    ...getAllPosts().map((p) =>
      entry(p, absoluteUrl(SITE_URL, `${CONTENT_COLLECTION.posts.basePath}/${p.slug}`)),
    ),
    ...getAssets("skill").map((a) =>
      entry(a, absoluteUrl(SITE_URL, `${CONTENT_COLLECTION.skills.basePath}/${a.slug}`)),
    ),
    ...getAssets("connector").map((a) =>
      entry(
        a,
        absoluteUrl(SITE_URL, `${CONTENT_COLLECTION.connectors.basePath}/${a.slug}`),
      ),
    ),
    ...getWorkshops()
      .filter((w) => w.status === "past")
      .map((w) =>
        entry(w, absoluteUrl(SITE_URL, `${CONTENT_COLLECTION.workshops.basePath}/${w.slug}`)),
      ),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString()

  const items = entries
    .map((e) =>
      [
        "    <item>",
        `      <title>${esc(e.title)}</title>`,
        `      <link>${e.url}</link>`,
        `      <guid isPermaLink="true">${e.url}</guid>`,
        `      <pubDate>${rfc822(e.date)}</pubDate>`,
        `      <description>${esc(e.description)}</description>`,
        `      <content:encoded>${cdata(e.html)}</content:encoded>`,
        "    </item>",
      ].join("\n"),
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(entries[0]?.date ?? "2026-01-01")}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
