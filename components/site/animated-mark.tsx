"use client";

import { useId, useState, type CSSProperties, type PointerEvent } from "react";
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

type MarkMotion = "arrival" | "hover" | "still";

/** Finish each hover cycle even after the pointer leaves. Rapid re-entry
 * cannot interrupt it; reduced motion and touch never start a hover replay. */
export function useMarkReplay(initial: MarkMotion = "still") {
  const [motion, setMotion] = useState({ mode: initial, play: 0 });
  const replay = () => setMotion(({ play }) => ({ mode: "arrival", play: play + 1 }));
  const hover = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mark = event.currentTarget.querySelector(".c47-mark");
    if (mark?.getAnimations({ subtree: true }).some(animation => animation.playState === "running")) return;
    setMotion(({ play }) => ({ mode: "hover", play: play + 1 }));
  };
  return { motion, replay, hover };
}

export function AnimatedMark({ play = 0, mode = "arrival" }: { play?: number; mode?: MarkMotion }) {
  const id = useId();
  return (
    <svg className="c47-mark" data-motion={mode} aria-hidden="true" viewBox={MARK_VIEWBOX} width={MARK_WIDTH} height={MARK_HEIGHT} fill="currentColor">
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
