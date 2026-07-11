import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { LINKS } from "@/lib/site-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "channel47 is Jackson Dean's collection of open-source marketing skills, MCP connectors, and workshop notes.",
  path: "/about",
})

/**
 * A short factual introduction to channel47 and its author.
 */
export default function AboutPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">About channel47</h1>
        </header>

        <div className="st-prose">
          <p>
            channel47 is where I publish open-source skills and MCP connectors
            for marketers working with AI agents.
          </p>
          <p>
            I&apos;m Jackson Dean, a media buyer and mentor in the{" "}
            <a
              href={LINKS.join}
              target="_blank"
              rel="noopener"
              className="st-accent-link"
            >
              Vibe Marketers
            </a>{" "}
            community. The workshop archive documents sessions I&apos;ve hosted
            there.
          </p>
          <p>
            The library is free to browse and install. You can view the{" "}
            <Link
              href="/browse"
              className="st-accent-link"
              style={{ "--type-color": "var(--c-skill)" } as CSSProperties}
            >
              available tools and workshops
            </Link>{" "}
            or inspect the source in the{" "}
            <a
              href="https://github.com/channel47"
              target="_blank"
              rel="noopener"
              className="st-accent-link"
            >
              channel47 GitHub organization
            </a>
            .
          </p>
        </div>

        <div className="st-post-capture">
          <Capture />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
