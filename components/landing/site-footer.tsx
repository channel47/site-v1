import { GlitchLogo } from "./glitch-logo"

/** Minimal footer — just the mark, matching the design. */
export function SiteFooter() {
  return (
    <footer style={{ padding: "var(--space-18) 0 var(--space-12)", marginTop: "var(--space-16)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-12)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 300 }}>
          <GlitchLogo width={36} />
        </div>
      </div>
    </footer>
  )
}
