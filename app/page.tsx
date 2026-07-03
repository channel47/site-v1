import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { TypeCards } from "@/components/home/type-cards"
import { Rows } from "@/components/site/rows"
import { getLatest } from "@/lib/content"
import { HOME } from "@/lib/site-content"

/**
 * Home (PLAN §5) — plain headline, the four type cards as primary navigation,
 * then the below-cards region doing exactly two jobs: prove the channel
 * publishes (latest feed) and earn the ask (signed note → capture).
 *
 * The next-live strip renders only when a session has a date — none is pinned
 * yet, so it's absent by design, not omitted.
 */
export default function Page() {
  const latest = getLatest(4)

  return (
    <div className="ea-page">
      <SiteHeader home />

      <main className="ea-body">
        <div className="ea-shell">
          <h1 className="serif ea-h1">{HOME.headline}</h1>
          <p className="home-sub">{HOME.subhead}</p>
        </div>

        <div className="ea-stackcol">
          <TypeCards />
        </div>

        <section className="ea-shell home-latest" aria-label="Latest">
          <h2 className="st-group-title mono">Latest from the channel</h2>
          <Rows items={latest} />
          <p className="home-browse-all">
            <Link href="/browse" className="st-accent-link">
              Browse all →
            </Link>
          </p>
        </section>

        <section className="ea-shell" aria-label="Subscribe">
          <p className="home-note">
            {HOME.note}{" "}
            <span className="home-note-sig mono">{HOME.noteSignature}</span>
          </p>
          <Capture />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
