"use client";

import { useId, type CSSProperties } from "react";
import { MARK_HEIGHT, MARK_PATH, MARK_VIEWBOX, MARK_WIDTH } from "./mark";

// Windows into the master, not separately drawn versions of the logo.
// The complete outline takes over at rest, so fractional pixels cannot leave seams.
const PIECES = [
  { x: 0, y: 0, width: 7, height: 24, dx: -7, dy: 0, delay: 0 },
  { x: 7, y: 0, width: 7, height: 24, dx: 0, dy: 8, delay: 0.065 },
  { x: 14, y: 0, width: 7, height: 24, dx: 0, dy: -8, delay: 0.12 },
  { x: 27, y: 0, width: 21, height: 7, dx: 7, dy: 0, delay: 0.18 },
  { x: 27, y: 7, width: 21, height: 10, dx: 6, dy: -6, delay: 0.245 },
  { x: 27, y: 17, width: 21, height: 7, dx: 0, dy: 8, delay: 0.31 },
] as const;

export function AnimatedMark({ play = 0 }: { play?: number }) {
  const id = useId();
  return (
    <svg className="c47-mark" aria-hidden="true" viewBox={MARK_VIEWBOX} width={MARK_WIDTH} height={MARK_HEIGHT} fill="currentColor">
      <defs>
        {PIECES.map(({ x, y, width, height }, index) => (
          <clipPath id={`${id}-${index}`} key={index}>
            <rect x={x} y={y} width={width} height={height} />
          </clipPath>
        ))}
      </defs>
      <g key={play}>
        <g className="c47-pieces">
          {PIECES.map(({ dx, dy, delay }, index) => (
            <g key={index} className="c47-piece" style={{
              "--piece-x": `${dx}px`,
              "--piece-y": `${dy}px`,
              "--piece-delay": delay,
            } as CSSProperties}>
              <g clipPath={`url(#${id}-${index})`}><path d={MARK_PATH} /></g>
            </g>
          ))}
        </g>
        <path className="c47-complete" d={MARK_PATH} />
      </g>
    </svg>
  );
}
