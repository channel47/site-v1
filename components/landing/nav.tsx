import { GlitchLogo } from "./glitch-logo"

/** Sticky top bar: just the animated mark on a stripped-down, email-first page. */
export function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <GlitchLogo autoPlay />
      </div>
    </nav>
  )
}
