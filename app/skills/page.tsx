import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { getAssets } from "@/lib/content"

export const metadata: Metadata = {
  title: "Skills index — Channel 47",
  description:
    "Every skill in the Channel 47 library — agentic marketing systems for research, media buying, and distribution, free to install.",
  alternates: { canonical: "/skills" },
}

/**
 * The static Skills index (PLAN §3) — a single server-rendered flat list of
 * every Skill page. An SEO crawl target that guarantees each artifact is
 * linkable without JS; the interactive filter lives on /browse?type=skills
 * and points at the same content by design.
 */
export default function SkillsIndexPage() {
  const skills = getAssets("skill")

  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1">Skills</h1>
          <p className="st-intro">
            Agentic marketing systems — research pipelines, media buying
            routines, distribution tools — that install into Claude Code,
            Cursor, and any SKILL.md-compatible agent. Each one was built and
            used in real ad accounts first.
          </p>
        </header>

        <ul className="st-rows si-rows">
          {skills.map((skill) => (
            <li key={skill.slug}>
              <Link href={`/skills/${skill.slug}`} className="st-row">
                <span className="st-row-main">
                  <span className="st-row-title serif">{skill.title}</span>
                  <span className="st-row-desc">{skill.description}</span>
                </span>
                <span className="st-row-meta mono">{skill.slug}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  )
}
