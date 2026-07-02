import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MarkLink } from "@/components/stories/mark-link"
import { getAllStories, getStoryBySlug, shortDate } from "@/lib/stories"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllStories().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) return {}
  return {
    title: `${story.title} — Channel 47`,
    description: story.description,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      title: story.title,
      description: story.description,
      url: `https://channel47.dev/stories/${story.slug}`,
      siteName: "Channel 47",
      type: "article",
    },
  }
}

const ASSET_TYPE_LABEL = { skill: "Skill", mcp: "MCP connector" } as const

/**
 * Story detail — the editorial single-column treatment from docs/PLAN.md's
 * Post template: title, quiet byline, body, with a compact "introduces" strip
 * up top linking the asset the story is about (the body itself carries the
 * install walkthrough in its closing "Grab it" section, so the strip stays
 * a pointer rather than a duplicate).
 */
export default async function StoryPage({ params }: Props) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) notFound()

  return (
    <div className="st-page">
      <nav className="st-nav st-shell">
        <MarkLink />
        <Link href="/stories" className="st-nav-back mono">
          ← Stories
        </Link>
      </nav>

      <article className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1">{story.title}</h1>
          <p className="st-byline mono">
            {story.author} · {shortDate(story.date)}
          </p>
          <a
            href={story.asset.repo}
            target="_blank"
            rel="noopener"
            className="st-asset"
          >
            <span className="st-asset-label mono">Introduces</span>
            <span className="st-asset-name mono">{story.asset.name}</span>
            <span className="st-asset-type mono">
              {ASSET_TYPE_LABEL[story.asset.type]} · GitHub →
            </span>
          </a>
        </header>

        <div
          className="st-prose"
          // First-party markdown from content/stories — rendered at build time.
          dangerouslySetInnerHTML={{ __html: story.html }}
        />
      </article>

      <footer className="st-shell st-foot">
        <p className="st-foot-note">
          <Link href="/stories" className="st-accent-link">
            ← More stories
          </Link>
        </p>
        <p className="st-foot-note">
          New systems ship with a story attached.{" "}
          <Link href="/" className="st-accent-link">
            Get on the list →
          </Link>
        </p>
      </footer>
    </div>
  )
}
