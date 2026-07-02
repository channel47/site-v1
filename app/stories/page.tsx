import type { Metadata } from "next"
import Link from "next/link"
import { MarkLink } from "@/components/stories/mark-link"
import { getAllStories, shortDate, type Story } from "@/lib/stories"

export const metadata: Metadata = {
  title: "Stories from the trenches — Channel 47",
  description:
    "Field stories from seven years of paid media — each one introduces a skill or MCP connector from the Channel 47 library through a real account, a real problem, and the system that fixed it.",
  alternates: { canonical: "/stories" },
  openGraph: {
    title: "Stories from the trenches — Channel 47",
    description:
      "Field stories from real ad accounts — each introduces a skill or MCP connector from the Channel 47 library.",
    url: "https://channel47.dev/stories",
    siteName: "Channel 47",
    type: "website",
  },
}

const SECTIONS: {
  category: Story["category"]
  heading: string
  blurb: string
}[] = [
  {
    category: "skills",
    heading: "Skills",
    blurb:
      "Agentic marketing systems — research pipelines, media buying routines, distribution tools — that install into Claude Code, Cursor, and any SKILL.md-compatible agent.",
  },
  {
    category: "connectors",
    heading: "Connectors",
    blurb:
      "Open-source MCP servers that give your agent real access to the ad platforms — Google, Bing, Meta, LinkedIn, TikTok, Pinterest — with dry-run safety built in.",
  },
]

/**
 * The stories index — a restrained editorial list in the Browse-row treatment
 * from docs/PLAN.md: title · one-liner · type/date meta, grouped by the asset
 * type each story introduces. Statically rendered from `content/stories/`.
 */
export default function StoriesPage() {
  const stories = getAllStories()

  return (
    <div className="st-page">
      <nav className="st-nav st-shell">
        <MarkLink />
        <span className="st-nav-here mono">Stories</span>
      </nav>

      <header className="st-shell st-head">
        <h1 className="serif st-h1">Stories from the trenches</h1>
        <p className="st-intro">
          Every tool in the Channel 47 library exists because something in a
          real ad account broke, leaked, or took too long. These are those
          stories — one per skill and connector, each ending with the thing you
          can install.
        </p>
      </header>

      <main className="st-shell">
        {SECTIONS.map((section) => (
          <section key={section.category} className="st-group">
            <h2 className="st-group-title mono">{section.heading}</h2>
            <p className="st-group-blurb">{section.blurb}</p>
            <ul className="st-rows">
              {stories
                .filter((s) => s.category === section.category)
                .map((story) => (
                  <li key={story.slug}>
                    <Link href={`/stories/${story.slug}`} className="st-row">
                      <span className="st-row-main">
                        <span className="st-row-title serif">
                          {story.title}
                        </span>
                        <span className="st-row-desc">
                          {story.description}
                        </span>
                      </span>
                      <span className="st-row-meta mono">
                        {story.asset.name} · {shortDate(story.date)}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </main>

      <footer className="st-shell st-foot">
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
