import { GlitchLogo } from "./glitch-logo"

/** Sticky top bar: the animated logo and a login pill. */
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
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <GlitchLogo autoPlay />
        <a
          href="#access"
          className="mono login-pill"
          style={{
            fontSize: "var(--text-2xs)",
            letterSpacing: "0.04em",
            border: "1px solid oklch(0.242 0.011 73 / 0.25)",
            borderRadius: 12,
            padding: "8px 15px",
          }}
        >
          Login
        </a>
      </div>
    </nav>
  )
}
