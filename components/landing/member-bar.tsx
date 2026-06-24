import { MEMBER_CODE } from "@/lib/landing-content"

/**
 * Thin bar that slides open for unlocked members (visibility is driven by the
 * `member-on` root class — see MemberShell).
 */
export function MemberBar() {
  return (
    <div className="codebar" style={{ background: "var(--near-black)", color: "var(--cream)" }}>
      <div>
        <div
          style={{
            maxWidth: 660,
            margin: "0 auto",
            padding: "var(--space-3) var(--space-7)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent)",
              flex: "none",
              animation: "blip 1.8s ease-in-out infinite",
            }}
          />
          <span
            className="mono"
            style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.03em", color: "var(--hair)" }}
          >
            CODE {MEMBER_CODE} ACTIVE — the whole library is free · studio rate
            discounted
          </span>
        </div>
      </div>
    </div>
  )
}
