import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"
import { HOME, CAPTURE } from "@/lib/site-content"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "Occasional emails from Jackson Dean with new projects, experiments, and notes. No fixed schedule.",
  path: "/newsletter",
})

export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head st-head-newsletter">
          <h1 className="serif st-h1 an-blur">
            Follow what I’m working on.
          </h1>
        </header>

        <div className="nl-capture">
          <Capture placement="newsletter" helper={`${CAPTURE.helper} Unsubscribe anytime.`} />
        </div>

        <section className="st-prose" aria-labelledby="nl-who-title">
          <h2 id="nl-who-title">About Jackson</h2>
          <div className="nl-who-id">
            <img
              src={HOME.avatar}
              alt={HOME.name}
              width={64}
              height={64}
              className="nl-who-avatar"
            />
            <span className="nl-who-text">
              <span className="nl-who-name">{HOME.name}</span>
              <span className="nl-who-tag">{HOME.tagline}</span>
            </span>
          </div>
          <p>{HOME.bio}</p>
          <p>
            I’ll send you selected projects and notes about things I’m building,
            experiments, and ideas I’m still working through.
            There’s no fixed schedule and no requirement for everything to be finished.
          </p>
          <p className="mono nl-rss">
            You can also follow new posts with a feed reader at{" "}
            <a href="/rss.xml">rss.xml</a>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
