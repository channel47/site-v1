import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"

export const metadata: Metadata = {
  title: "Newsletter — Channel 47",
  description:
    "New skills, connectors, and posts as they ship, plus the next live session — the Channel 47 list.",
  alternates: { canonical: "/newsletter" },
}

/**
 * The dedicated subscribe page (PLAN §5) — the honest framing: drops + session
 * announcements, no cadence promise. This is where the header's Newsletter
 * link lands from every page.
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">The list</h1>
          <p className="st-intro an-up" style={{ animationDelay: ".3s" }}>
            One email when something ships: a new skill, a new connector, a new
            post — and a heads-up when the next live session gets a date.
            That&apos;s the whole deal. No content-calendar filler, no daily
            drip.
          </p>
        </header>

        <div className="nl-capture">
          <Capture />
        </div>

        <div className="st-prose">
          <p>
            Everything announced here is free to grab. If you want the live
            build-alongs and the replays, those live inside the Vibe Marketers
            community — the list will point you there when it&apos;s relevant.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
