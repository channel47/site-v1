import type { CSSProperties } from "react"
import type { CardMotif } from "@/lib/site-content"

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

function Posts() {
  // A written page: ruled lines that draw in left-to-right on hover, with a
  // short signature stroke — the first-person voice of the library.
  const line = (d: string, o: number, w: number, len: number, delay: string) => (
    <path
      key={d}
      className="po-line"
      d={d}
      stroke={ink(o)}
      strokeWidth={w}
      strokeLinecap="round"
      style={{
        strokeDasharray: len,
        strokeDashoffset: len,
        transition: `stroke-dashoffset .7s ease ${delay}`,
      }}
    />
  )
  return (
    <>
      <rect
        x="34"
        y="14"
        width="88"
        height="92"
        rx="6"
        stroke={ink(0.55)}
        strokeWidth="1.4"
        fill={ink(0.05)}
      />
      {line("M46 34 H110", 0.92, 1.6, 64, "0s")}
      {line("M46 50 H102", 0.55, 1.3, 56, ".1s")}
      {line("M46 66 H110", 0.55, 1.3, 64, ".2s")}
      {line("M46 82 H86", 0.55, 1.3, 40, ".3s")}
      {line("M92 94 C98 88 106 92 112 86", 0.95, 1.8, 34, ".42s")}
    </>
  )
}

function Workshops() {
  // A live signal: broadcast arcs rippling out from a source dot — the
  // monthly sessions, on air.
  const arc = (r: number, o: number, w: number) => (
    <circle
      key={r}
      className="ws-arc"
      cx="78"
      cy="66"
      r={r}
      stroke={ink(o)}
      strokeWidth={w}
      fill="none"
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        strokeDasharray: `${Math.round(r * 3.6)} ${Math.round(r * 2.7)}`,
        strokeDashoffset: Math.round(r * 1.8),
      }}
    />
  )
  return (
    <>
      <circle
        className="ws-dot"
        cx="78"
        cy="66"
        r="5"
        fill={ink(0.95)}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      {arc(20, 0.9, 1.7)}
      {arc(34, 0.62, 1.4)}
      {arc(48, 0.4, 1.2)}
    </>
  )
}

const MOTIFS: Record<CardMotif, () => React.ReactElement> = {
  posts: Posts,
  skills: Skills,
  agents: Agents,
  connectors: Connectors,
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
