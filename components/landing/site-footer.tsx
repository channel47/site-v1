import { GlitchLogo } from "./glitch-logo"

/** Minimal footer — just the mark, matching the design. */
export function SiteFooter() {
  return (
    <footer style={{ padding: "72px 0 44px", marginTop: 64 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 48,
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
