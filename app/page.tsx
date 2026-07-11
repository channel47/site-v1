import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { HomeCats, type CategoryRow } from "@/components/site/home-cats"
import type { Cover } from "@/components/site/cover-card"
import {
  getAssets,
  getBuilds,
  getWorkshops,
  shortDate,
} from "@/lib/content"
import { CATEGORIES, HOME, HOME_NEWSLETTER, type ContentTypeKey } from "@/lib/site-content"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

/** Two most recent covers per active content type. */
function coversFor(key: ContentTypeKey): Cover[] {
  if (key === "builds") {
    return getBuilds()
      .slice(0, 2)
      .map((b) => ({
        title: b.title,
        meta: `Build · ${shortDate(b.date)}`,
        href: `/builds/${b.slug}`,
        type: "builds" as const,
      }))
  }
  if (key === "skills") {
    return getAssets("skill")
      .slice(0, 2)
      .map((a) => ({
        title: a.title,
        meta: `Skill · ${shortDate(a.date)}`,
        href: `/skills/${a.slug}`,
        type: "skills" as const,
      }))
  }
  if (key === "connectors") {
    return getAssets("connector")
      .slice(0, 2)
      .map((a) => ({
        title: a.title,
        meta: `Connector · ${shortDate(a.date)}`,
        href: `/connectors/${a.slug}`,
        type: "connectors" as const,
      }))
  }
  if (key === "posts") return []
  return getWorkshops()
    .slice(0, 2)
    .map((w) => ({
      title: w.title,
      meta: `Workshop · ${shortDate(w.date)}`,
      href: `/workshops/${w.slug}`,
      type: "workshops" as const,
    }))
}

/**
 * Home (v2 repositioning) — broadened hero with a quiet bordered "Book a
 * session" as the primary action (no filled button, no booking-metadata
 * line — that detail lives on /session), then category rows, the bio, and
 * the email capture relocated below the bio ahead of the footer.
 */
export default function Page() {
  const rows: CategoryRow[] = CATEGORIES.map((cat) => ({
    ...cat,
    covers: coversFor(cat.key),
  }))

  return (
    <div className="st-page">
      <SiteHeader home />

      <main className="st-shell st-shell-full">
        <div className="home-hero">
          <h1 className="home-h1 an-blur">{HOME.headline}</h1>
          <p className="home-sub an-up" style={{ animationDelay: ".2s" }}>
            {HOME.subhead}
          </p>
          <div className="home-hero-actions an-up" style={{ animationDelay: ".32s" }}>
            <Link href="/session" className="home-hero-primary">
              Book a session
            </Link>
            <Link href="/browse" className="home-hero-secondary">
              Browse the workshop →
            </Link>
          </div>
        </div>

        <HomeCats rows={rows} defaultOpen="builds" />

        <p className="home-browse-all">
          <Link href="/browse" className="home-browse-all-link">
            Browse all →
          </Link>
        </p>

        <section aria-label="About Jackson" className="home-bio">
          <div className="home-bio-inner">
            <div className="home-bio-id">
              <img
                src={HOME.avatar}
                alt={HOME.name}
                width={64}
                height={64}
                className="home-bio-avatar"
              />
              <span className="home-bio-text">
                <span className="home-bio-name">{HOME.name}</span>
                <span className="home-bio-tag">{HOME.tagline}</span>
              </span>
            </div>
            <p className="home-bio-note">{HOME.bio}</p>
          </div>
        </section>

        <section aria-label="Subscribe" className="home-newsletter">
          <div className="home-newsletter-inner">
            <h2 className="home-newsletter-h2">{HOME_NEWSLETTER.heading}</h2>
            <p className="home-newsletter-sub">{HOME_NEWSLETTER.sub}</p>
            <div className="home-newsletter-capture">
              <Capture helper={HOME_NEWSLETTER.microcopy} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
