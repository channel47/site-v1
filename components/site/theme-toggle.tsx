"use client"

import { useEffect, useState } from "react"

type Mode = "light" | "dark"

function resolvedMode(): Mode {
  if (typeof document !== "undefined") {
    const stored = document.documentElement.getAttribute("data-theme")
    if (stored === "light" || stored === "dark") return stored
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  return "light"
}

/**
 * The sitewide day/night toggle (round 12/14: "one sun toggle for the set").
 * Starts from whatever the OS/stored preference resolves to, then persists an
 * explicit choice — matching the design's binary (not tri-state) toggle.
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null)

  useEffect(() => {
    setMode(resolvedMode())
  }, [])

  const toggle = () => {
    const next: Mode = (mode ?? resolvedMode()) === "dark" ? "light" : "dark"
    document.documentElement.style.colorScheme = next
    document.documentElement.setAttribute("data-theme", next)
    try {
      localStorage.setItem("ch47-theme", next)
    } catch {
      // localStorage unavailable (private mode, etc.) — the toggle still
      // works for this page load, it just won't persist.
    }
    setMode(next)
  }

  const current = mode ?? "light"
  const nextLabel = current === "dark" ? "Light" : "Dark"

  return (
    <button
      type="button"
      onClick={toggle}
      className="sf-theme"
      title={`${nextLabel} mode`}
      aria-label="Switch color scheme"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
        <circle
          cx="8"
          cy="8"
          r="6.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M8 1.8 a6.2 6.2 0 0 1 0 12.4 z" fill="currentColor" />
      </svg>
    </button>
  )
}
