import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { LINKS } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Live sessions — Channel 47",
  description:
    "Monthly live build-alongs inside the Vibe Marketers community — watch an agentic marketing system get built end to end, then grab it. Replays inside.",
  alternates: { canonical: "/workshops" },
}

/**
 * The evergreen workshops page (PLAN §5) — the cadence is monthly but the next
 * date isn't pinned, so this page carries the Workshops type until it is: what
 * the sessions are, the Skool join CTA, and an email notify for the next date.
 * When a session gets a date it gets its own page on the state-driven
 * upcoming→past template, and the Home next-live strip switches on.
 */
export default function WorkshopsPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <p className="st-group-title mono">Live · monthly</p>
          <h1 className="serif st-h1 as-h1">Build-alongs, live</h1>
          <p className="st-intro">
            Once a month I run a live session inside the Vibe Marketers
            community on Skool: I build or run an agentic marketing workflow —
            a skill, a connector, a campaign system — live, and you follow
            along. No slides-only theory; the session ends with something you
            can install.
          </p>
        </header>

        <div className="st-prose">
          <p>
            Sessions are recorded — replays live inside the community, so
            joining gets you the back catalog as well as a seat at the next
            one.
          </p>
        </div>

        <div className="ws-join">
          <a
            href={LINKS.join}
            target="_blank"
            rel="noopener"
            className="ea-btn ws-join-btn"
          >
            Join Vibe Marketers →
          </a>
        </div>

        <section className="ws-notify" aria-label="Get notified">
          <h2 className="st-group-title mono">Or just get a heads-up</h2>
          <Capture helper="One email when the next session gets a date. No spam." />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
