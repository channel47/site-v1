"use client"

import { useEffect, useRef, useState } from "react"

type CopyState = "idle" | "copied" | "failed"

/**
 * "Copy as Markdown" — one click puts the page's markdown twin on the
 * clipboard, so readers can paste the content (with our framing intact)
 * straight into their own AI chats. User-mediated distribution into contexts
 * no crawler reaches (docs/AI-SEO.md, Layer 4); the state flip is the
 * feedback-tier animation the design doctrine keeps.
 */
export function CopyMarkdown({ path }: { path: string }) {
  const [state, setState] = useState<CopyState>("idle")
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(reset.current), [])

  async function copy() {
    try {
      const res = await fetch(path)
      if (!res.ok) throw new Error(String(res.status))
      await navigator.clipboard.writeText(await res.text())
      setState("copied")
    } catch {
      setState("failed")
    }
    clearTimeout(reset.current)
    reset.current = setTimeout(() => setState("idle"), 2000)
  }

  const label =
    state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : "Copy as Markdown"

  return (
    <button type="button" className="st-copy-md mono" onClick={copy} aria-live="polite">
      {label}
    </button>
  )
}
