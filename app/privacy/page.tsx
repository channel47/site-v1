import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"

export const metadata: Metadata = {
  title: "Privacy — Channel 47",
  description: "How Channel 47 handles the little data it collects.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1">Privacy</h1>
          <p className="st-byline mono">Last updated July 2026</p>
        </header>

        <div className="st-prose">
          <p>Channel47 collects as little as possible. Concretely:</p>
          <ul>
            <li>
              <strong>Email address.</strong> If you subscribe, your email is
              stored with Kit (ConvertKit), the service that sends the
              newsletter. It&apos;s used to send you the emails described at
              signup — new releases and live-session announcements — and
              nothing else. Every email includes an unsubscribe link, and
              unsubscribing removes you.
            </li>
            <li>
              <strong>Anonymous analytics.</strong> The site uses Vercel
              Analytics to count page views. It does not use advertising
              trackers or third-party ad cookies.
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
