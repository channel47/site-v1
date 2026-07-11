import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Agentic Systems Working Session",
  description: "Book a one-to-one working session with Jackson Dean.",
  path: "/session",
})

/**
 * Placeholder for the working-session offer page (spec 06) — nav and footer
 * already link here (Wave 1). Wave 3 replaces this with the full two-column
 * offer-card layout: intro, "what working together looks like", proof
 * builds, personal block, expectation boundary, and the Cal.com booking
 * card (LINKS.booking in lib/site-content.ts).
 */
export default function SessionPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">Agentic Systems Working Session</h1>
        </header>
      </main>

      <SiteFooter />
    </div>
  )
}
