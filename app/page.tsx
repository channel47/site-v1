import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { TypeIcon } from "@/components/site/type-icon"
import { getEntryPreview, getFeedItems, getNotes, shortDate } from "@/lib/content"
import { HOME } from "@/lib/site-content"

export const metadata: Metadata = { alternates: { canonical: "/" } }

export default function Page() {
  const items = getFeedItems()
  const latest = getNotes()[0]
  const preview = latest ? getEntryPreview(latest) : undefined
  const latestHref = latest ? `/notes/${latest.slug}` : undefined
  const notes = items.filter((item) => item.group === "notes" && item.href !== latestHref).slice(0, 3)
  const projects = items.filter((item) => item.group === "projects")
  const selected = HOME.selectedProjects.flatMap((slug) => projects.filter((item) => item.href === `/projects/${slug}`))
  const selectedProjects = [...selected, ...projects.filter((item) => !selected.includes(item))].slice(0, 3)

  return (
    <div className="st-page">
      <SiteHeader home />
      <main className="st-shell st-shell-full editorial-home">
        <header className="home-intro">
          <h1 className="an-blur">{HOME.headline}</h1>
          <p className="an-up" style={{ animationDelay: ".2s" }}>{HOME.subhead}</p>
        </header>

        {latest ? (
          <section className="home-feature an-up" style={{ animationDelay: ".32s" }} aria-labelledby="latest-heading">
            <p className="editorial-label" id="latest-heading"><TypeIcon type="notes" /> Latest note</p>
            <Link href={latestHref!} className={`feature-link${preview ? " feature-with-image" : ""}`} aria-labelledby="featured-title">
              <div className="feature-copy">
                <h2 id="featured-title">{latest.title}</h2>
                <p>{latest.description}</p>
                <span className="feature-foot"><time dateTime={latest.date}>{shortDate(latest.date)}</time><span className="feature-read">Read the note <span aria-hidden="true">↗</span></span></span>
              </div>
              {preview ? (
                <figure className="feature-image">
                  <img src={preview.src} alt={preview.alt} fetchPriority="high" />
                </figure>
              ) : null}
            </Link>
          </section>
        ) : null}

        <div className="home-collections">
          {notes.length ? (
            <section className="home-note-selection" aria-labelledby="notes-heading">
              <div className="collection-heading">
                <h2 id="notes-heading">More notes</h2>
                <Link href="/browse?type=notes">All notes <span aria-hidden="true">↗</span></Link>
              </div>
              <ul className="selected-notes">
                {notes.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="selected-note">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <time dateTime={item.date}>{shortDate(item.date)}</time>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {selectedProjects.length ? (
            <section className="home-project-selection" aria-labelledby="projects-heading">
              <div className="collection-heading">
                <h2 id="projects-heading">Selected projects</h2>
                <Link href="/browse?type=projects">All projects <span aria-hidden="true">↗</span></Link>
              </div>
              <ul className="selected-projects">
                {selectedProjects.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="selected-project">
                      <TypeIcon type={item.type} className="selected-project-icon" />
                      <span><span className="selected-project-title">{item.title}<span aria-hidden="true"> ↗</span></span><span className="selected-project-description">{item.description}</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <section className="home-correspondence" aria-label="About Jackson and email updates">
          <div>
            <div className="home-bio-id">
              <img src={HOME.avatar} alt="" width={48} height={48} className="home-bio-avatar" />
              <span className="home-bio-text"><span className="home-bio-name">{HOME.name}</span><span className="home-bio-tag">{HOME.tagline}</span></span>
            </div>
            <p className="home-bio-note">{HOME.bio}</p>
          </div>
          <div className="home-subscribe">
            <h2>Follow what I’m working on.</h2>
            <Capture placement="home" />
            <Link href="/rss.xml" className="rss-alternative">Or subscribe via RSS <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
