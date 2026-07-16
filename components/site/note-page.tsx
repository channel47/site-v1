import type { CSSProperties } from "react"
import Link from "next/link"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { Faq } from "@/components/site/faq"
import { ShareRow } from "@/components/site/share-row"
import { JsonLd } from "@/components/site/json-ld"
import { NoteInvitation } from "@/components/site/note-invitation"
import { noteGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo"
import { shortDate, type Note } from "@/lib/content"
import { HOME, TYPE_COLORS } from "@/lib/site-content"

/**
 * Note detail (spec 05) — the fourth content-type template: crumb → title
 * → lede → byline (with the "sanitized example" tag) → body (rendered
 * markdown, which supplies its own figures/step-lists/results-strip/status-
 * strip via the lib/content.ts renderer hooks) → the end-of-Note
 * newsletter invitation (template-level, not markdown) → share →
 * newsletter → back link. Notes share the Post gold accent.
 */
export function NotePage({ note }: { note: Note }) {
  const href = `/notes/${note.slug}`
  const typeColor = TYPE_COLORS.notes

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell st-shell-article" style={{ "--type-color": typeColor } as CSSProperties}>
        <JsonLd data={noteGraph(note)} />
        <header className="st-head">
          <Crumb
            typeLabel="Notes"
            typeHref="/browse?type=notes"
            typeColor={typeColor}
            leaf={note.slug}
          />
          <h1 className="serif st-h1 h1-note an-blur">{note.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".2s" }}>
            {note.description}
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
              {shortDate(note.date)}
              {note.sanitized ? (
                <>
                  {" "}
                  · <span className="dt-byline-tag">sanitized example</span>
                </>
              ) : null}
            </span>
          </p>
        </header>

        {note.video ? (
          <figure className="nt-video an-up" style={{ animationDelay: ".44s" }}>
            <video
              controls
              playsInline
              preload="metadata"
              poster={note.video.poster}
              aria-describedby={note.video.caption ? `${note.slug}-video-caption` : undefined}
            >
              <source src={note.video.src} type="video/mp4" />
              <track
                src={note.video.captions}
                kind="captions"
                srcLang="en"
                label="English"
              />
              Your browser does not support embedded video. {" "}
              <a href={note.video.src}>Open the walkthrough.</a>
            </video>
            {note.video.caption ? (
              <figcaption
                id={`${note.slug}-video-caption`}
                className="st-shot-cap mono"
              >
                {note.video.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div
          className="st-prose"
          // First-party markdown from content/notes — rendered at build
          // time, including the placeholder-figure/results-strip/status-strip/
          // ships-artifact renderer hooks in lib/content.ts.
          dangerouslySetInnerHTML={{ __html: note.html }}
        />

        {note.faqs?.length ? <Faq items={note.faqs} /> : null}

        <NoteInvitation />

        <ShareRow
          mdPath={`/notes/${note.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={note.title}
        />

        <div className="st-post-capture">
          <Capture
            helper="New notes, skills, and connectors as they ship. No spam."
          />
        </div>

        <p className="dt-back">
          <Link href="/browse?type=notes">← All notes</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
