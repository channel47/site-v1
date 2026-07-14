import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { HomeCats, type CategoryRow } from "@/components/site/home-cats"
import type { Cover } from "@/components/site/cover-card"
import {
  getAssets,
  getNotes,
  getWorkshops,
  shortDate,
} from "@/lib/content"
import { CATEGORIES, HOME, type ContentTypeKey } from "@/lib/site-content"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

/** Two most recent covers per active content type. */
function coversFor(key: ContentTypeKey): Cover[] {
  if (key === "notes") {
    return getNotes()
      .slice(0, 2)
      .map((b) => ({
        title: b.title,
        meta: `Note · ${shortDate(b.date)}`,
        href: `/notes/${b.slug}`,
        type: "notes" as const,
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
 * Home — broadened hero whose primary action is a lean inline email
 * capture (subscribe, not booking). Below that: category rows, the
 * "Browse all →" link, and the bio ahead of the footer — the hero capture
 * is the page's only signup form. The working-session offer has been
 * demoted from primary CTA and now lives only at /session, linked from
 * the footer.
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
          <div className="home-hero-capture an-up" style={{ animationDelay: ".32s" }}>
            <Capture helper={HOME.heroCaptureHelper} />
          </div>
        </div>

        <HomeCats rows={rows} defaultOpen="notes" />

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

      </main>

      <SiteFooter />
    </div>
  )
}
