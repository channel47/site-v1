"use client"

import { useState } from "react"
import { track } from "@vercel/analytics"
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
  focusVariant = "gradient",
}: {
  helper?: string
  cta?: string
  /** The focus underline: the sitewide 6-stop gradient, or a single-hue
   * mauve variant for Workshops-specific capture contexts. */
  focusVariant?: "gradient" | "mauve"
}) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email.trim())) {
      track("newsletter_subscribe", { status: "invalid", intent: "warm" })
      setStatus("error")
      return
    }
    track("newsletter_submit", { intent: "warm" })
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
        track("newsletter_subscribe", { status: "success", intent: "warm" })
        setStatus("subscribed")
      } else if (data.code === "unconfigured") {
        track("newsletter_subscribe", { status: "dormant", intent: "warm" })
        setStatus("dormant")
      } else {
        track("newsletter_subscribe", { status: "error", intent: "warm" })
        setStatus("error")
      }
    } catch {
      track("newsletter_subscribe", { status: "network_error", intent: "warm" })
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
          className={`ea-in${focusVariant === "mauve" ? " ea-in-mauve" : ""}`}
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
        <p className="ea-form-error">
          That didn&apos;t go through — check the address and try again.
        </p>
      ) : (
        <p className="ea-helper">{helper}</p>
      )}
    </div>
  )
}
