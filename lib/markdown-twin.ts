import { ASSET_DIRS, type Asset, type Post, type Workshop } from "@/lib/content"
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo"

/**
 * Markdown twins (docs/AI-SEO.md, Layer 3) — every content URL also serves
 * clean markdown at `<url>.md`, built from the same loaded content object as
 * the HTML page so the two can never drift.
 *
 * Why: an agent reading the HTML page burns 20–50x the tokens for the same
 * information, most of it nav/footer noise. The twin is the whole page at ~5%
 * of the cost, so agents read more of the site, more accurately.
 *
 * Frontmatter keys are stable across every twin (title, slug, type,
 * description, author, updatedAt, canonical) so agents can parse them
 * programmatically; asset twins add the install facts (repo, install,
 * package). `updatedAt` is the real frontmatter date — never faked.
 */

function frontmatter(fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  return ["---", ...lines, "---", ""].join("\n")
}

export function postTwin(post: Post): string {
  return (
    frontmatter({
      title: post.title,
      slug: post.slug,
      type: "post",
      description: post.description,
      author: AUTHOR_NAME,
      updatedAt: post.date,
      canonical: `${SITE_URL}/posts/${post.slug}`,
      asset: post.asset.name,
      assetRepo: post.asset.repo,
    }) +
    `\n# ${post.title}\n\n${post.markdown}\n`
  )
}

export function workshopTwin(workshop: Workshop): string {
  return (
    frontmatter({
      title: workshop.title,
      slug: workshop.slug,
      type: "workshop",
      description: workshop.description,
      author: AUTHOR_NAME,
      updatedAt: workshop.date,
      canonical: `${SITE_URL}/workshops/${workshop.slug}`,
      status: workshop.status,
      duration: workshop.duration,
    }) +
    `\n# ${workshop.title}\n\n${workshop.markdown}\n`
  )
}

export function assetTwin(asset: Asset): string {
  const section = ASSET_DIRS[asset.type]
  return (
    frontmatter({
      title: asset.title,
      slug: asset.slug,
      type: asset.type,
      description: asset.description,
      author: AUTHOR_NAME,
      updatedAt: asset.date,
      canonical: `${SITE_URL}/${section}/${asset.slug}`,
      repo: asset.repo,
      install: asset.install,
      package: asset.package,
    }) +
    `\n# ${asset.title}\n\n${asset.description}\n\n${asset.markdown}\n\n## Install\n\n\`\`\`\n${asset.install}\n\`\`\`\n\nSource: ${asset.repo}\n`
  )
}
