"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LINKS, MEMBER_CODE } from "@/lib/landing-content"
import { OPEN_UNLOCK_EVENT } from "./unlock-trigger"

const STORAGE_KEY = "ch47_unlocked"
const UNLOCK_EVENT = "ch47:unlock"

type Status =
  | "idle"
  | "bad-code"
  | "unlocked"
  | "sending"
  | "subscribed"
  | "dormant"
  | "email-error"

/**
 * The member unlock + warm-capture panel. Opened from anywhere via the
 * `ch47:open-unlock` event (see UnlockTrigger).
 *
 * Two real paths:
 *  - Code: `VIBE47` validates client-side → persists `ch47_unlocked` and fires
 *    `ch47:unlock`, which MemberShell listens for to flip the whole page member.
 *    This is the lead moat — redemption happens here, on his site.
 *  - Email: posts to `/api/subscribe` (env-gated Kit). On a real success we say
 *    so; if the backend is unconfigured we say *that*, honestly — never a faked
 *    "you're subscribed".
 */
export function UnlockPanel() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const codeRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
      setStatus("idle")
      setCode("")
      setEmail("")
    }, 190)
  }, [])

  useEffect(() => {
    const onOpen = () => {
      setClosing(false)
      setStatus("idle")
      setOpen(true)
    }
    window.addEventListener(OPEN_UNLOCK_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_UNLOCK_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const root = (document.scrollingElement ||
      document.documentElement) as HTMLElement
    const prev = root.style.overflow
    root.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    const t = window.setTimeout(() => codeRef.current?.focus(), 70)
    return () => {
      root.style.overflow = prev
      document.removeEventListener("keydown", onKey)
      window.clearTimeout(t)
    }
  }, [open, close])

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === MEMBER_CODE) {
      try {
        localStorage.setItem(STORAGE_KEY, "1")
      } catch {
        /* storage unavailable — still flip for this session */
      }
      window.dispatchEvent(new Event(UNLOCK_EVENT))
      setStatus("unlocked")
      window.setTimeout(close, 1200)
    } else {
      setStatus("bad-code")
    }
  }

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email.trim())) {
      setStatus("email-error")
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
      else setStatus("email-error")
    } catch {
      setStatus("email-error")
    }
  }

  if (!open) return null

  const unlocked = status === "unlocked"

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 210,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "oklch(0.18 0.009 75 / 0.55)",
        animation: `${closing ? "fadeOut" : "fadeIn"} 0.2s ease both`,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Member access"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--paper)",
          border: "1px solid oklch(0.215 0.007 78 / 0.13)",
          borderRadius: 20,
          boxShadow: "0 40px 90px -30px oklch(0.18 0.009 75 / 0.6)",
          padding: "30px 30px 28px",
          animation: `${closing ? "modalOut" : "modalIn"} ${
            closing ? "0.18s" : "0.3s"
          } cubic-bezier(0.2, 0.7, 0.2, 1) both`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              color: "var(--muted)",
            }}
          >
            MEMBER ACCESS
          </span>
          <button
            aria-label="Close"
            className="mono press"
            onClick={close}
            style={{
              cursor: "pointer",
              fontSize: 17,
              lineHeight: 1,
              color: "var(--muted)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              marginTop: -6,
              marginRight: -8,
              padding: 0,
              background: "none",
              border: "none",
            }}
          >
            ✕
          </button>
        </div>

        {unlocked ? (
          <div style={{ padding: "14px 0 4px" }}>
            <h3
              className="serif"
              style={{
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                color: "var(--ink-strong)",
              }}
            >
              Unlocked — welcome in.
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--ink-soft)",
                marginTop: 10,
              }}
            >
              The whole library is free for you now. Everything below is yours.
            </p>
          </div>
        ) : (
          <>
            <h3
              className="serif"
              style={{
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.05,
                marginTop: 11,
                color: "var(--ink-strong)",
              }}
            >
              Enter your member code
            </h3>
            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.55,
                color: "var(--ink-soft)",
                marginTop: 9,
              }}
            >
              Vibe Marketers get a code that unlocks the entire library, free.
              Apply it here.
            </p>

            <form
              onSubmit={submitCode}
              style={{ display: "flex", gap: 9, marginTop: 16 }}
            >
              <input
                ref={codeRef}
                className="ufield mono"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  if (status === "bad-code") setStatus("idle")
                }}
                placeholder="VIBE••"
                aria-label="Member code"
                autoCapitalize="characters"
                spellCheck={false}
                style={{ flex: 1, letterSpacing: "0.12em" }}
              />
              <button
                type="submit"
                className="u-btn btn-invert mono"
                style={{ background: "var(--near-black)", color: "var(--cream)" }}
              >
                Apply
              </button>
            </form>
            {status === "bad-code" ? (
              <p
                className="mono"
                style={{ fontSize: 12, color: "var(--accent-ink)", marginTop: 9 }}
              >
                That code isn&apos;t right — check the pinned post in the
                community.
              </p>
            ) : null}

            <div
              style={{
                height: 1,
                background: "oklch(0.215 0.007 78 / 0.12)",
                margin: "22px 0 16px",
              }}
            />

            {status === "subscribed" ? (
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--ink-soft)",
                }}
              >
                You&apos;re on the list — I&apos;ll send the next build your way.
              </p>
            ) : status === "dormant" ? (
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "var(--ink-soft)",
                }}
              >
                Email signup isn&apos;t live on this page yet. For now,{" "}
                <a
                  href={LINKS.join}
                  target="_blank"
                  rel="noopener"
                  className="ul"
                  style={{ color: "var(--accent-ink)" }}
                >
                  come watch a build live →
                </a>
              </p>
            ) : (
              <>
                <span
                  className="mono"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.14em",
                    color: "var(--muted)",
                  }}
                >
                  NOT A MEMBER YET
                </span>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--ink-soft)",
                    marginTop: 8,
                  }}
                >
                  Get a free sample and the next system the moment it ships.
                </p>
                <form
                  onSubmit={submitEmail}
                  style={{ display: "flex", gap: 9, marginTop: 12 }}
                >
                  <input
                    className="ufield"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === "email-error") setStatus("idle")
                    }}
                    placeholder="you@company.com"
                    aria-label="Email address"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="u-btn u-ghost mono"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "…" : "Notify me"}
                  </button>
                </form>
                {status === "email-error" ? (
                  <p
                    className="mono"
                    style={{
                      fontSize: 12,
                      color: "var(--accent-ink)",
                      marginTop: 9,
                    }}
                  >
                    That didn&apos;t go through — check the address and try again.
                  </p>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
