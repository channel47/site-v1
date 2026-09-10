"use client";

import { useState } from "react";
import { AnimatedMark } from "./animated-mark";

/** A finite assembly on arrival and replay; the button keeps keyboard focus. */
export function GlitchLogo() {
  const [pulse, setPulse] = useState(0);
  return (
    <button
      type="button"
      aria-label="Channel47 — replay logo animation"
      className="gl-logo"
      onClick={() => setPulse((value) => value + 1)}
    >
      <AnimatedMark play={pulse} />
    </button>
  );
}
