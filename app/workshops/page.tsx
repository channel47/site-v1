import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { Rows } from "@/components/site/rows"
import { getWorkshops } from "@/lib/content"
import { LINKS, TYPE_COLORS } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Live sessions — Channel 47",
  description:
    "Monthly live build-alongs inside the Vibe Marketers community — watch an agentic marketing system get built end to end, then grab it. Replays inside.",
  alternates: { canonical: "/workshops" },
}

/**
 * The evergreen workshops index (mauve is the Workshops identity, round 15)
 * — the cadence is monthly but no date is pinned yet, so this page carries
 * the type until a session does. Individual sessions get their own page on
 * the upcoming→past template (app/workshops/[slug]) the moment one exists.
 */
export default function WorkshopsPage() {
  const sessions = getWorkshops()

  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <p className="dt-crumb an-in" style={{ color: TYPE_COLORS.workshops }}>
            LIVE · MONTHLY
          </p>
          <h1 className="serif st-h1 as-h1 an-blur">Build-alongs, live</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".3s" }}>
            Once a month I run a live session inside the Vibe Marketers
            community on Skool: I build or run an agentic marketing workflow —
            a skill, a connector, a campaign system — live, and you follow
            along. No slides-only theory; the session ends with something you
            can install.
          </p>
        </header>

        {sessions.length > 0 ? (
          <div className="br-list">
            <Rows
              items={sessions.map((w) => ({
                title: w.title,
                description: w.description,
                href: `/workshops/${w.slug}`,
                typeLabel: w.status === "upcoming" ? "Upcoming" : "Replay",
                type: "workshops" as const,
                date: w.date,
              }))}
              activeType="workshops"
            />
          </div>
        ) : (
          <div className="st-prose">
            <p>
              Sessions are recorded — replays live inside the community, so
              joining gets you the back catalog as well as a seat at the next
              one. No session has a public date yet; the next one lands here
              first.
            </p>
          </div>
        )}

        <div className="ws-join">
          <a
            href={LINKS.join}
            target="_blank"
            rel="noopener"
            className="btn-solid"
            style={{ "--btn-color": "var(--c-workshop)" } as CSSProperties}
          >
            Join Vibe Marketers →
          </a>
        </div>

        <section className="ws-notify" aria-label="Get notified">
          <h2 className="st-group-title mono">Or just get a heads-up</h2>
          <Capture helper="One email when the next session gets a date. No spam." />
        </section>

        <p className="dt-back">
          <Link href="/browse">← Browse everything</Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
