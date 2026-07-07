import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Rows } from "@/components/site/rows"
import { getFeedItems } from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Browse — Channel 47",
  description:
    "Everything in the Channel 47 library — posts, skills, and MCP connectors for marketers, filterable by type.",
  alternates: { canonical: "/browse" },
}

interface Props {
  searchParams: Promise<{ type?: string }>
}

/** Filter chips — All plus each populated type (round 12 Browse). Workshops
 * joins once dated session pages exist. */
const CHIPS = [
  { key: "all", label: "All" },
  { key: "posts", label: "Posts" },
  { key: "skills", label: "Skills" },
  { key: "connectors", label: "Connectors" },
] as const

/**
 * Browse — the library stacks: a restrained, fast, scannable catalog of
 * everything, pre-filterable via `?type=` (Home's category rows and the
 * drawer nav arrive here pre-set). Chips and matching row meta sit in ink at
 * rest; only the active type carries its identity colour (round 12).
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
          <h1 className="serif st-h1 an-blur">Browse</h1>
          <nav
            className="br-chips an-up"
            style={{ animationDelay: ".2s" }}
            aria-label="Filter by type"
          >
            {CHIPS.map((chip) => {
              const on = active === chip.key
              const color = chip.key === "all" ? undefined : TYPE_COLORS[chip.key]
              return (
                <Link
                  key={chip.key}
                  href={chip.key === "all" ? "/browse" : `/browse?type=${chip.key}`}
                  className={`br-chip mono${on ? " br-chip-on" : ""}`}
                  style={on && color ? ({ "--chip-color": color } as CSSProperties) : undefined}
                  aria-current={on ? "true" : undefined}
                >
                  {chip.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <div className="br-list">
          <Rows items={items} activeType={active === "all" ? undefined : active} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
