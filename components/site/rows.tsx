import Link from "next/link"
import { shortDate, type FeedItem } from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"

/**
 * Editorial content rows — the Browse-row treatment (round 12): title ·
 * one-liner · type/date meta. At rest everything sits in ink; pass
 * `activeType` (Browse's current filter) to thread that type's identity
 * colour through the matching rows' meta label.
 */
export function Rows({
  items,
  activeType,
}: {
  items: FeedItem[]
  activeType?: FeedItem["type"]
}) {
  return (
    <ul className="st-rows">
      {items.map((item) => {
        const highlighted = activeType != null && activeType === item.type
        return (
          <li key={item.href}>
            <Link href={item.href} className="st-row">
              <span className="st-row-main">
                <span className="st-row-title serif">{item.title}</span>
                <span className="st-row-desc">{item.description}</span>
              </span>
              <span
                className="st-row-meta mono"
                style={highlighted ? { color: TYPE_COLORS[item.type] } : undefined}
              >
                {item.typeLabel} · {shortDate(item.date)}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
