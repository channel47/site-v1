"use client";

import { AnimatedMark, useMarkReplay } from "./animated-mark";

/** A finite assembly on arrival and replay; the button keeps keyboard focus. */
export function GlitchLogo({ animateOnMount = true }: { animateOnMount?: boolean }) {
  const { motion, replay, hover } = useMarkReplay(animateOnMount ? "arrival" : "still");
  return (
    <button
      type="button"
      aria-label="Channel47 — replay logo animation"
      className="gl-logo"
      onClick={replay}
      onPointerEnter={hover}
    >
      <AnimatedMark {...motion} />
    </button>
  );
}
