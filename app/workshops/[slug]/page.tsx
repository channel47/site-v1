import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { ShareRow } from "@/components/site/share-row"
import { SkoolIcon } from "@/components/site/social-icons"
import {
  ASSET_DIRS,
  ASSET_LABELS,
  getAssetBySlug,
  getWorkshopBySlug,
  getWorkshops,
  shortDate,
} from "@/lib/content"
import { LINKS, TYPE_COLORS } from "@/lib/site-content"
import { SITE_NAME, SITE_URL } from "@/lib/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getWorkshops().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const w = getWorkshopBySlug(slug)
  if (!w) return {}
  return {
    title: `${w.title} — Channel 47`,
    description: w.description,
    alternates: { canonical: `/workshops/${w.slug}` },
    openGraph: {
      title: w.title,
      description: w.description,
      url: `${SITE_URL}/workshops/${w.slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
  }
}

function longDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

/**
 * Workshop detail (round 15) — no route of its own in the design (the
 * Workshops crumb lands on Browse pre-filtered), but a dated session earns
 * its own page here on the state-driven upcoming→past template so it can be
 * linked, shared, and indexed.
 */
export default async function WorkshopPage({ params }: Props) {
  const { slug } = await params
  const w = getWorkshopBySlug(slug)
  if (!w) notFound()
  const relatedKind = w.relatedAsset?.type
  const related = w.relatedAsset ? getAssetBySlug(w.relatedAsset.type, w.relatedAsset.slug) : undefined
  const relatedHref = related && relatedKind ? `/${ASSET_DIRS[relatedKind]}/${related.slug}` : undefined
  const relatedLabel = relatedKind ? ASSET_LABELS[relatedKind] : undefined
  const href = `/workshops/${w.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell" style={{ "--type-color": TYPE_COLORS.workshops } as CSSProperties}>
        <header className="st-head">
          <Crumb
            typeLabel="Workshops"
            typeHref="/browse?type=workshops"
            typeColor={TYPE_COLORS.workshops}
            leaf={w.slug}
          />
          <h1 className="serif st-h1 h1-workshop an-blur">{w.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".3s" }}>
            {w.description}
          </p>
          <p className="dt-byline an-up" style={{ animationDelay: ".45s" }}>
            {w.status === "upcoming"
              ? `Hosted by ${w.author} · Live, then the replay lands inside`
              : `${w.author} · Recorded ${shortDate(w.date)} · ${w.duration}`}
          </p>
        </header>

        {w.status === "upcoming" ? (
          <div className="ws-plate an-up" style={{ animationDelay: ".55s" }}>
            <div className="ws-plate-head">
              <span className="ws-plate-live mono">
                <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor" aria-hidden>
                  <path d="M0 0l8 4.5L0 9z" />
                </svg>
                Live session
              </span>
              <span className="ws-plate-dur mono">{w.duration}</span>
            </div>
            <div className="ws-plate-body">
              <p className="ws-plate-date serif">{longDate(w.date)}</p>
              {w.time ? (
                <p className="ws-plate-time">
                  {w.time} · live inside Vibe Marketers, with Q&amp;A as it&apos;s built
                </p>
              ) : null}
            </div>
          </div>
        ) : w.screenshot ? (
          <figure className="dt-figure an-up" style={{ animationDelay: ".55s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.screenshot} alt="" />
            {w.screenshotCaption ? (
              <figcaption className="dt-figcaption">{w.screenshotCaption}</figcaption>
            ) : null}
          </figure>
        ) : (
          <figure className="dt-figure an-up" style={{ animationDelay: ".55s" }}>
            <div className="ws-still-hatch" aria-hidden>
              <span className="ws-still-tag mono">Still — session replay</span>
              <svg className="ws-still-play" width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden>
                <circle cx="23" cy="23" r="22" stroke="currentColor" strokeWidth="1.5" />
                <path d="M18 14.5l14 8.5-14 8.5z" fill="currentColor" />
              </svg>
            </div>
            {w.screenshotCaption ? (
              <figcaption className="dt-figcaption">{w.screenshotCaption}</figcaption>
            ) : null}
          </figure>
        )}

        <div
          className="st-prose"
          // First-party markdown from content/workshops — rendered at build time.
          dangerouslySetInnerHTML={{ __html: w.html }}
        />

        {w.status === "past" && related && relatedHref ? (
          <Link
            href={relatedHref}
            className="dt-cross"
            style={{ "--type-color": "var(--c-workshop)" } as CSSProperties}
          >
            <p className="dt-cross-title">
              {related.title} — grab the {relatedLabel?.toLowerCase()}
            </p>
            <span aria-hidden>→</span>
          </Link>
        ) : null}

        {w.status === "upcoming" ? (
          <div className="ws-cta">
            <p className="ws-cta-title">
              Workshops run live inside Vibe Marketers.
            </p>
            <p className="ws-cta-body">
              Join the community to get the calendar invite, attend this
              build-along live, and ask questions while it happens.
            </p>
            <a
              href={LINKS.join}
              target="_blank"
              rel="noopener"
              className="btn-solid"
              style={{ "--btn-color": "var(--c-workshop)" } as CSSProperties}
            >
              <SkoolIcon />
              Join Vibe Marketers →
            </a>
            <p className="ws-cta-caption mono">
              Free to join · the replay lands inside right after
            </p>
          </div>
        ) : (
          <div className="ws-cta">
            <p className="ws-cta-title">Missed it? Catch the next one live.</p>
            <p className="ws-cta-body">
              Drop your email and I&apos;ll tell you when the next lab is on
              the calendar — one note per session, nothing else.
            </p>
            <Capture
              helper="One email when the next session gets a date. No spam."
              cta="Notify me →"
              focusVariant="mauve"
            />
            <p className="ws-cta-caption mono">
              Replay of this session is inside{" "}
              <a href={LINKS.join} target="_blank" rel="noopener">
                Vibe Marketers →
              </a>
            </p>
          </div>
        )}

        {w.status === "upcoming" && related && relatedHref ? (
          <Link
            href={relatedHref}
            className="dt-cross"
            style={{ "--type-color": "var(--c-workshop)" } as CSSProperties}
          >
            <span>
              <span className="dt-cross-kicker mono">{relatedLabel}</span>
              <p className="dt-cross-title">{related.title}</p>
            </span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}

        <ShareRow
          mdPath={`/workshops/${w.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={w.title}
        />

        <p className="dt-back">
          <Link href="/browse?type=workshops">← All workshops</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
