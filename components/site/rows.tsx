import Link from "next/link"
import { shortDate, type FeedItem } from "@/lib/content"

/**
 * Editorial content rows — the Browse-row treatment from PLAN §5, shared by
 * Browse and Home's "Latest from the channel" feed: title · one-liner ·
 * type/date meta.
 */
export function Rows({ items }: { items: FeedItem[] }) {
  return (
    <ul className="st-rows">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="st-row">
            <span className="st-row-main">
              <span className="st-row-title serif">{item.title}</span>
              <span className="st-row-desc">{item.description}</span>
            </span>
            <span className="st-row-meta mono">
              {item.typeLabel} · {shortDate(item.date)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
