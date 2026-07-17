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
 * The dedicated subscribe page (v2 repositioning). The H1 is a punchier
 * riff on the strategy-approved subscriber promise — the full promise
 * still ships verbatim in the meta description. Below the capture,
 * "Right, who's sending these?" puts a face on the ask: the site
 * deliberately has no About page, so identity lives in page sections like
 * this one. The bio is a first-person track record ($50k days, the
 * mushroom blog, MCP servers) that keeps the old ledger's no-roundups /
 * no-sponsors trust line in its closing beat.
 */
export default function NewsletterPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-newsletter">
        <header className="st-head st-head-newsletter">
          <h1 className="serif st-h1 an-blur">
            Occasional emails about agentic systems in the real world.
          </h1>
        </header>

        <div className="nl-capture">
          <Capture helper="No spam, no cadence. It goes out when something worth sending ships. Unsubscribe anytime." />
        </div>

        <section className="st-prose" aria-labelledby="nl-who-title">
          <h2 id="nl-who-title">Right, who&apos;s sending these?</h2>
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
            I&apos;ve scaled Meta ads to $50k a day. I&apos;ve taken a mushroom
            blog to page one of Google for &ldquo;magic mushrooms&rdquo; —
            knowing nothing about them except how to eat them. I&apos;ve built
            my own MCP servers. I&apos;ve failed, a lot. And learned more.
          </p>
          <p>
            channel47 is where I share what survived — the systems that earn
            their keep, and the decisions behind them. The emails are the
            freshest cut: one build or idea at a time, no roundups, no
            sponsors, and no hard feelings if you unsubscribe.
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
