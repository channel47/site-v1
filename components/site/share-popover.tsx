"use client";

import { ShareNetwork } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { ShareActions, type ShareProps } from "./share-actions";

export function SharePopover(props: ShareProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  function close() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="article-share" ref={root} onBlur={event => {
      // Opening a share tab or a clipboard prompt can move focus out of the document.
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button className="icon-btn share-trigger" type="button" ref={trigger} aria-expanded={open} aria-controls={id} onClick={() => {
        setOpen(!open);
      }}>
        <ShareNetwork size={18} aria-hidden="true" />
        <span>Share</span>
      </button>
      <div className="share-popover" id={id} data-open={open} inert={!open} aria-hidden={!open} role="group" aria-label="Share this article">
        <ShareActions {...props} />
      </div>
    </div>
  );
}
