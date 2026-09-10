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

      <main id="main-content" className="st-shell">
        <header className="st-head">
          <h1 className="st-h1">Privacy</h1>
          <p className="st-byline">Last updated September 2026</p>
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
              <strong>Usage analytics.</strong> The site uses Vercel Analytics
              for page views and Statsig for reading activity, such as time
              with an article visible, reaching its end, copying a prompt,
              opening a related piece, or requesting a newsletter subscription.
              These are estimates of activity, not proof that someone read or
              understood an article. Custom events include the page and
              a general source such as search, GitHub, or email. They do not
              include your email address, form text, or arbitrary URL parameters.
              The entry page and source are kept in session storage for this
              browser tab so internal navigation keeps the original source.
              Statsig receives a random identifier that lasts until the page
              reloads, so actions during navigation can be counted together.
              It is not saved to browser storage or linked to your email.
              Session recording and automatic click capture are disabled.
              Statsig events are skipped when your browser sends Do Not Track
              or Global Privacy Control. No advertising cookies are set.
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
