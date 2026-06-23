import { MEMBER_CODE } from "@/lib/landing-content"

/**
 * Thin bar that slides open for unlocked members (visibility is driven by the
 * `member-on` root class — see MemberShell).
 */
export function MemberBar() {
  return (
    <div className="codebar" style={{ background: "#16140f", color: "#f1ede4" }}>
      <div>
        <div
          style={{
            maxWidth: 660,
            margin: "0 auto",
            padding: "11px 28px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#cc4b1e",
              flex: "none",
              animation: "blip 1.8s ease-in-out infinite",
            }}
          />
          <span
            className="mono"
            style={{ fontSize: 11, letterSpacing: "0.03em", color: "#d8d2c4" }}
          >
            CODE {MEMBER_CODE} ACTIVE — the whole library is free · studio rate
            discounted
          </span>
        </div>
      </div>
    </div>
  )
}
