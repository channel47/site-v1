"use client"

import { useCopyAction } from "./use-copy-action"

/**
 * "Copy as Markdown" — one click puts the page's markdown twin on the
 * clipboard, so readers can paste the content (with our framing intact)
 * straight into their own AI chats. User-mediated distribution into contexts
 * no crawler reaches (docs/AI-SEO.md, Layer 4); the state flip is the
 * feedback-tier animation the design doctrine keeps.
 */
export function CopyMarkdown({ path }: { path: string }) {
  const { state, copy } = useCopyAction(async () => {
    const res = await fetch(path)
    if (!res.ok) throw new Error(String(res.status))
    return res.text()
  })

  const label =
    state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : "Copy page"

  return (
    <button type="button" className="btn-ghost" onClick={copy} aria-live="polite">
      {label}
    </button>
  )
}
