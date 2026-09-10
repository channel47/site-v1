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
  const content = (
    <>
      {children}
      <span className="control-caption" aria-hidden="true">{label}</span>
    </>
  );
  return href === "/rss.xml" ? (
    <a href={href} className="icon-btn utility-link" aria-label={label}>{content}</a>
  ) : (
    <Link href={href} className="icon-btn utility-link" aria-label={label}>{content}</Link>
  );
}
