"use client";
import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import type { CollectionItem } from "@/lib/collection";
import { BrowseEntryLink } from "./browse-navigation";

export function Collection({ items }: { items: CollectionItem[] }) {
  return (
    <ul className="collection-grid">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="collection-object"
          style={
            {
              "--object-angle": `${item.angle}deg`,
              "--arrival-delay": `${Math.min(index, 4) * 90}ms`,
            } as CSSProperties
          }
        >
          <BrowseEntryLink
            href={item.href}
            className="collection-link"
            aria-label={`${item.title} — ${item.label}`}
          >
            <div className="collection-space">
              <div className="collection-art">
                <img
                  src={item.src}
                  srcSet={item.srcSet}
                  sizes="(max-width: 720px) 46vw, 440px"
                  width={960}
                  height={960}
                  alt=""
                  draggable={false}
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>
            </div>
            <span className="collection-caption" aria-hidden="true">
              <span>
                {item.title}
                <ArrowRight size={16} aria-hidden="true" />
              </span>
              <small>{item.label}</small>
            </span>
          </BrowseEntryLink>
        </li>
      ))}
    </ul>
  );
}
