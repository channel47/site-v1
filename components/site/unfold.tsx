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
  className,
}: {
  /** Static trigger content — the "+" glyph's rotation into an "×" is driven
   * purely by CSS off `aria-expanded`, so this never needs the open state. */
  trigger: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  triggerClassName?: string
  /** Class for the outer wrapper — needed when siblings share a row (the
   * footer's groups) so a closed panel's content can't widen its flex item
   * even while collapsed to zero height. */
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={className}>
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
