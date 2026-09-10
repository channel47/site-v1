import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Rows } from "@/components/site/rows";
import { getFeedItems } from "@/lib/content";
import { CONTENT_GROUPS } from "@/lib/discovery";
import { pageMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";
export const metadata = pageMetadata({
  title: "Index",
  description: "Projects and notes by Jackson Dean.",
  path: "/browse",
});
export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const legacy: Record<string, string> = {
    skills: "projects",
    connectors: "projects",
    posts: "notes",
    workshops: "notes",
  };
  if (type && legacy[type]) redirect(`/browse?type=${legacy[type]}`);
  const active = CONTENT_GROUPS.some((group) => group.key === type)
    ? type
    : "all";
  const items = getFeedItems().filter(
    (item) => active === "all" || item.group === active,
  );
  return (
    <div className="st-page">
      <SiteHeader />
      <main id="main-content" className="st-shell index-page">
        <header className="st-head">
          <h1 className="st-h1">Index</h1>
          <nav className="index-filters" aria-label="Filter by type">
            {[{ key: "all", title: "All" }, ...CONTENT_GROUPS].map((group) => (
              <Link
                key={group.key}
                href={
                  group.key === "all" ? "/browse" : `/browse?type=${group.key}`
                }
                scroll={false}
                aria-current={active === group.key ? "page" : undefined}
              >
                {group.title}
              </Link>
            ))}
          </nav>
        </header>
        {items.length ? <Rows items={items} /> : <p>No pieces here yet.</p>}
      </main>
      <SiteFooter />
    </div>
  );
}
