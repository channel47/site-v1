import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "Occasional emails about the agentic systems Jackson Dean is building, how they work, and the parts you can reuse in your own work.",
  path: "/newsletter",
})

const WHAT_LANDS = [
  "A build breakdown: a system I actually use, and the decisions behind it.",
  "A small workflow idea worth trying, even without a full build.",
  "A new skill, connector, or workshop, explained through the problem it solves.",
  "Nothing else. No roundups, no sponsors, no generic AI commentary.",
]

/**
 * The dedicated subscribe page (v2 repositioning) — the subscriber promise
 * is the strategy-approved headline; each email is meant to stand on its
 * own, not withhold the useful idea behind a click.
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head st-head-newsletter">
          <h1 className="serif st-h1 an-blur">
            Occasional emails about agentic systems I&apos;m building, how they
            work, and the parts you can reuse in your own work.
          </h1>
        </header>

        <div className="nl-capture">
          <Capture helper="No spam, no cadence. It goes out when something worth sending ships. Unsubscribe anytime." />
        </div>

        <div className="st-prose">
          <h2>What lands in it</h2>
          <ol>
            {WHAT_LANDS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <p>
            Each email stands on its own. The useful idea is never withheld
            behind a click. Website links go further, with screenshots,
            complete prompts, system diagrams, and related tools.
          </p>
          <p className="mono nl-rss">
            Agents and feed readers can follow everything the list gets at{" "}
            <a href="/rss.xml">rss.xml</a>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
