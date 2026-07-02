import Link from "next/link"
import { HOME, LATEST } from "@/lib/landing-content"

/**
 * "Latest from the channel" (PLAN §5): a few recent assets as restrained
 * editorial rows — title · type · date. This is the neutral "library stacks"
 * mood that balances the vivid cards, and it's proof the channel actually
 * publishes. The rows reuse the same shape Browse will render.
 */
export function LatestFeed() {
  return (
    <section className="lf" aria-labelledby="lf-heading">
      <div className="lf-head">
        <h2 id="lf-heading" className="serif lf-title">
          {HOME.feedHeading}
        </h2>
        <Link href="/browse" className="lf-all mono">
          Browse all →
        </Link>
      </div>
      <ul className="lf-list">
        {LATEST.map((item) => (
          <li key={item.title}>
            <Link href={item.href} className="lf-row">
              <span className="lf-row-title">{item.title}</span>
              <span className="lf-meta mono">
                <span className="lf-type">{item.type}</span>
                {item.meta ? <span className="lf-date">· {item.meta}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
