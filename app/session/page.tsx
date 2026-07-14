import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { getNotes } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"
import { LINKS, SESSION } from "@/lib/site-content"

export const metadata: Metadata = pageMetadata({
  title: SESSION.title,
  description:
    "Bring one recurring workflow from your work or business, and we'll think through how agents could make it easier. 60 minutes, $250 USD, four sessions each month.",
  path: "/session",
})

/**
 * The offer facts + booking CTA, shared markup for the desktop sidebar card
 * and the mobile "What you're booking" card. `showButton` is false on
 * mobile, where booking lives in the sticky bottom bar instead.
 */
function OfferFacts({ showButton, className }: { showButton: boolean; className: string }) {
  return (
    <div className={className}>
      <p className="session-card-label">{SESSION.offer.label}</p>
      <dl className="session-card-table">
        {SESSION.offer.rows.map((row) => (
          <div className="session-card-row" key={row.label}>
            <dt className="session-card-row-label">{row.label}</dt>
            <dd className="session-card-row-value">{row.value}</dd>
          </div>
        ))}
      </dl>
      {showButton ? (
        <a
          href={LINKS.booking}
          target="_blank"
          rel="noopener"
          className="session-book-btn"
        >
          {SESSION.offer.cta}
        </a>
      ) : null}
      <p className="session-card-microcopy">{SESSION.offer.microcopy}</p>
      {showButton ? (
        <div className="session-card-testimonial">
          <p className="session-card-quote">&ldquo;{SESSION.testimonial.quote}&rdquo;</p>
          <p className="session-card-attribution">{SESSION.testimonial.attribution}</p>
        </div>
      ) : null}
    </div>
  )
}

export default function SessionPage() {
  const notes = getNotes()

  return (
    <div className="st-page session-page">
      <SiteHeader />

      <main className="st-shell st-shell-full session-layout">
        <div className="session-main">
          <header className="st-head">
            <h1 className="st-h1 h1-note an-blur">{SESSION.title}</h1>
            <p className="st-intro session-intro-desktop an-up" style={{ animationDelay: ".2s" }}>
              {SESSION.intro}
            </p>
            <p className="st-intro session-intro-mobile an-up" style={{ animationDelay: ".2s" }}>
              {SESSION.introShort}
            </p>
          </header>

          {/* Mobile-only "what you're booking" card — no button, the sticky
              bar below the fold handles booking. */}
          <OfferFacts showButton={false} className="session-mobile-card an-up" />

          <section className="session-section">
            <h2 className="session-h2 st-section-h2">What working together looks like</h2>
            <div className="session-steps">
              {SESSION.steps.map((step, idx) => (
                <div className="session-step" key={step}>
                  <span className="mono session-step-index">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="session-step-text">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="session-section">
            <h2 className="session-h2 st-section-h2">Systems I&apos;ve actually built</h2>
            <p className="session-proof-lede">
              Two builds that came out of the same approach we&apos;d use in a session:
            </p>
            <div className="session-proof-list">
              {notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="session-proof-card"
                >
                  <span>
                    <span className="session-proof-tag">Note</span>
                    <span className="session-proof-title">{note.title}</span>
                  </span>
                  <span className="session-proof-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              ))}
              {/* Hardcoded in-progress entry for the weekly KPI-review build,
                  which has no detail page yet. Remove this once a real Note
                  ships for it — the section will then come entirely from
                  getNotes() again. */}
              <Link href={SESSION.inProgressBuild.href} className="session-proof-card">
                <span>
                  <span className="session-proof-tag session-proof-tag-progress">
                    {SESSION.inProgressBuild.tag}
                  </span>
                  <span className="session-proof-title">{SESSION.inProgressBuild.title}</span>
                </span>
                <span className="session-proof-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </section>

          <section className="session-section">
            <h2 className="session-h2 st-section-h2">Who you&apos;d be working with</h2>
            <div className="session-personal">
              <img
                src="/jackson.jpeg"
                alt={SESSION.personal.name}
                width={76}
                height={76}
                className="session-personal-avatar"
              />
              <span className="session-personal-text">
                <span className="session-personal-name">{SESSION.personal.name}</span>
                <span className="session-personal-meta">{SESSION.personal.meta}</span>
              </span>
            </div>
            <p className="session-personal-bio session-personal-bio-desktop">
              {SESSION.personal.bio}
            </p>
            <p className="session-personal-bio session-personal-bio-mobile">
              {SESSION.personal.bioShort}
            </p>
          </section>

          <section className="session-boundary">
            <p className="session-boundary-label">{SESSION.boundary.label}</p>
            <p className="session-boundary-body session-boundary-body-desktop">
              {SESSION.boundary.body}
            </p>
            <p className="session-boundary-body session-boundary-body-mobile">
              {SESSION.boundary.bodyShort}
            </p>
          </section>

          <p className="dt-back">
            <Link href="/">&larr; Back home</Link>
          </p>
        </div>

        <aside className="session-aside">
          <OfferFacts showButton className="session-card an-up" />
        </aside>
      </main>

      <SiteFooter />

      {/* Mobile sticky book bar — outside the scroll flow, always visible. */}
      <div className="session-sticky-bar">
        <span className="session-sticky-price">
          $250<span className="session-sticky-price-unit"> / session</span>
          <span className="session-sticky-meta">60 min · one to one, live</span>
        </span>
        <a
          href={LINKS.booking}
          target="_blank"
          rel="noopener"
          className="session-sticky-btn"
        >
          {SESSION.offer.cta}
        </a>
      </div>
    </div>
  )
}
