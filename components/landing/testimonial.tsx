import type { Testimonial as TestimonialData } from "@/lib/landing-content"

/** Centered pull-quote with avatar, attribution. */
export function Testimonial({ quote, name, role }: TestimonialData) {
  return (
    <section
      style={{
        padding: "var(--space-16) 0 0",
        maxWidth: 460,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <blockquote
        className="serif"
        style={{
          fontSize: "var(--text-lg)",
          lineHeight: "var(--leading-quote)",
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
          gap: "var(--space-3)",
          marginTop: "var(--space-5)",
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
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink-strong)" }}>
            {name}
          </div>
          <div className="mono" style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>
            {role}
          </div>
        </div>
      </div>
    </section>
  )
}
