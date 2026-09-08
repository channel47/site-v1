import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "How channel47 handles the little data it collects.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1 an-blur">Privacy</h1>
          <p className="st-byline mono">Last updated September 2026</p>
        </header>

        <div className="st-prose">
          <p>channel47 collects as little as possible. Concretely:</p>
          <ul>
            <li>
              <strong>Email address.</strong> If you subscribe, your email is
              stored with Kit (ConvertKit), the service that sends the
              newsletter. It&apos;s used to send you the emails described at
              signup — occasional projects, experiments, and notes — and
              nothing else. Every email includes an unsubscribe link, and
              unsubscribing removes you.
            </li>
            <li>
              <strong>Anonymous analytics.</strong> The site uses Vercel
              Analytics to count page views and actions such as opening a
              related piece, copying an install command, or requesting a
              newsletter subscription. Custom events include the page and
              a general source such as search, GitHub, or email. They do not
              include your email address, form text, or arbitrary URL parameters.
              The entry page and source are kept in session storage for this
              browser tab so internal navigation keeps the original source.
              This does not create a visitor identifier or an advertising cookie.
            </li>
          </ul>
          <p>
            Your email is never sold, rented, or shared beyond the service that
            sends the newsletter. To have your data deleted, unsubscribe from
            any email or write to the address in the footer of any newsletter
            issue.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
