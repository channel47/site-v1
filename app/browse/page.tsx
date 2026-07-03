import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Rows } from "@/components/site/rows"
import { getFeedItems } from "@/lib/content"

export const metadata: Metadata = {
  title: "Browse — Channel 47",
  description:
    "Everything in the Channel 47 library — posts, skills, and MCP connectors for marketers, filterable by type.",
  alternates: { canonical: "/browse" },
}

interface Props {
  searchParams: Promise<{ type?: string }>
}

/** Filter chips — All plus each populated type (PLAN §5 Browse). */
const CHIPS = [
  { key: "all", label: "All" },
  { key: "posts", label: "Posts" },
  { key: "skills", label: "Skills" },
  { key: "connectors", label: "Connectors" },
] as const

/**
 * Browse — the library stacks: a restrained, fast, scannable catalog of
 * everything, pre-filterable via `?type=` (the Home type cards arrive here
 * pre-set). Workshops joins the chips when dated session pages exist; until
 * then the Live page carries that type.
 */
export default async function BrowsePage({ searchParams }: Props) {
  const { type } = await searchParams
  const active =
    CHIPS.find((c) => c.key === type)?.key ?? ("all" as (typeof CHIPS)[number]["key"])
  const items = getFeedItems().filter(
    (item) => active === "all" || item.type === active,
  )

  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1">Browse</h1>
          <nav className="br-chips" aria-label="Filter by type">
            {CHIPS.map((chip) => (
              <Link
                key={chip.key}
                href={chip.key === "all" ? "/browse" : `/browse?type=${chip.key}`}
                className={`br-chip mono${active === chip.key ? " br-chip-on" : ""}`}
                aria-current={active === chip.key ? "true" : undefined}
              >
                {chip.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="br-list">
          <Rows items={items} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
