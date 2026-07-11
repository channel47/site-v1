import type { CSSProperties } from "react"
import Link from "next/link"
import { shortDate, type FeedItem } from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"

/**
 * Editorial content rows — the v2 Browse-row tightening (spec 04): title ·
 * one-liner · a 116px right-aligned meta column with the type name in its
 * accent color and the date in faint ink. `activeType` (Browse's current
 * filter) is accepted for compatibility but no longer changes the row
 * styling — every row's type label carries its identity color now.
 */
export function Rows({
  items,
  activeType: _activeType,
}: {
  items: FeedItem[]
  activeType?: FeedItem["type"]
}) {
  return (
    <ul className="st-rows">
      {items.map((item, i) => (
        <li
          key={item.href}
          className="an-up"
          style={{ animationDelay: `${0.38 + Math.min(i * 0.04, 0.6)}s` }}
        >
          <Link
            href={item.href}
            className="st-row"
            style={{ "--type-color": TYPE_COLORS[item.type] } as CSSProperties}
          >
            <span className="st-row-meta mono">
              <span className="st-row-meta-type">{item.typeLabel}</span>
              <span className="st-row-meta-date"> · {shortDate(item.date)}</span>
            </span>
            <span className="st-row-main">
              <span className="st-row-title serif">{item.title}</span>
              <span className="st-row-desc">{item.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
