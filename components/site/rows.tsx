import type { CSSProperties } from "react"
import { BrowseEntryLink } from "./browse-navigation"
import { shortDate, type FeedItem } from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"

/** Browse entries retain their source format as useful secondary metadata. */
export function Rows({ items }: { items: FeedItem[] }) {
  return (
    <ul className="st-rows">
      {items.map((item) => (
        <li key={item.href}>
          <BrowseEntryLink
            href={item.href}
            className="st-row"
            style={{ "--type-color": TYPE_COLORS[item.type] } as CSSProperties}
          >
            <span className="st-row-meta">
              <span className="st-row-meta-type">{item.typeLabel}</span>
              <span className="st-row-meta-date"> · {shortDate(item.date)}</span>
            </span>
            <span className="st-row-main">
              <span className="st-row-title serif">{item.title}</span>
              <span className="st-row-desc">{item.description}</span>
            </span>
          </BrowseEntryLink>
        </li>
      ))}
    </ul>
  )
}
