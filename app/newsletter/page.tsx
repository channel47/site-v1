import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"
import { AUTHOR, CAPTURE } from "@/lib/site-content"
import { RssSimple } from "@phosphor-icons/react/dist/ssr"
import { AuthorPortrait } from "@/components/site/author-portrait"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "Follow Jackson Dean’s experiments with AI, what he’s learning, and ideas you can try yourself. Occasional emails, no fixed schedule.",
  path: "/newsletter",
})

export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main id="main-content" className="st-shell">
        <header className="st-head">
          <h1 className="st-h1">
            {CAPTURE.title}
          </h1>
        </header>

        <div className="nl-capture">
          <Capture placement="newsletter" helper={`${CAPTURE.helper} Unsubscribe anytime.`} />
        </div>

        <section className="st-prose" aria-labelledby="nl-who-title">
          <div className="author-heading">
            <AuthorPortrait alt="" />
            <h2 id="nl-who-title">About Jackson</h2>
          </div>
          <p>{AUTHOR.bio}</p>
          <p>
            I’ll share new experiments and the questions I’m still working
            through, including the attempts that change my mind. You’ll get the
            story behind the work and, when there’s something to use or adapt,
            a way to try it yourself.
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
