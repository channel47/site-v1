import { BrowseEntryLink } from "./browse-navigation";
import { shortDate, type FeedItem } from "@/lib/content";
export function Rows({ items }: { items: FeedItem[] }) {
  return (
    <ul className="st-rows">
      {items.map((item) => (
        <li key={item.href}>
          <BrowseEntryLink href={item.href} className="st-row">
            <span className="st-row-main">
              <span className="st-row-title">{item.title}</span>
              <span className="st-row-desc">{item.description}</span>
            </span>
            <span className="st-row-meta">
              {item.typeLabel}
              <time dateTime={item.date}>{shortDate(item.date)}</time>
            </span>
          </BrowseEntryLink>
        </li>
      ))}
    </ul>
  );
}
