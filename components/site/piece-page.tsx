import { SiteHeader } from "./header";
import { SiteFooter } from "./footer";
import { ArticleBreadcrumb } from "./browse-navigation";
import { ReadingEnd } from "./reading-end";
import { CopyButton } from "./copy-button";
import { CodeCopyButtons } from "./code-copy-buttons";
import { SourceRow } from "./source-row";
import { Faq } from "./faq";
import { SharePopover } from "./share-popover";
import { JsonLd } from "./json-ld";
import { noteGraph, projectGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo";
import {
  shortDate,
  getStoryDate,
  readTime,
  splitArticleAtVideo,
  PROJECT_STATUS_LABELS,
  type Note,
  type Project,
} from "@/lib/content";
import { marked } from "marked";
import Link from "next/link";
import { AuthorPortrait } from "./author-portrait";

/** One reading measure and one template. Project instructions and video are
 * optional parts of a piece, not separate design systems. */
export function PiecePage({
  entry,
  section = "notes",
}: {
  entry: Note | Project;
  section?: "notes" | "projects";
}) {
  const href = `/${section}/${entry.slug}`;
  const project = section === "projects" ? (entry as Project) : undefined;
  const minutes = readTime(entry.markdown);
  const { beforeVideo, afterVideo } = splitArticleAtVideo(entry);
  return (
    <div className="st-page">
      <SiteHeader />
      <main id="main-content" className="st-shell reading-page">
        <article className="piece-article" data-reading-path={href}>
          <JsonLd
            data={
              project?.repo ? projectGraph(project) : noteGraph(entry, section)
            }
          />
          <header className="piece-head">
            <ArticleBreadcrumb section={section} title={entry.title} />
            <h1>{entry.title}</h1>
            <div className="piece-byline">
              <AuthorPortrait alt="" />
              <div className="piece-author-details">
                <Link href="/about" className="piece-author">{AUTHOR_NAME}</Link>
                <p className="piece-meta">
                  <time dateTime={getStoryDate(entry)}>{shortDate(getStoryDate(entry))}</time>
                  {minutes > 1 ? <span>{minutes} min read</span> : null}
                  {project?.status ? (
                    <span>{PROJECT_STATUS_LABELS[project.status]}</span>
                  ) : null}
                  {entry.sanitized ? <span>Sanitized example</span> : null}
                </p>
              </div>
              <SharePopover mdPath={`${href}.md`} url={`${SITE_URL}${href}`} title={entry.title} />
            </div>
          </header>
          {beforeVideo ? <div className="st-prose piece-prose" dangerouslySetInnerHTML={{ __html: beforeVideo }} /> : null}
          {entry.video ? (
            <figure className="piece-video" id="walkthrough">
              <video
                controls
                playsInline
                preload="none"
                poster={entry.video.poster}
                aria-describedby={
                  entry.video.caption ? "video-caption" : undefined
                }
              >
                <source src={entry.video.src} type="video/mp4" />
                <track
                  src={entry.video.captions}
                  kind="captions"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support embedded video.{" "}
                <a href={entry.video.src}>Open the walkthrough.</a>
              </video>
              {entry.video.caption ? (
                <figcaption id="video-caption">
                  {entry.video.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          {afterVideo ? <div className="st-prose piece-prose" dangerouslySetInnerHTML={{ __html: afterVideo }} /> : null}
          <CodeCopyButtons key={href} />
          {project?.install ? (
            <section className="project-install" id="install" aria-label="Install">
              <div className="install-head">
                <span>Install</span>
                <CopyButton
                  event="install_copy"
                  title="Copy install command"
                  text={project.install}
                />
              </div>
              <pre>
                <code>{project.install}</code>
              </pre>
              {project.pairing ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: marked.parseInline(project.pairing, {
                      async: false,
                    }),
                  }}
                />
              ) : null}
              {project.repo ? <SourceRow href={project.repo} /> : null}
            </section>
          ) : null}
          {entry.faqs?.length ? <Faq items={entry.faqs} /> : null}
        </article>
        <ReadingEnd href={href} newsletter={entry.newsletter} />
      </main>
      <SiteFooter />
    </div>
  );
}
