import { SectionHeading } from "./section-heading"
import { WaitlistForm } from "./waitlist-form"

/**
 * Pre-launch waitlist block. The library isn't open yet; this collects an email
 * and reveals the on-the-list bar (see WaitlistForm / MemberShell).
 */
export function AccessSection() {
  return (
    <section id="access" style={{ padding: "var(--space-16) 0 0", scrollMarginTop: 80 }}>
      <SectionHeading>Early access</SectionHeading>
      <p style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-body)", color: "var(--ink-soft)", maxWidth: 560 }}>
        The library isn’t open yet — I’m building it in the open, one system at a
        time, and shipping each to the list as it’s ready. Leave your email and
        I’ll send them your way as they land, with the build notes along the way.
        No drip sequence, no noise — just a note from me when there’s something
        real to run.
      </p>

      <WaitlistForm />

      <p
        className="mono"
        style={{
          marginTop: "var(--space-5)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Built in the open · the Vibe Marketers get in first
      </p>
    </section>
  )
}
