import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { LINKS } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "About — Channel 47",
  description:
    "Channel 47 is where Jackson Dean publishes the agentic marketing systems he actually runs — skills, connectors, and agents built across seven years and $3M+ in ad spend.",
  alternates: { canonical: "/about" },
}

/**
 * About (PLAN §5) — the home for the long-form trenches narrative that used to
 * live on the landing page. Editorial single column; Jackson signs his work
 * here, understated.
 */
export default function AboutPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">About Channel47</h1>
        </header>

        <div className="st-prose">
          <p>
            Seven years and three million dollars in ad spend taught me the
            wins were never the clever creative or the lucky audience.
            Underneath every account that scaled was a system: a repeatable way
            to find the angle, build the page, and read the numbers.
          </p>
          <p>
            For years those systems lived in my head and a sprawl of
            half-finished docs. Agents changed that. The judgment I used to
            carry around is now something I can hand over directly — as skills,
            agents, connectors, and the playbooks that tie them together.
          </p>
          <p>
            Channel47 is where they land. Every tool in the library exists
            because something in a real ad account broke, leaked, or took too
            long — and each one ships with the story of why. Nothing here is
            theory; it&apos;s the blade, sharpened in use, handed over.
          </p>
          <p>
            The tools are free to grab. If you want to watch them get built —
            and build alongside — I run{" "}
            <Link href="/browse?type=workshops" className="st-accent-link">
              live monthly sessions
            </Link>{" "}
            inside the{" "}
            <a
              href={LINKS.join}
              target="_blank"
              rel="noopener"
              className="st-accent-link"
            >
              Vibe Marketers
            </a>{" "}
            community on Skool.
          </p>
          <p>
            I&apos;m Jackson Dean. I run growth for ecommerce and DTC brands,
            and this is the workbench.
          </p>
        </div>

        <div className="st-post-capture">
          <Capture />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
