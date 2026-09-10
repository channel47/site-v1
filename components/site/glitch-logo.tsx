"use client";

import { useState, type CSSProperties } from "react";
import { BLOCKS, MARK_VIEWBOX } from "./mark-blocks";

function blockAnimation(index: number, pulse: number): CSSProperties {
  // Deterministic jitter keeps server/client styles identical. Alternating
  // keyframes replays the build without forcing a browser layout.
  const hash = Math.sin((index + 1) * 127.1 + (pulse + 1) * 311.7) * 43758.5453;
  const delay = (0.05 + index * 0.034 + (hash - Math.floor(hash)) * 0.12).toFixed(3);
  return {
    "--c47bit": "var(--accent)",
    animation: `c47-logo-${pulse % 2 ? "b" : "a"} var(--motion-logo) var(--ease-logo) ${delay}s backwards`,
  } as CSSProperties;
}

/** The home mark builds on arrival and replays on click. */
export function GlitchLogo() {
  const [pulse, setPulse] = useState(0);
  return (
    <button
      type="button"
      aria-label="47 — replay logo animation"
      className="gl-logo"
      onClick={() => setPulse((value) => value + 1)}
    >
      <svg aria-hidden="true" viewBox={MARK_VIEWBOX} fill="currentColor">
        {BLOCKS.map((block, index) => (
          <rect key={index} {...block} style={blockAnimation(index, pulse)} />
        ))}
      </svg>
    </button>
  );
}
