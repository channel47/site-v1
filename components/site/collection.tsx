"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import type { CollectionItem } from "@/lib/collection";
import { BrowseEntryLink } from "./browse-navigation";

export function Collection({ items }: { items: CollectionItem[] }) {
  const grid = useRef<HTMLUListElement>(null);
  const [centered, setCentered] = useState<number | null>(null);

  useEffect(() => {
    const media = matchMedia("(max-width: 520px) and (hover: none) and (pointer: coarse) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!media.matches || !grid.current) return;
      const midpoint = window.innerHeight / 2;
      let nearest: number | null = null;
      let distance = window.innerHeight * 0.45;
      Array.from(grid.current.children).forEach((card, index) => {
        const bounds = card.getBoundingClientRect();
        const delta = Math.abs(bounds.top + bounds.height / 2 - midpoint);
        if (delta < distance) {
          nearest = index;
          distance = delta;
        }
      });
      setCentered(nearest);
    };
    const schedule = () => {
      if (media.matches && !frame) frame = requestAnimationFrame(update);
    };
    const preference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (media.matches) schedule();
      else setCentered(null);
    };
    // A scroll-driven spotlight leaves every card a normal, single-tap link.
    const observer = new ResizeObserver(schedule);
    if (grid.current) observer.observe(grid.current);
    media.addEventListener("change", preference);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", preference);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items.length]);

  if (!items.length) return null;
  return (
    <section className="collection" aria-label="Projects and experiments">
      <ul
        ref={grid}
        id="collection-track"
        className="collection-grid"
        aria-label="Explore the collection"
        data-spotlight={centered !== null ? "true" : undefined}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="collection-object"
            data-centered={centered === index ? "true" : undefined}
            style={
              {
                "--object-silhouette": item.silhouette,
              } as CSSProperties
            }
          >
            <BrowseEntryLink
              href={item.href}
              className="collection-link"
              aria-label={`${item.title} — ${item.label}`}
            >
              <div className="collection-piece">
                <div className="collection-space">
                  <div className="collection-art">
                    <img
                      src={item.src}
                      srcSet={item.srcSet}
                      sizes="(max-width: 520px) calc(100vw - 48px), (max-width: 960px) 46vw, (max-width: 1260px) 30vw, 364px"
                      width={960}
                      height={960}
                      alt=""
                      draggable={false}
                      loading={index < 3 ? "eager" : "lazy"}
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
              </div>
            </BrowseEntryLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
