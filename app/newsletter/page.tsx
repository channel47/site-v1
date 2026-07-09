import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { NEWSLETTER_SENDS } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Newsletter — Channel 47",
  description:
    "New skills, connectors, and posts as they ship, plus the next live session — the Channel 47 list.",
  alternates: { canonical: "/newsletter" },
}

/**
 * The dedicated subscribe page (round 16 / PLAN §5) — the honest framing:
 * drops + session announcements, no cadence promise. No type colour here —
 * the list carries everything, so the only colour moments are the gradient
 * focus underline and the green confirm check. This is where the header's
 * Newsletter link, and the footer's More group, both land.
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">The list hears about it first.</h1>
          <p className="st-intro an-up" style={{ animationDelay: ".3s" }}>
            One email when something ships — a new skill, a connector, the
            post behind it, or the next live session. Nothing on a schedule.
          </p>
        </header>

        <div className="nl-capture">
          <Capture helper="No spam, no cadence — it goes out when something worth sending ships. Unsubscribe anytime." />
        </div>

        <div className="st-prose">
          <h2>What lands in it</h2>
          <ul>
            <li>A new skill or connector, the day it ships — with the story of why it exists.</li>
            <li>The post that goes with it — field notes from the accounts it came out of.</li>
            <li>The next live build-along, before the calendar invite goes out.</li>
            <li>Nothing else. No roundups, no sponsors, no thoughts on AI.</li>
          </ul>
          <p className="mono nl-rss">
            Agents and feed readers: everything the list gets is also in{" "}
            <a href="/rss.xml">rss.xml</a>.
          </p>
        </div>

        <section className="nl-sends" aria-label="Recent sends">
          <h2 className="st-section-h2">Recent sends</h2>
          <ul className="nl-sends-list">
            {NEWSLETTER_SENDS.map((send) => (
              <li key={send.title} className="nl-send">
                <span className="nl-send-date mono">{send.date}</span>
                <span className="nl-send-title">{send.title}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="nl-signoff">
          I write it myself and send it from the terminal, usually the day
          something ships. If nothing shipped, you don&apos;t hear from me.{" "}
          <span className="mono nl-signoff-sig">— Jackson</span>
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
