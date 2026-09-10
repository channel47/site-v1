"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CopyButton } from "./copy-button";

/** Place immediately after the server-rendered prose. The local anchor scopes
 * portals to this article, including when Next keeps another route cached. */
export function CodeCopyButtons() {
  const anchor = useRef<HTMLSpanElement>(null);
  const [blocks, setBlocks] = useState<{ target: Element; text: string; title: string }[]>([]);

  useEffect(() => {
    const prose = anchor.current?.previousElementSibling;
    setBlocks(Array.from(prose?.querySelectorAll(".code-copy") ?? []).flatMap((target) => {
      const code = target.previousElementSibling?.querySelector("code");
      if (!code) return [];
      return [{
        target,
        text: code.textContent?.replace(/\n$/, "") ?? "",
        title: code.classList.contains("language-text") ? "Copy prompt" : "Copy code",
      }];
    }));
  }, []);

  return (
    <>
      <span ref={anchor} hidden />
      {blocks.map(({ target, text, title }, index) =>
        createPortal(<CopyButton text={text} title={title} />, target, String(index)),
      )}
    </>
  );
}
