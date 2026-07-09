import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { HomeCats, type CategoryRow } from "@/components/site/home-cats"
import type { Cover } from "@/components/site/cover-card"
import {
  getAllPosts,
  getAssets,
  getWorkshops,
  shortDate,
} from "@/lib/content"
import { CATEGORIES, HOME, type ContentTypeKey } from "@/lib/site-content"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

/** Two most recent covers per type. Workshops looks for an upcoming session
 * specifically (not just "most recent") — with none scheduled, the row
 * still needs to read as alive, so it falls back to one static card rather
 * than an empty "nothing here" state. */
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
  if (key === "posts") {
    return getAllPosts()
      .slice(0, 2)
      .map((p) => ({
        title: p.title,
        meta: `Post · ${shortDate(p.date)}`,
        href: `/posts/${p.slug}`,
        type: "posts" as const,
      }))
  }
  const upcoming = getWorkshops()
    .filter((w) => w.status === "upcoming")
    .slice(0, 2)
    .map((w) => ({
      title: w.title,
      meta: `Workshop · ${shortDate(w.date)}`,
      href: `/workshops/${w.slug}`,
      type: "workshops" as const,
    }))
  if (upcoming.length > 0) return upcoming
  return [
    {
      title: "Build-alongs, live",
      meta: "Live · monthly, replays inside",
      href: "/browse?type=workshops",
      type: "workshops" as const,
    },
  ]
}

/**
 * Home (round 12/14) — plain headline, then four category rows that unfold
 * into a short description and the most recent items in that type, then the
 * below-the-fold region doing exactly two jobs: prove the channel publishes
 * and earn the ask (signed note → capture).
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
