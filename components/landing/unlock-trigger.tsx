"use client"

import type { CSSProperties, ReactNode } from "react"

/** Fired to open the UnlockPanel from anywhere (nav pill, access section). */
export const OPEN_UNLOCK_EVENT = "ch47:open-unlock"

/**
 * A bare button that opens the unlock panel. Styled entirely by the caller so it
 * can wear the login pill, an inline link, or anything else — it only carries the
 * open behaviour, so server components (Nav, AccessSection) can host it.
 */
export function UnlockTrigger({
  children,
  className,
  style,
  ariaLabel,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      style={{
        background: "transparent",
        border: "none",
        color: "inherit",
        fontFamily: "inherit",
        cursor: "pointer",
        ...style,
      }}
      onClick={() => window.dispatchEvent(new Event(OPEN_UNLOCK_EVENT))}
    >
      {children}
    </button>
  )
}
