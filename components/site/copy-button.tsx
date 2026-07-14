"use client"

import type { ReactNode } from "react"
import { useCopyAction } from "./use-copy-action"

function Glyph({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

const PATHS = {
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.6" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  check: <path d="M4 12.5 9.5 18 20 6.5" />,
} as const

/**
 * The quiet copy affordance of the readability pass — a 36px icon button
 * (install box, share row's "Copy link") or, with a `label`, the bordered
 * "Copy page" variant. The icon flips to a check for 2s on success; the
 * labelled variant swaps its text too.
 */
export function CopyButton({
  text,
  fetchPath,
  title,
  label,
  boxed = false,
  glyph = "copy",
}: {
  /** Literal text to copy (install command, page URL)… */
  text?: string
  /** …or a same-origin path fetched on click (the page's .md twin).
   * Serializable alternatives to a function prop — this is a client
   * component rendered from server templates. */
  fetchPath?: string
  /** Tooltip; also the accessible name of the icon-only variant. */
  title: string
  /** Visible text — switches to the bordered labelled variant. */
  label?: string
  /** Adds the share row's quiet outlined control (icon-only variant). */
  boxed?: boolean
  /** Icon-only variant's glyph — "link" for URL copies. */
  glyph?: "copy" | "link"
}) {
  const { state, copy } = useCopyAction(async () => {
    if (fetchPath) {
      const res = await fetch(fetchPath)
      if (!res.ok) throw new Error(String(res.status))
      return res.text()
    }
    return text ?? ""
  })

  if (label) {
    return (
      <button
        type="button"
        className="icon-btn dt-share-btn dt-share-btn-label"
        onClick={copy}
        title={title}
        aria-live="polite"
      >
        <Glyph size={13}>{PATHS.copy}</Glyph>
        {state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : label}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={boxed ? "icon-btn dt-share-btn" : "icon-btn"}
      onClick={copy}
      title={title}
      aria-label={title}
      aria-live="polite"
    >
      <Glyph size={14}>{state === "copied" ? PATHS.check : PATHS[glyph]}</Glyph>
    </button>
  )
}
