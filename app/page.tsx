import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { Unfold } from "@/components/site/unfold"
import {
  getAllPosts,
  getAssets,
  getWorkshops,
  shortDate,
} from "@/lib/content"
import { CATEGORIES, HOME, TYPE_COLORS, type ContentTypeKey } from "@/lib/site-content"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

interface Cover {
  title: string
  meta: string
  href: string
}

function coversFor(key: ContentTypeKey): Cover[] {
  if (key === "skills") {
    return getAssets("skill")
      .slice(0, 3)
      .map((a) => ({
        title: a.title,
        meta: `Skill · ${shortDate(a.date)}`,
        href: `/skills/${a.slug}`,
      }))
  }
  if (key === "connectors") {
    return getAssets("connector")
      .slice(0, 3)
      .map((a) => ({
        title: a.title,
        meta: `Connector · ${shortDate(a.date)}`,
        href: `/connectors/${a.slug}`,
      }))
  }
  if (key === "posts") {
    return getAllPosts()
      .slice(0, 3)
      .map((p) => ({
        title: p.title,
        meta: `Post · ${shortDate(p.date)}`,
        href: `/posts/${p.slug}`,
      }))
  }
  return getWorkshops()
    .slice(0, 3)
    .map((w) => ({
      title: w.title,
      meta: `Workshop · ${shortDate(w.date)}`,
      href: `/workshops/${w.slug}`,
    }))
}

/**
 * Home (round 12/14) — plain headline, then four category rows that unfold
 * into a short description and the most recent items in that type, then the
 * below-the-fold region doing exactly two jobs: prove the channel publishes
 * and earn the ask (signed note → capture).
 */
export default function Page() {
  return (
    <div className="st-page">
      <SiteHeader home />

      <main className="st-shell">
        <div className="home-hero">
          <h1 className="home-h1 an-blur">{HOME.headline}</h1>
          <p className="home-sub an-up" style={{ animationDelay: ".3s" }}>
            {HOME.subhead}
          </p>
        </div>

        <nav className="home-cats" aria-label="Browse by type">
          {CATEGORIES.map((cat) => {
            const covers = coversFor(cat.key)
            return (
              <div
                key={cat.key}
                className="home-cat"
                style={{ "--type-color": TYPE_COLORS[cat.key] } as CSSProperties}
              >
                <Unfold
                  triggerClassName="home-cat-toggle"
                  trigger={
                    <>
                      <span className="home-cat-label">{cat.title}</span>
                      <span className="home-cat-plus" aria-hidden>
                        +
                      </span>
                    </>
                  }
                >
                  <div style={{ paddingBottom: 21 }}>
                    <p className="home-cat-desc">{cat.desc}</p>
                    {covers.length > 0 ? (
                      <div className="home-cat-covers">
                        {covers.map((cover) => (
                          <Link
                            key={cover.href}
                            href={cover.href}
                            className="home-cover"
                          >
                            <span className="home-cover-tag" aria-hidden />
                            <span className="home-cover-main">
                              <span className="home-cover-name">
                                {cover.title}
                              </span>
                              <span className="home-cover-meta mono">
                                {cover.meta}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="home-cat-empty">
                        No sessions yet — check back soon.
                      </p>
                    )}
                    <Link href={cat.href} className="home-cat-link">
                      Browse {cat.title.toLowerCase()} →
                    </Link>
                  </div>
                </Unfold>
              </div>
            )
          })}
        </nav>

        <p className="home-browse-all">
          <Link href="/browse" className="st-accent-link">
            Browse all →
          </Link>
        </p>

        <section aria-label="Subscribe" style={{ marginTop: 48 }}>
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
