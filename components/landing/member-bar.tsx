/**
 * Thin bar that slides open once you've joined the waitlist (visibility is
 * driven by the `member-on` root class — see MemberShell / WaitlistForm).
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
            style={{ fontSize: "var(--text-xs)", letterSpacing: "0.03em", color: "var(--hair)" }}
          >
YOU’RE ON THE LIST — early access lands in your inbox first
          </span>
        </div>
      </div>
    </div>
  )
}
