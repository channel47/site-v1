import Link from "next/link"
import { getNextRead } from "@/lib/content"
import { Capture } from "./capture"
import { BackToBrowse } from "./browse-navigation"

/** One relevant next piece, followed by one quiet subscription invitation. */
export function ReadingEnd({ href, section }: { href: string; section: "notes" | "projects" }) {
  const next = getNextRead(href)
  return (
    <aside className="reading-end" aria-label="Keep exploring">
      {next ? (
        <Link href={next.href} className="next-read">
          <span className="editorial-label">{next.group === "notes" ? "Read next" : "Explore the project"}</span>
          <span className="next-read-title">{next.title}<span aria-hidden="true"> ↗</span></span>
          <span className="next-read-description">{next.description}</span>
        </Link>
      ) : null}
      <section className="reading-subscribe" aria-label="Subscribe">
        <h2>Follow what I’m working on.</h2>
        <Capture />
      </section>
      <p className="dt-back">
        <BackToBrowse href={`/browse?type=${section}`}>← All {section}</BackToBrowse>
      </p>
    </aside>
  )
}
