import type { CSSProperties } from "react"
import type { CardMotif } from "@/lib/landing-content"

/**
 * The line-art schematic that sits on each pillar card — one paper-ink colour
 * so the whole set reads as a family. Ported from the "CH47 Early Access"
 * Claude Design file's `_fig` builder. The element classes (sk-*, ag-*, cn-*)
 * are what the card's hover rules in globals.css animate against: the skills
 * plates fan apart, the agents orbit sweeps, the connector paths draw in.
 */

/** Paper ink at a given opacity — the single colour every schematic draws in. */
const ink = (o: number) => `rgba(247,240,227,${o})`

function Skills() {
  // Three stacked plates that fan apart on hover.
  const base: CSSProperties = { transformBox: "fill-box" }
  return (
    <>
      <rect
        className="sk-r3"
        x="22"
        y="72"
        width="92"
        height="28"
        rx="5"
        stroke={ink(0.45)}
        strokeWidth="1.4"
        fill={ink(0.04)}
        style={base}
      />
      <rect
        className="sk-r2"
        x="32"
        y="46"
        width="92"
        height="28"
        rx="5"
        stroke={ink(0.62)}
        strokeWidth="1.4"
        fill={ink(0.05)}
        style={base}
      />
      <rect
        className="sk-r1"
        x="42"
        y="20"
        width="92"
        height="28"
        rx="5"
        stroke={ink(0.95)}
        strokeWidth="1.6"
        fill={ink(0.1)}
        style={base}
      />
    </>
  )
}

function Agents() {
  // Concentric rings the orbit group sweeps around on hover.
  const ringOrigin: CSSProperties = { transformOrigin: "78px 60px" }
  return (
    <>
      <circle
        className="ag-ring"
        cx="78"
        cy="60"
        r="46"
        stroke={ink(0.4)}
        strokeWidth="1.2"
        style={ringOrigin}
      />
      <circle
        className="ag-ring"
        cx="78"
        cy="60"
        r="29"
        stroke={ink(0.55)}
        strokeWidth="1.2"
        style={ringOrigin}
      />
      <circle
        className="ag-core"
        cx="78"
        cy="60"
        r="4"
        fill={ink(0.95)}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <g className="ag-orbit" style={ringOrigin}>
        <circle cx="124" cy="60" r="4.2" fill={ink(0.9)} />
        <circle cx="50" cy="32" r="3.6" fill={ink(0.7)} />
        <circle cx="78" cy="98" r="3.6" fill={ink(0.9)} />
      </g>
    </>
  )
}

function Connectors() {
  // Two columns of nodes wired by paths that draw in on hover.
  const node = (cx: number, cy: number, o: number, delay: string) => (
    <circle
      key={`${cx}-${cy}`}
      className="cn-node"
      cx={cx}
      cy={cy}
      r="4"
      fill={ink(o)}
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        transition: `transform .5s ease ${delay}`,
      }}
    />
  )
  const path = (d: string, o: number, w: number, delay: string) => (
    <path
      className="cn-path"
      d={d}
      stroke={ink(o)}
      strokeWidth={w}
      style={{
        strokeDasharray: 185,
        strokeDashoffset: 185,
        transition: `stroke-dashoffset .85s ease ${delay}`,
      }}
    />
  )
  return (
    <>
      {path("M30 30 C74 30 86 92 126 92", 0.92, 1.6, "0s")}
      {path("M30 60 C76 60 80 30 126 30", 0.5, 1.3, ".12s")}
      {path("M30 90 C74 90 84 60 126 60", 0.5, 1.3, ".24s")}
      {node(30, 30, 0.85, "0s")}
      {node(30, 60, 0.85, ".06s")}
      {node(30, 90, 0.85, ".12s")}
      {node(126, 30, 0.85, ".18s")}
      {node(126, 60, 0.92, ".24s")}
      {node(126, 92, 0.85, ".3s")}
    </>
  )
}

function Articles() {
  // A page with a video-embed play triangle up top and ruled body lines below —
  // the Article's "leads with a video, then the how-to" shape.
  const line = (y: number, w: number, o: number) => (
    <rect
      key={y}
      className="ar-line"
      x="46"
      y={y}
      width={w}
      height="3.4"
      rx="1.7"
      fill={ink(o)}
      style={{ transformBox: "fill-box", transformOrigin: "left center" }}
    />
  )
  return (
    <>
      <rect
        className="ar-page"
        x="38"
        y="14"
        width="80"
        height="94"
        rx="6"
        stroke={ink(0.9)}
        strokeWidth="1.6"
        fill={ink(0.05)}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <rect
        x="46"
        y="22"
        width="64"
        height="34"
        rx="4"
        stroke={ink(0.5)}
        strokeWidth="1.3"
        fill={ink(0.04)}
      />
      <path className="ar-play" d="M72 31 L86 39 L72 47 Z" fill={ink(0.95)} />
      {line(66, 64, 0.7)}
      {line(76, 64, 0.4)}
      {line(86, 48, 0.4)}
    </>
  )
}

function Posts() {
  // An oversized quotation mark over two ruled lines — the personable, spoken
  // voice. The glyph gives a gentle nod on hover (see .po-quote rules).
  return (
    <>
      <text
        className="po-quote"
        x="34"
        y="74"
        fontSize="86"
        fontFamily="Georgia, serif"
        fill={ink(0.95)}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        &ldquo;
      </text>
      <rect
        className="po-line"
        x="74"
        y="52"
        width="46"
        height="3.4"
        rx="1.7"
        fill={ink(0.62)}
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
      <rect
        className="po-line"
        x="74"
        y="64"
        width="34"
        height="3.4"
        rx="1.7"
        fill={ink(0.4)}
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
    </>
  )
}

function Workshops() {
  // A calendar plate with a single lit day and a live-broadcast pulse — the
  // "live event on a date" identity. The lit cell and arcs breathe on hover.
  const dot = (cx: number, cy: number, o: number, lit = false) => (
    <circle
      key={`${cx}-${cy}`}
      className={lit ? "wk-live" : "wk-cell"}
      cx={cx}
      cy={cy}
      r={lit ? 5 : 3.2}
      fill={ink(lit ? 0.98 : o)}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    />
  )
  return (
    <>
      <rect
        x="34"
        y="24"
        width="88"
        height="80"
        rx="7"
        stroke={ink(0.9)}
        strokeWidth="1.6"
        fill={ink(0.05)}
      />
      <line x1="34" y1="44" x2="122" y2="44" stroke={ink(0.6)} strokeWidth="1.3" />
      <line x1="54" y1="18" x2="54" y2="30" stroke={ink(0.85)} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="102" y1="18" x2="102" y2="30" stroke={ink(0.85)} strokeWidth="2.4" strokeLinecap="round" />
      {dot(50, 58, 0.5)}
      {dot(68, 58, 0.5)}
      {dot(86, 58, 0.5)}
      {dot(104, 58, 0.5)}
      {dot(50, 78, 0.5)}
      {dot(68, 78, 0.98, true)}
      {dot(86, 78, 0.5)}
      {dot(104, 78, 0.5)}
      <circle
        className="wk-arc"
        cx="68"
        cy="78"
        r="11"
        stroke={ink(0.85)}
        strokeWidth="1.4"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle
        className="wk-arc"
        cx="68"
        cy="78"
        r="17"
        stroke={ink(0.45)}
        strokeWidth="1.2"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </>
  )
}

const MOTIFS: Record<CardMotif, () => React.ReactElement> = {
  skills: Skills,
  agents: Agents,
  connectors: Connectors,
  articles: Articles,
  posts: Posts,
  workshops: Workshops,
}

export function SchematicFig({ motif }: { motif: CardMotif }) {
  const Motif = MOTIFS[motif]
  return (
    <div className="fig" aria-hidden>
      <svg width="156" height="120" viewBox="0 0 156 120" fill="none">
        <Motif />
      </svg>
    </div>
  )
}
