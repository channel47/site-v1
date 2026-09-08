import type { CSSProperties } from "react"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { BackToBrowse } from "./browse-navigation"
import { ReadingEnd } from "./reading-end"
import { Faq } from "@/components/site/faq"
import { ShareRow } from "@/components/site/share-row"
import { JsonLd } from "@/components/site/json-ld"
import { noteGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo"
import { shortDate, readTime, PROJECT_STATUS_LABELS, type Note, type Project } from "@/lib/content"
import { HOME, TYPE_COLORS } from "@/lib/site-content"

/** Shared writing layout for notes and general projects. Rich media and
 * project status are optional; publishing a short entry needs no extra sections. */
export function NotePage({ note, section = "notes" }: { note: Note | Project; section?: "notes" | "projects" }) {
  const href = `/${section}/${note.slug}`
  const typeColor = TYPE_COLORS[section]
  const minutes = readTime(note.markdown)

  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell reading-page" style={{ "--type-color": typeColor } as CSSProperties}>
        <article>
          <JsonLd data={noteGraph(note, section)} />
          <header className="st-head">
            <BackToBrowse href={`/browse?type=${section}`} className="reading-back">← All {section}</BackToBrowse>
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
                {minutes > 1 ? ` · ${minutes} min read` : null}
                {"status" in note && note.status ? ` · ${PROJECT_STATUS_LABELS[note.status]}` : null}
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
            <figure className="nt-video an-up" style={{ animationDelay: ".4s" }}>
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

          <ShareRow
            mdPath={`${href}.md`}
            url={`${SITE_URL}${href}`}
            title={note.title}
          />

        </article>
        <ReadingEnd href={href} section={section} />
      </main>

      <SiteFooter />
    </div>
  )
}
