import type { CSSProperties } from "react"
import Link from "next/link"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { ShareRow } from "@/components/site/share-row"
import { JsonLd } from "@/components/site/json-ld"
import { BuildInvitation } from "@/components/site/build-invitation"
import { buildGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo"
import { shortDate, type Build } from "@/lib/content"
import { HOME, TYPE_COLORS } from "@/lib/site-content"

/**
 * Build detail (spec 05) — the fourth content-type template: crumb → title
 * → lede → byline (with the "sanitized example" tag) → body (rendered
 * markdown, which supplies its own figures/step-lists/results-strip/status-
 * strip via the lib/content.ts renderer hooks) → the end-of-Build
 * working-session invitation (template-level, not markdown) → share →
 * newsletter → back link. Builds share the Post gold accent.
 */
export function BuildPage({ build }: { build: Build }) {
  const href = `/builds/${build.slug}`
  const typeColor = TYPE_COLORS.builds

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell st-shell-article" style={{ "--type-color": typeColor } as CSSProperties}>
        <JsonLd data={buildGraph(build)} />
        <header className="st-head">
          <Crumb
            typeLabel="Builds"
            typeHref="/browse?type=builds"
            typeColor={typeColor}
            leaf={build.slug}
          />
          <h1 className="serif st-h1 h1-build an-blur">{build.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".2s" }}>
            {build.description}
          </p>
          <p
            className="dt-byline dt-byline-author an-up"
            style={{ animationDelay: ".32s" }}
          >
            <img
              src={HOME.avatar}
              alt=""
              width={24}
              height={24}
              className="dt-byline-avatar"
            />
            <span>
              <span className="dt-byline-name">{AUTHOR_NAME}</span> ·{" "}
              {shortDate(build.date)}
              {build.sanitized ? (
                <>
                  {" "}
                  · <span className="dt-byline-tag">sanitized example</span>
                </>
              ) : null}
            </span>
          </p>
        </header>

        <div
          className="st-prose"
          // First-party markdown from content/builds — rendered at build
          // time, including the placeholder-figure/results-strip/status-strip/
          // ships-artifact renderer hooks in lib/content.ts.
          dangerouslySetInnerHTML={{ __html: build.html }}
        />

        <BuildInvitation />

        <ShareRow
          mdPath={`/builds/${build.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={build.title}
        />

        <div className="st-post-capture">
          <Capture
            helper="New builds, skills, and connectors as they ship. No spam."
          />
        </div>

        <p className="dt-back">
          <Link href="/browse?type=builds">← All builds</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
