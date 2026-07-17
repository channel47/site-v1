import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"
import { HOME } from "@/lib/site-content"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "Occasional emails about the agentic systems Jackson Dean is building, how they work, and the parts you can reuse in your own work.",
  path: "/newsletter",
})

/**
 * The dedicated subscribe page (v2 repositioning). The headline is a
 * tightened cut of the strategy-approved subscriber promise — the full
 * promise still ships verbatim in the meta description. Below the capture,
 * "Who the heck am I?" puts a face on the ask: the site deliberately has
 * no About page, so identity lives in page sections like this one, and the
 * old "What lands in it" ledger is folded into the bio copy (the no-spam
 * trust line survives inside it).
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head st-head-newsletter">
          <h1 className="serif st-h1 an-blur">
            Occasional emails about the agentic systems I&apos;m building, and
            the parts you can reuse.
          </h1>
        </header>

        <div className="nl-capture">
          <Capture helper="No spam, no cadence. It goes out when something worth sending ships. Unsubscribe anytime." />
        </div>

        <section className="st-prose" aria-labelledby="nl-who-title">
          <h2 id="nl-who-title">Who the heck am I?</h2>
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
          <p>
            Fair question. I run ad accounts for a living and build agentic
            systems for the recurring work around them — most of which started
            with something I was tired of doing the same way twice. When a
            system earns its keep, I write up the useful parts here.
          </p>
          <p>
            The emails are those write-ups: build breakdowns, small workflow
            ideas, and new skills or connectors explained through the problem
            they solve. No roundups, no sponsors, no generic AI commentary —
            and if it ever stops being useful, unsubscribing takes one click
            and zero hard feelings.
          </p>
          <p className="mono nl-rss">
            Agents and feed readers can follow everything the list gets at{" "}
            <a href="/rss.xml">rss.xml</a>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
