import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"

export const metadata: Metadata = {
  title: "Newsletter — Channel 47",
  description:
    "Occasional updates when Channel 47 adds a skill, connector, or workshop.",
  alternates: { canonical: "/newsletter" },
}

/**
 * The dedicated subscribe page. No cadence promise: updates go out only
 * when there is a new skill, connector, or workshop to share.
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">Occasional updates from Channel47.</h1>
          <p className="st-intro an-up" style={{ animationDelay: ".3s" }}>
            One email when I add a skill, connector, or workshop. Nothing on a
            schedule.
          </p>
        </header>

        <div className="nl-capture">
          <Capture helper="No fixed cadence. Unsubscribe anytime." />
        </div>

        <div className="st-prose">
          <p>
            Updates cover additions to the public library and workshop
            announcements from the Vibe Marketers community.
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
