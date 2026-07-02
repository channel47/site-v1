"use client"

import { useState } from "react"
import { HOME, LINKS } from "@/lib/landing-content"

type Status = "idle" | "sending" | "subscribed" | "dormant" | "error"

/**
 * The email capture form — the site's one job on Home. Posts to
 * `/api/subscribe` (env-gated Kit). On a real success it shows the design's
 * confirmation; if the backend is unconfigured it says *that*, honestly — it
 * never fakes a "you're on the list" (STRATEGY.md §4). Extracted from the
 * original early-access page so Newsletter / Article / Workshop pages can reuse
 * the exact same behaviour.
 */
export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email.trim())) {
      setStatus("error")
      return
    }
    setStatus("sending")
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), intent: "warm" }),
      })
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean
        code?: string
      }
      if (r.ok && data.ok) setStatus("subscribed")
      else if (data.code === "unconfigured") setStatus("dormant")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "subscribed") {
    return (
      <div className="ea-formwrap">
        <div className="ea-ok">
          <svg
            className="ok-check"
            width="20"
            height="20"
            viewBox="0 0 26 26"
            fill="none"
            style={{ flex: "none" }}
            aria-hidden
          >
            <path
              d="M4.5 13.8 L10.5 19.4 L21.5 6.2"
              stroke="var(--accent)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="serif"
            style={{
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1,
              color: "var(--ink)",
              position: "relative",
              top: 1,
            }}
          >
            You&apos;re on the list.
          </span>
        </div>
        <p className="ea-helper">
          I&apos;ll email you the moment the first systems ship.
        </p>
      </div>
    )
  }

  if (status === "dormant") {
    return (
      <div className="ea-formwrap">
        <p
          style={{
            fontSize: "var(--body-size)",
            lineHeight: 1.55,
            color: "var(--body)",
          }}
        >
          Email signup isn&apos;t wired up on this page yet. For now,{" "}
          <a
            href={LINKS.join}
            target="_blank"
            rel="noopener"
            className="ul"
            style={{ color: "var(--accent)" }}
          >
            come build with me live →
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="ea-formwrap">
      <form className="ea-formrow" onSubmit={submit}>
        <input
          className="ea-in"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === "error") setStatus("idle")
          }}
          placeholder="you@company.com"
          aria-label="Email address"
          style={{ flex: 1, minWidth: 0 }}
        />
        <button
          type="submit"
          className="ea-btn"
          disabled={status === "sending"}
        >
          {status === "sending" ? "…" : "Get early access"}
        </button>
      </form>
      {status === "error" ? (
        <p
          className="mono"
          style={{ fontSize: 12, color: "var(--accent)", marginTop: 9 }}
        >
          That didn&apos;t go through — check the address and try again.
        </p>
      ) : (
        <p className="ea-helper">{HOME.helper}</p>
      )}
    </div>
  )
}
