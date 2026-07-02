import { SiteHeader } from "./site-header"
import { TypeCards } from "./type-cards"
import { NextLive } from "./next-live"
import { LatestFeed } from "./latest-feed"
import { EmailCapture } from "./email-capture"
import { SiteFooter } from "./site-footer"
import { HOME } from "@/lib/landing-content"

/**
 * Home — the current early-access page evolved into the channel's front door
 * (docs/PLAN.md §5). Top to bottom: the compact icon header, the reframed POV
 * hero, the six riso type gateways, a quiet next-live strip, the "Latest from
 * the channel" feed, a condensed signed note → capture, and the SEO footer.
 *
 * Chrome runs on the greige OKLCH palette that flips light/dark by system
 * preference (globals.css); the type cards stay vivid in both. The long-form
 * trenches narrative now lives on /about — Home carries only the short note.
 */
export function Home() {
  return (
    <div className="ea-page">
      <SiteHeader />

      <div className="ea-body">
        {/* Hero — reframed POV headline + one-line subhead */}
        <header className="ea-hero ea-shell">
          <h1 className="serif ea-h1">{HOME.headline}</h1>
          <p className="ea-subhead">{HOME.subhead}</p>
        </header>

        {/* The six type gateways — primary navigation */}
        <TypeCards />

        {/* Below the cards: prove the channel publishes, then earn the ask */}
        <div className="ea-copycol ea-shell">
          <NextLive />
          <LatestFeed />

          <div className="ea-note">
            <p className="ea-note-body">{HOME.note}</p>
            <p className="ea-note-sig mono">{HOME.signature}</p>
          </div>

          <EmailCapture />
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
