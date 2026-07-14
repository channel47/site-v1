import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: "Terms of use for channel47.dev.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">Terms</h1>
          <p className="st-byline mono">Last updated July 2026</p>
        </header>

        <div className="st-prose">
          <p>
            channel47.dev publishes agentic systems, tools, and writing, much
            of it grown out of real marketing work. Using the site means
            agreeing to the following, all of it unsurprising:
          </p>
          <ul>
            <li>
              <strong>Tools are provided as-is.</strong> The skills and MCP
              connectors published here are open source and licensed under the
              terms in their respective repositories. They ship without
              warranty; you run them against your own accounts at your own
              risk, and you should review what a tool does before arming it.
            </li>
            <li>
              <strong>Content is educational.</strong> Posts and sessions
              describe what worked in real accounts, but no outcome is
              promised. Marketing results depend on your product, your
              account, and your execution.
            </li>
            <li>
              <strong>Numbers in stories are illustrative.</strong> Anecdotes
              draw on real client work with details anonymized and written as
              composites.
            </li>
            <li>
              <strong>Don&apos;t misuse the site.</strong> No scraping the
              subscribe endpoint, no attempting to disrupt the service.
            </li>
          </ul>
          <p>
            Live sessions and community membership run on Skool and are
            additionally governed by Skool&apos;s own terms. Questions about
            any of this: reply to any newsletter issue.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
