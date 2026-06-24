import type { Testimonial as TestimonialData } from "@/lib/landing-content"

/** Centered pull-quote with avatar, attribution. */
export function Testimonial({ quote, name, role }: TestimonialData) {
  return (
    <section
      style={{
        padding: "64px 0 0",
        maxWidth: 460,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <blockquote
        className="serif"
        style={{
          fontSize: "var(--text-lg)",
          lineHeight: 1.34,
          letterSpacing: "-0.01em",
          fontStyle: "italic",
          color: "var(--ink-strong)",
          textWrap: "pretty",
        }}
      >
        “{quote}”
      </blockquote>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: 20,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "1px solid oklch(0 0 0 / 0.1)",
            flex: "none",
          }}
        />
        <div>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--ink-strong)" }}>
            {name}
          </div>
          <div className="mono" style={{ fontSize: "var(--text-3xs)", color: "var(--muted)" }}>
            {role}
          </div>
        </div>
      </div>
    </section>
  )
}
