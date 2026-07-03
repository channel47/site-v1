"use client"

import { useState } from "react"
import { CAPTURE, LINKS } from "@/lib/site-content"

type Status = "idle" | "sending" | "subscribed" | "dormant" | "error"

/**
 * The sitewide email capture — extracted from the retired early-access page.
 * Posts to `/api/subscribe` (env-gated Kit). On a real success we show the
 * confirmation; if the backend is unconfigured we say *that*, honestly — we
 * never fake a "you're on the list".
 */
export function Capture({
  helper = CAPTURE.helper,
  cta = CAPTURE.cta,
}: {
  helper?: string
  cta?: string
}) {
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
          <span className="serif ea-ok-title">{CAPTURE.successTitle}</span>
        </div>
        <p className="ea-helper">{CAPTURE.successHelper}</p>
      </div>
    )
  }

  if (status === "dormant") {
    return (
      <div className="ea-formwrap">
        <p className="ea-dormant">
          Email signup isn&apos;t wired up on this page yet. For now,{" "}
          <a
            href={LINKS.join}
            target="_blank"
            rel="noopener"
            className="ul ea-dormant-link"
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
        <button type="submit" className="ea-btn" disabled={status === "sending"}>
          {status === "sending" ? "…" : cta}
        </button>
      </form>
      {status === "error" ? (
        <p className="mono ea-form-error">
          That didn&apos;t go through — check the address and try again.
        </p>
      ) : (
        <p className="ea-helper">{helper}</p>
      )}
    </div>
  )
}
