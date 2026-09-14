"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowsOut } from "@phosphor-icons/react";
import type { ToolPreview } from "@/lib/tools";

export function ToolGallery({ id, name, previews, preload = false }: {
  id: string;
  name: string;
  previews: readonly [ToolPreview, ...ToolPreview[]];
  preload?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % previews.length
      : event.key === "ArrowLeft" ? (index - 1 + previews.length) % previews.length
      : event.key === "Home" ? 0
      : event.key === "End" ? previews.length - 1 : undefined;
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="tool-gallery">
      <div className="tool-gallery-screen">
        {previews.map((preview, index) => (
          <div
            className="tool-gallery-panel"
            key={preview.src}
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            hidden={selected !== index}
            tabIndex={0}
          >
            <Image
              src={preview.src}
              alt={preview.alt}
              width={preview.width}
              height={preview.height}
              sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1440px) 65vw, 912px"
              preload={preload && index === 0}
              loading={preload && index > 0 ? "eager" : undefined}
            />
          </div>
        ))}
      </div>
      <div className="tool-gallery-controls">
        <div className="tool-gallery-tabs" role="tablist" aria-label={`${name} preview`}>
          {previews.map((preview, index) => (
            <button
              type="button"
              key={preview.src}
              ref={(node) => { tabs.current[index] = node; }}
              id={`${id}-tab-${index}`}
              role="tab"
              aria-controls={`${id}-panel-${index}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => move(event, index)}
            >
              {preview.label}
            </button>
          ))}
        </div>
        <a
          className="icon-btn utility-link tool-gallery-expand"
          href={previews[selected].src}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${name}: ${previews[selected].label} full size (opens in a new tab)`}
        >
          <ArrowsOut size={18} aria-hidden="true" />
          <span className="control-caption" aria-hidden="true">View full size</span>
        </a>
      </div>
    </div>
  );
}
