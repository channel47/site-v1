"use client";
import { useCallback, useRef, useState } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { GlitchLogo } from "./glitch-logo";
import { MarkLink } from "./mark-link";
import { NavigationTakeover } from "./navigation-takeover";

export function SiteHeader({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const keyboard = useRef(false);
  const dismiss = useCallback(() => {
    setOpen(false);
    if (keyboard.current) trigger.current?.focus({ preventScroll: true });
  }, []);
  return (
    <header className="site-header">
      {home ? <GlitchLogo /> : <MarkLink />}
      <button
        ref={trigger}
        type="button"
        className="icon-btn menu-trigger"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-controls={open ? "site-navigation" : undefined}
        aria-expanded={open}
        onClick={(event) => {
          keyboard.current = event.detail === 0;
          setOpen(true);
        }}
      >
        <DotsThree size={28} weight="bold" />
      </button>
      {open ? <NavigationTakeover onDismiss={dismiss} keyboard={keyboard.current} /> : null}
    </header>
  );
}
