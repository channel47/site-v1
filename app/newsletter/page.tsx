import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"
import { CAPTURE } from "@/lib/site-content"
import { RssSimple } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { ActivityCalendar } from "@/components/site/activity-calendar"
import { getNewsletterActivity } from "@/lib/newsletter-activity"
import { localActivityDate } from "@/lib/activity-calendar"

export const revalidate = 3600

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "Follow Jackson Dean’s experiments with AI, what he’s learning, and ideas you can try yourself. Occasional emails, no fixed schedule.",
  path: "/newsletter",
})

export default async function NewsletterPage() {
  const now = new Date()
  const activity = await getNewsletterActivity(now)
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

        <div className="newsletter-context">
          <p className="newsletter-intro">I’m <Link href="/about">Jackson</Link>. I buy media for a living and experiment with AI.</p>
          <ActivityCalendar activity={activity} today={localActivityDate(now)} />
          <p className="nl-rss">
            <a href="/rss.xml"><RssSimple size={18} aria-hidden="true" />Read via RSS</a>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
