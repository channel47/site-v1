"use client"

import { useEffect, useState } from "react"
import { STORAGE_KEY, UNLOCK_EVENT } from "./member-shell"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Waitlist signup. UI-only for now — there's no backend; submitting persists a
 * local flag and reveals the on-the-list bar (see MemberShell). Wire the actual
 * subscribe call into `submit` when the list is ready.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)

  // Remember a returning visitor who already joined.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setDone(true)
    } catch {
      /* storage unavailable — show the form */
    }
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError(true)
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      /* storage unavailable — still show the confirmation */
    }
    window.dispatchEvent(new Event(UNLOCK_EVENT))
    setDone(true)
  }

  if (done) {
    return (
      <p
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-3)",
          marginTop: "var(--space-6)",
          maxWidth: 460,
          fontSize: "var(--text-base)",
          lineHeight: "var(--leading-body)",
          color: "var(--ink-soft)",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--accent)",
            flex: "none",
            transform: "translateY(-2px)",
          }}
        />
        <span>
          You’re on the list. I’ll send the first systems your way before they go
          anywhere else.
        </span>
      </p>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      style={{ marginTop: "var(--space-6)", maxWidth: 460 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(false)
          }}
          className="wl-input"
          style={{
            flex: "1 1 220px",
            minWidth: 0,
            background: "transparent",
            border: "none",
            borderBottom: "1px solid oklch(0.215 0.007 78 / 0.28)",
            padding: "var(--space-3) var(--space-1)",
            fontSize: "var(--text-base)",
            fontFamily: "var(--font-sans)",
            color: "var(--ink-strong)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          className="btn-invert"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "var(--near-black)",
            color: "var(--cream)",
            borderRadius: 12,
            padding: "var(--space-4) var(--space-6)",
            fontWeight: 700,
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-sans)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Join the waitlist
          <span
            className="serif"
            style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-none)" }}
          >
            →
          </span>
        </button>
      </div>
      {error ? (
        <span
          className="mono"
          style={{
            display: "block",
            marginTop: "var(--space-3)",
            fontSize: "var(--text-xs)",
            color: "var(--accent-ink)",
          }}
        >
          That email doesn’t look right — mind checking it?
        </span>
      ) : null}
    </form>
  )
}
