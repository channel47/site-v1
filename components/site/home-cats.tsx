"use client"

import { useState, type CSSProperties } from "react"
import Link from "next/link"
import { Unfold } from "./unfold"
import { CoverCard, type Cover } from "./cover-card"
import { TypeIcon } from "./type-icon"
import { TYPE_COLORS, type Category, type ContentTypeKey } from "@/lib/site-content"

export interface CategoryRow extends Category {
  covers: Cover[]
}

/** The shine-sweep twin for each row's link text (globals.css tokens). */
const SHINE_COLORS: Record<ContentTypeKey, string> = {
  posts: "var(--shine-post)",
  skills: "var(--shine-skill)",
  connectors: "var(--shine-connector)",
  workshops: "var(--shine-workshop)",
}

/**
 * Home's four category rows (round 14, confirmed) — an exclusive accordion,
 * one open at a time, each opening onto a short description and up to two
 * recent covers in the row's identity colour.
 */
export function HomeCats({ rows }: { rows: CategoryRow[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  // Bumped on every open so the open row's icon blocks rebuild each time,
  // not just the first — parity picks the keyframe, so it always replays.
  const [rowPulse, setRowPulse] = useState(0)

  return (
    <nav className="home-cats" aria-label="Browse by type">
      {rows.map((cat, idx) => (
        <div
          key={cat.key}
          className="home-cat an-up"
          style={
            {
              "--type-color": TYPE_COLORS[cat.key],
              "--shine-color": SHINE_COLORS[cat.key],
              animationDelay: `${(0.38 + idx * 0.06).toFixed(2)}s`,
            } as CSSProperties
          }
        >
          <Unfold
            triggerClassName="home-cat-toggle"
            open={openKey === cat.key}
            onToggle={(next) => {
              setOpenKey(next ? cat.key : null)
              if (next) setRowPulse((p) => p + 1)
            }}
            trigger={
              <>
                <span className="home-cat-lead">
                  <TypeIcon
                    type={cat.key}
                    className="home-cat-icon"
                    pulse={openKey === cat.key ? rowPulse : undefined}
                  />
                  <span className="home-cat-label">{cat.title}</span>
                </span>
                <span className="home-cat-plus" aria-hidden>
                  +
                </span>
              </>
            }
          >
            <div className="home-cat-body">
              <p className="home-cat-desc">{cat.desc}</p>
              {cat.covers.length > 0 ? (
                <div className="home-cat-covers">
                  {cat.covers.map((cover) => (
                    <CoverCard key={cover.href} cover={cover} />
                  ))}
                </div>
              ) : null}
              <Link href={cat.href} className="home-cat-link shine">
                {cat.linkText}
              </Link>
            </div>
          </Unfold>
        </div>
      ))}
    </nav>
  )
}
