import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"
import { HOME, CAPTURE } from "@/lib/site-content"
import { RssSimple } from "@phosphor-icons/react/dist/ssr"

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

      <main id="main-content" className="st-shell st-shell-newsletter">
        <header className="st-head st-head-newsletter">
          <h1 className="serif st-h1 an-blur">
            Follow what I’m working on.
          </h1>
        </header>

        <div className="nl-capture">
          <Capture placement="newsletter" helper={`${CAPTURE.helper} Unsubscribe anytime.`} />
        </div>

        <section className="st-prose" aria-labelledby="nl-who-title">
          <div className="nl-about-header">
            <h2 id="nl-who-title">About Jackson</h2>
            <img
              src={HOME.avatar}
              alt={HOME.name}
              width={64}
              height={80}
              className="author-portrait"
            />
          </div>
          <p>{HOME.bio}</p>
          <p>
            I’ll send you selected projects and notes about things I’m building,
            experiments, and ideas I’m still working through.
            There’s no fixed schedule and no requirement for everything to be finished.
          </p>
          <p className="nl-rss">
            <a href="/rss.xml"><RssSimple size={18} aria-hidden="true" />Read via RSS</a>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
