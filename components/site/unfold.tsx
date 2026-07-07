"use client"

import { useState, type ReactNode } from "react"

/**
 * Shared disclosure pattern — Home's category rows and the footer's link
 * groups both open/close independently (no accordion-exclusivity) via a
 * `grid-template-rows: 0fr → 1fr` transition.
 */
export function Unfold({
  trigger,
  children,
  defaultOpen = false,
  triggerClassName,
}: {
  /** Static trigger content — the "+" glyph's rotation into an "×" is driven
   * purely by CSS off `aria-expanded`, so this never needs the open state. */
  trigger: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      <div className="uf-body" data-open={open}>
        <div>{children}</div>
      </div>
    </div>
  )
}
