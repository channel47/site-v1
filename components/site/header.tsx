"use client";
import { useCallback, useRef, useState } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { GlitchLogo } from "./glitch-logo";
import { MarkLink } from "./mark-link";
import { NavigationTakeover } from "./navigation-takeover";

export function SiteHeader({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dismiss = useCallback(() => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);
  return (
    <header className="site-header">
      {home ? <GlitchLogo autoPlay /> : <MarkLink />}
      <button
        ref={trigger}
        type="button"
        className="icon-btn menu-trigger"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-controls={open ? "site-navigation" : undefined}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <DotsThree size={28} weight="bold" />
      </button>
      {open ? <NavigationTakeover onDismiss={dismiss} /> : null}
    </header>
  );
}
