import type { CSSProperties } from "react"

/**
 * Staggered block build-in shared by the "47" mark and the type icons
 * (transcribed from the Claude Design file's bitDelay/bitAnim). Each block
 * appears at a jittered offset in an accent colour, then settles to
 * currentColor. The jitter is a deterministic hash of (block, pulse) — no
 * Math.random, so server and client render identical styles — and varies
 * with each pulse so a replay feels scattered rather than metronomic.
 * Pulse parity flips the keyframe name (c47-logo-a / -b) so bumping the
 * pulse replays the same animation without any reflow hack.
 */
export const BIT_EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)"

function bitDelay(i: number, pulse: number, extra: number): string {
  const h = Math.sin((i + 1) * 127.1 + (pulse + 1) * 311.7) * 43758.5453
  const r = h - Math.floor(h)
  return `${(extra + i * 0.034 + r * 0.12).toFixed(3)}s`
}

export function bitAnim(
  i: number,
  pulse: number,
  extra: number,
  color: string,
): CSSProperties {
  return {
    "--c47bit": color,
    animation: `c47-logo-${pulse % 2 ? "b" : "a"} 0.4s ${BIT_EASE} ${bitDelay(
      i,
      pulse,
      extra,
    )} backwards`,
  } as CSSProperties
}
