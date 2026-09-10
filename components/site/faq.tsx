"use client";

import { Plus } from "@phosphor-icons/react";
import { useId, useState } from "react";
import type { FaqItem } from "@/lib/content";

/** One answer open at a time; closed answers stay out of keyboard navigation. */
export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section className="faq" aria-label="Common questions">
      <h2 className="faq-h2">Common questions</h2>
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${id}-${index}`;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{item.q}</span>
              <Plus className="faq-plus" size={18} aria-hidden="true" />
            </button>
            <div id={panelId} className="faq-panel" data-open={open} inert={!open} aria-hidden={!open}>
              <div><p className="faq-a">{item.a}</p></div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
