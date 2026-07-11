import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { HomeCats, type CategoryRow } from "@/components/site/home-cats"
import type { Cover } from "@/components/site/cover-card"
import {
  getAssets,
  getWorkshops,
  shortDate,
} from "@/lib/content"
import { CATEGORIES, HOME, type ContentTypeKey } from "@/lib/site-content"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

/** Two most recent covers per active content type. */
function coversFor(key: ContentTypeKey): Cover[] {
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
 * Home (round 12/14) — plain headline, then category rows that unfold
 * into a short description and the most recent items in that type, then the
 * below-the-fold region with a signed note and email capture.
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
          <p className="home-sub an-up" style={{ animationDelay: ".3s" }}>
            {HOME.subhead}
          </p>
          <div className="home-id an-up" style={{ animationDelay: ".45s" }}>
            <img
              src={HOME.avatar}
              alt=""
              width={38}
              height={38}
              className="home-id-avatar"
            />
            <span className="home-id-text">
              <span className="home-id-name">{HOME.name}</span>
              <span className="home-id-tag">{HOME.tagline}</span>
            </span>
          </div>
        </div>

        <HomeCats rows={rows} />

        <p className="home-browse-all">
          <Link href="/browse" className="home-browse-all-link">
            Browse all →
          </Link>
        </p>

        <section aria-label="Subscribe" className="home-subscribe">
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
