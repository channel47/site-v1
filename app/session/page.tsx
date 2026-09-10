import type { Metadata } from "next";
import Link from "next/link";
import { BackToBrowse } from "@/components/site/browse-navigation";
import { DirectionCue } from "@/components/site/direction-cue";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getFeedItems } from "@/lib/content";
import { AuthorPortrait } from "@/components/site/author-portrait";
import { pageMetadata } from "@/lib/seo";
import { LINKS, SESSION } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: SESSION.title,
  description:
    "Bring one recurring workflow from your work or business, and we'll think through how agents could make it easier. 60 minutes, $250 USD, four sessions each month.",
  path: "/session",
});

export default function SessionPage() {
  return (
    <div className="st-page">
      <SiteHeader />
      <main id="main-content" className="st-shell st-shell-full session-layout">
        <header className="st-head session-heading">
          <h1 className="st-h1">{SESSION.title}</h1>
          <p className="piece-lede">{SESSION.intro}</p>
        </header>

        <aside className="session-aside" aria-label="Session details">
          <div className="session-card">
            <p className="session-card-label">{SESSION.offer.label}</p>
            <dl className="session-card-table">
              {SESSION.offer.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <a href={LINKS.booking} target="_blank" rel="noopener" className="session-book-btn">
              {SESSION.offer.cta}
            </a>
            <p className="session-card-microcopy">{SESSION.offer.microcopy}</p>
          </div>
        </aside>

        <div className="session-main">
          <section className="session-section">
            <h2>What working together looks like</h2>
            <ol className="session-steps" role="list">
              {SESSION.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>

          <section className="session-section">
            <h2>From my own work</h2>
            <p>Notes on tools I’ve built and experiments I’ve worked through:</p>
            <div className="session-proof-list">
              {getFeedItems().map((item) => (
                <Link key={item.href} href={item.href} className="session-proof-link">
                  <span>{item.title}</span>
                  <DirectionCue />
                </Link>
              ))}
            </div>
          </section>

          <section className="session-section">
            <div className="author-heading">
              <AuthorPortrait />
              <h2>Who you&apos;d be working with</h2>
            </div>
            <p>{SESSION.personal.bio}</p>
          </section>

          <section className="session-section">
            <h2>{SESSION.boundary.label}</h2>
            <p>{SESSION.boundary.body}</p>
          </section>
          <BackToBrowse href="/" className="reading-back session-back" />
        </div>
      </main>
      <SiteFooter />
      <div className="session-sticky-bar">
        <span className="session-sticky-price">
          $250<span className="session-sticky-price-unit"> / session</span>
          <span className="session-sticky-meta">60 min · one to one, live</span>
        </span>
        <a href={LINKS.booking} target="_blank" rel="noopener" className="session-sticky-btn">
          {SESSION.offer.cta}
        </a>
      </div>
    </div>
  );
}
