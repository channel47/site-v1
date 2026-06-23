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
            style={{ borderBottom: "1px solid rgba(27,25,22,0.1)" }}
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
                style={{ fontSize: 16, fontWeight: 600, color: "#1b1916" }}
              >
                {f.question}
              </span>
              <span
                className="fchev serif"
                style={{ fontSize: 20, color: "#cc4b1e", flex: "none" }}
              >
                +
              </span>
            </button>
            <div className="faq-body">
              <div>
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    color: "#37332b",
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
                        background: "#16140f",
                        color: "#f1ede4",
                        borderRadius: 12,
                        padding: "11px 18px",
                        fontSize: 12.5,
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
