"use client"

import { useEffect, useRef, useState } from "react"

type CopyState = "idle" | "copied" | "failed"

/** "Copy link" — one click puts the page's absolute URL on the clipboard. */
export function CopyLink({ url }: { url: string }) {
  const [state, setState] = useState<CopyState>("idle")
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(reset.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setState("copied")
    } catch {
      setState("failed")
    }
    clearTimeout(reset.current)
    reset.current = setTimeout(() => setState("idle"), 2000)
  }

  const label =
    state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : "Copy link"

  return (
    <button type="button" className="btn-ghost" onClick={copy} aria-live="polite">
      {label}
    </button>
  )
}
