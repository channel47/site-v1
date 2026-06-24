import type { System } from "@/lib/landing-content"

/**
 * Per-system artifact previews — a small, designed glimpse of what each system
 * actually outputs (a persona file, a ranked angle list, a pre-sell page, the
 * connector's console, ad frames, an email flow). They render twice: cropped as
 * the shelf card, and larger inside the modal — so opening a card feels like
 * opening the document.
 *
 * Everything is drawn from the design tokens (warm paper, the deep accent
 * fields, Newsreader for human output / Space Grotesk for machine output) so the
 * previews read as one family with the rest of the page.
 */

export type Accent = {
  /** Deep field — matches the hero/shelf accent bases (acc0–acc4). */
  deep: string
  /** Brighter accent for small marks on paper. */
  bright: string
  /** Faint accent wash for fills. */
  soft: string
  /** Faint accent hairline. */
  line: string
}

const ACCENTS: Record<string, Accent> = {
  "cat-orange": {
    deep: "oklch(0.5 0.12 40)",
    bright: "oklch(0.565 0.133 38)",
    soft: "oklch(0.565 0.133 38 / 0.12)",
    line: "oklch(0.565 0.133 38 / 0.28)",
  },
  "cat-gold": {
    deep: "oklch(0.5 0.085 76)",
    bright: "oklch(0.54 0.1 70)",
    soft: "oklch(0.54 0.1 70 / 0.14)",
    line: "oklch(0.54 0.1 70 / 0.3)",
  },
  "cat-teal": {
    deep: "oklch(0.47 0.07 210)",
    bright: "oklch(0.5 0.082 210)",
    soft: "oklch(0.5 0.082 210 / 0.14)",
    line: "oklch(0.5 0.082 210 / 0.3)",
  },
  "cat-indigo": {
    deep: "oklch(0.46 0.16 279)",
    bright: "oklch(0.52 0.17 279)",
    soft: "oklch(0.52 0.17 279 / 0.12)",
    line: "oklch(0.52 0.17 279 / 0.3)",
  },
  "cat-green": {
    deep: "oklch(0.47 0.09 153)",
    bright: "oklch(0.49 0.1 153)",
    soft: "oklch(0.49 0.1 153 / 0.14)",
    line: "oklch(0.49 0.1 153 / 0.3)",
  },
  "cat-rose": {
    deep: "oklch(0.47 0.135 18)",
    bright: "oklch(0.55 0.14 18)",
    soft: "oklch(0.55 0.14 18 / 0.13)",
    line: "oklch(0.55 0.14 18 / 0.3)",
  },
}

export function accentFor(token: string): Accent {
  return ACCENTS[token] ?? ACCENTS["cat-orange"]
}

/** A skeleton text bar — stands in for body copy in the document previews. */
function Bar({
  w = "100%",
  h = 6,
  c,
}: {
  w?: string | number
  h?: number
  c?: string
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        background: c ?? "oklch(0.245 0.013 85 / 0.1)",
        flex: "none",
      }}
    />
  )
}

const ellipsis = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const

/* ---- Research & Personas: a voice-of-customer file ----------------- */
function PersonaArtifact({ a }: { a: Accent }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            flex: "none",
            background: a.soft,
            border: `1px solid ${a.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke={a.bright}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            className="serif"
            style={{
              fontSize: 15.5,
              lineHeight: 1.1,
              color: "var(--ink-strong)",
              ...ellipsis,
            }}
          >
            The Burned-Out Operator
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.06em",
              color: "var(--muted)",
              marginTop: 3,
              ...ellipsis,
            }}
          >
            B2B SAAS · DECISION-MAKER · 35–49
          </div>
        </div>
      </div>

      <div
        style={{
          borderLeft: `2px solid ${a.bright}`,
          paddingLeft: 11,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          className="serif"
          style={{
            fontSize: 13,
            fontStyle: "italic",
            lineHeight: 1.4,
            color: "var(--ink-soft)",
          }}
        >
          &ldquo;I&rsquo;ve tried six tools and trust none of them.&rdquo;
        </span>
        <span
          className="serif"
          style={{
            fontSize: 13,
            fontStyle: "italic",
            lineHeight: 1.4,
            color: "var(--ink-soft)",
          }}
        >
          &ldquo;Just prove the thing actually works.&rdquo;
        </span>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          ["128", "quotes"],
          ["6", "sources"],
          ["3", "personas"],
        ].map(([n, l]) => (
          <span key={l} className="mono" style={{ fontSize: 9.5, color: "var(--muted)" }}>
            <span style={{ color: a.bright, fontWeight: 600 }}>{n}</span> {l}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---- Angle Generator: a ranked, quote-backed angle list ------------ */
function AnglesArtifact({ a }: { a: Accent }) {
  const rows: [string, string, number][] = [
    ["01", "Trust through proof", 92],
    ["02", "Speed as the hook", 78],
    ["03", "Insider, not guru", 64],
  ]
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        gap: 13,
      }}
    >
      {rows.map(([r, label, score]) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span
            className="mono"
            style={{ fontSize: 11, color: a.bright, fontWeight: 600, flex: "none" }}
          >
            {r}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="serif"
              style={{ fontSize: 13, color: "var(--ink-strong)", ...ellipsis }}
            >
              {label}
            </div>
            <div
              style={{
                marginTop: 5,
                height: 5,
                borderRadius: 3,
                background: a.soft,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  background: a.bright,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-soft)", flex: "none" }}
          >
            {score}
          </span>
        </div>
      ))}
      <div
        className="mono"
        style={{ fontSize: 9, letterSpacing: "0.08em", color: "var(--muted)", marginTop: 2 }}
      >
        RANKED BY BUYER INTENT · EACH QUOTE-BACKED
      </div>
    </div>
  )
}

/* ---- Advertorial Builder: a pre-sell editorial page ---------------- */
function AdvertorialArtifact({ a }: { a: Accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 8 }}>
      <span
        className="mono"
        style={{ fontSize: 9, letterSpacing: "0.16em", color: a.bright }}
      >
        ADVERTORIAL · PRE-SELL
      </span>
      <span
        className="serif"
        style={{
          fontSize: 16.5,
          fontWeight: 500,
          lineHeight: 1.16,
          letterSpacing: "-0.01em",
          color: "var(--ink-strong)",
        }}
      >
        Why seasoned operators are quietly ditching their agencies
      </span>
      <div style={{ height: 1, background: "oklch(0.245 0.013 85 / 0.1)", margin: "1px 0" }} />
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
          {["100%", "92%", "97%", "84%", "90%", "72%"].map((w, i) => (
            <Bar key={i} w={w} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              height: 40,
              borderRadius: 8,
              background: a.soft,
              border: `1px solid ${a.line}`,
            }}
          />
          {["100%", "90%", "70%"].map((w, i) => (
            <Bar key={i} w={w} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---- Paid Search System: the connector's console ------------------- */
function ConsoleArtifact({ a }: { a: Accent }) {
  return (
    <div
      style={{
        height: "100%",
        background: "oklch(0.205 0.012 277)",
        borderRadius: 12,
        border: `1px solid ${a.line}`,
        padding: "12px 13px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "oklch(0.95 0.013 85 / 0.25)",
            }}
          />
        ))}
        <span
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "oklch(0.95 0.013 85 / 0.5)",
            marginLeft: 4,
          }}
        >
          google-ads · mcp
        </span>
      </div>
      <span className="mono" style={{ fontSize: 10.5, color: "oklch(0.95 0.013 85 / 0.6)" }}>
        ▸ scanning 142 keywords…
      </span>
      <span className="mono" style={{ fontSize: 10.5, color: "oklch(0.72 0.13 18)" }}>
        − pause &nbsp;broad &ldquo;running shoes&rdquo; &nbsp;−$1,240/mo
      </span>
      <span className="mono" style={{ fontSize: 10.5, color: "oklch(0.78 0.12 150)" }}>
        + add &nbsp;exact &ldquo;trail running&rdquo; &nbsp;+18% ROAS
      </span>
      <span
        className="mono"
        style={{ fontSize: 10.5, color: "oklch(0.95 0.013 85 / 0.4)", marginTop: "auto" }}
      >
        3 changes staged ·{" "}
        <span style={{ color: "oklch(0.95 0.013 85 / 0.85)" }}>approve?</span>{" "}
        <span style={{ animation: "blip 1.1s steps(1) infinite" }}>▍</span>
      </span>
    </div>
  )
}

/* ---- Ad Creative Generator: a grid of generated frames ------------- */
function CreativeArtifact({ a }: { a: Accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 9 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          flex: 1,
          minHeight: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              border: "1px solid oklch(0.245 0.013 85 / 0.12)",
              borderRadius: 9,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 42,
                background: a.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i === 1 ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill={a.bright}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : null}
            </div>
            <div style={{ padding: "5px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
              <Bar w="80%" h={4} c={a.soft} />
              <Bar w="55%" h={4} />
            </div>
          </div>
        ))}
      </div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: "var(--muted)" }}>
        STATIC · VIDEO — 9 VARIANTS FROM 1 ANGLE
      </div>
    </div>
  )
}

/* ---- Email Flows: a sequenced send flow ---------------------------- */
function FlowArtifact({ a }: { a: Accent }) {
  const nodes: [string, string][] = [
    ["Welcome", "+0d"],
    ["Nurture series", "+2d"],
    ["Win-back", "+6d"],
  ]
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 13,
          top: 22,
          bottom: 22,
          borderLeft: `1px dashed ${a.line}`,
        }}
      />
      {nodes.map(([name, delay]) => (
        <div
          key={name}
          style={{ display: "flex", alignItems: "center", gap: 11, padding: "6px 0", position: "relative" }}
        >
          <div
            style={{
              width: 27,
              height: 27,
              borderRadius: "50%",
              flex: "none",
              background: a.soft,
              border: `1px solid ${a.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={a.bright}
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M4 7l8 5 8-5" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="serif" style={{ fontSize: 13, color: "var(--ink-strong)", ...ellipsis }}>
              {name}
            </div>
            <Bar w="70%" h={4} />
          </div>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--muted)", flex: "none" }}>
            {delay}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Routes a system to its artifact preview by slug. */
export function ArtifactBody({ system }: { system: System }) {
  const a = accentFor(system.accent)
  switch (system.slug) {
    case "research-personas":
      return <PersonaArtifact a={a} />
    case "angle-generator":
      return <AnglesArtifact a={a} />
    case "advertorial-builder":
      return <AdvertorialArtifact a={a} />
    case "paid-search":
      return <ConsoleArtifact a={a} />
    case "ad-creative":
      return <CreativeArtifact a={a} />
    case "email-flows":
      return <FlowArtifact a={a} />
    default:
      return null
  }
}
