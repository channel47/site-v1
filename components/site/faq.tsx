"use client"

import { useState } from "react"
import { Unfold } from "./unfold"
import type { FaqItem } from "@/lib/content"

/**
 * "Common questions" — the detail templates' FAQ accordion (transcribed
 * from the Channel47 FAQ design file). Sits after the article body, before
 * the Share row. Single-open rows on the shared unfold pattern; the "+"
 * rotates 45° into an accent ×, and the question shifts to the page's
 * --type-color on hover — the accent follows the content type via the
 * article shell, exactly like every other detail-page accent. First row
 * open on load.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  if (items.length === 0) return null

  return (
    <section className="faq" aria-label="Common questions">
      <h2 className="st-section-h2 faq-h2">Common questions</h2>
      <div className="faq-rows">
        {items.map((item, i) => (
          <Unfold
            key={i}
            className="faq-row"
            triggerClassName="faq-q"
            open={openIdx === i}
            onToggle={(next) => setOpenIdx(next ? i : null)}
            trigger={
              <>
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-plus" aria-hidden>
                  +
                </span>
              </>
            }
          >
            <p className="faq-a">{item.a}</p>
          </Unfold>
        ))}
      </div>
    </section>
  )
}
