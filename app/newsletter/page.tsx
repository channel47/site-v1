import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "One email when channel47 ships a new skill, connector, or workshop.",
  path: "/newsletter",
})

/**
 * The dedicated subscribe page. No cadence promise: updates go out only
 * when there is a new skill, connector, or workshop to share.
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head st-head-newsletter">
          <h1 className="serif st-h1 an-blur">One email when something new ships.</h1>
          <p className="st-intro an-up" style={{ animationDelay: ".2s" }}>
            When a skill, connector, or workshop lands in the library, you hear
            about it. Nothing on a schedule.
          </p>
        </header>

        <div className="nl-capture">
          <Capture helper="No fixed cadence. Unsubscribe anytime." />
        </div>

        <div className="st-prose">
          <p>
            That covers new skills and connectors as they&apos;re published,
            plus dates for live sessions in the Vibe Marketers community.
          </p>
          <p className="mono nl-rss">
            Feed readers can also follow <a href="/rss.xml">rss.xml</a>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
