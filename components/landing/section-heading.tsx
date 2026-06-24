import type { ReactNode } from "react"

/**
 * The serif heading that opens each major section. (The design pairs it with
 * bottom spacing but no rule.)
 */
export function SectionHeading({
  children,
  marginBottom = 22,
}: {
  children: ReactNode
  marginBottom?: number
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 13,
        paddingBottom: 16,
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
