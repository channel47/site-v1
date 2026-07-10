"use client"

import { useEffect, useRef, useState } from "react"

type CopyState = "idle" | "copied" | "failed"

/** Shared "copy to clipboard, flash the state, reset after 2s" state machine
 * behind CopyLink and CopyMarkdown. `getText` may throw/reject — that's
 * surfaced as the "failed" state, same as a clipboard-write rejection. */
export function useCopyAction(getText: () => Promise<string> | string) {
  const [state, setState] = useState<CopyState>("idle")
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(reset.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(await getText())
      setState("copied")
    } catch {
      setState("failed")
    }
    clearTimeout(reset.current)
    reset.current = setTimeout(() => setState("idle"), 2000)
  }

  return { state, copy }
}
