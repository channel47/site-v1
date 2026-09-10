import { Marked, marked } from "marked"
import { getContentEntries, getEntryPreview } from "./content"
import { SHARE_CHANNELS, taggedShareUrl, type ShareChannel } from "./measurement"

const ORIGIN = "https://channel47.dev"
const field = (text: string) => text.replace(/[\r\n]+/g, " ").trim()
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Email excerpts reuse authored paragraphs, with absolute links and no site
 * layout, generated claims, or synthesized author voice. */
const emailMarkdown = new Marked({ renderer: {
  link({ href, tokens }) {
    const url = new URL(href, ORIGIN)
    const label = this.parser.parseInline(tokens)
    return /^https?:$/.test(url.protocol) ? `<a href="${escape(url.href)}" style="color:#161718;text-decoration:underline;">${label}</a>` : label
  },
} })

export function buildSharePack(href: string) {
  const entry = getContentEntries().find(({ collection, item }) => `${collection.basePath}/${item.slug}` === href)
  if (!entry) throw new Error(`No published entry at ${href}. Use a canonical /notes/… or /projects/… path.`)
  const { item, collection } = entry
  const links = Object.fromEntries((Object.keys(SHARE_CHANNELS) as ShareChannel[]).map((channel) => [channel, taggedShareUrl(href, channel)])) as Record<ShareChannel, string>
  const preview = getEntryPreview(item)
  const image = preview ? { url: new URL(preview.src, ORIGIN).href, alt: preview.alt } : undefined
  const paragraphs: string[] = []
  for (const token of marked.lexer(item.markdown)) {
    if (token.type === "heading" && paragraphs.length) break
    if (token.type !== "paragraph" || token.tokens?.some((part) => part.type === "image" || part.type === "html")) continue
    if (/^(RESULTS|STATUS)\s*·/.test(token.text)) continue
    if (paragraphs.length && paragraphs.join("\n").length + token.text.length > 1200) break
    paragraphs.push(token.text)
    if (paragraphs.length === 2) break
  }
  const excerpt = paragraphs.length ? paragraphs.join("\n\n") : item.description
  const body = emailMarkdown.parse(excerpt, { async: false }).replace(/<p>/g, '<p style="margin:0 0 20px;line-height:170%;">')
  const label = collection.group === "notes" ? "Read the complete note" : "Explore the project"
  const email = `---\nsubject: ${field(item.title)}\npreview_text: ${field(item.description)}\ndescription: ${field(`Sharing ${href}`)}\nprimary_url: ${links.newsletter}\n---\n${body}\n<p style="margin:28px 0 0;line-height:170%;"><a href="${escape(links.newsletter)}" style="color:#161718;text-decoration:underline;">${label} →</a></p>\n`
  const markdown = `# ${item.title}\n\nLocal sharing material from the published entry. Review before posting or sending.\n\nCanonical: ${ORIGIN}${href}\n\n${image ? `## Existing image\n\n${image.url}\n\nAlt text: ${image.alt}\n\n` : ""}## Short post for X\n\n${item.description}\n\n${links.x}\n\n## LinkedIn\n\n${item.title}\n\n${item.description}\n\n${links.linkedin}\n\n## GitHub README link\n\n[${item.title}](${links.github})\n\n## Email\n\nThe adjacent newsletter.html contains the opening paragraphs from the source and a tagged link. Use the existing newsletter preview/review workflow. No broadcast has been created.\n`
  return { slug: item.slug, markdown, email, links, image }
}
