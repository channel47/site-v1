import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Rows } from "@/components/site/rows"
import { TypeIcon, AllTypesIcon } from "@/components/site/type-icon"
import { getFeedItems } from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"
import { CONTENT_GROUPS, contentGroup, isContentFormat } from "@/lib/discovery"
import { redirect } from "next/navigation"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Browse",
  description:
    "Projects and notes by Jackson Dean: software, experiments, and observations.",
  path: "/browse",
})

interface Props {
  searchParams: Promise<{ type?: string }>
}

const CHIPS = [
  { key: "all", label: "All", icon: null },
  ...CONTENT_GROUPS.map((group) => ({ key: group.key, label: group.title, icon: group.icon })),
]

/** URL-backed filters keep the catalog shareable and browser history useful. */
export default async function BrowsePage({ searchParams }: Props) {
  const { type } = await searchParams
  if (type && isContentFormat(type) && type !== contentGroup(type)) {
    redirect(`/browse?type=${contentGroup(type)}`)
  }
  const active = CHIPS.find((chip) => chip.key === type)?.key ?? "all"
  const allItems = getFeedItems()
  const items = allItems.filter((item) => active === "all" || item.group === active)

  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-full">
        <header className="st-head st-head-browse">
          <h1 className="serif st-h1 an-blur">Browse</h1>
          <p className="browse-intro">Projects and notes, collected in one place.</p>
          <nav
            className="br-chips an-up"
            style={{ animationDelay: ".2s" }}
            aria-label="Filter by type"
          >
            {CHIPS.map((chip) => {
              const on = active === chip.key
              const color = chip.icon ? TYPE_COLORS[chip.icon] : undefined
              return (
                <Link
                  key={chip.key}
                  href={chip.key === "all" ? "/browse" : `/browse?type=${chip.key}`}
                  scroll={false}
                  className={`br-chip${on ? " br-chip-on" : ""}`}
                  style={color ? ({ "--chip-color": color } as CSSProperties) : undefined}
                  aria-current={on ? "true" : undefined}
                >
                  {chip.icon === null ? (
                    <AllTypesIcon className="br-chip-icon" />
                  ) : (
                    <TypeIcon type={chip.icon} className="br-chip-icon" />
                  )}
                  {chip.label}
                  <span className="br-chip-count">{chip.key === "all" ? allItems.length : allItems.filter((item) => item.group === chip.key).length}</span>
                </Link>
              )
            })}
          </nav>
        </header>

        <div className="br-list" aria-label={`${active === "all" ? "All entries" : active}: ${items.length}`}>
          {items.length ? <Rows items={items} /> : <p className="browse-intro">Nothing here yet. New work will appear here when it’s published.</p>}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
