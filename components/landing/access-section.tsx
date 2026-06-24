import {
  ACCESS_PRICE,
  ACCESS_SEPARATE_PRICE,
  MEMBER_CODE,
} from "@/lib/landing-content"
import { SectionHeading } from "./section-heading"

/**
 * Lifetime-access pricing block. The list/member variants are both rendered;
 * the `member-on` root class (see MemberShell) decides which is shown via CSS.
 */
export function AccessSection() {
  return (
    <section id="access" style={{ padding: "var(--space-16) 0 0", scrollMarginTop: 80 }}>
      <SectionHeading>Access</SectionHeading>
      <p style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-body)", color: "var(--ink-soft)" }}>
        One payment gets you the entire library — every system, every MCP
        connector, every walkthrough and principle — plus everything I add from
        here on. No subscription, no seat fees. You buy in once and it’s
        yours.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-5)",
          flexWrap: "wrap",
          marginTop: "var(--space-6)",
        }}
      >
        <a
          href="#"
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
          }}
        >
          <span className="p-list">Get lifetime access — {ACCESS_PRICE}</span>
          <span className="p-mem">Unlock everything with {MEMBER_CODE}</span>
          <span className="serif" style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-none)" }}>
            →
          </span>
        </a>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <span
            className="mono p-list"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--muted)",
              textDecoration: "line-through",
            }}
          >
            {ACCESS_SEPARATE_PRICE} separately
          </span>
          <span className="mono p-mem" style={{ fontSize: "var(--text-xs)", color: "var(--accent-ink)" }}>
            unlocked with {MEMBER_CODE}
          </span>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            One payment · yours forever
          </span>
        </div>
      </div>
    </section>
  )
}
