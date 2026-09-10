import Link from "next/link";
import type { ReactNode } from "react";

export function UtilityLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const Tag = href.startsWith("/") && href !== "/rss.xml" ? Link : "a";
  return (
    <Tag href={href} className="icon-btn utility-link" aria-label={label}>
      {children}
      <span className="control-caption" aria-hidden="true">{label}</span>
    </Tag>
  );
}
