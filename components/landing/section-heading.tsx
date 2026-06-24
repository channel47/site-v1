import type { ReactNode } from "react"

/**
 * The serif heading that opens each major section. (The design pairs it with
 * bottom spacing but no rule.)
 */
export function SectionHeading({
  children,
  marginBottom = "var(--space-6)",
}: {
  children: ReactNode
  marginBottom?: string | number
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "var(--space-3)",
        paddingBottom: "var(--space-4)",
        marginBottom,
      }}
    >
      <h2
        className="serif"
        style={{ fontSize: "var(--text-xl)", fontWeight: 500, letterSpacing: "-0.015em" }}
      >
        {children}
      </h2>
    </div>
  )
}
