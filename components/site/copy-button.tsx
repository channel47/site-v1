"use client";

import { Check, Copy, LinkSimple, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { measure } from "./measurement";

type CopyState = "idle" | "copied" | "failed";
type CopyButtonProps = {
  event?: "install_copy" | "page_copy" | "link_copy" | "prompt_copy" | "code_copy";
  title: string;
  label?: string;
  glyph?: "copy" | "link";
} & (
  | { text: string; fetchPath?: never }
  | { fetchPath: string; text?: never }
);

/** Literal text or a Markdown twin; report and measure only real copy results. */
export function CopyButton({ event, text, fetchPath, title, label, glyph = "copy" }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(reset.current), []);

  async function copy() {
    try {
      let value = text;
      if (fetchPath) {
        const response = await fetch(fetchPath);
        if (!response.ok) throw new Error(`Copy request failed: ${response.status}`);
        value = await response.text();
      }
      await navigator.clipboard.writeText(value!);
      setState("copied");
      if (event) measure(event);
    } catch {
      setState("failed");
    }
    clearTimeout(reset.current);
    reset.current = setTimeout(() => setState("idle"), 2000);
  }

  let Icon = glyph === "link" ? LinkSimple : Copy;
  let caption = label;
  let accessibleName = label ?? title;
  if (state === "copied") {
    Icon = Check;
    caption = "Copied";
    accessibleName = "Copied";
  } else if (state === "failed") {
    Icon = WarningCircle;
    caption = "Try again";
    accessibleName = "Couldn’t copy. Try again.";
  }

  return (
    <button
      type="button"
      className={`icon-btn${label ? " copy-label" : ""}`}
      onClick={copy}
      title={title}
      data-state={state}
      aria-label={accessibleName}
      aria-live="polite"
    >
      <Icon size={18} aria-hidden="true" />
      {label ? caption : null}
    </button>
  );
}
