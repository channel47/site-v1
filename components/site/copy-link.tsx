"use client"

import { useCopyAction } from "./use-copy-action"

/** "Copy link" — one click puts the page's absolute URL on the clipboard. */
export function CopyLink({ url }: { url: string }) {
  const { state, copy } = useCopyAction(() => url)

  const label =
    state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : "Copy link"

  return (
    <button type="button" className="btn-ghost" onClick={copy} aria-live="polite">
      {label}
    </button>
  )
}
