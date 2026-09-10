"use client"

import { useId, useState } from "react"
import { measure } from "./measurement"
import type { CapturePlacement } from "@/lib/measurement"
import { CAPTURE } from "@/lib/site-content"

type Status = "idle" | "sending" | "subscribed" | "dormant" | "error"

/**
 * The sitewide email capture — extracted from the retired early-access page.
 * Posts to `/api/subscribe` (env-gated Kit). On a real success we show the
 * confirmation; if the backend is unconfigured we say *that*, honestly — we
 * never fake a "you're on the list".
 */
export function Capture({
  placement,
  helper = CAPTURE.helper,
  cta = CAPTURE.cta,
}: {
  placement: CapturePlacement
  helper?: string
  cta?: string

}) {
  const messageId = useId()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "sending") return
    if (!/.+@.+\..+/.test(email.trim())) {
      measure("newsletter_result", { status: "invalid", placement })
      setStatus("error")
      return
    }
    measure("newsletter_submit", { placement })
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
      if (r.ok && data.ok) {
        measure("newsletter_result", { status: "accepted", placement })
        setStatus("subscribed")
      } else if (data.code === "unconfigured") {
        measure("newsletter_result", { status: "unavailable", placement })
        setStatus("dormant")
      } else {
        measure("newsletter_result", { status: "failed", placement })
        setStatus("error")
      }
    } catch {
      measure("newsletter_result", { status: "network_error", placement })
      setStatus("error")
    }
  }

  if (status === "subscribed") {
    return (
      <div className="ea-formwrap">
        <div className="ea-ok" role="status">
          <svg
            className="ok-check"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flex: "none" }}
            aria-hidden
          >
            <circle cx="8" cy="8" r="7" stroke="var(--success)" strokeWidth="1.6" />
            <path
              d="M4.8 8.3 L7 10.6 L11.3 5.7"
              stroke="var(--success)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="serif ea-ok-title">{CAPTURE.successTitle}</span>
        </div>
        <p className="ea-helper">{CAPTURE.successHelper}</p>
        <button
          type="button"
          className="ea-reset"
          onClick={() => {
            setStatus("idle")
            setEmail("")
          }}
        >
          Wrong address? Start over
        </button>
      </div>
    )
  }

  if (status === "dormant") {
    return (
      <div className="ea-formwrap">
        <p className="ea-dormant" role="status">
          Email signup is unavailable right now. Try again later, or follow the <a href="/rss.xml" className="ul">RSS feed</a>.
        </p>
      </div>
    )
  }

  return (
    <div className="ea-formwrap">
      <form className="ea-formrow" onSubmit={submit} aria-busy={status === "sending"}>
        <input
          className="ea-in"
          autoComplete="email"
          name="email"
          required
          aria-invalid={status === "error"}
          aria-describedby={messageId}
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
        <button type="submit" className="ea-btn" disabled={status === "sending"}>
          <span style={{ visibility: status === "sending" ? "hidden" : undefined }}>{cta}</span>
          {status === "sending" ? <span className="ea-sending" role="status">Sending…</span> : null}
        </button>
      </form>
      {status === "error" ? (
        <p className="ea-form-error" id={messageId} role="alert">
          That didn&apos;t go through — check the address and try again.
        </p>
      ) : (
        <p className="ea-helper" id={messageId}>{helper}</p>
      )}
    </div>
  )
}
