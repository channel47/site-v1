import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { ShareRow } from "@/components/site/share-row"
import { getWorkshopBySlug, getWorkshops, shortDate, getAssetBySlug } from "@/lib/content"
import { LINKS, TYPE_COLORS } from "@/lib/site-content"
import { SITE_URL } from "@/lib/seo"

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
  const related = w.relatedAsset ? getAssetBySlug(w.relatedAsset.type, w.relatedAsset.slug) : undefined
  const href = `/workshops/${w.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell">
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
              <span className="ws-plate-live mono">Live session</span>
              <span className="ws-plate-dur">{w.duration}</span>
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
        ) : null}

        <div
          className="st-prose"
          // First-party markdown from content/workshops — rendered at build time.
          dangerouslySetInnerHTML={{ __html: w.html }}
        />

        {w.status === "upcoming" ? (
          <div className="ws-cta">
            <p className="ws-cta-title">
              Workshops run live inside Vibe Marketers.
            </p>
            <p className="ws-cta-body">
              Join the community to attend live, ask questions as it&apos;s
              built, and get every past session&apos;s replay.
            </p>
            <a
              href={LINKS.join}
              target="_blank"
              rel="noopener"
              className="btn-solid"
              style={{ "--btn-color": "var(--c-workshop)" } as CSSProperties}
            >
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
              The replay is inside Vibe Marketers now. Get a heads-up the
              moment the next session gets a date.
            </p>
            <Capture
              helper="One email when the next session gets a date. No spam."
              cta="Notify me →"
              focusVariant="mauve"
            />
          </div>
        )}

        {related ? (
          <Link
            href={`/${w.relatedAsset!.type === "skill" ? "skills" : "connectors"}/${related.slug}`}
            className="dt-cross"
            style={{ "--type-color": "var(--c-workshop)" } as CSSProperties}
          >
            <span>
              <span className="dt-cross-kicker mono">
                {w.relatedAsset!.type === "skill" ? "Skill" : "Connector"}
              </span>
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
          <Link href="/browse?type=workshops">← More workshops</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
