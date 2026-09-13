import { getContentEntries, type Note } from "@/lib/content"
import { absoluteUrl } from "@/lib/discovery"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/** Full-content RSS from the canonical inventory. Historical source paths
 * remain stable GUIDs after migration, so existing pieces are not re-sent. */

export const dynamic = "force-static"

interface FeedEntry {
  title: string
  url: string
  guid?: string
  description: string
  html: string
  date: string
  updated?: string
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

function attr(text: string): string {
  return esc(text).replaceAll('"', "&quot;")
}

function noteVideoHtml(note: Note): string {
  if (!note.video) return ""

  const src = absoluteUrl(SITE_URL, note.video.src)
  const poster = absoluteUrl(SITE_URL, note.video.poster)
  const captions = absoluteUrl(SITE_URL, note.video.captions)
  const caption = note.video.caption
    ? `<figcaption>${esc(note.video.caption)}</figcaption>`
    : ""

  return [
    "<figure>",
    `<video controls playsinline preload="metadata" poster="${attr(poster)}">`,
    `<source src="${attr(src)}" type="video/mp4">`,
    `<track src="${attr(captions)}" kind="captions" srclang="en" label="English">`,
    `<p><a href="${attr(src)}">Open the walkthrough.</a></p>`,
    "</video>",
    caption,
    "</figure>",
  ].join("")
}

function entry(item: Note, url: string): FeedEntry {
  return {
    title: item.title,
    url,
    description: item.description,
    html: item.html,
    date: item.date,
    updated: item.updated,
  }
}

function noteEntry(note: Note, url: string): FeedEntry {
  const base = entry(note, url)
  return { ...base, html: `${noteVideoHtml(note)}${base.html}` }
}

export function GET() {
  const entries: FeedEntry[] = getContentEntries()
    .map(({ collection, item }) => {
      const url = absoluteUrl(SITE_URL, `${collection.basePath}/${item.slug}`)
      const result = "video" in item ? noteEntry(item, url) : entry(item, url)
      // Keep historical RSS identity so URL consolidation does not republish old entries.
      return { ...result, guid: item.rssId ? absoluteUrl(SITE_URL, item.rssId) : `${SITE_URL}/${collection.key}/${item.slug}` }
    })
    // A retrospective's story date must not reorder publication in feed readers.
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "en") || a.url.localeCompare(b.url, "en"))

  const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString()
  const lastBuildDate = entries.reduce((latest, item) => {
    const modified = item.updated ?? item.date
    return modified > latest ? modified : latest
  }, entries[0]?.date ?? "2026-01-01")

  const items = entries
    .map((e) =>
      [
        "    <item>",
        `      <title>${esc(e.title)}</title>`,
        `      <link>${e.url}</link>`,
        `      <guid isPermaLink="true">${e.guid ?? e.url}</guid>`,
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
    <lastBuildDate>${rfc822(lastBuildDate)}</lastBuildDate>
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
