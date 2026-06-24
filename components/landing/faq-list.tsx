"use client"

import { useState } from "react"
import { FAQS, LINKS } from "@/lib/landing-content"

/** Accordion of common questions — one open at a time. */
export function FaqList() {
  const [open, setOpen] = useState(-1)

  return (
    <>
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div
            key={f.question}
            className={`faq${isOpen ? " open" : ""}`}
            style={{ borderBottom: "1px solid oklch(0.215 0.007 78 / 0.1)" }}
          >
            <button
              type="button"
              className="faq-head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "20px 2px",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                font: "inherit",
              }}
            >
              <span
                style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--ink-strong)" }}
              >
                {f.question}
              </span>
              <span
                className="fchev serif"
                style={{ fontSize: "var(--text-md)", color: "var(--accent)", flex: "none" }}
              >
                +
              </span>
            </button>
            <div className="faq-body">
              <div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                    color: "var(--ink-soft)",
                    padding: `0 2px ${f.cta ? 14 : 20}px`,
                    maxWidth: 560,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: f.answer.replace("{joinUrl}", LINKS.join),
                  }}
                />
                {f.cta ? (
                  <div style={{ padding: "0 2px 20px" }}>
                    <a
                      href={f.cta.href}
                      target="_blank"
                      rel="noopener"
                      className="mono btn-invert"
                      style={{
                        display: "inline-block",
                        background: "var(--near-black)",
                        color: "var(--cream)",
                        borderRadius: 12,
                        padding: "11px 18px",
                        fontSize: "var(--text-2xs)",
                        fontWeight: 700,
                      }}
                    >
                      {f.cta.label}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
