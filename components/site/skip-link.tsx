"use client";

import { useEffect, useRef } from "react";

/** Safari can restore focus without keyboard input. Reveal only after Tab. */
export function SkipLink() {
  const link = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const node = link.current!;
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab") node.setAttribute("data-keyboard", "");
    };
    const pointer = () => node.removeAttribute("data-keyboard");
    document.addEventListener("keydown", keyboard, true);
    document.addEventListener("pointerdown", pointer, true);
    return () => {
      document.removeEventListener("keydown", keyboard, true);
      document.removeEventListener("pointerdown", pointer, true);
    };
  }, []);

  return (
    <a
      ref={link}
      className="skip-link"
      href="#main-content"
      onBlur={(event) => event.currentTarget.removeAttribute("data-keyboard")}
    >
      Skip to content
    </a>
  );
}
