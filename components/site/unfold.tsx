"use client"

import { useState, type ReactNode } from "react"

/**
 * Shared disclosure pattern via a `grid-template-rows: 0fr → 1fr` transition.
 * Uncontrolled by default (each instance opens/closes independently, as
 * Home's category rows once did). Pass `open` + `onToggle` to run it as one
 * row in an exclusive accordion instead — Home's category rows and the
 * footer's link groups both do this now, one open at a time.
 */
export function Unfold({
  trigger,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  triggerClassName,
  className,
}: {
  /** Static trigger content — the "+" glyph's rotation into an "×" is driven
   * purely by CSS off `aria-expanded`, so this never needs the open state. */
  trigger: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  /** Controlled open state — omit to let this instance manage its own. */
  open?: boolean
  /** Called on trigger click when `open` is controlled; receives the next
   * open state (the exclusive-accordion parent decides what that means). */
  onToggle?: (next: boolean) => void
  triggerClassName?: string
  /** Class for the outer wrapper — needed when siblings share a row (the
   * footer's groups) so a closed panel's content can't widen its flex item
   * even while collapsed to zero height. */
  className?: string
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleClick = () => {
    if (isControlled) {
      onToggle?.(!open)
    } else {
      setUncontrolledOpen((o) => !o)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        onClick={handleClick}
      >
        {trigger}
      </button>
      <div className="uf-body" data-open={open}>
        <div>{children}</div>
      </div>
    </div>
  )
}
